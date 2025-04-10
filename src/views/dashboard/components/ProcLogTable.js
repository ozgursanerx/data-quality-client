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
} from '@coreui/react';

const ProcLogTable = ({ data, currentPage, itemsPerPage, onPageChange, onShowFullText }) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Step ID</CTableHeaderCell>
            <CTableHeaderCell>Prog ID</CTableHeaderCell>
            <CTableHeaderCell>SQL Full Text</CTableHeaderCell>
            <CTableHeaderCell>Start Time</CTableHeaderCell>
            <CTableHeaderCell>Duration</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{item.stepId}</CTableDataCell>
              <CTableDataCell>{item.progId}</CTableDataCell>
              <CTableDataCell>
                {item.sqlFullText.length > 100
                  ? `${item.sqlFullText.substring(0, 100)}... `
                  : item.sqlFullText}
                {item.sqlFullText.length > 100 && (
                  <CButton color="link" onClick={() => onShowFullText(item.sqlFullText)}>
                    Devamını Göster
                  </CButton>
                )}
              </CTableDataCell>
              <CTableDataCell>{item.startTm}</CTableDataCell>
              <CTableDataCell>{item.duration}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CPagination className="justify-content-center">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {Array.from({ length: totalPages }, (_, index) => (
          <CPaginationItem
            key={index}
            active={currentPage === index + 1}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>
    </>
  );
};

export default ProcLogTable;