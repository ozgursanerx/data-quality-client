import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import MonitoringSummary from './components/MonitoringSummary'
import MonitoringForm from './components/MonitoringForm'
import MonitorDetailTable from './components/MonitorDetailTable'

const Monitoring = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Monitoring Summary</CCardHeader>
          <CCardBody>
            <MonitoringSummary />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Monitoring Form</CCardHeader>
          <CCardBody>
            <MonitoringForm />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Monitor Detail Table</CCardHeader>
          <CCardBody>
            <MonitorDetailTable />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Monitoring
