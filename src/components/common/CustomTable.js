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
  currentPage = 1,
  itemsPerPage = 10,
  totalPages,
  onPageChange,
  truncateText,
  modalContent,
  isModalVisible,
  onCloseModal,
  customRowRender,
  onRowClick,
}) => {
  const formatNumber = (value, columnAccessor) => {
    if (!value && value !== 0) return '';
    // Skip formatting for ID fields
    if (columnAccessor.toLowerCase().includes('id')) {
      return value.toString();
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Calculate pagination values
  const calculatedTotalPages = totalPages || Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    const maxPages = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(calculatedTotalPages, start + maxPages - 1);

    if (start > 1) pages.push(
      <CPaginationItem key="start-ellipsis" onClick={() => onPageChange(1)}>1...</CPaginationItem>
    );
    
    for (let i = start; i <= end; i++) {
      pages.push(
        <CPaginationItem key={i} active={currentPage === i} onClick={() => onPageChange(i)}>{i}</CPaginationItem>
      );
    }
    
    if (end < calculatedTotalPages) pages.push(
      <CPaginationItem key="end-ellipsis" onClick={() => onPageChange(calculatedTotalPages)}>...{calculatedTotalPages}</CPaginationItem>
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
              <tr 
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default'
                }}
                className={onRowClick ? 'table-row-hover' : ''}
              >
                {columns.map((column, colIndex) => {
                  const processedItem = customRowRender ? customRowRender(item) : item;
                  const value = processedItem[column.accessor];
                  
                  // Durum kolonu için özel renklendirme
                  const renderStatusCell = (status) => {
                    if (column.accessor === 'status') {
                      const isSuccess = status === 'SUCCESS';
                      return (
                        <span
                          style={{
                            color: isSuccess ? '#28a745' : '#dc3545',
                            fontWeight: 'bold'
                          }}
                        >
                          {isSuccess ? 'Başarılı' : 'Hatalı'}
                        </span>
                      );
                    }
                    return null;
                  };
                  
                  return (
                    <td 
                      key={colIndex}
                      className="text-center"
                      style={{
                        borderRight: colIndex !== columns.length - 1 ? '1px solid var(--cui-border-color)' : 'none',
                        backgroundColor: 'inherit',
                        color: 'var(--cui-body-color)',
                        padding: '0.75rem'
                      }}
                    >
                      {column.accessor === 'status' ? 
                        renderStatusCell(value) :
                        column.truncate ? 
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

      {calculatedTotalPages > 1 && data.length > 0 && (
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
              disabled={currentPage === calculatedTotalPages}
              onClick={() => onPageChange(calculatedTotalPages)}
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