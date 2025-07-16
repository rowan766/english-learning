import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Service Worker 注册（PWA支持）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// 错误边界全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// 性能监控（开发模式）
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_PERFORMANCE_MONITOR === 'true') {
  // 监控性能指标
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as any;
        if (perfData) {
          console.log('Performance metrics:', {
            'DNS Lookup': (perfData.domainLookupEnd || 0) - (perfData.domainLookupStart || 0),
            'TCP Connection': (perfData.connectEnd || 0) - (perfData.connectStart || 0),
            'Request': (perfData.responseStart || 0) - (perfData.requestStart || 0),
            'Response': (perfData.responseEnd || 0) - (perfData.responseStart || 0),
            'DOM Processing': (perfData.domComplete || 0) - (perfData.domLoading || 0),
            'Total Load Time': (perfData.loadEventEnd || 0) - (perfData.navigationStart || 0),
          });
        }
      }, 0);
    });
  }
}

// 检查浏览器支持
const checkBrowserSupport = () => {
  const features = {
    'Fetch API': 'fetch' in window,
    'Promise': 'Promise' in window,
    'localStorage': 'localStorage' in window,
    'sessionStorage': 'sessionStorage' in window,
    'IndexedDB': 'indexedDB' in window,
    'Service Worker': 'serviceWorker' in navigator,
    'Web Audio API': 'AudioContext' in window || 'webkitAudioContext' in window,
  };

  const unsupportedFeatures = Object.entries(features)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  if (unsupportedFeatures.length > 0) {
    console.warn('不支持的浏览器特性:', unsupportedFeatures);
  }

  return unsupportedFeatures.length === 0;
};

// 初始化应用
const initApp = () => {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found');
  }

  // 检查浏览器支持
  const isSupported = checkBrowserSupport();
  
  if (!isSupported) {
    container.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 20px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <h1 style="color: #ff4d4f; margin-bottom: 16px;">浏览器不兼容</h1>
        <p style="color: #666; margin-bottom: 24px;">
          您的浏览器版本过低，请升级到最新版本的 Chrome、Firefox、Safari 或 Edge 浏览器。
        </p>
        <button 
          onclick="location.reload()" 
          style="
            background: #1677ff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          "
        >
          重新检测
        </button>
      </div>
    `;
    return;
  }

  // 创建React应用
  const root = createRoot(container);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// 启动应用
initApp();