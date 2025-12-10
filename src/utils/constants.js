export const API_ENDPOINTS = {
  MONITOR_SUMMARY: '/edwapi/getMonitorSummaryService',
  MONITORING_RULES: '/edwapi/getMonitoringRulesService',
  MONITOR_DETAIL_TABLE: '/edwapi/getMonitorDetailTableService',
  PROC_LOG: '/edwapi/getProcLogService',
  EDW_PROC_LOG: '/edwapi/getEdwProcLogService',
  EDW_PROC_LOG_ANOMALY: '/edwapi/getEdwProcLogAnomalyService',
  // ENHANCED endpoint removed - use EDW_PROC_LOG_ANOMALY instead
  STEP_ID_LIST: '/edwapi/getStepIdListService',
  PACKAGE_LIST: '/edwapi/getPackageListService',
};

export const TABLE_CONFIG = {
  ITEMS_PER_PAGE: 8,
  MAX_TEXT_LENGTH: 30,
};

export const DETAIL_TABLE_OPTIONS = [
  { value: 'DA_MONITOR_KFT', label: 'KFT Monitor' },
  { value: 'DA_MONITOR_CP', label: 'CP Monitor' },
  { value: 'DA_MONITOR_CPR', label: 'CPR Monitor' },
  { value: 'DA_MONITOR_MT', label: 'MT Monitor' },
  { value: 'DA_MONITOR_OTHR', label: 'Other Monitor' },
  { value: 'DA_MONITOR_CREDIT_OFFER', label: 'Credit Offer Monitor' },
]; 