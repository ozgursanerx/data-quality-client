import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CAlert,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CProgress,
  CTooltip
} from '@coreui/react';
import { Line, Scatter, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import LoadingButton from '../../components/LoadingButton';
import anomalyService, { getAnomalySeverityColor, formatAnomalyValue, exportAnomaliesCSV } from '../../services/anomalyService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const AnomalyDetection = () => {
  // State for analysis parameters
  const [progId, setProgId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [threshold, setThreshold] = useState('0.05');
  const [sensitivityRate, setSensitivityRate] = useState('0.1');
  const [selectedStepId, setSelectedStepId] = useState('');

  // State for data
  const [packages, setPackages] = useState([]);
  const [stepIds, setStepIds] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [forecastInfo, setForecastInfo] = useState(null);

  // State for UI
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isForecasting, setIsForecasting] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load packages on component mount
  useEffect(() => {
    loadPackages();
  }, []);

  // Load step IDs when package is selected
  useEffect(() => {
    if (progId) {
      loadStepIds();
    } else {
      setStepIds([]);
      setSelectedStepId('');
    }
  }, [progId]);

  const loadPackages = async () => {
    setIsLoadingPackages(true);
    try {
      const packageList = await anomalyService.getPackageList();
      setPackages(packageList || []);
    } catch (err) {
      setError('Failed to load packages: ' + err.message);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const loadStepIds = async () => {
    if (!progId) return;
    
    setIsLoadingSteps(true);
    try {
      const stepList = await anomalyService.getStepIdList(progId);
      setStepIds(stepList || []);
    } catch (err) {
      setError('Failed to load step IDs: ' + err.message);
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const handleAnalyze = async () => {
    if (!progId) {
      setError('Please select a package (PROG_ID)');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setSuccess('');

    try {
      const params = {
        progId,
        startDate,
        endDate,
        threshold: parseFloat(threshold),
        sensitivityRate: parseFloat(sensitivityRate),
        stepId: selectedStepId || null
      };

      const result = await anomalyService.analyzeAnomalies(params);
      
      if (result.success) {
        setAnomalies(result.data.anomalies || []);
        setStatistics(result.data.statistics || {});
        setSuccess(`Analysis completed successfully. Found ${result.data.anomalies?.length || 0} anomalies.`);
      } else {
        setError('Analysis failed: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      setError('Analysis failed: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleForecast = async () => {
    if (!progId) {
      setError('Please select a package (PROG_ID)');
      return;
    }

    setIsForecasting(true);
    setError('');

    try {
      const params = {
        progId,
        stepId: selectedStepId || null,
        days: 7
      };

      const result = await anomalyService.forecastPerformance(params);
      
      if (result.success) {
        setForecast(result.data.forecast || []);
        setForecastInfo(result.data.model_info || {});
        setSuccess('Performance forecast generated successfully.');
      } else {
        setError('Forecast failed: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      setError('Forecast failed: ' + err.message);
    } finally {
      setIsForecasting(false);
    }
  };

  const handleAnomalyClick = async (anomaly) => {
    try {
      const details = await anomalyService.getAnomalyDetails(anomaly.id);
      if (details.success) {
        setSelectedAnomaly(details.data);
        setShowModal(true);
      }
    } catch (err) {
      setError('Failed to load anomaly details: ' + err.message);
    }
  };

  const handleExport = () => {
    if (anomalies.length === 0) {
      setError('No anomalies to export');
      return;
    }
    
    const filename = `anomalies_${progId}_${new Date().toISOString().split('T')[0]}.csv`;
    exportAnomaliesCSV(anomalies, filename);
    setSuccess('Anomalies exported successfully');
  };

  // Chart data preparation
  const prepareTimeSeriesData = () => {
    if (!anomalies.length) return null;

    return {
      labels: anomalies.map(a => new Date(a.timestamp).toLocaleDateString()),
      datasets: [
        {
          label: 'Duration (minutes)',
          data: anomalies.map(a => (a.value / 60).toFixed(2)),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        },
        {
          label: 'Mean Duration (minutes)',
          data: anomalies.map(a => (a.threshold / 60).toFixed(2)),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5]
        }
      ]
    };
  };

  const prepareScatterData = () => {
    if (!anomalies.length) return null;

    const severityColors = {
      LOW: 'rgba(40, 167, 69, 0.8)',
      MEDIUM: 'rgba(255, 193, 7, 0.8)',
      HIGH: 'rgba(253, 126, 20, 0.8)',
      CRITICAL: 'rgba(220, 53, 69, 0.8)'
    };

    return {
      datasets: Object.keys(severityColors).map(severity => ({
        label: severity,
        data: anomalies
          .filter(a => a.severity === severity)
          .map(a => ({
            x: a.value / 60, // Duration in minutes
            y: a.confidence * 100 // Confidence as percentage
          })),
        backgroundColor: severityColors[severity],
        borderColor: severityColors[severity].replace('0.8', '1'),
      }))
    };
  };

  const prepareForecastData = () => {
    if (!forecast.length) return null;

    return {
      labels: forecast.map(f => f.date),
      datasets: [
        {
          label: 'Predicted Duration (minutes)',
          data: forecast.map(f => (f.predicted_duration / 60).toFixed(2)),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1
        },
        {
          label: 'Upper Bound',
          data: forecast.map(f => (f.confidence_interval.upper / 60).toFixed(2)),
          borderColor: 'rgba(54, 162, 235, 0.3)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderDash: [3, 3],
          fill: false
        },
        {
          label: 'Lower Bound',
          data: forecast.map(f => (f.confidence_interval.lower / 60).toFixed(2)),
          borderColor: 'rgba(54, 162, 235, 0.3)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderDash: [3, 3],
          fill: '-1'
        }
      ]
    };
  };

  const getSeverityBadgeColor = (severity) => {
    const colors = {
      LOW: 'success',
      MEDIUM: 'warning',
      HIGH: 'danger',
      CRITICAL: 'dark'
    };
    return colors[severity] || 'secondary';
  };

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h4>Smart Anomaly Detection & Performance Forecasting</h4>
              <small>Analyze ProcLog data for performance anomalies and generate forecasts</small>
            </CCardHeader>
            <CCardBody>
              {/* Analysis Parameters */}
              <CForm>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="progId">Package (PROG_ID) *</CFormLabel>
                    <CFormSelect
                      id="progId"
                      value={progId}
                      onChange={(e) => setProgId(e.target.value)}
                      disabled={isLoadingPackages}
                    >
                      <option value="">Select Package...</option>
                      {packages.map((pkg) => (
                        <option key={pkg.progId} value={pkg.progId}>
                          {pkg.progId} - {pkg.progNm || 'Unknown'}
                        </option>
                      ))}
                    </CFormSelect>
                    {isLoadingPackages && <CSpinner size="sm" className="ms-2" />}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="stepId">Step ID (Optional)</CFormLabel>
                    <CFormSelect
                      id="stepId"
                      value={selectedStepId}
                      onChange={(e) => setSelectedStepId(e.target.value)}
                      disabled={!progId || isLoadingSteps}
                    >
                      <option value="">All Steps</option>
                      {stepIds.map((stepId) => (
                        <option key={stepId} value={stepId}>
                          {stepId}
                        </option>
                      ))}
                    </CFormSelect>
                    {isLoadingSteps && <CSpinner size="sm" className="ms-2" />}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={3}>
                    <CFormLabel htmlFor="startDate">Start Date</CFormLabel>
                    <CFormInput
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="endDate">End Date</CFormLabel>
                    <CFormInput
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="threshold">Anomaly Threshold</CFormLabel>
                    <CFormInput
                      type="number"
                      id="threshold"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      step="0.01"
                      min="0.01"
                      max="1"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="sensitivityRate">Sensitivity Rate</CFormLabel>
                    <CFormInput
                      type="number"
                      id="sensitivityRate"
                      value={sensitivityRate}
                      onChange={(e) => setSensitivityRate(e.target.value)}
                      step="0.01"
                      min="0.01"
                      max="1"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol>
                    <LoadingButton
                      onClick={handleAnalyze}
                      isLoading={isAnalyzing}
                      color="primary"
                      className="me-2"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Anomalies'}
                    </LoadingButton>
                    <LoadingButton
                      onClick={handleForecast}
                      isLoading={isForecasting}
                      color="info"
                      className="me-2"
                    >
                      {isForecasting ? 'Forecasting...' : 'Generate Forecast'}
                    </LoadingButton>
                    <LoadingButton
                      onClick={handleExport}
                      color="success"
                      disabled={anomalies.length === 0}
                    >
                      Export CSV
                    </LoadingButton>
                  </CCol>
                </CRow>
              </CForm>

              {/* Alerts */}
              {error && (
                <CAlert color="danger" dismissible onClose={() => setError('')}>
                  {error}
                </CAlert>
              )}
              {success && (
                <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Statistics */}
      {statistics && (
        <CRow className="mb-4">
          <CCol xs={12}>
            <CCard>
              <CCardHeader>Analysis Statistics</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={3}>
                    <div className="text-center">
                      <h4 className="text-primary">{statistics.total_anomalies}</h4>
                      <small>Total Anomalies</small>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="text-center">
                      <h4 className="text-danger">{statistics.critical_anomalies}</h4>
                      <small>Critical Anomalies</small>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="text-center">
                      <h4 className="text-success">{(statistics.accuracy_rate * 100).toFixed(1)}%</h4>
                      <small>Accuracy Rate</small>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="text-center">
                      <h4 className="text-info">{statistics.procedures_monitored}</h4>
                      <small>Procedures Monitored</small>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Charts */}
      {anomalies.length > 0 && (
        <CRow className="mb-4">
          <CCol md={6}>
            <CCard>
              <CCardHeader>Duration Analysis</CCardHeader>
              <CCardBody>
                {prepareTimeSeriesData() && (
                  <Line
                    data={prepareTimeSeriesData()}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Duration vs Mean Duration Over Time'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Duration (minutes)'
                          }
                        }
                      }
                    }}
                  />
                )}
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard>
              <CCardHeader>Anomaly Distribution</CCardHeader>
              <CCardBody>
                {prepareScatterData() && (
                  <Scatter
                    data={prepareScatterData()}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Duration vs Confidence by Severity'
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Duration (minutes)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Confidence (%)'
                          }
                        }
                      }
                    }}
                  />
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Forecast Chart */}
      {forecast.length > 0 && (
        <CRow className="mb-4">
          <CCol xs={12}>
            <CCard>
              <CCardHeader>
                Performance Forecast
                {forecastInfo && (
                  <small className="ms-2">
                    Model: {forecastInfo.algorithm} | Accuracy: {(forecastInfo.accuracy * 100).toFixed(1)}%
                  </small>
                )}
              </CCardHeader>
              <CCardBody>
                {prepareForecastData() && (
                  <Line
                    data={prepareForecastData()}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: '7-Day Performance Forecast'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Duration (minutes)'
                          }
                        }
                      }
                    }}
                  />
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Anomalies Table */}
      {anomalies.length > 0 && (
        <CRow>
          <CCol xs={12}>
            <CCard>
              <CCardHeader>Detected Anomalies</CCardHeader>
              <CCardBody>
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Timestamp</CTableHeaderCell>
                      <CTableHeaderCell>Step ID</CTableHeaderCell>
                      <CTableHeaderCell>Severity</CTableHeaderCell>
                      <CTableHeaderCell>Duration</CTableHeaderCell>
                      <CTableHeaderCell>Mean Duration</CTableHeaderCell>
                      <CTableHeaderCell>Confidence</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {anomalies.map((anomaly) => (
                      <CTableRow
                        key={anomaly.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleAnomalyClick(anomaly)}
                      >
                        <CTableDataCell>
                          {new Date(anomaly.timestamp).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {anomaly.details?.step_id || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getSeverityBadgeColor(anomaly.severity)}>
                            {anomaly.severity}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatAnomalyValue(anomaly.value, 'duration')}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatAnomalyValue(anomaly.threshold, 'duration')}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CProgress
                            value={anomaly.confidence * 100}
                            color={anomaly.confidence > 0.8 ? 'success' : anomaly.confidence > 0.6 ? 'warning' : 'danger'}
                          />
                          <small>{(anomaly.confidence * 100).toFixed(1)}%</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CTooltip content={anomaly.description}>
                            <span>
                              {anomaly.description.length > 50
                                ? anomaly.description.substring(0, 50) + '...'
                                : anomaly.description}
                            </span>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Anomaly Details Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Anomaly Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedAnomaly && (
            <div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>ID:</strong> {selectedAnomaly.id}
                </CCol>
                <CCol md={6}>
                  <strong>Timestamp:</strong> {new Date(selectedAnomaly.timestamp).toLocaleString()}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Severity:</strong>{' '}
                  <CBadge color={getSeverityBadgeColor(selectedAnomaly.severity)}>
                    {selectedAnomaly.severity}
                  </CBadge>
                </CCol>
                <CCol md={6}>
                  <strong>Confidence:</strong> {(selectedAnomaly.confidence * 100).toFixed(1)}%
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Duration:</strong> {formatAnomalyValue(selectedAnomaly.value, 'duration')}
                </CCol>
                <CCol md={6}>
                  <strong>Mean Duration:</strong> {formatAnomalyValue(selectedAnomaly.threshold, 'duration')}
                </CCol>
              </CRow>
              
              {selectedAnomaly.details && (
                <>
                  <h6>Execution Details</h6>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>PROG_ID:</strong> {selectedAnomaly.details.prog_id}
                    </CCol>
                    <CCol md={6}>
                      <strong>STEP_ID:</strong> {selectedAnomaly.details.step_id}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>Row Count:</strong> {selectedAnomaly.details.row_count?.toLocaleString()}
                    </CCol>
                    <CCol md={6}>
                      <strong>Status:</strong> {selectedAnomaly.details.status || 'N/A'}
                    </CCol>
                  </CRow>
                  {selectedAnomaly.details.error_text && (
                    <CRow className="mb-3">
                      <CCol xs={12}>
                        <strong>Error:</strong> {selectedAnomaly.details.error_text}
                      </CCol>
                    </CRow>
                  )}
                </>
              )}

              {selectedAnomaly.root_cause_analysis && (
                <>
                  <h6>Root Cause Analysis</h6>
                  <p><strong>Primary Cause:</strong> {selectedAnomaly.root_cause_analysis.primary_cause}</p>
                  <p><strong>Contributing Factors:</strong></p>
                  <ul>
                    {selectedAnomaly.root_cause_analysis.contributing_factors?.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                  <p><strong>Suggested Actions:</strong></p>
                  <ul>
                    {selectedAnomaly.root_cause_analysis.suggested_actions?.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <LoadingButton
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(selectedAnomaly, null, 2));
              setSuccess('Anomaly details copied to clipboard');
            }}
            color="info"
          >
            Copy JSON
          </LoadingButton>
          <LoadingButton onClick={() => setShowModal(false)} color="secondary">
            Close
          </LoadingButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AnomalyDetection; 