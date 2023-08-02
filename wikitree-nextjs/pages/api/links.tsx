import axios, { CancelTokenSource } from 'axios';
import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';

const SUBLINKS = 35;
const ORIGINLINKS = 100;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url = req.query.url as string;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL Parameter' });
    }

    let cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    let cancelled = false;

    req.on('close', () => {
        cancelTokenSource.cancel('Request closed.');
        cancelled = true;
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let allLinks: Array<object> = [];
    let activeRequests = 0;

    // depth-first link parsing
    async function getLinkStructure(originLink: string, depth: number, tokenSource: CancelTokenSource) {
        if(cancelled) return;
        if(originLink.includes('#')) return;
        try {
            activeRequests++;
            await new Promise(resolve => setTimeout(resolve, 1));

            const response = await axios.get(originLink, { timeout: 5000, cancelToken: tokenSource.token });
            const $ = cheerio.load(response.data);
            const links: Array<string> = [];

            let sublinkCounter = 0;

            $('p > a').each((i, link) => {
                if (i < ORIGINLINKS || depth > 0) {
                    const href = link.attribs.href;

                    if(href.includes('#')) return;

                    if (sublinkCounter >= SUBLINKS) return;

                    allLinks.push({
                        originLink: originLink,
                        childLink: "https://en.wikipedia.org" + href,
                        dateTimeRetrieved: new Date()
                    });

                    links.push("https://en.wikipedia.org" + href);
                    sublinkCounter++;
                }
            });

            res.write(`data: ${JSON.stringify({ allLinks })}\n\n`);

            if (depth > 0) {
                await Promise.all(links.map(link => getLinkStructure(link, depth - 1, tokenSource)));
            }
        }
        catch(error) {
            if (axios.isCancel(error)) {
                console.log('Request Cancel');
                return;
            }
            console.error('Failed to Parse');
        }
        finally {
            activeRequests--;
            if (activeRequests === 0) {
                console.log("done");
                res.write(`event: done\ndata: done\n\n`);
                res.end();
            }
        }
    }

    await getLinkStructure(url, 1, cancelTokenSource);
};
