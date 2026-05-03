<template>
  <AppLayout titulo="Cadastro de Cliente">

    <div class="container-fluid">
      <div class="card shadow-sm p-4 w-100">

        <h5 class="mb-3 text-center">Novo Cliente</h5>

        <form @submit.prevent="cadastrar">

          <!-- NOME -->
          <div class="mb-3">
            <label class="form-label">Nome</label>
            <input v-model="cliente.nome" type="text" class="form-control" required>
          </div>

          <!-- CPF -->
          <div class="mb-3">
            <label class="form-label">CPF</label>
            <input v-model="cliente.cpf" type="text" class="form-control" required>
          </div>

          <!-- ENDEREÇO -->
          <div class="row">
            <div class="col-md-8 mb-3">
              <label class="form-label">Rua</label>
              <input v-model="cliente.rua" type="text" class="form-control" required>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Número</label>
              <input v-model="cliente.numero" type="number" class="form-control" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Complemento</label>
            <input v-model="cliente.complemento" type="text" class="form-control">
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Cidade</label>
              <input v-model="cliente.cidade" type="text" class="form-control" required>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Estado</label>
              <input v-model="cliente.estado" type="text" class="form-control" required>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">CEP</label>
              <input v-model="cliente.cep" type="text" class="form-control" required>
            </div>
          </div>

          <!-- EMAIL -->
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="cliente.email" type="email" class="form-control" required>
          </div>

          <!-- TELEFONES -->
          <div class="mb-3">
            <label class="form-label">Telefones</label>
            <div v-for="(tel, index) in cliente.telefones" :key="index" class="d-flex mb-2 gap-2">
              <input v-model="tel.ddd" type="text" class="form-control flex-grow-0" style="width:80px" placeholder="DDD" required>
              <input v-model="tel.numero" type="text" class="form-control flex-grow-1" placeholder="Número" required>
              <button type="button" class="btn btn-danger" @click="removerTelefone(index)">X</button>
            </div>
            <button type="button" class="btn btn-secondary mt-2" @click="adicionarTelefone">+ Adicionar Telefone</button>
          </div>

          <!-- BOTÕES -->
          <div class="d-flex justify-content-between mt-4">
            <router-link to="/clientes" class="btn btn-secondary">Voltar</router-link>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
          </div>
        </form>

        <!-- ALERTA -->
        <div v-if="mensagem" class="alert mt-3" :class="sucesso ? 'alert-success' : 'alert-danger'">
          {{ mensagem }}
        </div>

      </div>
    </div>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import api from "@/services/api"
import LoadingStore from "@/store/loading"

export default {
  name: "CadastroCliente",
  components: { AppLayout },

  data() {
    return {
      cliente: {
        nome: '',
        cpf: '',
        rua: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: '',
        cep: '',
        email: '',
        telefones: [{ ddd: '', numero: '' }]
      },
      mensagem: '',
      sucesso: false
    }
  },

  methods: {

    adicionarTelefone() {
      this.cliente.telefones.push({ ddd: '', numero: '' })
    },

    removerTelefone(index) {
      this.cliente.telefones.splice(index, 1)
    },

    async cadastrar() {
      LoadingStore.show()

      try {
        await api.post("/cliente", this.cliente)

        this.mensagem = "Cliente cadastrado com sucesso!"
        this.sucesso = true

        // limpa o formulário
        this.cliente = {
          nome: "",
          cpf: "",
          rua: "",
          numero: "",
          complemento: "",
          cidade: "",
          estado: "",
          cep: "",
          email: "",
          telefones: [{ ddd: "", numero: "" }]
        }

      } catch (error) {
        console.error(error)
        this.mensagem = "Erro ao cadastrar cliente."
        this.sucesso = false

      } finally {
        LoadingStore.hide()
      }
    }

  }
}
</script>
