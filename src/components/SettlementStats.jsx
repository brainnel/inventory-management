import React from 'react'

const SettlementStats = ({ data }) => {
  // 计算统计数据
  const stats = {
    pendingAmount: data.filter(item => item.status === '待打款').reduce((sum, item) => sum + item.amount, 0),
    processingAmount: data.filter(item => item.status === '打款中').reduce((sum, item) => sum + item.amount, 0),
    confirmedAmount: data.filter(item => item.status === '已打款').reduce((sum, item) => sum + item.amount, 0),
    totalAmount: data.reduce((sum, item) => sum + item.amount, 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="settlement-stats">
      <div className="account-balance-section">
        <h2 className="section-title">账户余额</h2>
        <div className="balance-cards">
          <div className="balance-card pending">
            <div className="balance-content">
              <div className="balance-info">
                <span className="balance-label">可用余额(元)</span>
                <div className="balance-amount">0<span className="currency">元</span></div>
                <p className="balance-description">
                  账户余额 = 提交发货前货款总额 = 提现成功金额 - 银行打款中金额
                </p>
              </div>
              <button className="withdraw-btn">立即提现</button>
            </div>
          </div>
          <div className="balance-card processing">
            <div className="balance-info">
              <span className="balance-label">银行打款中金额</span>
              <div className="balance-amount">0<span className="currency">元</span></div>
              <p className="balance-description">银行处理中金额</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SettlementStats