import React, { useState, useMemo } from 'react'
import SettlementStats from './SettlementStats'
import SettlementTable from './SettlementTable'

const SettlementPage = () => {
  // 查询条件
  const [filters, setFilters] = useState({
    billNumber: '',
    dateRange: '',
    billStatus: 'all',
  })

  // 模拟结算数据
  const data = useMemo(() => {
    const items = Array.from({ length: 25 }).map((_, i) => {
      const statuses = ['已确认', '处理中', '待审核']
      const amounts = [2903.39, 2748.63, 1640, 1585.8, 1875.29, 1550.65, 1882.88, 1756.84, 2004.14, 5392.73]
      
      const currentDate = new Date()
      const monthsBack = i
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsBack, 8)
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsBack + 1, 8)
      
      return {
        id: i + 1,
        exportDate: startDate.toISOString().split('T')[0].replace(/-/g, '-'),
        billNumber: `S${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}${String(Math.floor(Math.random() * 900000) + 100000)}${String(i + 1).padStart(4, '0')}`,
        businessSource: '站内带货',
        settlementPeriod: `${startDate.toISOString().split('T')[0]}至${endDate.toISOString().split('T')[0]}`,
        amount: amounts[i % amounts.length],
        status: statuses[i % statuses.length]
      }
    })
    return items
  }, [])

  const handleSearch = (next) => setFilters(next)

  return (
    <div className="settlement-page">
      <SettlementStats data={data} />
      <SettlementTable data={data} filters={filters} onSearch={handleSearch} />
    </div>
  )
}

export default SettlementPage