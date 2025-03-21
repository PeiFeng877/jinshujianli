import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { useTemplate } from '../../contexts/TemplateContext';
import DefaultTemplate from '../../templates/DefaultTemplate';
import './style.css';

/**
 * 简历预览组件
 * 根据当前选择的模板直接显示简历预览，并按A4纸张高度进行分页
 */
const ResumePreview = () => {
  // 获取简历数据
  const { resumeData } = useResume();
  const { currentTemplateId } = useTemplate();
  
  // 页面状态
  const [pageCount, setPageCount] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);
  const templateRef = useRef(null);
  const contentRef = useRef(null);
  
  // 渲染模板
  const renderTemplate = () => {
    switch (currentTemplateId) {
      case 'default':
      default:
        return <DefaultTemplate resumeData={resumeData} />;
    }
  };
  
  // 在组件挂载后计算A4高度的像素值
  useEffect(() => {
    // 设置A4的高度
    const A4_HEIGHT_MM = 297; // A4的高度为297mm
    
    // 计算页面高度的像素值
    // 使用固定值1123px，减去20px用于页码和页边距
    const pageHeightPx = 1123 - 20;
    setPageHeight(pageHeightPx);
    
    // 等待DOM更新完成后计算分页
    const calculatePages = () => {
      if (contentRef.current && templateRef.current) {
        // 获取内容高度
        const contentHeight = templateRef.current.scrollHeight;
        
        // 计算需要的页面数，向上取整
        const calculatedPages = Math.max(1, Math.ceil(contentHeight / pageHeightPx));
        console.log(`简历内容高度: ${contentHeight}px, 页面高度: ${pageHeightPx}px, 需要${calculatedPages}页`);
        
        // 如果当前页面数与计算出的页面数不一致，则更新页面数
        if (pageCount !== calculatedPages) {
          setPageCount(calculatedPages);
        }
      }
    };
    
    // 计算页面数
    calculatePages();
    
    // 监听窗口大小变化，重新计算页面数
    window.addEventListener('resize', calculatePages);
    
    return () => {
      window.removeEventListener('resize', calculatePages);
    };
  }, [resumeData, currentTemplateId, pageCount]);
  
  // 如果尚未计算页面高度，显示加载指示器
  if (pageHeight === 0) {
    return (
      <div className="resume-preview-wrapper">
        <div className="loading-indicator">正在计算预览...</div>
      </div>
    );
  }
  
  return (
    <div className="resume-preview-wrapper">
      {/* 隐藏的模板，用于计算高度 */}
      <div 
        ref={templateRef} 
        style={{ position: 'absolute', visibility: 'hidden', left: '-9999px', width: '210mm' }}
      >
        {renderTemplate()}
      </div>
      
      {/* 分页后的内容 */}
      <div ref={contentRef} className="paginated-content">
        {/* 根据计算出的页面数生成页面 */}
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div 
            key={pageIndex} 
            className="resume-page"
          >
            <div 
              className="resume-page-content"
              style={{
                height: `${pageHeight}px`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: `${-pageIndex * pageHeight}px`,
                  width: '100%'
                }}
              >
                {renderTemplate()}
              </div>
            </div>
            <div className="page-number">{pageIndex + 1} / {pageCount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;
