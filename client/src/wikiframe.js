import Iframe from 'react-iframe';
import './App.css';


const WikipediaIframe = ({ url }) => {
    return (
      <Iframe className='iframeWiki'
        url={url}
        width="100%"
        height="800"
        display="initial"
        position="relative"
        allowFullScreen
        styles={{border: 0}}
      />
    );
};
export default WikipediaIframe;