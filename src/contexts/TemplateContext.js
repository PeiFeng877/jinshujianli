import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建模板上下文
const TemplateContext = createContext();

/**
 * 模板提供者组件
 * 管理当前选择的简历模板和模板列表
 */
const TemplateProvider = ({ children }) => {
  // 当前选择的模板ID
  const [currentTemplateId, setCurrentTemplateId] = useState(() => {
    const savedTemplateId = localStorage.getItem('currentTemplateId');
    return savedTemplateId || 'default'; // 默认使用default模板
  });

  // 可用的模板列表
  const [availableTemplates, setAvailableTemplates] = useState({
    default: {
      id: 'default',
      name: '默认模板',
      description: '简洁专业的默认简历模板',
    }
    // 未来可以在这里添加更多模板
  });

  // 当模板变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('currentTemplateId', currentTemplateId);
  }, [currentTemplateId]);

  // 提供的上下文值
  const value = {
    currentTemplateId,
    setCurrentTemplateId,
    availableTemplates,
    // 添加新模板的方法，未来可用于动态加载模板
    addTemplate: (template) => {
      setAvailableTemplates(prev => ({
        ...prev,
        [template.id]: template
      }));
    }
  };

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};

// 自定义Hook，方便使用Context
const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};

export { TemplateContext, TemplateProvider, useTemplate }; 