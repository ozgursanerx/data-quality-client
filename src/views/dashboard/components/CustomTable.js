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
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const maxPagesToShow = 5; // Maksimum gösterilecek sayfa numarası
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
    <>
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
        <CTable striped hover responsive className="mt-4" style={{ minWidth: '1200px' }}>
          <CTableHead>
            <CTableRow>
              {columns.map((column, index) => (
                <CTableHeaderCell key={index}>{column.header}</CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item, rowIndex) => (
              <CTableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <CTableDataCell key={colIndex}>
                    {column.truncate
                      ? truncateText(item[column.accessor], column.maxLength)
                      : item[column.accessor]}
                  </CTableDataCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <CModal visible={isModalVisible} onClose={onCloseModal}>
        <CModalHeader>Detay</CModalHeader>
        <CModalBody>{modalContent}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCloseModal}>
            Kapat
          </CButton>
        </CModalFooter>
      </CModal>

      <CPagination className="justify-content-center">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)} // Go to the first page
        >
          First
        </CPaginationItem>
        {renderPagination()}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)} // Go to the last page
        >
          Last
        </CPaginationItem>
      </CPagination>
    </>
  );
};

export default CustomTable;