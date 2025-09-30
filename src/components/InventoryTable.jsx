import React, { useState, useMemo, useEffect } from 'react'

const InventoryTable = ({ data, filters, pagination, onPageChange, onPageSizeChange }) => {
  const [previewImage, setPreviewImage] = useState(null)

  // 直接使用API返回的数据，不需要前端分页
  const paginatedData = data || []

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
              <th>累计销量</th>
              <th>库存</th>
              <th>在途</th>
              <th>在售</th>
              <th>供货价</th>
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
                    <div className="name-text">{item.name_cn || ''}</div>
                  </td>
                  <td>{(item.total_sales || 0).toLocaleString()}</td>
                  <td>{item.supply_stock || 0}</td>
                  <td>{inTransitStock}</td>
                  <td>{availableStock}</td>
                  <td>{item.price ? `${parseFloat(item.price).toLocaleString()} FCFA` : '0 FCFA'}</td>
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
          <select value={pagination.size || 20} onChange={handlePageSizeChange} className="page-size-select">
            <option value={10}>10</option>
            <option value={20}>20</option>
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