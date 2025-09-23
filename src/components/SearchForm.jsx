import React, { useState } from 'react'

const SearchForm = ({ onSearch }) => {
  const [form, setForm] = useState({
    supplierId: '',
    platformId: '',
    stockStatus: 'all'
  })

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

  const stockStatusOptions = [
    { value: 'all', label: '全部状态' },
    { value: '充足', label: '充足' },
    { value: '预警', label: '预警' },
    { value: '不足', label: '不足' }
  ]

  return (
    <div className="search-form">
      <h3 className="search-title">商品查询</h3>
      
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
              placeholder="请输入供应商编号"
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
              placeholder="请输入平台编号"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stockStatus">库存状态</label>
            <select
              id="stockStatus"
              name="stockStatus"
              value={form.stockStatus}
              onChange={handleChange}
            >
              {stockStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="search-btn">
              查询
            </button>
            <button type="button" onClick={handleReset} className="reset-btn">
              重置
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchForm