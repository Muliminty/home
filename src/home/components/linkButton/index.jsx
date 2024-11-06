// import './style.scss'
// const LinkButton = ({ text = 'link', onClick, ...props }) => {
//   return <p className='linkButton' onClick={onClick}>
//     <a href="#">
//       {text}
//       <svg viewBox="0 0 70 36">
//         <path d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527" />
//       </svg>
//     </a>
//   </p>

// };

// export default LinkButton;



import { useState, useEffect, useRef } from 'react';
import './style.scss';

const LinkButton = ({ text = 'link', onClick, ...props }) => {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  // 获取文本的宽度
  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.getBoundingClientRect().width;
      setTextWidth(width);
    }
  }, [text]);

  // 动态计算 SVG 的宽度，确保根据文本宽度调整路径
  const svgWidth = textWidth; // 文本宽度加上额外的边距
  const strokeWidth = Math.max(2, svgWidth / 35);  // 动态调整 stroke-width，保证线条不过粗

  return (
    <p className="linkButton" onClick={onClick} {...props}>
      <a href="#">
        <span ref={textRef}>
          {text}
        </span>
        <svg viewBox={`0 0 ${svgWidth} 36`} width={svgWidth} height="36">
          <path
            d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527"
            strokeWidth={strokeWidth}  // 使用动态计算的 stroke-width
            fill="none"
            stroke="var(--stroke, var(--line))"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </p>
  );
};

export default LinkButton;
