import React from 'react';
import {
  CPagination,
  CPaginationItem,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';

const CustomTable = ({
  data,
  columns,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  truncateText,
  modalContent,
  isModalVisible,
  onCloseModal,
  customRowRender,
}) => {
  const formatNumber = (value, columnAccessor) => {
    if (!value && value !== 0) return '';
    // Skip formatting for ID fields
    if (columnAccessor.toLowerCase().includes('id')) {
      return value.toString();
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    const maxPages = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxPages - 1);

    if (start > 1) pages.push(
      <CPaginationItem key="start-ellipsis" onClick={() => onPageChange(1)}>1...</CPaginationItem>
    );
    
    for (let i = start; i <= end; i++) {
      pages.push(
        <CPaginationItem key={i} active={currentPage === i} onClick={() => onPageChange(i)}>{i}</CPaginationItem>
      );
    }
    
    if (end < totalPages) pages.push(
      <CPaginationItem key="end-ellipsis" onClick={() => onPageChange(totalPages)}>...{totalPages}</CPaginationItem>
    );

    return pages;
  };

  // Return null when there's no data
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="custom-table-container" style={{ 
        flex: '1 1 auto', 
        overflowY: 'auto', 
        minHeight: 0,
        position: 'relative',
        backgroundColor: 'var(--cui-table-bg)'
      }}>
        <table className="table table-sm table-hover table-striped mb-0" style={{ position: 'relative' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: 'var(--cui-table-header-bg)' }}>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="text-center"
                  onClick={(e) => e.preventDefault()}
                  title={column.tooltip} // Adding tooltip
                  style={{
                    borderRight: index !== columns.length - 1 ? '1px solid var(--cui-border-color)' : 'none',
                    borderBottom: '2px solid var(--cui-border-color)',
                    padding: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                    color: 'var(--cui-body-color)',
                    whiteSpace: 'nowrap',
                    backgroundColor: 'inherit',
                    cursor: 'help' // Changed cursor to help to indicate tooltip
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => {
                  const processedItem = customRowRender ? customRowRender(item) : item;
                  const value = processedItem[column.accessor];
                  
                  return (
                    <td 
                      key={colIndex}
                      className="text-center"
                      style={{
                        borderRight: colIndex !== columns.length - 1 ? '1px solid #dee2e6' : 'none',
                        backgroundColor: 'inherit'
                      }}
                    >
                      {column.truncate ? 
                        truncateText(value, column.maxLength) : 
                        typeof value === 'number' ? formatNumber(value, column.accessor) : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalVisible && (
        <CModal visible onClose={onCloseModal}>
          <CModalHeader>Detay</CModalHeader>
          <CModalBody>{modalContent}</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={onCloseModal}>Kapat</CButton>
          </CModalFooter>
        </CModal>
      )}

      {totalPages > 1 && data.length > 0 && (
        <div style={{ marginTop: '1rem', flexShrink: 0 }}>
          <CPagination className="justify-content-center" aria-label="Page navigation">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
            >
              First
            </CPaginationItem>
            {renderPagination()}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              Last
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  );
};

export default CustomTable;