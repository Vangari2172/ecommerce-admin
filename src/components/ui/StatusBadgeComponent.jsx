import React from 'react'
import { Tag } from 'primereact/tag'

const StatusBadgeComponent = ({ status, type = 'status' }) => {
  const getSeverity = () => {
    if (type === 'stock') {
      if (status === 0 || status === 'out_of_stock') return 'danger'
      if (status <= 10 || status === 'low_stock') return 'warning'
      return 'success'
    }
    
    if (type === 'status') {
      switch (status) {
        case 'active':
        case 'delivered':
        case 'completed':
          return 'success'
        case 'low_stock':
        case 'pending':
        case 'processing':
          return 'warning'
        case 'out_of_stock':
        case 'cancelled':
        case 'danger':
          return 'danger'
        case 'shipped':
        case 'info':
          return 'info'
        default:
          return 'info'
      }
    }
    
    return 'info'
  }

  const getValue = () => {
    if (type === 'stock') {
      if (status === 0) return 'Out of Stock'
      if (status <= 10) return 'Low Stock'
      return 'In Stock'
    }
    
    return status ? status.replace(/_/g, ' ').toUpperCase() : ''
  }

  return (
    <Tag
      value={getValue()}
      severity={getSeverity()}
      className={`status-badge-${type}`}
    />
  )
}

export default StatusBadgeComponent
