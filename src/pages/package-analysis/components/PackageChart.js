import React, { useState } from 'react';

const PackageChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-muted text-center py-4">
        <i className="fas fa-chart-bar fa-2x mb-3"></i>
        <p>Grafik verisi yok</p>
      </div>
    );
  }

  // Maksimum değeri bul
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Başlık */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: 'var(--cui-body-color)',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        Prosedür Süreleri (Saniye)
      </div>

      {/* Horizontal Bar Chart */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '0 10px'
      }}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const isHovered = hoveredIndex === index;
          
          return (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: isHovered ? 'var(--cui-primary-bg)' : 'transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Prosedür Adı */}
              <div style={{
                width: '200px',
                minWidth: '200px',
                fontSize: '12px',
                color: 'var(--cui-body-color)',
                fontWeight: '500',
                textAlign: 'right',
                paddingRight: '12px',
                wordBreak: 'break-word',
                lineHeight: '1.2'
              }}>
                {item.label}
              </div>

              {/* Bar Container */}
              <div style={{
                flex: 1,
                height: '24px',
                backgroundColor: 'var(--cui-border-color)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Bar */}
                <div style={{
                  height: '100%',
                  width: `${percentage}%`,
                  backgroundColor: 'var(--cui-primary)',
                  borderRadius: '12px',
                  transition: 'width 0.5s ease',
                  position: 'relative'
                }}>
                  {/* Değer Etiketi */}
                  <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {item.value}s
                  </div>
                </div>
              </div>

              {/* Yüzde */}
              <div style={{
                width: '60px',
                minWidth: '60px',
                textAlign: 'center',
                fontSize: '11px',
                color: 'var(--cui-text-muted)',
                paddingLeft: '8px'
              }}>
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Açıklama */}
      <div style={{
        textAlign: 'center',
        fontSize: '11px',
        color: 'var(--cui-text-muted)',
        marginTop: '15px',
        fontStyle: 'italic'
      }}>
        En uzun süren prosedür: <strong>{data[0]?.label}</strong> ({data[0]?.value}s)
      </div>
    </div>
  );
};

export default PackageChart; 