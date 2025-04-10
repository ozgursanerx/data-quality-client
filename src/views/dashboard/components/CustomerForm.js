import React from 'react';
import { CRow, CCol, CFormLabel, CFormInput, CButton } from '@coreui/react';

const CustomerForm = ({ customerNumber, onCustomerNumberChange, onSubmit, customerOid }) => {
  return (
    <CRow className="align-items-center">
      <CCol xs={12} md={4}>
        <CFormLabel htmlFor="customerNumber">Müşteri Numarası</CFormLabel>
        <CFormInput
          id="customerNumber"
          type="number"
          placeholder="Müşteri numarası girin"
          value={customerNumber}
          onChange={(e) => onCustomerNumberChange(e.target.value)}
        />
      </CCol>
      <CCol xs={12} md={4}>
        <CButton color="primary" onClick={onSubmit} className="mt-4">
          Müşteri Bilgisi Al
        </CButton>
      </CCol>
      <CCol xs={12} md={4} className="d-flex align-items-center">
        {customerOid && (
          <div className="alert alert-info oid-box">
            <strong>OID:</strong> {customerOid}
          </div>
        )}
      </CCol>
    </CRow>
  );
};

export default CustomerForm;