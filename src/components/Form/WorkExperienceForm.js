import React, { useState, useContext, useEffect, useCallback, memo } from 'react';
import { Form, Input, DatePicker, Button, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { ResumeContext } from '../../contexts/ResumeContext';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 工作经历卡片组件
const WorkCard = memo(({ work, index, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
  // 使用useCallback包装事件处理，避免不必要的重新渲染
  const handleEditClick = useCallback(() => {
    console.log('[WorkCard] 编辑按钮点击, index:', index);
    onEdit(index);
  }, [onEdit, index]);
  
  const handleDeleteClick = useCallback(() => {
    console.log('[WorkCard] 删除按钮点击, index:', index);
    onDelete(index);
  }, [onDelete, index]);
  
  const handleMoveUpClick = useCallback(() => {
    console.log('[WorkCard] 上移按钮点击, index:', index);
    onMoveUp(index);
  }, [onMoveUp, index]);
  
  const handleMoveDownClick = useCallback(() => {
    console.log('[WorkCard] 下移按钮点击, index:', index);
    onMoveDown(index);
  }, [onMoveDown, index]);
  
  return (
    <div className="work-form-card">
      <Card 
        size="small"
        title={
          <div className="work-card-title">
            <strong>{work.company}</strong>
            <span>{work.position}</span>
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
        <div className="work-card-content">
          <div className="work-date">
            {work.startDate} - {work.endDate || '至今'}
          </div>
          {work.description && (
            <div className="work-description">{work.description}</div>
          )}
        </div>
      </Card>
    </div>
  );
});

// 显式设置组件名称，有助于调试
WorkCard.displayName = 'WorkCard';

// 工作经历表单组件
const WorkExperienceForm = () => {
  console.log('[WorkExperienceForm] 开始渲染');
  
  const { resumeData, updateResumeData } = useContext(ResumeContext);
  const [form] = Form.useForm();
  
  // 当前编辑的索引
  const [editingIndex, setEditingIndex] = useState(null);
  // 是否处于添加模式
  const [isAdding, setIsAdding] = useState(false);
  
  // 表单值状态 - 用于实时预览
  const [formValues, setFormValues] = useState({});
  
  // 处理表单值变化
  const handleValuesChange = useCallback((changedValues, allValues) => {
    console.log('[WorkExperienceForm] 表单值变化:', changedValues);
    setFormValues(allValues);
  }, []);
  
  // 实时更新预览
  useEffect(() => {
    // 只有在编辑或添加模式下才更新预览
    if ((isAdding || editingIndex !== null) && Object.keys(formValues).length > 0) {
      // 格式化日期
      let previewData = [...(resumeData.workExperience || [])];
      
      const formattedData = {
        ...formValues,
        startDate: formValues.dateRange?.[0] ? dayjs(formValues.dateRange[0]).format('YYYY-MM') : '',
        endDate: formValues.dateRange?.[1] ? dayjs(formValues.dateRange[1]).format('YYYY-MM') : '',
      };
      
      let newPreviewData = [...previewData];
      
      if (editingIndex !== null && editingIndex >= 0 && editingIndex < previewData.length) {
        // 编辑模式：替换对应索引的数据
        newPreviewData[editingIndex] = formattedData;
      } else if (isAdding) {
        // 添加模式：添加到末尾
        newPreviewData.push(formattedData);
      }
      
      // 将临时数据传递给ResumeContext用于预览
      updateResumeData({
        ...resumeData,
        _tempWorkExperience: newPreviewData
      });
    } else if (!isAdding && editingIndex === null && resumeData._tempWorkExperience) {
      // 不在编辑或添加模式，清除临时数据
      const { _tempWorkExperience, ...restData } = resumeData;
      updateResumeData(restData);
    }
  }, [formValues, isAdding, editingIndex, resumeData, updateResumeData]);

  // 处理表单提交
  const handleFinish = useCallback((values) => {
    const workExperience = [...(resumeData.workExperience || [])];
    
    // 格式化日期
    const formattedData = {
      ...values,
      startDate: values.dateRange?.[0] ? dayjs(values.dateRange[0]).format('YYYY-MM') : '',
      endDate: values.dateRange?.[1] ? dayjs(values.dateRange[1]).format('YYYY-MM') : '',
    };
    
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < workExperience.length) {
      // 编辑现有项
      workExperience[editingIndex] = formattedData;
    } else {
      // 添加新项
      workExperience.push(formattedData);
    }
    
    // 先清除临时数据并更新简历数据
    const { _tempWorkExperience, ...restData } = resumeData;
    updateResumeData({
      ...restData,
      workExperience
    });
    
    // 重置表单状态
    form.resetFields();
    setFormValues({});
    setEditingIndex(null);
    setIsAdding(false);
  }, [editingIndex, resumeData, updateResumeData, form]);

  // 取消编辑
  const handleCancel = useCallback(() => {
    // 重置表单状态
    form.resetFields();
    setFormValues({});
    setEditingIndex(null);
    setIsAdding(false);
    
    // 清除临时预览数据
    if (resumeData._tempWorkExperience) {
      const { _tempWorkExperience, ...restData } = resumeData;
      updateResumeData(restData);
    }
  }, [resumeData, updateResumeData, form]);

  // 编辑现有项
  const handleEdit = useCallback((index) => {
    try {
      if (!resumeData.workExperience || 
          !Array.isArray(resumeData.workExperience) || 
          index < 0 || 
          index >= resumeData.workExperience.length) {
        return;
      }
      
      const work = resumeData.workExperience[index];
      
      // 设置日期范围
      const dateRange = [];
      if (work.startDate) {
        dateRange[0] = dayjs(work.startDate);
      }
      if (work.endDate) {
        dateRange[1] = dayjs(work.endDate);
      }
      
      // 准备表单初始值
      const initialValues = {
        ...work,
        dateRange: dateRange.length > 0 ? dateRange : undefined,
      };
      
      // 更新状态
      setIsAdding(false);
      setEditingIndex(index);
      setFormValues(initialValues);
      
      // 重置表单并设置新值
      form.resetFields();
      form.setFieldsValue(initialValues);
    } catch (error) {
      console.error('[WorkExperienceForm] 编辑工作经历失败:', error);
    }
  }, [resumeData.workExperience, form]);

  // 删除项
  const handleDelete = useCallback((index) => {
    try {
      if (!resumeData.workExperience || 
          !Array.isArray(resumeData.workExperience) || 
          index < 0 || 
          index >= resumeData.workExperience.length) {
        return;
      }
      
      const workExperience = [...resumeData.workExperience];
      workExperience.splice(index, 1);
      
      updateResumeData({
        ...resumeData,
        workExperience,
      });
    } catch (error) {
      console.error('[WorkExperienceForm] 删除工作经历失败:', error);
    }
  }, [resumeData, updateResumeData]);

  // 添加工作经历
  const handleAdd = useCallback(() => {
    // 先清空表单
    form.resetFields();
    setFormValues({});
    // 设置为添加模式
    setIsAdding(true);
    setEditingIndex(null);
  }, [form]);

  // 处理上移条目
  const handleMoveUp = useCallback((index) => {
    if (index <= 0 || !Array.isArray(resumeData.workExperience)) return;
    
    const newWorkExperience = [...resumeData.workExperience];
    const temp = newWorkExperience[index];
    newWorkExperience[index] = newWorkExperience[index - 1];
    newWorkExperience[index - 1] = temp;
    
    updateResumeData({
      ...resumeData,
      workExperience: newWorkExperience
    });
  }, [resumeData, updateResumeData]);
  
  // 处理下移条目
  const handleMoveDown = useCallback((index) => {
    if (!Array.isArray(resumeData.workExperience) || index >= resumeData.workExperience.length - 1) return;
    
    const newWorkExperience = [...resumeData.workExperience];
    const temp = newWorkExperience[index];
    newWorkExperience[index] = newWorkExperience[index + 1];
    newWorkExperience[index + 1] = temp;
    
    updateResumeData({
      ...resumeData,
      workExperience: newWorkExperience
    });
  }, [resumeData, updateResumeData]);
  
  return (
    <div className="work-form">
      {!isAdding && editingIndex === null ? (
        // 显示模式
        <>
          <div className="work-list">
            {Array.isArray(resumeData.workExperience) && resumeData.workExperience.length > 0 ? (
              resumeData.workExperience.map((work, index) => (
                <WorkCard 
                  key={`work-${index}`}
                  work={work} 
                  index={index} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  isFirst={index === 0}
                  isLast={index === resumeData.workExperience.length - 1}
                />
              ))
            ) : (
              <div className="empty-list">暂无工作经历</div>
            )}
          </div>
          <Button 
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="add-button"
          >
            添加工作经历
          </Button>
        </>
      ) : (
        // 编辑/添加模式
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            company: '',
            position: '',
            dateRange: [],
            description: '',
          }}
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            name="company"
            label="公司名称"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="例如：阿里巴巴" />
          </Form.Item>
          
          <Form.Item
            name="position"
            label="职位"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input placeholder="例如：高级前端工程师" />
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
            label="工作描述"
          >
            <TextArea 
              rows={4}
              placeholder="描述您的工作职责、成就等"
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

export default WorkExperienceForm;
