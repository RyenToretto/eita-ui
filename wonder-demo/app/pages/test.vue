<template>
  <div class="page-test">
    <div class="test-container">
      <h1>Wonder-Lib 功能测试</h1>
      
      <!-- 测试 Composables -->
      <section class="test-section">
        <h2>Composables 测试</h2>
        
        <!-- useStorage 测试 -->
        <div class="test-item">
          <h3>useStorage 测试</h3>
          <div class="test-controls">
            <input v-model="storageValue" placeholder="输入要存储的值" />
            <button @click="saveToStorage">保存到 LocalStorage</button>
            <button @click="loadFromStorage">从 LocalStorage 加载</button>
            <p>当前值: {{ localStorageValue }}</p>
          </div>
        </div>

        <!-- useApi 测试 -->
        <div class="test-item">
          <h3>useApi 测试</h3>
          <div class="test-controls">
            <button @click="testApiGet">测试 GET 请求</button>
            <button @click="testApiPost">测试 POST 请求</button>
            <p>API 状态: {{ apiStatus }}</p>
            <pre v-if="apiResult">{{ JSON.stringify(apiResult, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <!-- 测试 Utils -->
      <section class="test-section">
        <h2>Utils 测试</h2>
        
        <!-- 格式化工具测试 -->
        <div class="test-item">
          <h3>格式化工具测试</h3>
          <div class="test-controls">
            <p>日期格式化: {{ formattedDate }}</p>
            <p>数字格式化: {{ formattedNumber }}</p>
            <p>文本格式化: {{ formattedText }}</p>
          </div>
        </div>

        <!-- 验证工具测试 -->
        <div class="test-item">
          <h3>验证工具测试</h3>
          <div class="test-controls">
            <input v-model="emailTest" placeholder="输入邮箱测试" />
            <p>邮箱验证结果: {{ emailValidation }}</p>
            <input v-model="phoneTest" placeholder="输入手机号测试" />
            <p>手机号验证结果: {{ phoneValidation }}</p>
          </div>
        </div>

        <!-- 工具函数测试 -->
        <div class="test-item">
          <h3>工具函数测试</h3>
          <div class="test-controls">
            <button @click="testDebounce">测试防抖函数</button>
            <button @click="testThrottle">测试节流函数</button>
            <p>防抖计数: {{ debounceCount }}</p>
            <p>节流计数: {{ throttleCount }}</p>
          </div>
        </div>
      </section>

      <!-- 测试组件路径 -->
      <section class="test-section">
        <h2>组件路径测试</h2>
        <div class="test-item">
          <h3>可用组件</h3>
          <ul>
            <li v-for="name in componentNames" :key="name">
              {{ name }}: {{ componentPaths[name] }}
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  useLocalStorage, 
  useApi, 
  format, 
  validate, 
  debounce, 
  throttle,
  componentNames,
  componentPaths
} from 'wonder-lib'

// Storage 测试
const storageValue = ref('')
const { value: localStorageValue, set: setLocalStorage, get: getLocalStorage } = useLocalStorage('test-key', '')

const saveToStorage = () => {
  setLocalStorage(storageValue.value)
}

const loadFromStorage = () => {
  storageValue.value = getLocalStorage()
}

// API 测试
const { get, post } = useApi()
const apiStatus = ref('未测试')
const apiResult = ref(null)

const testApiGet = async () => {
  try {
    apiStatus.value = '请求中...'
    const result = await get('https://jsonplaceholder.typicode.com/posts/1')
    apiResult.value = result
    apiStatus.value = '成功'
  } catch (error) {
    apiStatus.value = '失败: ' + error.message
  }
}

const testApiPost = async () => {
  try {
    apiStatus.value = '请求中...'
    const result = await post('https://jsonplaceholder.typicode.com/posts', {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    })
    apiResult.value = result
    apiStatus.value = '成功'
  } catch (error) {
    apiStatus.value = '失败: ' + error.message
  }
}

// 格式化测试
const formattedDate = computed(() => {
  return format.date(new Date(), 'YYYY-MM-DD HH:mm:ss')
})

const formattedNumber = computed(() => {
  return format.number(1234567.89, { decimals: 2, separator: ',' })
})

const formattedText = computed(() => {
  return format.text('hello world', 'capitalize')
})

// 验证测试
const emailTest = ref('')
const phoneTest = ref('')

const emailValidation = computed(() => {
  return emailTest.value ? validate.email(emailTest.value) : '未输入'
})

const phoneValidation = computed(() => {
  return phoneTest.value ? validate.phone(phoneTest.value) : '未输入'
})

// 工具函数测试
const debounceCount = ref(0)
const throttleCount = ref(0)

const debouncedIncrement = debounce(() => {
  debounceCount.value++
}, 500)

const throttledIncrement = throttle(() => {
  throttleCount.value++
}, 500)

const testDebounce = () => {
  debouncedIncrement()
}

const testThrottle = () => {
  throttledIncrement()
}
</script>

<style lang="scss">
.page-test {
  .test-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    
    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 2rem;
      text-align: center;
      color: #1f2937;
    }
  }

  .test-section {
    margin-bottom: 3rem;
    padding: 2rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #374151;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 0.5rem;
    }
  }

  .test-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    
    h3 {
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 1rem;
      color: #4b5563;
    }
  }

  .test-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    
    input {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
    
    button {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background: #2563eb;
      }
      
      &:active {
        background: #1d4ed8;
      }
    }
    
    p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    pre {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      overflow-x: auto;
      margin: 0;
    }
    
    ul {
      margin: 0;
      padding-left: 1.5rem;
      
      li {
        font-size: 0.875rem;
        color: #4b5563;
        margin-bottom: 0.25rem;
      }
    }
  }
}
</style>