import React, { useState } from 'react';
import {
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CTooltip,
} from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';
import CustomTable from './CustomTable';

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
      const response = await fetch('/edwapi/getMonitoringRulesService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const rawData = await response.json();
        const parsedData = JSON.parse(rawData[0]);
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
          <button
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--cui-link-color, #321fdb)', 
              cursor: 'pointer' 
            }}
            onClick={() => handleShowFullText(text)}
          >
            Devamını Göster
          </button>
        </>
      );
    }
    return text;
  };

  const handleShowFullText = (text) => {
    setModalContent(text);
    setIsModalVisible(true);
  };

  const totalPages = Math.ceil(responseData.length / itemsPerPage);

  const columns = [
    { header: 'Type ID', accessor: 'typeId', truncate: true, maxLength: 30 },
    { header: 'Control Desc', accessor: 'controlDesc', truncate: true, maxLength: 30 },
    { header: 'Control Type', accessor: 'controlType', truncate: false },
    { header: 'Detail Table Name', accessor: 'detailTableName', truncate: true, maxLength: 30 },
    { header: 'Error Code', accessor: 'errorCode', truncate: false },
    { header: 'Error Desc', accessor: 'errorDesc', truncate: true, maxLength: 30 },
    { header: 'Formula', accessor: 'formula', truncate: true, maxLength: 30 },
    { header: 'Limit', accessor: 'limit', truncate: false },
    { header: 'Max Rate', accessor: 'maxRate', truncate: false },
    { header: 'Min Rate', accessor: 'minRate', truncate: false },
    { header: 'Offer Type', accessor: 'offerType', truncate: false },
    { header: 'Package Name', accessor: 'packageName', truncate: true, maxLength: 30 },
    { header: 'Pattern Type', accessor: 'patternType', truncate: false },
    { header: 'Priority', accessor: 'priority', truncate: false },
    { header: 'Scenario Name', accessor: 'scenarioName', truncate: true, maxLength: 30 },
    { header: 'Src Field Name', accessor: 'srcFieldName', truncate: true, maxLength: 30 },
    { header: 'Src Table Name', accessor: 'srcTableName', truncate: true, maxLength: 30 },
    { header: 'Step Name', accessor: 'stepName', truncate: true, maxLength: 30 },
  ];

  return (
    <>
      <CRow className="align-items-center">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="typeId">Type ID</CFormLabel>
          <CTooltip
            content="Kontrol tipi için benzersiz tanımlayıcı numara"
            placement="top"
          >
            <CFormInput
              id="typeId"
              type="number"
              value={typeId === null ? '' : typeId}
              onChange={(e) => {
                const value = e.target.value;
                setTypeId(value === '' ? null : Number(value));
              }}
            />
          </CTooltip>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="detailTableName">Detail Table Name</CFormLabel>
          <CTooltip
            content="Detay verilerinin saklandığı tablo adı"
            placement="top"
          >
            <CFormInput
              id="detailTableName"
              type="text"
              value={detailTableName}
              onChange={(e) => setDetailTableName(e.target.value)}
            />
          </CTooltip>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="scenarioName">Scenario Name</CFormLabel>
          <CTooltip
            content="Kontrol senaryosunun adı"
            placement="top"
          >
            <CFormInput
              id="scenarioName"
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
          </CTooltip>
        </CCol>
        <CCol xs={12} md={3}>
          <LoadingButton isLoading={isLoading} onClick={handleSubmit} className="mt-4">
            Gönder
          </LoadingButton>
        </CCol>
      </CRow>

      <CustomTable
        data={responseData}
        columns={columns}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        truncateText={truncateText}
        modalContent={modalContent}
        isModalVisible={isModalVisible}
        onShowFullText={handleShowFullText}
        onCloseModal={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default MonitoringForm;