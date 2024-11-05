// import React, { useState } from 'react';

// const NotionImageRenderer = ({ alt = 'Image', src }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <>
//       <div style={{ textAlign: 'center', margin: '20px 0' }}>
//         <img
//           src={src}
//           alt={alt}
//           onClick={openModal}
//           style={{
//             maxWidth: '100%',
//             borderRadius: '8px',
//             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//             cursor: 'pointer',
//           }}
//         />
//         {alt && <p style={{ fontStyle: 'italic', color: '#6c757d' }}>{alt}</p>}
//       </div>

//       {isModalOpen && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.8)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//           onClick={closeModal}
//         >
//           <div
//             style={{
//               position: 'relative',
//               maxWidth: '90%',
//               maxHeight: '90%',
//               backgroundColor: 'white',
//               borderRadius: '8px',
//               overflow: 'hidden',
//             }}
//             onClick={e => e.stopPropagation()}
//           >
//             <img
//               src={src}
//               alt={alt}
//               style={{
//                 width: '100%', // 改为100%以避免溢出
//                 height: 'auto',
//               }}
//             />
//             <button
//               onClick={closeModal}
//               style={{
//                 position: 'absolute',
//                 top: '10px',
//                 right: '10px',
//                 background: 'rgba(0, 0, 0, 0.5)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '50%',
//                 width: '30px',
//                 height: '30px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 fontSize: '20px',
//               }}
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default NotionImageRenderer;
import { PhotoProvider, PhotoView } from 'react-photo-view';


const NotionImageRenderer = ({ alt = 'Image', src }) => {
  return <PhotoProvider>
    <PhotoView src={src}>
      <img src={src} alt={alt} />
    </PhotoView>
  </PhotoProvider>
}

export default NotionImageRenderer;