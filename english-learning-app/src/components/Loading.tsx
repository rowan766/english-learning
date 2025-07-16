import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
  spinning?: boolean;
  children?: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  text = '加载中...',
  spinning = true,
  children,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 32 : 24 }} spin />;

  if (children) {
    return (
      <Spin spinning={spinning} indicator={antIcon} tip={text}>
        {children}
      </Spin>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: '200px',
    }}>
      <Spin indicator={antIcon} size={size} />
      {text && (
        <Text style={{ marginTop: 16, color: '#666' }}>
          {text}
        </Text>
      )}
    </div>
  );
};

export default Loading;