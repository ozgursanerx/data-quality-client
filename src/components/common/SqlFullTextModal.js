import React from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';

const SqlFullTextModal = ({ isVisible, onClose, sqlText }) => {
  return (
    <CModal visible={isVisible} onClose={onClose}>
      <CModalHeader>SQL Full Text</CModalHeader>
      <CModalBody>
        <pre>{sqlText}</pre>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="primary"
          onClick={() => {
            navigator.clipboard.writeText(sqlText);
            alert('SQL Full Text kopyalandı!');
          }}
        >
          Kopyala
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Kapat
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SqlFullTextModal;