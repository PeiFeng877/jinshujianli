import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import ReactGA from 'react-ga4';
import { clarity } from '@microsoft/clarity';

// u521du59cbu5316 Google Analytics
ReactGA.initialize('G-QEXE5CEM9R');

// u521du59cbu5316 Microsoft Clarity
clarity.init('qtqq4gf289');

// 
import './assets/styles/global.less';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#1890ff',
      },
    }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
