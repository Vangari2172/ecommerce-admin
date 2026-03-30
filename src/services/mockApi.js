// Mock API service for testing without backend
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@seafoodstore.com',
    role: 'admin',
    permissions: ['admin'],
  }
]

const mockDashboardData = {
  kpis: {
    totalRevenue: 125430,
    totalOrders: 1247,
    activeUsers: 8934,
    conversionRate: 3.2,
    averageOrderValue: 100.5,
    totalProducts: 156,
    pendingOrders: 23,
    lowStockProducts: 8,
  },
  kpiChanges: {
    revenueChange: 12.5,
    ordersChange: 8.3,
    usersChange: 15.7,
    conversionChange: -2.1,
  },
  topProducts: [
    { id: 1, name: 'Atlantic Salmon Fillet', sold: 234, revenue: 45678 },
    { id: 2, name: 'Bluefin Tuna Steak', sold: 156, revenue: 38901 },
    { id: 3, name: 'Tiger Prawns', sold: 189, revenue: 23456 },
    { id: 4, name: 'Lobster Tail', sold: 98, revenue: 19876 },
    { id: 5, name: 'Sea Bass', sold: 145, revenue: 16789 },
  ],
  recentOrders: [
    { id: 1, orderNumber: 'ORD-001', createdAt: '2024-01-15', total: 125.99, status: 'delivered' },
    { id: 2, orderNumber: 'ORD-002', createdAt: '2024-01-15', total: 89.50, status: 'shipped' },
    { id: 3, orderNumber: 'ORD-003', createdAt: '2024-01-14', total: 234.75, status: 'processing' },
    { id: 4, orderNumber: 'ORD-004', createdAt: '2024-01-14', total: 67.25, status: 'pending' },
    { id: 5, orderNumber: 'ORD-005', createdAt: '2024-01-13', total: 156.00, status: 'delivered' },
  ],
}

const generateSalesData = (type) => {
  const data = []
  const days = type === 'revenue' || type === 'orders' ? 30 : 12
  
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    
    if (type === 'revenue') {
      data.push({
        date: date.toISOString(),
        revenue: Math.floor(Math.random() * 5000) + 2000,
      })
    } else if (type === 'orders') {
      data.push({
        date: date.toISOString(),
        orders: Math.floor(Math.random() * 50) + 20,
      })
    } else if (type === 'customers') {
      data.push({
        label: `Day ${i + 1}`,
        customers: Math.floor(Math.random() * 100) + 50,
      })
    } else if (type === 'products') {
      data.push({
        label: `Day ${i + 1}`,
        products: Math.floor(Math.random() * 200) + 100,
      })
    }
  }
  
  return data
}

export const mockApi = {
  // Auth endpoints
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    if (credentials.email === 'admin@seafoodstore.com' && credentials.password === 'admin123') {
      return {
        data: {
          user: mockUsers[0],
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          permissions: ['admin'],
        }
      }
    }
    
    throw {
      response: {
        data: { message: 'Invalid credentials' }
      }
    }
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { data: {} }
  },

  refreshToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      }
    }
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    // Always return the admin user for demo
    return { data: { user: mockUsers[0] } }
  },

  // Dashboard endpoints
  getDashboardData: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { data: mockDashboardData }
  },

  getSalesAnalytics: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const data = generateSalesData(params.type || 'revenue')
    return { data }
  },

  getTopProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return { data: { products: mockDashboardData.topProducts } }
  },

  getRecentOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return { data: { orders: mockDashboardData.recentOrders } }
  },

  getCustomerAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: {
        newCustomers: generateSalesData('customers'),
        returningCustomers: generateSalesData('customers'),
        customerSegments: [
          { segment: 'New', count: 234, percentage: 25 },
          { segment: 'Returning', count: 456, percentage: 50 },
          { segment: 'VIP', count: 234, percentage: 25 },
        ],
      }
    }
  },
}

export default mockApi
