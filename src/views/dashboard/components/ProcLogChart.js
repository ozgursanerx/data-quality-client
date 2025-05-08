import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import LoadingButton from '../../../components/LoadingButton';

const ProcLogChart = () => {
  const [progId, setProgId] = useState('');
  const [stepId, setStepId] = useState('');
  const [timeType, setTimeType] = useState('D');
  const [firstDate, setFirstDate] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [useCustomDateRange, setUseCustomDateRange] = useState(false);
  const [toast, setToast] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    duration: [],
    rowCount: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const timeTypeOptions = [
    { label: 'Günlük', value: 'D' },
    { label: 'Haftalık', value: 'W' },
    { label: 'Aylık', value: 'M' }
  ];

  const showToast = (message, color = 'danger') => {
    setToast(
      <CToast autohide={true} visible={true} color={color}>
        <CToastHeader closeButton>
          <strong className="me-auto">Uyarı</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  const validateDates = () => {
    if (useCustomDateRange) {
      if (!firstDate || !lastDate) {
        showToast('Tarih aralığını belirtmelisiniz');
        return false;
      }
      if (firstDate > lastDate) {
        showToast('Başlangıç tarihi, bitiş tarihinden sonra olamaz');
        return false;
      }
    }
    return true;
  };

  const fetchData = async () => {
    if (!validateDates()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/edwapi/getEdwProcLogService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progId: parseInt(progId),
          stepId: stepId,
          timeType: useCustomDateRange ? 'DR' : timeType,
          firstDate: useCustomDateRange ? firstDate.replace(/-/g, '') : null,
          lastDate: useCustomDateRange ? lastDate.replace(/-/g, '') : null,
        }),
      });

      if (response.ok) {
        const rawData = await response.json();
        const parsedData = JSON.parse(rawData[0]);
        const processedData = Array.isArray(parsedData) ? parsedData : [parsedData];

        // Group data by date
        const groupedData = processedData.reduce((acc, item) => {
          const date = item.endTm.split(' ')[0]; // Get just the date part
          const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
          
          if (!acc[formattedDate]) {
            acc[formattedDate] = {
              totalDuration: 0,
              totalRowCount: 0,
              count: 0
            };
          }
          
          acc[formattedDate].totalDuration += item.duration || 0;
          acc[formattedDate].totalRowCount += item.rowCount || 0;
          acc[formattedDate].count += 1;
          
          return acc;
        }, {});

        // Convert grouped data into chart format
        const sortedDates = Object.keys(groupedData).sort();
        
        // Calculate daily values and overall averages
        let totalDuration = 0;
        let totalRowCount = 0;
        let totalDays = sortedDates.length;

        const chartData = {
          labels: sortedDates,
          duration: [],
          rowCount: [],
        };

        // Calculate daily values and sum for averages
        sortedDates.forEach(date => {
          const avgDuration = Math.round((groupedData[date].totalDuration / groupedData[date].count));
          const totalRowCountForDay = groupedData[date].totalRowCount;
          
          chartData.duration.push(avgDuration);
          chartData.rowCount.push(totalRowCountForDay);
          
          totalDuration += avgDuration;
          totalRowCount += totalRowCountForDay;
        });

        // Calculate overall averages
        const avgDuration = totalDuration / totalDays;
        const avgRowCount = totalRowCount / totalDays;

        // Add average lines data
        chartData.avgDuration = new Array(sortedDates.length).fill(avgDuration);
        chartData.avgRowCount = new Array(sortedDates.length).fill(avgRowCount);

        setChartData(chartData);
      } else {
        console.error('Error fetching data');
        showToast('Veri getirme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>Process Log Duration Analysis</CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol xs={12} md={2}>
            <CFormLabel htmlFor="progId">Prog ID</CFormLabel>
            <CFormInput
              id="progId"
              type="number"
              value={progId}
              onChange={(e) => setProgId(e.target.value)}
            />
          </CCol>
          <CCol xs={12} md={2}>
            <CFormLabel htmlFor="stepId">Step ID</CFormLabel>
            <CFormInput
              id="stepId"
              type="text"
              value={stepId}
              onChange={(e) => setStepId(e.target.value)}
            />
          </CCol>
          <CCol xs={12} md={2}>
            <CFormLabel htmlFor="timeType">Zaman Aralığı</CFormLabel>
            <CFormSelect
              id="timeType"
              value={timeType}
              onChange={(e) => setTimeType(e.target.value)}
            >
              {timeTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs={12} md={2}>
            <div className="mt-4">
              <CFormCheck
                id="useCustomDateRange"
                label="Tarih Aralığı Belirt"
                checked={useCustomDateRange}
                onChange={(e) => {
                  setUseCustomDateRange(e.target.checked);
                  if (!e.target.checked) {
                    setFirstDate('');
                    setLastDate('');
                  }
                }}
              />
            </div>
          </CCol>
          <CCol xs={12} md={2}>
            <CFormLabel htmlFor="firstDate">Başlangıç Tarihi</CFormLabel>
            <CFormInput
              id="firstDate"
              type="date"
              value={firstDate}
              onChange={(e) => setFirstDate(e.target.value)}
              disabled={!useCustomDateRange}
            />
          </CCol>
          <CCol xs={12} md={2}>
            <CFormLabel htmlFor="lastDate">Bitiş Tarihi</CFormLabel>
            <CFormInput
              id="lastDate"
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              disabled={!useCustomDateRange}
            />
          </CCol>
          <CCol className="mt-4" xs={12} md={2}>
            <LoadingButton isLoading={isLoading} onClick={fetchData}>
              Analiz Et
            </LoadingButton>
          </CCol>
        </CRow>

        <CChartLine
          style={{ height: '300px', width: '100%' }}
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: 'Duration (seconds)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                data: chartData.duration,
                yAxisID: 'y',
                tension: 0.3,
                pointRadius: chartData.labels.length === 1 ? 6 : 3,
              },
              {
                label: 'Average Duration',
                backgroundColor: 'transparent',
                borderColor: 'rgb(75, 192, 192)',
                borderDash: [5, 5],
                pointRadius: 0,
                data: chartData.avgDuration,
                yAxisID: 'y',
                tension: 0,
              },
              {
                label: 'Row Count',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgb(153, 102, 255)',
                pointBackgroundColor: 'rgb(153, 102, 255)',
                pointBorderColor: '#fff',
                data: chartData.rowCount,
                yAxisID: 'y1',
                tension: 0.3,
                pointRadius: chartData.labels.length === 1 ? 6 : 3,
              },
              {
                label: 'Average Row Count',
                backgroundColor: 'transparent',
                borderColor: 'rgb(153, 102, 255)',
                borderDash: [5, 5],
                pointRadius: 0,
                data: chartData.avgRowCount,
                yAxisID: 'y1',
                tension: 0,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            layout: {
              padding: chartData.labels.length === 1 ? { left: 100, right: 100 } : { left: 20, right: 20 }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  title: (context) => {
                    return context[0].label;
                  },
                  label: (context) => {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (label.includes('Duration')) {
                      label += Math.round(context.parsed.y) + ' seconds';
                    } else {
                      label += Math.round(context.parsed.y);
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                },
                grid: {
                  display: true,
                  drawOnChartArea: true
                },
                offset: true,
                bounds: 'ticks',
                min: chartData.labels.length === 1 ? 
                  new Date(chartData.labels[0]).getTime() - 43200000 : undefined, // 12 saat öncesi
                max: chartData.labels.length === 1 ? 
                  new Date(chartData.labels[0]).getTime() + 43200000 : undefined, // 12 saat sonrası
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Duration (seconds)',
                },
                beginAtZero: true,
                grid: {
                  display: true,
                },
                ticks: {
                  padding: chartData.labels.length === 1 ? 20 : 0,
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Row Count',
                },
                beginAtZero: true,
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  padding: chartData.labels.length === 1 ? 20 : 0,
                }
              },
            }
          }}
        />
        
        <CToaster placement="top-end">
          {toast}
        </CToaster>
      </CCardBody>
    </CCard>
  );
};

export default ProcLogChart;