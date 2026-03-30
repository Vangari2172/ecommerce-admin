import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectAuthLoading, selectUser, refreshAdminToken } from '../redux/slices/authSlice'
import { ProgressSpinner } from 'primereact/progressspinner'

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const user = useSelector(selectUser)
  const permissions = useSelector((state) => state.auth.permissions)

  useEffect(() => {
    // Check if token exists and try to refresh if needed
    const token = localStorage.getItem('adminToken')
    if (token && !isAuthenticated && !loading) {
      dispatch(refreshAdminToken())
    } else if (token && isAuthenticated && !user) {
      // If authenticated but no user data, fetch current user
      dispatch(refreshAdminToken())
    }
  }, [dispatch, isAuthenticated, loading, user])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <ProgressSpinner />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check for required permissions
  if (requiredPermission && !permissions.includes(requiredPermission) && !permissions.includes('admin')) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <i className="pi pi-lock text-6xl text-red-500 mb-3"></i>
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-color-secondary mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="p-button p-component"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
