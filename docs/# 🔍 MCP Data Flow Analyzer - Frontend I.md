# 🔍 MCP Data Flow Analyzer - Frontend Integration

## Backend Setup (Already Done)
Backend HTTP wrapper is running on `http://localhost:3001`

## 🚀 Quick Start for Frontend

### 1. API Endpoints

```javascript
const API_BASE = 'http://localhost:3001/api';

// Health check
GET /api/health

// Data flow analysis
POST /api/analyze-data-flow
{
  "schema_name": "SNPADM",
  "target_table": "CDM.CC_CARD_PROV_DEC", 
  "target_column": "CUST_NO",
  "save_report": true
}

// Enhanced backward tracing
POST /api/analyze-backward-tracing
{
  "schema_name": "SNPADM",
  "target_table": "CDM.CC_CARD_PROV_DEC",
  "target_column": "CUST_NO", 
  "max_depth": 3
}

// Get schema packages
GET /api/schema-packages/SNPADM
```

### 2. JavaScript Service Class

```javascript
class MCPService {
  constructor(baseUrl = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async analyzeDataFlow(schema, table, column) {
    const response = await fetch(`${this.baseUrl}/analyze-data-flow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schema_name: schema,
        target_table: table,
        target_column: column,
        save_report: true
      })
    });
    
    if (!response.ok) throw new Error(`Analysis failed: ${response.statusText}`);
    return response.json();
  }

  async analyzeBackwardTracing(schema, table, column, maxDepth = 3) {
    const response = await fetch(`${this.baseUrl}/analyze-backward-tracing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schema_name: schema,
        target_table: table,
        target_column: column,
        max_depth: maxDepth
      })
    });
    
    if (!response.ok) throw new Error(`Tracing failed: ${response.statusText}`);
    return response.json();
  }

  async getSchemaPackages(schema) {
    const response = await fetch(`${this.baseUrl}/schema-packages/${schema}`);
    if (!response.ok) throw new Error(`Failed to get packages: ${response.statusText}`);
    return response.json();
  }
}

// Usage
const mcpService = new MCPService();
```

### 3. React Hook Example

```javascript
import { useState } from 'react';

export const useMCPAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeDataFlow = async (schema, table, column) => {
    setLoading(true);
    setError(null);
    
    try {
      const mcpService = new MCPService();
      const result = await mcpService.analyzeDataFlow(schema, table, column);
      setResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeDataFlow, loading, result, error };
};
```

### 4. Vue.js Composable Example

```javascript
import { ref } from 'vue';

export const useMCPAnalysis = () => {
  const loading = ref(false);
  const result = ref(null);
  const error = ref(null);

  const analyzeDataFlow = async (schema, table, column) => {
    loading.value = true;
    error.value = null;
    
    try {
      const mcpService = new MCPService();
      const data = await mcpService.analyzeDataFlow(schema, table, column);
      result.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { analyzeDataFlow, loading, result, error };
};
```

### 5. Response Format

```javascript
// Successful response
{
  "jsonrpc": "2.0",
  "id": 1234567890,
  "result": {
    "summary": {
      "targetTable": "CDM.CC_CARD_PROV_DEC",
      "targetColumn": "CUST_NO",
      "totalPackagesAnalyzed": 28,
      "totalReferences": 15,
      "reportPath": "./reports/cust_no_analysis_2025-01-18.json"
    },
    "packageAnalyses": [
      {
        "packageName": "PKG_DA_EXAMPLE",
        "references": [...],
        "directSources": [...],
        "transformationChains": [...]
      }
    ]
  }
}

// Error response
{
  "error": "Analysis failed: Connection timeout"
}
```

### 6. Loading States & UX

```javascript
// Show loading with timeout warning
if (loading) {
  return (
    <div>
      <Spinner />
      <p>Analyzing data flow... This may take 2-5 minutes.</p>
      <p>Please don't close the browser.</p>
    </div>
  );
}
```

## 🎯 Key Points

- **Timeout**: Analysis can take 2-5 minutes
- **CORS**: Already configured for frontend access
- **Error Handling**: Always wrap in try-catch
- **Loading State**: Show progress indicators
- **Report Files**: Saved automatically to backend

## 🔧 Test Commands

```bash
# Test health
curl http://localhost:3001/api/health

# Test analysis
curl -X POST http://localhost:3001/api/analyze-data-flow \
  -H "Content-Type: application/json" \
  -d '{"schema_name":"SNPADM","target_table":"CDM.CC_CARD_PROV_DEC","target_column":"CUST_NO"}'
```

## 📱 Mobile Considerations

- Use loading overlays for long operations
- Consider WebSocket for real-time progress (future enhancement)
- Cache results for repeated queries
- Implement request cancellation if needed

---
**Backend Status**: ✅ Ready  
**Frontend**: Ready for integration 