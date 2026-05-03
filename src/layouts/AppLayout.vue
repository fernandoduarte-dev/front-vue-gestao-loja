<template>
  <div>

    <!-- 🔵 HEADER -->
    <header class="app-header d-flex justify-content-between align-items-center">

      <div class="page-title">
        {{ titulo }}
      </div>

      <div class="d-flex align-items-center gap-3">

        <!-- 👤 USUÁRIO LOGADO -->
        <span class="user-name">
          Olá, {{ userName }}
        </span>

        <!-- AÇÕES -->
        <div class="page-actions d-flex gap-2">
          <slot name="actions"></slot>
        </div>

      </div>

    </header>

    <!-- 📄 CONTEÚDO -->
    <div class="container content-area mt-4">
      <slot />
    </div>

  </div>
</template>

<script>
import { computed } from "vue"
import { useUserStore } from "@/store/user"

export default {
  name: "AppLayout",
  props: {
    titulo: {
      type: String,
      default: ""
    }
  },

  setup() {
    const userStore = useUserStore()

    const userName = computed(() => {
      return userStore.usuario?.nome || "usuário"
    })

    return {
      userName
    }
  }
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;

  background: #5e3291;
  color: white;

  padding: 12px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  opacity: 0.9;
}

.content-area {
  padding-bottom: 40px;
}
</style>