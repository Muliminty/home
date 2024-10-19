/**
 * 将文件夹路径映射为树形结构（数组形式）。
 *
 * @param {Record<string, Function>} files - 一个对象，包含文件路径作为键，文件解析器作为值。
 * 
 * @returns {Array} 返回一个嵌套的数组结构，其中每个节点表示文件夹或文件。
 * 
 * 数组的结构示例：
 * [
 *   {
 *     name: 'folder1',
 *     type: 'folder',
 *     children: [
 *       {
 *         name: 'subfolder1',
 *         type: 'folder',
 *         children: [
 *           { name: 'file1.md', type: 'file', resolver: [Function] },
 *           { name: 'file2.md', type: 'file', resolver: [Function] }
 *         ]
 *       },
 *       { name: 'file3.md', type: 'file', resolver: [Function] }
 *     ]
 *   },
 *   {
 *     name: 'folder2',
 *     type: 'folder',
 *     children: [
 *       { name: 'file4.md', type: 'file', resolver: [Function] }
 *     ]
 *   }
 * ]
 * 

 */

// * 使用示例：
// * const database = import.meta.glob('/database/**/* '); // 获取文件夹
//  * const blogPostsTree = buildDirectoryTree(database); // 转换成树结构

export const buildDirectoryTree = (files) => {
  const tree = [];

  Object.entries(files).forEach(([path, resolver]) => {
    const segments = path.split('/').filter(Boolean); // 分割路径
    let currentLevel = tree;

    segments.forEach((segment, index) => {
      let existingNode = currentLevel.find(node => node.name === segment);

      if (!existingNode) {
        existingNode = {
          name: segment,
          type: index === segments.length - 1 ? 'file' : 'folder', // 判断类型
          children: [],
        };
        currentLevel.push(existingNode);
      } else if (index === segments.length - 1) {
        existingNode.type = 'file'; // 更新为文件类型
        existingNode.resolver = resolver; // 保存解析器
      }

      currentLevel = existingNode.children;
    });
  });

  return tree;
};


