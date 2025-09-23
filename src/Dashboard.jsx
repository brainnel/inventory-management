import React, { useState, useMemo } from 'react'
import './Dashboard.css'
import Sidebar from './components/Sidebar'
import StatsCards from './components/StatsCards'
import SearchForm from './components/SearchForm'
import InventoryTable from './components/InventoryTable'

const Dashboard = () => {
  // 查询条件
  const [filters, setFilters] = useState({
    supplierId: '',
    platformId: '',
    stockStatus: 'all',
  })

  // 模拟数据（MVP）
  const data = useMemo(() => {
    const items = Array.from({ length: 57 }).map((_, i) => {
      const stock = 200 - (i * 3) % 210
      const safety = 50
      const status = stock > 100 ? '充足' : stock > safety ? '预警' : '不足'
      return {
        id: i + 1,
        sku: `SKU-${1000 + i}`,
        name: `示例商品 ${i + 1}`,
        image: '/示例图片.jpg', // 使用assets中的实例图片
        supplierId: `S${(i % 5) + 1}`,
        platformId: `P${(i % 3) + 1}`,
        totalSalesAmount: 100000 + i * 100,
        totalSalesQty: 2000 + i * 10,
        monthSalesQty: (i * 7) % 200,
        salesDays: 30 - (i % 30),
        stockInWarehouse: stock,
        stockInTransit: (i * 5) % 80,
        stockFrozen: (i * 2) % 30,
        costRmb: 10 + (i % 20),
        safetyStock: safety,
        status,
      }
    })
    return items
  }, [])

  const handleSearch = (next) => setFilters(next)

  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <StatsCards data={data} />

        <SearchForm onSearch={handleSearch} />

        <InventoryTable data={data} filters={filters} />
      </main>
    </div>
  )
}

export default Dashboard
