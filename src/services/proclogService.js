const getProcLogData = async (requestData) => {
  const response = await fetch('/edwapi/getProcLogService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error fetching proc log data');
  }

  const rawData = await response.json();
  return JSON.parse(rawData[0]);
};

const getStepIdList = async (requestData) => {
  const response = await fetch('/edwapi/getStepIdListService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('Error fetching step id list');
  }

  const rawData = await response.json();
  return JSON.parse(rawData[0]);
};

const getPackageList = async () => {
  const response = await fetch('/edwapi/getPackageListService', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching package list');
  }

  const rawData = await response.json();
  return JSON.parse(rawData[0]);
};

export {
  getProcLogData,
  getStepIdList,
  getPackageList,
}; 