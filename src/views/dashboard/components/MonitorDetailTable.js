import React, { useState, useMemo } from 'react';
import {
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CTooltip,
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
      { header: 'As Of Date', accessor: 'asOfDt', tooltip: 'İşlem tarihi' },
      { header: 'Control Type', accessor: 'controlType', tooltip: 'Kontrol tipi' },
      { header: 'Scenario Name', accessor: 'senarioName', tooltip: 'Senaryo adı' },
      { header: 'Customer ID', accessor: 'customerId', tooltip: 'Müşteri numarası' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30, tooltip: 'Benzersiz anahtar' },
      { header: 'Reference No', accessor: 'referenceNo', tooltip: 'Referans numarası' },
      { header: 'Company Code', accessor: 'companyCode', tooltip: 'Şirket kodu' },
      { header: 'Company Type', accessor: 'companyType', tooltip: 'Şirket tipi' }
    ],
    'DA_MONITOR_CP': [
      { header: 'As Of Date', accessor: 'asOfDt', tooltip: 'İşlem tarihi' },
      { header: 'Control Type', accessor: 'controlType', tooltip: 'Kontrol tipi' },
      { header: 'Scenario Name', accessor: 'senarioName', tooltip: 'Senaryo adı' },
      { header: 'Customer ID', accessor: 'customerId', tooltip: 'Müşteri numarası' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30, tooltip: 'Benzersiz anahtar' },
      { header: 'Customer OID', accessor: 'customerOid', tooltip: 'Müşteri OID' },
      { header: 'Card Bank', accessor: 'cardBank', truncate: true, maxLength: 30, tooltip: 'Kart bankası' },
      { header: 'Card Owner', accessor: 'cardOwner', truncate: true, maxLength: 30, tooltip: 'Kart sahibi' },
      { header: 'Card No', accessor: 'cardNo', tooltip: 'Kart numarası' },
      { header: 'CC Key', accessor: 'ccKey', tooltip: 'Kredi kartı anahtarı' },
      { header: 'Statement Type', accessor: 'stmtType', tooltip: 'Ekstre tipi' }
    ],
    'DA_MONITOR_CPR': [
      { header: 'As Of Date', accessor: 'asOfDt', tooltip: 'İşlem tarihi' },
      { header: 'Card No', accessor: 'cardNo', tooltip: 'Kart numarası' },
      { header: 'Control Type', accessor: 'controlType', tooltip: 'Kontrol tipi' },
      { header: 'Customer ID', accessor: 'customerId', tooltip: 'Müşteri numarası' },
      { header: 'Exp Date', accessor: 'expDt', tooltip: 'Son kullanma tarihi' },
      { header: 'Merchant Desc', accessor: 'merchantDesc', truncate: true, maxLength: 30 },
      { header: 'Merchant ID', accessor: 'merchantId' },
      { header: 'Scenario Name', accessor: 'senarioName' },
      { header: 'Transaction Desc', accessor: 'transactionDesc', truncate: true, maxLength: 30 },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30 }
    ],
    'DA_MONITOR_MT': [
      { header: 'As Of Date', accessor: 'asOfDt', tooltip: 'İşlem tarihi' },
      { header: 'Control Type', accessor: 'controlType', tooltip: 'Kontrol tipi' },
      { header: 'Customer ID', accessor: 'customerId', tooltip: 'Müşteri numarası' },
      { header: 'Money Transfer Type', accessor: 'moneyTransferType', tooltip: 'Para transferi tipi' },
      { header: 'Scenario Name', accessor: 'senarioName', tooltip: 'Senaryo adı' },
      { header: 'Sender Account No', accessor: 'senderAccountNo', tooltip: 'Gönderen hesap numarası' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30, tooltip: 'Benzersiz anahtar' }
    ],
    'DA_MONITOR_OTHR': [
      { header: 'As Of Date', accessor: 'asOfDt', tooltip: 'İşlem tarihi' },
      { header: 'Control Type', accessor: 'controlType', tooltip: 'Kontrol tipi' },
      { header: 'Customer ID', accessor: 'customerId', tooltip: 'Müşteri numarası' },
      { header: 'Customer OID', accessor: 'customerOid', tooltip: 'Müşteri OID' },
      { header: 'Exp Date', accessor: 'expDt', tooltip: 'Son kullanma tarihi' },
      { header: 'Scenario Name', accessor: 'senarioName', tooltip: 'Senaryo adı' },
      { header: 'Unique Key', accessor: 'uniqueKey', truncate: true, maxLength: 30, tooltip: 'Benzersiz anahtar' }
    ],
    'DA_MONITOR_CREDIT_OFFER': [
      { header: 'As Of Date', accessor: 'asOfDt', tooltip: 'İşlem tarihi' },
      { header: 'Control Type', accessor: 'controlType', tooltip: 'Kontrol tipi' },
      { header: 'Create Date', accessor: 'createDt', tooltip: 'Oluşturulma tarihi' },
      { header: 'Customer ID', accessor: 'customerId', tooltip: 'Müşteri numarası' },
      { header: 'Offer ID', accessor: 'offerId', tooltip: 'Teklif ID' },
      { header: 'Payment Plan Row ID', accessor: 'paymentPlanRowId', tooltip: 'Ödeme planı satır ID' },
      { header: 'Scenario Name', accessor: 'senarioName', tooltip: 'Senaryo adı' }
    ]
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
          <CTooltip
            content="Kontrol edilecek detay tablosunu seçin"
            placement="top"
          >
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
          </CTooltip>
        </CCol>
        <CCol xs={12} md={2}>
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
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="firstAsOfDt">First As Of Date</CFormLabel>
          <CTooltip
            content="Başlangıç tarihini seçin"
            placement="top"
          >
            <CFormInput
              id="firstAsOfDt"
              type="date"
              value={firstAsOfDt}
              onChange={(e) => setFirstAsOfDt(e.target.value)}
            />
          </CTooltip>
        </CCol>
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="lastAsOfDt">Last As Of Date</CFormLabel>
          <CTooltip
            content="Bitiş tarihini seçin"
            placement="top"
          >
            <CFormInput
              id="lastAsOfDt"
              type="date"
              value={lastAsOfDt}
              onChange={(e) => setLastAsOfDt(e.target.value)}
            />
          </CTooltip>
        </CCol>
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="controlType">Control Type</CFormLabel>
          <CTooltip
            content="Kontrol tipini girin"
            placement="top"
          >
            <CFormInput
              id="controlType"
              type="text"
              value={controlType}
              onChange={(e) => setControlType(e.target.value)}
            />
          </CTooltip>
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