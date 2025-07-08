// Import mock service only
import { mockAnomalyService } from './mockAnomalyService';

// Use only mock service for now to avoid any axios issues
const anomalyService = mockAnomalyService;

export default anomalyService;

// Export mock service
export { mockAnomalyService };

// Utility functions for anomaly handling
export const getAnomalySeverityColor = (severity) => {
  const colors = {
    LOW: '#28a745',      // Green
    MEDIUM: '#ffc107',   // Yellow
    HIGH: '#fd7e14',     // Orange
    CRITICAL: '#dc3545'  // Red
  };
  return colors[severity?.toUpperCase()] || '#6c757d';
};

export const formatAnomalyValue = (value, metricType) => {
  if (typeof value !== 'number') return 'N/A';
  
  switch (metricType?.toLowerCase()) {
    case 'duration':
      return `${(value / 60).toFixed(2)} min`;
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'count':
      return Math.round(value).toLocaleString();
    default:
      return value.toFixed(2);
  }
};

export const exportAnomaliesCSV = (anomalies, filename = 'anomalies.csv') => {
  if (!anomalies || anomalies.length === 0) {
    alert('No anomalies to export');
    return;
  }

  const headers = ['ID', 'Timestamp', 'Severity', 'Type', 'Description', 'Duration (min)', 'Mean Duration (min)', 'Confidence', 'Step ID', 'Prog ID'];
  const csvContent = [
    headers.join(','),
    ...anomalies.map(anomaly => [
      anomaly.id,
      anomaly.timestamp,
      anomaly.severity,
      anomaly.type,
      `"${anomaly.description}"`,
      (anomaly.value / 60).toFixed(2),
      (anomaly.threshold / 60).toFixed(2),
      anomaly.confidence.toFixed(2),
      anomaly.details?.step_id || '',
      anomaly.details?.prog_id || ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 