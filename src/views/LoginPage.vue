<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">

    <div class="row g-0 w-100 justify-content-center">

      <!-- CARD DA LOGO -->
      <div class="col-md-4 d-none d-md-flex">
        <div class="card shadow-lg p-4 w-100 d-flex justify-content-center align-items-center">
          <img src="../assets/logo-tres.png" class="logo-big" />
        </div>
      </div>

      <!-- CARD DO LOGIN -->
      <div class="col-md-4">
        <div class="card shadow-lg p-4 bg-custom text-white">
  


          <h3 class="text-center mb-4">Acesso ao Sistema</h3>

          <form @submit.prevent="login">

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control custom-input" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Senha</label>
              <input v-model="senha" type="password" class="form-control custom-input" required>
            </div>

            <button class="btn custom-btn w-100" type="submit">
                Entrar
            </button>

          </form>

          <div v-if="erro" class="alert alert-danger mt-3 text-center">
            {{ erro }}
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import LoadingStore from '@/store/loading';

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
    async login() {
   
    LoadingStore.show()

      try {
        await new Promise(resolve => setTimeout(resolve, 2000)) // simula atraso
        
        const res = await axios.post("http://localhost:8081/usuario/login", {
          email: this.email,
          senha: this.senha
        })

        const token = res.data.token || res.data

        localStorage.setItem("token", token)

        this.$router.push("/home")

      } catch (error) {
        this.erro = "Email ou senha inválidos"
      } finally {
        LoadingStore.hide() // 👈 adiciona isso
  }
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}

.logo-big {
  width: 90%;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.custom-input {
  background-color: #5e3291; /* mesma cor do card */
  color: #ffffff;
  border: 1px solid #ffffff;
}

/* texto digitado */
.custom-input:focus {
  background-color: #2c3e50;
  color: #ffffff;
  border-color: #5dade2;
  box-shadow: none;
}

/* placeholder branco mais suave */
.custom-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.custom-btn {
  background-color: #41d1d3;
  color: white;
  border: none;
}

.custom-btn:hover {
  background-color: #4d9193;
}

.bg-custom {
  background-color: #5e3291; /* roxo personalizado */
}



</style>