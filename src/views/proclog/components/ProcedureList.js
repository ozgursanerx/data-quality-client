import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CBadge,
  CInputGroup,
  CInputGroupText,
  CTooltip,
} from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';
import CustomTable from '../../dashboard/components/CustomTable';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilCopy } from '@coreui/icons';

const ProcedureList = () => {
  const [progId, setProgId] = useState('');
  const [procedures, setProcedures] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const itemsPerPage = 5;

  const columns = [
    { header: '#', accessor: 'index', truncate: false },
    { header: 'Procedure', accessor: 'stepIdPrefix', truncate: false },
    { header: 'Actions', accessor: 'actions', truncate: false }
  ];

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    const filtered = procedures
      .map((proc, index) => ({
        index: index + 1,
        stepIdPrefix: proc,
        actions: 'copy'
      }))
      .filter(item => 
        item.stepIdPrefix.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    setFilteredProcedures(filtered);
  }, [procedures, searchText]);

  const fetchProcedures = async () => {
    if (!progId) {
      showError('Please enter a Program ID');
      return;
    }

    setIsLoading(true);
    setProcedures([]); // Reset previous results
    try {
      const response = await fetch('http://localhost:8080/edwapi/getStepIdGroupedService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progId: parseInt(progId),
          bgnTs: null,
          endTs: null,
          stepId: null,
          stepIdPrefix: null,
          groupBy: null
        }),
      });      if (response.ok) {
        const rawData = await response.json();
        try {          // Handle the case where the response is a string that needs to be parsed
          const jsonStr = Array.isArray(rawData) ? rawData[0] : rawData;
          const parsedData = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;

          // Ensure we have an array to work with
          const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
          
          // Get stepId values directly from the response
          const stepIds = [...new Set(dataArray
            .map(item => {
              try {
                const parsedItem = typeof item === 'string' ? JSON.parse(item) : item;
                return parsedItem.stepId;
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean))];          setProcedures(stepIds);
          
          if (stepIds.length === 0) {
            showError('No procedures found for this Program ID');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          showError('Error parsing response data');
          setProcedures([]);
        }
      } else {
        console.error('Error:', response.statusText);
        showError('Error fetching procedures');
        setProcedures([]);
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error connecting to server');
      setProcedures([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyProcedure = (procedure) => {
    navigator.clipboard.writeText(procedure.toString());
    showError('Procedure copied to clipboard!');
  };

  const truncateText = (text, maxLength = 30) => text;

  return (
    <CCard className="h-100">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>Procedure List</span>
        {filteredProcedures.length > 0 && (
          <CBadge color="info" shape="rounded-pill">
            {filteredProcedures.length} Procedures
          </CBadge>
        )}
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <div className="d-flex gap-2 align-items-center">
            <CFormLabel htmlFor="progId" className="mb-0" style={{ whiteSpace: 'nowrap' }}>Program ID:</CFormLabel>
            <CTooltip content="Prosedürleri görmek için ilgili Prog ID" placement="top">
              <CFormInput
                id="progId"
                type="number"
                value={progId}
                onChange={(e) => setProgId(e.target.value)}
                placeholder="Enter Program ID"
                style={{ maxWidth: '350px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    fetchProcedures();
                  }
                }}
              />
            </CTooltip>
            <LoadingButton 
              isLoading={isLoading} 
              onClick={fetchProcedures}
              style={{ whiteSpace: 'nowrap' }}
              size="sm"
            >
              Get Procedures
            </LoadingButton>
          </div>
        </div>

        {procedures.length > 0 && (
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CTooltip content="Filter the list of Procedures" placement="top">
              <CFormInput
                placeholder="Search Procedures..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </CTooltip>
          </CInputGroup>
        )}

        {error && (
          <div className={`alert alert-${error.includes('copied') ? 'success' : 'danger'} mb-3`}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
              <CustomTable
                data={filteredProcedures}
                columns={columns}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={Math.ceil(filteredProcedures.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                truncateText={truncateText}
                customRowRender={(item) => ({
                  ...item,
                  actions: (
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleCopyProcedure(item.stepIdPrefix)}
                    >
                      <CIcon icon={cilCopy} /> Copy
                    </button>
                  )
                })}
              />
            </div>
          </div>
        </div>

        {!isLoading && procedures.length === 0 && !error && (
          <div className="text-center text-muted mt-3">
            Enter a Program ID to see Procedures
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default ProcedureList;
