import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CBadge,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilDataTransferDown } from '@coreui/icons'
import DataLineageVisualization from './components/DataLineageVisualization'
import NodeDetailsModal from './components/NodeDetailsModal'
import customerNumberData from '../../../docs/customernumber_dataflow_report.json'
import cardTpData from '../../../docs/card_tp_dataflow_report.json'
import custIdData from '../../../docs/cust_id_dataflow_report.json'
import custIdDataNew from '../../../docs/cust_id_dataflow_report copy.json'
import terminalCardAcceptorData from '../../../docs/terminal_card_acceptor_dataflow_report.json'
import terminalCardAcceptorDataNew from '../../../docs/terminal_card_acceptor_dataflow_report copy.json'
import './DataLineage.css'

// Available data sources
const dataSources = {
  'customernumber': {
    label: 'CUSTOMERNUMBER Analizi',
    data: customerNumberData,
    defaultParams: {
      schema: 'EDW',
      table: 'CLLTN_PLTFRM_CUSTMR_DCSN',
      column: 'CUSTOMERNUMBER'
    }
  },
  'card_tp': {
    label: 'CARD_TP Analizi', 
    data: cardTpData,
    defaultParams: {
      schema: 'SNPADM',
      table: 'CDM.CC_DAILY',
      column: 'CARD_TP'
    }
  },
  'cust_id': {
    label: 'CUST_ID Analizi',
    data: custIdData,
    defaultParams: {
      schema: 'SNPADM',
      table: 'EDWCRM.CRM_WNC_CUSTOMER',
      column: 'CUST_ID'
    }
  },
  'cust_id_new': {
    label: 'CUST_ID Analizi (Yeni Format)',
    data: custIdDataNew,
    defaultParams: {
      schema: 'SNPADM',
      table: 'EDW.DA_CUST',
      column: 'CUST_ID'
    }
  },
  'terminal_card_acceptor': {
    label: 'TERMINAL_CARD_ACCEPTOR Analizi',
    data: terminalCardAcceptorData,
    defaultParams: {
      schema: 'SNPADM',
      table: 'EDW.TRX_ATM',
      column: 'TERMINAL_CARD_ACCEPTOR'
    }
  },
  'terminal_card_acceptor_new': {
    label: 'TERMINAL_CARD_ACCEPTOR Analizi (Yeni Format)',
    data: terminalCardAcceptorDataNew,
    defaultParams: {
      schema: 'SNPADM',
      table: 'EDW.TRX_ATM',
      column: 'TERMINAL_CARD_ACCEPTOR'
    }
  }
}

const DataLineage = () => {
  const [selectedDataSource, setSelectedDataSource] = useState('customernumber')
  const [searchParams, setSearchParams] = useState(dataSources['customernumber'].defaultParams)

  const [lineageData, setLineageData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedNodeData, setSelectedNodeData] = useState(null)

  const handleDataSourceChange = (dataSourceKey) => {
    setSelectedDataSource(dataSourceKey)
    setSearchParams(dataSources[dataSourceKey].defaultParams)
    setLineageData(dataSources[dataSourceKey].data)
  }

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    setLoading(true)
    // Simulate API call - in real scenario, this would call backend
    setTimeout(() => {
      setLineageData(dataSources[selectedDataSource].data)
      setLoading(false)
    }, 500)
  }

  const handleNodeClick = (nodeData) => {
    setSelectedNodeData(nodeData)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedNodeData(null)
  }

  useEffect(() => {
    // Load data on component mount
    setLineageData(dataSources[selectedDataSource].data)
  }, [selectedDataSource])

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Data Lineage Analizi</strong>
              <small className="ms-2">Tablo ve kolon bağımlılık analizi</small>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="dataSource">Veri Kaynağı</CFormLabel>
                    <CFormSelect
                      id="dataSource"
                      value={selectedDataSource}
                      onChange={(e) => handleDataSourceChange(e.target.value)}
                    >
                      {Object.entries(dataSources).map(([key, source]) => (
                        <option key={key} value={key}>
                          {source.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel htmlFor="schema">Şema Adı</CFormLabel>
                    <CFormInput
                      type="text"
                      id="schema"
                      placeholder="Şema adını girin..."
                      value={searchParams.schema}
                      onChange={(e) => handleInputChange('schema', e.target.value)}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="table">Tablo Adı</CFormLabel>
                    <CFormInput
                      type="text"
                      id="table"
                      placeholder="Tablo adını girin..."
                      value={searchParams.table}
                      onChange={(e) => handleInputChange('table', e.target.value)}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="column">Kolon Adı</CFormLabel>
                    <CFormInput
                      type="text"
                      id="column"
                      placeholder="Kolon adını girin..."
                      value={searchParams.column}
                      onChange={(e) => handleInputChange('column', e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={12}>
                    <CButton 
                      color="primary" 
                      onClick={handleSearch}
                      disabled={loading}
                      className="me-2"
                    >
                      <CIcon icon={cilSearch} className="me-2" />
                      {loading ? 'Analiz Ediliyor...' : 'Analiz Et'}
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {lineageData && (
        <CRow>
          <CCol xs={12}>
            <CCard>
              <CCardHeader>
                <strong>
                  <CIcon icon={cilDataTransferDown} className="me-2" />
                  Data Lineage Görselleştirmesi - {dataSources[selectedDataSource].label}
                </strong>
                <div className="ms-auto d-flex">
                  <CBadge color="info" className="me-2">
                    Toplam Paket: {lineageData.summary.totalPackages}
                  </CBadge>
                  <CBadge color="warning" className="me-2">
                    Etkilenen: {lineageData.summary.impactedPackages}
                  </CBadge>
                  <CBadge color="danger">
                    Toplam Etki: {lineageData.summary.totalImpact}
                  </CBadge>
                </div>
              </CCardHeader>
              <CCardBody>
                <CAlert color="info" className="mb-3">
                  <strong>Hedef:</strong> {lineageData.target.schema}.{lineageData.target.table}.{lineageData.target.column}
                  <br />
                  <strong>Analiz Tarihi:</strong> {new Date(lineageData.timestamp).toLocaleString('tr-TR')}
                  <br />
                  <small className="text-muted">💡 Detayları görmek için node'lara tıklayın</small>
                </CAlert>
                <DataLineageVisualization 
                  key={selectedDataSource} 
                  data={lineageData} 
                  onNodeClick={handleNodeClick} 
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <NodeDetailsModal
        visible={modalVisible}
        onClose={handleCloseModal}
        nodeData={selectedNodeData}
      />
    </>
  )
}

export default DataLineage 