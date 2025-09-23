import React, { useState } from 'react'

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('inventory')

  const tabs = [
    { id: 'inventory', name: '库存管理', icon: '📦' },
    { id: 'billing', name: '结算管理', icon: '💰' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="brainnel" className="sidebar-logo" />
        <h2 className="sidebar-title">商品管理系统</h2>
      </div>

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
  )
}

export default Sidebar