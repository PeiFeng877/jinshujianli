import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const FloatingHelpButton = ({ url }) => {
  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <Tooltip title="使用帮助">
      <div className="floating-help-button" onClick={handleClick}>
        <QuestionCircleOutlined />
      </div>
    </Tooltip>
  );
};

export default FloatingHelpButton;
