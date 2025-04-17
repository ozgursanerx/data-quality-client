import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CButton,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';
import './ProcLogTable.css';

const ProcLogTable = () => {
  const [procLogData, setProcLogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [progId, setProgId] = useState('');
  const [logDate, setLogDate] = useState('');
  const [anomalyLogDate, setAnomalyLogDate] = useState('');
  const [potentialAnomalyValue, setPotentialAnomalyValue] = useState('');
  const [potentialAnomalyRate, setPotentialAnomalyRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const itemsPerPage = 8;

  const showToast = (message) => {
    alert(message);
  };

  const fetchProcLogData = async () => {
    setIsLoading(true);
    const requestData = {
      progId: parseInt(progId, 10),
      logDate: logDate.replace(/-/g, ''),
      anomalyLogDate: anomalyLogDate.replace(/-/g, ''),
      potentialAnomalyValue: parseFloat(potentialAnomalyValue),
      potentialAnomalyRate: parseFloat(potentialAnomalyRate),
    };

    try {
      const response = await fetch('/edwapi/getEdwProcLogAnomalyService', {
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
        if (parsedData.length === 0) {
          showToast('No results found.');
        }
      } else {
        console.error('Error:', response.statusText);
        setProcLogData([]);
        showToast('Error fetching data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setProcLogData([]);
      showToast('Error fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) {
      return '';
    }
    if (text.length > maxLength) {
      return (
        <>
          {text.substring(0, maxLength)}...
          <CButton color="link" onClick={() => handleShowFullText(text)}>
            Devamını Göster
          </CButton>
        </>
      );
    }
    return text;
  };

  const handleShowFullText = (text) => {
    setModalContent(text);
    setIsModalVisible(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = procLogData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(procLogData.length / itemsPerPage);

  const renderPagination = () => {
    const maxPagesToShow = 5; // Maksimum gösterilecek sayfa numarası
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <CPaginationItem
          key={i}
          active={currentPage === i}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </CPaginationItem>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <CPaginationItem onClick={() => setCurrentPage(startPage - 1)}>...</CPaginationItem>
        )}
        {pages}
        {endPage < totalPages && (
          <CPaginationItem onClick={() => setCurrentPage(endPage + 1)}>...</CPaginationItem>
        )}
      </>
    );
  };

  return (
    <div className="table-container">
      <CRow className="align-items-center mb-4">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="progId">Prog ID</CFormLabel>
          <CFormInput
            id="progId"
            type="number"
            placeholder="Prog ID girin"
            value={progId}
            onChange={(e) => setProgId(e.target.value)}
          />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="logDate">Log Date</CFormLabel>
          <CFormInput
            id="logDate"
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
          />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="anomalyLogDate">Anomaly Log Date</CFormLabel>
          <CFormInput
            id="anomalyLogDate"
            type="date"
            value={anomalyLogDate}
            onChange={(e) => setAnomalyLogDate(e.target.value)}
          />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="potentialAnomalyValue">Potential Anomaly Value</CFormLabel>
          <CFormInput
            id="potentialAnomalyValue"
            type="number"
            step="0.01"
            placeholder="Değer girin"
            value={potentialAnomalyValue}
            onChange={(e) => setPotentialAnomalyValue(e.target.value)}
          />
        </CCol>

        <CCol xs={12} md={3} className="mt-3">
          <CFormLabel htmlFor="potentialAnomalyRate">Potential Anomaly Rate</CFormLabel>
          <CFormInput
            id="potentialAnomalyRate"
            type="number"
            step="0.01"
            placeholder="Oran girin"
            value={potentialAnomalyRate}
            onChange={(e) => setPotentialAnomalyRate(e.target.value)}
          />
        </CCol>

        <CCol className="mt-4" xs={12} md={2}>
          <LoadingButton isLoading={isLoading} onClick={fetchProcLogData}>
            Gönder
          </LoadingButton>
        </CCol>
      </CRow>

      <div className="table-scroll-wrapper">
        <CTable striped hover responsive className="small-font-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Step ID</CTableHeaderCell>
              <CTableHeaderCell>Prog ID</CTableHeaderCell>
              <CTableHeaderCell>SQL Full Text</CTableHeaderCell>
              <CTableHeaderCell>Start Time</CTableHeaderCell>
              <CTableHeaderCell>Duration</CTableHeaderCell>
              <CTableHeaderCell>Mean Duration</CTableHeaderCell>
              <CTableHeaderCell>Std Dev Duration</CTableHeaderCell>
              <CTableHeaderCell>Anomaly Flag</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                <CTableDataCell>{truncateText(item.stepId)}</CTableDataCell>
                <CTableDataCell>{item.progId}</CTableDataCell>
                <CTableDataCell>{truncateText(item.sqlFullText, 100)}</CTableDataCell>
                <CTableDataCell>{item.startTm}</CTableDataCell>
                <CTableDataCell>{item.duration}</CTableDataCell>
                <CTableDataCell>{item.meanDuration}</CTableDataCell>
                <CTableDataCell>{item.stdDevDuration}</CTableDataCell>
                <CTableDataCell>{item.anomaly_flag}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <CModal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <CModalHeader>Detay</CModalHeader>
        <CModalBody>{modalContent}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsModalVisible(false)}>
            Kapat
          </CButton>
        </CModalFooter>
      </CModal>

      <CPagination className="justify-content-center">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {renderPagination()}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>
    </div>
  );
};

export default ProcLogTable;