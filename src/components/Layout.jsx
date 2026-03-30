import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { Badge } from 'primereact/badge'
import ProtectedRoute from './ProtectedRoute'

const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  const userMenu = useRef(null)
  const [subMenuOpen, setSubMenuOpen] = useState(false)
  const [subMenuName, setSubMenuName] = useState('')
  const [activeMainMenu, setActiveMainMenu] = useState('')

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      key: 'dashboard',
      command: () => {
        navigate('/')
        closeSubMenu()
      },
      active: location.pathname === '/',
      hasSubmenu: false,
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      key: 'products',
      command: () => toggleSubMenu('products'),
      active: location.pathname.startsWith('/products'),
      hasSubmenu: true,
      submenu: [
        { label: 'All Products', icon: 'pi pi-list', path: '/products', command: () => navigate('/products') },
        { label: 'Add Product', icon: 'pi pi-plus', path: '/products/add', command: () => navigate('/products/add') },
        { label: 'Categories', icon: 'pi pi-sitemap', path: '/products/categories', command: () => navigate('/products/categories') },
        { label: 'Inventory', icon: 'pi pi-database', path: '/products/inventory', command: () => navigate('/products/inventory') },
      ],
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-cart',
      key: 'orders',
      command: () => toggleSubMenu('orders'),
      active: location.pathname.startsWith('/orders'),
      hasSubmenu: true,
      submenu: [
        { label: 'All Orders', icon: 'pi pi-list', path: '/orders', command: () => navigate('/orders') },
        { label: 'Pending', icon: 'pi pi-clock', path: '/orders/pending', command: () => navigate('/orders/pending') },
        { label: 'Processing', icon: 'pi pi-cog', path: '/orders/processing', command: () => navigate('/orders/processing') },
        { label: 'Shipped', icon: 'pi pi-truck', path: '/orders/shipped', command: () => navigate('/orders/shipped') },
        { label: 'Delivered', icon: 'pi pi-check', path: '/orders/delivered', command: () => navigate('/orders/delivered') },
      ],
    },
    {
      label: 'Customers',
      icon: 'pi pi-users',
      key: 'customers',
      command: () => toggleSubMenu('customers'),
      active: location.pathname.startsWith('/customers'),
      hasSubmenu: true,
      submenu: [
        { label: 'All Customers', icon: 'pi pi-list', path: '/customers', command: () => navigate('/customers') },
        { label: 'Add Customer', icon: 'pi pi-plus', path: '/customers/add', command: () => navigate('/customers/add') },
        { label: 'Customer Groups', icon: 'pi pi-users', path: '/customers/groups', command: () => navigate('/customers/groups') },
      ],
    },
    {
      label: 'Marketing',
      icon: 'pi pi-bullseye',
      key: 'marketing',
      command: () => toggleSubMenu('marketing'),
      active: location.pathname.startsWith('/marketing'),
      hasSubmenu: true,
      submenu: [
        { label: 'Coupons', icon: 'pi pi-ticket', path: '/marketing/coupons', command: () => navigate('/marketing/coupons') },
        { label: 'Campaigns', icon: 'pi pi-flag', path: '/marketing/campaigns', command: () => navigate('/marketing/campaigns') },
        { label: 'Analytics', icon: 'pi pi-chart-bar', path: '/marketing/analytics', command: () => navigate('/marketing/analytics') },
      ],
    },
    {
      label: 'Content',
      icon: 'pi pi-image',
      key: 'content',
      command: () => toggleSubMenu('content'),
      active: location.pathname.startsWith('/content'),
      hasSubmenu: true,
      submenu: [
        { label: 'Media Library', icon: 'pi pi-images', path: '/content/media', command: () => navigate('/content/media') },
        { label: 'Banners', icon: 'pi pi-image', path: '/content/banners', command: () => navigate('/content/banners') },
        { label: 'Pages', icon: 'pi pi-file', path: '/content/pages', command: () => navigate('/content/pages') },
      ],
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      key: 'settings',
      command: () => toggleSubMenu('settings'),
      active: location.pathname.startsWith('/settings'),
      hasSubmenu: true,
      submenu: [
        { label: 'General', icon: 'pi pi-cog', path: '/settings/general', command: () => navigate('/settings/general') },
        { label: 'Payment', icon: 'pi pi-credit-card', path: '/settings/payment', command: () => navigate('/settings/payment') },
        { label: 'Shipping', icon: 'pi pi-truck', path: '/settings/shipping', command: () => navigate('/settings/shipping') },
        { label: 'Email', icon: 'pi pi-envelope', path: '/settings/email', command: () => navigate('/settings/email') },
        { label: 'Users', icon: 'pi pi-user', path: '/settings/users', command: () => navigate('/settings/users') },
      ],
    },
  ]

  const userMenuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => navigate('/profile'),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => navigate('/settings'),
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        dispatch(logout())
        navigate('/login')
      },
    },
  ]

  const toggleSubMenu = (menuKey) => {
    const menuItem = menuItems.find(item => item.key === menuKey)
    
    if (activeMainMenu === menuKey && subMenuOpen) {
      closeSubMenu()
    } else {
      setSubMenuOpen(true)
      setSubMenuName(menuItem.label)
      setActiveMainMenu(menuKey)
    }
  }

  const closeSubMenu = () => {
    setSubMenuOpen(false)
    setSubMenuName('')
    setActiveMainMenu('')
  }

  const getPageTitle = () => {
    const currentMenuItem = menuItems.find(item => item.active)
    return currentMenuItem ? currentMenuItem.label : 'Dashboard'
  }

  const getCurrentSubMenu = () => {
    const menuItem = menuItems.find(item => item.key === activeMainMenu)
    return menuItem ? menuItem.submenu : []
  }

  useEffect(() => {
    // Close submenu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.sidebar') && !event.target.closest('.sub-sidebar')) {
        closeSubMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="admin-layout">
      {/* Modern Sidebar - Always Collapsed */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img 
              src="/logo.webp" 
              alt="BFS" 
              className="sidebar-logo-img"
            />
            <div className="sidebar-logo-glow"></div>
          </div>
        </div>
        
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`menu-item ${item.active ? 'active' : ''} ${activeMainMenu === item.key ? 'submenu-open' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                item.command()
              }}
            >
              <i className={item.icon}></i>
              <span className="menu-text">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Sub Sidebar - Opens on click */}
      {subMenuOpen && (
        <aside className="sub-sidebar show">
          <div className="sub-menu-title">{subMenuName}</div>
          <nav className="sub-menu-list">
            {getCurrentSubMenu().map((subItem, index) => (
              <div key={index} className="sub-menu-item">
                <a
                  href="#"
                  className={`sub-menu-link ${subItem.path && location.pathname === subItem.path ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    subItem.command()
                  }}
                >
                  <i className={`${subItem.icon} mr-2`}></i>
                  {subItem.label}
                </a>
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="main-content">
        {/* Modern Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>

          <div className="topbar-right">
            {/* Notifications */}
            <Button
              icon="pi pi-bell"
              className="p-button-text p-button-plain topbar-button"
              onClick={() => navigate('/notifications')}
            >
              <Badge value="3" severity="danger" />
            </Button>

            {/* User Menu */}
            <Menu model={userMenuItems} popup ref={userMenu} />
            <div 
              className="user-menu"
              onClick={(e) => userMenu.current?.toggle(e)}
            >
              <Avatar 
                label={user?.name?.charAt(0) || 'A'} 
                size="large" 
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">{user?.name || 'Admin User'}</div>
                <div className="user-role">{user?.role || 'Administrator'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      </main>
    </div>
  )
}

export default Layout
