import React from 'react';
import PropTypes from 'prop-types';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, CalendarOutlined, UserOutlined, WechatOutlined } from '@ant-design/icons';
import './DefaultTemplate.css';

/**
 * 默认简历模板
 * 提供基础的简历布局和样式，字段与表单对应
 */
const DefaultTemplate = ({ resumeData }) => {
  const { 
    personalInfo, 
    education,
    workExperience, 
    skills, 
    projects,
    _tempEducation, // 临时教育经历数据，用于实时预览
    _tempWorkExperience, // 临时工作经历数据，用于实时预览
    _tempProjects, // 临时项目经历数据，用于实时预览
    skillsDescription // 专业技能描述
  } = resumeData;

  // 使用临时数据或正式数据
  const displayEducation = _tempEducation || education;
  const displayWorkExperience = _tempWorkExperience || workExperience;
  const displayProjects = _tempProjects || projects;

  // 格式化日期范围
  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return '';
    if (!endDate) return `${startDate} - 至今`;
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="resume-content default-template">
      {/* 深色头部区域 - 姓名、基本信息和照片 */}
      <div className="resume-header">
        <div className="header-content">
          <h1 className="resume-name">{personalInfo?.name || ''}</h1>
          <div className="basic-info">
            <span>
              {personalInfo?.gender && personalInfo?.birthday ? `${personalInfo.gender} | ${personalInfo.birthday}` : 
               personalInfo?.gender ? personalInfo.gender : 
               personalInfo?.birthday ? personalInfo.birthday : ''}
              {(personalInfo?.gender || personalInfo?.birthday) && personalInfo?.hometown ? ' | ' : ''}
              {personalInfo?.hometown ? personalInfo.hometown : ''}
              {(personalInfo?.gender || personalInfo?.birthday || personalInfo?.hometown) && (personalInfo?.phone || personalInfo?.email || personalInfo?.wechat || personalInfo?.politicalStatus) ? ' | ' : ''}
              {personalInfo?.phone && (
                <span className="contact-item">
                  <PhoneOutlined style={{ color: '#4ECDC4' }} /> {personalInfo.phone}
                </span>
              )}
              {personalInfo?.phone && (personalInfo?.email || personalInfo?.wechat || personalInfo?.politicalStatus) ? ' | ' : ''}
              {personalInfo?.email && (
                <span className="contact-item">
                  <MailOutlined style={{ color: '#4ECDC4' }} /> {personalInfo.email}
                </span>
              )}
              {personalInfo?.email && (personalInfo?.wechat || personalInfo?.politicalStatus) ? ' | ' : ''}
              {personalInfo?.wechat && (
                <span className="contact-item">
                  <WechatOutlined style={{ color: '#4ECDC4' }} /> {personalInfo.wechat}
                </span>
              )}
              {personalInfo?.wechat && personalInfo?.politicalStatus ? ' | ' : ''}
              {personalInfo?.politicalStatus && (
                <span className="contact-item">
                  <UserOutlined style={{ color: '#4ECDC4' }} /> {personalInfo.politicalStatus}
                </span>
              )}
            </span>
          </div>
          {(personalInfo?.expectedPosition || personalInfo?.expectedSalary || personalInfo?.expectedCity) && (
            <div className="secondary-info">
              <span>
                {personalInfo?.expectedPosition ? `应聘岗位: ${personalInfo.expectedPosition}` : ''}
                {personalInfo?.expectedSalary ? ` | 期望薪资: ${personalInfo.expectedSalary}` : ''}
                {personalInfo?.expectedCity ? ` | 目标城市: ${personalInfo.expectedCity}` : ''}
              </span>
            </div>
          )}
        </div>
        {personalInfo?.photo && (
          <div className="photo-container">
            <img 
              src={personalInfo.photo} 
              alt="照片" 
              className="resume-photo" 
            />
          </div>
        )}
      </div>

      {/* 自我评价 */}
      {personalInfo?.advantage && (
        <div className="resume-section">
          <h2 className="section-title">自我评价</h2>
          <div className="self-description">
            <p>{personalInfo.advantage}</p>
          </div>
        </div>
      )}

      {/* 工作经历 */}
      {displayWorkExperience && displayWorkExperience.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">工作经历</h2>
          <div className="work-experience">
            {displayWorkExperience.map((exp, index) => (
              <div className="experience-item" key={index}>
                <div className="experience-header">
                  <div className="company-position">
                    <span className="company-name">{exp.company || exp.companyName || ''}</span>
                    <span className="job-title">{exp.position || ''}</span>
                  </div>
                  <span className="experience-date">
                    {exp.startDate && exp.endDate ? 
                      formatDateRange(exp.startDate, exp.endDate) : 
                      formatDateRange(exp.dateRange?.[0], exp.dateRange?.[1])}
                  </span>
                </div>
                {(exp.jobDescription || exp.description) && (
                  <div className="job-description">
                    <p>{exp.jobDescription || exp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 教育经历 */}
      {displayEducation && displayEducation.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">教育经历</h2>
          {displayEducation.map((edu, index) => (
            <div className="education-item" key={index}>
              <div className="education-header">
                <div className="school-info">
                  <span className="school-name">{edu.school || ''}</span>
                  <span className="degree">{edu.degree || ''}</span>
                  <span className="major">{edu.fieldOfStudy || ''}</span>
                </div>
                <span className="edu-date">
                  {formatDateRange(edu.startDate, edu.endDate)}
                </span>
              </div>
              {edu.description && (
                <div className="education-description">
                  <p>{edu.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 项目经历 */}
      {displayProjects && displayProjects.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">项目经历</h2>
          {displayProjects.map((project, index) => (
            <div className="project-item" key={index}>
              <div className="project-header">
                <div className="project-info">
                  <span className="project-name">{project.name || project.projectName || ''}</span>
                  <span className="project-role">{project.role || ''}</span>
                </div>
                <span className="project-date">
                  {project.startDate && project.endDate ? 
                    formatDateRange(project.startDate, project.endDate) : 
                    formatDateRange(project.dateRange?.[0], project.dateRange?.[1])}
                </span>
              </div>
              {(project.description || project.projectDescription) && (
                <div className="project-description">
                  <p>{project.description || project.projectDescription}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 专业技能 */}
      {((skillsDescription && skillsDescription.trim().length > 0) || (skills && skills.length > 0)) && (
        <div className="resume-section">
          <h2 className="section-title">专业技能</h2>
          <div className="skills-description">
            {skillsDescription ? (
              <p>{skillsDescription}</p>
            ) : (
              skills.map((skill, index) => (
                <p key={index}>{skill.skillDescription}</p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

DefaultTemplate.propTypes = {
  resumeData: PropTypes.shape({
    personalInfo: PropTypes.object,
    education: PropTypes.array,
    workExperience: PropTypes.array,
    skills: PropTypes.array,
    projects: PropTypes.array,
    skillsDescription: PropTypes.string
  }).isRequired
};

export default DefaultTemplate;