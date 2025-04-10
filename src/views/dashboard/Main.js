import React, { useState } from 'react';
import './Main.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CRow,
  CFormLabel,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react';
import CustomerForm from './components/CustomerForm';
import ProcLogTable from './components/ProcLogTable';
import SqlFullTextModal from './components/SqlFullTextModal';

const Main = () => {
  const [progId, setProgId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [procLogData, setProcLogData] = useState([]);
  const [selectedSqlText, setSelectedSqlText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const itemsPerPage = 10;

  const showToast = (message) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now(), message },
    ]);
  };

  const handleSubmit = async () => {
    if (!progId || !startTime) {
      showToast('Lütfen tüm alanları doldurun!');
      return;
    }

    const formattedStartTime = startTime.replace(/-/g, '');
    const requestData = {
      progId: parseInt(progId, 10),
      startTm: formattedStartTime,
    };

    try {
      const response = await fetch('/edwapi/getEdwProcLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const rawData = await response.json();

        if (!rawData || rawData.length === 0 || !rawData[0]) {
          setProcLogData([]);
          console.log('API Response:', rawData);
          showToast('Girilen parametrelere uygun bir sonuç bulunamadı.');
          return;
        }

        const parsedData = JSON.parse(rawData[0]);

        if (!parsedData || parsedData.length === 0) {
          setProcLogData([]);
          console.log('Parsed Data:', parsedData);
          showToast('Girilen parametrelere uygun bir sonuç bulunamadı.');
        } else {
          setProcLogData(parsedData);
          setCurrentPage(1);
        }
      } else {
        setProcLogData([]);
        console.log('API Error Response:', response.statusText);
        showToast('Sunucudan bir hata döndü: ' + response.statusText);
      }
    } catch (error) {
      setProcLogData([]);
      console.log('Fetch Error:', error.message);
      showToast('Bir hata oluştu: ' + error.message);
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <h5>Müşteri Bilgisi</h5>
          <CustomerForm />
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardBody>
          <h5>İşlem Logları</h5>
          <CRow className="align-items-center">
            <CCol xs={12} md={5}>
              <CFormLabel htmlFor="progId">Prog ID</CFormLabel>
              <CFormInput
                id="progId"
                type="number"
                placeholder="Prog ID girin"
                value={progId}
                onChange={(e) => setProgId(e.target.value)}
              />
            </CCol>

            <CCol xs={12} md={5}>
              <CFormLabel htmlFor="startTime">Start Time</CFormLabel>
              <CFormInput
                id="startTime"
                type="date"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </CCol>

            <CCol className="mt-4" xs={12} md={2}>
              <CButton color="primary" onClick={handleSubmit}>
                Gönder
              </CButton>
            </CCol>
          </CRow>

          <ProcLogTable
            data={procLogData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            onShowFullText={(sqlText) => {
              setSelectedSqlText(sqlText);
              setIsModalVisible(true);
            }}
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
