// Mock service for anomaly detection - simulates backend API responses
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock anomaly data
const generateMockAnomalies = (count = 10) => {
  const anomalies = [];
  const currentTime = new Date();
  
  for (let i = 0; i < count; i++) {
    const anomalyTime = new Date(currentTime.getTime() - (i * 3600000)); // Each anomaly 1 hour apart
    anomalies.push({
      id: `anomaly_${i + 1}`,
      timestamp: anomalyTime.toISOString(),
      severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
      type: ['PERFORMANCE', 'ERROR_RATE', 'DURATION', 'RESOURCE_USAGE'][Math.floor(Math.random() * 4)],
      description: `Anomaly detected in ${['procedure execution', 'data processing', 'system performance', 'resource utilization'][Math.floor(Math.random() * 4)]}`,
      value: Math.random() * 100,
      threshold: 50 + Math.random() * 30,
      affected_procedures: [`PROC_${Math.floor(Math.random() * 100)}`, `PROC_${Math.floor(Math.random() * 100)}`],
      confidence: 0.7 + Math.random() * 0.3,
      details: {
        duration_ms: Math.floor(Math.random() * 10000),
        row_count: Math.floor(Math.random() * 100000),
        error_count: Math.floor(Math.random() * 10),
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100
      }
    });
  }
  
  return anomalies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate mock performance forecast data
const generateMockForecast = (days = 7) => {
  const forecast = [];
  const currentTime = new Date();
  
  for (let i = 0; i < days; i++) {
    const forecastTime = new Date(currentTime.getTime() + (i * 24 * 3600000)); // Each day
    forecast.push({
      date: forecastTime.toISOString().split('T')[0],
      predicted_duration: 1000 + Math.random() * 5000,
      confidence_interval: {
        lower: 800 + Math.random() * 2000,
        upper: 2000 + Math.random() * 8000
      },
      predicted_load: Math.random() * 100,
      risk_level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
      recommendations: [
        'Consider optimizing query performance',
        'Monitor resource usage during peak hours',
        'Review indexing strategy',
        'Consider scaling resources'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  return forecast;
};

// Generate mock statistics
const generateMockStats = () => ({
  total_anomalies: Math.floor(Math.random() * 100) + 50,
  critical_anomalies: Math.floor(Math.random() * 10) + 5,
  avg_detection_time: Math.floor(Math.random() * 300) + 60, // seconds
  accuracy_rate: 0.85 + Math.random() * 0.1,
  false_positive_rate: Math.random() * 0.05,
  procedures_monitored: Math.floor(Math.random() * 500) + 200,
  last_analysis: new Date().toISOString(),
  trend: {
    anomaly_count_change: (Math.random() - 0.5) * 20, // -10 to +10
    performance_change: (Math.random() - 0.5) * 30, // -15 to +15
    reliability_score: 0.8 + Math.random() * 0.2
  }
});

// Mock API service
export const mockAnomalyService = {
  // Analyze anomalies
  analyzeAnomalies: async (params) => {
    await delay(2000); // Simulate API delay
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
      throw new Error('Analysis service temporarily unavailable');
    }
    
    const anomalies = generateMockAnomalies(params.limit || 20);
    const stats = generateMockStats();
    
    return {
      success: true,
      data: {
        anomalies,
        statistics: stats,
        analysis_params: params,
        total_count: anomalies.length,
        analysis_time: new Date().toISOString()
      }
    };
  },

  // Performance forecasting
  forecastPerformance: async (params) => {
    await delay(1500); // Simulate API delay
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.05) {
      throw new Error('Forecasting model is being updated');
    }
    
    const forecast = generateMockForecast(params.days || 7);
    
    return {
      success: true,
      data: {
        forecast,
        model_info: {
          algorithm: 'LSTM Neural Network',
          accuracy: 0.87 + Math.random() * 0.1,
          last_trained: new Date(Date.now() - 24 * 3600000).toISOString(),
          features_used: ['duration', 'row_count', 'error_rate', 'resource_usage']
        },
        forecast_params: params,
        generated_at: new Date().toISOString()
      }
    };
  },

  // Get anomaly details
  getAnomalyDetails: async (anomalyId) => {
    await delay(500);
    
    return {
      success: true,
      data: {
        id: anomalyId,
        timestamp: new Date().toISOString(),
        severity: 'HIGH',
        type: 'PERFORMANCE',
        description: 'Significant performance degradation detected',
        value: 85.5,
        threshold: 60.0,
        confidence: 0.92,
        affected_procedures: ['PROC_DATA_LOAD', 'PROC_TRANSFORM'],
        root_cause_analysis: {
          primary_cause: 'Resource contention',
          contributing_factors: ['High CPU usage', 'Memory pressure', 'I/O bottleneck'],
          suggested_actions: [
            'Optimize query execution plan',
            'Consider resource scaling',
            'Review concurrent execution limits'
          ]
        },
        historical_context: {
          similar_anomalies: 3,
          last_occurrence: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
          trend: 'INCREASING'
        }
      }
    };
  }
};

export default mockAnomalyService; 