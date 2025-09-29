import React, { useState, useEffect } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import { authUtils } from './services/api'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  // 检查是否已登录
  useEffect(() => {
    const auth = authUtils.getAuth()
    if (auth.token && auth.userInfo) {
      setIsLoggedIn(true)
      setUserInfo(auth.userInfo)
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true)
    setUserInfo(user)
  }

  const handleLogout = () => {
    authUtils.clearAuth()
    setIsLoggedIn(false)
    setUserInfo(null)
  }

  // 加载中显示
  if (loading) {
    return (
      <div className="app" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        <Dashboard userInfo={userInfo} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

export default App
