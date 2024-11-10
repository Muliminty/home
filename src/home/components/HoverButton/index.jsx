import React from 'react';
import './HoverButton.scss';  // 引入样式文件

const HoverButton = ({ text = "Hover me :)", ...props }) => {
  return (
    <button className="hover-button" {...props} onClick={() => {

      window.open(props.href, '_blank');
    }}>
      {text}
    </button>
  );
};

export default HoverButton;
