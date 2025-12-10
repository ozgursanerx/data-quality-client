import React, { useState, useEffect } from 'react';
import { CRow, CCol, CCard, CCardBody, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilStorage } from '@coreui/icons';

const DailyTableStats = () => {
  const CACHE_KEY = 'daily_table_stats_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika (milisaniye cinsinden)

  const [stats, setStats] = useState([
    { tableName: 'Müşteri', todayCount: null, yesterdayCount: null, loading: true },
    { tableName: 'Giden Para Transferi', todayCount: null, yesterdayCount: null, loading: true },
    { tableName: 'Gelen Para Transferi', todayCount: null, yesterdayCount: null, loading: true },
  ]);

  // Cache'den veri oku
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Cache hala geçerli mi? (5 dakika içinde mi?)
      if (now - timestamp < CACHE_DURATION) {
        return data;
      } else {
        // Cache süresi dolmuş, temizle
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // Cache'e veri yaz
  const setCachedData = (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      // Cache write error - silently fail
    }
  };

  // API'den veri çek
  const fetchStatsFromAPI = async () => {
    try {
      const response = await fetch('/edwapi/getDailyTableStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // API response'unu component state'ine dönüştür
      const statsData = [
        { 
          tableName: 'Müşteri', 
          todayCount: data.custCount || 0, 
          yesterdayCount: data.previousCustCount || 0, 
          loading: false 
        },
        { 
          tableName: 'Giden Para Transferi', 
          todayCount: data.moneyTransferPatternCount || 0, 
          yesterdayCount: data.previousMoneyTransferPatternCount || 0, 
          loading: false 
        },
        { 
          tableName: 'Gelen Para Transferi', 
          todayCount: data.incomingMoneyTrnsPatternCount || 0, 
          yesterdayCount: data.previousIncomingMoneyTrnsPatternCount || 0, 
          loading: false 
        },
      ];

      // Cache'e kaydet
      setCachedData(statsData);
      
      // State'i güncelle
      setStats(statsData);
    } catch (error) {
      // Hata durumunda loading'i false yap ve boş değerler göster
      setStats([
        { 
          tableName: 'Müşteri', 
          todayCount: null, 
          yesterdayCount: null, 
          loading: false 
        },
        { 
          tableName: 'Giden Para Transferi', 
          todayCount: null, 
          yesterdayCount: null, 
          loading: false 
        },
        { 
          tableName: 'Gelen Para Transferi', 
          todayCount: null, 
          yesterdayCount: null, 
          loading: false 
        },
      ]);
    }
  };

  useEffect(() => {
    // Önce cache'i kontrol et
    const cachedData = getCachedData();
    
    if (cachedData) {
      // Cache'de veri varsa direkt göster
      setStats(cachedData);
    } else {
      // Cache yoksa veya süresi dolmuşsa API'den çek
      fetchStatsFromAPI();
    }
  }, []);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('tr-TR');
  };

  const getChangeIndicator = (today, yesterday) => {
    if (today === null || yesterday === null) return null;
    const change = today - yesterday;
    const percentChange = yesterday > 0 ? ((change / yesterday) * 100).toFixed(1) : 0;
    
    if (change > 0) {
      return { text: `+${formatNumber(change)} (+${percentChange}%)`, color: 'success' };
    } else if (change < 0) {
      return { text: `${formatNumber(change)} (${percentChange}%)`, color: 'danger' };
    } else {
      return { text: 'Değişiklik yok', color: 'secondary' };
    }
  };

  return (
    <CRow className="g-4">
      {stats.map((stat, index) => {
        const change = getChangeIndicator(stat.todayCount, stat.yesterdayCount);
        
        return (
          <CCol key={index} xs={12} md={4}>
            <CCard 
              className="h-100 shadow-sm" 
              style={{ 
                backgroundColor: 'var(--cui-card-bg)',
                borderColor: 'var(--cui-border-color)',
                borderRadius: '12px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <CCardBody className="p-4">
                {/* Tablo Adı */}
                <div className="d-flex align-items-center mb-3">
                  <CIcon 
                    icon={cilStorage} 
                    className="me-2" 
                    style={{ 
                      fontSize: '1.5rem', 
                      color: 'var(--cui-primary)' 
                    }} 
                  />
                  <h6 
                    className="mb-0 fw-bold" 
                    style={{ 
                      color: 'var(--cui-body-color)',
                      fontSize: '1rem'
                    }}
                  >
                    {stat.tableName}
                  </h6>
                </div>

                {/* Bugünkü Sayı */}
                {stat.loading ? (
                  <div className="text-center py-4">
                    <CSpinner color="primary" size="sm" />
                  </div>
                ) : (
                  <>
                    <div className="mb-2">
                      <div 
                        className="fw-bold" 
                        style={{ 
                          fontSize: '2.5rem',
                          color: 'var(--cui-body-color)',
                          lineHeight: '1.2',
                          fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                      >
                        {formatNumber(stat.todayCount)}
                      </div>
                      <div 
                        className="small mt-1" 
                        style={{ 
                          color: 'var(--cui-body-color-secondary)',
                          fontSize: '0.875rem',
                          opacity: 0.7
                        }}
                      >
                        Bugün
                      </div>
                    </div>

                    {/* Dünkü Sayı */}
                    <div className="mt-3 pt-3 border-top" style={{ borderColor: 'var(--cui-border-color)' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div 
                            className="small mb-1" 
                            style={{ 
                              color: 'var(--cui-body-color-secondary)',
                              fontSize: '0.75rem',
                              opacity: 0.6
                            }}
                          >
                            Dün
                          </div>
                          <div 
                            className="fw-semibold" 
                            style={{ 
                              color: 'var(--cui-body-color-secondary)',
                              fontSize: '1.25rem',
                              opacity: 0.8
                            }}
                          >
                            {formatNumber(stat.yesterdayCount)}
                          </div>
                        </div>
                        {change && (
                          <div 
                            className={`badge bg-${change.color}-subtle text-${change.color}`}
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.35rem 0.65rem'
                            }}
                          >
                            {change.text}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        );
      })}
    </CRow>
  );
};

export default DailyTableStats;

