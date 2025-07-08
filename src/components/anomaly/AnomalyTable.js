import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CButtonGroup,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CTooltip
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo, cilCloudDownload, cilThumbUp, cilThumbDown, cilWarning } from '@coreui/icons';
import { getAnomalySeverityColor, formatAnomalyValue } from '../../services/anomalyService';

const AnomalyTable = ({ 
  anomalies = [], 
  loading = false,
  onAnomalyClick = null,
  onFeedback = null,
  showFeedback = true,
  pageSize = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filtreleme ve sıralama
  const filteredAndSortedAnomalies = useMemo(() => {
    let filtered = anomalies.filter(anomaly => {
      const matchesSearch = !searchTerm || 
        anomaly.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomaly.metric_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = !severityFilter || anomaly.severity === severityFilter;
      
      return matchesSearch && matchesSeverity;
    });

    // Sıralama
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [anomalies, searchTerm, severityFilter, sortField, sortDirection]);

  // Sayfalama
  const totalPages = Math.ceil(filteredAndSortedAnomalies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAnomalies = filteredAndSortedAnomalies.slice(startIndex, startIndex + pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'danger',
      high: 'warning',
      medium: 'info',
      low: 'success'
    };
    
    const labels = {
      critical: 'Kritik',
      high: 'Yüksek',
      medium: 'Orta',
      low: 'Düşük'
    };

    return (
      <CBadge color={colors[severity]} shape="rounded-pill">
        {labels[severity]}
      </CBadge>
    );
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFeedbackClick = (anomaly, feedbackType) => {
    if (onFeedback) {
      onFeedback(anomaly.id, { type: feedbackType });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <CPaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </CPaginationItem>
      );
    }

    return (
      <CPagination align="center" className="mt-3">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          İlk
        </CPaginationItem>
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Önceki
        </CPaginationItem>
        {pages}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Sonraki
        </CPaginationItem>
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          Son
        </CPaginationItem>
      </CPagination>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filtreler */}
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormInput
            placeholder="Anomali ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">Tüm Seviyeler</option>
            <option value="critical">Kritik</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </CFormSelect>
        </CCol>
        <CCol md={3} className="text-end">
          <small className="text-muted">
            {filteredAndSortedAnomalies.length} anomali bulundu
          </small>
        </CCol>
      </CRow>

      {/* Tablo */}
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell 
              scope="col" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('timestamp')}
            >
              Zaman {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('severity')}
            >
              Seviye {sortField === 'severity' && (sortDirection === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">Metrik</CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('value')}
            >
              Değer {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('deviation')}
            >
              Sapma {sortField === 'deviation' && (sortDirection === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('confidence_score')}
            >
              Güven {sortField === 'confidence_score' && (sortDirection === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">Açıklama</CTableHeaderCell>
            <CTableHeaderCell scope="col">İşlemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paginatedAnomalies.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center text-muted py-4">
                {anomalies.length === 0 ? 'Henüz anomali bulunamadı' : 'Filtreye uygun anomali bulunamadı'}
              </CTableDataCell>
            </CTableRow>
          ) : (
            paginatedAnomalies.map((anomaly, index) => (
              <CTableRow key={anomaly.id || index}>
                <CTableDataCell>
                  <small>{formatTimestamp(anomaly.timestamp)}</small>
                </CTableDataCell>
                <CTableDataCell>
                  {getSeverityBadge(anomaly.severity)}
                </CTableDataCell>
                <CTableDataCell>
                  <code>{anomaly.metric_type}</code>
                </CTableDataCell>
                <CTableDataCell>
                  <strong>{formatAnomalyValue(anomaly.value, anomaly.metric_type)}</strong>
                  <br />
                  <small className="text-muted">
                    Beklenen: {formatAnomalyValue(anomaly.expected_value, anomaly.metric_type)}
                  </small>
                </CTableDataCell>
                <CTableDataCell>
                  <span 
                    className={`fw-bold ${anomaly.deviation > 30 ? 'text-danger' : anomaly.deviation > 15 ? 'text-warning' : 'text-info'}`}
                  >
                    {anomaly.deviation}%
                  </span>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <div 
                      className="bg-primary rounded me-2" 
                      style={{ 
                        width: `${anomaly.confidence_score * 100}%`, 
                        height: '4px',
                        minWidth: '20px'
                      }}
                    ></div>
                    <small>{(anomaly.confidence_score * 100).toFixed(0)}%</small>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CTooltip content={anomaly.description}>
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                      {anomaly.description}
                    </span>
                  </CTooltip>
                </CTableDataCell>
                <CTableDataCell>
                  <CButtonGroup size="sm">
                    {onAnomalyClick && (
                      <CTooltip content="Detayları Görüntüle">
                        <CButton
                          color="info"
                          variant="ghost"
                          onClick={() => onAnomalyClick(anomaly)}
                        >
                          <CIcon icon={cilInfo} />
                        </CButton>
                      </CTooltip>
                    )}
                    
                    {showFeedback && onFeedback && (
                      <>
                        <CTooltip content="Doğru Anomali">
                          <CButton
                            color="success"
                            variant="ghost"
                            onClick={() => handleFeedbackClick(anomaly, 'true_positive')}
                          >
                            <CIcon icon={cilThumbUp} />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="Yanlış Anomali">
                          <CButton
                            color="danger"
                            variant="ghost"
                            onClick={() => handleFeedbackClick(anomaly, 'false_positive')}
                          >
                            <CIcon icon={cilThumbDown} />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="İnceleme Gerekli">
                          <CButton
                            color="warning"
                            variant="ghost"
                            onClick={() => handleFeedbackClick(anomaly, 'needs_investigation')}
                          >
                            <CIcon icon={cilWarning} />
                          </CButton>
                        </CTooltip>
                      </>
                    )}
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      {/* Sayfalama */}
      {renderPagination()}
    </div>
  );
};

AnomalyTable.propTypes = {
  anomalies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    expected_value: PropTypes.number.isRequired,
    deviation: PropTypes.number.isRequired,
    severity: PropTypes.oneOf(['low', 'medium', 'high', 'critical']).isRequired,
    metric_type: PropTypes.string.isRequired,
    confidence_score: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired
  })),
  loading: PropTypes.bool,
  onAnomalyClick: PropTypes.func,
  onFeedback: PropTypes.func,
  showFeedback: PropTypes.bool,
  pageSize: PropTypes.number
};

export default AnomalyTable; 