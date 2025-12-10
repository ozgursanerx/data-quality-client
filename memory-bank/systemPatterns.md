# System Patterns: Flowlytics

## Architecture Overview

Flowlytics follows a modern React-based architecture with a focus on data flow analytics and visualization. The system is built using professional-grade components and follows established patterns for scalability and maintainability.

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Data Sources  │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Logs/APIs)   │
│                 │    │                 │    │                 │
│ • CoreUI 5.x    │    │ • Express       │    │ • EDW_PROC_LOG  │
│ • ReactFlow     │    │ • MCP Protocol  │    │ • JSON Files    │
│ • D3.js         │    │ • Winston       │    │ • Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture Patterns

### Component Hierarchy
```
App
├── Layout (CoreUI)
│   ├── AppSidebar
│   ├── AppHeader
│   ├── AppContent
│   └── AppFooter
├── Pages
│   ├── Dashboard
│   ├── DataLineage
│   ├── Performance
│   ├── Anomaly
│   ├── Packages
│   └── MCPAnalysis
└── Shared Components
    ├── Visualizations
    ├── Modals
    ├── Forms
    └── Charts
```

### State Management Pattern
- **Local State**: React hooks (useState, useReducer) for component-specific state
- **Shared State**: Context API for cross-component communication
- **Server State**: Axios with custom hooks for API data management
- **Future**: Redux Toolkit for complex global state if needed

### Routing Pattern
```javascript
// React Router 7 with lazy loading
const routes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/data-lineage",
    element: lazy(() => import("./pages/DataLineage")),
  },
  {
    path: "/performance",
    element: lazy(() => import("./pages/Performance")),
  },
  // ... other routes
]
```

## Data Visualization Patterns

### ReactFlow Integration
```javascript
// Data lineage visualization pattern
const DataLineageVisualization = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  
  // Custom node types for different data entities
  const nodeTypes = {
    package: PackageNode,
    procedure: ProcedureNode,
    step: StepNode,
    table: TableNode
  }
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="bottom-left"
    />
  )
}
```

### D3.js Integration Pattern
```javascript
// Advanced analytics visualizations
const PerformanceChart = ({ data }) => {
  const svgRef = useRef()
  
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    // D3 visualization logic
    // Integrated with React lifecycle
  }, [data])
  
  return <svg ref={svgRef} />
}
```

## Backend Architecture Patterns

### Express.js API Structure
```
backend/
├── server.js              # Main server setup
├── routes/
│   ├── api.js             # API route definitions
│   ├── health.js          # Health check endpoints
│   └── mcp.js             # MCP integration routes
├── services/
│   ├── mcpService.js      # MCP server communication
│   ├── dataService.js     # Data processing logic
│   └── logService.js      # Logging service
├── middleware/
│   ├── cors.js            # CORS configuration
│   ├── auth.js            # Authentication (future)
│   └── validation.js      # Request validation
└── utils/
    ├── logger.js          # Winston logger setup
    └── helpers.js         # Utility functions
```

### MCP Integration Pattern
```javascript
// Model Context Protocol integration
const mcpService = {
  async analyzeDataFlow(params) {
    const process = spawn('python', ['mcp-server.py', ...params])
    
    return new Promise((resolve, reject) => {
      let output = ''
      process.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(JSON.parse(output))
        } else {
          reject(new Error(`Process failed with code ${code}`))
        }
      })
    })
  }
}
```

## Data Processing Patterns

### Log Data Processing
```javascript
// EDW_PROC_LOG processing pattern
const processLogData = (logEntries) => {
  return logEntries.map(entry => ({
    id: entry.ID,
    packageId: entry.PROG_ID,
    stepId: entry.STEP_ID,
    sqlText: entry.SQL_TEXT,
    startTime: new Date(entry.START_TM),
    endTime: new Date(entry.END_TM),
    duration: entry.DURATION,
    rowCount: entry.ROW_CNT,
    status: entry.ST,
    errorText: entry.ERROR_TEXT
  }))
}
```

### Data Transformation Pipeline
```javascript
// Data flow analysis pipeline
const analyzeDataFlow = async (target) => {
  const rawData = await fetchLogData(target)
  const processedData = processLogData(rawData)
  const dependencies = analyzeDependencies(processedData)
  const visualization = generateVisualizationData(dependencies)
  
  return {
    data: processedData,
    dependencies,
    visualization,
    metadata: generateMetadata(processedData)
  }
}
```

## UI/UX Patterns

### CoreUI Integration
```javascript
// Professional admin template integration
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader
} from '@coreui/react'

const DashboardPage = () => (
  <CContainer fluid>
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>Flowlytics Dashboard</CCardHeader>
          <CCardBody>
            {/* Dashboard content */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
)
```

### Modal Management Pattern
```javascript
// Consistent modal handling across components
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  
  const openModal = (data) => {
    setModalData(data)
    setIsOpen(true)
  }
  
  const closeModal = () => {
    setIsOpen(false)
    setModalData(null)
  }
  
  return { isOpen, modalData, openModal, closeModal }
}
```

### Loading States Pattern
```javascript
// Consistent loading state management
const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  
  const execute = async (operation) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  return { loading, error, data, execute }
}
```

## Performance Patterns

### Code Splitting
```javascript
// Lazy loading for better performance
const DataLineage = lazy(() => import('./pages/DataLineage'))
const Performance = lazy(() => import('./pages/Performance'))

// Suspense wrapper for loading states
const App = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/data-lineage" element={<DataLineage />} />
        <Route path="/performance" element={<Performance />} />
      </Routes>
    </Suspense>
  </Router>
)
```

### Memoization Pattern
```javascript
// React.memo for expensive components
const DataVisualization = React.memo(({ data, options }) => {
  // Expensive rendering logic
  return <ComplexVisualization data={data} options={options} />
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data && 
         prevProps.options === nextProps.options
})
```

## Security Patterns

### Input Validation
```javascript
// Backend request validation
const validateAnalysisRequest = (req, res, next) => {
  const { schema, table, column } = req.body
  
  if (!schema || !table || !column) {
    return res.status(400).json({
      error: 'Missing required parameters'
    })
  }
  
  // Additional validation logic
  next()
}
```

### CORS Configuration
```javascript
// Secure CORS setup
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
```

## Testing Patterns

### Component Testing
```javascript
// React Testing Library patterns
test('renders dashboard with correct title', () => {
  render(<Dashboard />)
  expect(screen.getByText('Flowlytics Dashboard')).toBeInTheDocument()
})

test('handles data loading states', async () => {
  render(<DataLineage />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('Data Lineage')).toBeInTheDocument()
  })
})
```

### API Testing
```javascript
// Backend endpoint testing
describe('MCP Analysis API', () => {
  test('should return analysis results', async () => {
    const response = await request(app)
      .post('/api/analyze-data-flow')
      .send({
        schema: 'SNPADM',
        table: 'CDM.CC_DAILY',
        column: 'STMT_GRP_ID'
      })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('dependencies')
  })
})
```

## Deployment Patterns

### Build Configuration
```javascript
// Vite build optimization
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@coreui/react'],
          viz: ['reactflow', 'd3']
        }
      }
    }
  }
})
```

### Environment Configuration
```javascript
// Environment-specific settings
const config = {
  development: {
    apiUrl: 'http://localhost:8080/api',
    logLevel: 'debug'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL,
    logLevel: 'error'
  }
} 