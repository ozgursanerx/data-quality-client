const getMonitorSummary = async (requestData) => {
  const response = await fetch('/edwapi/getMonitorSummaryService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error fetching monitor summary data');
  }

  const rawData = await response.json();
  return JSON.parse(rawData[0]);
};

const getMonitoringRules = async (requestData) => {
  const response = await fetch('/edwapi/getMonitoringRulesService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error fetching monitoring rules');
  }

  const rawData = await response.json();
  return JSON.parse(rawData[0]);
};

const getMonitorDetailTable = async (requestData) => {
  const response = await fetch('/edwapi/getMonitorDetailTableService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error fetching monitor detail table');
  }

  const rawData = await response.json();
  if (Array.isArray(rawData) && rawData.length > 0) {
    try {
      return JSON.parse(rawData[0]);
    } catch (error) {
      return [];
    }
  }
  return Array.isArray(rawData) ? rawData : [rawData];
};

// DA Monitor Types Services
const getDaMonitorTypes = async (requestData) => {
  const response = await fetch('/edwapi/getDaMonitorTypesService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error fetching DA monitor types');
  }

  const rawData = await response.json();
  
  // Backend'den gelen response formatını kontrol et
  if (Array.isArray(rawData) && rawData.length > 0) {
    try {
      // Eğer string formatında JSON geliyorsa parse et
      if (typeof rawData[0] === 'string') {
        const parsedData = JSON.parse(rawData[0]);
        return Array.isArray(parsedData) ? parsedData : [parsedData];
      }
      // Eğer zaten object formatında geliyorsa direkt kullan
      return rawData;
    } catch (error) {
      console.error('Error parsing DA monitor types response:', error);
      return [];
    }
  }
  
  // Fallback: rawData'yı direkt döndür
  return Array.isArray(rawData) ? rawData : [rawData];
};

const saveOrUpdateDaMonitorTypes = async (requestData) => {
  const response = await fetch('/edwapi/saveOrUpdateDaMonitorTypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error saving/updating DA monitor types');
  }

  return await response.json();
};

const insertDaMonitorTypes = async (requestData) => {
  const response = await fetch('/edwapi/insertDaMonitorTypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error inserting DA monitor types');
  }

  return await response.json();
};

const updateDaMonitorTypes = async (requestData) => {
  const response = await fetch('/edwapi/updateDaMonitorTypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error updating DA monitor types');
  }

  return await response.json();
};

const deactivateDaMonitorTypes = async (requestData) => {
  const response = await fetch('/edwapi/deactivateDaMonitorTypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error deactivating DA monitor types');
  }

  return await response.json();
};

const getDeleteConfirmationByTypeId = async (requestData) => {
  const response = await fetch('/edwapi/getDeleteConfirmationByTypeId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error getting delete confirmation');
  }

  return await response.json();
};

const getAllRecordsByTypeId = async (requestData) => {
  const response = await fetch('/edwapi/getAllRecordsByTypeId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error getting all records by type ID');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};

const deleteByTypeIdWithConfirmation = async (requestData) => {
  const response = await fetch('/edwapi/deleteByTypeIdWithConfirmation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error deleting by type ID');
  }

  return await response.json();
};

export {
  getMonitorSummary,
  getMonitoringRules,
  getMonitorDetailTable,
  // DA Monitor Types Services
  getDaMonitorTypes,
  saveOrUpdateDaMonitorTypes,
  insertDaMonitorTypes,
  updateDaMonitorTypes,
  deactivateDaMonitorTypes,
  getDeleteConfirmationByTypeId,
  getAllRecordsByTypeId,
  deleteByTypeIdWithConfirmation,
}; 