import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { loginAdmin, clearError } from '../redux/slices/authSlice'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Message } from 'primereact/message'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Divider } from 'primereact/divider'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [submitted, setSubmitted] = useState(false)
  const [focusedInput, setFocusedInput] = useState('')

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    
    if (!formData.email || !formData.password) {
      return
    }
    
    dispatch(loginAdmin(formData))
  }

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="floating-bubbles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`bubble bubble-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="login-card">
        {/* Logo Section */}
        <div className="login-header">
          <div className="logo-container">
            <img 
              src="/logo.webp" 
              alt="BFS Seafood" 
              className="bfs-logo"
            />
            <div className="logo-glow"></div>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Sign in to BFS Seafood Admin Portal
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Message 
            severity="error" 
            text={error} 
            className="w-full mb-4 error-message"
          />
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label htmlFor="email" className="field-label">
              Email Address
            </label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput('')}
              className={`w-full input-field ${focusedInput === 'email' ? 'input-focused' : ''}`}
              placeholder="admin@seafoodstore.com"
            />
            {submitted && !formData.email && (
              <small className="error-text">
                Email is required
              </small>
            )}
          </div>

          <div className="field">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput('')}
              className={`w-full ${focusedInput === 'password' ? 'input-focused' : ''}`}
              placeholder="Enter your password"
              feedback={false}
              toggleMask
            />
            {submitted && !formData.password && (
              <small className="error-text">
                Password is required
              </small>
            )}
          </div>

          <div className="remember-forgot-container">
            <div className="flex align-items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 remember-checkbox"
              />
              <label htmlFor="remember" className="remember-label">
                Remember me
              </label>
            </div>
            <Link 
              to="/forgot-password" 
              className="forgot-link"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            label={loading ? 'Signing In...' : 'Sign In'}
            loading={loading}
            className="w-full login-button"
            size="large"
            disabled={loading}
          >
            {!loading && <i className="pi pi-sign-in mr-2"></i>}
          </Button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <div className="footer-text">
            <span className="text-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary font-medium no-underline hover:text-primary-700 footer-link"
              >
                Contact Administrator
              </Link>
            </span>
          </div>
          <div className="footer-brand">
            <span className="brand-text">Powered by BFS Seafood</span>
          </div>
        </div>
      </div>

      {/* Side decoration */}
      <div className="login-decoration">
        <div className="decoration-pattern"></div>
      </div>
    </div>
  )
}

export default Login
