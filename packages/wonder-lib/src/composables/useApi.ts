import { ref, computed, type Ref } from 'vue'

/**
 * API 请求状态
 */
export interface ApiState<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  success: Ref<boolean>
}

/**
 * API 请求选项
 */
export interface ApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  transform?: (data: any) => any
}

/**
 * API 请求 Hook
 * @param url 请求地址
 * @param options 请求选项
 * @returns API 状态和方法
 */
export function useApi<T = any>(
  url: string | (() => string),
  options: ApiOptions = {}
): ApiState<T> & {
  execute: (params?: any) => Promise<T | null>
  refresh: () => Promise<T | null>
  reset: () => void
} {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = computed(() => !loading.value && !error.value && data.value !== null)

  const { immediate = false, onSuccess, onError, transform } = options

  /**
   * 执行 API 请求
   */
  const execute = async (params?: any): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null

      const requestUrl = typeof url === 'function' ? url() : url
      
      // 使用 Nuxt 的 $fetch 进行请求
      const response = await $fetch(requestUrl, {
        method: params ? 'POST' : 'GET',
        body: params,
        ...params
      })

      // 数据转换
      const transformedData = transform ? transform(response) : response
      data.value = transformedData

      // 成功回调
      if (onSuccess) {
        onSuccess(transformedData)
      }

      return transformedData
    } catch (err: any) {
      const errorMessage = err?.message || '请求失败'
      error.value = errorMessage
      data.value = null

      // 错误回调
      if (onError) {
        onError(errorMessage)
      }

      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新数据
   */
  const refresh = () => execute()

  /**
   * 重置状态
   */
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  // 立即执行
  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    success,
    execute,
    refresh,
    reset
  }
}

/**
 * GET 请求 Hook
 */
export function useGet<T = any>(
  url: string | (() => string),
  options: ApiOptions = {}
) {
  return useApi<T>(url, { ...options, immediate: true })
}

/**
 * POST 请求 Hook
 */
export function usePost<T = any>(
  url: string | (() => string),
  options: ApiOptions = {}
) {
  const api = useApi<T>(url, options)
  
  const post = (data: any) => api.execute({ method: 'POST', body: data })
  
  return {
    ...api,
    post
  }
}

/**
 * PUT 请求 Hook
 */
export function usePut<T = any>(
  url: string | (() => string),
  options: ApiOptions = {}
) {
  const api = useApi<T>(url, options)
  
  const put = (data: any) => api.execute({ method: 'PUT', body: data })
  
  return {
    ...api,
    put
  }
}

/**
 * DELETE 请求 Hook
 */
export function useDelete<T = any>(
  url: string | (() => string),
  options: ApiOptions = {}
) {
  const api = useApi<T>(url, options)
  
  const del = (id?: string | number) => {
    const deleteUrl = typeof url === 'function' ? url() : url
    const finalUrl = id ? `${deleteUrl}/${id}` : deleteUrl
    return api.execute({ method: 'DELETE', url: finalUrl })
  }
  
  return {
    ...api,
    delete: del
  }
}

/**
 * 分页请求 Hook
 */
export function usePagination<T = any>(
  url: string | (() => string),
  options: ApiOptions & {
    pageSize?: number
    defaultPage?: number
  } = {}
) {
  const { pageSize = 10, defaultPage = 1, ...apiOptions } = options
  
  const currentPage = ref(defaultPage)
  const total = ref(0)
  const pageCount = computed(() => Math.ceil(total.value / pageSize))
  
  const api = useApi<{ data: T[]; total: number; page: number; pageSize: number }>(
    url,
    {
      ...apiOptions,
      transform: (response) => {
        total.value = response.total || 0
        return response
      }
    }
  )
  
  const loadPage = (page: number) => {
    currentPage.value = page
    return api.execute({
      method: 'GET',
      query: {
        page,
        pageSize
      }
    })
  }
  
  const nextPage = () => {
    if (currentPage.value < pageCount.value) {
      return loadPage(currentPage.value + 1)
    }
    return Promise.resolve(null)
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      return loadPage(currentPage.value - 1)
    }
    return Promise.resolve(null)
  }
  
  const firstPage = () => loadPage(1)
  const lastPage = () => loadPage(pageCount.value)
  
  return {
    ...api,
    currentPage,
    total,
    pageCount,
    pageSize,
    loadPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage
  }
}