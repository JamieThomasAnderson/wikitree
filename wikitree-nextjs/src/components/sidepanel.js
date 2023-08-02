'use client'

import WikipediaIframe from './wikiframe'
import axios from 'axios'
import { useState, useEffect } from 'react'

function SidePanel({ url, setUrl, fetchData, setGraphData, cullingCutoff, clearData, setSelectedNode, selectedNode, graphData }) {

    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (url.length > 2) {
            axios.get(`/api/proxy?term=${url}`)
                .then((response) => {
                    setSuggestions(response.data[1]);
                });
        }
        else {
            setSuggestions([]);
        }
    }, [url]); 


    return (
        <div className="input-container">
            <div className="flex justify-center w-screen relative pt-4 mb-10">
                <div className="flex space-x-2 items-center">
                    <div className="relative w-[500px]">
                        <div className="absolute left-3 top-2 text-sm text-gray-600 bg-gray-200 px-1 rounded">https://en.wikipedia.org/wiki/</div>
                        <input
                            className="shadow appearance-none border rounded py-2 px-4 pl-[213px] text-grey-darker leading-tight focus:outline-none focus:shadow-outline z-50 w-full"
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Enter Page"
                        />
                        {isFocused && <div className="absolute left-0 mt-1 w-full">
                            {suggestions.map((suggestion, index) => {

                                return (
                                    <div
                                        key={index}
                                        className="border-t border-gray-200 first:border-t-0 p-1 cursor-pointer bg-neutral-100 hover:bg-neutral-50 opacity-80 rounded"
                                        onMouseDown={() => {
                                            setUrl(suggestion);
                                            setIsFocused(false);
                                        }}
                                    >
                                        {suggestion}
                                    </div>
                                )
                            })}
                        </div>}
                    </div>
                    <button
                        className="bg-gray-200 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => fetchData('https://en.wikipedia.org/wiki/' + url, setGraphData, cullingCutoff)}
                    >
                        <img src="/search.jpg" width="20" height="20" />
                    </button>
                </div>
            </div>


            <div
                className={`h-screen absolute top-0 bottom-0 right-0 overflow-hidden transition-width duration-500 ease-in-out ${selectedNode ? 'w-3/8' : 'w-0'
                    }`}
            >
                <div className="bg-neutral-100 shadow-md px-2 pt-2 pb-2 mb-2 h-full">
                    <WikipediaIframe url={selectedNode ? selectedNode.id : ""} className="rounded-lg" />
                </div>
            </div>

            <div className='fixed bottom-0 m-4 flex flex-col-reverse'>
                <button
                    className="bg-red-200 hover:bg-red-700 text-white font-bold shadow-lg py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
                    onClick={() => clearData(setGraphData, setSelectedNode)}
                >
                    🗑
                </button>
                {selectedNode && <button
                    onClick={() => setSelectedNode(null)}
                    className="absolute bottom-14  m-2 p-1 bg-neutral-100 rounded-full shadow-lg text-black hover:bg-neutral-200 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>}
                {/* {selectedNode && <button // ADD BUTTON TO DOWNLOAD & IMPORT GRAPH DATA
                    onClick={() => setSelectedNode(null)}
                    className="absolute bottom-100px left-0 m-2 p-1 bg-neutral-100 rounded-full shadow-lg text-black hover:bg-neutral-200 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>} */}
            </div>
        </div>
    );
}

export default SidePanel;