import React, { useState } from 'react'
import classNames from 'classnames'
import './Main.css'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CRow,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Main = () => {
  const [textInput, setTextInput] = useState('')
  const [startTime, setStartTime] = useState('') // Start Time için state
  const [customerNumber, setCustomerNumber] = useState('')
  const [customerOid, setCustomerOid] = useState(null)
  const [procLogData, setProcLogData] = useState([])
  const [selectedSqlText, setSelectedSqlText] = useState('') // Modal için seçilen SQL metni
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSubmit = async () => {
    const formattedStartTime = startTime.replace(/-/g, '')
    const requestData = {
      progId: parseInt(textInput, 10),
      startTm: formattedStartTime, // Start Time string olarak gönderiliyor
    }

    console.log('Gönderilen Değer:', requestData)

    try {
      const response = await fetch('/edwapi/getEdwProcLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
        mode: 'cors',
      })

      if (response.ok) {
        const rawData = await response.json()
        const parsedData = JSON.parse(rawData[0]) // Dizinin içindeki JSON stringini parse et
        console.log('Response:', parsedData)
        setProcLogData(parsedData)
      } else {
        console.error('Hata:', response.statusText)
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Sunucuya bağlanırken bir hata oluştu.')
    }
  }

  const handleCustomerSubmit = async () => {
    const requestData = {
      customerNumber: parseInt(customerNumber, 10),
    }

    console.log('Gönderilen Değer (Customer):', requestData)

    try {
      const response = await fetch('/edwapi/getCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
        mode: 'cors',
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Response (Customer):', data)
        setCustomerOid(data.customerOid)
      } else {
        console.error('Hata:', response.statusText)
      }
    } catch (error) {
      console.error('Hata:', error)
    }
  }
  const handleShowFullText = (sqlText) => {
    setSelectedSqlText(sqlText)
    setIsModalVisible(true)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = procLogData.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(procLogData.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="align-items-center">
            {/* Prog ID */}
            <CCol xs={12} md={5}>
              <CFormLabel htmlFor="textInput">Prog ID</CFormLabel>
              <CFormInput
                id="textInput"
                type="number"
                placeholder="Prog ID girin"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </CCol>

            {/* Start Time */}
            <CCol xs={12} md={5}>
              <CFormLabel htmlFor="startTime">Start Time</CFormLabel>
              <CFormInput
                id="startTime"
                type="date"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </CCol>

            <CCol className="mt-4" xs={12} md={2}>
              <CButton color="primary" onClick={handleSubmit}>
                Gönder
              </CButton>
            </CCol>
          </CRow>

          <CRow className="mt-4"></CRow>

          {/* Proclog Verileri */}
          <CRow className="mt-4">
            {procLogData.length > 0 && (
              <CCol>
                <h5>Proclog Verileri:</h5>
                <CTable striped hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Step ID</CTableHeaderCell>
                      <CTableHeaderCell>Prog ID</CTableHeaderCell>
                      <CTableHeaderCell>SQL Full Text</CTableHeaderCell>
                      <CTableHeaderCell>Start Time</CTableHeaderCell>
                      <CTableHeaderCell>Duration</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentItems.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{item.stepId}</CTableDataCell>
                        <CTableDataCell>{item.progId}</CTableDataCell>
                        <CTableDataCell>
                          {item.sqlFullText.length > 100
                            ? `${item.sqlFullText.substring(0, 100)}... `
                            : item.sqlFullText}
                          {item.sqlFullText.length > 100 && (
                            <CButton
                              color="link"
                              onClick={() => handleShowFullText(item.sqlFullText)}
                            >
                              Devamını Göster
                            </CButton>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{item.startTm}</CTableDataCell>
                        <CTableDataCell>{item.duration}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CPagination className="justify-content-center">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <CPaginationItem
                      key={index}
                      active={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>

      <CModal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <CModalHeader>SQL Full Text</CModalHeader>
        <CModalBody>
          <pre>{selectedSqlText}</pre>
        </CModalBody>
        <CModalFooter>
          {/* Kopyala Butonu */}
          <CButton
            color="primary"
            onClick={() => {
              navigator.clipboard.writeText(selectedSqlText)
              alert('SQL Full Text kopyalandı!')
            }}
          >
            Kopyala
          </CButton>
          {/* Kapat Butonu */}
          <CButton color="secondary" onClick={() => setIsModalVisible(false)}>
            Kapat
          </CButton>
        </CModalFooter>
      </CModal>

      <CCard className="mb-4">
        <CCardBody>
          <CRow className="align-items-center">
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="customerNumber">Müşteri Numarası</CFormLabel>
              <CFormInput
                id="customerNumber"
                type="number"
                placeholder="Müşteri numarası girin"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
              />
            </CCol>
            <CCol xs={12} md={4}>
              <CButton color="primary" onClick={handleCustomerSubmit} className="mt-4">
                Müşteri Bilgisi Al
              </CButton>
            </CCol>
            <CCol xs={12} md={4} className="d-flex align-items-center">
              {customerOid && (
                <div className="alert alert-info oid-box">
                  <strong>OID:</strong> {customerOid}
                </div>
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <WidgetsDropdown className="mb-4" />
    </>
  )
}

export default Main
