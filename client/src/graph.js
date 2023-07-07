import { ForceGraph2D } from 'react-force-graph';

function Graph({ graphData, minNodeSize, selectedNode, setSelectedNode }) {
    return (
        <ForceGraph2D
            graphData={graphData}
            nodeVal={node => Math.max(node.degree, minNodeSize)}
            linkColor={link => link.source === selectedNode || link.target === selectedNode ? '#AF5D63' : `rgba(0, 0, 0, ${Math.max(0.1, 1 / (graphData.links.length / 1000 + 10))})`}
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = node.isOrigin ? (30 / globalScale) : Math.min(30, Math.max(3, node.degree / globalScale));
                ctx.font = `${fontSize}px Sans-Serif`;
                const color = node === selectedNode ? '#AF5D63' : 'rgba(69, 179, 231, 1)';
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, Math.max(node.degree, minNodeSize), 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.isOrigin ? '#1474a0' : (node === selectedNode ? 'black' : 'black');
                if (node.isOrigin || node === selectedNode || globalScale > 20 / Math.max(node.degree, minNodeSize)) {
                    ctx.fillText(label, node.x, node.y);
                }
                if (node.isOrigin) {
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.lineWidth = 5;
                    ctx.strokeText(label, node.x, node.y);
                }
            }}
            onNodeClick={node => setSelectedNode(node)}
            onBackgroundClick={() => setSelectedNode(null)}
        />
    );
}

export default Graph;