import React, { useState } from 'react';
import CustomTable from './CustomTable';
import { CFormInput, CRow, CCol, CFormLabel } from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';

const MonitoringSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [firstAsOfDt, setFirstAsOfDt] = useState('');
  const [lastAsOfDt, setLastAsOfDt] = useState('');
  const [detailTableName, setDetailTableName] = useState('');
  const [scenarioName, setScenarioName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const columns = [
    { header: 'As Of Date', accessor: 'asOfDt', truncate: false },
    { header: 'Control Type', accessor: 'controlType', truncate: false },
    { header: 'Count', accessor: 'count', truncate: false },
    { header: 'Detail Table Name', accessor: 'detailtableName', truncate: true, maxLength: 30 },
    { header: 'Error Code', accessor: 'errCode', truncate: false },
    { header: 'Error Description', accessor: 'errDesc', truncate: true, maxLength: 30 },
    { header: 'Offer Type', accessor: 'offerType', truncate: false },
    { header: 'Pattern Type', accessor: 'patternType', truncate: false },
    { header: 'Scenario Name', accessor: 'scenarioName', truncate: true, maxLength: 30 },
    { header: 'Source Field Name', accessor: 'srcFieldName', truncate: true, maxLength: 30 },
    { header: 'Source Table Name', accessor: 'srcTableName', truncate: true, maxLength: 30 },
    { header: 'Version', accessor: 'version', truncate: false },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestData = {
        firstAsOfDt: firstAsOfDt ? firstAsOfDt.replace(/-/g, '') : null,
        lastAsOfDt: lastAsOfDt ? lastAsOfDt.replace(/-/g, '') : null,
        detailTableName: detailTableName?.trim() || null,
        scenarioName: scenarioName?.trim() || null,
      };

      const response = await fetch('/edwapi/getMonitorSummaryService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const rawData = await response.json();
        const parsedData = JSON.parse(rawData[0]);
        setData(Array.isArray(parsedData) ? parsedData : [parsedData]);
        setTotalPages(Math.ceil(parsedData.length / itemsPerPage));

        if (parsedData.length === 0) {
          alert('No results found.');
        }
      } else {
        console.error('Error:', response.statusText);
        alert('Error fetching data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowFullText = (text) => {
    setModalContent(text);
    setIsModalVisible(true);
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

  return (
    <>
      <CRow className="align-items-center mb-4">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="firstAsOfDt">First As Of Date</CFormLabel>
          <CFormInput
            id="firstAsOfDt"
            type="date"
            value={firstAsOfDt}
            onChange={(e) => setFirstAsOfDt(e.target.value)}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="lastAsOfDt">Last As Of Date</CFormLabel>
          <CFormInput
            id="lastAsOfDt"
            type="date"
            value={lastAsOfDt}
            onChange={(e) => setLastAsOfDt(e.target.value)}
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
        <CCol className="mt-4" xs={12} md={2}>
          <LoadingButton isLoading={loading} onClick={fetchData}>
            Gönder
          </LoadingButton>
        </CCol>
      </CRow>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {!loading && !error && (
        <CustomTable
          data={data}
          columns={columns}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          truncateText={truncateText}
          modalContent={modalContent}
          isModalVisible={isModalVisible}
          onShowFullText={handleShowFullText}
          onCloseModal={() => setIsModalVisible(false)}
        />
      )}
    </>
  );
};

export default MonitoringSummary;