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
import CustomTable from '../../../components/common/CustomTable';
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
    const searchTerm = searchText.trim().toLowerCase();
    const filtered = stepIds
      .map((stepId, index) => ({
        index: index + 1,
        stepId: stepId,
        actions: 'copy'
      }))
      .filter(item => {
        if (!searchTerm) return true;
        const stepIdStr = String(item.stepId || '').toLowerCase();
        return stepIdStr.includes(searchTerm);
      });
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
          showError('Error parsing response data');
        }
      } else {
        showError('Error fetching step IDs');
        setStepIds([]);
      }
    } catch (error) {
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
          <div className="d-flex gap-2 align-items-center">
            <CFormLabel htmlFor="progId" className="mb-0" style={{ whiteSpace: 'nowrap' }}>Program ID:</CFormLabel>
            <CTooltip content="Step ID'leri görmek için ilgili Prog ID" placement="top">
              <CFormInput
                id="progId"
                type="number"
                value={progId}
                onChange={(e) => setProgId(e.target.value)}
                placeholder="Enter Program ID"
                style={{ maxWidth: '350px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    fetchStepIds();
                  }
                }}
              />
            </CTooltip>
            <LoadingButton 
              isLoading={isLoading} 
              onClick={fetchStepIds}
              style={{ whiteSpace: 'nowrap' }}
              size="sm"
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
            <CTooltip content="Filter the list of Step IDs" placement="top">
              <CFormInput
                placeholder="Search Step IDs..."
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

        {/* Tablo - Sadece veri geldiğinde göster */}
        {stepIds.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '300px', maxHeight: '600px' }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
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
          </div>
        )}

        {/* Veri yoksa bilgilendirme */}
        {!isLoading && stepIds.length === 0 && !error && (
          <div className="text-center text-muted mt-3" style={{ minHeight: 'auto' }}>
            Program ID girip "Get Step IDs" butonuna tıklayın
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default StepIdList;