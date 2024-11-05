import { useEffect, useState } from 'react';

/**
 * 自定义 Hook，用于更新当前页面的 URL 查询参数。
 * 
 * @param {Object} params - 要更新的查询参数对象。
 * @param {string} [params.key] - 查询参数的键名。
 * @param {string|number|undefined} [params.value] - 查询参数的值。若值为 `undefined`，则会删除该参数。
 *
 * @example
 * const MyComponent = () => {
 *   const [urlParams, setUrlParams] = useState({ path: new URLSearchParams(window.location.search).get('path') || '' });
 *   useUpdateQueryParams(urlParams);
 *
 *   return (
 *     <div>
 *       <input 
 *         type="text" 
 *         value={urlParams.path} 
 *         onChange={(e) => setUrlParams({ ...urlParams, path: e.target.value })} 
         placeholder="Path..." 
       />
     </div>
 *   );
 * };
 */
const useUpdateQueryParams = (params) => {
  useEffect(() => {
    const url = new URL(window.location);

    // 更新 URL 参数
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        url.searchParams.delete(key); // 如果值是 undefined，删除参数
      } else {
        url.searchParams.set(key, value); // 设置参数值
      }
    });

    // 使用 pushState 或 replaceState 更新 URL
    window.history.replaceState({}, '', url);
  }, [params]); // 依赖 params，当其变化时重新执行
};

export default useUpdateQueryParams;
