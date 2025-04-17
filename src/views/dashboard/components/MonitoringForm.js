import React, { useState } from 'react';
import {
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';

const MonitoringForm = () => {
  const [typeId, setTypeId] = useState('');
  const [detailTableName, setDetailTableName] = useState('');
  const [scenarioName, setScenarioName] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = responseData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(responseData.length / itemsPerPage);

  const renderPagination = () => {
    const maxPagesToShow = 3; // Maksimum gösterilecek sayfa numarası
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

  const showToast = (message) => {
    alert(message); // Replace with your toast implementation
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setCurrentPage(1); // Reset page number to 1
    const requestData = {
      typeId: typeId || null,
      detailTableName: detailTableName?.trim() || null,
      scenarioName: scenarioName?.trim() || null,
    };

    try {
      const response = await fetch('/edwapi/getMonitoringService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const rawData = await response.json();

        const parsedData = JSON.parse(rawData[0]);
        console.log('Parsed API Response:', parsedData);
        setResponseData(Array.isArray(parsedData) ? parsedData : [parsedData]);
        if (parsedData.length === 0) {
          showToast('No results found.');
        }
      } else {
        console.error('Error:', response.statusText);
        showToast('Error fetching data.');
      }
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <>
      <CRow className="align-items-center">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="typeId">Type ID</CFormLabel>
          <CFormInput
            id="typeId"
            type="number"
            value={typeId === null ? '' : typeId}
            onChange={(e) => {
              const value = e.target.value;
              setTypeId(value === '' ? null : Number(value));
            }}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="detailTableName">Detail Table Name</CFormLabel>
          <CFormInput
            id="detailTableName"
            type="text"
            value={detailTableName}
            onChange={(e) => setDetailTableName(e.target.value)}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="scenarioName">Scenario Name</CFormLabel>
          <CFormInput
            id="scenarioName"
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <LoadingButton isLoading={isLoading} onClick={handleSubmit} className="mt-4">
            Gönder
          </LoadingButton>
        </CCol>
      </CRow>
  
      {responseData.length > 0 && (
        <>
          {/* Tek bir kapsayıcı div ile yatay kaydırma */}
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
            <CTable striped hover responsive className="mt-4" style={{ minWidth: '1200px' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Type ID</CTableHeaderCell>
                  <CTableHeaderCell>Control Desc</CTableHeaderCell>
                  <CTableHeaderCell>Control Type</CTableHeaderCell>
                  <CTableHeaderCell>Detail Table Name</CTableHeaderCell>
                  <CTableHeaderCell>Error Code</CTableHeaderCell>
                  <CTableHeaderCell>Error Desc</CTableHeaderCell>
                  <CTableHeaderCell>Formula</CTableHeaderCell>
                  <CTableHeaderCell>Limit</CTableHeaderCell>
                  <CTableHeaderCell>Max Rate</CTableHeaderCell>
                  <CTableHeaderCell>Min Rate</CTableHeaderCell>
                  <CTableHeaderCell>Offer Type</CTableHeaderCell>
                  <CTableHeaderCell>Package Name</CTableHeaderCell>
                  <CTableHeaderCell>Pattern Type</CTableHeaderCell>
                  <CTableHeaderCell>Priority</CTableHeaderCell>
                  <CTableHeaderCell>Scenario Name</CTableHeaderCell>
                  <CTableHeaderCell>Src Field Name</CTableHeaderCell>
                  <CTableHeaderCell>Src Table Name</CTableHeaderCell>
                  <CTableHeaderCell>Step Name</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{truncateText(item.typeId)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.controlDesc)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.controlType)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.detailTableName)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.errorCode)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.errorDesc)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.formula)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.limit)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.maxRate)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.minRate)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.offerType)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.packageName)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.patternType)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.priority)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.scenarioName)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.srcFieldName)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.srcTableName)}</CTableDataCell>
                    <CTableDataCell>{truncateText(item.stepName)}</CTableDataCell>
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
        </>
      )}
    </>
  );
};

export default MonitoringForm;