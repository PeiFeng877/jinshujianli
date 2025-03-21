import React, { useState, useContext, useEffect, useCallback, memo } from 'react';
import { Form, Input, DatePicker, Button, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { ResumeContext } from '../../contexts/ResumeContext';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 简单的教育经历卡片组件，包含上移下移功能
const EducationCard = memo(({ education, index, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
  // 使用useCallback包装事件处理，避免不必要的重新渲染
  const handleEditClick = useCallback(() => {
    console.log('[EducationCard] 编辑按钮点击, index:', index);
    onEdit(index);
  }, [onEdit, index]);
  
  const handleDeleteClick = useCallback(() => {
    console.log('[EducationCard] 删除按钮点击, index:', index);
    onDelete(index);
  }, [onDelete, index]);
  
  const handleMoveUpClick = useCallback(() => {
    console.log('[EducationCard] 上移按钮点击, index:', index);
    onMoveUp(index);
  }, [onMoveUp, index]);
  
  const handleMoveDownClick = useCallback(() => {
    console.log('[EducationCard] 下移按钮点击, index:', index);
    onMoveDown(index);
  }, [onMoveDown, index]);
  
  console.log('[EducationCard] 渲染, index:', index, 'school:', education.school);
  
  return (
    <div className="education-form-card">
      <Card 
        size="small"
        title={
          <div className="education-card-title">
            <strong>{education.school}</strong>
            <span>{education.degree} · {education.fieldOfStudy}</span>
          </div>
        }
        extra={
          <Space>
            {!isFirst && (
              <Button 
                type="text" 
                icon={<ArrowUpOutlined />} 
                onClick={handleMoveUpClick}
                title="上移"
              />
            )}
            {!isLast && (
              <Button 
                type="text" 
                icon={<ArrowDownOutlined />} 
                onClick={handleMoveDownClick}
                title="下移"
              />
            )}
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={handleEditClick}
            />
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDeleteClick}
            />
          </Space>
        }
      >
        <div className="education-card-content">
          <div className="education-date">
            {education.startDate} - {education.endDate || '至今'}
          </div>
          {education.description && (
            <div className="education-description">{education.description}</div>
          )}
        </div>
      </Card>
    </div>
  );
});

// 显式设置组件名称，有助于调试
EducationCard.displayName = 'EducationCard';

// 教育经历表单组件
const EducationForm = () => {
  console.log('[EducationForm] 开始渲染');
  
  const { resumeData, updateResumeData } = useContext(ResumeContext);
  const [form] = Form.useForm();
  
  // 当前编辑的索引
  const [editingIndex, setEditingIndex] = useState(null);
  // 是否处于添加模式
  const [isAdding, setIsAdding] = useState(false);
  
  // 表单值状态 - 用于实时预览
  const [formValues, setFormValues] = useState({});
  
  console.log('[EducationForm] 状态:', { 
    editingIndex, 
    isAdding, 
    hasEducation: Array.isArray(resumeData.education), 
    educationCount: resumeData.education?.length,
    hasTempEducation: Boolean(resumeData._tempEducation),
    formValuesKeys: Object.keys(formValues)
  });
  
  // 处理表单值变化
  const handleValuesChange = useCallback((changedValues, allValues) => {
    console.log('[EducationForm] 表单值变化:', changedValues);
    setFormValues(allValues);
  }, []);
  
  // 实时更新预览 - 使用稳定引用避免无限循环
  useEffect(() => {
    console.log('[EducationForm] useEffect 触发, isAdding:', isAdding, 'editingIndex:', editingIndex, 'formValuesLength:', Object.keys(formValues).length);
    
    // 只有在编辑或添加模式下才更新预览
    if ((isAdding || editingIndex !== null) && Object.keys(formValues).length > 0) {
      // 格式化日期
      let previewData = [...(resumeData.education || [])];
      
      const formattedData = {
        ...formValues,
        startDate: formValues.dateRange?.[0] ? dayjs(formValues.dateRange[0]).format('YYYY-MM') : '',
        endDate: formValues.dateRange?.[1] ? dayjs(formValues.dateRange[1]).format('YYYY-MM') : '',
      };
      
      console.log('[EducationForm] 格式化的表单数据:', formattedData);
      
      let newPreviewData = [...previewData];
      
      if (editingIndex !== null && editingIndex >= 0 && editingIndex < previewData.length) {
        // 编辑模式：替换对应索引的数据
        console.log('[EducationForm] 更新预览 - 编辑模式, editingIndex:', editingIndex);
        newPreviewData[editingIndex] = formattedData;
      } else if (isAdding) {
        // 添加模式：添加到末尾
        console.log('[EducationForm] 更新预览 - 添加模式');
        newPreviewData.push(formattedData);
      }
      
      // 将临时数据传递给ResumeContext用于预览
      console.log('[EducationForm] 更新临时预览数据, 数量:', newPreviewData.length);
      updateResumeData({
        ...resumeData,
        _tempEducation: newPreviewData
      });
    } else if (!isAdding && editingIndex === null && resumeData._tempEducation) {
      // 不在编辑或添加模式，清除临时数据
      console.log('[EducationForm] 清除临时预览数据');
      const { _tempEducation, ...restData } = resumeData;
      updateResumeData(restData);
    }
  }, [formValues, isAdding, editingIndex, resumeData, updateResumeData]);

  // 处理表单提交
  const handleFinish = useCallback((values) => {
    console.log('[EducationForm] 表单提交, values:', values, 'editingIndex:', editingIndex);
    try {
      const education = [...(resumeData.education || [])];
      
      // 格式化日期
      const formattedData = {
        ...values,
        startDate: values.dateRange?.[0] ? dayjs(values.dateRange[0]).format('YYYY-MM') : '',
        endDate: values.dateRange?.[1] ? dayjs(values.dateRange[1]).format('YYYY-MM') : '',
      };
      
      if (editingIndex !== null && editingIndex >= 0 && editingIndex < education.length) {
        // 编辑现有项
        console.log('[EducationForm] 保存编辑, index:', editingIndex);
        education[editingIndex] = formattedData;
      } else {
        // 添加新项
        console.log('[EducationForm] 添加新项');
        education.push(formattedData);
      }
      
      // 先清除临时数据并更新简历数据
      const { _tempEducation, ...restData } = resumeData;
      console.log('[EducationForm] 更新简历数据, 教育经历数量:', education.length);
      updateResumeData({
        ...restData,
        education
      });
      
      // 重置表单状态
      console.log('[EducationForm] 重置表单状态');
      form.resetFields();
      setFormValues({});
      setEditingIndex(null);
      setIsAdding(false);
    } catch (error) {
      console.error('[EducationForm] 保存教育经历失败:', error);
    }
  }, [editingIndex, resumeData, updateResumeData, form]);

  // 取消编辑
  const handleCancel = useCallback(() => {
    console.log('[EducationForm] 取消编辑');
    // 重置表单状态
    form.resetFields();
    setFormValues({});
    setEditingIndex(null);
    setIsAdding(false);
    
    // 清除临时预览数据
    if (resumeData._tempEducation) {
      console.log('[EducationForm] 清除临时预览数据');
      const { _tempEducation, ...restData } = resumeData;
      updateResumeData(restData);
    }
  }, [resumeData, updateResumeData, form]);

  // 编辑现有项
  const handleEdit = useCallback((index) => {
    console.log('[EducationForm] 开始编辑, index:', index);
    try {
      if (!resumeData.education || 
          !Array.isArray(resumeData.education) || 
          index < 0 || 
          index >= resumeData.education.length) {
        console.error('[EducationForm] 找不到要编辑的教育经历:', index);
        return;
      }
      
      const education = resumeData.education[index];
      console.log('[EducationForm] 要编辑的数据:', education);
      
      // 设置日期范围
      const dateRange = [];
      if (education.startDate) {
        dateRange[0] = dayjs(education.startDate);
      }
      if (education.endDate) {
        dateRange[1] = dayjs(education.endDate);
      }
      
      // 准备表单初始值
      const initialValues = {
        ...education,
        dateRange: dateRange.length > 0 ? dateRange : undefined,
      };
      console.log('[EducationForm] 表单初始值:', initialValues);
      
      // 更新状态 - 重要：先设置状态再设置表单值
      console.log('[EducationForm] 更新状态 - 开始');
      setIsAdding(false);
      console.log('[EducationForm] 设置 isAdding = false');
      setEditingIndex(index);
      console.log('[EducationForm] 设置 editingIndex =', index);
      setFormValues(initialValues);
      console.log('[EducationForm] 设置 formValues =', initialValues);
      
      // 重置表单并设置新值
      console.log('[EducationForm] 重置表单');
      form.resetFields();
      console.log('[EducationForm] 设置表单值');
      form.setFieldsValue(initialValues);
      console.log('[EducationForm] 编辑设置完成');
    } catch (error) {
      console.error('[EducationForm] 编辑教育经历失败:', error);
    }
  }, [resumeData.education, form]);

  // 删除项
  const handleDelete = useCallback((index) => {
    console.log('[EducationForm] 删除项, index:', index);
    try {
      if (!resumeData.education || 
          !Array.isArray(resumeData.education) || 
          index < 0 || 
          index >= resumeData.education.length) {
        console.error('[EducationForm] 找不到要删除的教育经历:', index);
        return;
      }
      
      const education = [...resumeData.education];
      education.splice(index, 1);
      
      console.log('[EducationForm] 更新删除后的数据, 剩余数量:', education.length);
      updateResumeData({
        ...resumeData,
        education,
      });
    } catch (error) {
      console.error('[EducationForm] 删除教育经历失败:', error);
    }
  }, [resumeData, updateResumeData]);

  // 添加教育经历
  const handleAdd = useCallback(() => {
    console.log('[EducationForm] 添加教育经历');
    // 先清空表单
    form.resetFields();
    setFormValues({});
    // 设置为添加模式
    setIsAdding(true);
    setEditingIndex(null);
  }, [form]);

  // 处理上移条目
  const handleMoveUp = useCallback((index) => {
    console.log('[EducationForm] 上移条目, index:', index);
    if (index <= 0 || !Array.isArray(resumeData.education)) return;
    
    const newEducation = [...resumeData.education];
    const temp = newEducation[index];
    newEducation[index] = newEducation[index - 1];
    newEducation[index - 1] = temp;
    
    updateResumeData({
      ...resumeData,
      education: newEducation
    });
  }, [resumeData, updateResumeData]);
  
  // 处理下移条目
  const handleMoveDown = useCallback((index) => {
    console.log('[EducationForm] 下移条目, index:', index);
    if (!Array.isArray(resumeData.education) || index >= resumeData.education.length - 1) return;
    
    const newEducation = [...resumeData.education];
    const temp = newEducation[index];
    newEducation[index] = newEducation[index + 1];
    newEducation[index + 1] = temp;
    
    updateResumeData({
      ...resumeData,
      education: newEducation
    });
  }, [resumeData, updateResumeData]);

  console.log('[EducationForm] 渲染UI, isAdding:', isAdding, 'editingIndex:', editingIndex);
  
  return (
    <div className="education-form">
      {!isAdding && editingIndex === null ? (
        // 显示模式
        <>
          <div className="education-list">
            {Array.isArray(resumeData.education) && resumeData.education.length > 0 ? (
              resumeData.education.map((edu, index) => {
                console.log('[EducationForm] 渲染卡片, index:', index, 'school:', edu.school);
                return (
                  <EducationCard 
                    key={`edu-${index}`}
                    education={edu} 
                    index={index} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    isFirst={index === 0}
                    isLast={index === resumeData.education.length - 1}
                  />
                );
              })
            ) : (
              <div className="empty-list">暂无教育经历</div>
            )}
          </div>
          <Button 
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="add-button"
          >
            添加教育经历
          </Button>
        </>
      ) : (
        // 编辑/添加模式
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            school: '',
            degree: '',
            fieldOfStudy: '',
            dateRange: [],
            description: '',
          }}
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            name="school"
            label="学校名称"
            rules={[{ required: true, message: '请输入学校名称' }]}
          >
            <Input placeholder="例如：北京大学" />
          </Form.Item>
          
          <Form.Item
            name="degree"
            label="学位"
            rules={[{ required: true, message: '请输入学位' }]}
          >
            <Input placeholder="例如：学士、硕士、博士" />
          </Form.Item>
          
          <Form.Item
            name="fieldOfStudy"
            label="专业"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input placeholder="例如：计算机科学" />
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="起止时间"
            rules={[{ required: true, message: '请选择起止时间' }]}
          >
            <RangePicker 
              picker="month" 
              locale={locale}
              format="YYYY-MM"
              allowEmpty={[false, true]}
              placeholder={['开始时间', '结束时间（可选）']}
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="在校经历描述"
          >
            <TextArea 
              rows={4}
              placeholder="描述您在校期间的成就、活动等（可选）"
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EducationForm; 