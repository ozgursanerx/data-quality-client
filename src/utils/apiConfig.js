/**
 * API Configuration
 * Production'da environment variable'dan, development'ta relative path kullanır
 */
export const getApiBaseUrl = () => {
  // Production'da environment variable'dan al
  if (import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Development'ta relative path (proxy kullanır)
  return '';
};

export const buildApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  // Eğer endpoint zaten tam URL ise, olduğu gibi döndür
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  // Base URL varsa ekle, yoksa relative path kullan
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
};

