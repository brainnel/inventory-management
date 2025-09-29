import React, { useState } from 'react'
import './Login.css'
import { authAPI, authUtils } from './services/api'

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await authAPI.login(formData.username, formData.password)
      
      // 保存认证信息
      authUtils.saveAuth(response.token, response.user)
      
      console.log('登录成功:', response)
      
      // 调用登录成功回调
      if (onLoginSuccess) {
        onLoginSuccess(response.user)
      }
    } catch (error) {
      console.error('登录失败:', error)
      const errorMessage = error.response?.data?.detail || '登录失败，请检查用户名和密码'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <img src="/banner.png" alt="办公插画" className="banner-image" />
        </div>
        
        <div className="login-right">
          <div className="login-form">
            <div className="brand-section">
              <img src="/logo.png" alt="brainnel logo" className="brand-logo" />
            </div>
            
            <h2 className="login-title">登录到仓库管理系统</h2>
            
            {error && (
              <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '14px' }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">用户名</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="password">密码</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login