import React from 'react'

const Sidebar = ({ activeTab, onTabChange }) => {

  const tabs = [
    { 
      id: 'inventory', 
      name: '库存管理', 
      icon: '/库存icon.png',
      activeIcon: '/库存-选中.png'
    },
    { 
      id: 'billing', 
      name: '结算管理', 
      icon: '/结算icon.png',
      activeIcon: '/结算-选中.png'
    }
  ]

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="top-header">
        <div className="header-left">
          <img src="/logo.png" alt="brainnel" className="header-logo" />
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
