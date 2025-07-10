import React, { useCallback, useMemo, useEffect, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomNode from './CustomNode'
import { CAlert, CBadge, CButton, CButtonGroup } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFullscreen, cilFullscreenExit } from '@coreui/icons'

const nodeTypes = {
  custom: CustomNode,
}

const DataLineageVisualization = ({ data, onNodeClick }) => {
  // State for view mode and expanded nodes
  const [viewMode, setViewMode] = useState('detailed') // 'simplified' or 'detailed'
  const [showOnlyHighRisk, setShowOnlyHighRisk] = useState(false)
  const [expandedPackages, setExpandedPackages] = useState(new Set())
  const [expandedProcedures, setExpandedProcedures] = useState(new Set())
  
  // State to track custom node positions (when user drags nodes)
  const [nodePositions, setNodePositions] = useState(new Map())
  
  // State for collapsible control panel
  const [controlPanelOpen, setControlPanelOpen] = useState(true)
  
  // State for fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    const element = document.getElementById('data-lineage-container')
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }, [isFullscreen])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ))
    }

    // Listen for ESC key to exit fullscreen
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  // Transform JSON data to ReactFlow nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!data || !data.packageAnalysis || data.packageAnalysis.length === 0) {
      return { nodes: [], edges: [] }
    }

    // Calculate circular positions
    const getCircularPosition = (index, total, radius, centerX, centerY) => {
      const angle = (index * 2 * Math.PI) / total
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    }

    // Handle node expansion - define inside useMemo to have access to current state
    const handleNodeExpansion = (nodeData) => {
      if (nodeData.type === 'package') {
        setExpandedPackages(prev => {
          const newSet = new Set(prev)
          if (newSet.has(nodeData.id)) {
            newSet.delete(nodeData.id)
            // Also collapse all procedures in this package
            setExpandedProcedures(prevProc => {
              const newProcSet = new Set(prevProc)
              const proceduresToCollapse = Array.from(prevProc).filter(id => 
                id.startsWith(`procedure-${nodeData.id.split('-')[1]}`)
              )
              proceduresToCollapse.forEach(id => newProcSet.delete(id))
              return newProcSet
            })
          } else {
            newSet.add(nodeData.id)
          }
          return newSet
        })
      } else if (nodeData.type === 'procedure') {
        setExpandedProcedures(prev => {
          const newSet = new Set(prev)
          if (newSet.has(nodeData.id)) {
            newSet.delete(nodeData.id)
          } else {
            newSet.add(nodeData.id)
          }
          return newSet
        })
      } else if (nodeData.type === 'step' && nodeData.details && onNodeClick) {
        // For step nodes with details, call the original onNodeClick with fullscreen state
        onNodeClick(nodeData, isFullscreen)
      }
    }

    const nodes = []
    const edges = []

    // Filter packages based on risk if needed
    const filteredPackages = data.packageAnalysis.filter(pkg => 
      !showOnlyHighRisk || (pkg.riskScore || 0) >= 50
    )

    // Center position for source
    const centerX = 400
    const centerY = 300

    // Create source table node (center)
    const sourcePosition = nodePositions.get('source') || { x: centerX - 150, y: centerY - 75 }
    const sourceNode = {
      id: 'source',
      type: 'custom',
      position: sourcePosition,
      data: {
        id: 'source',
        label: `${data.target.schema}.${data.target.table}`,
        column: data.target.column,
        type: 'source',
        riskScore: 0,
        directRefs: 0,
        indirectRefs: 0,
        viewMode,
        onNodeClick: handleNodeExpansion,
      },
    }
    nodes.push(sourceNode)

    // Calculate package positions in circle around source
    const packageRadius = 600
    filteredPackages.forEach((pkg, pkgIndex) => {
      const packageRiskScore = pkg.riskScore || 0
      const defaultPackagePosition = getCircularPosition(pkgIndex, filteredPackages.length, packageRadius, centerX, centerY)
      
      const packageNodeId = `package-${pkgIndex}`
      // Use stored position if available, otherwise use calculated position
      const packagePosition = nodePositions.get(packageNodeId) || { 
        x: defaultPackagePosition.x - 120,
        y: defaultPackagePosition.y - 60
      }
      
      const packageNode = {
        id: packageNodeId,
        type: 'custom',
        position: packagePosition,
        data: {
          id: packageNodeId,
          label: pkg.packageName.split('.').pop(),
          fullName: pkg.packageName,
          type: 'package',
          riskScore: packageRiskScore,
          directRefs: pkg.directReferences.length,
          indirectRefs: pkg.indirectReferences.length,
          viewMode,
          isExpanded: expandedPackages.has(packageNodeId),
          onNodeClick: handleNodeExpansion,
        },
      }
      nodes.push(packageNode)

      // Edge from source to package
      edges.push({
        id: `source-to-package-${pkgIndex}`,
        source: 'source',
        target: packageNodeId,
        type: 'smoothstep',
        animated: packageRiskScore > 100,
        style: { 
          strokeWidth: packageRiskScore > 100 ? 3 : 2, 
          stroke: packageRiskScore > 100 ? '#f44336' : '#ff9800' 
        },
        label: viewMode === 'detailed' ? `${pkg.directReferences.length + pkg.indirectReferences.length}` : '',
      })

      // Show procedures only if package is expanded
      if (expandedPackages.has(packageNodeId)) {
        // Group steps by procedure
        const procedureGroups = {}
        
        // Process direct references
        pkg.directReferences.forEach((ref) => {
          const procedureName = ref.procedure || 'Unknown'
          if (!procedureGroups[procedureName]) {
            procedureGroups[procedureName] = {}
          }
          if (!procedureGroups[procedureName][ref.stepId]) {
            procedureGroups[procedureName][ref.stepId] = {
              stepId: ref.stepId,
              stepLine: ref.stepLine,
              procedure: procedureName,
              directRefs: [],
              indirectRefs: [],
            }
          }
          // FIX: Extract individual references from the references array
          if (ref.references && Array.isArray(ref.references)) {
            ref.references.forEach(sqlRef => {
              procedureGroups[procedureName][ref.stepId].directRefs.push(sqlRef)
            })
          } else {
            // Fallback for old data structure
            procedureGroups[procedureName][ref.stepId].directRefs.push(ref)
          }
        })

        // Process indirect references
        pkg.indirectReferences.forEach((ref) => {
          const procedureName = ref.procedure || 'Unknown'
          if (!procedureGroups[procedureName]) {
            procedureGroups[procedureName] = {}
          }
          if (!procedureGroups[procedureName][ref.stepId]) {
            procedureGroups[procedureName][ref.stepId] = {
              stepId: ref.stepId,
              stepLine: ref.stepLine,
              procedure: procedureName,
              directRefs: [],
              indirectRefs: [],
            }
          }
          // FIX: Extract individual references from the references array
          if (ref.references && Array.isArray(ref.references)) {
            ref.references.forEach(sqlRef => {
              procedureGroups[procedureName][ref.stepId].indirectRefs.push(sqlRef)
            })
          } else {
            // Fallback for old data structure
            procedureGroups[procedureName][ref.stepId].indirectRefs.push(ref)
          }
        })

        // Create procedure nodes in a smaller circle around the package
        const procedureEntries = Object.entries(procedureGroups)
        const procedureRadius = 280
        procedureEntries.forEach(([procedureName, steps], procedureIndex) => {
          const defaultProcedurePosition = getCircularPosition(
            procedureIndex, 
            procedureEntries.length, 
            procedureRadius, 
            packagePosition.x + 120,
            packagePosition.y + 60
          )
          
          const procedureNodeId = `procedure-${pkgIndex}-${procedureIndex}`
          // Use stored position if available, otherwise use calculated position
          const procedurePosition = nodePositions.get(procedureNodeId) || {
            x: defaultProcedurePosition.x - 100,
            y: defaultProcedurePosition.y - 50
          }
          
          const totalRefs = Object.values(steps).reduce((sum, step) => sum + step.directRefs.length + step.indirectRefs.length, 0)
          
          const procedureNode = {
            id: procedureNodeId,
            type: 'custom',
            position: procedurePosition,
            data: {
              id: procedureNodeId,
              label: procedureName,
              type: 'procedure',
              riskScore: 0,
              directRefs: Object.values(steps).reduce((sum, step) => sum + step.directRefs.length, 0),
              indirectRefs: Object.values(steps).reduce((sum, step) => sum + step.indirectRefs.length, 0),
              stepCount: Object.keys(steps).length,
              viewMode,
              isExpanded: expandedProcedures.has(procedureNodeId),
              onNodeClick: handleNodeExpansion,
            },
          }
          nodes.push(procedureNode)

          // Edge from package to procedure
          edges.push({
            id: `package-${pkgIndex}-to-${procedureNodeId}`,
            source: packageNodeId,
            target: procedureNodeId,
            type: 'smoothstep',
            style: { strokeWidth: 1.5, stroke: '#4caf50' },
            label: viewMode === 'detailed' ? `${totalRefs}` : '',
          })

          // Show steps only if procedure is expanded
          if (expandedProcedures.has(procedureNodeId)) {
            // Group steps by prefix and sort by suffix number
            const stepsByPrefix = {}
            
            Object.values(steps).forEach(step => {
              const match = step.stepId.match(/^(.+?)[-_](\d+)$/)
              if (match) {
                const [, prefix, suffix] = match
                if (!stepsByPrefix[prefix]) {
                  stepsByPrefix[prefix] = []
                }
                stepsByPrefix[prefix].push({
                  ...step,
                  prefix,
                  suffix: parseInt(suffix, 10)
                })
              } else {
                // Handle steps without suffix
                if (!stepsByPrefix[step.stepId]) {
                  stepsByPrefix[step.stepId] = []
                }
                stepsByPrefix[step.stepId].push({
                  ...step,
                  prefix: step.stepId,
                  suffix: 0
                })
              }
            })

            // Sort steps within each prefix group by suffix number
            Object.keys(stepsByPrefix).forEach(prefix => {
              stepsByPrefix[prefix].sort((a, b) => a.suffix - b.suffix)
            })

            // Create step nodes with horizontal positioning
            let globalStepIndex = 0
            Object.entries(stepsByPrefix).forEach(([prefix, prefixSteps], prefixIndex) => {
              prefixSteps.forEach((step, indexInGroup) => {
                const stepNodeId = `step-${pkgIndex}-${procedureIndex}-${globalStepIndex}`
                
                // Position steps horizontally with 275px spacing
                const stepPosition = nodePositions.get(stepNodeId) || {
                  x: procedurePosition.x + 200 + (indexInGroup * 275),
                  y: procedurePosition.y + 100 + (prefixIndex * 100)
                }
                
                const stepNode = {
                  id: stepNodeId,
                  type: 'custom',
                  position: stepPosition,
                  data: {
                    id: stepNodeId,
                    label: step.stepId,
                    type: 'step',
                    riskScore: 0,
                    directRefs: step.directRefs.length,
                    indirectRefs: step.indirectRefs.length,
                    viewMode,
                    details: {
                      stepId: step.stepId,
                      stepLine: step.stepLine,
                      procedure: step.procedure,
                      directReferences: step.directRefs,
                      indirectReferences: step.indirectRefs,
                    },
                    onNodeClick: handleNodeExpansion,
                  },
                }
                nodes.push(stepNode)

                // Create connections between steps
                if (indexInGroup === 0) {
                  // First step in group connects to procedure
                  edges.push({
                    id: `procedure-${procedureNodeId}-to-${stepNodeId}`,
                    source: procedureNodeId,
                    target: stepNodeId,
                    type: 'smoothstep',
                    style: { strokeWidth: 2, stroke: '#9c27b0' },
                    label: viewMode === 'detailed' ? `${step.directRefs.length + step.indirectRefs.length}` : '',
                  })
                } else {
                  // Subsequent steps connect to previous step
                  const prevStepNodeId = `step-${pkgIndex}-${procedureIndex}-${globalStepIndex - 1}`
                  edges.push({
                    id: `step-${prevStepNodeId}-to-${stepNodeId}`,
                    source: prevStepNodeId,
                    target: stepNodeId,
                    type: 'smoothstep',
                    animated: true,
                    style: { strokeWidth: 2, stroke: '#ff6b35' },
                    label: viewMode === 'detailed' ? `${indexInGroup + 1}` : '',
                  })
                }

                globalStepIndex++
              })
            })
          }
        })
      }
    })

    return { nodes, edges }
  }, [data, viewMode, showOnlyHighRisk, expandedPackages, expandedProcedures, onNodeClick, nodePositions, isFullscreen])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Custom nodes change handler to track positions
  const handleNodesChange = useCallback((changes) => {
    // Track position changes
    changes.forEach(change => {
      if (change.type === 'position' && change.position && change.id) {
        setNodePositions(prev => {
          const newPositions = new Map(prev)
          newPositions.set(change.id, change.position)
          return newPositions
        })
      }
    })
    
    // Apply the changes to nodes
    onNodesChange(changes)
  }, [onNodesChange])

  // Update nodes and edges when data changes
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  // Reset expanded state when data changes, but keep positions
  useEffect(() => {
    setExpandedPackages(new Set())
    setExpandedProcedures(new Set())
    // Don't reset nodePositions - let users keep their custom positions
  }, [data])

  if (!data) {
    return (
      <CAlert color="warning">
        Görselleştirmek için veri bulunamadı.
      </CAlert>
    )
  }

  return (
    <div 
      id="data-lineage-container"
      style={{ 
        width: '100%', 
        height: isFullscreen ? '100vh' : '800px',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? '0' : 'auto',
        left: isFullscreen ? '0' : 'auto',
        zIndex: isFullscreen ? '9999' : 'auto',
        backgroundColor: isFullscreen ? 'white' : 'transparent'
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={false}
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.1,
          maxZoom: 1.5,
        }}
        attributionPosition="top-right"
      >
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            switch (node.data.type) {
              case 'source': return '#2196f3'
              case 'package': return '#ff9800'
              case 'procedure': return '#4caf50'
              case 'step': return '#9c27b0'
              default: return '#9e9e9e'
            }
          }}
        />
        <Controls />
        <Background variant="dots" gap={20} size={1} />
        
        {/* Control Panel */}
        <Panel position="top-left">
          <div className="bg-white rounded shadow-sm" style={{ minWidth: controlPanelOpen ? '280px' : '40px' }}>
            {/* Panel Header with Toggle Button */}
            <div 
              className="d-flex align-items-center justify-content-between p-2 border-bottom"
              style={{ cursor: 'pointer' }}
              onClick={() => setControlPanelOpen(!controlPanelOpen)}
            >
              <h6 className="mb-0" style={{ fontSize: '14px' }}>
                {controlPanelOpen ? 'Kontroller' : '⚙️'}
              </h6>
              <span style={{ fontSize: '12px' }}>
                {controlPanelOpen ? '◀' : '▶'}
              </span>
            </div>
            
            {/* Panel Content - Only show when open */}
            {controlPanelOpen && (
              <div className="p-3">
                {/* Fullscreen Toggle */}
                <div className="mb-3">
                  <CButton 
                    size="sm" 
                    color={isFullscreen ? 'danger' : 'primary'}
                    onClick={toggleFullscreen}
                    className="w-100"
                  >
                    <CIcon icon={isFullscreen ? cilFullscreenExit : cilFullscreen} className="me-2" />
                    {isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
                  </CButton>
                  {isFullscreen && (
                    <small className="text-muted d-block mt-1">
                      💡 ESC tuşu ile de çıkabilirsiniz
                    </small>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Görünüm Modu</small>
                  <CButtonGroup size="sm">
                    <CButton 
                      color={viewMode === 'simplified' ? 'primary' : 'outline-primary'}
                      onClick={() => setViewMode('simplified')}
                    >
                      Basit
                    </CButton>
                    <CButton 
                      color={viewMode === 'detailed' ? 'primary' : 'outline-primary'}
                      onClick={() => setViewMode('detailed')}
                    >
                      Detaylı
                    </CButton>
                  </CButtonGroup>
                </div>

                {/* Filters */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">Filtreler</small>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="highRiskFilter"
                      checked={showOnlyHighRisk}
                      onChange={(e) => setShowOnlyHighRisk(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="highRiskFilter">
                      <small>Sadece Yüksek Risk Paketler</small>
                    </label>
                  </div>
                </div>

                {/* Expand/Collapse Controls */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">Hızlı Kontroller</small>
                  <div className="d-flex gap-2 flex-wrap">
                    <CButton 
                      size="sm" 
                      color="outline-success"
                      onClick={() => {
                        const allPackageIds = data.packageAnalysis
                          .filter(pkg => !showOnlyHighRisk || (pkg.riskScore || 0) >= 50)
                          .map((_, index) => `package-${index}`)
                        setExpandedPackages(new Set(allPackageIds))
                      }}
                    >
                      Tümünü Aç
                    </CButton>
                    <CButton 
                      size="sm" 
                      color="outline-danger"
                      onClick={() => {
                        setExpandedPackages(new Set())
                        setExpandedProcedures(new Set())
                      }}
                    >
                      Tümünü Kapat
                    </CButton>
                    <CButton 
                      size="sm" 
                      color="outline-warning"
                      onClick={() => {
                        setNodePositions(new Map())
                      }}
                    >
                      Pozisyonları Sıfırla
                    </CButton>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">Nasıl Kullanılır</small>
                  <div className="small text-muted">
                    <div>📦 Pakete tıkla → Prosedürler görünür</div>
                    <div>⚙️ Prosedüre tıkla → Adımlar görünür</div>
                    <div>🔍 Adıma tıkla → Detaylar açılır</div>
                    <div>🖱️ Node'ları sürükleyebilirsiniz</div>
                    <div>🖥️ Tam ekran modunda çalışabilirsiniz</div>
                  </div>
                </div>

                {/* Legend */}
                <div>
                  <small className="text-muted d-block mb-2">Gösterge</small>
                  <div className="d-flex flex-column gap-1">
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-2" 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: '#e3f2fd', 
                          border: '2px solid #2196f3',
                          borderRadius: '3px' 
                        }}
                      ></div>
                      <small>Kaynak (Merkez)</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-2" 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: '#fff3e0', 
                          border: '2px solid #ff9800',
                          borderRadius: '3px' 
                        }}
                      ></div>
                      <small>Paket (Çevre)</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-2" 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: '#e8f5e8', 
                          border: '2px solid #4caf50',
                          borderRadius: '3px' 
                        }}
                      ></div>
                      <small>Prosedür</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-2" 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: '#f3e5f5', 
                          border: '2px solid #9c27b0',
                          borderRadius: '3px' 
                        }}
                      ></div>
                      <small>Adım</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default DataLineageVisualization 