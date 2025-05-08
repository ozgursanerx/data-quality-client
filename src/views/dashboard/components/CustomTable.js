import React from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
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
  onShowFullText,
  onCloseModal,
  customRowRender,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <CPaginationItem
          key={i}
          active={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </CPaginationItem>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <CPaginationItem onClick={() => onPageChange(startPage - 1)}>...</CPaginationItem>
        )}
        {pages}
        {endPage < totalPages && (
          <CPaginationItem onClick={() => onPageChange(endPage + 1)}>...</CPaginationItem>
        )}
      </>
    );
  };

  return (
    <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <CTable striped hover className="mb-0">
        <CTableHead>
          <CTableRow>
            {columns.map((column, index) => (
              <CTableHeaderCell 
                key={index}
                className="bg-body-tertiary"
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                }}
              >
                {column.header}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item, rowIndex) => (
            <CTableRow key={rowIndex}>
              {columns.map((column, colIndex) => {
                const processedItem = customRowRender ? customRowRender(item) : item;
                return (
                  <CTableDataCell key={colIndex}>
                    {column.truncate
                      ? truncateText(processedItem[column.accessor], column.maxLength)
                      : processedItem[column.accessor]}
                  </CTableDataCell>
                );
              })}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={isModalVisible} onClose={onCloseModal}>
        <CModalHeader>Detay</CModalHeader>
        <CModalBody>{modalContent}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCloseModal}>
            Kapat
          </CButton>
        </CModalFooter>
      </CModal>

      <div className="mt-3">
        <CPagination className="justify-content-center">
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
    </div>
  );
};

export default CustomTable;