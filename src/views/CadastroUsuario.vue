<template>
  <div class="container mt-5">
    <h2>Cadastro de Usuário</h2>
    <form @submit.prevent="cadastrar">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="usuario.nome" type="text" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="usuario.email" type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Senha</label>
        <input v-model="usuario.senha" type="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Cadastrar</button>
    </form>

    <div v-if="mensagem" class="alert mt-3" 
         :class="{'alert-success': sucesso, 'alert-danger': !sucesso}">
      {{ mensagem }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      usuario: { nome: '', email: '', senha: '' },
      mensagem: '',
      sucesso: false
    }
  },
  methods: {
    async cadastrar() {
      try {
        await axios.post('http://localhost:8081/usuario', this.usuario)
        this.mensagem = 'Usuário cadastrado com sucesso!'
        this.sucesso = true
        this.usuario = { nome: '', email: '', senha: '' }
      } catch (e) {
        this.mensagem = 'Erro ao cadastrar usuário.'
        this.sucesso = false
      }
    }
  }
}
</script>