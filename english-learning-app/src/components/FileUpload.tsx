import React, { useState } from 'react';
import { Upload, message, Progress, Typography, Space } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import { DocumentService } from '@/services';
import { formatFileSize, UPLOAD_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/utils';
import type { UploadDocumentResponse } from '@/types';

const { Dragger } = Upload;
const { Text } = Typography;

interface FileUploadProps {
  onUploadSuccess?: (result: UploadDocumentResponse) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (file: File): Promise<void> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // 验证文件
      const validation = DocumentService.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 模拟上传进度（实际项目中这个会在 httpClient 中处理）
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await DocumentService.uploadDocument(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      message.success(SUCCESS_MESSAGES.upload);
      onUploadSuccess?.(result);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.upload.failed;
      message.error(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    disabled: disabled || uploading,
    accept: UPLOAD_CONFIG.allowedExtensions.join(','),
    beforeUpload: (file) => {
      handleUpload(file);
      return false; // 阻止默认上传行为
    },
    showUploadList: false,
  };

  return (
    <div>
      <Dragger {...uploadProps} style={{ padding: '40px 20px' }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: '#1677ff' }} />
        </p>
        <p className="ant-upload-text">
          <Text strong>点击或拖拽文件到此区域上传</Text>
        </p>
        <div className="ant-upload-hint">
          <Space direction="vertical" size={4}>
            <Text type="secondary">
              支持 PDF、TXT、DOCX 格式文件
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              最大文件大小：{formatFileSize(UPLOAD_CONFIG.maxFileSize)}
            </Text>
          </Space>
        </div>
      </Dragger>

      {uploading && (
        <div style={{ marginTop: 16 }}>
          <Progress 
            percent={uploadProgress} 
            status={uploadProgress === 100 ? 'success' : 'active'}
            showInfo={true}
            format={(percent) => `${percent}%`}
          />
          <Text type="secondary" style={{ fontSize: '12px', marginTop: 8, display: 'block' }}>
            正在上传文件...
          </Text>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Space>
          <FileTextOutlined />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            支持的文件格式：
          </Text>
        </Space>
        <div style={{ marginTop: 4 }}>
          {UPLOAD_CONFIG.allowedExtensions.map((ext) => (
            <Text 
              key={ext} 
              type="secondary" 
              style={{ 
                fontSize: '11px',
                marginRight: '8px',
                padding: '2px 6px',
                background: '#f5f5f5',
                borderRadius: '2px'
              }}
            >
              {ext}
            </Text>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;