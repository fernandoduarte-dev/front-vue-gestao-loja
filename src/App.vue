<template>
  <div id="app">

    <!-- LOADING GLOBAL -->
    <div v-if="loading" class="loading-overlay">
      <img src="/emblema-icon.png" class="loading-logo" />
    </div>

    <!-- ROTAS -->
    <router-view />

    <!-- TOAST GLOBAL -->
    <AppToast />

  </div>
</template>

<script>
import { onMounted, computed } from "vue"
import { useUserStore } from "@/store/user"
import LoadingStore from "@/store/loading"
import AppToast from "@/components/AppToast.vue"

export default {
  components: {
    AppToast
  },

  setup() {
    const userStore = useUserStore()

    const loading = computed(() => LoadingStore.loading)

    onMounted(async () => {
      const token = localStorage.getItem("token")

      if (token) {
        await userStore.carregarUsuario()
      }
    })

    return {
      loading
    }
  }
}
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-logo {
  width: 90px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>