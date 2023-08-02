import Iframe from 'react-iframe';


const WikipediaIframe = ({ url }) => {
  return (
    <Iframe className='iframeWiki'
      url={url}
      width="100%"
      height="100%"
      display="initial"
      position="relative"
      overflow='hide'
      allowFullScreen
      styles={{ border: 0 }}
    />
  );
};
export default WikipediaIframe;