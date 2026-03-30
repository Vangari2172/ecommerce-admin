import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'

const FilterSectionComponent = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  showStats = false,
  stats = [],
  className = '',
}) => {
  return (
    <div className={`filter-section-component ${className}`}>
      <div className="filter-section-content">
        <div className="filter-section-filters">
          {onSearchChange && (
            <div className="filter-search-box">
              <i className="pi pi-search filter-search-icon"></i>
              <InputText
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="filter-search-input"
              />
            </div>
          )}
          
          {filters.map((filter, index) => (
            <Dropdown
              key={index}
              value={filter.value}
              options={filter.options}
              onChange={filter.onChange}
              placeholder={filter.placeholder}
              className="filter-dropdown"
            />
          ))}
        </div>
        
        {showStats && stats.length > 0 && (
          <div className="filter-section-stats">
            {stats.map((stat, index) => (
              <div key={index} className="filter-stat-item">
                <span className={`filter-stat-value ${stat.className || ''}`}>
                  {stat.value}
                </span>
                <span className="filter-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterSectionComponent
