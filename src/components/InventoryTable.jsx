import React, { useState, useMemo, useEffect } from 'react'

const InventoryTable = ({ data, filters, pagination, onPageChange, onPageSizeChange }) => {
  const [previewImage, setPreviewImage] = useState(null)
  const [sortField, setSortField] = useState(null) // 排序字段
  const [sortOrder, setSortOrder] = useState('asc') // 排序顺序: 'asc' | 'desc'

  // 可排序的字段配置
  const sortableFields = {
    total_sales: '累计销量',
    supply_stock: '库存',
    in_transit: '在途',
    stock: '在售',
    price: '供货价'
  }

  // 处理排序点击
  const handleSort = (field) => {
    if (sortField === field) {
      // 同一字段，切换排序顺序
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // 新字段，默认降序
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // 获取排序图标
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return '↕' // 未排序
    }
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  // 对数据进行排序
  const sortedData = useMemo(() => {
    if (!data || !sortField) return data || []

    return [...data].sort((a, b) => {
      let valueA, valueB

      if (sortField === 'in_transit') {
        // 在途 = supply_stock - stock - locked_stock
        valueA = Math.max(0, (a.supply_stock || 0) - (a.stock || 0) - (a.locked_stock || 0))
        valueB = Math.max(0, (b.supply_stock || 0) - (b.stock || 0) - (b.locked_stock || 0))
      } else {
        valueA = a[sortField] || 0
        valueB = b[sortField] || 0
      }

      if (sortOrder === 'asc') {
        return valueA - valueB
      } else {
        return valueB - valueA
      }
    })
  }, [data, sortField, sortOrder])

  // 使用排序后的数据
  const paginatedData = sortedData

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange(page)
    }
  }

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value)
    onPageSizeChange(newSize)
  }

  const handleJumpToPage = (e) => {
    if (e.key === 'Enter') {
      const page = Number(e.target.value)
      if (page >= 1 && page <= pagination.totalPages) {
        onPageChange(page)
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

  // 根据stock_status数值转换为文字状态
  const getStatusText = (stockStatus) => {
    switch (stockStatus) {
      case 1: return '充足'
      case 2: return '预警'
      case 3: return '不足'
      default: return '充足' // 默认值
    }
  }

  // 图片预览相关函数
  const handleImageClick = (imageUrl, productName) => {
    setPreviewImage({ url: imageUrl, name: productName })
  }

  const closeImagePreview = () => {
    setPreviewImage(null)
  }

  // 点击背景关闭预览
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeImagePreview()
    }
  }

  // 键盘事件处理ESC键关闭预览
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && previewImage) {
        closeImagePreview()
      }
    }

    if (previewImage) {
      document.addEventListener('keydown', handleKeyDown)
      // 阻止背景滚动
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [previewImage])

  return (
    <div className="inventory-table">
      <div className="table-header">
        <div className="table-title-section">
          <img src={`${import.meta.env.BASE_URL}商品库存明细.png`} alt="商品库存明细" className="table-icon" />
          <h3 className="table-title">商品库存明细</h3>
        </div>
        <div className="table-actions">
          <button className="export-btn">
            <img src={`${import.meta.env.BASE_URL}导出.png`} alt="导出" className="export-icon" />
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
              <th
                className={`sortable-header ${sortField === 'total_sales' ? 'active' : ''}`}
                onClick={() => handleSort('total_sales')}
              >
                累计销量 <span className="sort-icon">{getSortIcon('total_sales')}</span>
              </th>
              <th
                className={`sortable-header ${sortField === 'supply_stock' ? 'active' : ''}`}
                onClick={() => handleSort('supply_stock')}
              >
                库存 <span className="sort-icon">{getSortIcon('supply_stock')}</span>
              </th>
              <th
                className={`sortable-header ${sortField === 'in_transit' ? 'active' : ''}`}
                onClick={() => handleSort('in_transit')}
              >
                在途 <span className="sort-icon">{getSortIcon('in_transit')}</span>
              </th>
              <th
                className={`sortable-header ${sortField === 'stock' ? 'active' : ''}`}
                onClick={() => handleSort('stock')}
              >
                在售 <span className="sort-icon">{getSortIcon('stock')}</span>
              </th>
              <th
                className={`sortable-header ${sortField === 'price' ? 'active' : ''}`}
                onClick={() => handleSort('price')}
              >
                供货价 <span className="sort-icon">{getSortIcon('price')}</span>
              </th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => {
              // 根据新的数据结构计算字段
              const availableStock = item.stock || 0 // 在售
              const inTransitStock = Math.max(0, (item.supply_stock || 0) - (item.stock || 0) - (item.locked_stock || 0)) // 在途，负数显示0
              const status = getStatusText(item.stock_status) // 使用API返回的stock_status
              
              return (
                <tr key={item.internal_no || index}>
                  <td className="product-image">
                    <img 
                      src={item.sku_image_url || `${import.meta.env.BASE_URL}示例图片.jpg`} 
                      alt={item.name_cn || ''}
                      className="product-img"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleImageClick(item.sku_image_url || `${import.meta.env.BASE_URL}示例图片.jpg`, item.name_cn || '')}
                    />
                  </td>
                  <td className="product-sku">
                    <div className="sku-text">{item.internal_no || ''}</div>
                  </td>
                  <td className="product-name">
                    <div className="name-text" title={item.name_cn || ''}>{item.name_cn || ''}</div>
                  </td>
                  <td>{(item.total_sales || 0).toLocaleString()}</td>
                  <td>{item.supply_stock || 0}</td>
                  <td>{inTransitStock}</td>
                  <td>{availableStock}</td>
                  <td>¥{item.price ? parseFloat(item.price).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(status)}`}>
                      {status}
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
          <select value={pagination.size || 50} onChange={handlePageSizeChange} className="page-size-select">
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>条，共 {pagination.total || 0} 条记录</span>
        </div>

        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            上一页
          </button>
          
          <span className="page-info">
            第 {pagination.page || 1} 页，共 {pagination.totalPages || 0} 页
          </span>
          
          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
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
            max={pagination.totalPages || 1}
            placeholder="页码"
            onKeyDown={handleJumpToPage}
            className="page-jump-input"
          />
          <span>页</span>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {previewImage && (
        <div 
          className="image-preview-overlay"
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div 
            className="image-preview-content"
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImagePreview}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#333'
              }}
            >
              ×
            </button>
            <img 
              src={previewImage.url}
              alt={previewImage.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            />
            {previewImage.name && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'white',
                  fontSize: '14px',
                  textAlign: 'center',
                  maxWidth: '300px',
                  wordBreak: 'break-word'
                }}
              >
                {previewImage.name}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryTable