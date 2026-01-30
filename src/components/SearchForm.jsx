import React, { useState, useEffect } from 'react'

const SearchForm = ({ onSearch, showSupplierFilter = false }) => {
  const [form, setForm] = useState({
    sku: '',
    stockStatus: 'all',
    supplierNo: 'all'
  })

  const [isStockDropdownOpen, setIsStockDropdownOpen] = useState(false)
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false)

  // SKU输入防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(form)
    }, 300)
    return () => clearTimeout(timer)
  }, [form.sku])

  const handleSkuChange = (e) => {
    setForm(prev => ({ ...prev, sku: e.target.value }))
  }

  const handleStockStatusSelect = (value) => {
    const newForm = { ...form, stockStatus: value }
    setForm(newForm)
    setIsStockDropdownOpen(false)
    onSearch(newForm)
  }

  const handleSupplierSelect = (value) => {
    const newForm = { ...form, supplierNo: value }
    setForm(newForm)
    setIsSupplierDropdownOpen(false)
    onSearch(newForm)
  }

  const stockStatusOptions = [
    { value: 'all', label: '全部状态' },
    { value: '充足', label: '充足' },
    { value: '预警', label: '预警' },
    { value: '不足', label: '不足' }
  ]

  const supplierOptions = [
    { value: 'all', label: '全部供应商' },
    { value: 'BR', label: 'BR' },
    { value: 'JS', label: 'JS' },
    { value: 'JD', label: 'JD' },
    { value: 'SO', label: 'SO' }
  ]

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-dropdown')) {
        setIsStockDropdownOpen(false)
        setIsSupplierDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="search-form">
      <div className="search-header">
        <img src={`${import.meta.env.BASE_URL}商品查询.png`} alt="商品查询" className="search-icon" />
        <h3 className="search-title">商品查询</h3>
      </div>

      <div className="search-form-content">
        <div className="search-row">
          <div className="form-group">
            <label htmlFor="sku">SKU编号</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={form.sku}
              onChange={handleSkuChange}
              placeholder="输入SKU编号"
            />
          </div>

          {showSupplierFilter && (
            <div className="form-group">
              <label>供应商</label>
              <div className="custom-dropdown">
                <div
                  className="dropdown-trigger"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsSupplierDropdownOpen(!isSupplierDropdownOpen)
                    setIsStockDropdownOpen(false)
                  }}
                >
                  <span className="dropdown-value">
                    {supplierOptions.find(opt => opt.value === form.supplierNo)?.label}
                  </span>
                  <span className={`dropdown-arrow ${isSupplierDropdownOpen ? 'open' : ''}`}>▼</span>
                </div>
                {isSupplierDropdownOpen && (
                  <div className="dropdown-options">
                    {supplierOptions.map(option => (
                      <div
                        key={option.value}
                        className={`dropdown-option ${form.supplierNo === option.value ? 'selected' : ''}`}
                        onClick={() => handleSupplierSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>库存状态</label>
            <div className="custom-dropdown">
              <div
                className="dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsStockDropdownOpen(!isStockDropdownOpen)
                  setIsSupplierDropdownOpen(false)
                }}
              >
                <span className="dropdown-value">
                  {stockStatusOptions.find(opt => opt.value === form.stockStatus)?.label}
                </span>
                <span className={`dropdown-arrow ${isStockDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              {isStockDropdownOpen && (
                <div className="dropdown-options">
                  {stockStatusOptions.map(option => (
                    <div
                      key={option.value}
                      className={`dropdown-option ${form.stockStatus === option.value ? 'selected' : ''}`}
                      onClick={() => handleStockStatusSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchForm
