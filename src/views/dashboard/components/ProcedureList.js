import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react';

const ProcedureList = () => {
  const [procedures, setProcedures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const showToast = (message, color = 'danger') => {
    setToast(
      <CToast autohide={true} visible={true} color={color}>
        <CToastHeader closeButton>
          <strong className="me-auto">Uyarı</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  const fetchProcedures = async (progId) => {
    if (!progId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/edwapi/getStepIdGroupedService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progId: parseInt(progId),
          stepId: null,
          timeType: null,
          firstDate: null,
          lastDate: null,
          stepIdGrp: null,
          stepIdPrefix: null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProcedures(Array.isArray(data) ? data : [data]);
      } else {
        console.error('Error fetching procedures');
        showToast('Prosedür listesi alınamadı');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcedureClick = (procedure) => {
    setSelectedProcedure(procedure);
  };

  return (
    <CCard className="h-100">
      <CCardHeader>Prosedürler</CCardHeader>
      <CCardBody>
        {isLoading ? (
          <div className="text-center">
            <CSpinner />
          </div>
        ) : (
          <CListGroup>
            {procedures.map((procedure, index) => (
              <CListGroupItem
                key={index}
                active={selectedProcedure === procedure}
                onClick={() => handleProcedureClick(procedure)}
                style={{ cursor: 'pointer' }}
              >
                {procedure}
              </CListGroupItem>
            ))}
          </CListGroup>
        )}
        <CToaster placement="top-end">
          {toast}
        </CToaster>
      </CCardBody>
    </CCard>
  );
};

export default ProcedureList;
