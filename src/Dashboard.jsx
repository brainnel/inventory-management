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
  const [pagination, setPagination] = useState({
    page: 1,
    size: 50,
    total: 0,
    totalPages: 0
  })
  
  // 查询条件
  const [filters, setFilters] = useState({
    sku: '',
    stockStatus: 'all',
    supplierNo: 'all',
  })

  // 判断是否显示供应商筛选（BR用户可以看到所有供应商）
  const showSupplierFilter = userInfo?.supplier_no === 'BR'

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
  const fetchProducts = async (searchFilters = {}, page = 1, pageSize = 50) => {
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

      // 确定查询的供应商编号
      let supplierNo = userInfo.supplier_no
      if (showSupplierFilter && searchFilters.supplierNo && searchFilters.supplierNo !== 'all') {
        supplierNo = searchFilters.supplierNo
      }

      const response = await productsAPI.getProductsList(supplierNo, page, pageSize, apiFilters)
      setData(response.items || [])
      setPagination({
        page: response.page || page,
        size: response.size || pageSize,
        total: response.total || 0,
        totalPages: response.total_pages || 0
      })
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
      fetchProducts(filters, 1, 50)
    }
  }, [userInfo])

  const handleSearch = (searchParams) => {
    setFilters(searchParams)
    // 搜索时重置到第一页
    fetchProducts(searchParams, 1, pagination.size)
  }

  // 处理分页变化
  const handlePageChange = (newPage) => {
    fetchProducts(filters, newPage, pagination.size)
  }

  // 处理每页数量变化
  const handlePageSizeChange = (newSize) => {
    fetchProducts(filters, 1, newSize)
  }
  const handleTabChange = (tabId) => setActiveTab(tabId)

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <>
            <StatsCards statistics={statistics} />
            <SearchForm onSearch={handleSearch} showSupplierFilter={showSupplierFilter} />
            {error && <div className="error" style={{color:'#ef4444', marginBottom: '8px'}}>{error}</div>}
            {loading ? (
              <div style={{ padding: '16px' }}>加载中...</div>
            ) : (
              <InventoryTable 
                data={data} 
                filters={filters}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )
      case 'billing':
        return <SettlementPage />
      default:
        return (
          <>
            <StatsCards statistics={statistics} />
            <SearchForm onSearch={handleSearch} showSupplierFilter={showSupplierFilter} />
            {error && <div className="error" style={{color:'#ef4444', marginBottom: '8px'}}>{error}</div>}
            {loading ? (
              <div style={{ padding: '16px' }}>加载中...</div>
            ) : (
              <InventoryTable 
                data={data} 
                filters={filters}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
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
