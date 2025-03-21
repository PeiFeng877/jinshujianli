import React, { useState } from 'react';
import { Layout, Button, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import './App.css';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import DefaultTemplate from './templates/DefaultTemplate';
import { ResumeProvider, useResume } from './contexts/ResumeContext';
import { TemplateProvider } from './contexts/TemplateContext';
import { renderToString } from 'react-dom/server';

const { Header, Content, Footer } = Layout;

// 将导出PDF功能提取到单独组件
function ExportPDFButton() {
  const { resumeData } = useResume();
  const [loading, setLoading] = useState(false);
  
  // 导出PDF功能
  const handleExportPDF = () => {
    // 设置按钮为加载状态
    setLoading(true);
    message.loading({ content: '正在准备打印...', key: 'exportPdf' });
    
    try {
      // 创建一个隐藏的iframe用于打印
      let printFrame = document.getElementById('print-frame');
      
      // 如果iframe不存在，创建一个新的
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'print-frame';
        printFrame.style.display = 'none';
        document.body.appendChild(printFrame);
      }
      
      // 准备样式和内容
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>简历导出</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
              font-family: "Microsoft YaHei", Arial, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            /* 默认模板样式 */
            .default-template {
              width: 100%;
              background-color: white;
              padding: 0;
              font-family: "Microsoft YaHei", Arial, sans-serif;
              text-align: left;
            }
            /* 头部区域 - 深色背景 */
            .resume-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #2D3142 !important;
              color: white !important;
              padding: 24px 30px;
              margin-bottom: 20px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .header-content {
              flex: 1;
            }
            /* 姓名样式 - 一级标题 */
            .resume-name {
              font-size: 30px;
              font-weight: 700;
              color: white !important;
              margin: 0 0 10px 0;
              line-height: 45px;
            }
            /* 照片样式 */
            .photo-container {
              margin-left: 30px;
            }
            .resume-photo {
              width: 100px;
              height: 120px;
              object-fit: cover;
              border-radius: 4px;
            }
            /* 基本信息 */
            .basic-info {
              margin-bottom: 8px;
              font-size: 12px;
              color: #e0e0e0 !important;
              line-height: 24px;
            }
            .contact-item {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              font-size: 12px;
              color: #e0e0e0 !important;
            }
            /* 各个部分样式 */
            .resume-section {
              margin-bottom: 30px;
              padding: 0 30px;
            }
            /* 模块名称 - 二级标题 */
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #000000;
              border-bottom: 1px solid #eeeeee;
              padding-bottom: 8px;
              margin-bottom: 15px;
              line-height: 27px;
            }
            /* 自我评价 */
            .self-description p {
              margin-bottom: 8px;
              font-size: 12px;
              line-height: 24px;
              color: #000000;
              white-space: pre-line;
            }
            /* 工作经历 */
            .experience-item {
              margin-bottom: 20px;
            }
            .experience-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .company-position {
              display: flex;
              align-items: center;
            }
            .company-name {
              font-weight: 700;
              font-size: 14px;
              color: #000000;
              line-height: 21px;
            }
            .job-title {
              margin-left: 15px;
              font-size: 14px;
              line-height: 21px;
            }
            .experience-date {
              font-size: 14px;
              color: #666;
              line-height: 21px;
            }
            .job-description {
              font-size: 12px;
              line-height: 24px;
              color: #333333;
              margin-bottom: 10px;
            }
            .job-description p {
              white-space: pre-line;
            }
            /* 教育经历 */
            .education-item {
              margin-bottom: 15px;
            }
            .education-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .school-info {
              display: flex;
              align-items: center;
            }
            .school-name {
              font-weight: 700;
              font-size: 14px;
              color: #000000;
              line-height: 21px;
            }
            .degree, .major {
              margin-left: 15px;
              font-size: 14px;
              line-height: 21px;
            }
            .edu-date {
              font-size: 14px;
              color: #666;
              line-height: 21px;
            }
            .education-description p {
              font-size: 12px;
              line-height: 24px;
              color: #333333;
              white-space: pre-line;
            }
            /* 项目经历 */
            .project-item {
              margin-bottom: 15px;
            }
            .project-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .project-info {
              display: flex;
              align-items: center;
            }
            .project-name {
              font-weight: 700;
              font-size: 14px;
              color: #000000;
              line-height: 21px;
            }
            .project-role {
              margin-left: 15px;
              font-size: 14px;
              line-height: 21px;
            }
            .project-date {
              font-size: 14px;
              color: #666;
              line-height: 21px;
            }
            .project-description {
              font-size: 12px;
              line-height: 24px;
              color: #333333;
            }
            .project-description p {
              white-space: pre-line;
            }
            /* 技能、荣誉和证书 */
            .skills-description,
            .honors-description,
            .certificates-description {
              font-size: 12px;
              line-height: 24px;
              color: #333333;
            }
            .skills-description p,
            .honors-description p,
            .certificates-description p {
              white-space: pre-line;
            }
          </style>
        </head>
        <body>
          <div class="default-template">
            ${renderToString(<DefaultTemplate resumeData={resumeData} />)}
          </div>
        </body>
        </html>
      `;
      
      // 将内容写入iframe
      const frameDoc = printFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(printContent);
      frameDoc.close();
      
      // 等待内容加载完成后打印
      printFrame.onload = function() {
        setTimeout(() => {
          try {
            // 触发打印
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
            // 打印完成后的回调
            message.success({ content: '打印准备完成', key: 'exportPdf' });
          } catch (error) {
            console.error('Print error:', error);
            message.error({ content: `打印失败: ${error.message}`, key: 'exportPdf' });
          } finally {
            // 无论成功失败，最后都取消加载状态
            setLoading(false);
          }
        }, 500); // 给浏览器一点时间渲染内容
      };
    } catch (error) {
      console.error('PDF export error:', error);
      message.error({ content: `导出失败: ${error.message}`, key: 'exportPdf' });
      setLoading(false);
    }
  };

  return (
    <Button 
      type="primary" 
      icon={<FilePdfOutlined />} 
      onClick={handleExportPDF}
      loading={loading}
      className="export-pdf-btn"
    >
      导出PDF
    </Button>
  );
}

function App() {
  return (
    <ResumeProvider>
      <TemplateProvider>
        <Layout className="app-layout">
          <Header className="app-header">
            <h1>锦书简历</h1>
          </Header>
          <Content className="app-content">
            <div className="resume-container">
              <div className="form-section">
                {/* 表单区域标题和导出按钮 */}
                <div className="section-header">
                  <h2>编辑简历</h2>
                  <ExportPDFButton />
                </div>
                {/* 表单内容区域 */}
                <div className="section-content">
                  <ResumeForm />
                </div>
              </div>
              <div className="preview-column">
                {/* 预览区域 */}
                <ResumePreview />
              </div>
            </div>
          </Content>
          <Footer className="app-footer">
            锦书简历 {new Date().getFullYear()} Created by Jinshujianli Team
          </Footer>
        </Layout>
      </TemplateProvider>
    </ResumeProvider>
  );
}

export default App;
