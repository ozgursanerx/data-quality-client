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
import ProcedureList from './components/ProcedureList'
import ProcLogTable from './components/ProcLogTable'
import ProcLogChart from './components/ProcLogChart'
import StepIdList from './components/StepIdList'
import PackageList from './components/PackageList'

const ProcLog = () => {
  const [selectedProgId, setSelectedProgId] = useState(null);

  const handlePackageSelect = (progId) => {
    setSelectedProgId(progId);
  };

  return (
    <>
      <style>
        {`
          .table-row-hover:hover {
            background-color: var(--cui-table-hover-bg) !important;
          }
        `}
      </style>
      <CRow className="mb-4">
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
              <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Veri Kaynakları</h4>
            </CCardHeader>
            <CCardBody>
              <CAccordion flush activeItemKey={null}>
                <CAccordionItem itemKey={1}>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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
              <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Process Log Duration Analysis</h4>
            </CCardHeader>
            <CCardBody>
              <ProcLogChart />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <ProcLogTable />
    </>
  )
}

export default ProcLog