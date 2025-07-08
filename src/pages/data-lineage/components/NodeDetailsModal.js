import React from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCode, cilStorage, cilSettings } from '@coreui/icons'

const NodeDetailsModal = ({ visible, onClose, nodeData }) => {
  if (!nodeData || !nodeData.details) {
    return null
  }

  const { details, label, type } = nodeData

  const getTypeIcon = (type) => {
    switch (type) {
      case 'step':
        return cilCode
      case 'procedure':
        return cilSettings
      default:
        return cilStorage
    }
  }

  const getReferenceTypeColor = (refType) => {
    switch (refType) {
      case 'DIRECT_REFERENCE':
        return 'primary'
      case 'ALIAS_CREATION':
        return 'success'
      case 'ALIAS_USAGE':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const getReferenceTypeLabel = (refType) => {
    switch (refType) {
      case 'DIRECT_REFERENCE':
        return 'Direkt Referans'
      case 'ALIAS_CREATION':
        return 'Alias Oluşturma'
      case 'ALIAS_USAGE':
        return 'Alias Kullanımı'
      default:
        return refType
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl" scrollable>
      <CModalHeader onClose={onClose}>
        <CModalTitle>
          <CIcon icon={getTypeIcon(type)} className="me-2" />
          {label} - Detaylar
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-4">
          <CCol>
            <h5>Özet Bilgiler</h5>
            <div className="d-flex gap-2 mb-3">
              <CBadge color="info">
                Direkt Referans: {details.directReferences?.length || 0}
              </CBadge>
              <CBadge color="warning">
                Dolaylı Referans: {details.indirectReferences?.length || 0}
              </CBadge>
              <CBadge color="secondary">
                Toplam: {(details.directReferences?.length || 0) + (details.indirectReferences?.length || 0)}
              </CBadge>
              {details.procedure && (
                <CBadge color="success">
                  Prosedür: {details.procedure}
                </CBadge>
              )}
              {details.stepLine && (
                <CBadge color="dark">
                  Satır: {details.stepLine}
                </CBadge>
              )}
            </div>
          </CCol>
        </CRow>

        {details.directReferences && details.directReferences.length > 0 && (
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Direkt Referanslar ({details.directReferences.length})</strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {details.directReferences.map((ref, index) => (
                  <CListGroupItem key={index} className="border-0 px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="mb-2">
                          <CBadge color="primary" className="me-2">
                            Satır: {ref.stepLine}
                          </CBadge>
                          <CBadge color="info" className="me-2">
                            {ref.procedure}
                          </CBadge>
                          {ref.occurrences && (
                            <CBadge color="success" className="me-2">
                              {ref.occurrences} kez geçiyor
                            </CBadge>
                          )}
                          <small className="text-muted">{ref.stepId}</small>
                        </div>
                        
                        {ref.references && ref.references.map((reference, refIndex) => (
                          <div key={refIndex} className="mb-3 p-2 bg-light rounded">
                            <div className="mb-1">
                              <CBadge color={getReferenceTypeColor(reference.type)} className="me-2">
                                {getReferenceTypeLabel(reference.type)}
                              </CBadge>
                              <CBadge color="dark" className="me-2">
                                Satır: {reference.line}
                              </CBadge>
                            </div>
                            <code className="small bg-white p-2 d-block rounded border">
                              {reference.text}
                            </code>
                            {reference.originalField && reference.aliasField && (
                              <div className="mt-1">
                                <small className="text-success">
                                  <strong>Alias:</strong> {reference.originalField} → {reference.aliasField}
                                </small>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        )}

        {details.indirectReferences && details.indirectReferences.length > 0 && (
          <CCard>
            <CCardHeader>
              <strong>Dolaylı Referanslar ({details.indirectReferences.length})</strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {details.indirectReferences.map((ref, index) => (
                  <CListGroupItem key={index} className="border-0 px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="mb-2">
                          <CBadge color="warning" className="me-2">
                            Satır: {ref.stepLine}
                          </CBadge>
                          <CBadge color="info" className="me-2">
                            {ref.procedure}
                          </CBadge>
                          {ref.occurrences && (
                            <CBadge color="success" className="me-2">
                              {ref.occurrences} kez geçiyor
                            </CBadge>
                          )}
                          <small className="text-muted">{ref.stepId}</small>
                        </div>
                        
                        {ref.references && ref.references.map((reference, refIndex) => (
                          <div key={refIndex} className="mb-3 p-2 bg-light rounded">
                            <div className="mb-1">
                              <CBadge color={getReferenceTypeColor(reference.type)} className="me-2">
                                {getReferenceTypeLabel(reference.type)}
                              </CBadge>
                              <CBadge color="dark" className="me-2">
                                Satır: {reference.line}
                              </CBadge>
                              {reference.sourceStep && (
                                <CBadge color="primary" className="me-2">
                                  Kaynak: {reference.sourceStep} (Satır: {reference.sourceStepLine})
                                </CBadge>
                              )}
                            </div>
                            <code className="small bg-white p-2 d-block rounded border">
                              {reference.text}
                            </code>
                            {reference.originalField && reference.aliasField && (
                              <div className="mt-1">
                                <small className="text-success">
                                  <strong>Alias:</strong> {reference.originalField} → {reference.aliasField}
                                </small>
                              </div>
                            )}
                            {reference.sourceStep && (
                              <div className="mt-1">
                                <small className="text-primary">
                                  <strong>Kaynak Step:</strong> {reference.sourceStep} (Satır: {reference.sourceStepLine})
                                </small>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Kapat
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default NodeDetailsModal 