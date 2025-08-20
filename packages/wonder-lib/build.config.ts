import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/nuxt'
  ],
  declaration: false,
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  externals: [
    'vue',
    'nuxt/schema',
    'nuxt/kit',
    '@nuxt/kit',
    '@nuxt/schema',
    'nuxt',
    '#app',
    '#imports',
    '@vueuse/core'
  ]
})