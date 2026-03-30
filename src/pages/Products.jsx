import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

// Import reusable UI components
import {
  PageHeaderComponent,
  FilterSectionComponent,
  DataTableComponent,
  StatusBadgeComponent,
  StockBadgeComponent,
  ActionMenuComponent
} from '../components/ui'

const Products = () => {
  const navigate = useNavigate()
  const toast = useRef(null)
  const [loading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])

  const [products] = useState([
    { id: 1, name: 'Atlantic Salmon Fillet', sku: 'SEA-001', category: 'Fish', price: 24.99, stock: 45, status: 'active', sales: 234, rating: 4.8 },
    { id: 2, name: 'Bluefin Tuna Steak', sku: 'SEA-002', category: 'Fish', price: 45.99, stock: 12, status: 'active', sales: 156, rating: 4.9 },
    { id: 3, name: 'Tiger Prawns', sku: 'SEA-003', category: 'Shellfish', price: 18.99, stock: 89, status: 'active', sales: 189, rating: 4.7 },
    { id: 4, name: 'Lobster Tail', sku: 'SEA-004', category: 'Shellfish', price: 89.99, stock: 8, status: 'low_stock', sales: 98, rating: 4.9 },
    { id: 5, name: 'Sea Bass', sku: 'SEA-005', category: 'Fish', price: 22.99, stock: 0, status: 'out_of_stock', sales: 145, rating: 4.6 },
    { id: 6, name: 'King Crab Legs', sku: 'SEA-006', category: 'Shellfish', price: 65.99, stock: 23, status: 'active', sales: 76, rating: 4.8 },
    { id: 7, name: 'Fresh Oysters', sku: 'SEA-007', category: 'Shellfish', price: 14.99, stock: 156, status: 'active', sales: 234, rating: 4.5 },
    { id: 8, name: 'Swordfish Steak', sku: 'SEA-008', category: 'Fish', price: 32.99, stock: 34, status: 'active', sales: 112, rating: 4.7 }
  ])

  const categories = [
    { label: 'All Categories', value: null },
    { label: 'Fish', value: 'Fish' },
    { label: 'Shellfish', value: 'Shellfish' },
    { label: 'Crustaceans', value: 'Crustaceans' }
  ]

  const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Low Stock', value: 'low_stock' },
    { label: 'Out of Stock', value: 'out_of_stock' }
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const getStatusSeverity = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'low_stock': return 'warning'
      case 'out_of_stock': return 'danger'
      default: return 'info'
    }
  }

  const getStockSeverity = (stock) => {
    if (stock === 0) return 'danger'
    if (stock <= 10) return 'warning'
    return 'success'
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    const matchesStatus = selectedStatus ? product.status === selectedStatus : true
    return matchesSearch && matchesCategory && matchesStatus
  })

  const confirmDelete = (product) => {
    confirmDialog({
      message: `Delete ${product.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Product deleted' })
    })
  }

  const handleActionSelect = (rowData) => {
    setSelectedProducts([rowData])
  }

  // Table columns definition
  const tableColumns = [
    { selectionMode: 'multiple', headerStyle: { width: '3rem' } },
    {
      field: 'name',
      header: 'Product',
      sortable: true,
      style: { minWidth: '250px' },
      body: (rowData) => (
        <div className="product-list-info">
          <div className="product-list-name">{rowData.name}</div>
          <div className="product-list-sku">SKU: {rowData.sku}</div>
        </div>
      )
    },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      style: { width: '120px' },
      body: (rowData) => <span className="product-list-price">{formatCurrency(rowData.price)}</span>
    },
    { field: 'category', header: 'Category', sortable: true, style: { width: '120px' } },
    {
      field: 'stock',
      header: 'Stock',
      sortable: true,
      style: { width: '150px' },
      body: (rowData) => <StockBadgeComponent stock={rowData.stock} />
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      style: { width: '120px' },
      body: (rowData) => <StatusBadgeComponent status={rowData.status} type="status" />
    },
    {
      field: 'sales',
      header: 'Sales',
      sortable: true,
      style: { width: '120px' },
      body: (rowData) => (
        <div className="product-list-sales">
          <span className="sales-count">{rowData.sales.toLocaleString()}</span>
          <span className="sales-rating"><i className="pi pi-star-fill text-yellow-500"></i> {rowData.rating}</span>
        </div>
      )
    },
    {
      headerStyle: { width: '60px' },
      body: (rowData) => (
        <ActionMenuComponent
          items={[
            { label: 'View Details', icon: 'pi pi-eye', command: () => navigate(`/products/${rowData.id}`) },
            { label: 'Edit', icon: 'pi pi-pencil', command: () => navigate(`/products/edit/${rowData.id}`) },
            { separator: true },
            { label: 'Delete', icon: 'pi pi-trash', className: 'text-red-500', command: () => confirmDelete(rowData) }
          ]}
          onItemSelect={() => handleActionSelect(rowData)}
        />
      )
    }
  ]

  // Header actions
  const headerActions = [
    { label: 'Export', icon: 'pi pi-download', className: 'p-button-outlined p-button-sm' },
    { label: 'Add Product', icon: 'pi pi-plus', className: 'p-button-primary p-button-sm', onClick: () => navigate('/products/add') }
  ]

  // Filter configuration
  const filters = [
    {
      value: selectedCategory,
      options: categories,
      onChange: (e) => setSelectedCategory(e.value),
      placeholder: 'Category'
    },
    {
      value: selectedStatus,
      options: statusOptions,
      onChange: (e) => setSelectedStatus(e.value),
      placeholder: 'Status'
    }
  ]

  // Stats configuration
  const stats = [
    { value: products.length, label: 'Total' },
    { value: products.filter(p => p.status === 'active').length, label: 'Active' },
    { value: products.filter(p => p.stock <= 10).length, label: 'Low Stock', className: 'text-red-500' }
  ]

  return (
    <div className="products-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <PageHeaderComponent
        title="Products"
        subtitle="Manage your seafood product inventory"
        actions={headerActions}
      />

      <div className="products-content">
        <Card className="products-card">
          <FilterSectionComponent
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search products..."
            filters={filters}
            showStats={true}
            stats={stats}
          />

          <DataTableComponent
            data={filteredProducts}
            columns={tableColumns}
            loading={loading}
            selectionMode="multiple"
            selectedItems={selectedProducts}
            onSelectionChange={setSelectedProducts}
            dataKey="id"
            emptyMessage="No products found"
          />
        </Card>
      </div>
    </div>
  )
}

export default Products
