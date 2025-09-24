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
      change: '+12',
      trend: 'up',
      color: 'blue'
    },
    {
      title: '本月销售额',
      value: '￥128,560',
      change: '+12',
      trend: 'up',
      color: 'blue'
    },
    {
      title: '本月销量',
      value: '1,560',
      change: '+12',
      trend: 'up',
      color: 'blue'
    },
    {
      title: '库存不足(需补货)',
      value: formatNumber(stats.lowStockCount),
      change: '',
      trend: 'warning',
      color: 'red'
    }
  ]

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className={`stats-card ${card.color}`}>
          <div className="stats-content">
            <h3 className="stats-title">{card.title}</h3>
            <div className="stats-main">
              <div className="stats-left">
                <p className="stats-value">{card.value}</p>
                {card.change && (
                  <div className="stats-change">
                    <img 
                      src={card.trend === 'up' ? '/上升.png' : card.trend === 'warning' ? '/警告.png' : '/上升.png'}
                      alt={card.trend}
                      className={`trend-indicator ${card.trend}`}
                    />
                    <span className="trend-value">{card.change}</span>
                  </div>
                )}
              </div>
              <div className="stats-right">
                {card.change && (
                  <div className="trend-chart">
                    <svg width="50" height="16" viewBox="0 0 50 16">
                      <polyline 
                        points="0,12 8,10 16,6 24,8 32,4 40,5 50,2" 
                        fill="none" 
                        stroke={card.trend === 'warning' ? '#ef4444' : '#3b82f6'} 
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                )}
                {card.trend === 'warning' && !card.change && (
                  <div className="warning-indicator">
                    <img src="/警告.png" alt="警告" className="warning-icon" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards