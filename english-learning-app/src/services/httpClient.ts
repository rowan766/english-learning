import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '@/types';

// 创建axios实例
const httpClient: AxiosInstance = axios.create({
  baseURL: '/api', // 通过Vite代理到后端
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
httpClient.interceptors.request.use(
  (config) => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    console.log('✅ Response:', response.status, response.config.url);
    
    // 检查业务状态码
    if (response.data && !response.data.success) {
      const error = new Error(response.data.message || 'API请求失败');
      console.error('❌ Business Error:', error.message);
      throw error;
    }
    
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error);
    
    // 处理网络错误
    if (!error.response) {
      throw new Error('网络连接失败，请检查网络设置');
    }
    
    // 处理HTTP状态码错误
    const { status } = error.response;
    let message = '请求失败';
    
    switch (status) {
      case 400:
        message = '请求参数错误';
        break;
      case 401:
        message = '未授权访问';
        break;
      case 403:
        message = '禁止访问';
        break;
      case 404:
        message = '请求的资源不存在';
        break;
      case 500:
        message = '服务器内部错误';
        break;
      case 502:
        message = '网关错误';
        break;
      case 503:
        message = '服务不可用';
        break;
      default:
        message = `请求失败 (${status})`;
    }
    
    throw new Error(message);
  }
);

export default httpClient;