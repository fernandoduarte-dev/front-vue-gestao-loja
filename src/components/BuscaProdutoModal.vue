<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- HEADER -->
        <div class="modal-header">
          <h5 class="modal-title">Buscar Produto</h5>
          <button class="btn-close" @click="fechar"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body">

          <input
            v-model="busca"
            class="form-control mb-2"
            placeholder="Digite o nome do produto"
          />

          <button class="btn btn-primary w-100 mb-3" @click="buscar">
            Buscar
          </button>

          <ul class="list-group">
            <li
              v-for="p in produtos"
              :key="p.id"
              class="list-group-item list-group-item-action"
              @click="selecionar(p)"
              style="cursor: pointer"
            >
              {{ p.nome }} - {{ p.cor }} - {{ p.tecido }}
            </li>
          </ul>

          <p v-if="carregado && produtos.length === 0" class="text-center text-muted mt-2">
            Nenhum produto encontrado
          </p>

        </div>

      </div>
    </div>
  </div>

  <!-- BACKDROP -->
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script>
import axios from "axios"
import LoadingStore from "@/store/loading"

export default {
  name: "BuscaProdutoModal",

  props: {
    show: Boolean
  },

  data() {
    return {
      busca: "",
      produtos: [],
      carregado: false
    }
  },

  methods: {
    async buscar() {
      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("http://localhost:8081/produto/buscar", {
          params: { nome: this.busca },
          headers: { Authorization: token }
        })

        this.produtos = res.data
        this.carregado = true

      } catch (error) {
        console.error("Erro ao buscar produtos", error)
        this.carregado = false

      } finally {
        LoadingStore.hide()
      }
    },

    selecionar(produto) {
      this.$emit("selecionado", produto)
      this.fechar()
    },

    fechar() {
      this.$emit("fechar")
      this.busca = ""
      this.produtos = []
      this.carregado = false
    }
  }
}
</script>