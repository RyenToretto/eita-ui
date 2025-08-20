<template>
  <div class="app-container">
    <!-- 头部导航 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <NuxtLink to="/" class="logo-link">
            <h1>Wonder-Lib Demo</h1>
          </NuxtLink>
        </div>
        <nav class="nav-menu">
          <NuxtLink to="/" class="nav-link">首页</NuxtLink>
          <NuxtLink to="/components" class="nav-link">组件演示</NuxtLink>
          <NuxtLink to="/test" class="nav-link">功能测试</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="app-main">
      <NuxtPage />
    </main>

    <!-- 底部信息 -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 Wonder-Lib. 基于 Vue 3 + Nuxt 4 构建的现代化组件库。</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 页面元信息
useHead({
  titleTemplate: '%s - Wonder-Lib Demo',
  meta: [
    {
      name: 'description',
      content: 'Wonder-Lib 演示项目 - 基于 Vue 3 + Nuxt 4 的现代化组件库'
    }
  ]
})
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;

  .app-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .logo {
        .logo-link {
          text-decoration: none;
          color: inherit;
          
          h1 {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1e293b;
            margin: 0;
          }
        }
      }

      .nav-menu {
        display: flex;
        gap: 2rem;

        .nav-link {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;

          &:hover {
            color: #3b82f6;
          }

          &.router-link-active {
            color: #3b82f6;
            font-weight: 600;
          }
        }
      }
    }
  }

  .app-main {
    flex: 1;
  }

  .app-footer {
    background: #1e293b;
    color: white;
    padding: 2rem 0;
    margin-top: auto;

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;

      p {
        margin: 0;
        opacity: 0.8;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .app-container {
    .app-header {
      .header-content {
        padding: 0 1rem;
        flex-direction: column;
        gap: 1rem;

        .nav-menu {
          gap: 1rem;
        }
      }
    }

    .app-footer {
      .footer-content {
        padding: 0 1rem;
      }
    }
  }
}
</style>
