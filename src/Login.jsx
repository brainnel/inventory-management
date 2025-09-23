import React, { useState } from 'react'
import './Login.css'

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    account: '',
    password: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 假登录验证
    if (formData.account === 'admin' && formData.password === '123456') {
      console.log('登录成功:', formData)
      // 调用登录成功回调
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } else {
      alert('登录失败！请输入正确的账号密码\n账号：admin\n密码：123456')
      console.log('登录失败:', formData)
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
            
            <h2 className="login-title">登录到商品管理系统</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="account">账号</label>
                <input
                  type="text"
                  id="account"
                  name="account"
                  placeholder="admin"
                  value={formData.account}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="password">密码</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="123456"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              
              <button type="submit" className="login-button">
                登录
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login