<template>
  <div v-if="store.show" class="toast-container">
    <div :class="['toast-box', store.type]">
      {{ store.message }}
    </div>
  </div>
</template>

<script>
import { ToastStore } from "@/store/toast"

export default {
  name: "AppToast",
  setup() {
    const store = ToastStore
    return { store }
  }
}
</script>

<style>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast-box {
  padding: 12px 18px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.toast-box.success {
  background-color: #28a745;
}

.toast-box.error {
  background-color: #dc3545;
}
</style>