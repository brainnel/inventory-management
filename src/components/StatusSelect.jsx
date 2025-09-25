import React, { useState, useRef, useEffect } from 'react'

const StatusSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const statusOptions = [
    { value: 'all', label: '全部' },
    { value: '待提现', label: '待提现' },
    { value: '打款中', label: '打款中' },
    { value: '已打款', label: '已打款' }
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

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (selectedValue) => {
    onChange(selectedValue)
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    const selectedOption = statusOptions.find(option => option.value === value)
    if (selectedOption) {
      if (selectedOption.value === 'all') {
        return '账单状态 全部'
      } else {
        return `账单状态 ${selectedOption.label}`
      }
    }
    return '账单状态 全部'
  }

  return (
    <div className="status-select" ref={dropdownRef}>
      <div className="status-select-trigger" onClick={handleToggle}>
        <input
          type="text"
          readOnly
          value={getDisplayValue()}
          className="status-select-input"
        />
        <div className={`status-select-arrow ${isOpen ? 'open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 8L2 4H10L6 8Z"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="status-select-dropdown">
          {statusOptions.map(option => (
            <div
              key={option.value}
              className={`status-select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatusSelect