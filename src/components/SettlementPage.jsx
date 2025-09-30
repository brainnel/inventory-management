import React, { useState, useEffect } from 'react'
import SettlementStats from './SettlementStats'
import SettlementTable from './SettlementTable'
import { settlementAPI } from '../services/api'

const SettlementPage = () => {
  // 查询条件
  const [filters, setFilters] = useState({
    billNumber: '',
    dateRange: '',
    billStatus: 'all',
  })

  // 数据状态
  const [billsData, setBillsData] = useState([])
  const [summaryData, setSummaryData] = useState(null)
  const [amountSummaryData, setAmountSummaryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 获取账单数据
  const fetchBillsData = async (status = 'all') => {
    try {
      setLoading(true)
      setError(null)
      const [billsResponse, summaryResponse, amountSummaryResponse] = await Promise.all([
        settlementAPI.getSettlementBills(status),
        settlementAPI.getSettlementBillsSummary(),
        settlementAPI.getSettlementBillsAmountSummary()
      ])
      // 确保 billsData 始终是数组
      const bills = Array.isArray(billsResponse?.items) ? billsResponse.items : 
                   Array.isArray(billsResponse) ? billsResponse : []
      setBillsData(bills)
      setSummaryData(summaryResponse)
      setAmountSummaryData(amountSummaryResponse)
    } catch (err) {
      console.error('Failed to fetch settlement bills:', err)
      console.error('Error details:', {
        billsResponse: err.billsResponse,
        summaryResponse: err.summaryResponse,
        amountSummaryResponse: err.amountSummaryResponse
      })
      setError(`获取账单数据失败: ${err.message || err.toString()}`)
      // 即使出现错误，也要确保 billsData 是一个空数组
      setBillsData([])
    } finally {
      setLoading(false)
    }
  }

  // 初始化数据
  useEffect(() => {
    fetchBillsData()
  }, [])

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters)
    // 如果状态发生变化，重新获取数据
    if (nextFilters.billStatus !== filters.billStatus) {
      fetchBillsData(nextFilters.billStatus)
    }
  }

  if (loading && billsData.length === 0) {
    return (
      <div className="settlement-page">
        <div className="loading">正在加载账单数据...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="settlement-page">
        <div className="error">
          {error}
          <button onClick={() => fetchBillsData()} className="retry-btn">
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="settlement-page">
      <SettlementStats 
        summaryData={summaryData} 
        amountSummaryData={amountSummaryData}
        billsData={billsData}
        onDataRefresh={() => fetchBillsData(filters.billStatus)}
      />
      <SettlementTable 
        data={billsData} 
        filters={filters} 
        onSearch={handleSearch}
        loading={loading}
      />
    </div>
  )
}

export default SettlementPage