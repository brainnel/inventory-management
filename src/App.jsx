import React, { useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

export default App
