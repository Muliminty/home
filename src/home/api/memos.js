import { api, ApiGatewayServer } from './apiConfig';

// /memos/list post
export const getMemosList = async () => {
  try {
    const response = await api.post(`${ApiGatewayServer}/memos/list`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}