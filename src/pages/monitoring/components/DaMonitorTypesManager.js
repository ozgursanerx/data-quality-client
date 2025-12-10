import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CAlert,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButtonGroup,
  CTooltip,
  CInputGroup,
  CInputGroupText,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilReload,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
} from '@coreui/icons';
import {
  getDaMonitorTypes,
  saveOrUpdateDaMonitorTypes,
  deactivateDaMonitorTypes,
  getDeleteConfirmationByTypeId,
  deleteByTypeIdWithConfirmation,
} from '../../../services/monitoringService';

const DaMonitorTypesManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({
    typeId: '',
    scenarioNm: '',
    dtlTableNm: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    typeId: '',
    scenarioNm: '',
    srcTableNm: '',
    dtlTableNm: '',
    controlDesc: '',
    controlTp: '',
    errCode: '',
    activeF: 1,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await getDaMonitorTypes(filters);
      setData(response);
    } catch (error) {
      showAlert('Veri yüklenirken hata oluştu: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, color = 'success') => {
    setAlert({ show: true, message, color });
    setTimeout(() => setAlert({ show: false, message: '', color: 'success' }), 5000);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Arama yapıldığında sayfa numarasını sıfırla
    const filters = {};
    if (searchFilters.typeId) filters.typeId = parseInt(searchFilters.typeId);
    if (searchFilters.scenarioNm) filters.scenarioNm = searchFilters.scenarioNm;
    if (searchFilters.dtlTableNm) filters.dtlTableNm = searchFilters.dtlTableNm;
    
    loadData(filters);
  };

  const handleClearSearch = () => {
    setSearchFilters({ typeId: '', scenarioNm: '', dtlTableNm: '' });
    setCurrentPage(1); // Temizleme yapıldığında sayfa numarasını sıfırla
    loadData();
  };

  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedRecord(record);
    
    if (mode === 'add') {
      setFormData({
        typeId: '',
        scenarioNm: '',
        srcTableNm: '',
        dtlTableNm: '',
        controlDesc: '',
        controlTp: '',
        errCode: '',
        activeF: 1,
      });
    } else if (mode === 'edit' && record) {
      setFormData({
        typeId: record.typeId,
        scenarioNm: record.scenarioNm || '',
        srcTableNm: record.srcTableNm || '',
        dtlTableNm: record.dtlTableNm || '',
        controlDesc: record.controlDesc || '',
        controlTp: record.controlTp || '',
        errCode: record.errCode || '',
        activeF: record.activeF !== undefined ? record.activeF : 1,
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
    setFormData({
      typeId: '',
      scenarioNm: '',
      srcTableNm: '',
      dtlTableNm: '',
      controlDesc: '',
      controlTp: '',
      errCode: '',
      activeF: 1,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.typeId) {
      errors.typeId = 'Type ID zorunludur';
    }
    if (!formData.scenarioNm) {
      errors.scenarioNm = 'Senaryo adı zorunludur';
    }
    if (!formData.srcTableNm) {
      errors.srcTableNm = 'Kaynak tablo adı zorunludur';
    }
    if (!formData.dtlTableNm) {
      errors.dtlTableNm = 'Detay tablo adı zorunludur';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await saveOrUpdateDaMonitorTypes(formData);
      
      if (response.result === 'SUCCESS') {
        showAlert(
          modalMode === 'add' 
            ? 'Kayıt başarıyla eklendi' 
            : 'Kayıt başarıyla güncellendi',
          'success'
        );
        closeModal();
        loadData();
      } else {
        showAlert(response.errorDescription || 'İşlem başarısız', 'danger');
      }
    } catch (error) {
      showAlert('İşlem sırasında hata oluştu: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (record) => {
    setLoading(true);
    try {
      if (record.activeF === 1) {
        // Deactivate
        const response = await deactivateDaMonitorTypes({
          typeId: record.typeId,
          scenarioNm: record.scenarioNm,
          srcTableNm: record.srcTableNm,
          dtlTableNm: record.dtlTableNm,
        });
        
        if (response.result === 'SUCCESS') {
          showAlert('Kayıt başarıyla pasif hale getirildi', 'success');
          loadData();
        } else {
          showAlert(response.errorDescription || 'İşlem başarısız', 'danger');
        }
      } else {
        // Activate - update with activeF = 1 (null veya 0 durumunda aktif yap)
        const updatedRecord = { ...record, activeF: 1 };
        const response = await saveOrUpdateDaMonitorTypes(updatedRecord);
        
        if (response.result === 'SUCCESS') {
          const statusMessage = record.activeF === null || record.activeF === undefined 
            ? 'Kayıt başarıyla aktif hale getirildi (Tanımsız -> Aktif)' 
            : 'Kayıt başarıyla aktif hale getirildi';
          showAlert(statusMessage, 'success');
          loadData();
        } else {
          showAlert(response.errorDescription || 'İşlem başarısız', 'danger');
        }
      }
    } catch (error) {
      showAlert('İşlem sırasında hata oluştu: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      const response = await deleteByTypeIdWithConfirmation({
        typeId: selectedRecord.typeId,
        confirmed: true,
      });
      
      if (response.result === 'SUCCESS') {
        showAlert('Kayıt başarıyla silindi', 'success');
        setShowDeleteModal(false);
        setSelectedRecord(null);
        loadData();
      } else {
        showAlert(response.errorDescription || 'Silme işlemi başarısız', 'danger');
      }
    } catch (error) {
      showAlert('Silme işlemi sırasında hata oluştu: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Pagination hesaplamaları
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Sayfa numarasını veri değiştiğinde kontrol et ve düzelt
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [data, totalPages, currentPage]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPages = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxPages - 1);

    if (start > 1) {
      pages.push(
        <CPaginationItem key="start-ellipsis" onClick={() => setCurrentPage(1)}>
          1...
        </CPaginationItem>
      );
    }

    for (let i = start; i <= end; i++) {
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

    if (end < totalPages) {
      pages.push(
        <CPaginationItem key="end-ellipsis" onClick={() => setCurrentPage(totalPages)}>
          ...{totalPages}
        </CPaginationItem>
      );
    }

    return pages;
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>
              <h5 className="mb-0">DA Monitor Types Yönetimi</h5>
            </CCol>
            <CCol xs="auto">
              <CButton
                color="primary"
                onClick={() => openModal('add')}
                className="me-2"
              >
                <CIcon icon={cilPlus} className="me-1" />
                Yeni Ekle
              </CButton>
              <CButton
                color="secondary"
                onClick={() => loadData()}
                disabled={loading}
              >
                <CIcon icon={cilReload} className="me-1" />
                Yenile
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <CAlert color={alert.color} dismissible onClose={() => setAlert({ show: false, message: '', color: 'success' })}>
              {alert.message}
            </CAlert>
          )}

          {/* Search Filters */}
          <CCard className="mb-3">
            <CCardBody>
              <CRow className="g-3">
                <CCol md={3}>
                  <CFormLabel>Type ID</CFormLabel>
                  <CFormInput
                    type="number"
                    value={searchFilters.typeId}
                    onChange={(e) => setSearchFilters({ ...searchFilters, typeId: e.target.value })}
                    placeholder="Type ID"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Senaryo Adı</CFormLabel>
                  <CFormInput
                    value={searchFilters.scenarioNm}
                    onChange={(e) => setSearchFilters({ ...searchFilters, scenarioNm: e.target.value })}
                    placeholder="Senaryo adı"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Detay Tablo Adı</CFormLabel>
                  <CFormInput
                    value={searchFilters.dtlTableNm}
                    onChange={(e) => setSearchFilters({ ...searchFilters, dtlTableNm: e.target.value })}
                    placeholder="Detay tablo adı"
                  />
                </CCol>
                <CCol md={3} className="d-flex align-items-end">
                  <CButtonGroup>
                    <CButton color="info" onClick={handleSearch}>
                      <CIcon icon={cilSearch} className="me-1" />
                      Ara
                    </CButton>
                    <CButton color="secondary" onClick={handleClearSearch}>
                      Temizle
                    </CButton>
                  </CButtonGroup>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Data Table */}
          {loading ? (
            <div className="text-center p-4">
              <CSpinner color="primary" />
              <div className="mt-2">Yükleniyor...</div>
            </div>
          ) : (
            <>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Type ID</CTableHeaderCell>
                    <CTableHeaderCell>Senaryo Adı</CTableHeaderCell>
                    <CTableHeaderCell>Kaynak Tablo</CTableHeaderCell>
                    <CTableHeaderCell>Detay Tablo</CTableHeaderCell>
                    <CTableHeaderCell>Kontrol Açıklaması</CTableHeaderCell>
                    <CTableHeaderCell>Kontrol Tipi</CTableHeaderCell>
                    <CTableHeaderCell>Hata Kodu</CTableHeaderCell>
                    <CTableHeaderCell>Durum</CTableHeaderCell>
                    <CTableHeaderCell>İşlemler</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="9" className="text-center">
                        Kayıt bulunamadı
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    currentData.map((record, index) => {
                      return (
                        <CTableRow key={startIndex + index}>
                          <CTableDataCell>{record.typeId}</CTableDataCell>
                          <CTableDataCell>
                            <CTooltip content={record.scenarioNm || ''}>
                              <span>{truncateText(record.scenarioNm)}</span>
                            </CTooltip>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CTooltip content={record.srcTableNm || ''}>
                              <span>{truncateText(record.srcTableNm)}</span>
                            </CTooltip>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CTooltip content={record.dtlTableNm || ''}>
                              <span>{truncateText(record.dtlTableNm)}</span>
                            </CTooltip>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CTooltip content={record.controlDesc || ''}>
                              <span>{truncateText(record.controlDesc)}</span>
                            </CTooltip>
                          </CTableDataCell>
                          <CTableDataCell>{record.controlTp}</CTableDataCell>
                          <CTableDataCell>{record.errCode}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={
                              record.activeF === 1 ? 'success' : 
                              record.activeF === 0 ? 'secondary' : 
                              'warning'
                            }>
                              {record.activeF === 1 ? 'Aktif' : 
                               record.activeF === 0 ? 'Pasif' : 
                               'Tanımsız'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButtonGroup size="sm">
                              <CTooltip content="Düzenle">
                                <CButton
                                  color="warning"
                                  variant="outline"
                                  onClick={() => openModal('edit', record)}
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                              </CTooltip>
                              <CTooltip content={
                                record.activeF === 1 ? 'Pasif Yap' : 
                                record.activeF === 0 ? 'Aktif Yap' : 
                                'Aktif Yap'
                              }>
                                <CButton
                                  color={
                                    record.activeF === 1 ? 'secondary' : 
                                    record.activeF === 0 ? 'success' : 
                                    'success'
                                  }
                                  variant="outline"
                                  onClick={() => handleToggleActive(record)}
                                >
                                  <CIcon icon={
                                    record.activeF === 1 ? cilXCircle : 
                                    record.activeF === 0 ? cilCheckCircle : 
                                    cilCheckCircle
                                  } />
                                </CButton>
                              </CTooltip>
                              <CTooltip content="Sil">
                                <CButton
                                  color="danger"
                                  variant="outline"
                                  onClick={() => handleDelete(record)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTooltip>
                            </CButtonGroup>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })
                  )}
                </CTableBody>
              </CTable>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <CPagination aria-label="Page navigation">
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    >
                      İlk
                    </CPaginationItem>
                    {renderPagination()}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      Son
                    </CPaginationItem>
                  </CPagination>
                  <div className="ms-3 d-flex align-items-center">
                    <small className="text-muted">
                      Sayfa {currentPage} / {totalPages} (Toplam {data.length} kayıt)
                    </small>
                  </div>
                </div>
              )}
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Add/Edit Modal */}
      <CModal visible={showModal} onClose={closeModal} size="lg">
        <CModalHeader>
          <CModalTitle>
            {modalMode === 'add' ? 'Yeni Monitor Type Ekle' : 'Monitor Type Düzenle'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Type ID *</CFormLabel>
                <CFormInput
                  type="number"
                  value={formData.typeId}
                  onChange={(e) => setFormData({ ...formData, typeId: parseInt(e.target.value) || '' })}
                  invalid={!!formErrors.typeId}
                  disabled={modalMode === 'edit'}
                />
                {formErrors.typeId && <div className="invalid-feedback">{formErrors.typeId}</div>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Durum</CFormLabel>
                <CFormSelect
                  value={formData.activeF}
                  onChange={(e) => setFormData({ ...formData, activeF: parseInt(e.target.value) })}
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Pasif</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Senaryo Adı *</CFormLabel>
                <CFormInput
                  value={formData.scenarioNm}
                  onChange={(e) => setFormData({ ...formData, scenarioNm: e.target.value })}
                  invalid={!!formErrors.scenarioNm}
                />
                {formErrors.scenarioNm && <div className="invalid-feedback">{formErrors.scenarioNm}</div>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Kaynak Tablo Adı *</CFormLabel>
                <CFormInput
                  value={formData.srcTableNm}
                  onChange={(e) => setFormData({ ...formData, srcTableNm: e.target.value })}
                  invalid={!!formErrors.srcTableNm}
                />
                {formErrors.srcTableNm && <div className="invalid-feedback">{formErrors.srcTableNm}</div>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Detay Tablo Adı *</CFormLabel>
                <CFormInput
                  value={formData.dtlTableNm}
                  onChange={(e) => setFormData({ ...formData, dtlTableNm: e.target.value })}
                  invalid={!!formErrors.dtlTableNm}
                />
                {formErrors.dtlTableNm && <div className="invalid-feedback">{formErrors.dtlTableNm}</div>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Kontrol Tipi</CFormLabel>
                <CFormInput
                  value={formData.controlTp}
                  onChange={(e) => setFormData({ ...formData, controlTp: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Hata Kodu</CFormLabel>
                <CFormInput
                  value={formData.errCode}
                  onChange={(e) => setFormData({ ...formData, errCode: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Kontrol Açıklaması</CFormLabel>
                <CFormTextarea
                  rows={3}
                  value={formData.controlDesc}
                  onChange={(e) => setFormData({ ...formData, controlDesc: e.target.value })}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            İptal
          </CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={loading}>
            {loading && <CSpinner size="sm" className="me-2" />}
            {modalMode === 'add' ? 'Ekle' : 'Güncelle'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilWarning} className="me-2 text-warning" />
            Silme Onayı
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            <strong>Type ID {selectedRecord?.typeId}</strong> kaydını silmek istediğinize emin misiniz?
          </p>
          <p className="text-muted">
            Bu işlem geri alınamaz ve tüm ilgili veriler kalıcı olarak silinecektir.
          </p>
          {selectedRecord && (
            <div className="bg-light p-3 rounded">
              <strong>Silinecek Kayıt:</strong><br />
              Senaryo: {selectedRecord.scenarioNm}<br />
              Kaynak Tablo: {selectedRecord.srcTableNm}<br />
              Detay Tablo: {selectedRecord.dtlTableNm}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={loading}>
            {loading && <CSpinner size="sm" className="me-2" />}
            Sil
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DaMonitorTypesManager; 