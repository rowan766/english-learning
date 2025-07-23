// 文件位置: src/pages/Home.tsx
import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Typography, Button, Space, Statistic, Divider } from 'antd';
import { useNavigate } from 'react-router-dom'; // 添加这一行
import { 
  UploadOutlined, 
  BookOutlined, 
  SoundOutlined, 
  TrophyOutlined,
  RocketOutlined,
  FileTextOutlined,
  ReadOutlined // 添加这个图标
} from '@ant-design/icons';
import { FileUpload, Loading } from '@/components';
import { useAppStore, useDictionaryStore, useSettingsStore } from '@/stores';
import { DocumentService } from '@/services';
import { formatStudyTime } from '@/utils';
import type { UploadDocumentResponse, ProcessTextRequest } from '@/types';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate(); // 添加这一行
  const [processingText, setProcessingText] = useState(false);
  
  // 使用 Zustand stores
  const { setLoading, setError, setCurrentDocument, setCurrentText } = useAppStore();
  const { studyProgress } = useDictionaryStore();
  const { language } = useSettingsStore();

  // 处理文件上传成功
  const handleUploadSuccess = useCallback(async (result: UploadDocumentResponse) => {
    try {
      setProcessingText(true);
      setError(null);

      // 创建文档对象
      const document = {
        id: result.documentId,
        name: result.filename,
        type: result.filename.split('.').pop()?.toLowerCase() as 'pdf' | 'txt' | 'docx',
        size: result.fileSize,
        uploadTime: result.uploadTime,
        lastModified: result.uploadTime,
      };

      setCurrentDocument(document);

      // 处理文档文本
      const processRequest: ProcessTextRequest = {
        documentId: result.documentId,
        language: language,
      };

      const processResult = await DocumentService.processText(processRequest);
      setCurrentText(processResult.processedText[0]); // 设置第一段处理后的文本

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '文档处理失败';
      setError(errorMessage);
    } finally {
      setProcessingText(false);
    }
  }, [language, setCurrentDocument, setCurrentText, setError]);

  // 处理上传错误
  const handleUploadError = useCallback((error: string) => {
    setError(error);
  }, [setError]);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 欢迎标题 */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          <RocketOutlined style={{ marginRight: '12px', color: '#1677ff' }} />
          英语学习助手
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          上传文档，智能处理英中对照，语音朗读助力学习，打造个人专属词典
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧 - 文件上传区域 */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <Space>
                <UploadOutlined />
                <span>上传学习文档</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            {processingText ? (
              <Loading text="正在处理文档内容..." size="large" />
            ) : (
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            )}
          </Card>
        </Col>

        {/* 右侧 - 学习统计 */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                <span>学习统计</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="总词汇量"
                  value={studyProgress.totalWords}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#1677ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="已学词汇"
                  value={studyProgress.learnedWords}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="学习时长"
                  value={formatStudyTime(studyProgress.studyTime)}
                  prefix={<SoundOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="连续天数"
                  value={studyProgress.streak}
                  suffix="天"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              {/* 添加文章列表按钮 */}
              <Button
                type="primary"
                icon={<ReadOutlined />}
                block
                onClick={() => navigate('/articles')}
              >
                浏览文章列表
              </Button>
              <Button
                icon={<BookOutlined />}
                block
                href="/dictionary"
              >
                查看词典
              </Button>
              <Button
                icon={<FileTextOutlined />}
                block
                href="/study"
              >
                开始学习
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 功能介绍 */}
      <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center', height: '160px' }}>
            <UploadOutlined style={{ fontSize: '32px', color: '#1677ff', marginBottom: '12px' }} />
            <Title level={4}>文档上传</Title>
            <Text type="secondary">
              支持PDF、TXT、DOCX格式，智能识别文本内容
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center', height: '160px' }}>
            <SoundOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
            <Title level={4}>语音朗读</Title>
            <Text type="secondary">
              AI语音合成，支持多语言朗读和语速调节
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center', height: '160px' }}>
            <BookOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '12px' }} />
            <Title level={4}>智能词典</Title>
            <Text type="secondary">
              自动生成个人词典，支持标记和复习管理
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;