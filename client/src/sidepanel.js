import { InputGroup, Button, Card } from 'react-bootstrap';
import { Input } from 'reactstrap';
import WikipediaIframe from './wikiframe'
import './App.css';

function SidePanel({ url, setUrl, fetchData, setGraphData, cullingCutoff, clearData, setSelectedNode, selectedNode }) {
    return (
        <>
            <div className="input-container">
            <InputGroup>
                <Input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="Enter URL"
                />
                <Button onClick={() => fetchData(url, setGraphData, cullingCutoff)}>Add</Button>
            </InputGroup>
            </div>
            <div className="iframe-container">
                <Card>
                    {selectedNode && <WikipediaIframe url={selectedNode.id} />}
                </Card>
            </div>

            <div className='config'>
                <Button variant='danger' onClick={() => clearData(setGraphData, setSelectedNode)}>🗑</Button>
                
            </div>
        </>
    );
}

export default SidePanel;