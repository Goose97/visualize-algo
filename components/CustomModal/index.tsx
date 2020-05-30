import React from 'react';
import { Modal, Alert } from 'antd';

import { IProps } from './index.d';

const CustomModal: React.FC<IProps> = props => {
  const {
    children,
    sideModal,
    width,
    className,
    description,
    footerDescription,
    visible,
  } = props;
  const customWidth = width || 1200;
  return (
    <Modal
      {...props}
      width={customWidth}
      className={`${className || ''} custom-modal`}
      closeIcon={<span>&times;</span>}
    >
      {description && (
        <Alert
          style={{ textAlign: 'left', marginBottom: 10 }}
          description={description}
          type='info'
          message=''
          showIcon
        />
      )}
      {children}
      {/* This component is absolute positioned */}
      {visible && (
        <div className='custom-modal__side-modal'>{sideModal}</div>
      )}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '53px',
        }}
        className='flex-center pd-left-25'
      >
        <span className='cakecloud-italic-dim'>{footerDescription}</span>
      </div>
    </Modal>
  );
};

export default CustomModal;
