// 文件位置: src/pages/ArticleList.tsx

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, message } from 'antd';
import { BookOutlined, SoundOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // 添加这行
import { Loading } from '@/components';

const { Title, Text, Paragraph } = Typography;

// 定义文章数据类型
interface Article {
  id?: string | number;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  date?: string;
  segments?: any[];
  paragraphs?: Paragraph[]; // 添加paragraphs字段
  [key: string]: any;
}

// 定义段落类型
interface Paragraph {
  id: string | number;
  content: string;
  translation?: string;
  order?: number;
  audioUrl?: string;
  audioFilename?: string;
  [key: string]: any;
}

// 定义API响应类型
interface ApiResponse {
  documents?: Article[];
  data?: Article[];
  total?: number;
  [key: string]: any;
}

const ArticleList: React.FC = () => {
  const navigate = useNavigate(); // 添加这行
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 获取文章列表
  const fetchArticles = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://3.235.53.207:8002/document?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      console.log('API Response:', data);
      
      if (data.documents) {
        setArticles(data.documents);
        setTotalPages(Math.ceil((data.total || 0) / 10));
      } else if (Array.isArray(data)) {
        setArticles(data as Article[]);
      } else if (data.data) {
        setArticles(data.data);
      } else {
        setArticles([]);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      console.error('获取文章失败:', err);
      setError(errorMessage);
      message.error(`获取文章失败: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleArticleClick = (article: Article): void => {
    console.log('点击文章:', article);
    // 跳转到文章详情页，通过state传递数据
    if (article.id) {
      navigate(`/articles/${article.id}`, { 
        state: { article } 
      });
    } else {
      message.warning('文章ID不存在，无法查看详情');
    }
  };

  // 处理开始学习按钮点击
  const handleStartLearning = (article: Article, event: React.MouseEvent): void => {
    event.stopPropagation(); // 阻止事件冒泡
    if (article.id) {
      navigate(`/articles/${article.id}`, { 
        state: { article } 
      });
    } else {
      message.warning('文章ID不存在，无法开始学习');
    }
  };

  if (loading) {
    return <Loading text="正在加载文章列表..." size="large" />;
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Text type="danger" style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}>
            加载失败: {error}
          </Text>
          <Button type="primary" onClick={() => fetchArticles(currentPage)}>
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 头部 */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e8e8e8',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 16px' 
        }}>
          <Title level={3} style={{ margin: 0, marginBottom: '8px', fontSize: '18px' }}>
            <ReadOutlined style={{ marginRight: '8px', color: '#1677ff', fontSize: '18px' }} />
            英语学习 - BBC听力
          </Title>
          <Text type="secondary" style={{ fontSize: '12px' }}>选择文章开始学习</Text>
        </div>
      </div>

      {/* 主要内容 */}
      <div style={{ 
        maxWidth: '100%', 
        margin: '0 auto', 
        padding: '16px' 
      }}>
        {articles.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            background: 'white',
            borderRadius: '8px'
          }}>
            <BookOutlined style={{ fontSize: '36px', color: '#d9d9d9', marginBottom: '12px' }} />
            <Title level={5} type="secondary">暂无文章数据</Title>
            <Button type="primary" onClick={() => fetchArticles(currentPage)} size="small">
              刷新
            </Button>
          </div>
        ) : (
          <>
            {/* 文章列表 */}
            <Row gutter={[12, 12]}>
              {articles.map((article: Article, index: number) => (
                <Col xs={24} sm={12} lg={8} key={article.id || index}>
                  <Card 
                    hoverable
                    style={{ height: '100%' }}
                    onClick={() => handleArticleClick(article)}
                    cover={
                      <div style={{ 
                        height: '80px', 
                        background: 'linear-gradient(135deg, #1677ff 0%, #69c0ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <SoundOutlined style={{ fontSize: '24px', color: 'white' }} />
                      </div>
                    }
                    actions={[
                      <Button 
                        type="link" 
                        icon={<BookOutlined />} 
                        key="study"
                        onClick={(e) => handleStartLearning(article, e)}
                        size="small"
                      >
                        开始学习
                      </Button>
                    ]}
                    size="small"
                  >
                    <Card.Meta
                      title={
                        <Title 
                          level={5} 
                          ellipsis={{ rows: 2 }} 
                          style={{ 
                            margin: 0, 
                            fontSize: '14px',
                            lineHeight: '1.4'
                          }}
                        >
                          {article.title || article.name || `文章 ${index + 1}`}
                        </Title>
                      }
                      description={
                        <div>
                          {article.date && (
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {article.date}
                            </Text>
                          )}
                          <Paragraph 
                            ellipsis={{ rows: 2 }} 
                            style={{ 
                              marginTop: '6px', 
                              marginBottom: '6px',
                              fontSize: '12px'
                            }}
                          >
                            {article.description || article.content || '点击查看文章内容...'}
                          </Paragraph>
                          <Space>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {article.paragraphs?.length || article.segments?.length || 0} 个段落
                            </Text>
                          </Space>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* 分页 */}
            {totalPages > 1 && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '20px' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    size="small"
                  >
                    上一页
                  </Button>
                  
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        type={currentPage === page ? "primary" : "default"}
                        onClick={() => handlePageChange(page)}
                        size="small"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    size="small"
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleList;