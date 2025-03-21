import React from 'react';
import { Tabs } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  BankOutlined,
  ToolOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import PersonalInfoForm from './Form/PersonalInfoForm';
import EducationForm from './ResumeForm/EducationForm';
import WorkExperienceForm from './Form/WorkExperienceForm';
import SkillsForm from './Form/SkillsForm';
import ProjectsForm from './Form/ProjectsForm';

const { TabPane } = Tabs;

/**
 * 简历表单组件
 * 使用Tabs将不同类型的表单组织在一起
 */
const ResumeForm = () => {
  return (
    <div className="resume-form-container">
      <Tabs defaultActiveKey="personal" tabPosition="left">
        <TabPane
          tab={
            <span>
              <UserOutlined />
              个人信息
            </span>
          }
          key="personal"
        >
          <PersonalInfoForm />
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <BookOutlined />
              教育经历
            </span>
          }
          key="education"
        >
          <EducationForm />
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <BankOutlined />
              工作经历
            </span>
          }
          key="work"
        >
          <WorkExperienceForm />
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <ProjectOutlined />
              项目经历
            </span>
          }
          key="projects"
        >
          <ProjectsForm />
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <ToolOutlined />
              专业技能
            </span>
          }
          key="skills"
        >
          <SkillsForm />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ResumeForm;
