import React, { useState } from 'react'
import { settlementAPI } from '../services/api'
import WithdrawModal from './WithdrawModal'

const SettlementStats = ({ summaryData, amountSummaryData, billsData = [], onDataRefresh }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'confirm', // 'confirm' | 'loading' | 'success' | 'error'
    result: null,
    error: null
  })
  // 优先使用 amount-summary API 的数据，其次使用 summary API，最后从账单数据中计算
  const stats = amountSummaryData ? {
    pendingAmount: amountSummaryData.pending_withdrawal_amount || 0,
    processingAmount: amountSummaryData.payment_amount || 0,
    confirmedAmount: amountSummaryData.done_amount || 0,
    totalAmount: amountSummaryData.total_amount || 0,
    supplierInfo: {
      supplier_id: amountSummaryData.supplier_id,
      supplier_no: amountSummaryData.supplier_no
    }
  } : summaryData ? {
    pendingAmount: summaryData.pending_withdrawal_amount || 0,
    processingAmount: summaryData.payment_amount || 0,
    confirmedAmount: summaryData.done_amount || 0,
    totalAmount: summaryData.total_amount || 0,
    supplierInfo: null
  } : {
    // 后备方案：从账单数据中计算（确保 billsData 是数组）
    pendingAmount: Array.isArray(billsData) ? billsData.filter(item => item.status === 'pending_withdrawal').reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) : 0,
    processingAmount: Array.isArray(billsData) ? billsData.filter(item => item.status === 'payment').reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) : 0,
    confirmedAmount: Array.isArray(billsData) ? billsData.filter(item => item.status === 'done').reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) : 0,
    totalAmount: Array.isArray(billsData) ? billsData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) : 0,
    supplierInfo: null
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // 打开提现确认弹窗
  const handleWithdrawClick = () => {
    if (stats.pendingAmount <= 0) {
      setModalState({
        isOpen: true,
        type: 'error',
        error: '没有可提现的金额',
        result: null
      })
      return
    }

    setModalState({
      isOpen: true,
      type: 'confirm',
      result: null,
      error: null
    })
  }

  // 确认提现
  const handleConfirmWithdraw = async () => {
    try {
      // 显示加载状态
      setModalState(prev => ({
        ...prev,
        type: 'loading'
      }))

      const result = await settlementAPI.withdrawBills()
      
      if (result.success) {
        // 显示成功结果
        setModalState({
          isOpen: true,
          type: 'success',
          result: result,
          error: null
        })
        // 提现成功后刷新数据
        if (onDataRefresh) {
          setTimeout(() => {
            onDataRefresh()
          }, 1000) // 延迟一秒刷新，让用户看到成功信息
        }
      } else {
        // 显示失败结果
        setModalState({
          isOpen: true,
          type: 'error',
          result: null,
          error: result.message || '提现失败，请稍后重试'
        })
      }
    } catch (error) {
      console.error('Withdraw failed:', error)
      setModalState({
        isOpen: true,
        type: 'error',
        result: null,
        error: error.message || '网络错误，请稍后重试'
      })
    }
  }

  // 关闭弹窗
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: 'confirm',
      result: null,
      error: null
    })
  }

  return (
    <div className="settlement-stats">
      <div className="account-balance-section">
        <h2 className="section-title">账户余额</h2>
        <div className="balance-cards">
          <div className="balance-card pending">
            <div className="balance-content">
              <div className="balance-info">
                <span className="balance-label">可提现余额(元)</span>
                <div className="balance-amount">{formatCurrency(stats.pendingAmount)}<span className="currency">元</span></div>
                <p className="balance-description">
                  待提现状态的账单金额总和{stats.supplierInfo ? ` (供应商: ${stats.supplierInfo.supplier_no})` : ''}
                </p>
              </div>
              <button 
                className="withdraw-btn"
                onClick={handleWithdrawClick}
                disabled={stats.pendingAmount <= 0}
              >
                立即提现
              </button>
            </div>
          </div>
          <div className="balance-card processing">
            <div className="balance-info">
              <span className="balance-label">银行打款中金额</span>
              <div className="balance-amount">{formatCurrency(stats.processingAmount)}<span className="currency">元</span></div>
              <p className="balance-description">银行处理中的金额</p>
            </div>
          </div>
          <div className="balance-card completed">
            <div className="balance-info">
              <span className="balance-label">已打款金额</span>
              <div className="balance-amount">{formatCurrency(stats.confirmedAmount)}<span className="currency">元</span></div>
              <p className="balance-description">已完成打款的总金额</p>
            </div>
          </div>
          <div className="balance-card total">
            <div className="balance-info">
              <span className="balance-label">总金额</span>
              <div className="balance-amount">{formatCurrency(stats.totalAmount)}<span className="currency">元</span></div>
              <p className="balance-description">所有账单的总金额</p>
            </div>
          </div>
        </div>
      </div>

      {/* 提现弹窗 */}
      <WithdrawModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        type={modalState.type}
        amount={stats.pendingAmount}
        onConfirm={handleConfirmWithdraw}
        result={modalState.result}
        error={modalState.error}
      />
    </div>
  )
}

export default SettlementStats