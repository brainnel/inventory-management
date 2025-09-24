import React, { useState } from 'react'

const SearchForm = ({ onSearch }) => {
  const [form, setForm] = useState({
    supplierId: '',
    platformId: '',
    stockStatus: 'all'
  })
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(form)
  }

  const handleReset = () => {
    const resetForm = { supplierId: '', platformId: '', stockStatus: 'all' }
    setForm(resetForm)
    onSearch(resetForm)
  }
  
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  
  const handleOptionSelect = (value) => {
    setForm(prev => ({ ...prev, stockStatus: value }))
    setIsDropdownOpen(false)
  }

  const stockStatusOptions = [
    { value: 'all', label: '全部状态' },
    { value: '充足', label: '充足' },
    { value: '预警', label: '预警' },
    { value: '不足', label: '不足' }
  ]

  return (
    <div className="search-form">
      <div className="search-header">
        <img src="/商品查询.png" alt="商品查询" className="search-icon" />
        <h3 className="search-title">商品查询</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="search-form-content">
        <div className="search-row">
          <div className="form-group">
            <label htmlFor="supplierId">供应商编号</label>
            <input
              type="text"
              id="supplierId"
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
              placeholder="输入供应商编号"
            />
          </div>

          <div className="form-group">
            <label htmlFor="platformId">平台编号</label>
            <input
              type="text"
              id="platformId"
              name="platformId"
              value={form.platformId}
              onChange={handleChange}
              placeholder="输入平台分配编号"
            />
          </div>

          <div className="form-group">
            <label>库存状态</label>
            <div className="custom-dropdown">
              <div 
                className="dropdown-trigger" 
                onClick={handleDropdownToggle}
              >
                <span className="dropdown-value">
                  {stockStatusOptions.find(opt => opt.value === form.stockStatus)?.label}
                </span>
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-options">
                  {stockStatusOptions.map(option => (
                    <div
                      key={option.value}
                      className={`dropdown-option ${form.stockStatus === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="search-btn">
              搜索
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchForm