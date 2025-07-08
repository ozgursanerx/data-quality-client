import React, { useState } from 'react';
import { CListGroup, CListGroupItem, CFormInput, CInputGroup, CTooltip } from '@coreui/react';

const PackageList = ({ onPackageSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const packages = [
    { name: 'CUST', id: 155 },
    { name: 'CUST QPI', id: 159 },
    { name: 'CUST Harcama Analizi', id: 159 },
    { name: 'Harcama Analizi', id: 162 },
    { name: 'Collection', id: 172 },
    { name: 'Tüzel', id: 155 },
    { name: 'Tüzel Data', id: 154 },
    { name: 'Tüzel CUST', id: 158 },
    { name: 'Tüzel KFT', id: 157 },
    { name: 'Tüzel Talimatlı', id: 156 },
    { name: 'Kredi Kartı', id: 150 },
    { name: 'KFT', id: 151 },
    { name: 'MTV', id: 152 },
    { name: 'Fatura', id: 153 },
    { name: 'Gelen MT', id: 37 },
    { name: 'Giden MT', id: 36 },
    { name: 'CPR', id: 171 },
    { name: 'Abonelik', id: 56 },
    { name: 'Kazananlar Kulübü - WNC', id: 171 },
    { name: 'Monitoring', id: 156 },
  ];

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="package-list">
      <CInputGroup className="mb-3">
        <CTooltip content="Paket listesinde arama yapmak için paket adını girin" placement="top">
          <CFormInput
            placeholder="Paket ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CTooltip>
      </CInputGroup>
      <CListGroup>
        {filteredPackages.map((pkg) => (
          <CListGroupItem
            key={`${pkg.name}-${pkg.id}`}
            onClick={() => onPackageSelect(pkg.id)}
            style={{ cursor: 'pointer' }}
            className="d-flex justify-content-between align-items-center"
          >
            {pkg.name}
            <small className="text-medium-emphasis">{pkg.id}</small>
          </CListGroupItem>
        ))}
      </CListGroup>
      <style>
        {`
          .package-list {
            max-height: calc(100vh - 300px);
            overflow-y: auto;
            padding-right: 10px;
          }
          .package-list::-webkit-scrollbar {
            width: 6px;
          }
          .package-list::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .package-list::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
};

export default PackageList;