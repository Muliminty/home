// replaceHtmlPathPlugin.js
import fs from 'fs';
import path from 'path';

/**
 * 自定义 Vite 插件，用于替换 HTML 文件中的路径
 * @param {string} basePath - 基础路径
 * @returns {object} 插件对象
 */
function replaceHtmlPathPlugin(basePath) {
    return {
        name: 'replace-html-path', // 插件名称
        closeBundle() {
            // 构建完成后执行
            const indexPath = path.resolve('dist', 'index.html');
            let content = fs.readFileSync(indexPath, 'utf-8');
            // 替换路径中的 /src/ 为 basePath + src/
            content = content.replace(/src="\/src\//g, `src="${basePath}src/`);
            fs.writeFileSync(indexPath, content);
        }
    };
}

export default replaceHtmlPathPlugin;
