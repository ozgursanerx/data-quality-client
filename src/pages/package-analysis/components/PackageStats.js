import React from 'react';
import { CRow, CCol, CCard, CCardBody } from '@coreui/react';

const statCards = [
  { key: 'longestProcedure', label: 'En Uzun Prosedür', color: 'primary' },
  { key: 'longestStep', label: 'En Uzun Step', color: 'success' },
  { key: 'avgDuration', label: 'Ortalama Süre (sn)', color: 'info' },
  { key: 'totalDuration', label: 'Toplam Süre (sn)', color: 'warning' },
  { key: 'totalProcedures', label: 'Toplam Prosedür', color: 'danger' },
  { key: 'totalRows', label: 'Toplam Satır', color: 'secondary' },
];

const PackageStats = ({ stats }) => (
  <CRow className="mb-4">
    {statCards.map((card) => (
      <CCol xs={12} sm={6} md={4} lg={3} xl={2} key={card.key} className="mb-3">
        <CCard className="h-100 shadow-sm" style={{ 
          backgroundColor: 'var(--cui-card-bg)',
          borderColor: 'var(--cui-border-color)',
          borderRadius: '8px'
        }}>
          <CCardBody className="text-center p-3">
            <div 
              className="fw-bold small mb-2" 
              style={{ 
                color: `var(--cui-${card.color})`,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {card.label}
            </div>
            <div 
              className="fw-bold" 
              style={{ 
                fontSize: '1.5rem',
                color: 'var(--cui-body-color)',
                lineHeight: '1.2'
              }}
            >
              {card.key === 'totalRows' && typeof stats[card.key] === 'number' 
                ? stats[card.key].toLocaleString() 
                : stats[card.key]}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    ))}
  </CRow>
);

export default PackageStats; 