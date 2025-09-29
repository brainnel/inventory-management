import React, { useState, useEffect, useMemo } from 'react'
import './Dashboard.css'
import Sidebar from './components/Sidebar'
import StatsCards from './components/StatsCards'
import SearchForm from './components/SearchForm'
import InventoryTable from './components/InventoryTable'
import SettlementPage from './components/SettlementPage'
import { productsAPI } from './services/api'

const Dashboard = ({ userInfo, onLogout }) => {
  const [activeTab, setActiveTab] = useState('inventory')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // 查询条件
  const [filters, setFilters] = useState({
    sku: '',
    stockStatus: 'all',
  })

  // 获取商品数据
  const fetchProducts = async () => {
    if (!userInfo?.supplier_no) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await productsAPI.getProductsList(userInfo.supplier_no, 1, 100)
      setData(response.items || [])
    } catch (error) {
      console.error('获取商品数据失败:', error)
      setError('获取商品数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 组件加载时获取数据
  useEffect(() => {
    fetchProducts()
  }, [userInfo])

  const handleSearch = (next) => setFilters(next)
  const handleTabChange = (tabId) => setActiveTab(tabId)

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <>
            <StatsCards data={data} />
            <SearchForm onSearch={handleSearch} />
            {error && <div className="error" style={{color:'#ef4444', marginBottom: '8px'}}>{error}</div>}
            {loading ? (
              <div style={{ padding: '16px' }}>加载中...</div>
            ) : (
              <InventoryTable data={data} filters={filters} />
            )}
          </>
        )
      case 'billing':
        return <SettlementPage />
      default:
        return (
          <>
            <StatsCards data={data} />
            <SearchForm onSearch={handleSearch} />
            {error && <div className="error" style={{color:'#ef4444', marginBottom: '8px'}}>{error}</div>}
            {loading ? (
              <div style={{ padding: '16px' }}>加载中...</div>
            ) : (
              <InventoryTable data={data} filters={filters} />
            )}
          </>
        )
    }
  }

  return (
    <div className="layout">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        userInfo={userInfo}
        onLogout={onLogout}
      />

      <main className="content">
        {renderContent()}
      </main>
    </div>
  )
}

export default Dashboard
