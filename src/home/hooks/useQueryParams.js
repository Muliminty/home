import { useEffect, useState } from 'react';

/**
 * 自定义 Hook，用于获取当前页面的 URL 查询参数。
 *
 * @returns {Object} 包含当前 URL 查询参数的键值对对象。
 *
 * @example
 * const MyComponent = () => {
 *   const queryParams = useQueryParams();
 *
 *   return (
 *     <div>
 *       <p>Search Term: {queryParams.search}</p>
 *       <p>Page: {queryParams.page}</p>
 *     </div>
 *   );
 * };
 */
const useQueryParams = () => {
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const url = new URL(window.location);
    const params = {};

    // 获取 URL 查询参数
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setQueryParams(params);
  }, []); // 只在组件挂载时执行一次

  return queryParams;
};

export default useQueryParams;
