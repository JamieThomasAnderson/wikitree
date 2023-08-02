'use client'

import React, { useState, useEffect } from 'react';
import SidePanel from '../components/sidepanel';
import { fetchData, clearData } from '../lib/helpers';

import dynamic from 'next/dynamic'

const DynamicGraphComponent = dynamic(
  () => import('../components/graph'),
  { ssr: false }  // This line will load the component only on client side
)


export default function Home() {

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [url, setUrl] = useState('Cerussite');
  const [cullingCutoff, setCullingCutoff] = useState(1);
  const [minNodeSize, setMinNodeSize] = useState(3);
  const [selectedNode, setSelectedNode] = useState(null);
  const [displayNotification, setDisplayNotification] = useState(false);
  const [notificationTriggered, setNotificationTriggered] = useState(false);

  useEffect(() => {
    if (graphData.nodes.length > 1000) {
      setDisplayNotification(true);
      setNotificationTriggered(true);
    }
  }, [graphData.nodes.length, notificationTriggered]);
  // React.useEffect(() => {
  //   console.log(graphData);  // Will print the updated graphData
  // }, [graphData]);  // Runs whenever graphData changes

  return (
    <main className="">
      <SidePanel
        url={url}
        setUrl={setUrl}
        fetchData={fetchData}
        setGraphData={setGraphData}
        cullingCutoff={cullingCutoff}
        clearData={clearData}
        setSelectedNode={setSelectedNode}
        selectedNode={selectedNode}
        graphData={graphData}
      />

      <div className="graph-container">
        <DynamicGraphComponent
          graphData={graphData}
          minNodeSize={minNodeSize}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      </div>

      {displayNotification && <div className="fixed inset-x-0 top-0 z-50 flex left-0 p-4">
        <div className="max-w-sm bg-red-200 rounded-lg shadow-md flex items-start justify-between space-x-4">
          <div className="p-4">
            <div className="font-semibold text-gray-800">Attention!</div>
            <div className="text-sm text-gray-600">Please note that generating larger graphs can lead to performance issues or lag.</div>
          </div>
          <button className="p-1 hover:bg-gray-200 rounded-lg" onClick={() => setDisplayNotification(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>}

    </main>
  )
}
