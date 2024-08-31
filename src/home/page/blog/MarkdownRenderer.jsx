import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NotionImageRenderer from './NotionImageRenderer'


const MarkdownRenderer = ({ path }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(path)  // 从 public 目录加载文件
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => setContent(text))
      .catch(error => console.error('Error loading markdown file:', error));
  }, [path]);

  return <ReactMarkdown
    children={content}
    remarkPlugins={[remarkGfm]}

    components={{
      img: (props) => <NotionImageRenderer {...props} />,
    }} />;
};

export default MarkdownRenderer;
