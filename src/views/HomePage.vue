<template>
  <div class="d-flex">

    <!-- Sidebar -->
    <div class="sidebar bg-dark text-white p-3">
      <h4 class="mb-4">SGS</h4>

      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/home">🏠 Início</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/usuarios">👤 Usuários</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/pedidos">📦 Pedidos</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/estoque">📊 Estoque</router-link>
        </li>
      </ul>

      <button class="btn btn-danger mt-4 w-100" @click="logout">
        Sair
      </button>
    </div>

    <!-- Conteúdo -->
    <div class="content flex-grow-1 p-4">

      <!-- Topo -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <span class="text-muted">Bem-vindo 👋</span>
      </div>

      <!-- Cards -->
      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3">
            <h5>Usuários</h5>
            <h2>12</h2>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3">
            <h5>Pedidos</h5>
            <h2>8</h2>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3">
            <h5>Estoque</h5>
            <h2>25</h2>
          </div>
        </div>
      </div>

      <!-- Área futura -->
      <div class="card mt-4 p-4 shadow-sm">
        <h5>Atividade recente</h5>
        <p class="text-muted">Aqui você pode mostrar logs, pedidos recentes, etc...</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
}

.nav-link {
  border-radius: 6px;
}

.nav-link:hover {
  background-color: #495057;
}
</style>