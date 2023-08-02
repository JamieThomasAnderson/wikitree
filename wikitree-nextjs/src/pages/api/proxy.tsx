// pages/api/proxy.ts

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const term = req.query.term as string;

  try {
    const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}`);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to Parse');
  }
}

export default handler;
