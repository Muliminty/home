import ThemeSwitcher from '@/components/theme-switcher/index';
import { searchMarkdownFilesByName } from '@/home/api/github2';
import Loading from '@/home/components/Loading';
import Modal from "@/home/components/modal";
import { useState } from "react";
import { MarkdownRenderer } from "../../components/ReactMarkdown";
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import styles from './style.module.scss';

/**
 * Header 组件，包含标题和主题切换器。
 * @param {Object} props - 组件属性。
 * @param {Function} props.onGoHome - 回到根路由的函数。
 */
export const Header = ({ fetchFileContent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState(''); // 关键字状态
  const [searchResults, setSearchResults] = useState([]); // 搜索结果状态
  const [loading, setLoading] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate(); // 获取 navigate 函数


  // 处理输入框的变化
  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleGoHome = () => {
    navigate('/');
  };
  // 执行搜索
  const handleSearch = async () => {
    if (keyword.trim()) {
      setLoading(true);
      setSearchResults([]);
      // 执行文件搜索
      const results = await searchMarkdownFilesByName(keyword);
      setSearchResults(results.files || []);
      setLoading(false);
    }
  };

  return (
    <div className={styles['header']}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 onClick={handleGoHome} style={{ cursor: 'pointer', marginRight: '10px' }}>
          Muliminty
        </h3>

        <a style={{ cursor: 'pointer', marginRight: '10px' }} onClick={openModal}>搜索文章</a>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          {/* 输入框 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={keyword}
              onChange={handleInputChange}
              placeholder="请输入搜索关键词" />
            <a onClick={handleSearch} style={{ width: '100px', marginLeft: '10px', cursor: 'pointer' }}>开始搜索</a>
          </div>

          <div>
            {loading ? <Loading style={{ width: '98%', height: "300px", transform: 'scale(0.5)' }} /> :
              <>
                {/* 搜索结果列表  */}
                {searchResults.length > 0 ? (
                  <ul className={styles['search-results']}>
                    {searchResults.map((fileInfo, index) => {
                      if (fileInfo.extension !== 'md') {
                        return <></>;
                      }
                      return (

                        <li key={index} className={styles['search-item']} onClick={async () => {
                          console.log('fileInfo: ', fileInfo);
                          await fetchFileContent({ ...fileInfo });
                          closeModal();
                        }}>
                          <h4 className="file-name">
                            {fileInfo.name}
                          </h4>

                          {fileInfo.excerpt && <div className={styles['file-excerpt']}>
                            <MarkdownRenderer data={fileInfo.excerpt} />
                          </div>}

                          <p className="file-size">大小: {fileInfo.size}</p>
                          <p className="file-modified">最后修改时间: {fileInfo.mtime}</p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className={styles['no-results']}>没有找到匹配的文件。</p>
                )}</>}

          </div>

        </div>
      </Modal>

      <ThemeSwitcher />
    </div>
  );
};
