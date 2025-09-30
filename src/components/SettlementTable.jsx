import React, { useState, useMemo } from 'react'
import MonthPicker from './MonthPicker'
import StatusSelect from './StatusSelect'
import BillDetailModal from './BillDetailModal'

const SettlementTable = ({ data, filters, onSearch, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedBill, setSelectedBill] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 过滤数据（确保 data 是数组）
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return []
    }
    return data.filter(item => {
      const matchBillNumber = !filters.billNumber || 
        (item.bill_number && item.bill_number.includes(filters.billNumber))
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

  // 状态映射和样式
  const getStatusText = (status) => {
    switch (status) {
      case 'pending_withdrawal': return '待提现'
      case 'payment': return '打款中'
      case 'done': return '已打款'
      case 'pending_review': return '待审核'
      default: return status || '未知状态'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'done': return 'status-confirmed'
      case 'payment': return 'status-processing'
      case 'pending_withdrawal': return 'status-pending'
      case 'pending_review': return 'status-review'
      default: return ''
    }
  }

  // 处理账单明细查看
  const handleViewBillDetail = (item) => {
    setSelectedBill({
      bill_id: item.bill_id || item.id,
      bill_number: item.bill_number || item.billNumber,
      billing_date: item.billing_date || item.exportDate,
      amount: item.amount,
      status: item.status,
      due_date: item.due_date,
      remarks: item.remarks
    })
    setIsDetailModalOpen(true)
  }

  // 关闭账单明细弹窗
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedBill(null)
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
            <StatusSelect
              value={filters.billStatus}
              onChange={(value) => onSearch({ ...filters, billStatus: value })}
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
                <th>结算期间</th>
                <th>金额(元)</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-cell">
                    <div className="loading-spinner">正在加载...</div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    <div className="empty-state">
                      {filteredData.length === 0 && Array.isArray(data) && data.length > 0 
                        ? '没有找到匹配的账单记录' 
                        : '暂无账单数据'
                      }
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map(item => (
                  <tr key={item.bill_id || item.id}>
                    <td>{item.billing_date || item.exportDate || '-'}</td>
                    <td className="bill-number">{item.bill_number || item.billNumber || '-'}</td>
                    <td>{item.due_date ? `截止日期: ${item.due_date}` : item.settlementPeriod || '-'}</td>
                    <td className="amount">{formatCurrency(parseFloat(item.amount) || 0)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        ● {getStatusText(item.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-btn view-detail-btn"
                        onClick={() => handleViewBillDetail(item)}
                      >
                        账单明细查看
                      </button>
                      {item.remarks && (
                        <div className="remarks" title={item.remarks}>
                          备注: {item.remarks.length > 10 ? item.remarks.substring(0, 10) + '...' : item.remarks}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
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

      {/* 账单明细弹窗 */}
      <BillDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        billInfo={selectedBill}
      />
    </div>
  )
}

export default SettlementTable