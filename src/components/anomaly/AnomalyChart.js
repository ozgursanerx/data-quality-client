import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { getAnomalySeverityColor } from '../../services/anomalyService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const AnomalyChart = ({ 
  timeSeriesData = [], 
  anomalies = [], 
  title = 'Anomali Tespit Grafiği',
  height = 400,
  showLegend = true,
  onAnomalyClick = null
}) => {
  // Normal veri noktaları
  const normalData = timeSeriesData.map(point => ({
    x: new Date(point.timestamp),
    y: point.value
  }));

  // Anomali noktaları
  const anomalyData = anomalies.map(anomaly => ({
    x: new Date(anomaly.timestamp),
    y: anomaly.value,
    severity: anomaly.severity,
    id: anomaly.id,
    deviation: anomaly.deviation,
    confidence: anomaly.confidence_score
  }));

  // Anomalileri severity'ye göre grupla
  const anomaliesBySeverity = anomalies.reduce((acc, anomaly) => {
    if (!acc[anomaly.severity]) {
      acc[anomaly.severity] = [];
    }
    acc[anomaly.severity].push({
      x: new Date(anomaly.timestamp),
      y: anomaly.value,
      id: anomaly.id,
      deviation: anomaly.deviation,
      confidence: anomaly.confidence_score
    });
    return acc;
  }, {});

  const datasets = [
    {
      label: 'Normal Değerler',
      data: normalData,
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.1)',
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 4,
      tension: 0.1,
      fill: false
    }
  ];

  // Her severity seviyesi için ayrı dataset
  Object.entries(anomaliesBySeverity).forEach(([severity, data]) => {
    const color = getAnomalySeverityColor(severity);
    datasets.push({
      label: `${severity.charAt(0).toUpperCase() + severity.slice(1)} Anomaliler`,
      data: data,
      borderColor: color,
      backgroundColor: color,
      borderWidth: 0,
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false,
      pointStyle: 'triangle'
    });
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'point',
        intersect: false,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString('tr-TR');
          },
          label: (context) => {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y.toFixed(2);
            
            if (datasetLabel.includes('Anomali')) {
              const anomaly = context.raw;
              return [
                `${datasetLabel}: ${value}`,
                `Sapma: ${anomaly.deviation}%`,
                `Güven: ${(anomaly.confidence * 100).toFixed(1)}%`
              ];
            }
            
            return `${datasetLabel}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            hour: 'HH:mm',
            day: 'dd/MM'
          }
        },
        title: {
          display: true,
          text: 'Zaman'
        }
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Değer'
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onAnomalyClick) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const dataIndex = element.index;
        
        // Sadece anomali datasetleri için click event'i tetikle
        if (datasetIndex > 0) {
          const dataset = datasets[datasetIndex];
          const anomalyPoint = dataset.data[dataIndex];
          if (anomalyPoint.id) {
            const anomaly = anomalies.find(a => a.id === anomalyPoint.id);
            onAnomalyClick(anomaly);
          }
        }
      }
    }
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Line data={{ datasets }} options={options} />
    </div>
  );
};

AnomalyChart.propTypes = {
  timeSeriesData: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    metric_type: PropTypes.string
  })),
  anomalies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    severity: PropTypes.oneOf(['low', 'medium', 'high', 'critical']).isRequired,
    deviation: PropTypes.number,
    confidence_score: PropTypes.number
  })),
  title: PropTypes.string,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  onAnomalyClick: PropTypes.func
};

export default AnomalyChart; 