import React, { useState } from 'react';
import { CButton, CSpinner } from '@coreui/react';

const LoadingButton = ({ onClick, children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CButton onClick={handleClick} disabled={isLoading} color="light">
      {isLoading ? <CSpinner size="sm" /> : children}
    </CButton>
  );
};

export default LoadingButton;