import React, { useState } from 'react'
import { CForm, CFormInput, CInputGroup, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchTerm)
  }

  return (
    <CForm className="d-flex" onSubmit={handleSearch}>
      <CInputGroup>
        <CFormInput
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CButton type="submit" color="primary" variant="outline">
          <CIcon icon={cilSearch} />
        </CButton>
      </CInputGroup>
    </CForm>
  )
}

export default SearchBar