import React from 'react';

// Simple test component to verify React is working
function TestApp() {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          PathOptix Navigation
        </h1>
        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
            🔧 Configuration Status
          </h2>
          <p style={{ color: '#92400e', fontSize: '14px', margin: '8px 0' }}>
            Google Maps API Key: {googleMapsApiKey ? '✅ Found' : '❌ Missing'}
          </p>
          <p style={{ color: '#92400e', fontSize: '14px', margin: '8px 0' }}>
            Environment: {import.meta.env.VITE_ENVIRONMENT || 'development'}
          </p>
          <p style={{ color: '#92400e', fontSize: '14px', margin: '8px 0' }}>
            Backend URL: {import.meta.env.VITE_API_BASE_URL || 'Not configured'}
          </p>
        </div>
        
        {!googleMapsApiKey ? (
          <div style={{ color: '#dc2626', fontSize: '14px' }}>
            <p style={{ marginBottom: '12px' }}>
              To enable full functionality, set the following environment variables:
            </p>
            <div style={{ 
              backgroundColor: '#f9fafb', 
              padding: '12px', 
              borderRadius: '6px',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              VITE_GOOGLE_MAPS_API_KEY=your_api_key<br/>
              VITE_API_BASE_URL=https://pathoptix-backend-8080.zeabur.app
            </div>
          </div>
        ) : (
          <div style={{ color: '#059669', fontSize: '14px' }}>
            ✅ Configuration complete! PathOptix is ready to use.
          </div>
        )}
        
        <div style={{ 
          marginTop: '24px', 
          paddingTop: '16px', 
          borderTop: '1px solid #e5e7eb',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <p>🌐 URL: {window.location.href}</p>
          <p>📍 Deployment: Vercel + Zeabur</p>
          <p>⚛️ React App Status: Running</p>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
