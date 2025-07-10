import React from 'react'
import { createPortal } from 'react-dom'
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons'

const NodeDetailsModal = ({ visible, onClose, nodeData, isFullscreen }) => {
  if (!nodeData) return null

  // Debug log
  console.log('NodeDetailsModal rendered:', { visible, nodeType: nodeData.type, isFullscreen })

  // Modal styles with proper z-index handling
  const modalStyle = {
    zIndex: isFullscreen ? 10001 : 1060, // Higher z-index, especially for fullscreen
    position: 'fixed',
  }

  const renderNodeContent = () => {
    const { type, label, details } = nodeData

    switch (type) {
      case 'source':
        return (
          <CAlert color="info">
            <h5>Kaynak Tablo</h5>
            <p><strong>Tablo:</strong> {label}</p>
            <p><strong>Kolon:</strong> {nodeData.column}</p>
            <p>Bu tablo, data lineage analizinin başlangıç noktasıdır.</p>
          </CAlert>
        )

      case 'package':
        return (
          <div>
            <CCard className="mb-3">
              <CCardHeader>
                <h5>Paket Bilgileri</h5>
              </CCardHeader>
              <CCardBody>
                <p><strong>Paket Adı:</strong> {nodeData.fullName || label}</p>
                <p><strong>Doğrudan Referanslar:</strong> {nodeData.directRefs}</p>
                <p><strong>Dolaylı Referanslar:</strong> {nodeData.indirectRefs}</p>
                <p><strong>Risk Skoru:</strong> 
                  <CBadge 
                    color={nodeData.riskScore > 100 ? 'danger' : nodeData.riskScore > 50 ? 'warning' : 'success'}
                    className="ms-2"
                  >
                    {nodeData.riskScore}
                  </CBadge>
                </p>
              </CCardBody>
            </CCard>
          </div>
        )

      case 'procedure':
        return (
          <div>
            <CCard className="mb-3">
              <CCardHeader>
                <h5>Prosedür Bilgileri</h5>
              </CCardHeader>
              <CCardBody>
                <p><strong>Prosedür Adı:</strong> {label}</p>
                <p><strong>Doğrudan Referanslar:</strong> {nodeData.directRefs}</p>
                <p><strong>Dolaylı Referanslar:</strong> {nodeData.indirectRefs}</p>
                <p><strong>Adım Sayısı:</strong> {nodeData.stepCount}</p>
              </CCardBody>
            </CCard>
          </div>
        )

      case 'step':
        // Debug log to see what data we're receiving
        console.log('Step modal data:', { 
          nodeData, 
          details, 
          directReferences: details?.directReferences,
          indirectReferences: details?.indirectReferences 
        })
        
        // Debug log to see the structure of reference objects
        if (details?.indirectReferences && details.indirectReferences.length > 0) {
          console.log('First indirect reference structure:', details.indirectReferences[0])
          console.log('All indirect references:', details.indirectReferences)
        }
        if (details?.directReferences && details.directReferences.length > 0) {
          console.log('First direct reference structure:', details.directReferences[0])
        }
        
        if (!details) {
          return (
            <CAlert color="warning">
              Bu adım için detay bilgisi bulunamadı.
            </CAlert>
          )
        }

        return (
          <div>
            <CCard className="mb-3">
              <CCardHeader>
                <h5>Adım Bilgileri</h5>
              </CCardHeader>
              <CCardBody>
                <p><strong>Adım ID:</strong> {details.stepId}</p>
                <p><strong>Prosedür:</strong> {details.procedure}</p>
                <p><strong>Satır Numarası:</strong> {details.stepLine}</p>
                <p><strong>Doğrudan Referanslar:</strong> {details.directReferences?.length || 0}</p>
                <p><strong>Dolaylı Referanslar:</strong> {details.indirectReferences?.length || 0}</p>
              </CCardBody>
            </CCard>

            {/* Direct References Table */}
            {details.directReferences && details.directReferences.length > 0 ? (
              <CCard className="mb-3">
                <CCardHeader>
                  <h6>Doğrudan Referanslar ({details.directReferences.length})</h6>
                </CCardHeader>
                <CCardBody>
                  <CTable striped hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>SQL Text</CTableHeaderCell>
                        <CTableHeaderCell>Step ID</CTableHeaderCell>
                        <CTableHeaderCell>Line</CTableHeaderCell>
                        <CTableHeaderCell>Tip</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {details.directReferences.map((ref, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{ref.text || ref.sqlText || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ref.stepId || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ref.line || ref.stepLine || 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="primary">{ref.type || ref.referenceType || 'DIRECT_TABLE_REFERENCE'}</CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            ) : (
              <CCard className="mb-3">
                <CCardHeader>
                  <h6>Doğrudan Referanslar</h6>
                </CCardHeader>
                <CCardBody>
                  <CAlert color="info" className="mb-0">
                    Bu adım için doğrudan referans bulunamadı.
                  </CAlert>
                </CCardBody>
              </CCard>
            )}

            {/* Indirect References Table */}
            {details.indirectReferences && details.indirectReferences.length > 0 ? (
              <CCard>
                <CCardHeader>
                  <h6>Dolaylı Referanslar ({details.indirectReferences.length})</h6>
                </CCardHeader>
                <CCardBody>
                  <CTable striped hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>SQL Text</CTableHeaderCell>
                        <CTableHeaderCell>Step ID</CTableHeaderCell>
                        <CTableHeaderCell>Line</CTableHeaderCell>
                        <CTableHeaderCell>Tip</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {details.indirectReferences.map((ref, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{ref.text || ref.sqlText || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ref.stepId || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ref.line || ref.stepLine || 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="secondary">{ref.type || ref.referenceType || 'INDIRECT_TABLE_REFERENCE'}</CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            ) : (
              <CCard>
                <CCardHeader>
                  <h6>Dolaylı Referanslar</h6>
                </CCardHeader>
                <CCardBody>
                  <CAlert color="info" className="mb-0">
                    Bu adım için dolaylı referans bulunamadı.
                  </CAlert>
                </CCardBody>
              </CCard>
            )}
          </div>
        )

      default:
        return (
          <CAlert color="info">
            Bilinmeyen node tipi: {type}
          </CAlert>
        )
    }
  }

  return (
    <>
      {isFullscreen && visible ? (
        createPortal(
          <div>
            {/* Custom backdrop for fullscreen with !important */}
            <div
              style={{
                position: 'fixed !important',
                top: '0 !important',
                left: '0 !important',
                right: '0 !important',
                bottom: '0 !important',
                width: '100vw !important',
                height: '100vh !important',
                backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
                zIndex: '2147483647 !important',
                display: 'block !important',
                visibility: 'visible !important',
                opacity: '1 !important'
              }}
              onClick={onClose}
            />
            {/* Custom modal for fullscreen with !important */}
            <div
              style={{
                position: 'fixed !important',
                top: '50% !important',
                left: '50% !important',
                transform: 'translate(-50%, -50%) !important',
                width: '90% !important',
                maxWidth: '800px !important',
                maxHeight: '90vh !important',
                backgroundColor: 'white !important',
                borderRadius: '8px !important',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3) !important',
                zIndex: '2147483647 !important',
                display: 'block !important',
                visibility: 'visible !important',
                opacity: '1 !important',
                overflow: 'hidden !important',
                border: '2px solid #007bff !important'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '16px 24px !important',
                borderBottom: '1px solid #dee2e6 !important',
                display: 'flex !important',
                justifyContent: 'space-between !important',
                alignItems: 'center !important',
                backgroundColor: '#f8f9fa !important'
              }}>
                <h5 style={{ 
                  margin: '0 !important', 
                  fontSize: '18px !important', 
                  fontWeight: '500 !important',
                  color: '#333 !important'
                }}>
                  {nodeData.type === 'source' ? 'Kaynak Tablo' : 
                   nodeData.type === 'package' ? 'Paket' : 
                   nodeData.type === 'procedure' ? 'Prosedür' : 'Adım'} Detayları
                </h5>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none !important',
                    border: 'none !important',
                    fontSize: '24px !important',
                    cursor: 'pointer !important',
                    color: '#6c757d !important',
                    padding: '0 !important',
                    width: '30px !important',
                    height: '30px !important',
                    display: 'flex !important',
                    alignItems: 'center !important',
                    justifyContent: 'center !important'
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Modal Body */}
              <div style={{
                padding: '24px !important',
                maxHeight: '70vh !important',
                overflowY: 'auto !important',
                backgroundColor: 'white !important'
              }}>
                {renderNodeContent()}
              </div>
              
              {/* Modal Footer */}
              <div style={{
                padding: '16px 24px !important',
                borderTop: '1px solid #dee2e6 !important',
                display: 'flex !important',
                justifyContent: 'flex-end !important',
                backgroundColor: '#f8f9fa !important'
              }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '8px 16px !important',
                    backgroundColor: '#6c757d !important',
                    color: 'white !important',
                    border: 'none !important',
                    borderRadius: '4px !important',
                    cursor: 'pointer !important',
                    fontSize: '14px !important'
                  }}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      ) : (
        <>
          {visible && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: isFullscreen ? 99998 : 1059,
                display: 'block'
              }}
              onClick={onClose}
            />
          )}
          <CModal
            visible={visible}
            onClose={onClose}
            size="lg"
            keyboard
            scrollable
            backdrop={false}
            style={{
              zIndex: isFullscreen ? 999999 : 1060,
              position: 'fixed',
              display: visible ? 'block' : 'none',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90vh',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <CModalHeader closeButton>
              <CModalTitle>
                {nodeData.type === 'source' ? 'Kaynak Tablo' : 
                 nodeData.type === 'package' ? 'Paket' : 
                 nodeData.type === 'procedure' ? 'Prosedür' : 'Adım'} Detayları
              </CModalTitle>
            </CModalHeader>
            <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {renderNodeContent()}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={onClose}>
                <CIcon icon={cilX} className="me-2" />
                Kapat
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </>
  )
}

export default NodeDetailsModal 