import React, { useRef } from 'react'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'

const ActionMenuComponent = ({
  items = [],
  icon = 'pi pi-ellipsis-v',
  buttonClassName = 'p-button-text p-button-sm',
  onItemSelect,
}) => {
  const menuRef = useRef(null)

  const handleClick = (event) => {
    menuRef.current.toggle(event)
  }

  return (
    <div className="action-menu-component">
      <Button
        icon={icon}
        className={buttonClassName}
        onClick={handleClick}
      />
      <Menu model={items} popup ref={menuRef} onShow={onItemSelect} />
    </div>
  )
}

export default ActionMenuComponent
