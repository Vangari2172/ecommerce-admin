import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'

const DataTableComponent = ({
  data,
  columns,
  loading = false,
  selectionMode = null,
  selectedItems = null,
  onSelectionChange = null,
  dataKey = 'id',
  rows = 10,
  rowsPerPageOptions = [10, 20, 50],
  paginator = true,
  sortable = true,
  emptyMessage = 'No data found',
  className = '',
  actionMenu = null,
  actionMenuRef = null,
  onActionClick = null,
  stripedRows = false,
  hoverEffect = true,
}) => {
  const renderColumn = (col) => {
    const columnProps = {
      key: col.field || col.id,
      field: col.field,
      header: col.header,
      sortable: col.sortable !== false && sortable,
      style: col.style || {},
      headerStyle: col.headerStyle || {},
      bodyStyle: col.bodyStyle || {},
    }

    if (col.body) {
      columnProps.body = col.body
    }

    if (col.width) {
      columnProps.headerStyle = { ...columnProps.headerStyle, width: col.width }
    }

    return <Column {...columnProps} />
  }

  return (
    <div className={`data-table-component ${className}`}>
      <DataTable
        value={data}
        paginator={paginator}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        selectionMode={selectionMode}
        selection={selectedItems}
        onSelectionChange={onSelectionChange}
        dataKey={dataKey}
        loading={loading}
        emptyMessage={emptyMessage}
        className="p-datatable-sm custom-datatable"
        stripedRows={stripedRows}
        rowHover={hoverEffect}
        responsiveLayout="scroll"
      >
        {columns.map(renderColumn)}
      </DataTable>
      
      {actionMenu && actionMenuRef && (
        <Menu model={actionMenu} popup ref={actionMenuRef} />
      )}
    </div>
  )
}

export default DataTableComponent
