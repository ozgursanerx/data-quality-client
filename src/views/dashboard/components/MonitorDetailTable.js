import React, { useState, useMemo } from 'react';
import {
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
} from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';
import CustomTable from './CustomTable';

const MonitorDetailTable = () => {
  const [detailTableName, setDetailTableName] = useState('');
  const [scenarioName, setScenarioName] = useState('');
  const [firstAsOfDt, setFirstAsOfDt] = useState('');
  const [lastAsOfDt, setLastAsOfDt] = useState('');
  const [controlType, setControlType] = useState('');
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
    if (!detailTableName) {
      showToast('Please select a table first');
      return;
    }

    setIsLoading(true);
    setCurrentPage(1);
    const requestData = {
      detailTableName: detailTableName?.trim() || null,
      scenarioName: scenarioName?.trim() || null,
      firstAsOfDt: firstAsOfDt ? firstAsOfDt.replace(/-/g, '') : null,
      lastAsOfDt: lastAsOfDt ? lastAsOfDt.replace(/-/g, '') : null,
      controlType: controlType?.trim() || null,
    };

    try {
      const response = await fetch('/edwapi/getMonitorDetailTableService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const rawData = await response.json();
        let parsedData;
        if (Array.isArray(rawData) && rawData.length > 0) {
          try {
            parsedData = JSON.parse(rawData[0]);
          } catch (parseError) {
            parsedData = [];
          }
        } else {
          parsedData = Array.isArray(rawData) ? rawData : [rawData];
        }

        const finalData = Array.isArray(parsedData) ? parsedData : [parsedData];
        setResponseData(finalData);
        
        if (finalData.length === 0) {
          showToast('No results found.');
        }
      } else {
        console.error('Error:', response.statusText);
        showToast('Error fetching data.');
        setResponseData([]);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error fetching data.');
      setResponseData([]);
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

  const detailTableOptions = [
    { value: 'DA_MONITOR_KFT', label: 'KFT Monitor' },
    { value: 'DA_MONITOR_CP', label: 'CP Monitor' },
    { value: 'DA_MONITOR_CPR', label: 'CPR Monitor' },
    { value: 'DA_MONITOR_MT', label: 'MT Monitor' },
    { value: 'DA_MONITOR_OTHR', label: 'Other Monitor' },
    { value: 'DA_MONITOR_CREDIT_OFFER', label: 'Credit Offer Monitor' },
  ];

  const columnsByTable = useMemo(() => ({
    'DA_MONITOR_KFT': [
      { header: 'As Of Date', accessor: 'asOfDt' },
      { header: 'Control Type', accessor: 'controlType' },
      { header: 'Scenario Name', accessor: 'senarioName' },
      { header: 'Customer ID', accessor: 'customerId' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30 },
      { header: 'Reference No', accessor: 'referenceNo' },
      { header: 'Company Code', accessor: 'companyCode' },
      { header: 'Company Type', accessor: 'companyType' },
    ],
    'DA_MONITOR_CP': [
      { header: 'As Of Date', accessor: 'asOfDt' },
      { header: 'Control Type', accessor: 'controlType' },
      { header: 'Scenario Name', accessor: 'senarioName' },
      { header: 'Customer ID', accessor: 'customerId' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30 },
      { header: 'Customer OID', accessor: 'customerOid' },
      { header: 'Card Bank', accessor: 'cardBank', truncate: true, maxLength: 30 },
      { header: 'Card Owner', accessor: 'cardOwner', truncate: true, maxLength: 30 },
      { header: 'Card No', accessor: 'cardNo' },
      { header: 'CC Key', accessor: 'ccKey' },
      { header: 'Statement Type', accessor: 'stmtType' },
    ],
    'DA_MONITOR_CPR': [
      { header: 'As Of Date', accessor: 'asOfDt' },
      { header: 'Card No', accessor: 'cardNo' },
      { header: 'Control Type', accessor: 'controlType' },
      { header: 'Customer ID', accessor: 'customerId' },
      { header: 'Exp Date', accessor: 'expDt' },
      { header: 'Merchant Desc', accessor: 'merchantDesc', truncate: true, maxLength: 30 },
      { header: 'Merchant ID', accessor: 'merchantId' },
      { header: 'Scenario Name', accessor: 'senarioName' },
      { header: 'Transaction Desc', accessor: 'transactionDesc', truncate: true, maxLength: 30 },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30 },
    ],
    'DA_MONITOR_MT': [
      { header: 'As Of Date', accessor: 'asOfDt' },
      { header: 'Control Type', accessor: 'controlType' },
      { header: 'Customer ID', accessor: 'customerId' },
      { header: 'Money Transfer Type', accessor: 'moneyTransferType' },
      { header: 'Scenario Name', accessor: 'senarioName' },
      { header: 'Sender Account No', accessor: 'senderAccountNo' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30 },
    ],
    'DA_MONITOR_OTHR': [
      { header: 'As Of Date', accessor: 'asOfDt' },
      { header: 'Control Type', accessor: 'controlType' },
      { header: 'Customer ID', accessor: 'customerId' },
      { header: 'Customer OID', accessor: 'customerOid' },
      { header: 'Exp Date', accessor: 'expDt' },
      { header: 'Scenario Name', accessor: 'senarioName' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30 },
    ],
    'DA_MONITOR_CREDIT_OFFER': [
      { header: 'As Of Date', accessor: 'asOfDt' },
      { header: 'Control Type', accessor: 'controlType' },
      { header: 'Create Date', accessor: 'createDt' },
      { header: 'Customer ID', accessor: 'customerId' },
      { header: 'Offer ID', accessor: 'offerId' },
      { header: 'Payment Plan Row ID', accessor: 'paymentPlanRowId' },
      { header: 'Scenario Name', accessor: 'senarioName' },
    ],
  }), []);

  const columns = useMemo(() => 
    detailTableName ? columnsByTable[detailTableName] : []
  , [detailTableName, columnsByTable]);

  const totalPages = Math.ceil(responseData.length / itemsPerPage);

  return (
    <>
      <CRow className="align-items-center mb-4">
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="detailTableName">Detail Table Name</CFormLabel>
          <CFormSelect
            id="detailTableName"
            value={detailTableName}
            onChange={(e) => {
              setDetailTableName(e.target.value);
              setResponseData([]); // Reset table data when table type changes
              setCurrentPage(1); // Reset to first page
            }}
          >
            <option value="">Select Table</option>
            {detailTableOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="scenarioName">Scenario Name</CFormLabel>
          <CFormInput
            id="scenarioName"
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
          />
        </CCol>
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="firstAsOfDt">First As Of Date</CFormLabel>
          <CFormInput
            id="firstAsOfDt"
            type="date"
            value={firstAsOfDt}
            onChange={(e) => setFirstAsOfDt(e.target.value)}
          />
        </CCol>
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="lastAsOfDt">Last As Of Date</CFormLabel>
          <CFormInput
            id="lastAsOfDt"
            type="date"
            value={lastAsOfDt}
            onChange={(e) => setLastAsOfDt(e.target.value)}
          />
        </CCol>
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="controlType">Control Type</CFormLabel>
          <CFormInput
            id="controlType"
            type="text"
            value={controlType}
            onChange={(e) => setControlType(e.target.value)}
          />
        </CCol>
        <CCol className="mt-4" xs={12} md={2}>
          <LoadingButton isLoading={isLoading} onClick={handleSubmit}>
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

export default MonitorDetailTable;