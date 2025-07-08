import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import MonitoringSummary from './components/MonitoringSummary'
import MonitoringForm from './components/MonitoringForm'
import MonitorDetailTable from './components/MonitorDetailTable'
import DaMonitorTypesManager from './components/DaMonitorTypesManager'

const Monitoring = () => {
  return (
    <>
      <style>
        {`
          .table-row-hover:hover {
            background-color: var(--cui-table-hover-bg) !important;
          }
        `}
      </style>
      <CRow>
        <CCol xs={12}>
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
              <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Monitoring Summary</h4>
            </CCardHeader>
            <CCardBody>
              <MonitoringSummary />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
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
              <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>DA Monitor Types Management</h4>
            </CCardHeader>
            <CCardBody>
              <DaMonitorTypesManager />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
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
              <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Monitoring Form</h4>
            </CCardHeader>
            <CCardBody>
              <MonitoringForm />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
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
              <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Monitor Detail Table</h4>
            </CCardHeader>
            <CCardBody>
              <MonitorDetailTable />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Monitoring
