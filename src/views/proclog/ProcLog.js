import React, { useState } from 'react'
import { 
  CRow, 
  CCol, 
  CCard, 
  CCardHeader, 
  CCardBody,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody
} from '@coreui/react'
import ProcLogChart from '../dashboard/components/ProcLogChart'
import ProcLogTable from '../dashboard/components/ProcLogTable'
import StepIdList from '../dashboard/components/StepIdList'
import PackageList from '../dashboard/components/PackageList'
import ProcedureList from './components/ProcedureList'

const ProcLog = () => {
  const [selectedProgId, setSelectedProgId] = useState(null);

  const handlePackageSelect = (progId) => {
    setSelectedProgId(progId);
  };

  return (
    <>      <CRow className="mb-4">
        <CCol xs={12}>
          <CAccordion flush activeItemKey={null}>            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Paketler</CAccordionHeader>
              <CAccordionBody>
                <PackageList onPackageSelect={handlePackageSelect} />
              </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={2}>
              <CAccordionHeader>Procedure List</CAccordionHeader>
              <CAccordionBody>
                <ProcedureList />
              </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={3}>
              <CAccordionHeader>Step ID List</CAccordionHeader>
              <CAccordionBody>
                <StepIdList />
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
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