/**
 * 简历模板接口定义
 * 
 * 所有简历模板都应该实现这个接口，确保可以正确显示简历数据
 * 每个模板将接收相同的数据结构，但可以有不同的布局和样式
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * 模板组件应接收简历数据和其他属性
 * 
 * @param {Object} resumeData - 简历数据对象
 * @param {Object} props - 其他属性
 * @returns {React.Component} - 渲染的模板组件
 */
const TemplateInterface = ({ resumeData, ...props }) => {
  // 这是一个接口定义，实际实现由各模板提供
  return null;
};

TemplateInterface.propTypes = {
  resumeData: PropTypes.shape({
    personalInfo: PropTypes.object,
    education: PropTypes.array,
    workExperience: PropTypes.array,
    skills: PropTypes.array,
    projects: PropTypes.array
  }).isRequired
};

export default TemplateInterface; 