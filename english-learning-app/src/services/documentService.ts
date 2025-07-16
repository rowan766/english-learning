import httpClient from './httpClient';
import type {
  UploadDocumentRequest,
  UploadDocumentResponse,
  ProcessTextRequest,
  ProcessTextResponse,
  ApiResponse,
} from '@/types';

/**
 * 文档服务类
 */
export class DocumentService {
  /**
   * 上传文档文件
   * @param file 要上传的文件
   * @returns 上传结果
   */
  static async uploadDocument(file: File): Promise<UploadDocumentResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await httpClient.post<ApiResponse<UploadDocumentResponse>>(
        '/document/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // 上传进度回调
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`📤 Upload progress: ${percentCompleted}%`);
            }
          },
        }
      );

      if (!response.data.data) {
        throw new Error('上传响应数据为空');
      }

      return response.data.data;
    } catch (error) {
      console.error('❌ Document upload failed:', error);
      throw error;
    }
  }

  /**
   * 处理文档文本内容
   * @param request 处理请求参数
   * @returns 处理结果
   */
  static async processText(request: ProcessTextRequest): Promise<ProcessTextResponse> {
    try {
      if (!request.documentId && !request.text) {
        throw new Error('必须提供文档ID或文本内容');
      }

      const response = await httpClient.post<ApiResponse<ProcessTextResponse>>(
        '/document/process-text',
        request
      );

      if (!response.data.data) {
        throw new Error('文本处理响应数据为空');
      }

      return response.data.data;
    } catch (error) {
      console.error('❌ Text processing failed:', error);
      throw error;
    }
  }

  /**
   * 验证文件类型和大小
   * @param file 要验证的文件
   * @returns 验证结果
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    // 支持的文件类型
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    // 最大文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: '不支持的文件类型。请上传 PDF、TXT 或 DOCX 文件。',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: '文件大小超过限制。最大支持 10MB 的文件。',
      };
    }

    return { valid: true };
  }
}

export default DocumentService;