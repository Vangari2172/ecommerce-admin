import React from 'react'
import { Tag } from 'primereact/tag'

const StockBadgeComponent = ({ stock, showLabel = true }) => {
  const getSeverity = () => {
    if (stock === 0) return 'danger'
    if (stock <= 10) return 'warning'
    return 'success'
  }

  const getLabel = () => {
    if (stock === 0) return 'Out of Stock'
    if (stock <= 10) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="stock-badge-component">
      <Tag
        value={getLabel()}
        severity={getSeverity()}
        className="stock-badge"
      />
      {showLabel && (
        <span className="stock-count">{stock} units</span>
      )}
    </div>
  )
}

export default StockBadgeComponent
