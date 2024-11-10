import React from 'react';
import './GlitchLoader.scss'; // 引入样式文件

const GlitchLoader = ({ text }) => {
  return (
    <div className="loader">
      <div data-glitch={text} className="glitch">
        {text}
      </div>
    </div>
  );
};

export default GlitchLoader;
