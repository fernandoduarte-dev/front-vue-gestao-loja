<template>
  <div class="d-flex">

    <!-- Sidebar -->
    <div class="sidebar bg-custom text-white p-3">
      
      <div class="text-center mb-4">
        <img src="../assets/logo-branca.png" class="sidebar-logo mb-2" />
          
      </div>

      <ul class="nav flex-column">
        <ul class="nav flex-column">
  <li class="nav-item mb-2">
    <router-link class="nav-link text-white" to="/home">Início</router-link>
  </li>

  <li class="nav-item mb-2">
    <a class="nav-link text-white" href="#" @click.prevent="abrirNovaAba('/usuarios')">Usuário</a>
  </li>

  <li class="nav-item mb-2">
    <a class="nav-link text-white" href="#" @click.prevent="abrirNovaAba('/pedidos')">Pedido</a>
  </li>

  <li class="nav-item mb-2">
    <a class="nav-link text-white" href="#" @click.prevent="abrirNovaAba('/estoque')">Estoque</a>
  </li>

  <li class="nav-item mb-2">
    <a class="nav-link text-white" href="#" @click.prevent="abrirNovaAba('/clientes')">Cliente</a>
  </li>

  <li class="nav-item mb-2">
    <a class="nav-link text-white" href="#" @click.prevent="abrirNovaAba('/produtos')">Produto</a>
  </li>
  
</ul>
        
      </ul>

      
    </div>

    <!-- Conteúdo -->
    <div class="content flex-grow-1 p-4">

      <!-- Topo -->
      <div class="d-flex justify-content-between align-items-center mb-4">

 


  <div class="d-flex align-items-center gap-2">

    <span class="text-muted">
      Olá, usuário 👋
    </span>

    <button class="btn btn-outline-danger btn-sm" @click="logout">
      Sair
    </button>

  </div>

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
    },

    abrirNovaAba(path) {
      const route = this.$router.resolve(path)
      window.open(route.href, '_blank')
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
  background-color: #000000;
}

.sidebar-logo {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.bg-custom {
  background-color: #5e3291; 
}

</style>