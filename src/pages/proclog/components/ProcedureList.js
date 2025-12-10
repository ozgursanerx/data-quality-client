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
import { buildApiUrl } from '../../../utils/apiConfig';

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
    const searchTerm = searchText.trim().toLowerCase();
    const filtered = procedures
      .map((proc, index) => ({
        index: index + 1,
        stepIdPrefix: proc,
        actions: 'copy'
      }))
      .filter(item => {
        if (!searchTerm) return true;
        const procedureStr = String(item.stepIdPrefix || '').toLowerCase();
        return procedureStr.includes(searchTerm);
      });
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
      const response = await fetch(buildApiUrl('/edwapi/getStepIdGroupedService'), {
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
      });
      
      if (response.ok) {
        const rawData = await response.json();
        
        try {
          // Handle the case where the response is a string that needs to be parsed
          let parsedData = Array.isArray(rawData) ? rawData[0] : rawData;
          
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData);
          }

          // Ensure we have an array to work with
          const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
          
          // Extract procedure prefixes from step IDs
          // Handles multiple patterns:
          // 1. "P_INC_BUCKET_CALC_STARTER-100-GKK" -> "P_INC_BUCKET_CALC_STARTER-GKK" (remove middle number)
          // 2. "P_INC_GROUP_NAME_KEYS-101" -> "P_INC_GROUP_NAME_KEYS" (remove trailing number)
          // 3. "P_DA_INC_MNY_TRNSFR_PATTERN_POST-10" -> "P_DA_INC_MNY_TRNSFR_PATTERN_POST" (remove trailing number)
          // 4. "P_INC_BUCKET_CALC_STARTER" -> "P_INC_BUCKET_CALC_STARTER" (no change)
          const extractProcedurePrefix = (stepIdStr) => {
            if (!stepIdStr) return null;
            
            let str = String(stepIdStr).trim();
            
            // Pattern 1: Remove middle numbers in format "PROCEDURE-NUMBER-SUFFIX"
            // Example: "P_INC_BUCKET_CALC_STARTER-100-GKK" -> "P_INC_BUCKET_CALC_STARTER-GKK"
            // Example: "P_INC_DA_MNY_TRNSFR_BUCKET_INS-110-GPT" -> "P_INC_DA_MNY_TRNSFR_BUCKET_INS-GPT"
            const middleNumberMatch = str.match(/^(.+?)-(\d+)-(.+)$/);
            if (middleNumberMatch) {
              const prefix = middleNumberMatch[1];
              const number = middleNumberMatch[2];
              const suffix = middleNumberMatch[3];
              // Only remove if the number is purely numeric and suffix doesn't start with number
              if (/^\d+$/.test(number) && !/^\d/.test(suffix)) {
                return `${prefix}-${suffix}`;
              }
            }
            
            // Pattern 2: Remove trailing numbers with dash separator
            // Examples:
            // "P_INC_GROUP_NAME_KEYS-101" -> "P_INC_GROUP_NAME_KEYS"
            // "P_INC_GROUP_NAME_KEYS-102" -> "P_INC_GROUP_NAME_KEYS"
            // "P_DA_INC_MNY_TRNSFR_PATTERN_POST-10" -> "P_DA_INC_MNY_TRNSFR_PATTERN_POST"
            // "PROC-100" -> "PROC"
            const trailingDashNumberMatch = str.match(/^(.+?)-\d+$/);
            if (trailingDashNumberMatch) {
              return trailingDashNumberMatch[1];
            }
            
            // Pattern 3: Remove trailing numbers with underscore separator
            // Examples:
            // "P_DA_INC_MNY_TRNSFR_PATTERN_POST_20" -> "P_DA_INC_MNY_TRNSFR_PATTERN_POST"
            // "PROC_100" -> "PROC"
            const trailingUnderscoreNumberMatch = str.match(/^(.+?)_\d+$/);
            if (trailingUnderscoreNumberMatch) {
              return trailingUnderscoreNumberMatch[1];
            }
            
            // Pattern 4: Remove trailing numbers without separator (if prefix doesn't end with number)
            // Example: "PROC100" -> "PROC" (only if PROC doesn't end with number)
            const trailingNumberNoSepMatch = str.match(/^(.+?)(\d+)$/);
            if (trailingNumberNoSepMatch) {
              const prefix = trailingNumberNoSepMatch[1];
              const suffix = trailingNumberNoSepMatch[2];
              // Only remove if suffix is numeric and prefix doesn't end with number
              if (/^\d+$/.test(suffix) && !/\d$/.test(prefix)) {
                return prefix;
              }
            }
            
            // If no pattern matches, return as is
            return str;
          };
          
          // Get unique procedure prefixes from step IDs
          const procedures = [...new Set(dataArray
            .map((item, index) => {
              try {
                let stepId = null;
                
                // Extract stepId from different possible structures
                if (typeof item === 'string') {
                  try {
                    const parsed = JSON.parse(item);
                    stepId = parsed.stepId || parsed.stepIdPrefix || item;
                  } catch (e) {
                    stepId = item;
                  }
                } else if (item && typeof item === 'object') {
                  stepId = item.stepId || item.stepIdPrefix || 
                          Object.values(item).find(v => typeof v === 'string' && v.length > 0);
                } else {
                  stepId = item;
                }
                
                if (!stepId) {
                  return null;
                }
                
                // Extract procedure prefix from stepId
                const procedurePrefix = extractProcedurePrefix(stepId);
                return procedurePrefix;
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean)
            .sort())]; // Sort alphabetically
          
          setProcedures(procedures);
          
          if (procedures.length === 0) {
            showError('Bu Prog ID için prosedür bulunamadı');
          } else {
            setError(null); // Clear any previous errors
          }
        } catch (parseError) {
          showError('Yanıt verisi parse edilemedi.');
          setProcedures([]);
        }
      } else {
        showError('Error fetching procedures');
        setProcedures([]);
      }
    } catch (error) {
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

        {/* Tablo - Sadece veri geldiğinde göster */}
        {procedures.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '300px', maxHeight: '600px' }}>
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
        )}

        {/* Veri yoksa bilgilendirme */}
        {!isLoading && procedures.length === 0 && !error && progId === '' && (
          <div className="text-center text-muted mt-3" style={{ minHeight: 'auto' }}>
            Prosedürleri görmek için Program ID girin
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default ProcedureList;
