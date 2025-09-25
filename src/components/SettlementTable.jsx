import React, { useState, useMemo } from 'react'
import MonthPicker from './MonthPicker'

const SettlementTable = ({ data, filters, onSearch }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 过滤数据
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchBillNumber = !filters.billNumber || item.billNumber.includes(filters.billNumber)
      const matchStatus = filters.billStatus === 'all' || item.status === filters.billStatus
      
      return matchBillNumber && matchStatus
    })
  }, [data, filters])

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredData.slice(start, end)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setCurrentPage(1)
  }

  const handleJumpToPage = (e) => {
    if (e.key === 'Enter') {
      const page = Number(e.target.value)
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
      }
      e.target.value = ''
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case '已确认': return 'status-confirmed'
      case '处理中': return 'status-processing'
      case '待审核': return 'status-pending'
      default: return ''
    }
  }

  return (
    <div className="settlement-table-container">
      <h2 className="section-title">账单管理</h2>
      {/* 搜索过滤器 */}
      <div className="settlement-filters-section">
        <div className="filter-row">
          <div className="filter-item">
            <input
              type="text"
              placeholder="账单编号 请输入"
              className="filter-input"
              value={filters.billNumber}
              onChange={(e) => onSearch({ ...filters, billNumber: e.target.value })}
            />
          </div>
          <div className="filter-item">
            <MonthPicker
              value={filters.dateRange}
              onChange={(value) => onSearch({ ...filters, dateRange: value })}
              placeholder="选择结算周期"
            />
          </div>
          <div className="filter-item">
            <input
              type="text"
              placeholder="账单状态 全部"
              className="filter-input"
              value={filters.billStatus === 'all' ? '' : filters.billStatus}
              onChange={(e) => {
                const value = e.target.value.trim()
                const status = value === '' ? 'all' : value
                onSearch({ ...filters, billStatus: status })
              }}
            />
          </div>
        </div>
      </div>

      {/* 结算表格 */}
      <div className="settlement-table">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>出账日</th>
                <th>账单编号</th>
                <th>业务来源</th>
                <th>结算期间</th>
                <th>金额(元)</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(item => (
                <tr key={item.id}>
                  <td>{item.exportDate}</td>
                  <td className="bill-number">{item.billNumber}</td>
                  <td>{item.businessSource}</td>
                  <td>{item.settlementPeriod}</td>
                  <td className="amount">{formatCurrency(item.amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      ● {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn download-btn">
                      账单明细下载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页控件 */}
        <div className="pagination">
          <div className="pagination-info">
            <span>每页显示</span>
            <select value={pageSize} onChange={handlePageSizeChange} className="page-size-select">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>条</span>
          </div>

          <div className="pagination-controls">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              上一页
            </button>
            
            <span className="page-info">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              下一页
            </button>
          </div>

          <div className="jump-to-page">
            <span>跳转到</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              placeholder="页码"
              onKeyDown={handleJumpToPage}
              className="page-jump-input"
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettlementTable