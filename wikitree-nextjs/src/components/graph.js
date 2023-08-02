import { ForceGraph2D } from 'react-force-graph';

const ORIGIN_NODE_FONT_SIZE = 30;
const ORIGIN_NODE_COLOR = '#1474a0';
const SELECTED_NODE_COLOR = '#AF5D63';
const NON_SELECTED_NODE_COLOR = 'rgba(69, 179, 231, 1)';
const FONT_TYPE = 'Sans-Serif';
const DEFAULT_MIN_NODE_SIZE = 3;
const DEFAULT_MAX_NODE_SIZE = 30;
const STROKE_COLOR = 'rgba(0, 0, 0, 0.1)';
const LABEL_COLOR_SELECTED_NODE = 'black';
const LABEL_COLOR_NON_SELECTED_NODE = 'black';
const DEFAULT_MIN_OPACITY = 0.1;
const LINK_DIVISOR = 1000;
const LINK_OFFSET = 10;
const LABEL_DISPLAY_THRESHOLD = 10;

function Graph({ graphData, minNodeSize, selectedNode, setSelectedNode }) {
    return (
        <ForceGraph2D
            graphData={graphData}
            nodeVal={node => Math.max(node.degree, minNodeSize)}
            linkColor={link => link.source === selectedNode || link.target === selectedNode ? SELECTED_NODE_COLOR : `rgba(0, 0, 0, ${Math.max(DEFAULT_MIN_OPACITY, 1 / (graphData.links.length / LINK_DIVISOR + LINK_OFFSET))})`}
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = node.isOrigin ? (ORIGIN_NODE_FONT_SIZE / globalScale) : Math.min(DEFAULT_MAX_NODE_SIZE, Math.max(DEFAULT_MIN_NODE_SIZE, node.degree / globalScale));
                ctx.font = `${fontSize}px ${FONT_TYPE}`;
                const color = node === selectedNode ? SELECTED_NODE_COLOR : NON_SELECTED_NODE_COLOR;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, Math.max(node.degree, minNodeSize), 0, 4 * Math.PI, false);
                ctx.fill();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.isOrigin ? ORIGIN_NODE_COLOR : (node === selectedNode ? LABEL_COLOR_SELECTED_NODE : LABEL_COLOR_NON_SELECTED_NODE);
                if (node.isOrigin || node === selectedNode || globalScale > LABEL_DISPLAY_THRESHOLD / Math.max(node.degree, minNodeSize)) {
                    ctx.fillText(label, node.x, node.y);
                }
                if (node.isOrigin) {
                    ctx.strokeStyle = STROKE_COLOR;
                    ctx.lineWidth = 1;
                    ctx.strokeText(label, node.x, node.y);
                }
            }}
            onNodeClick={node => setSelectedNode(node)}
            onBackgroundClick={() => setSelectedNode(null)}
        />
    );
}

export default Graph;
