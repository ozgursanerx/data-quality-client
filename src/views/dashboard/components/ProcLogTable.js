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

  const convertSecondsToMinutes = (value) => {
    if (!value) return '';
    return (value / 60).toFixed(2);
  };

  const processRowData = (row) => {
    return {
      ...row,
      duration: convertSecondsToMinutes(row.duration),
      meanDuration: convertSecondsToMinutes(row.meanDuration),
      stdDevDuration: convertSecondsToMinutes(row.stdDevDuration)
    };
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
            style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
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

  const totalPages = Math.ceil(procLogData.length / itemsPerPage);

  const columns = [
    { header: '#', accessor: 'index', truncate: false, tooltip: 'Sıra numarası' },
    { header: 'Step ID', accessor: 'stepId', truncate: true, maxLength: 30, tooltip: 'İşlem adımı ID\'si' },
    { header: 'Prog ID', accessor: 'progId', truncate: false, tooltip: 'Program ID\'si' },
    { header: 'SQL Full Text', accessor: 'sqlFullText', truncate: true, maxLength: 100, tooltip: 'SQL sorgusu' },
    { header: 'Start Time', accessor: 'startTm', truncate: false, tooltip: 'İşlemin başlangıç zamanı' },
    { header: 'Duration (min)', accessor: 'duration', truncate: false, tooltip: 'İşlemin süresi (dakika)' },
    { header: 'Mean Duration (min)', accessor: 'meanDuration', truncate: false, tooltip: 'Ortalama işlem süresi (dakika)' },
    { header: 'Std Dev Duration (min)', accessor: 'stdDevDuration', truncate: false, tooltip: 'Standart sapma süresi (dakika)' },
    { header: 'Anomaly Flag', accessor: 'anomalyflag', truncate: false, tooltip: 'Anomali durumu' }
  ];

  return (
    <>
      <CRow className="align-items-center mb-4">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="progId">Prog ID</CFormLabel>
          <CTooltip content="İşlem yapılacak programın ID'sini girin" placement="top">
            <CFormInput
              id="progId"
              type="number"
              placeholder="Prog ID girin"
              value={progId}
              onChange={(e) => setProgId(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="logDate">Log Date</CFormLabel>
          <CTooltip content="Bu tarihten itibaren değerler hesaplanacaktır" placement="top">
            <CFormInput
              id="logDate"
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="anomalyLogDate">Anomaly Log Date</CFormLabel>
          <CTooltip content="Bu tarihten itibaren analiz yapılacaktır" placement="top">
            <CFormInput
              id="anomalyLogDate"
              type="date"
              value={anomalyLogDate}
              onChange={(e) => setAnomalyLogDate(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="potentialAnomalyValue">Potential Anomaly Value</CFormLabel>
          <CTooltip content="Anomali tespiti için eşik değerini girin" placement="top">
            <CFormInput
              id="potentialAnomalyValue"
              type="number"
              step="0.01"
              placeholder="Değer girin"
              value={potentialAnomalyValue}
              onChange={(e) => setPotentialAnomalyValue(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={3} className="mt-3">
          <CFormLabel htmlFor="potentialAnomalyRate">Potential Anomaly Rate</CFormLabel>
          <CTooltip content="Anomali tespiti için oran değerini girin" placement="top">
            <CFormInput
              id="potentialAnomalyRate"
              type="number"
              step="0.01"
              placeholder="Oran girin"
              value={potentialAnomalyRate}
              onChange={(e) => setPotentialAnomalyRate(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol className="mt-4" xs={12} md={2}>
          <CTooltip content="Form verilerini sunucuya gönder" placement="top">
            <LoadingButton isLoading={isLoading} onClick={fetchProcLogData}>
              Gönder
            </LoadingButton>
          </CTooltip>
        </CCol>
      </CRow>

      <CustomTable
        data={procLogData.map(processRowData)}
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

export default ProcLogTable;