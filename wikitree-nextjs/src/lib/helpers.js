function updateGraphData(data, url) {
    return prevGraphData => {
        const nodes = [...prevGraphData.nodes];
        const links = [...prevGraphData.links];
        const seenNodes = new Map(nodes.map(node => [node.id, node]));
        const seenLinks = new Set(links.map(link => `${link.source.id}-${link.target.id}`));

        data.allLinks.forEach(link => {
            let { originNode, childNode } = processNodes(seenNodes, link, url);
            processLinks(seenLinks, links, originNode, childNode);
        });

        return { nodes: Array.from(seenNodes.values()), links: links};
    };
}

function processNodes(seenNodes, link, url) {
    let originNode = seenNodes.get(link.originLink);
    let childNode = seenNodes.get(link.childLink);
    
    if (!originNode) {
        originNode = { id: link.originLink, name: formatTitle(link.originLink), degree: 0, isOrigin: formatTitle(link.originLink) === formatTitle(url) };
        seenNodes.set(link.originLink, originNode);
    }

    if (!childNode) {
        childNode = { id: link.childLink, name: formatTitle(link.childLink), degree: 0 };
        seenNodes.set(link.childLink, childNode);
    }

    return { originNode, childNode };
}

function processLinks(seenLinks, links, originNode, childNode) {
    if (!seenLinks.has(`${originNode.id}-${childNode.id}`)) {
        links.push({ source: originNode, target: childNode });
        seenLinks.add(`${originNode.id}-${childNode.id}`);
        originNode.degree += 0.02;
        childNode.degree += 0.02;
    }
}

function pruneGraphData(cullingCutoff) { // Remove unary nodes
    return prevGraphData => {

        // if (!prevGraphData) {
        //     return {nodes: [], links: []}
        // };

        const nodeConnections = new Map();
        prevGraphData.links.forEach(link => {
            nodeConnections.set(link.source, (nodeConnections.get(link.source) || 0) + 1);
            nodeConnections.set(link.target, (nodeConnections.get(link.target) || 0) + 1);
        });

        const nodes = prevGraphData.nodes.filter(node => nodeConnections.get(node) > cullingCutoff);
        const links = prevGraphData.links.filter(link => nodeConnections.get(link.source) > cullingCutoff && nodeConnections.get(link.target) > cullingCutoff);

        return { nodes, links };
    };
}

export function fetchData(url, setGraphData, cullingCutoff) {
    const eventSource = new EventSource(`/api/links?url=${url}`);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setGraphData(prevGraphData => {
            const newGraphData = updateGraphData(data, url)(prevGraphData);
            return newGraphData;
        });
    };

    eventSource.addEventListener('done', () => {
        eventSource.close();
        console.log("done");
        setGraphData(prevGraphData => {
            const prunedGraphData = pruneGraphData(cullingCutoff)(prevGraphData);
            return prunedGraphData;
        });
    });

    
};



export function clearData(setGraphData, setSelectedNode) {
    setGraphData({ nodes: [], links: [] });
    setSelectedNode(null);
};

export function formatTitle(url) {
    const title = decodeURIComponent(url.split('/').pop().split('_').join(' '));
    return title;
};