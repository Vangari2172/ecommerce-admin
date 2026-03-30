import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Categories from './pages/Categories.jsx'
import Orders from './pages/Orders.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import Users from './pages/Users.jsx'
import UserDetail from './pages/UserDetail.jsx'
import MediaLibrary from './pages/MediaLibrary.jsx'
import Coupons from './pages/Coupons.jsx'
import Delivery from './pages/Delivery.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        
        {/* Product Routes */}
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/:id/edit" element={<AddProduct />} />
        
        {/* Category Routes */}
        <Route path="categories" element={<Categories />} />
        
        {/* Order Routes */}
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        
        {/* User Routes */}
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        
        {/* Media Routes */}
        <Route path="media" element={<MediaLibrary />} />
        
        {/* Coupon Routes */}
        <Route path="coupons" element={<Coupons />} />
        
        {/* Delivery Routes */}
        <Route path="delivery" element={<Delivery />} />
        
        {/* Settings Routes */}
        <Route path="settings" element={<Settings />} />
        
        {/* Profile Routes */}
        <Route path="profile" element={<Profile />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
