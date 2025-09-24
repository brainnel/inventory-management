import React, { useState, useMemo } from 'react'

const InventoryTable = ({ data, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 过滤数据
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSupplier = !filters.supplierId || item.supplierId.includes(filters.supplierId)
      const matchPlatform = !filters.platformId || item.platformId.includes(filters.platformId)
      const matchStatus = filters.stockStatus === 'all' || item.status === filters.stockStatus
      
      return matchSupplier && matchPlatform && matchStatus
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
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case '充足': return 'status-sufficient'
      case '预警': return 'status-warning'
      case '不足': return 'status-insufficient'
      default: return ''
    }
  }

  return (
    <div className="inventory-table">
      <div className="table-header">
        <div className="table-title-section">
          <img src="/商品库存明细.png" alt="商品库存明细" className="table-icon" />
          <h3 className="table-title">商品库存明细</h3>
        </div>
        <div className="table-actions">
          <button className="export-btn">
            <img src="/导出.png" alt="导出" className="export-icon" />
            导出Excel
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>图片</th>
              <th>SKU</th>
              <th>商品名称</th>
              <th>累计销量</th>
              <th>本月销量</th>
              <th>销售天数</th>
              <th>库存</th>
              <th>在途</th>
              <th>在售</th>
              <th>供货价</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => {
              const availableStock = item.stockInWarehouse - item.stockFrozen
              return (
                <tr key={item.id}>
                  <td className="product-image">
                    <img 
                      src={item.image || '/示例图片.jpg'} 
                      alt={item.name}
                      className="product-img"
                    />
                  </td>
                  <td className="product-sku">
                    <div className="sku-text">{item.sku}</div>
                  </td>
                  <td className="product-name">
                    <div className="name-text">{item.name}</div>
                  </td>
                  <td>{item.totalSalesQty.toLocaleString()}</td>
                  <td>{item.monthSalesQty}</td>
                  <td>{item.salesDays}</td>
                  <td>{item.stockInWarehouse}</td>
                  <td>{item.stockInTransit}</td>
                  <td>{availableStock}</td>
                  <td>{formatCurrency(item.costRmb)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

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
  )
}

export default InventoryTable