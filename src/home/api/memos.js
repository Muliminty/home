import { api, ApiGatewayServer } from './apiConfig';
// 根据环境变量设置不同的 API 地址
const mode = import.meta.env.MODE; // 获取当前模式

import envConfig from '../../../env'; // 导入环境变量配置。

const { VITE_PROPS } = envConfig[mode]
console.log('VITE_PROPS: ', VITE_PROPS);


const basePath = VITE_PROPS.MEMOS_PATH
// /memos/list post
export const getMemosList = async () => {
  try {
    const response = await api.post(`${ApiGatewayServer}/memos/list`,{
      "path": basePath
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}