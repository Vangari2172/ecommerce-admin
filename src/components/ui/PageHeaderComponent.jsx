import React from 'react'
import { Button } from 'primereact/button'

const PageHeaderComponent = ({
  title,
  subtitle,
  actions = [],
  icon = null,
  className = '',
}) => {
  return (
    <div className={`page-header-component ${className}`}>
      <div className="page-header-content">
        <div className="page-header-title-section">
          {icon && <i className={`${icon} page-header-icon`}></i>}
          <div>
            <h1 className="page-header-title">{title}</h1>
            {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
          </div>
        </div>
        <div className="page-header-actions">
          {actions.map((action, index) => (
            <Button
              key={index}
              label={action.label}
              icon={action.icon}
              className={action.className || 'p-button-primary p-button-sm'}
              onClick={action.onClick}
              disabled={action.disabled}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PageHeaderComponent
