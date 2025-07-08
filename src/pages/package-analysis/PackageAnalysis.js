import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CFormLabel, CTooltip, CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormSelect } from '@coreui/react';
import LoadingButton from '../../components/LoadingButton';
import CustomTable from '../../components/common/CustomTable';
import PackageStats from './components/PackageStats';
import PackageChart from './components/PackageChart';
import { getPackageList } from '../../services/proclogService';
import { getPackageAnalysis } from '../../services/packageAnalysisService';

const PackageAnalysis = () => {
  const [packageId, setPackageId] = useState('');
  const [packageOptions, setPackageOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ visible: false, row: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Arama filtreleri
  const [searchFilters, setSearchFilters] = useState({
    procedure: '',
    step: '',
    status: ''
  });

  // Unique değerler için state'ler
  const [uniqueValues, setUniqueValues] = useState({
    procedures: [],
    steps: [],
    statuses: []
  });

  // Paket listesi yükle (autocomplete için)
  useEffect(() => {
    getPackageList().then(list => setPackageOptions(list.map(p => p.progId?.toString() || p.packageName || '')));
  }, []);

  useEffect(() => {
    if (packageId) {
      setFilteredOptions(packageOptions.filter(opt => opt.toLowerCase().includes(packageId.toLowerCase())));
    } else {
      setFilteredOptions([]);
    }
  }, [packageId, packageOptions]);

  // Tablo verilerini filtrele
  useEffect(() => {
    let filtered = tableData;
    
    if (searchFilters.procedure) {
      filtered = filtered.filter(row => 
        row.procedure && row.procedure.toLowerCase().includes(searchFilters.procedure.toLowerCase())
      );
    }
    
    if (searchFilters.step) {
      filtered = filtered.filter(row => 
        row.step && row.step.toLowerCase().includes(searchFilters.step.toLowerCase())
      );
    }
    
    if (searchFilters.status) {
      filtered = filtered.filter(row => row.status === searchFilters.status);
    }
    
    setFilteredTableData(filtered);
    setCurrentPage(1); // Filtreleme sonrası ilk sayfaya dön
  }, [tableData, searchFilters]);

  // Unique değerleri hesapla
  useEffect(() => {
    if (tableData.length > 0) {
      const procedures = [...new Set(tableData.map(row => row.procedure).filter(Boolean))].sort();
      const steps = [...new Set(tableData.map(row => row.step).filter(Boolean))].sort();
      const statuses = [...new Set(tableData.map(row => row.status).filter(Boolean))].sort();
      
      setUniqueValues({
        procedures,
        steps,
        statuses
      });
    } else {
      setUniqueValues({
        procedures: [],
        steps: [],
        statuses: []
      });
    }
  }, [tableData]);

  const handleAnalyze = async () => {
    if (!packageId) {
      setError('Lütfen bir paket adı veya ID girin.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getPackageAnalysis({ progId: packageId, date });
      setStats(response.stats);
      setTableData(response.tableData);
      setChartData(response.chartData);
      setHistoryData(response.history || []);
      // Arama filtrelerini sıfırla
      setSearchFilters({ procedure: '', step: '', status: '' });
    } catch (err) {
      setError('Analiz sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!filteredTableData.length) return;
    const headers = Object.keys(filteredTableData[0]);
    const csvRows = [headers.join(','), ...filteredTableData.map(row => headers.map(h => row[h]).join(','))];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `package_analysis_${packageId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSearchChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchFilters({ procedure: '', step: '', status: '' });
  };

  const columns = [
    { header: 'Prosedür', accessor: 'procedure' },
    { header: 'Step', accessor: 'step' },
    { header: 'Süre (sn)', accessor: 'duration' },
    { header: 'Satır Sayısı', accessor: 'rowCount' },
    { header: 'Durum', accessor: 'status' },
    { header: 'Başlangıç', accessor: 'startTime' },
    { header: 'Bitiş', accessor: 'endTime' },
  ];

  return (
    <>
      <style>
        {`
          .table-row-hover:hover {
            background-color: var(--cui-table-hover-bg) !important;
          }
        `}
      </style>
      <CCard className="mb-4 shadow-sm" style={{ 
        backgroundColor: 'var(--cui-card-bg)',
        borderColor: 'var(--cui-border-color)',
        borderRadius: '8px'
      }}>
        <CCardHeader style={{ 
          backgroundColor: 'var(--cui-card-cap-bg)',
          borderBottom: '1px solid var(--cui-border-color)',
          borderRadius: '8px 8px 0 0'
        }}>
          <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Paket Analizi</h4>
        </CCardHeader>
        <CCardBody>
          <CRow className="align-items-end mb-3">
            <CCol xs={12} md={5} lg={4}>
              <CFormLabel htmlFor="packageId">Paket Adı / ID</CFormLabel>
              <CTooltip content="Analiz edilecek paketin adını veya ID'sini girin" placement="top">
                <div style={{ position: 'relative' }}>
                  <CFormInput
                    id="packageId"
                    type="text"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    placeholder="Paket adı veya ID girin"
                    autoComplete="off"
                    onKeyPress={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
                  />
                  {filteredOptions.length > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      zIndex: 10, 
                      background: 'var(--cui-card-bg)', 
                      border: '1px solid var(--cui-border-color)', 
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      width: '100%' 
                    }}>
                      {filteredOptions.slice(0, 8).map(opt => (
                        <div 
                          key={opt} 
                          style={{ 
                            padding: '8px 12px', 
                            cursor: 'pointer',
                            color: 'var(--cui-body-color)',
                            borderBottom: '1px solid var(--cui-border-color-translucent)'
                          }}
                          className="hover-bg-light"
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--cui-gray-100)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          onClick={() => setPackageId(opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CTooltip>
            </CCol>
            <CCol xs={12} md={3} lg={2}>
              <CFormLabel htmlFor="date">Tarih (opsiyonel)</CFormLabel>
              <CFormInput
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </CCol>
            <CCol xs={12} md={2} lg={2}>
              <LoadingButton isLoading={loading} onClick={handleAnalyze} className="mt-3 mt-md-0">
                Analiz Et
              </LoadingButton>
            </CCol>
            <CCol xs={12} md={2} lg={2}>
              <CButton color="secondary" className="mt-3 mt-md-0" onClick={handleExportCSV} disabled={!filteredTableData.length}>
                Export CSV
              </CButton>
            </CCol>
            {error && (
              <CCol xs={12} className="mt-2">
                <div className="alert alert-danger">{error}</div>
              </CCol>
            )}
          </CRow>
          {stats && <PackageStats stats={stats} />}
          
          {!stats && !loading && (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-chart-line fa-3x text-muted"></i>
              </div>
              <h5 className="text-muted">Paket Analizi Yapmak İçin</h5>
              <p className="text-muted mb-3">
                Yukarıdaki forma bir PROG_ID girin ve "Analiz Et" butonuna tıklayın.
              </p>
              <div className="alert alert-info d-inline-block">
                <strong>Örnek PROG_ID'ler:</strong> 171, 172, 173
              </div>
            </div>
          )}
          
          <div className="my-4">
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
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>
                    Prosedür / Step Listesi
                    {filteredTableData.length !== tableData.length && (
                      <span className="badge bg-primary ms-2">
                        {filteredTableData.length} / {tableData.length}
                      </span>
                    )}
                  </h5>
                  {(searchFilters.procedure || searchFilters.step || searchFilters.status) && (
                    <CButton 
                      color="outline-secondary" 
                      size="sm"
                      onClick={clearAllFilters}
                    >
                      <i className="fas fa-times me-1"></i>
                      Filtreleri Temizle
                    </CButton>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                {tableData.length > 0 && (
                  <>
                    {/* Arama Filtreleri */}
                    <CRow className="mb-3">
                      <CCol xs={12} md={4}>
                        <CFormInput
                          value={searchFilters.procedure}
                          onChange={(e) => handleSearchChange('procedure', e.target.value)}
                          size="sm"
                          placeholder={`🔍 Prosedür ara... (${uniqueValues.procedures.length} toplam)`}
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <CFormInput
                          value={searchFilters.step}
                          onChange={(e) => handleSearchChange('step', e.target.value)}
                          size="sm"
                          placeholder={`🔍 Step ara... (${uniqueValues.steps.length} toplam)`}
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <CFormSelect
                          value={searchFilters.status}
                          onChange={(e) => handleSearchChange('status', e.target.value)}
                          size="sm"
                        >
                          <option value="">🔍 Tüm Durumlar ({uniqueValues.statuses.length})</option>
                          {uniqueValues.statuses.map(status => (
                            <option key={status} value={status}>
                              {status === 'SUCCESS' ? 'Başarılı' : 'Hatalı'}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                    
                    <CustomTable
                      data={filteredTableData}
                      columns={columns}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredTableData.length / itemsPerPage)}
                      onPageChange={setCurrentPage}
                      onRowClick={row => setModal({ visible: true, row })}
                    />
                  </>
                )}
                
                {tableData.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-table fa-2x mb-3"></i>
                    <p>Analiz sonuçları burada görüntülenecek</p>
                  </div>
                )}
                
                {tableData.length > 0 && filteredTableData.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-search fa-2x mb-3"></i>
                    <p>Seçilen filtrelere uygun sonuç bulunamadı</p>
                    <CButton 
                      color="link" 
                      onClick={clearAllFilters}
                    >
                      Filtreleri Temizle
                    </CButton>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </div>
          <div className="my-4">
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
                <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Günlük Çalışma Grafiği</h5>
              </CCardHeader>
              <CCardBody>
                {chartData.length > 0 ? (
                  <PackageChart data={chartData} />
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-chart-bar fa-2x mb-3"></i>
                    <p>Grafik verileri burada görüntülenecek</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </div>
          {historyData.length > 0 && (
            <div className="my-4">
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
                  <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Çalışma Geçmişi</h5>
                </CCardHeader>
                <CCardBody>
                  <PackageChart data={historyData.map(h => ({ label: h.date, value: h.duration }))} />
                </CCardBody>
              </CCard>
            </div>
          )}
        </CCardBody>
      </CCard>
      <CModal visible={modal.visible} onClose={() => setModal({ visible: false, row: null })} size="lg">
        <CModalHeader closeButton>Step/Prosedür Detayı</CModalHeader>
        <CModalBody>
          {modal.row && Object.entries(modal.row).map(([k, v]) => (
            <div key={k} className="mb-2"><b>{k}:</b> {v?.toString()}</div>
          ))}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModal({ visible: false, row: null })}>Kapat</CButton>
          <CButton color="primary" onClick={() => { navigator.clipboard.writeText(JSON.stringify(modal.row, null, 2)); }}>Kopyala</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default PackageAnalysis; 