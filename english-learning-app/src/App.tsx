import React, { useEffect } from 'react';
import { ConfigProvider, App as AntdApp, message, notification } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { ErrorBoundary } from '@/components';
import { Home } from '@/pages';
import { useAppStore, useSettingsStore } from '@/stores';
import { THEME_CONFIG } from '@/utils';
import './App.css';

const App: React.FC = () => {
  const { error, clearError } = useAppStore();
  const { language, theme } = useSettingsStore();

  // 处理全局错误显示
  useEffect(() => {
    if (error) {
      message.error(error);
      // 3秒后自动清除错误
      const timer = setTimeout(() => {
        clearError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // PWA安装提示
  useEffect(() => {
    let deferredPrompt: any;

    const handleBeforeInstallPrompt = (e: Event) => {
      // 阻止默认的安装提示
      e.preventDefault();
      deferredPrompt = e;
      
      // 显示自定义安装提示
      notification.info({
        message: '安装应用',
        description: '将此应用添加到主屏幕，获得更好的使用体验！',
        btn: (
          <button
            onClick={async () => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
                notification.destroy();
              }
            }}
            style={{
              background: '#1677ff',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            安装
          </button>
        ),
        key: 'install-prompt',
        duration: 10,
        placement: 'bottomRight',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Ant Design 配置
  const antdConfig = {
    locale: language === 'zh' ? zhCN : enUS,
    theme: {
      token: {
        colorPrimary: theme.primaryColor,
        borderRadius: 6,
      },
      algorithm: theme.mode === 'dark' ? undefined : undefined, // 暂时不设置暗色主题
    },
  };

  return (
    <ConfigProvider {...antdConfig}>
      <AntdApp>
        <ErrorBoundary>
          <div className="app">
            <main className="app-main">
              <Home />
            </main>
          </div>
        </ErrorBoundary>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;