import React from 'react'
import { Handle, Position } from 'reactflow'
import { CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilMinus } from '@coreui/icons'

const CustomNode = ({ data, selected }) => {
  const getNodeStyle = (type, viewMode, isExpanded) => {
    const baseStyle = {
      padding: '12px',
      borderRadius: '8px',
      border: '2px solid',
      background: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: selected ? '0 0 0 2px #007bff' : '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }

    const typeStyles = {
      source: {
        borderColor: '#2196f3',
        backgroundColor: '#e3f2fd',
        minWidth: viewMode === 'simplified' ? '180px' : '300px',
        minHeight: viewMode === 'simplified' ? '80px' : '100px',
      },
      package: {
        borderColor: '#ff9800',
        backgroundColor: '#fff3e0',
        minWidth: viewMode === 'simplified' ? '180px' : '240px',
        minHeight: viewMode === 'simplified' ? '80px' : '100px',
      },
      procedure: {
        borderColor: '#4caf50',
        backgroundColor: '#e8f5e8',
        minWidth: viewMode === 'simplified' ? '180px' : '280px',
        minHeight: viewMode === 'simplified' ? '80px' : '100px',
      },
      step: {
        borderColor: '#9c27b0',
        backgroundColor: '#f3e5f5',
        minWidth: viewMode === 'simplified' ? '140px' : '200px',
        minHeight: viewMode === 'simplified' ? '60px' : '80px',
      },
    }

    return { ...baseStyle, ...typeStyles[type] }
  }

  const getExpandIcon = (type, isExpanded) => {
    if (type === 'source') return null
    if (type === 'step') return null
    
    return (
      <div 
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}
      >
        <CIcon 
          icon={isExpanded ? cilMinus : cilPlus} 
          size="sm"
          style={{ color: '#666' }}
        />
      </div>
    )
  }

  const handleNodeClick = () => {
    if (data.onNodeClick) {
      data.onNodeClick(data)
    }
  }

  const renderTooltipContent = () => {
    const { type, directRefs, indirectRefs, riskScore, isExpanded } = data
    
    let statusText = ''
    if (type === 'package') {
      statusText = isExpanded ? 'Açık (Prosedürler gösteriliyor)' : 'Kapalı (Prosedürleri görmek için tıklayın)'
    } else if (type === 'procedure') {
      statusText = isExpanded ? 'Açık (Adımlar gösteriliyor)' : 'Kapalı (Adımları görmek için tıklayın)'
    } else if (type === 'step') {
      statusText = 'Detayları görmek için tıklayın'
    }

    return (
      <div>
        <div><strong>Tip:</strong> {type === 'source' ? 'Kaynak Tablo' : type === 'package' ? 'Paket' : type === 'procedure' ? 'Prosedür' : 'Adım'}</div>
        <div><strong>Doğrudan Ref:</strong> {directRefs}</div>
        <div><strong>Dolaylı Ref:</strong> {indirectRefs}</div>
        {riskScore > 0 && <div><strong>Risk Skoru:</strong> {riskScore}</div>}
        {statusText && <div><strong>Durum:</strong> {statusText}</div>}
      </div>
    )
  }

  const nodeStyle = getNodeStyle(data.type, data.viewMode, data.isExpanded)
  const expandIcon = getExpandIcon(data.type, data.isExpanded)

  return (
    <div 
      style={nodeStyle}
      onClick={handleNodeClick}
      title={renderTooltipContent()}
    >
      <Handle type="target" position={Position.Left} />
      
      {expandIcon}
      
      {/* Node Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Main Label */}
        <div style={{ 
          fontSize: data.viewMode === 'simplified' ? '12px' : '14px',
          fontWeight: 'bold',
          marginBottom: '4px',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          {data.type === 'procedure' ? data.label : data.label}
        </div>
        
        {/* Show details in detailed view */}
        {data.viewMode === 'detailed' && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {data.directRefs > 0 && (
              <CBadge color="primary" size="sm">
                D: {data.directRefs}
              </CBadge>
            )}
            {data.indirectRefs > 0 && (
              <CBadge color="secondary" size="sm">
                I: {data.indirectRefs}
              </CBadge>
            )}
            {data.riskScore > 0 && (
              <CBadge color={data.riskScore > 100 ? 'danger' : data.riskScore > 50 ? 'warning' : 'success'} size="sm">
                R: {data.riskScore}
              </CBadge>
            )}
            {data.stepCount && (
              <CBadge color="info" size="sm">
                S: {data.stepCount}
              </CBadge>
            )}
          </div>
        )}
        
        {/* Show simplified info in simplified view */}
        {data.viewMode === 'simplified' && (
          <div style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
            {data.directRefs + data.indirectRefs} referans
            {data.stepCount && ` • ${data.stepCount} adım`}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default CustomNode 