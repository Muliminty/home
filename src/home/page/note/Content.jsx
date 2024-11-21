// import { useState, useEffect } from "react";
// import { MarkdownRenderer } from "../../components/ReactMarkdown";
// import styles from './style.module.scss';
// import { Header } from "./Header";
// import { Skeleton } from 'antd';

// const Loading = ({ style }) => (
//   <div style={style}>
//     {[...Array(7)].map((_, i) => (
//       <div key={i}>
//         <Skeleton active />
//         <br />
//       </div>
//     ))}
//   </div>
// );

// export const Content = ({ data, handleGoHome, fetchFileContent, loading, toggleDrawer, searchClick }) => {
//   const [renderKey, setRenderKey] = useState(0);

//   // 每次 data 变化时增加 key 来强制重新渲染组件
//   useEffect(() => {
//     setRenderKey(prevKey => prevKey + 1); // 增加 key 值，强制重新渲染
//   }, [data]);

//   return (
//     <div className={`${styles['content_box']} container`}>
//       <Header onGoHome={handleGoHome} fetchFileContent={fetchFileContent} searchClick={searchClick} />

//       <div className={styles['toggle-drawer']}>
//         <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>menu</span>
//       </div>

//       {loading ? (
//         <Loading style={{ width: '100%', height: "80vh", padding: '24px', overflow: 'hidden' }} />
//       ) : (
//         <div className={`${styles['content']} `}>
//           {data ? (
//             <div
//               key={renderKey} // 每次 data 变化时，重新生成不同的 key
//               className={styles['animation']}
//             >
//               {data !== '## 选择你感兴趣的内容吧' && <img
//                 style={{ width: '100%', height: '200px', objectFit: 'cover' }
//                 }
//                 src="https://bing.img.run/uhd.php"
//                 alt="随机获取Bing历史壁纸1080P高清" />}
//               {/* <img src="https://bing.img.run/uhd.php" alt="Bing每日壁纸UHD超高清原图" />
//               <img src="https://bing.img.run/1920x1080.php" alt="Bing每日壁纸1080P高清" />
//               <img src="https://bing.img.run/1366x768.php" alt="Bing每日壁纸普清" />
//               <img src="https://bing.img.run/m.php" alt="Bing每日壁纸手机版1080P高清" /> */}
//               <MarkdownRenderer data={data} showImg={data !== '选择你感兴趣的内容吧'} />
//             </div>
//           ) : (
//             <div>暂无数据</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { MarkdownRenderer } from "../../components/ReactMarkdown";
import styles from './style.module.scss';
import { Header } from "./Header";
import { Skeleton } from 'antd';

const Loading = ({ style }) => (
  <div style={style}>
    {[...Array(7)].map((_, i) => (
      <div key={i}>
        <Skeleton active />
        <br />
      </div>
    ))}
  </div>
);

export const Content = ({ data, handleGoHome, fetchFileContent, loading, toggleDrawer, searchClick }) => {
  const [renderKey, setRenderKey] = useState(0);
  const [imageSrc, setImageSrc] = useState("https://bing.img.run/rand_uhd.php");

  // 每次 data 变化时增加 key 来强制重新渲染组件
  useEffect(() => {
    setRenderKey(prevKey => prevKey + 1); // 增加 key 值，强制重新渲染
    // 使用时间戳或随机数来刷新图片，避免缓存
    setImageSrc(`https://bing.img.run/uhd.php?timestamp=${new Date().getTime()}`);
  }, [data]);

  return (
    <div className={`${styles['content_box']} container`}>
      <Header onGoHome={handleGoHome} fetchFileContent={fetchFileContent} searchClick={searchClick} />

      <div className={styles['toggle-drawer']}>
        <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>menu</span>
      </div>

      {loading ? (
        <Loading style={{ width: '100%', height: "80vh", padding: '24px', overflow: 'hidden' }} />
      ) : (
        <div className={`${styles['content']} `}>
          {data ? (
            <div key={renderKey} className={styles['animation']}>
              {data !== '## 选择你感兴趣的内容吧' && (
                <img
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  src={imageSrc} // 使用动态的 imageSrc
                  alt="随机获取Bing历史壁纸1080P高清"
                />
              )}
              <MarkdownRenderer data={data} showImg={data !== '选择你感兴趣的内容吧'} />
            </div>
          ) : (
            <div>暂无数据</div>
          )}
        </div>
      )}
    </div>
  );
};
