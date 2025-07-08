import { API_ENDPOINTS } from '../utils/constants';

export const getPackageAnalysis = async ({ progId, date }) => {
  // Çalışan getEdwProcLogService endpoint'ini kullanarak paket analizi yapıyoruz
  const requestData = {
    progId: parseInt(progId),
    stepId: null, // Tüm step'ler için
    timeType: date ? 'DR' : 'W', // Date varsa date range, yoksa son hafta (W)
    firstDate: date ? date.replace(/-/g, '') : null,
    lastDate: date ? date.replace(/-/g, '') : null,
    stepIdGrp: 'S', // Step bazında
    stepIdPrefix: null
  };

  const response = await fetch(API_ENDPOINTS.EDW_PROC_LOG, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  
  if (!response.ok) throw new Error('Error fetching package analysis');
  
  const rawData = await response.json();
  const data = JSON.parse(rawData[0]);
  const processedData = Array.isArray(data) ? data : [data];
  
  // Debug: İlk satırın tüm alanlarını göster
  if (processedData.length > 0) {
    console.log('İlk satırın tüm alanları:', processedData[0]);
    console.log('Mevcut alan adları:', Object.keys(processedData[0]));
  }
  
  // Veriyi analiz ederek istatistikleri hesaplıyoruz
  const procedures = {};
  const steps = {};
  let totalDuration = 0;
  let totalRows = 0;
  
  processedData.forEach(row => {
    const stepBase = row.stepId?.split('-')[0] || row.stepId;
    const duration = parseFloat(row.duration) || 0;
    const rowCount = parseInt(row.rowCount) || 0;
    
    // ErrorText alanına göre durum belirleme
    const errorText = row.errorText;
    const status = errorText === null || errorText === undefined || errorText === '' ? 'SUCCESS' : 'ERROR';
    
    console.log('ErrorText değeri:', errorText, 'Belirlenen durum:', status);
    
    totalDuration += duration;
    totalRows += rowCount;
    
    if (!procedures[stepBase]) {
      procedures[stepBase] = { totalDuration: 0, totalRows: 0, stepCount: 0 };
    }
    procedures[stepBase].totalDuration += duration;
    procedures[stepBase].totalRows += rowCount;
    procedures[stepBase].stepCount += 1;
    
    steps[row.stepId] = {
      procedure: stepBase,
      step: row.stepId,
      duration: duration,
      rowCount: rowCount,
      startTime: row.startTm,
      endTime: row.endTm,
      status: status, // ErrorText'e göre belirlenen durum
      errorText: errorText || ''
    };
  });
  
  // En uzun süren prosedür ve step'i buluyoruz
  const longestProcedure = Object.entries(procedures)
    .sort(([,a], [,b]) => b.totalDuration - a.totalDuration)[0]?.[0] || '';
  
  const longestStep = Object.entries(steps)
    .sort(([,a], [,b]) => b.duration - a.duration)[0]?.[0] || '';
  
  return {
    stats: {
      longestProcedure,
      longestStep,
      avgDuration: processedData.length > 0 ? Math.round(totalDuration / processedData.length) : 0,
      totalProcedures: Object.keys(procedures).length,
      totalSteps: Object.keys(steps).length,
      totalRows,
      totalDuration: Math.round(totalDuration)
    },
    tableData: Object.values(steps),
    chartData: Object.entries(procedures).map(([name, proc]) => ({
      label: name,
      value: Math.round(proc.totalDuration)
    })),
    history: [] // Geçmiş veri için ayrı bir endpoint gerekebilir
  };
}; 