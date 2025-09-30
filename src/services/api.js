import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器，自动添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器，处理token过期
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token过期，清除本地存储
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
      // 重定向到登录页
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  // 用户登录
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    })
    return response.data
  },

  // 用户注册
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // 刷新token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

// 商品相关API
export const productsAPI = {
  // 获取商品列表
  getProductsList: async (supplierNo, page = 1, size = 50, filters = {}) => {
    const params = {
      supplier_no: supplierNo,
      page,
      size,
    }
    
    // 添加可选的过滤参数
    if (filters.internal_no) {
      params.internal_no = filters.internal_no
    }
    if (filters.stock_status) {
      params.stock_status = filters.stock_status
    }
    
    const response = await api.get('/products/list', {
      params,
    })
    return response.data
  },

  // 获取商品统计信息
  getProductStatistics: async (supplierNo) => {
    const params = {}
    if (supplierNo) {
      params.supplier_no = supplierNo
    }
    
    const response = await api.get('/products/statistics', {
      params,
    })
    return response.data
  },
}

// 账单相关API
export const settlementAPI = {
  // 获取账单列表
  getSettlementBills: async (status = 'all') => {
    const params = {}
    if (status && status !== 'all') {
      params.status = status
    }
    
    const response = await api.get('/settlement-bills/list', {
      params,
    })
    return response.data
  },

  // 获取账单汇总信息
  getSettlementBillsSummary: async () => {
    const response = await api.get('/settlement-bills/summary')
    return response.data
  },

  // 获取账单金额汇总
  getSettlementBillsAmountSummary: async () => {
    const response = await api.get('/settlement-bills/amount-summary')
    return response.data
  },

  // 提现接口
  withdrawBills: async () => {
    const response = await api.post('/settlement-bills/withdraw')
    return response.data
  },

  // 获取账单商品明细
  getBillProducts: async (billId) => {
    const response = await api.get(`/settlement-bills/${billId}/products`)
    return response.data
  },
}

// 工具函数
export const authUtils = {
  // 保存认证信息
  saveAuth: (token, userInfo) => {
    localStorage.setItem('access_token', token.access_token)
    localStorage.setItem('user_info', JSON.stringify(userInfo))
  },

  // 获取认证信息
  getAuth: () => {
    const token = localStorage.getItem('access_token')
    const userInfo = localStorage.getItem('user_info')
    return {
      token,
      userInfo: userInfo ? JSON.parse(userInfo) : null,
    }
  },

  // 清除认证信息
  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
  },

  // 检查是否已登录
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token')
    return !!token
  },
}

export default api