import React, { useState } from 'react'

const Sidebar = ({ activeTab, onTabChange, userInfo, onLogout }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  const handleLogout = () => {
    setIsUserDropdownOpen(false)
    if (onLogout) {
      onLogout()
    }
  }

  // 获取用户名第一个字符作为头像
  const getUserInitial = () => {
    if (!userInfo?.username) return 'U'
    return userInfo.username.charAt(0).toUpperCase()
  }

  const baseUrl = import.meta.env.BASE_URL
  const tabs = [
    { 
      id: 'inventory', 
      name: '库存管理', 
      icon: `${baseUrl}库存icon.png`,
      activeIcon: `${baseUrl}库存-选中.png`
    },
    { 
      id: 'billing', 
      name: '结算管理', 
      icon: `${baseUrl}结算icon.png`,
      activeIcon: `${baseUrl}结算-选中.png`
    }
  ]

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="top-header">
        <div className="header-left">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="brainnel" className="header-logo" />
        </div>
        
        <div className="header-right">
          <div className="user-info" style={{ position: 'relative' }}>
            <div 
              className="user-info-trigger"
              onClick={handleUserDropdownToggle}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <div className="user-avatar">{getUserInitial()}</div>
              <div className="user-details">
                <span className="user-name">{userInfo?.supplier_no || '供应商'}</span>
              </div>
              <span className={`dropdown-arrow ${isUserDropdownOpen ? 'open' : ''}`}>▼</span>
            </div>
            
            {isUserDropdownOpen && (
              <div className="user-dropdown" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '150px',
                zIndex: 1000,
                marginTop: '8px'
              }}>
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 左侧导航 */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <img 
                src={activeTab === tab.id ? tab.activeIcon : tab.icon} 
                alt={tab.name}
                className="nav-icon"
              />
              <span className="nav-text">{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
