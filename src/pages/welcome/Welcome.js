import React from 'react';
import { 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CRow, 
  CCol,
  CButton,
  CListGroup,
  CListGroupItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilStorage,
  cilMonitor,
  cilPuzzle,
  cilDataTransferDown,
  cilChartLine,
  cilInfo
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import DailyTableStats from './components/DailyTableStats';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'ProcLog Analizi',
      description: 'Process log verilerini analiz edin, anomali tespit edin ve performans metriklerini görüntüleyin.',
      icon: cilStorage,
      path: '/proclog',
      color: 'primary'
    },
    {
      title: 'Monitoring',
      description: 'DA Monitor Types yönetimi ve monitoring verilerini görüntüleyin.',
      icon: cilMonitor,
      path: '/monitoring',
      color: 'success'
    },
    {
      title: 'Paket Analizi',
      description: 'Paket bazlı analiz yapın, procedure ve step performanslarını inceleyin.',
      icon: cilPuzzle,
      path: '/package-analysis',
      color: 'info'
    },
    {
      title: 'Data Lineage',
      description: 'Veri akışını görselleştirin, paket ve procedure ilişkilerini keşfedin.',
      icon: cilDataTransferDown,
      path: '/data-lineage',
      color: 'warning'
    }
  ];

  return (
    <>
      <style>
        {`
          .welcome-hero {
            background: linear-gradient(135deg, var(--cui-primary) 0%, var(--cui-info) 100%);
            color: white;
            padding: 1.5rem 1.5rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .feature-card {
            transition: transform 0.2s, box-shadow 0.2s;
            height: 100%;
            cursor: pointer;
          }
          .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          }
          .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
        `}
      </style>

      {/* Hero Section */}
      <CRow className="mb-2">
          <CCol xs={12}>
            <div className="welcome-hero text-center">
              <h2 className="mb-1" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                <CIcon icon={cilChartLine} className="me-2" />
                EDW Flowlytics
              </h2>
              <p className="mb-0" style={{ fontSize: '0.95rem', opacity: 0.95 }}>
                Veri kalitesi analizi ve monitoring için kapsamlı çözümler
              </p>
            </div>
          </CCol>
        </CRow>

        {/* Daily Table Statistics */}
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
                <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>
                  <CIcon icon={cilChartLine} className="me-2" />
                  Günlük Tablo İstatistikleri
                </h5>
              </CCardHeader>
              <CCardBody>
                <DailyTableStats />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Features Grid */}
        <CRow className="g-4 mb-4">
          {features.map((feature, index) => (
            <CCol key={index} xs={12} md={6} lg={3}>
              <CCard 
                className="feature-card shadow-sm h-100"
                onClick={() => navigate(feature.path)}
                style={{ 
                  backgroundColor: 'var(--cui-card-bg)',
                  borderColor: 'var(--cui-border-color)',
                  borderRadius: '8px'
                }}
              >
                <CCardHeader 
                  className="text-center"
                  style={{ 
                    backgroundColor: 'var(--cui-card-cap-bg)',
                    borderBottom: '1px solid var(--cui-border-color)',
                    borderRadius: '8px 8px 0 0'
                  }}
                >
                  <CIcon 
                    icon={feature.icon} 
                    className={`feature-icon text-${feature.color}`}
                  />
                  <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>
                    {feature.title}
                  </h5>
                </CCardHeader>
                <CCardBody className="d-flex flex-column">
                  <p className="text-muted flex-grow-1">
                    {feature.description}
                  </p>
                  <CButton 
                    color={feature.color} 
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(feature.path);
                    }}
                  >
                    Sayfaya Git
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>

        {/* Quick Info */}
        <CRow>
          <CCol xs={12} md={6}>
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
                <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>
                  <CIcon icon={cilInfo} className="me-2" />
                  Sistem Özellikleri
                </h5>
              </CCardHeader>
              <CCardBody>
                <CListGroup flush>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    <strong>ProcLog Analizi:</strong> Anomali tespiti ve performans analizi
                  </CListGroupItem>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    <strong>Monitoring:</strong> DA Monitor Types yönetimi ve izleme
                  </CListGroupItem>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    <strong>Paket Analizi:</strong> Procedure ve step bazlı detaylı analiz
                  </CListGroupItem>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    <strong>Data Lineage:</strong> Görsel veri akış haritası
                  </CListGroupItem>
                </CListGroup>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} md={6}>
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
                <h5 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>
                  <CIcon icon={cilInfo} className="me-2" />
                  Hızlı Başlangıç
                </h5>
              </CCardHeader>
              <CCardBody>
                <CListGroup flush>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    1. <strong>ProcLog Analizi</strong> ile anomali tespiti yapın
                  </CListGroupItem>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    2. <strong>Monitoring</strong> sayfasından monitor types yönetin
                  </CListGroupItem>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    3. <strong>Paket Analizi</strong> ile detaylı performans metriklerini görüntüleyin
                  </CListGroupItem>
                  <CListGroupItem style={{ backgroundColor: 'transparent', borderColor: 'var(--cui-border-color)' }}>
                    4. <strong>Data Lineage</strong> ile veri akışını görselleştirin
                  </CListGroupItem>
                </CListGroup>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
    </>
  );
};

export default Welcome;

