import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建默认的简历数据结构，使用英文字段名，匹配表单组件中使用的字段名称
const defaultResumeData = {
  personalInfo: {
    name: '',
    photo: '',
    gender: '',
    birthday: '',
    email: '',
    phone: '',
    hometown: '',
    politicalStatus: '',
    advantage: '',
    expectedPosition: '',
    expectedSalary: '',
    expectedCity: '',
    wechat: ''
  },
  education: [],
  workExperience: [],
  skills: [],
  projects: [],
  honors: {
    awardDescription: ''
  }
};

// 创建Context
const ResumeContext = createContext();

// 创建Provider组件
const ResumeProvider = ({ children }) => {
  // 从localStorage加载数据，如果没有则使用默认数据
  const [resumeData, setResumeData] = useState(() => {
    const savedData = localStorage.getItem('resumeData');
    return savedData ? JSON.parse(savedData) : defaultResumeData;
  });

  // 当resumeData变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  // 更新简历数据的函数 - 支持两种调用方式
  // 方式1: updateResumeData(section, data) - 更新特定部分
  // 方式2: updateResumeData(newResumeData) - 更新整个resumeData
  const updateResumeData = (sectionOrData, data) => {
    if (data === undefined) {
      // 方式2: 传入整个resumeData对象
      setResumeData(sectionOrData);
    } else {
      // 方式1: 传入section和data
      setResumeData(prevData => ({
        ...prevData,
        [sectionOrData]: data,
      }));
    }
  };

  // 添加项目到数组的函数（用于教育经历、工作经验等）
  const addItemToSection = (section, item) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], item],
    }));
  };

  // 更新数组中的项目
  const updateItemInSection = (section, index, item) => {
    setResumeData(prevData => {
      const newSection = [...prevData[section]];
      newSection[index] = item;
      return {
        ...prevData,
        [section]: newSection,
      };
    });
  };

  // 删除数组中的项目
  const removeItemFromSection = (section, index) => {
    setResumeData(prevData => {
      const newSection = prevData[section].filter((_, i) => i !== index);
      return {
        ...prevData,
        [section]: newSection,
      };
    });
  };

  // 重置简历数据
  const resetResumeData = () => {
    setResumeData(defaultResumeData);
  };

  // 提供的值
  const value = {
    resumeData,
    updateResumeData,
    addItemToSection,
    updateItemInSection,
    removeItemFromSection,
    resetResumeData,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

// 自定义Hook，方便使用Context
const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export { ResumeContext, ResumeProvider, useResume };
