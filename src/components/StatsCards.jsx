import React from 'react'

const StatsCards = ({ data }) => {
  // 统计数据计算
  const stats = {
    totalProducts: data.length,
    totalSalesAmount: data.reduce((sum, item) => sum + item.totalSalesAmount, 0),
    totalSalesQty: data.reduce((sum, item) => sum + item.totalSalesQty, 0),
    lowStockCount: data.filter(item => item.status === '不足').length,
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('zh-CN').format(number)
  }

  const cards = [
    {
      title: '商品总数',
      value: formatNumber(stats.totalProducts),
      icon: '📦',
      color: 'blue'
    },
    {
      title: '总销售额',
      value: formatCurrency(stats.totalSalesAmount),
      icon: '💰',
      color: 'green'
    },
    {
      title: '总销量',
      value: formatNumber(stats.totalSalesQty),
      icon: '📈',
      color: 'purple'
    },
    {
      title: '库存不足商品数',
      value: formatNumber(stats.lowStockCount),
      icon: '⚠️',
      color: 'red'
    }
  ]

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className={`stats-card ${card.color}`}>
          <div className="stats-icon">{card.icon}</div>
          <div className="stats-content">
            <h3 className="stats-title">{card.title}</h3>
            <p className="stats-value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards