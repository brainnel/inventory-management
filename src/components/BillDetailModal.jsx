import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { settlementAPI } from '../services/api'

const BillDetailModal = ({ 
  isOpen, 
  onClose, 
  billInfo // 账单基本信息 { bill_id, bill_number, billing_date, amount, status, due_date }
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

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

  // 获取账单商品详情
  const fetchBillProducts = async (billId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settlementAPI.getBillProducts(billId)
      setProducts(Array.isArray(response.items) ? response.items : [])
      setTotalCount(response.total || 0)
    } catch (err) {
      console.error('Failed to fetch bill products:', err)
      setError('获取账单明细失败，请稍后重试')
      setProducts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  // 当弹窗打开时获取数据
  useEffect(() => {
    if (isOpen && billInfo?.bill_id) {
      fetchBillProducts(billInfo.bill_id)
    }
  }, [isOpen, billInfo?.bill_id])

  // 当弹窗关闭时清理数据
  useEffect(() => {
    if (!isOpen) {
      setProducts([])
      setTotalCount(0)
      setError(null)
    }
  }, [isOpen])

  if (!billInfo) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="账单明细"
      size="large"
    >
      <div className="bill-detail-modal">
        {/* 账单基本信息 */}
        <div className="bill-basic-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">账单编号：</span>
              <span className="info-value">{billInfo.bill_number || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">计费日期：</span>
              <span className="info-value">{billInfo.billing_date || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">账单金额：</span>
              <span className="info-value amount">¥ {formatCurrency(parseFloat(billInfo.amount) || 0)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">账单状态：</span>
              <span className={`status-badge ${getStatusClass(billInfo.status)}`}>
                ● {getStatusText(billInfo.status)}
              </span>
            </div>
            {billInfo.due_date && (
              <div className="info-item">
                <span className="info-label">截止日期：</span>
                <span className="info-value">{billInfo.due_date}</span>
              </div>
            )}
            {billInfo.remarks && (
              <div className="info-item full-width">
                <span className="info-label">备注：</span>
                <span className="info-value">{billInfo.remarks}</span>
              </div>
            )}
          </div>
        </div>

        {/* 商品明细 */}
        <div className="bill-products-section">
          <div className="section-header">
            <h4 className="section-title">商品明细</h4>
            {totalCount > 0 && (
              <span className="products-count">共 {totalCount} 个商品</span>
            )}
          </div>

          <div className="products-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#4f46e5" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <span>正在加载商品明细...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <div className="error-message">{error}</div>
                <button 
                  className="retry-btn"
                  onClick={() => fetchBillProducts(billInfo.bill_id)}
                >
                  重新加载
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <div className="empty-message">该账单暂无商品明细</div>
              </div>
            ) : (
              <div className="products-list">
                {products.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-image">
                      {product.sku_image_url ? (
                        <img 
                          src={product.sku_image_url} 
                          alt={product.name_cn}
                          className="product-img"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextElementSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className="product-img-placeholder"
                        style={{ display: product.sku_image_url ? 'none' : 'flex' }}
                      >
                        📦
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="product-name" title={product.name_cn}>
                        {product.name_cn || '商品名称未知'}
                      </div>
                      <div className="product-details">
                        <div className="detail-row">
                          <span className="detail-label">内部编号：</span>
                          <span className="detail-value">{product.internal_no || '-'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">供应商编号：</span>
                          <span className="detail-value">{product.supplier_no || '-'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">供应商商品ID：</span>
                          <span className="detail-value">{product.supplier_product_id || '-'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">SKU ID：</span>
                          <span className="detail-value">{product.sku_id || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="product-quantity">
                      <div className="quantity-label">销售数量</div>
                      <div className="quantity-value">{product.quantity || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="bill-detail-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BillDetailModal