import React, { useState } from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import ProcLogChart from '../dashboard/components/ProcLogChart'
import ProcLogTable from '../dashboard/components/ProcLogTable'
import StepIdList from '../dashboard/components/StepIdList'
import PackageList from '../dashboard/components/PackageList'

const ProcLog = () => {
  const [selectedProgId, setSelectedProgId] = useState(null);

  const handlePackageSelect = (progId) => {
    setSelectedProgId(progId);
    // Burada seçilen program ID'sine göre diğer bileşenleri güncelleyebilirsiniz
  };

  return (
    <>
      <CRow className="mb-4">
        <CCol xs={12} md={6}>
          <CCard className="h-100">
            <CCardHeader>Paketler</CCardHeader>
            <CCardBody>
              <PackageList onPackageSelect={handlePackageSelect} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <StepIdList />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Process Log Duration Analysis</CCardHeader>
            <CCardBody>
              <ProcLogChart />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Process Log Data</CCardHeader>
            <CCardBody>
              <ProcLogTable />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ProcLog