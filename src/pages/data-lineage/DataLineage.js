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
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilDataTransferDown, cilReload } from '@coreui/icons'
import DataLineageVisualization from './components/DataLineageVisualization'
import NodeDetailsModal from './components/NodeDetailsModal'
import './DataLineage.css'

const DataLineage = () => {
  const [dataSources, setDataSources] = useState({})
  const [selectedDataSource, setSelectedDataSource] = useState('')
  const [searchParams, setSearchParams] = useState({
    schema: '',
    table: '',
    column: ''
  })

  const [lineageData, setLineageData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedNodeData, setSelectedNodeData] = useState(null)
  const [manifestLoading, setManifestLoading] = useState(true)
  const [manifestError, setManifestError] = useState(null)

  // Load manifest file
  useEffect(() => {
    const loadManifest = async () => {
      try {
        setManifestLoading(true)
        const response = await fetch('/docs/dataflow_manifest.json')
        if (!response.ok) {
          throw new Error('Manifest dosyası yüklenemedi')
        }
        const manifestData = await response.json()
        
        // Convert array to object with dynamic imports
        const sources = {}
        for (const item of manifestData) {
          sources[item.key] = {
            label: item.label,
            file: item.file,
            defaultParams: item.defaultParams,
            data: null // Will be loaded dynamically
          }
        }
        
        setDataSources(sources)
        
        // Set first item as default
        if (manifestData.length > 0) {
          const firstKey = manifestData[0].key
          setSelectedDataSource(firstKey)
          setSearchParams(manifestData[0].defaultParams)
        }
        
      } catch (error) {
        setManifestError(error.message)
      } finally {
        setManifestLoading(false)
      }
    }

    loadManifest()
  }, [])

  // Load data file for selected source
  const loadDataFile = async (dataSourceKey) => {
    if (!dataSources[dataSourceKey] || dataSources[dataSourceKey].data) {
      return dataSources[dataSourceKey]?.data
    }

    try {
      const fileName = dataSources[dataSourceKey].file
      const response = await fetch(`/docs/${fileName}`)
      if (!response.ok) {
        throw new Error(`Veri dosyası yüklenemedi: ${fileName}`)
      }
      const data = await response.json()
      
      // Cache the data
      setDataSources(prev => ({
        ...prev,
        [dataSourceKey]: {
          ...prev[dataSourceKey],
          data: data
        }
      }))
      
      return data
    } catch (error) {
      throw error
    }
  }

  const handleDataSourceChange = async (dataSourceKey) => {
    setSelectedDataSource(dataSourceKey)
    setSearchParams(dataSources[dataSourceKey].defaultParams)
    
    try {
      setLoading(true)
      const data = await loadDataFile(dataSourceKey)
      setLineageData(data)
    } catch (error) {
      // Error handled by UI state
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = async () => {
    if (selectedDataSource) {
      try {
        setLoading(true)
        const data = await loadDataFile(selectedDataSource)
        setLineageData(data)
      } catch (error) {
        // Error handled by UI state
      } finally {
        setLoading(false)
      }
    }
  }

  const handleNodeClick = (nodeData) => {
    setSelectedNodeData(nodeData)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedNodeData(null)
  }

  // Load initial data when component mounts and data source is selected
  useEffect(() => {
    if (selectedDataSource && dataSources[selectedDataSource]) {
      loadDataFile(selectedDataSource).then(data => {
        if (data) setLineageData(data)
      }).catch(() => {
        // Error handled by UI state
      })
    }
  }, [selectedDataSource, dataSources])

  if (manifestLoading) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center">
              <CSpinner />
              <div className="mt-2">Manifest dosyası yükleniyor...</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  if (manifestError) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody>
              <CAlert color="danger">
                <strong>Hata:</strong> {manifestError}
              </CAlert>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

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
                      <option value="">Veri kaynağı seçin...</option>
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
                      disabled={loading || !selectedDataSource}
                      className="me-2"
                    >
                      <CIcon icon={cilSearch} className="me-2" />
                      {loading ? 'Yükleniyor...' : 'Analiz Et'}
                    </CButton>
                    <CButton 
                      color="outline-secondary" 
                      onClick={() => {
                        if (selectedDataSource) {
                          handleDataSourceChange(selectedDataSource)
                        }
                      }}
                      disabled={loading || !selectedDataSource}
                    >
                      <CIcon icon={cilReload} className="me-2" />
                      Yenile
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
                  Data Lineage Görselleştirmesi
                  {selectedDataSource && dataSources[selectedDataSource] && 
                    ` - ${dataSources[selectedDataSource].label}`
                  }
                </strong>
                <div className="ms-auto d-flex">
                  {lineageData.summary && (
                    <>
                      <CBadge color="info" className="me-2">
                        Toplam Paket: {lineageData.summary.totalPackages || 0}
                      </CBadge>
                      <CBadge color="warning" className="me-2">
                        Etkilenen: {lineageData.summary.impactedPackages || 0}
                      </CBadge>
                      <CBadge color="danger">
                        Toplam Etki: {lineageData.summary.totalImpact || 0}
                      </CBadge>
                    </>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                {lineageData.target && (
                  <CAlert color="info" className="mb-3">
                    <strong>Hedef:</strong> {lineageData.target.schema}.{lineageData.target.table}.{lineageData.target.column}
                    <br />
                    <strong>Analiz Tarihi:</strong> {new Date(lineageData.timestamp).toLocaleString('tr-TR')}
                    <br />
                    <small className="text-muted">💡 Detayları görmek için node'lara tıklayın</small>
                  </CAlert>
                )}
                
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