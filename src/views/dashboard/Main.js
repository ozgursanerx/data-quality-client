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
} from '@coreui/react';
import CustomerForm from './components/CustomerForm';
import ProcLogTable from './components/ProcLogTable';
import SqlFullTextModal from './components/SqlFullTextModal';

const Main = () => {
  const [textInput, setTextInput] = useState('');
  const [startTime, setStartTime] = useState('');
  const [procLogData, setProcLogData] = useState([]);
  const [selectedSqlText, setSelectedSqlText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSubmit = async () => {
    if (!textInput || !startTime) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const formattedStartTime = startTime.replace(/-/g, '');
    const requestData = {
      progId: parseInt(textInput, 10),
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
        const parsedData = JSON.parse(rawData[0]);
        setProcLogData(parsedData);
        setCurrentPage(1); // Reset to the first page when new data is fetched
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              <CFormLabel htmlFor="textInput">Prog ID</CFormLabel>
              <CFormInput
                id="textInput"
                type="number"
                placeholder="Prog ID girin"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
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
            onPageChange={handlePageChange}
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
    </>
  );
};

export default Main;
