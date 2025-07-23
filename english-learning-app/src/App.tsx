// 文件位置: src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ErrorBoundary } from '@/components';
import { Home, ArticleList, ArticleDetail } from '@/pages';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Routes>
              {/* 首页 */}
              <Route path="/" element={<Home />} />
              
              {/* 文章列表页 */}
              <Route path="/articles" element={<ArticleList />} />
              
              {/* 文章详情页 */}
              <Route path="/articles/:id" element={<ArticleDetail />} />
              
              {/* 重定向 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;