<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 400px;">
      
      <h3 class="text-center mb-4">Login</h3>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="form-control" 
            placeholder="Digite seu email"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Senha</label>
          <input 
            v-model="senha" 
            type="password" 
            class="form-control" 
            placeholder="Digite sua senha"
            required
          >
        </div>

        <button type="submit" class="btn btn-primary w-100">
          Entrar
        </button>
      </form>

      <div v-if="erro" class="alert alert-danger mt-3 text-center">
        {{ erro }}
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      senha: '',
      erro: ''
    }
  },
  methods: {
    login() {
      // simulação por enquanto
      if (this.email === 'admin@admin.com' && this.senha === '123') {
        localStorage.setItem('token', 'fake-token')
        this.$router.push('/home')
      } else {
        this.erro = 'Email ou senha inválidos'
      }
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>