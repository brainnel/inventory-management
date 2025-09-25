import React, { useState, useRef, useEffect } from 'react'

const MonthPicker = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(null)
  const dropdownRef = useRef(null)

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 解析当前值
  useEffect(() => {
    if (value) {
      const match = value.match(/(\d{4})年(\d{1,2})月/)
      if (match) {
        setSelectedYear(parseInt(match[1]))
        setSelectedMonth(parseInt(match[2]))
      }
    }
  }, [value])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleYearChange = (direction) => {
    setSelectedYear(prev => prev + direction)
  }

  const handleMonthSelect = (monthIndex) => {
    const month = monthIndex + 1
    setSelectedMonth(month)
    const newValue = `${selectedYear}年${month}月`
    onChange(newValue)
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    if (value) {
      return value
    }
    return placeholder || '请选择结算周期对应的年月'
  }

  return (
    <div className="month-picker" ref={dropdownRef}>
      <div className="month-picker-trigger" onClick={handleToggle}>
        <input
          type="text"
          readOnly
          value={getDisplayValue()}
          placeholder={placeholder}
          className="month-picker-input"
        />
        <div className="month-picker-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12 6.5H4L8 10.5L12 6.5Z"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="month-picker-dropdown">
          <div className="month-picker-header">
            <button
              type="button"
              className="year-nav-btn"
              onClick={() => handleYearChange(-1)}
            >
              ‹‹
            </button>
            <span className="year-display">{selectedYear}年</span>
            <button
              type="button"
              className="year-nav-btn"
              onClick={() => handleYearChange(1)}
            >
              ››
            </button>
          </div>
          <div className="month-grid">
            {months.map((month, index) => {
              const monthNum = index + 1
              const isSelected = selectedMonth === monthNum
              const isCurrentMonth = new Date().getMonth() === index && 
                                   new Date().getFullYear() === selectedYear
              
              return (
                <button
                  key={monthNum}
                  type="button"
                  className={`month-cell ${isSelected ? 'selected' : ''} ${isCurrentMonth ? 'current' : ''}`}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthPicker