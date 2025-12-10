import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react';
import CustomTable from '../../../components/common/CustomTable';
import './ProcLogTable.css';
import {
  CFormLabel,
  CFormInput,
  CFormSelect,
  CTooltip,
  CAlert,
} from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';
import { API_ENDPOINTS } from '../../../utils/constants';

const ProcLogTable = () => {
  const [procLogData, setProcLogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Temel parametreler
  const [progId, setProgId] = useState('');
  const [groupType, setGroupType] = useState('STEP');
  const [analysisPeriod, setAnalysisPeriod] = useState('DAILY');
  const [historicalDays, setHistoricalDays] = useState('365');
  const [analysisStartDate, setAnalysisStartDate] = useState('');
  const [analysisEndDate, setAnalysisEndDate] = useState('');
  
  // Gelişmiş parametreler (minExecutionCount kaldırıldı)
  const [iqrMultiplier, setIqrMultiplier] = useState('1.5');
  const [percentileThreshold, setPercentileThreshold] = useState('1.2');
  const [zScoreThreshold, setZScoreThreshold] = useState('2.0');
  const [modifiedZScoreThreshold, setModifiedZScoreThreshold] = useState('3.5');
  const [extremeThreshold, setExtremeThreshold] = useState('4.0');
  const [highThreshold, setHighThreshold] = useState('3.0');
  const [moderateThreshold, setModerateThreshold] = useState('2.0');
  const [globalAnomalyRate, setGlobalAnomalyRate] = useState('75.0');
  const [periodSlowdownMultiplier, setPeriodSlowdownMultiplier] = useState('1.3');
  const [showAllFlag, setShowAllFlag] = useState('ANOMALY_ONLY');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const itemsPerPage = 8;

  const showAlert = (message, type = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(''), 5000);
  };

  const fetchProcLogData = async () => {
    // Yeni validasyon: Prog ID zorunlu, tarihler veya geçmiş veri gün sayısı gerekli
    if (!progId) {
      showAlert('Lütfen Prog ID alanını doldurun', 'warning');
      return;
    }

    // Tarih kontrolü: Ya tarihler girilmeli ya da geçmiş veri gün sayısı
    const hasDateRange = analysisStartDate && analysisEndDate;
    const hasHistoricalDays = historicalDays && parseInt(historicalDays) > 0;
    
    if (!hasDateRange && !hasHistoricalDays) {
      showAlert('Lütfen analiz tarih aralığını girin VEYA geçmiş veri gün sayısını belirtin', 'warning');
      return;
    }

    setIsLoading(true);
    
    // Tarih hesaplamaları
    let startDate, endDate, historicalCutoffDate;
    
    if (hasDateRange) {
      // Kullanıcı tarih aralığı girmiş
      startDate = analysisStartDate;
      endDate = analysisEndDate;
      const startDateObj = new Date(analysisStartDate);
      const historicalCutoffDateObj = new Date(startDateObj);
      historicalCutoffDateObj.setDate(historicalCutoffDateObj.getDate() - 1);
      historicalCutoffDate = historicalCutoffDateObj.toISOString().slice(0, 10);
    } else {
      // Analiz periyoduna göre otomatik hesaplama
      const today = new Date();
      const histDays = parseInt(historicalDays);
      
      endDate = today.toISOString().slice(0, 10);
      
      const startDateObj = new Date(today);
      // Analiz periyoduna göre gün sayısı belirleme
      let analysisDays;
      switch (analysisPeriod) {
        case 'DAILY':
          analysisDays = 1;
          break;
        case 'WEEKLY':
          analysisDays = 7;
          break;
        case 'MONTHLY':
          analysisDays = 30;
          break;
        case 'CUSTOM':
          analysisDays = 7; // CUSTOM için varsayılan
          break;
        default:
          analysisDays = 1;
      }
      
      startDateObj.setDate(startDateObj.getDate() - analysisDays);
      startDate = startDateObj.toISOString().slice(0, 10);
      
      const historicalCutoffDateObj = new Date(startDateObj);
      historicalCutoffDateObj.setDate(historicalCutoffDateObj.getDate() - 1);
      historicalCutoffDate = historicalCutoffDateObj.toISOString().slice(0, 10);
    }
    
    const requestData = {
      // Temel parametreler
      groupType1: groupType,
      groupType2: groupType, 
      groupType3: groupType,
      analysisPeriod1: analysisPeriod,
      analysisPeriod2: analysisPeriod,
      analysisPeriod3: analysisPeriod,
      analysisPeriod4: analysisPeriod,
      progId: parseInt(progId, 10),
      historicalDays: parseInt(historicalDays, 10),
      
      // Opsiyonel tarih parametreleri - NULL olabilir
      analysisStartDate1: hasDateRange ? startDate.replace(/-/g, '') : null,
      analysisStartDate2: hasDateRange ? startDate.replace(/-/g, '') : null,
      analysisEndDate1: hasDateRange ? endDate.replace(/-/g, '') : null,
      analysisEndDate2: hasDateRange ? endDate.replace(/-/g, '') : null,
      historicalCutoffDate1: hasDateRange ? historicalCutoffDate.replace(/-/g, '') : null,
      historicalCutoffDate2: hasDateRange ? historicalCutoffDate.replace(/-/g, '') : null,
      
      // Gelişmiş parametreler (minExecutionCount kaldırıldı)
      analysisStartDate3: hasDateRange ? startDate.replace(/-/g, '') : null,
      analysisStartDate4: hasDateRange ? startDate.replace(/-/g, '') : null,
      analysisEndDate3: hasDateRange ? endDate.replace(/-/g, '') : null,
      analysisEndDate4: hasDateRange ? endDate.replace(/-/g, '') : null,
      iqrMultiplier1: parseFloat(iqrMultiplier),
      iqrMultiplier2: parseFloat(iqrMultiplier),
      percentileThreshold: parseFloat(percentileThreshold),
      zScoreThreshold: parseFloat(zScoreThreshold),
      modifiedZScoreThreshold: parseFloat(modifiedZScoreThreshold),
      extremeThreshold: parseFloat(extremeThreshold),
      highThreshold: parseFloat(highThreshold),
      moderateThreshold: parseFloat(moderateThreshold),
      globalAnomalyRate: parseFloat(globalAnomalyRate),
      periodSlowdownMultiplier: parseFloat(periodSlowdownMultiplier),
      showAllFlag: showAllFlag
    };

    try {
      const response = await fetch(API_ENDPOINTS.EDW_PROC_LOG_ANOMALY, {
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
        setCurrentPage(1); // Yeni veri geldiğinde sayfa numarasını sıfırla
        
        if (parsedData.length === 0) {
          showAlert('Belirtilen kriterlere uygun anomali bulunamadı.', 'info');
        } else {
          const anomalyCount = parsedData.filter(item => item.anomalyFlag === 'POTENTIAL_ANOMALY').length;
          const globalSlowdown = parsedData.some(item => item.periodType === 'GLOBAL_SLOWDOWN');
          
          if (globalSlowdown) {
            showAlert(`Genel sistem yavaşlığı tespit edildi! ${anomalyCount} anomali bulundu.`, 'danger');
          } else if (anomalyCount > 0) {
            showAlert(`${anomalyCount} adet anomali tespit edildi.`, 'warning');
          } else {
            showAlert('Sistem normal çalışıyor, anomali tespit edilmedi.', 'success');
          }
        }
      } else {
        setProcLogData([]);
        setCurrentPage(1); // Hata durumunda da sayfa numarasını sıfırla
        showAlert('Veri çekme hatası oluştu.', 'danger');
      }
    } catch (error) {
      setProcLogData([]);
      setCurrentPage(1); // Hata durumunda da sayfa numarasını sıfırla
      showAlert('Bağlantı hatası oluştu.', 'danger');
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
      stddevDuration: convertSecondsToMinutes(row.stddevDuration),
      medianDuration: convertSecondsToMinutes(row.medianDuration),
      zScore: row.zScore ? parseFloat(row.zScore).toFixed(2) : '',
      modifiedZScore: row.modifiedZScore ? parseFloat(row.modifiedZScore).toFixed(2) : '',
      deviationPercentage: row.deviationPercentage ? `${row.deviationPercentage}%` : '',
      anomalyRate: row.anomalyRate ? `${row.anomalyRate}%` : ''
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'EXTREME': return '#dc3545'; // Kırmızı
      case 'HIGH': return '#fd7e14'; // Turuncu
      case 'MODERATE': return '#ffc107'; // Sarı
      default: return '#28a745'; // Yeşil
    }
  };

  const getPeriodTypeColor = (periodType) => {
    switch (periodType) {
      case 'GLOBAL_SLOWDOWN': return '#dc3545'; // Kırmızı
      case 'PARTIAL_ANOMALY': return '#fd7e14'; // Turuncu
      case 'ISOLATED_ANOMALY': return '#ffc107'; // Sarı
      default: return '#28a745'; // Yeşil
    }
  };

  const totalPages = Math.ceil(procLogData.length / itemsPerPage);

  // Sayfa numarasını veri değiştiğinde kontrol et ve düzelt
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [procLogData, totalPages, currentPage]);

  const columns = [
    { header: 'Analiz Dönemi', accessor: 'analysisPeriod', truncate: false, tooltip: 'Analiz edilen zaman dilimi' },
    { header: 'Grup', accessor: 'groupKey', truncate: true, maxLength: 20, tooltip: 'Step/Procedure/Package grubu' },
    { header: 'Step ID', accessor: 'stepId', truncate: true, maxLength: 30, tooltip: 'İşlem adımı ID\'si' },
    { header: 'Süre (dk)', accessor: 'duration', truncate: false, tooltip: 'İşlem süresi (dakika)' },
    { header: 'Ort. Süre (dk)', accessor: 'meanDuration', truncate: false, tooltip: 'Ortalama işlem süresi' },
    { header: 'Z-Score', accessor: 'zScore', truncate: false, tooltip: 'İstatistiksel sapma değeri' },
    { header: 'Sapma %', accessor: 'deviationPercentage', truncate: false, tooltip: 'Ortalamadan sapma yüzdesi' },
    { header: 'Önem Derecesi', accessor: 'severityLevel', truncate: false, tooltip: 'Anomali önem seviyesi' },
    { header: 'Dönem Tipi', accessor: 'periodType', truncate: false, tooltip: 'Anomali türü (Global/İzole/Kısmi)' },
    { header: 'Açıklama', accessor: 'anomalyDescription', truncate: true, maxLength: 50, tooltip: 'Anomali açıklaması' },
    { header: 'Öneri', accessor: 'recommendation', truncate: true, maxLength: 50, tooltip: 'Önerilen aksiyon' }
  ];

  const customRowRender = (row) => {
    const processedRow = processRowData(row);
    return {
      ...processedRow,
      severityLevel: (
        <span style={{ color: getSeverityColor(row.severityLevel), fontWeight: 'bold' }}>
          {row.severityLevel}
        </span>
      ),
      periodType: (
        <span style={{ color: getPeriodTypeColor(row.periodType), fontWeight: 'bold' }}>
          {row.periodType}
        </span>
      )
    };
  };

  return (
    <>
      {alertMessage && (
        <CAlert color={alertType} className="mb-3">
          {alertMessage}
        </CAlert>
      )}

      {/* Temel Parametreler */}
      <CRow className="align-items-center mb-3">
        <CCol xs={12}>
          <h5 className="mb-2" style={{ fontSize: '1rem', fontWeight: 600 }}>Temel Parametreler</h5>
        </CCol>
        
        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="progId">Prog ID *</CFormLabel>
          <CTooltip content="İşlem yapılacak programın ID'sini girin" placement="top">
            <CFormInput
              id="progId"
              type="number"
              placeholder="Prog ID"
              value={progId}
              onChange={(e) => setProgId(e.target.value)}
              required
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="groupType">Gruplama Türü</CFormLabel>
          <CTooltip content="Verilerin nasıl gruplandırılacağını seçin" placement="top">
            <CFormSelect
              id="groupType"
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
            >
              <option value="STEP">Step Bazında</option>
              <option value="PROCEDURE">Procedure Bazında</option>
              <option value="PACKAGE">Package Bazında</option>
            </CFormSelect>
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="analysisPeriod">Analiz Periyodu</CFormLabel>
          <CTooltip content="Analiz zaman dilimi. Tarih aralığı girilmezse otomatik hesaplanır: DAILY(-1 gün), WEEKLY(-7 gün), MONTHLY(-30 gün)" placement="top">
            <CFormSelect
              id="analysisPeriod"
              value={analysisPeriod}
              onChange={(e) => setAnalysisPeriod(e.target.value)}
            >
              <option value="DAILY">Günlük</option>
              <option value="WEEKLY">Haftalık</option>
              <option value="MONTHLY">Aylık</option>
              <option value="CUSTOM">Özel</option>
            </CFormSelect>
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="historicalDays">Geçmiş Veri (Gün)</CFormLabel>
          <CTooltip content="İstatistik hesabı için kaç günlük geçmiş veri kullanılacak. Analiz periyodundan bağımsız olarak geçmiş verileri belirler." placement="top">
            <CFormInput
              id="historicalDays"
              type="number"
              value={historicalDays}
              onChange={(e) => setHistoricalDays(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="analysisStartDate">Analiz Başlangıç</CFormLabel>
          <CTooltip content="Opsiyonel: Manuel tarih aralığı için. Boş bırakılırsa analiz periyoduna göre otomatik hesaplanır." placement="top">
            <CFormInput
              id="analysisStartDate"
              type="date"
              value={analysisStartDate}
              onChange={(e) => setAnalysisStartDate(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="analysisEndDate">Analiz Bitiş</CFormLabel>
          <CTooltip content="Opsiyonel: Manuel tarih aralığı için. Boş bırakılırsa bugünün tarihi kullanılır." placement="top">
            <CFormInput
              id="analysisEndDate"
              type="date"
              value={analysisEndDate}
              onChange={(e) => setAnalysisEndDate(e.target.value)}
            />
          </CTooltip>
        </CCol>
      </CRow>

      {/* Gelişmiş Parametreler - Collapsible */}
      <details className="mb-3" style={{ cursor: 'pointer' }}>
        <summary style={{ 
          fontSize: '1rem', 
          fontWeight: 600, 
          color: 'var(--cui-body-color)', 
          listStyle: 'none',
          marginBottom: '0.75rem',
          padding: '0.5rem',
          borderRadius: '4px',
          backgroundColor: 'var(--cui-gray-100, rgba(0,0,0,0.05))'
        }}>
          <span style={{ userSelect: 'none' }}>
            Gelişmiş İstatistik Parametreleri
            <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem', opacity: 0.7 }}>▼</span>
          </span>
        </summary>
        <CRow className="align-items-center mt-2">
          <CCol xs={12} md={2}>
            <CFormLabel htmlFor="zScoreThreshold">Z-Score Eşiği</CFormLabel>
          <CTooltip content="Z-Score anomali tespit eşiği (önerilen: 2.0)" placement="top">
            <CFormInput
              id="zScoreThreshold"
              type="number"
              step="0.1"
              value={zScoreThreshold}
              onChange={(e) => setZScoreThreshold(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="iqrMultiplier">IQR Çarpanı</CFormLabel>
          <CTooltip content="IQR anomali tespit çarpanı (önerilen: 1.5)" placement="top">
            <CFormInput
              id="iqrMultiplier"
              type="number"
              step="0.1"
              value={iqrMultiplier}
              onChange={(e) => setIqrMultiplier(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="globalAnomalyRate">Global Anomali %</CFormLabel>
          <CTooltip content="Genel yavaşlık tespit oranı (önerilen: 75)" placement="top">
            <CFormInput
              id="globalAnomalyRate"
              type="number"
              step="1"
              value={globalAnomalyRate}
              onChange={(e) => setGlobalAnomalyRate(e.target.value)}
            />
          </CTooltip>
        </CCol>

        <CCol xs={12} md={2}>
          <CFormLabel htmlFor="showAllFlag">Gösterim Modu</CFormLabel>
          <CTooltip content="Tüm kayıtları mı sadece anomalileri mi göster" placement="top">
            <CFormSelect
              id="showAllFlag"
              value={showAllFlag}
              onChange={(e) => setShowAllFlag(e.target.value)}
            >
              <option value="ANOMALY_ONLY">Sadece Anomaliler</option>
              <option value="ALL">Tüm Kayıtlar</option>
            </CFormSelect>
          </CTooltip>
        </CCol>

        </CRow>
      </details>

      {/* Analiz Butonu - Ana Konum */}
      <CRow className="mb-3">
        <CCol xs={12} className="text-end">
          <LoadingButton isLoading={isLoading} onClick={fetchProcLogData} size="lg">
            Analiz Et
          </LoadingButton>
        </CCol>
      </CRow>

      {/* Tablo - Sadece veri geldiğinde göster */}
      {procLogData.length > 0 && (
        <CRow className="mt-4">
          <CCol xs={12}>
            <CCard className="shadow-sm" style={{ 
              backgroundColor: 'var(--cui-card-bg)',
              borderColor: 'var(--cui-border-color)',
              borderRadius: '8px'
            }}>
              <CCardHeader style={{ 
                backgroundColor: 'var(--cui-card-cap-bg)',
                borderBottom: '1px solid var(--cui-border-color)',
                borderRadius: '8px 8px 0 0'
              }}>
                <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>
                  Analiz Sonuçları ({procLogData.length} kayıt)
                </h5>
              </CCardHeader>
              <CCardBody>
                          <CustomTable
                  data={procLogData}
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
                  customRowRender={customRowRender}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Veri yoksa bilgilendirme */}
      {procLogData.length === 0 && !isLoading && (
        <CRow className="mt-4">
          <CCol xs={12}>
            <CCard className="shadow-sm" style={{ 
              backgroundColor: 'var(--cui-card-bg)',
              borderColor: 'var(--cui-border-color)',
              borderRadius: '8px'
            }}>
              <CCardBody className="text-center py-5">
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📊</div>
                <h5 className="text-muted mb-2">Analiz Sonuçları Burada Görünecek</h5>
                <p className="text-muted mb-0">
                  Yukarıdaki parametreleri doldurup "Analiz Et" butonuna tıklayın.
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  );
};

export default ProcLogTable;