// 文件位置: src/pages/ArticleDetail.tsx

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  message, 
  Spin, 
  Divider,
  Row,
  Col,
  Tag,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SoundOutlined, 
  PauseOutlined,
  TranslationOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SpeechService } from '@/services';

const { Title, Text, Paragraph } = Typography;

// 定义段落数据类型
interface Paragraph {
  id: string | number;
  content: string;
  translation?: string;
  order?: number;
  audioUrl?: string;
  audioFilename?: string;
  [key: string]: any;
}

// 定义文章详情类型
interface ArticleDetail {
  id: string | number;
  title: string;
  content?: string;
  paragraphs?: Paragraph[];
  segments?: Paragraph[]; // 兼容segments字段
  totalSegments?: number;
  [key: string]: any;
}

// 定义路由state类型
interface LocationState {
  article: ArticleDetail;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslations, setShowTranslations] = useState<{ [key: string]: boolean }>({});
  const [playingSegment, setPlayingSegment] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<{ [key: string]: boolean }>({});

  // 从路由state获取文章数据
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.article) {
      console.log('从路由获取到文章数据:', state.article);
      setArticle(state.article);
      setLoading(false);
    } else if (id) {
      // 如果没有state数据，可能是直接访问URL，这里可以添加获取数据的逻辑
      console.warn('没有从路由获取到文章数据，文章ID:', id);
      setError('文章数据不存在，请从文章列表进入');
      setLoading(false);
    } else {
      setError('文章ID不存在');
      setLoading(false);
    }
  }, [location.state, id]);

  // 切换翻译显示
  const toggleTranslation = (segmentId: string | number): void => {
    setShowTranslations(prev => ({
      ...prev,
      [segmentId]: !prev[segmentId]
    }));
  };

  // 播放段落音频
  const playSegmentAudio = async (paragraph: Paragraph): Promise<void> => {
    try {
      const segmentKey = paragraph.id.toString();
      
      // 如果正在播放同一段落，则停止播放
      if (playingSegment === segmentKey) {
        SpeechService.stopAudio();
        setPlayingSegment(null);
        return;
      }

      // 停止当前播放的音频
      if (playingSegment) {
        SpeechService.stopAudio();
      }

      setLoadingAudio(prev => ({ ...prev, [segmentKey]: true }));
      setPlayingSegment(segmentKey);

      let audioUrl = '';

      // 优先使用现有的完整音频URL
      if (paragraph.audioUrl) {
        audioUrl = `http://3.235.53.207:8002${paragraph.audioUrl}`;
        console.log('使用现有音频URL:', audioUrl);
      } 
      // 如果有音频文件名，从后台服务器的public/audio目录加载
      else if (paragraph.audioFilename) {
        audioUrl = `http://3.235.53.207:8002/audio/${paragraph.audioFilename}`;
        console.log('使用后台音频文件:', audioUrl);
      } 
      // 如果没有现成音频，调用语音生成接口
      else {
        console.log('生成新的语音:', paragraph.content);
        const response = await fetch('http://3.235.53.207:8002/speech/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: paragraph.content,
            language: 'en',
            voice: 'default',
            speed: 1.0
          })
        });

        if (!response.ok) {
          throw new Error(`语音生成失败: ${response.status}`);
        }

        const speechData = await response.json();
        console.log('语音生成成功:', speechData);
        
        // 从生成的响应中获取音频URL
        audioUrl = speechData.audioUrl || speechData.data?.audioUrl;
        
        if (!audioUrl) {
          throw new Error('语音生成成功，但未获取到音频URL');
        }
      }

      // 播放音频
      await SpeechService.playAudio(
        audioUrl,
        // 播放进度回调
        undefined,
        // 播放结束回调
        () => {
          setPlayingSegment(null);
        }
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '播放失败';
      console.error('播放音频失败:', err);
      message.error(`播放失败: ${errorMessage}`);
      setPlayingSegment(null);
    } finally {
      setLoadingAudio(prev => ({ ...prev, [paragraph.id.toString()]: false }));
    }
  };

  // 返回文章列表
  const handleGoBack = (): void => {
    navigate('/articles');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" tip="正在加载文章内容..." />
      </div>
    );
  }

  if (error || !article) {
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
            {error || '文章不存在'}
          </Text>
          <Space>
            <Button type="primary" onClick={handleGoBack}>
              返回列表
            </Button>
          </Space>
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
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 16px' 
        }}>
          <Space align="center" style={{ marginBottom: '8px', width: '100%' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack}
              style={{ padding: '4px 8px' }}
            >
              返回列表
            </Button>
          </Space>
          <Title 
            level={3} 
            style={{ 
              margin: 0, 
              marginBottom: '8px',
              fontSize: '18px',
              lineHeight: '1.4'
            }}
            ellipsis={{ rows: 2 }}
          >
            {article.title}
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Tag color="blue" style={{ width: 'fit-content' }}>
              {(article.paragraphs || article.segments)?.length || 0} 个段落
            </Tag>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              点击段落播放音频，点击眼睛图标显示中文
            </Text>
          </div>
        </div>
      </div>

      {/* 文章内容 */}
      <div style={{ 
        maxWidth: '100%', 
        margin: '0 auto', 
        padding: '16px' 
      }}>
        <Row gutter={[0, 12]}>
          {(article.paragraphs || article.segments || []).map((paragraph: Paragraph, index: number) => {
            const segmentKey = paragraph.id?.toString() || index.toString();
            const isPlaying = playingSegment === segmentKey;
            const isLoadingAudio = loadingAudio[segmentKey];
            const showTranslation = showTranslations[segmentKey];

            return (
              <Col span={24} key={segmentKey}>
                <Card 
                  style={{ 
                    borderLeft: isPlaying ? '3px solid #1677ff' : '3px solid transparent',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px'
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                  size="small"
                >
                  {/* 段落头部 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <Tag color="default" style={{ fontSize: '12px' }}>
                      段落 {index + 1}
                    </Tag>
                    <Space size="small">
                      <Tooltip title={showTranslation ? "隐藏翻译" : "显示翻译"}>
                        <Button
                          type="text"
                          icon={showTranslation ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          onClick={() => toggleTranslation(segmentKey)}
                          size="small"
                          style={{ 
                            minWidth: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        />
                      </Tooltip>
                      <Tooltip title={isPlaying ? "停止播放" : "播放音频"}>
                        <Button
                          type={isPlaying ? "primary" : "default"}
                          icon={
                            isLoadingAudio ? (
                              <LoadingOutlined spin />
                            ) : isPlaying ? (
                              <PauseOutlined />
                            ) : (
                              <SoundOutlined />
                            )
                          }
                          onClick={() => playSegmentAudio(paragraph)}
                          loading={isLoadingAudio}
                          size="small"
                          style={{ 
                            minWidth: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </div>

                  {/* 英文原文 */}
                  <div 
                    style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.6',
                      margin: 0,
                      color: isPlaying ? '#1677ff' : '#000',
                      wordBreak: 'break-word',
                      cursor: 'pointer',
                      padding: '8px 0'
                    }}
                    onClick={() => playSegmentAudio(paragraph)}
                  >
                    {paragraph.content}
                  </div>

                  {/* 中文翻译 */}
                  {showTranslation && (
                    <>
                      <Divider style={{ margin: '8px 0' }} />
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '8px 12px', 
                        borderRadius: '6px',
                        border: '1px solid #e8e8e8'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <TranslationOutlined 
                            style={{ 
                              color: '#1677ff', 
                              marginTop: '2px',
                              fontSize: '14px',
                              flexShrink: 0
                            }} 
                          />
                          <Text style={{ 
                            fontSize: '13px', 
                            lineHeight: '1.5',
                            wordBreak: 'break-word'
                          }}>
                            {paragraph.translation || '暂无翻译'}
                          </Text>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* 底部操作 */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          position: 'sticky',
          bottom: 0
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            <Button 
              type="primary" 
              size="small"
              onClick={() => {
                // 显示所有翻译
                const allSegmentIds = (article.paragraphs || article.segments || []).reduce((acc, paragraph, index) => {
                  acc[paragraph.id?.toString() || index.toString()] = true;
                  return acc;
                }, {} as { [key: string]: boolean });
                setShowTranslations(allSegmentIds);
              }}
              block
            >
              显示全部翻译
            </Button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                size="small"
                onClick={() => {
                  // 隐藏所有翻译
                  setShowTranslations({});
                }}
                style={{ flex: 1 }}
              >
                隐藏全部翻译
              </Button>
              <Button 
                size="small" 
                onClick={handleGoBack}
                style={{ flex: 1 }}
              >
                返回列表
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;