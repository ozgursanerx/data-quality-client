import React, { useState } from 'react'
import classNames from 'classnames'
import './Main.css'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CFormLabel,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilUser, cilUserFemale } from '@coreui/icons'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Main = () => {
  const [textInput, setTextInput] = useState('');
  const [startTime, setStartTime] = useState(''); // Start Time için state
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerOid, setCustomerOid] = useState(null);
  const [procLogData, setProcLogData] = useState([]);

  const handleSubmit = async () => {
    const formattedStartTime = startTime.replace(/-/g, '');
    const requestData = {
      progId: parseInt(textInput, 10),
      startTm: formattedStartTime, // Start Time string olarak gönderiliyor
    };

    console.log('Gönderilen Değer:', requestData);

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
      });

      if (response.ok) {
        const rawData = await response.json();
        const parsedData = JSON.parse(rawData[0]); // Dizinin içindeki JSON stringini parse et
        console.log('Response:', parsedData);
        setProcLogData(parsedData);
      } else {
        console.error('Hata:', response.statusText);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Sunucuya bağlanırken bir hata oluştu.');
    }
  };

  const handleCustomerSubmit = async () => {
    const requestData = {
      customerNumber: parseInt(customerNumber, 10),
    };

    console.log('Gönderilen Değer (Customer):', requestData);

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
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response (Customer):', data);
        setCustomerOid(data.customerOid);
      } else {
        console.error('Hata:', response.statusText);
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };

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

          <CRow className="mt-4">
            
          </CRow>

          {/* Proclog Verileri */}
          {procLogData.length > 0 && (
            <CRow className="mt-4">
              <CCol>
                <h5>Proclog Verileri:</h5>
                <ul>
                  {procLogData.map((item, index) => (
                    <li key={index}>
                      <strong>Step ID:</strong> {item.stepId} <br/>
                      <strong>Prog ID:</strong> {item.progId} <br/>
                      <strong>SQL Full Text:</strong> {item.sqlFullText} <br/>
                      <strong>Start Time:</strong> {item.startTm} <br/>
                      <strong>Duration:</strong> {item.duration}
                    </li>
                  ))}
                </ul>
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>

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
  );
};

export default Main;