<template>
  <div class="page-home">
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Wonder Lib</h1>
          <p class="hero-subtitle">现代化的 Vue 3 组件库</p>
          <p class="hero-description">
            基于 Vue 3 + TypeScript + Vite 构建的高质量组件库，提供丰富的组件、工具函数和 Composables
          </p>
          <div class="hero-actions">
            <a href="#demo" class="btn btn-primary">开始使用</a>
            <a href="https://github.com/your-username/wonder-lib" class="btn btn-secondary">GitHub</a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">核心特性</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3 class="feature-title">现代化技术栈</h3>
            <p class="feature-description">基于 Vue 3 Composition API、TypeScript 和 Vite 构建</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">丰富的组件</h3>
            <p class="feature-description">提供按钮、输入框、卡片等常用 UI 组件</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛠️</div>
            <h3 class="feature-title">实用工具</h3>
            <p class="feature-description">包含格式化、验证、日期处理等工具函数</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔧</div>
            <h3 class="feature-title">Composables</h3>
            <p class="feature-description">提供 useApi、useAuth、useTheme 等组合式函数</p>
          </div>
        </div>
      </section>

      <!-- Quick Start Section -->
      <section class="quickstart-section">
        <h2 class="section-title">快速开始</h2>
        <div class="quickstart-content">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>安装</h3>
              <pre><code>npm install wonder-lib</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>配置</h3>
              <pre><code>import { createApp } from 'vue'
import WonderLib from 'wonder-lib'
import 'wonder-lib/dist/style.css'

const app = createApp(App)
app.use(WonderLib)
app.mount('#app')</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>使用</h3>
              <pre><code>&lt;template&gt;
  &lt;WButton type="primary"&gt;点击我&lt;/WButton&gt;
  &lt;WInput v-model="value" placeholder="请输入..." /&gt;
&lt;/template&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section id="demo" class="demo-section">
        <h2 class="section-title">功能演示</h2>
        
        <!-- 组件演示 -->
        <div class="demo-group">
          <h3 class="demo-title">基础组件</h3>
          <div class="demo-content">
            <div class="demo-item">
              <h4>按钮组件</h4>
              <div class="demo-buttons">
                <WButton type="primary" size="small" @click="handleClick">主要按钮</WButton>
                <WButton type="secondary" size="medium" @click="handleClick">次要按钮</WButton>
                <WButton type="success" size="large" @click="handleClick">成功按钮</WButton>
                <WButton type="warning" variant="outline" @click="handleClick">警告按钮</WButton>
                <WButton type="danger" variant="ghost" @click="handleClick">危险按钮</WButton>
              </div>
            </div>
            
            <div class="demo-item">
              <h4>输入框组件</h4>
              <div class="demo-inputs">
                <WInput v-model="inputValue" placeholder="请输入内容" size="medium" clearable />
                <WInput v-model="inputValue2" placeholder="带图标的输入框" size="large" type="text" />
              </div>
            </div>
            
            <div class="demo-item">
              <h4>卡片组件</h4>
              <div class="demo-cards">
                <WCard title="基础卡片" shadow="medium" hoverable bordered rounded>
                  <p>这是一个基础卡片的内容区域</p>
                </WCard>
                <WCard title="高级卡片" shadow="large" padding="large">
                  <p>这是一个带有更多配置的卡片</p>
                </WCard>
              </div>
            </div>
          </div>
        </div>

        <!-- Composables 演示 -->
        <div class="demo-group">
          <h3 class="demo-title">Composables 演示</h3>
          <div class="demo-content">
            <div class="demo-item">
              <h4>useStorage - 本地存储</h4>
              <div class="demo-storage">
                <WInput v-model="storageValue" placeholder="输入要存储的值" />
                <WButton @click="saveToStorage">保存到 localStorage</WButton>
                <WButton @click="loadFromStorage">从 localStorage 读取</WButton>
                <div v-if="storageResult" class="storage-result">{{ storageResult }}</div>
              </div>
            </div>
            
            <div class="demo-item">
              <h4>useTheme - 主题切换</h4>
              <div class="demo-theme">
                <WButton @click="toggleTheme">切换主题</WButton>
                <div v-if="themeInfo" class="theme-info">当前主题: {{ themeInfo }}</div>
              </div>
            </div>
            
            <div class="demo-item">
              <h4>useApi - API 请求</h4>
              <div class="demo-api">
                <WButton @click="fetchData">获取数据</WButton>
                <div v-if="apiResult" class="api-result">
                  <pre>{{ apiResult }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Utils 演示 -->
        <div class="demo-group">
          <h3 class="demo-title">工具函数演示</h3>
          <div class="demo-content">
            <div class="demo-item">
              <h4>格式化工具</h4>
              <div class="demo-format">
                <WInput v-model="formatInput" placeholder="输入数字" />
                <WButton @click="formatNumber">格式化为货币</WButton>
                <div v-if="formatResult" class="format-result">{{ formatResult }}</div>
              </div>
            </div>
            
            <div class="demo-item">
              <h4>验证工具</h4>
              <div class="demo-validate">
                <WInput v-model="validateInput" placeholder="输入邮箱地址" />
                <WButton @click="validateEmail">验证邮箱</WButton>
                <div v-if="validateResult" class="validate-result" :class="{ valid: isValid, invalid: !isValid }">
                  {{ validateResult }}
                </div>
              </div>
            </div>
            
            <div class="demo-item">
              <h4>其他工具</h4>
              <div class="demo-utils">
                <WButton @click="generateId">生成随机 ID</WButton>
                <div v-if="utilsResult" class="utils-result">{{ utilsResult }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <h2 class="section-title">项目数据</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">20+</div>
            <div class="stat-label">组件数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">15+</div>
            <div class="stat-label">工具函数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">10+</div>
            <div class="stat-label">Composables</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">TypeScript</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStorage, useTheme, useApi } from 'wonder-lib'
import { formatCurrency, validateEmail as validateEmailUtil, generateId as generateUniqueId } from 'wonder-lib'

// 响应式数据
const inputValue = ref('')
const inputValue2 = ref('')
const storageValue = ref('')
const storageResult = ref('')
const themeInfo = ref('')
const apiResult = ref('')
const formatInput = ref('')
const formatResult = ref('')
const validateInput = ref('')
const validateResult = ref('')
const isValid = ref(false)
const utilsResult = ref('')

// Composables
const { get: getStorage, set: setStorage } = useStorage()
const { theme, toggleTheme: toggle } = useTheme()
const { get: apiGet } = useApi()

// 事件处理函数
function handleClick() {
  console.log('按钮被点击了')
}

function saveToStorage() {
  setStorage('demo-key', storageValue.value)
  storageResult.value = `已保存: ${storageValue.value}`
}

function loadFromStorage() {
  const value = getStorage('demo-key')
  storageResult.value = `读取到: ${value || '无数据'}`
}

function toggleTheme() {
  toggle()
  themeInfo.value = theme.value
}

async function fetchData() {
  try {
    const data = await apiGet('https://jsonplaceholder.typicode.com/posts/1')
    apiResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    apiResult.value = `请求失败: ${error.message}`
  }
}

function formatNumber() {
  const number = parseFloat(formatInput.value)
  if (!isNaN(number)) {
    formatResult.value = formatCurrency(number)
  } else {
    formatResult.value = '请输入有效数字'
  }
}

function validateEmail() {
  isValid.value = validateEmailUtil(validateInput.value)
  validateResult.value = isValid.value ? '邮箱格式正确' : '邮箱格式错误'
}

function generateId() {
  const id = generateUniqueId()
  utilsResult.value = `生成的ID: ${id}`
}
</script>

<style lang="scss">
.page-home {
  .home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  .hero-section {
    padding: 4rem 0;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin: 0 -2rem 4rem -2rem;
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #fff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }
    .hero-description {
      font-size: 1.125rem;
      line-height: 1.7;
      margin-bottom: 2.5rem;
      opacity: 0.8;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }
  .btn-primary {
    background: white;
    color: #4f46e5;
    &:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
  }
  .btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    &:hover {
      background: white;
      color: #4f46e5;
      transform: translateY(-2px);
    }
  }
  .section-title {
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 3rem;
    color: #1f2937;
  }
  .features-section {
    padding: 4rem 0;
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
      }
      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #1f2937;
      }
      .feature-description {
        color: #6b7280;
        line-height: 1.6;
      }
    }
  }
  .quickstart-section {
    padding: 4rem 0;
    background: #f9fafb;
    margin: 0 -2rem;
    .section-title {
      padding: 0 2rem;
    }
    .quickstart-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 3rem;
      .step-number {
        width: 3rem;
        height: 3rem;
        background: #4f46e5;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.25rem;
        margin-right: 2rem;
        flex-shrink: 0;
      }
      .step-content {
        flex: 1;
        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        pre {
          background: #1f2937;
          color: #e5e7eb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-size: 0.875rem;
          code {
            font-family: 'Monaco', 'Menlo', monospace;
          }
        }
      }
    }
  }
  .demo-section {
    padding: 4rem 0;
    background: #f8fafc;
    margin: 0 -2rem;
    .section-title {
      padding: 0 2rem;
    }
    .demo-group {
      max-width: 1200px;
      margin: 0 auto 3rem auto;
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      .demo-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
      }
      .demo-content {
        display: grid;
        gap: 2rem;
      }
      .demo-item {
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        background: #fafafa;
        h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
      }
      .demo-buttons,
      .demo-inputs,
      .demo-cards,
      .demo-storage,
      .demo-theme,
      .demo-api,
      .demo-format,
      .demo-validate,
      .demo-utils {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
      }
      .demo-inputs {
        flex-direction: column;
        align-items: stretch;
        max-width: 400px;
      }
      .demo-storage,
      .demo-theme,
      .demo-api,
      .demo-format,
      .demo-validate,
      .demo-utils {
        flex-direction: column;
        align-items: stretch;
        max-width: 500px;
      }
      .demo-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.25rem;
      }
      .storage-result,
      .theme-info,
      .api-result,
      .format-result,
      .validate-result,
      .utils-result {
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: 0.375rem;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.875rem;
        width: 100%;
      }
      .storage-result,
      .theme-info,
      .format-result,
      .utils-result {
        background: #e0f2fe;
        color: #0369a1;
        border: 1px solid #bae6fd;
      }
      .api-result {
        background: #f0f9ff;
        color: #0c4a6e;
        border: 1px solid #bae6fd;
        max-height: 200px;
        overflow-y: auto;
        pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
      }
      .validate-result.valid {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
      }
      .validate-result.invalid {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }
    }
  }
  .stats-section {
    padding: 4rem 0;
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    .stat-item {
      text-align: center;
      .stat-number {
        font-size: 3rem;
        font-weight: bold;
        color: #4f46e5;
        margin-bottom: 0.5rem;
      }
      .stat-label {
        font-size: 1.125rem;
        color: #6b7280;
        font-weight: 500;
      }
    }
  }
}
@media (max-width: 768px) {
  .page-home {
    .hero-section {
      padding: 3rem 0;
      .hero-title {
        font-size: 2.5rem;
      }
      .hero-subtitle {
        font-size: 1.25rem;
      }
    }
    .section-title {
      font-size: 2rem;
    }
    .quickstart-section {
      .step {
        flex-direction: column;
        text-align: center;
        .step-number {
          margin: 0 auto 1rem auto;
        }
      }
    }
    .demo-section {
      .demo-group {
        padding: 1.25rem;
        margin-bottom: 2rem;
      }
      .demo-buttons,
      .demo-inputs,
      .demo-storage,
      .demo-theme,
      .demo-api,
      .demo-format,
      .demo-validate,
      .demo-utils {
        flex-direction: column;
        align-items: stretch;
      }
      .demo-cards {
        grid-template-columns: 1fr;
      }
    }
  }
}
:deep(.w-button) {
  margin: 0.25rem;
}
:deep(.w-input) {
  margin-bottom: 0.5rem;
}
:deep(.w-card) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  color: #1f2937 !important;
}
:deep(.w-card__title) {
  color: #1f2937 !important;
}
</style>