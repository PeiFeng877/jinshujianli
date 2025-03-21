import React from 'react';
import { Form, Input, Typography } from 'antd';
import { useResume } from '../../contexts/ResumeContext';

const { TextArea } = Input;
const { Title } = Typography;

/**
 * 荣誉奖项表单组件
 * 允许用户输入荣誉奖项描述
 */
const HonorsForm = () => {
  // 使用Context来获取和更新简历数据
  const { resumeData, updateResumeData } = useResume();
  
  // 从简历数据中获取荣誉奖项部分
  const { honors } = resumeData;

  // 处理表单字段变化
  const handleChange = (value) => {
    updateResumeData('honors', {
      ...honors,
      awardDescription: value
    });
  };

  return (
    <div className="form-section-container">
      <Form layout="vertical">
        <Form.Item 
          label="奖项描述" 
          className="form-item form-item-normal"
          help="请描述你获得的荣誉或奖项，包括获奖时间、名称和颁发机构等"
        >
          <TextArea 
            placeholder="例如：2019年获得校级优秀学生干部称号；2020年获得XX大赛三等奖；2021年获得XX奖学金..." 
            rows={8} 
            value={honors.awardDescription} 
            onChange={(e) => handleChange(e.target.value)} 
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default HonorsForm; 