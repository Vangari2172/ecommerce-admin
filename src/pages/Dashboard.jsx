import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  fetchDashboardData, 
  fetchSalesAnalytics, 
  fetchTopProducts, 
  fetchRecentOrders,
  fetchCustomerAnalytics
} from '../redux/slices/dashboardSlice'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Chart } from 'primereact/chart'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Skeleton } from 'primereact/skeleton'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { 
    kpis, 
    kpiChanges, 
    topProducts, 
    recentOrders, 
    salesData, 
    customerData,
    loading, 
    error 
  } = useSelector((state) => state.dashboard)

  const [dateRange, setDateRange] = useState('last7days')
  const [chartType, setChartType] = useState('revenue')

  const dateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'Last 90 Days', value: 'last90days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'This Year', value: 'thisYear' },
  ]

  const chartTypes = [
    { label: 'Revenue', value: 'revenue' },
    { label: 'Orders', value: 'orders' },
    { label: 'Customers', value: 'customers' },
    { label: 'Products', value: 'products' },
  ]

  useEffect(() => {
    dispatch(fetchDashboardData())
    dispatch(fetchSalesAnalytics({ type: chartType, dateRange }))
    dispatch(fetchTopProducts())
    dispatch(fetchRecentOrders())
    dispatch(fetchCustomerAnalytics())
  }, [dispatch, chartType, dateRange])

  const getKPIIcon = (type) => {
    const icons = {
      revenue: 'pi pi-dollar',
      orders: 'pi pi-shopping-cart',
      users: 'pi pi-users',
      growth: 'pi pi-chart-line',
    }
    return icons[type] || 'pi pi-info-circle'
  }

  const getKPIChangeIcon = (change) => {
    if (change > 0) return 'pi pi-arrow-up'
    if (change < 0) return 'pi pi-arrow-down'
    return 'pi pi-minus'
  }

  const getKPIChangeClass = (change) => {
    if (change > 0) return 'positive'
    if (change < 0) return 'negative'
    return ''
  }

  const getSeverity = (status) => {
    const severities = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      pending: 'danger',
    }
    return severities[status] || 'info'
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const getChartData = () => {
    if (!salesData) return null
    
    const labels = salesData.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })

    const datasets = [
      {
        label: chartType.charAt(0).toUpperCase() + chartType.slice(1),
        data: salesData.map(item => item[chartType] || item.revenue || item.orders || item.customers || item.products),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ]

    return {
      labels,
      datasets,
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
            if (chartType === 'revenue') {
              return `Revenue: ${formatCurrency(value)}`
            }
            return `${chartType.charAt(0).toUpperCase() + chartType.slice(1)}: ${value.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6b7280',
          callback: (value) => {
            if (chartType === 'revenue') {
              return `$${(value / 1000).toFixed(0)}k`
            }
            return value.toLocaleString()
          },
        },
      },
    },
  }

  if (loading && !kpis) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="header-title">Dashboard</h1>
          <p className="header-description">Loading your dashboard data...</p>
        </div>
        
        <div className="kpi-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="kpi-card">
              <Skeleton height="20px" width="120px" className="mb-3" />
              <Skeleton height="40px" width="150px" className="mb-2" />
              <Skeleton height="16px" width="80px" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="header-title">Dashboard</h1>
          <p className="header-description">Error loading dashboard data</p>
        </div>
        
        <Card className="text-center py-8">
          <i className="pi pi-exclamation-triangle text-6xl text-orange-500 mb-3"></i>
          <h2 className="text-2xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-color-secondary mb-4">{error}</p>
          <Button 
            label="Retry" 
            icon="pi pi-refresh"
            onClick={() => window.location.reload()}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="dashboard-actions">
            <Button 
              icon="pi pi-download" 
              label="Export Report"
              className="p-button-outlined p-button-sm"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card-revenue">
          <div className="kpi-card-glow"></div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper">
              <i className="pi pi-dollar"></i>
            </div>
            <div className="kpi-details">
              <div className="kpi-label">Total Revenue</div>
              <div className="kpi-value">{formatCurrency(kpis?.totalRevenue || 0)}</div>
              <div className={`kpi-change ${getKPIChangeClass(kpiChanges?.revenueChange || 0)}`}>
                <i className={`pi ${getKPIChangeIcon(kpiChanges?.revenueChange || 0)}`}></i>
                <span>{Math.abs(kpiChanges?.revenueChange || 0)}% from last period</span>
              </div>
            </div>
          </div>
          <div className="kpi-chart-mini">
            <svg viewBox="0 0 100 30" className="mini-chart">
              <path d="M0,25 Q20,20 40,15 T80,10 T100,5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="kpi-card kpi-card-orders">
          <div className="kpi-card-glow"></div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper">
              <i className="pi pi-shopping-cart"></i>
            </div>
            <div className="kpi-details">
              <div className="kpi-label">Total Orders</div>
              <div className="kpi-value">{(kpis?.totalOrders || 0).toLocaleString()}</div>
              <div className={`kpi-change ${getKPIChangeClass(kpiChanges?.ordersChange || 0)}`}>
                <i className={`pi ${getKPIChangeIcon(kpiChanges?.ordersChange || 0)}`}></i>
                <span>{Math.abs(kpiChanges?.ordersChange || 0)}% from last period</span>
              </div>
            </div>
          </div>
          <div className="kpi-chart-mini">
            <svg viewBox="0 0 100 30" className="mini-chart">
              <path d="M0,20 Q25,25 50,15 T100,10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="kpi-card kpi-card-users">
          <div className="kpi-card-glow"></div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper">
              <i className="pi pi-users"></i>
            </div>
            <div className="kpi-details">
              <div className="kpi-label">Active Users</div>
              <div className="kpi-value">{(kpis?.activeUsers || 0).toLocaleString()}</div>
              <div className={`kpi-change ${getKPIChangeClass(kpiChanges?.usersChange || 0)}`}>
                <i className={`pi ${getKPIChangeIcon(kpiChanges?.usersChange || 0)}`}></i>
                <span>{Math.abs(kpiChanges?.usersChange || 0)}% from last period</span>
              </div>
            </div>
          </div>
          <div className="kpi-chart-mini">
            <svg viewBox="0 0 100 30" className="mini-chart">
              <path d="M0,25 Q30,10 60,20 T100,8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="kpi-card kpi-card-conversion">
          <div className="kpi-card-glow"></div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper">
              <i className="pi pi-chart-line"></i>
            </div>
            <div className="kpi-details">
              <div className="kpi-label">Conversion Rate</div>
              <div className="kpi-value">{(kpis?.conversionRate || 0).toFixed(1)}%</div>
              <div className={`kpi-change ${getKPIChangeClass(kpiChanges?.conversionChange || 0)}`}>
                <i className={`pi ${getKPIChangeIcon(kpiChanges?.conversionChange || 0)}`}></i>
                <span>{Math.abs(kpiChanges?.conversionChange || 0)}% from last period</span>
              </div>
            </div>
          </div>
          <div className="kpi-chart-mini">
            <svg viewBox="0 0 100 30" className="mini-chart">
              <path d="M0,20 Q40,5 70,15 T100,8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-grid">
        <div className="dashboard-col-8">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-header-title">
                <h3>Revenue Analytics</h3>
                <p>Track your revenue performance over time</p>
              </div>
              <div className="card-header-actions">
                <Dropdown
                  value={chartType}
                  options={chartTypes}
                  onChange={(e) => setChartType(e.value)}
                  className="p-inputtext-sm"
                />
                <Dropdown
                  value={dateRange}
                  options={dateRanges}
                  onChange={(e) => setDateRange(e.value)}
                  className="p-inputtext-sm"
                />
              </div>
            </div>
            <div className="chart-container">
              {loading ? (
                <Skeleton height="300px" />
              ) : (
                <Chart type="line" data={getChartData()} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-col-4">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-header-title">
                <h3>Quick Stats</h3>
                <p>Key performance indicators</p>
              </div>
            </div>
            <div className="quick-stats">
              <div className="quick-stat-item">
                <div className="quick-stat-icon avg-order">
                  <i className="pi pi-receipt"></i>
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-label">Avg Order Value</div>
                  <div className="quick-stat-value">{formatCurrency(kpis?.averageOrderValue || 0)}</div>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-icon products">
                  <i className="pi pi-box"></i>
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-label">Total Products</div>
                  <div className="quick-stat-value">{kpis?.totalProducts || 0}</div>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-icon pending">
                  <i className="pi pi-clock"></i>
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-label">Pending Orders</div>
                  <div className="quick-stat-value">{kpis?.pendingOrders || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="dashboard-section">
        <div className="dashboard-full-width">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-header-title">
                <h3>Top Products</h3>
                <p>Best selling products this period</p>
              </div>
              <Button icon="pi pi-ellipsis-h" className="p-button-text p-button-sm" />
            </div>
            <DataTable
              value={topProducts}
              rows={5}
              loading={loading}
              className="p-datatable-sm modern-table"
              paginator={false}
            >
              <Column 
                field="name" 
                header="Product" 
                body={(rowData) => (
                  <div className="product-cell">
                    <div className="product-avatar">
                      <i className="pi pi-box"></i>
                    </div>
                    <span className="product-name">{rowData.name}</span>
                  </div>
                )}
              />
              <Column 
                field="sold" 
                header="Sold" 
                body={(rowData) => (
                  <span className="table-badge sold">{rowData.sold.toLocaleString()}</span>
                )}
              />
              <Column 
                field="revenue" 
                header="Revenue" 
                body={(rowData) => (
                  <span className="table-value revenue">{formatCurrency(rowData.revenue)}</span>
                )}
              />
            </DataTable>
          </div>
        </div>

        <div className="dashboard-full-width">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-header-title">
                <h3>Recent Orders</h3>
                <p>Latest customer orders</p>
              </div>
              <Button icon="pi pi-ellipsis-h" className="p-button-text p-button-sm" />
            </div>
            <DataTable
              value={recentOrders}
              rows={5}
              loading={loading}
              className="p-datatable-sm modern-table"
              paginator={false}
            >
              <Column 
                field="orderNumber" 
                header="Order #"
                body={(rowData) => (
                  <span className="order-number">{rowData.orderNumber}</span>
                )}
              />
              <Column 
                field="createdAt" 
                header="Date" 
                body={(rowData) => (
                  <span className="table-date">{new Date(rowData.createdAt).toLocaleDateString()}</span>
                )}
              />
              <Column 
                field="total" 
                header="Total" 
                body={(rowData) => (
                  <span className="table-value">{formatCurrency(rowData.total)}</span>
                )}
              />
              <Column 
                field="status" 
                header="Status" 
                body={(rowData) => (
                  <Tag 
                    value={rowData.status} 
                    severity={getSeverity(rowData.status)}
                    className="status-tag"
                  />
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
