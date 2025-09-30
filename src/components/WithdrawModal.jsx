import React from 'react'
import Modal from './Modal'

const WithdrawModal = ({ 
  isOpen, 
  onClose, 
  type, // 'confirm' | 'loading' | 'success' | 'error'
  amount,
  onConfirm,
  result, // 提现结果数据
  error // 错误信息
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getModalContent = () => {
    switch (type) {
      case 'confirm':
        return (
          <>
            <div className="withdraw-modal-icon withdraw-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z"/>
              </svg>
            </div>
            <div className="withdraw-modal-content">
              <h4 className="withdraw-modal-subtitle">确认提现</h4>
              <div className="withdraw-amount-display">
                <span className="withdraw-amount-label">提现金额</span>
                <div className="withdraw-amount-value">
                  ¥ {formatCurrency(amount)}
                </div>
              </div>
              <div className="withdraw-notice">
                <p>提现说明：</p>
                <ul>
                  <li>提现后，相关账单将转为"打款中"状态</li>
                  <li>预计1-3个工作日到账</li>
                  <li>请确保您的银行账户信息正确</li>
                </ul>
              </div>
            </div>
            <div className="withdraw-modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>
                取消
              </button>
              <button className="btn btn-primary" onClick={onConfirm}>
                确认提现
              </button>
            </div>
          </>
        )

      case 'loading':
        return (
          <>
            <div className="withdraw-modal-icon withdraw-loading-icon">
              <div className="loading-spinner">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="#4f46e5" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
            </div>
            <div className="withdraw-modal-content">
              <h4 className="withdraw-modal-subtitle">正在处理提现</h4>
              <p className="withdraw-loading-text">请稍候，正在为您处理提现申请...</p>
            </div>
          </>
        )

      case 'success':
        return (
          <>
            <div className="withdraw-modal-icon withdraw-success-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z"/>
              </svg>
            </div>
            <div className="withdraw-modal-content">
              <h4 className="withdraw-modal-subtitle">提现成功</h4>
              {result && (
                <div className="withdraw-result">
                  <div className="result-item">
                    <span className="result-label">提现金额：</span>
                    <span className="result-value">¥ {formatCurrency(result.total_amount)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">处理账单：</span>
                    <span className="result-value">{result.affected_count} 笔</span>
                  </div>
                  {result.message && (
                    <div className="result-message">
                      {result.message}
                    </div>
                  )}
                </div>
              )}
              <div className="withdraw-success-notice">
                <p>✓ 提现申请已提交成功</p>
                <p>✓ 相关账单已转为"打款中"状态</p>
                <p>✓ 预计1-3个工作日到账</p>
              </div>
            </div>
            <div className="withdraw-modal-actions">
              <button className="btn btn-primary btn-full" onClick={onClose}>
                确定
              </button>
            </div>
          </>
        )

      case 'error':
        return (
          <>
            <div className="withdraw-modal-icon withdraw-error-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 30h-4v-4h4v4zm0-8h-4V14h4v12z"/>
              </svg>
            </div>
            <div className="withdraw-modal-content">
              <h4 className="withdraw-modal-subtitle">提现失败</h4>
              <div className="withdraw-error-message">
                {error || '提现处理失败，请稍后重试'}
              </div>
            </div>
            <div className="withdraw-modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>
                取消
              </button>
              <button className="btn btn-primary" onClick={() => {
                onClose()
                // 可以在这里重新触发提现
              }}>
                重试
              </button>
            </div>
          </>
        )

      default:
        return null
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'confirm': return '提现确认'
      case 'loading': return '处理中'
      case 'success': return '提现成功'
      case 'error': return '提现失败'
      default: return '提现'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={type === 'loading' ? null : onClose} // 加载时不允许关闭
      title={getTitle()}
      showCloseButton={type !== 'loading'}
      size="small"
    >
      <div className="withdraw-modal">
        {getModalContent()}
      </div>
    </Modal>
  )
}

export default WithdrawModal