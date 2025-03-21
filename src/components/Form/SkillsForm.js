import React from 'react';
import { Form, Input } from 'antd';
import { useResume } from '../../contexts/ResumeContext';

const { TextArea } = Input;

/**
 * 专业技能表单组件
 * 允许用户输入专业技能描述
 */
const SkillsForm = () => {
  // 使用Context来获取和更新简历数据
  const { resumeData, updateResumeData } = useResume();
  
  // 从简历数据中获取专业技能部分
  const skillsDescription = resumeData.skillsDescription || '';

  // 处理表单字段变化
  const handleChange = (value) => {
    updateResumeData({
      ...resumeData,
      skillsDescription: value
    });
  };

  return (
    <div className="form-section-container">
      <Form layout="vertical">
        <Form.Item 
          label="专业技能" 
          className="form-item form-item-normal"
          help="描述您掌握的专业技能、编程语言、工具、框架等"
        >
          <TextArea 
            placeholder="例如：
1. 精通HTML5/CSS3/JavaScript，熟悉ES6+语法特性
2. 熟练使用React框架及相关技术栈，包括Redux、React Router等
3. 熟悉Node.js后端开发，有Express和Koa框架使用经验
4. 掌握MySQL、MongoDB等数据库的基本操作
5. 了解前端工程化，熟悉Webpack、Babel等构建工具" 
            rows={10} 
            value={skillsDescription} 
            onChange={(e) => handleChange(e.target.value)} 
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default SkillsForm;
