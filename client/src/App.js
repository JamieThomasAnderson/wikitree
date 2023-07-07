import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Graph from './graph';
import { fetchData, clearData } from './helper';
import SidePanel from './sidepanel';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Cerussite');
  const [cullingCutoff, setCullingCutoff] = useState(1);
  const [minNodeSize, setMinNodeSize] = useState(3);
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <SidePanel 
            url={url} 
            setUrl={setUrl} 
            fetchData={fetchData} 
            setGraphData={setGraphData} 
            cullingCutoff={cullingCutoff} 
            clearData={clearData} 
            setSelectedNode={setSelectedNode} 
            selectedNode={selectedNode} 
          />
        <div className="graph-container">
          <Graph
            graphData={graphData}
            minNodeSize={minNodeSize}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
