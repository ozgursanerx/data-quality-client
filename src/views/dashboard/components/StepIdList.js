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
} from '@coreui/react';
import LoadingButton from '../../../components/LoadingButton';
import CustomTable from './CustomTable';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilCopy } from '@coreui/icons';

const StepIdList = () => {
  const [progId, setProgId] = useState('');
  const [stepIds, setStepIds] = useState([]);
  const [filteredStepIds, setFilteredStepIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const itemsPerPage = 5;

  const columns = [
    { header: '#', accessor: 'index', truncate: false },
    { header: 'Step ID', accessor: 'stepId', truncate: false },
    { header: 'Actions', accessor: 'actions', truncate: false }
  ];

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    const filtered = stepIds
      .map((stepId, index) => ({
        index: index + 1,
        stepId: stepId,
        actions: 'copy'
      }))
      .filter(item => 
        item.stepId.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    setFilteredStepIds(filtered);
  }, [stepIds, searchText]);

  const fetchStepIds = async () => {
    if (!progId) {
      showError('Please enter a Program ID');
      return;
    }

    setIsLoading(true);
    setStepIds([]); // Reset previous results
    try {
      const response = await fetch('/edwapi/getStepIdService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progId: parseInt(progId)
        }),
      });

      if (response.ok) {
        const rawData = await response.json();
        let parsedData = rawData[0];
        try {
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData);
          }

          const stepIdArray = Array.isArray(parsedData) 
            ? parsedData.map(item => item.stepId).filter(Boolean)
            : [parsedData.stepId].filter(Boolean);
          
          setStepIds(stepIdArray);
          
          if (stepIdArray.length === 0) {
            showError('No step IDs found for this Program ID');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          showError('Error parsing response data');
        }
      } else {
        console.error('Error:', response.statusText);
        showError('Error fetching step IDs');
        setStepIds([]);
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error connecting to server');
      setStepIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyStepId = (stepId) => {
    navigator.clipboard.writeText(stepId.toString());
    showError('Step ID copied to clipboard!');
  };

  const truncateText = (text, maxLength = 30) => text;

  return (
    <CCard className="h-100">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>Step ID List</span>
        {filteredStepIds.length > 0 && (
          <CBadge color="info" shape="rounded-pill">
            {filteredStepIds.length} Steps
          </CBadge>
        )}
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormLabel htmlFor="progId">Program ID</CFormLabel>
          <div className="d-flex gap-2">
            <CFormInput
              id="progId"
              type="number"
              value={progId}
              onChange={(e) => setProgId(e.target.value)}
              placeholder="Enter Program ID"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  fetchStepIds();
                }
              }}
            />
            <LoadingButton 
              isLoading={isLoading} 
              onClick={fetchStepIds}
              style={{ whiteSpace: 'nowrap' }}
            >
              Get Step IDs
            </LoadingButton>
          </div>
        </div>

        {stepIds.length > 0 && (
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Search Step IDs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </CInputGroup>
        )}

        {error && (
          <div className={`alert alert-${error.includes('copied') ? 'success' : 'danger'} mb-3`}>
            {error}
          </div>
        )}

        <div className="d-flex flex-column" style={{ gap: '1rem', height: '250px' }}>
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <CustomTable
              data={filteredStepIds}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={Math.ceil(filteredStepIds.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              truncateText={truncateText}
              customRowRender={(item) => ({
                ...item,
                actions: (
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleCopyStepId(item.stepId)}
                  >
                    <CIcon icon={cilCopy} /> Copy
                  </button>
                )
              })}
            />
          </div>
        </div>

        {!isLoading && stepIds.length === 0 && !error && (
          <div className="text-center text-muted mt-3">
            Enter a Program ID to see Step IDs
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default StepIdList;