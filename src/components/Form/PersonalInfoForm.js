import React from 'react';
import { Form, Input, Typography, Select, DatePicker, Upload, Radio, ConfigProvider } from 'antd';
import { useResume } from '../../contexts/ResumeContext';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';

dayjs.locale('zh-cn');

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

/**
 * 个人信息表单组件
 * 允许用户输入姓名、邮箱、电话、籍贯和个人简介
 */
const PersonalInfoForm = () => {
  // 使用我们创建的Context来获取和更新简历数据
  const { resumeData, updateResumeData } = useResume();
  
  // 从简历数据中获取个人信息部分
  const { personalInfo } = resumeData;
  
  // 当表单字段变化时更新简历数据
  const handleChange = (field, value) => {
    // 创建一个新的个人信息对象，更新特定字段
    const updatedPersonalInfo = {
      ...personalInfo,
      [field]: value,
    };
    
    // 将更新后的个人信息保存到Context中
    updateResumeData('personalInfo', updatedPersonalInfo);
  };

  // 处理照片上传
  const handlePhotoChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done' || info.file.status === 'error') {
      // 不依赖实际上传API，直接使用FileReader获取预览图片
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        handleChange('photo', reader.result);
      });
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // 处理日期选择
  const handleDateChange = (date, dateString) => {
    handleChange('birthday', dateString);
  };

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div>上传照片</div>
    </div>
  );

  // 解析生日字符串为dayjs对象（如果有）
  const getBirthdayValue = () => {
    if (!personalInfo.birthday) {
      // 不设置默认值，返回null
      return null;
    }
    try {
      return dayjs(personalInfo.birthday);
    } catch (e) {
      console.error('解析日期出错:', e);
      return null; // 出错时也返回null
    }
  };

  return (
    <div className="form-section-container">
      <Form layout="vertical">
        <div className="form-row">
          {/* 左侧列 */}
          <div className="form-col">
            {/* 姓名输入框 */}
            <Form.Item label="姓名" className="form-item form-item-normal">
              <Input 
                placeholder="请输入你的姓名" 
                value={personalInfo.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
                maxLength={10}
              />
            </Form.Item>

            {/* 性别选择 */}
            <Form.Item label="性别" className="form-item form-item-normal">
              <Radio.Group 
                value={personalInfo.gender} 
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <Radio value="男">男</Radio>
                <Radio value="女">女</Radio>
              </Radio.Group>
            </Form.Item>

            {/* 出生年月 */}
            <Form.Item label="出生年月" className="form-item form-item-normal">
              <ConfigProvider locale={zhCN}>
                <DatePicker 
                  placeholder="选择出生年月"
                  value={getBirthdayValue()}
                  onChange={handleDateChange}
                  picker="month"
                  format="YYYY-MM"
                  allowClear={true}
                  style={{ width: '100%' }}
                  defaultPickerValue={dayjs('2000-01')}
                />
              </ConfigProvider>
            </Form.Item>

            {/* 电话输入框 */}
            <Form.Item label="电话" className="form-item form-item-normal">
              <Input 
                placeholder="请输入你的电话号码" 
                value={personalInfo.phone} 
                onChange={(e) => handleChange('phone', e.target.value)} 
              />
            </Form.Item>

            {/* 邮箱输入框 */}
            <Form.Item label="邮箱" className="form-item form-item-normal">
              <Input 
                placeholder="请输入你的邮箱" 
                value={personalInfo.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
              />
            </Form.Item>

            {/* 微信号 */}
            <Form.Item label="微信号" className="form-item form-item-normal">
              <Input 
                placeholder="请输入微信号" 
                value={personalInfo.wechat} 
                onChange={(e) => handleChange('wechat', e.target.value)} 
              />
            </Form.Item>
          </div>

          {/* 右侧列 */}
          <div className="form-col">
            {/* 照片上传 */}
            <Form.Item label="照片" className="form-item form-item-photo">
              <Upload
                name="photo"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={(file) => {
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    alert('请上传JPG/PNG格式的照片!');
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    alert('照片大小不能超过2MB!');
                  }
                  return isJpgOrPng && isLt2M;
                }}
                customRequest={({ file, onSuccess }) => {
                  // 模拟上传成功
                  setTimeout(() => {
                    onSuccess("ok", null);
                  }, 0);
                }}
                onChange={handlePhotoChange}
              >
                {personalInfo.photo ? (
                  <img src={personalInfo.photo} alt="照片" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>

            {/* 期望职位 */}
            <Form.Item label="期望职位" className="form-item form-item-normal">
              <Input 
                placeholder="请输入你的期望职位" 
                value={personalInfo.expectedPosition} 
                onChange={(e) => handleChange('expectedPosition', e.target.value)} 
                maxLength={20}
              />
            </Form.Item>

            {/* 期望城市 */}
            <Form.Item label="期望城市" className="form-item form-item-normal">
              <Input 
                placeholder="请输入你的期望城市" 
                value={personalInfo.expectedCity} 
                onChange={(e) => handleChange('expectedCity', e.target.value)} 
              />
            </Form.Item>

            {/* 薪资要求 */}
            <Form.Item label="薪资要求" className="form-item form-item-normal">
              <Select
                placeholder="请选择期望薪资"
                value={personalInfo.expectedSalary}
                onChange={(value) => handleChange('expectedSalary', value)}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="3k以下">3k以下</Option>
                <Option value="3-5k">3-5k</Option>
                <Option value="5-10k">5-10k</Option>
                <Option value="10-15k">10-15k</Option>
                <Option value="15-20k">15-20k</Option>
                <Option value="20-30k">20-30k</Option>
                <Option value="30k以上">30k以上</Option>
              </Select>
            </Form.Item>

            {/* 政治面貌选择 */}
            <Form.Item label="政治面貌" className="form-item form-item-normal">
              <Select
                placeholder="请选择你的政治面貌"
                value={personalInfo.politicalStatus}
                onChange={(value) => handleChange('politicalStatus', value)}
                allowClear
              >
                <Option value="团员">团员</Option>
                <Option value="党员">党员</Option>
                <Option value="群众">群众</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* 跨越两列的字段 */}
        <div className="form-full-width">
          {/* 籍贯 */}
          <Form.Item label="籍贯" className="form-item form-item-normal">
            <Input 
              placeholder="请输入你的籍贯" 
              value={personalInfo.hometown} 
              onChange={(e) => handleChange('hometown', e.target.value)} 
              maxLength={20}
            />
          </Form.Item>

          {/* 个人优势 */}
          <Form.Item label="个人优势" className="form-item form-item-normal">
            <TextArea 
              placeholder="请输入你的个人优势" 
              rows={4} 
              value={personalInfo.advantage} 
              onChange={(e) => handleChange('advantage', e.target.value)} 
              maxLength={200}
              showCount
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default PersonalInfoForm;
