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
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // 查询条件
  const [filters, setFilters] = useState({
    sku: '',
    stockStatus: 'all',
  })

  // 获取商品统计数据
  const fetchStatistics = async () => {
    if (!userInfo?.supplier_no) return
    
    try {
      const response = await productsAPI.getProductStatistics(userInfo.supplier_no)
      setStatistics(response)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  // 获取商品数据
  const fetchProducts = async (searchFilters = {}) => {
    if (!userInfo?.supplier_no) return
    
    setLoading(true)
    setError('')
    
    try {
      // 构建 API 过滤参数
      const apiFilters = {}
      if (searchFilters.sku && searchFilters.sku.trim()) {
        apiFilters.internal_no = searchFilters.sku.trim()
      }
      if (searchFilters.stockStatus && searchFilters.stockStatus !== 'all') {
        // 将前端的状态映射为API期望的数字
        const statusMap = {
          '充足': 1,
          '预警': 2,
          '不足': 3
        }
        apiFilters.stock_status = statusMap[searchFilters.stockStatus]
      }
      
      const response = await productsAPI.getProductsList(userInfo.supplier_no, 1, 100, apiFilters)
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
    if (userInfo?.supplier_no) {
      fetchStatistics()
      fetchProducts()
    }
  }, [userInfo])

  const handleSearch = (searchParams) => {
    setFilters(searchParams)
    fetchProducts(searchParams)
  }
  const handleTabChange = (tabId) => setActiveTab(tabId)

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <>
            <StatsCards statistics={statistics} />
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
            <StatsCards statistics={statistics} />
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
