export const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.replace(/-/g, '');
};

export const parseDate = (dateString) => {
  if (!dateString) return '';
  return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
}; 