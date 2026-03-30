import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <Card className="text-center border-round-2xl shadow-2" style={{ maxWidth: '400px' }}>
        <div className="text-6xl text-primary mb-3">
          <i className="pi pi-exclamation-triangle"></i>
        </div>
        <h1 className="text-3xl font-bold text-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-900 mb-3">Page Not Found</h2>
        <p className="text-600 mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          label="Go Home" 
          icon="pi pi-home"
          onClick={() => navigate('/')}
          className="p-button-primary"
        />
      </Card>
    </div>
  )
}

export default NotFound
