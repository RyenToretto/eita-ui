// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // 暂时禁用 SSR 来解决水合错误
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'wonder-lib/nuxt'
  ],
  
  // Wonder Lib 配置
  wonderLib: {
    prefix: 'W',
    globalStyles: true,
    theme: {
      primaryColor: '#3b82f6',
      borderRadius: '0.375rem'
    }
  },
  
  // CSS 配置
  // css: [
  //   '~/assets/css/main.css'
  // ],
  
  // TypeScript 配置
  typescript: {
    typeCheck: false
  },
  
  // 开发服务器配置
  devServer: {
    port: 3000
  }
})
