import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnomalyDetection from '../pages/anomaly-detection/AnomalyDetection';
import anomalyService from '../services/anomalyService';

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Scatter: () => <div data-testid="scatter-chart">Scatter Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>
}));

// Mock the anomaly service
jest.mock('../services/anomalyService', () => ({
  __esModule: true,
  default: {
    getPackageList: jest.fn(),
    getStepIdList: jest.fn(),
    analyzeAnomalies: jest.fn(),
    forecastPerformance: jest.fn(),
    getAnomalyDetails: jest.fn()
  },
  getAnomalySeverityColor: jest.fn((severity) => {
    const colors = {
      LOW: '#28a745',
      MEDIUM: '#ffc107',
      HIGH: '#fd7e14',
      CRITICAL: '#dc3545'
    };
    return colors[severity] || '#6c757d';
  }),
  formatAnomalyValue: jest.fn((value, type) => {
    if (type === 'duration') {
      return `${(value / 60).toFixed(2)} min`;
    }
    return value.toString();
  }),
  exportAnomaliesCSV: jest.fn()
}));

// Mock LoadingButton component
jest.mock('../components/LoadingButton', () => {
  return function LoadingButton({ children, onClick, isLoading, disabled, ...props }) {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled || isLoading}
        data-testid={props['data-testid'] || 'loading-button'}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  };
});

describe('AnomalyDetection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    anomalyService.getPackageList.mockResolvedValue([
      { progId: 'PKG001', progNm: 'Package 1' },
      { progId: 'PKG002', progNm: 'Package 2' }
    ]);
    
    anomalyService.getStepIdList.mockResolvedValue([
      'STEP001-10',
      'STEP001-20',
      'STEP002-10'
    ]);
  });

  test('renders the anomaly detection interface', async () => {
    render(<AnomalyDetection />);
    
    expect(screen.getByText('Smart Anomaly Detection & Performance Forecasting')).toBeInTheDocument();
    expect(screen.getByText('Analyze ProcLog data for performance anomalies and generate forecasts')).toBeInTheDocument();
    expect(screen.getByLabelText('Package (PROG_ID) *')).toBeInTheDocument();
    expect(screen.getByText('Analyze Anomalies')).toBeInTheDocument();
    expect(screen.getByText('Generate Forecast')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  test('loads packages on component mount', async () => {
    render(<AnomalyDetection />);
    
    await waitFor(() => {
      expect(anomalyService.getPackageList).toHaveBeenCalledTimes(1);
    });
    
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
      expect(screen.getByText('PKG002 - Package 2')).toBeInTheDocument();
    });
  });

  test('loads step IDs when package is selected', async () => {
    render(<AnomalyDetection />);
    
    // Wait for packages to load
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    // Select a package
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    await waitFor(() => {
      expect(anomalyService.getStepIdList).toHaveBeenCalledWith('PKG001');
    });
  });

  test('handles form input changes', async () => {
    render(<AnomalyDetection />);
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByLabelText('Package (PROG_ID) *')).toBeInTheDocument();
    });
    
    // Test date inputs
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    const thresholdInput = screen.getByLabelText('Anomaly Threshold');
    const sensitivityInput = screen.getByLabelText('Sensitivity Rate');
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.change(thresholdInput, { target: { value: '0.1' } });
    fireEvent.change(sensitivityInput, { target: { value: '0.2' } });
    
    expect(startDateInput.value).toBe('2024-01-01');
    expect(endDateInput.value).toBe('2024-01-31');
    expect(thresholdInput.value).toBe('0.1');
    expect(sensitivityInput.value).toBe('0.2');
  });

  test('performs anomaly analysis successfully', async () => {
    const mockAnalysisResult = {
      success: true,
      data: {
        anomalies: [
          {
            id: 'anom1',
            timestamp: '2024-01-15T10:30:00Z',
            severity: 'HIGH',
            value: 300,
            threshold: 180,
            confidence: 0.85,
            description: 'Duration significantly higher than expected',
            details: {
              prog_id: 'PKG001',
              step_id: 'STEP001-10',
              row_count: 1000,
              status: 'SUCCESS'
            }
          }
        ],
        statistics: {
          total_anomalies: 1,
          critical_anomalies: 0,
          accuracy_rate: 0.95,
          procedures_monitored: 5
        }
      }
    };
    
    anomalyService.analyzeAnomalies.mockResolvedValue(mockAnalysisResult);
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Click analyze button
    const analyzeButton = screen.getByText('Analyze Anomalies');
    fireEvent.click(analyzeButton);
    
    // Check loading state
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    
    // Wait for analysis to complete
    await waitFor(() => {
      expect(anomalyService.analyzeAnomalies).toHaveBeenCalledWith({
        progId: 'PKG001',
        startDate: '',
        endDate: '',
        threshold: 0.05,
        sensitivityRate: 0.1,
        stepId: null
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Analysis completed successfully. Found 1 anomalies.')).toBeInTheDocument();
      expect(screen.getByText('Analysis Statistics')).toBeInTheDocument();
      expect(screen.getByText('Detected Anomalies')).toBeInTheDocument();
    });
  });

  test('performs performance forecast successfully', async () => {
    const mockForecastResult = {
      success: true,
      data: {
        forecast: [
          {
            date: '2024-01-16',
            predicted_duration: 180,
            confidence_interval: {
              lower: 150,
              upper: 210
            }
          }
        ],
        model_info: {
          algorithm: 'LSTM',
          accuracy: 0.92
        }
      }
    };
    
    anomalyService.forecastPerformance.mockResolvedValue(mockForecastResult);
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Click forecast button
    const forecastButton = screen.getByText('Generate Forecast');
    fireEvent.click(forecastButton);
    
    // Check loading state
    expect(screen.getByText('Forecasting...')).toBeInTheDocument();
    
    // Wait for forecast to complete
    await waitFor(() => {
      expect(anomalyService.forecastPerformance).toHaveBeenCalledWith({
        progId: 'PKG001',
        stepId: null,
        days: 7
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Performance forecast generated successfully.')).toBeInTheDocument();
      expect(screen.getByText('Performance Forecast')).toBeInTheDocument();
    });
  });

  test('handles analysis errors gracefully', async () => {
    anomalyService.analyzeAnomalies.mockRejectedValue(new Error('API Error'));
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Click analyze button
    const analyzeButton = screen.getByText('Analyze Anomalies');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Analysis failed: API Error')).toBeInTheDocument();
    });
  });

  test('handles forecast errors gracefully', async () => {
    anomalyService.forecastPerformance.mockRejectedValue(new Error('Forecast Error'));
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Click forecast button
    const forecastButton = screen.getByText('Generate Forecast');
    fireEvent.click(forecastButton);
    
    await waitFor(() => {
      expect(screen.getByText('Forecast failed: Forecast Error')).toBeInTheDocument();
    });
  });

  test('validates required package selection', async () => {
    render(<AnomalyDetection />);
    
    // Try to analyze without selecting a package
    const analyzeButton = screen.getByText('Analyze Anomalies');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please select a package (PROG_ID)')).toBeInTheDocument();
    });
  });

  test('opens anomaly details modal', async () => {
    const mockAnalysisResult = {
      success: true,
      data: {
        anomalies: [
          {
            id: 'anom1',
            timestamp: '2024-01-15T10:30:00Z',
            severity: 'HIGH',
            value: 300,
            threshold: 180,
            confidence: 0.85,
            description: 'Duration significantly higher than expected',
            details: {
              prog_id: 'PKG001',
              step_id: 'STEP001-10',
              row_count: 1000,
              status: 'SUCCESS'
            }
          }
        ],
        statistics: {
          total_anomalies: 1,
          critical_anomalies: 0,
          accuracy_rate: 0.95,
          procedures_monitored: 5
        }
      }
    };
    
    const mockAnomalyDetails = {
      success: true,
      data: {
        id: 'anom1',
        timestamp: '2024-01-15T10:30:00Z',
        severity: 'HIGH',
        value: 300,
        threshold: 180,
        confidence: 0.85,
        description: 'Duration significantly higher than expected',
        details: {
          prog_id: 'PKG001',
          step_id: 'STEP001-10',
          row_count: 1000,
          status: 'SUCCESS'
        },
        root_cause_analysis: {
          primary_cause: 'High data volume',
          contributing_factors: ['Network latency', 'Resource contention'],
          suggested_actions: ['Optimize query', 'Scale resources']
        }
      }
    };
    
    anomalyService.analyzeAnomalies.mockResolvedValue(mockAnalysisResult);
    anomalyService.getAnomalyDetails.mockResolvedValue(mockAnomalyDetails);
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Perform analysis
    const analyzeButton = screen.getByText('Analyze Anomalies');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Detected Anomalies')).toBeInTheDocument();
    });
    
    // Click on anomaly row to open modal
    const anomalyRow = screen.getByText('STEP001-10').closest('tr');
    fireEvent.click(anomalyRow);
    
    await waitFor(() => {
      expect(screen.getByText('Anomaly Details')).toBeInTheDocument();
      expect(screen.getByText('Root Cause Analysis')).toBeInTheDocument();
      expect(screen.getByText('High data volume')).toBeInTheDocument();
    });
  });

  test('exports anomalies to CSV', async () => {
    const mockAnalysisResult = {
      success: true,
      data: {
        anomalies: [
          {
            id: 'anom1',
            timestamp: '2024-01-15T10:30:00Z',
            severity: 'HIGH',
            value: 300,
            threshold: 180,
            confidence: 0.85,
            description: 'Duration significantly higher than expected'
          }
        ],
        statistics: {
          total_anomalies: 1,
          critical_anomalies: 0,
          accuracy_rate: 0.95,
          procedures_monitored: 5
        }
      }
    };
    
    anomalyService.analyzeAnomalies.mockResolvedValue(mockAnalysisResult);
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Perform analysis
    const analyzeButton = screen.getByText('Analyze Anomalies');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Detected Anomalies')).toBeInTheDocument();
    });
    
    // Click export button
    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(anomalyService.exportAnomaliesCSV).toHaveBeenCalledWith(
        mockAnalysisResult.data.anomalies,
        expect.stringContaining('anomalies_PKG001_')
      );
      expect(screen.getByText('Anomalies exported successfully')).toBeInTheDocument();
    });
  });

  test('displays charts when anomalies are present', async () => {
    const mockAnalysisResult = {
      success: true,
      data: {
        anomalies: [
          {
            id: 'anom1',
            timestamp: '2024-01-15T10:30:00Z',
            severity: 'HIGH',
            value: 300,
            threshold: 180,
            confidence: 0.85,
            description: 'Duration significantly higher than expected'
          }
        ],
        statistics: {
          total_anomalies: 1,
          critical_anomalies: 0,
          accuracy_rate: 0.95,
          procedures_monitored: 5
        }
      }
    };
    
    anomalyService.analyzeAnomalies.mockResolvedValue(mockAnalysisResult);
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Perform analysis
    const analyzeButton = screen.getByText('Analyze Anomalies');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Duration Analysis')).toBeInTheDocument();
      expect(screen.getByText('Anomaly Distribution')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    });
  });

  test('displays forecast chart when forecast is generated', async () => {
    const mockForecastResult = {
      success: true,
      data: {
        forecast: [
          {
            date: '2024-01-16',
            predicted_duration: 180,
            confidence_interval: {
              lower: 150,
              upper: 210
            }
          }
        ],
        model_info: {
          algorithm: 'LSTM',
          accuracy: 0.92
        }
      }
    };
    
    anomalyService.forecastPerformance.mockResolvedValue(mockForecastResult);
    
    render(<AnomalyDetection />);
    
    // Wait for packages to load and select one
    await waitFor(() => {
      expect(screen.getByText('PKG001 - Package 1')).toBeInTheDocument();
    });
    
    const packageSelect = screen.getByLabelText('Package (PROG_ID) *');
    fireEvent.change(packageSelect, { target: { value: 'PKG001' } });
    
    // Perform forecast
    const forecastButton = screen.getByText('Generate Forecast');
    fireEvent.click(forecastButton);
    
    await waitFor(() => {
      expect(screen.getByText('Performance Forecast')).toBeInTheDocument();
      expect(screen.getByText('Model: LSTM | Accuracy: 92.0%')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
}); 