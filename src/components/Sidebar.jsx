import React, { useState } from 'react'

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('inventory')

  const tabs = [
    { id: 'inventory', name: '库存管理', icon: '📦' },
    { id: 'billing', name: '结算管理', icon: '🔒' }
  ]

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="top-header">
        <div className="header-left">
          <img src="/logo.png" alt="brainnel" className="header-logo" />
          <span className="header-brand">brainnel</span>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">J</div>
            <div className="user-details">
              <span className="user-name">JASMIN</span>
              <span className="user-id">ID 675859</span>
            </div>
            <span className="dropdown-arrow">▼</span>
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
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-text">{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
