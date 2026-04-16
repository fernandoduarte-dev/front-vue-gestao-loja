import { reactive } from 'vue'

const LoadingStore = reactive({
  loading: false,

  show() {
    this.loading = true
  },

  hide() {
    this.loading = false
  }
})

export default LoadingStore
