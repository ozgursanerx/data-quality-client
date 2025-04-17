import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react';
import MonitoringForm from './components/MonitoringForm';
import ProcLogTable from './components/ProcLogTable';
import SqlFullTextModal from './components/SqlFullTextModal';

const Main = () => {
  const [selectedSqlText, setSelectedSqlText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now(), message },
    ]);
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <h5>Monitoring Kayıtları</h5>
          <MonitoringForm showToast={showToast} />
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardBody>
          <h5>İşlem Logları</h5>
          <ProcLogTable
            onShowFullText={(sqlText) => {
              setSelectedSqlText(sqlText);
              setIsModalVisible(true);
            }}
            showToast={showToast}
          />
        </CCardBody>
      </CCard>

      <SqlFullTextModal
        isVisible={isModalVisible}
        sqlText={selectedSqlText}
        onClose={() => setIsModalVisible(false)}
      />

      <CToaster placement="top-end">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide={true}
            visible={true}
            color="danger"
            onClose={() => setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))}
          >
            <CToastHeader closeButton>
              <strong className="me-auto">Hata</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </>
  );
};

export default Main;
