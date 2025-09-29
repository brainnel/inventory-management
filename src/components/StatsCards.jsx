import React from 'react'

const StatsCards = ({ data }) => {
  // 统计数据计算
  const stats = {
    totalProducts: data.length,
    totalSalesQty: data.reduce((sum, item) => sum + (item.total_sales || 0), 0),
    lowStockCount: data.filter(item => (item.stock || 0) < 10).length, // 定义库存低于10为不足
    sufficientStockCount: data.filter(item => (item.stock || 0) >= 50).length, // 定义库存大于等于50为充足
    warningStockCount: data.filter(item => (item.stock || 0) >= 10 && (item.stock || 0) < 50).length, // 定义库存10-49为预警
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

  // 获取趋势颜色
  const getTrendColor = (cardColor, trend) => {
    if (trend === 'warning') return '#ef4444'
    switch (cardColor) {
      case 'green': return '#16a34a'
      case 'orange': return '#ea580c'
      case 'red': return '#ef4444'
      case 'blue':
      default: return '#3b82f6'
    }
  }

  const cards = [
    {
      title: '商品总数',
      value: formatNumber(stats.totalProducts),
      change: '',
      trend: 'up',
      color: 'blue'
    },
    {
      title: '累计销量',
      value: formatNumber(stats.totalSalesQty),
      change: '',
      trend: 'up',
      color: 'blue'
    },
    {
      title: '库存充足',
      value: formatNumber(stats.sufficientStockCount),
      change: '',
      trend: 'up',
      color: 'green'
    },
    {
      title: '库存预警',
      value: formatNumber(stats.warningStockCount),
      change: '',
      trend: 'warning',
      color: 'orange'
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
              <div className="stats-value-row">
                <p className="stats-value">{card.value}</p>
                {card.change && (
                  <div className="stats-change">
                    <img 
                      src={card.trend === 'up' ? '/上升.png' : card.trend === 'warning' ? '/警告.png' : '/上升.png'}
                      alt={card.trend}
                      className={`trend-indicator ${card.trend}`}
                    />
                    <span className="trend-value" style={{ color: getTrendColor(card.color, card.trend) }}>{card.change}</span>
                  </div>
                )}
                {card.trend === 'warning' && !card.change && (
                  <div className="warning-indicator">
                    <img src="/警告.png" alt="警告" className="warning-icon" />
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
                        stroke={getTrendColor(card.color, card.trend)} 
                        strokeWidth="1.5"
                      />
                    </svg>
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