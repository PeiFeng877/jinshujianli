import React from 'react';
import { Button, Tooltip, Select } from 'antd';
import { 
  PrinterOutlined, 
  DownloadOutlined, 
  LayoutOutlined 
} from '@ant-design/icons';
import { useTemplate } from '../../../contexts/TemplateContext';

const { Option } = Select;

/**
 * 简历预览操作组件
 * 提供打印、导出PDF和切换模板等功能
 */
const PreviewActions = () => {
  const { currentTemplateId, setCurrentTemplateId, availableTemplates } = useTemplate();

  // 打印简历
  const handlePrint = () => {
    window.print();
  };

  // 导出为PDF（未来实现）
  const handleExport = () => {
    alert('导出PDF功能将在后续版本中实现');
  };

  // 切换模板
  const handleTemplateChange = (value) => {
    setCurrentTemplateId(value);
  };

  return (
    <div className="preview-actions">
      <div className="template-selector">
        <span className="action-label">模板：</span>
        <Select 
          value={currentTemplateId} 
          onChange={handleTemplateChange}
          style={{ width: 150 }}
        >
          {Object.values(availableTemplates).map(template => (
            <Option key={template.id} value={template.id}>
              {template.name}
            </Option>
          ))}
        </Select>
      </div>
      
      <div className="action-buttons">
        <Tooltip title="打印简历">
          <Button 
            icon={<PrinterOutlined />} 
            onClick={handlePrint}
            className="action-button"
          />
        </Tooltip>
        
        <Tooltip title="导出PDF">
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
            className="action-button"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default PreviewActions; 