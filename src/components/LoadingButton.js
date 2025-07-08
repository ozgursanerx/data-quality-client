import React from 'react';
import { CButton, CSpinner } from '@coreui/react';
import PropTypes from 'prop-types';
import './LoadingButton.css';

const LoadingButton = ({ 
  onClick, 
  children, 
  isLoading = false, 
  disabled = false,
  color = 'primary',
  size = 'md',
  variant = 'solid',
  className = '',
  ...props 
}) => {
  const handleClick = async (e) => {
    if (onClick && !isLoading && !disabled) {
      await onClick(e);
    }
  };

  // CSS sınıflarını oluştur
  const buttonClasses = [
    'loading-button',
    `btn-${variant === 'solid' ? color : `outline-${color}`}`,
    size !== 'md' ? `btn-${size}` : '',
    isLoading ? 'loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <CButton 
      onClick={handleClick} 
      disabled={isLoading || disabled} 
      color={color}
      size={size}
      variant={variant}
      className={buttonClasses}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="spinner" />
          Yükleniyor...
        </>
      ) : (
        children
      )}
    </CButton>
  );
};

LoadingButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export default LoadingButton;