<template>
  <AppLayout titulo="Gerador de Etiquetas">

    <!-- 🔍 FILTRO -->
    <div class="container mb-4">

      <div class="row justify-content-center mb-3">
        <div class="col-md-3">
          <input
            v-model="filtro.produtoId"
            class="form-control text-center"
            placeholder="Código Produto"
          />
        </div>
      </div>

      <div class="d-flex justify-content-center gap-2">
        <button class="btn btn-primary" @click="consultar">
          Consultar
        </button>

        <button class="btn btn-success" @click="imprimirSelecionados">
          Imprimir Selecionados
        </button>
      </div>

    </div>

    <!-- 📋 TABELA -->
    <div v-if="etiquetas.length" class="container">

      <table class="table table-striped text-center align-middle">

        <thead>
          <tr>
            <th></th>
            <th>Código</th>
            <th>Produto</th>
            <th>SKU</th>
            <th>Tamanho</th>
            <th>Data Registro</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(e, index) in etiquetas" :key="index">

            <td>
              <input type="checkbox" v-model="selecionados" :value="e" />
            </td>

            <td>{{ e.produtoId }}</td>
            <td>{{ e.produtoNome }}</td>
            <td class="fw-bold">{{ e.sku }}</td>
            <td>{{ e.tamanho }}</td>

            <td>{{ formatarData(e.data) }}</td>

            <td>
              <span :class="e.disponivel ? 'text-success fw-bold' : 'text-danger fw-bold'">
                {{ e.disponivel ? 'Disponível' : 'Indisponível' }}
              </span>
            </td>

            <td>
              <button class="btn btn-sm btn-dark" @click="gerarEtiqueta(e)">
                Gerar Etiqueta
              </button>
            </td>

          </tr>
        </tbody>

      </table>

    </div>

    <!-- 🔍 SEM RESULTADO -->
    <p v-else-if="carregado" class="text-center text-muted">
      Nenhum SKU encontrado
    </p>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import axios from "axios"
import LoadingStore from "@/store/loading"
import { ToastStore } from "@/store/toast"
import JsBarcode from "jsbarcode"

export default {
  name: "EtiquetaPage",
  components: { AppLayout },

  data() {
    return {
      etiquetas: [],
      selecionados: [],
      carregado: false,

      filtro: {
        produtoId: ""
      }
    }
  },

  methods: {

    async consultar() {
      if (!this.filtro.produtoId) {
        ToastStore.open("Informe o código do produto", "warning")
        return
      }

      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        const { data } = await axios.get(
          "http://localhost:8081/etiquetas",
          {
            params: { produtoId: this.filtro.produtoId },
            headers: { Authorization: token }
          }
        )

        // 🔥 ORDENA POR MAIS RECENTE
        this.etiquetas = data.sort(
          (a, b) => new Date(b.data) - new Date(a.data)
        )

        this.carregado = true

      } catch (error) {
        console.error(error)
        ToastStore.open("Erro ao buscar etiquetas", "error")
        this.etiquetas = []
        this.carregado = true

      } finally {
        LoadingStore.hide()
      }
    },

    formatarData(data) {
      if (!data) return "-"
      return new Date(data).toLocaleString("pt-BR")
    },

    // 🔥 ETIQUETA INDIVIDUAL
    gerarEtiqueta(item) {

      const janela = window.open("", "", "width=400,height=300")

      if (!janela) {
        ToastStore.open("Bloqueador de pop-up ativo!", "warning")
        return
      }

      const html = `
        <html>
          <head>
            <title>Etiqueta</title>
            <style>
              body {
                font-family: Arial;
                text-align: center;
                margin-top: 10px;
              }
              svg {
                margin-top: 5px;
              }
            </style>
          </head>
          <body>
            <h4>${item.produtoNome}</h4>
            <p>SKU: ${item.sku}</p>
            <p>Tam: ${item.tamanho}</p>

            <svg id="barcode"></svg>

            <p style="font-size:11px;">
              ${new Date(item.data).toLocaleDateString("pt-BR")}
            </p>
          </body>
        </html>
      `

      janela.document.open()
      janela.document.write(html)
      janela.document.close()

      setTimeout(() => {
        const svg = janela.document.getElementById("barcode")

        JsBarcode(svg, item.sku, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: true
        })

        janela.focus()

        setTimeout(() => {
          janela.print()
          janela.close()
        }, 500)

      }, 300)
    },

    // 🔥 IMPRESSÃO EM LOTE (COLACRIL)
    imprimirSelecionados() {

      if (!this.selecionados.length) {
        ToastStore.open("Selecione pelo menos um item", "warning")
        return
      }

      const janela = window.open("", "", "width=900,height=700")

      if (!janela) {
        ToastStore.open("Bloqueador de pop-up ativo!", "warning")
        return
      }

      const etiquetasHTML = this.selecionados.map(item => `
        <div class="etiqueta">
          <div class="nome">${item.produtoNome}</div>
          <div class="sku">${item.sku}</div>
          <div class="tam">Tam: ${item.tamanho}</div>
          <div class="data">
            ${new Date(item.data).toLocaleDateString("pt-BR")}
          </div>
          <svg id="barcode-${item.sku}"></svg>
        </div>
      `).join("")

      const html = `
        <html>
          <head>
            <style>
              @page {
                size: A4;
                margin: 5mm;
              }

              body {
                margin: 0;
                font-family: Arial;
              }

              .grid {
                display: grid;
                grid-template-columns: repeat(3, 63.5mm);
                grid-auto-rows: 25.4mm;
                gap: 2mm;
                justify-content: center;
              }

              .etiqueta {
                width: 63.5mm;
                height: 25.4mm;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 8px;
                text-align: center;
              }

              .nome {
                font-weight: bold;
                font-size: 9px;
              }

              .data {
                font-size: 7px;
              }

              svg {
                width: 100%;
                height: 12mm;
              }
            </style>
          </head>

          <body>
            <div class="grid">
              ${etiquetasHTML}
            </div>
          </body>
        </html>
      `

      janela.document.open()
      janela.document.write(html)
      janela.document.close()

      setTimeout(() => {

        this.selecionados.forEach(item => {
          const svg = janela.document.getElementById(`barcode-${item.sku}`)

          JsBarcode(svg, item.sku, {
            format: "CODE128",
            width: 1.2,
            height: 40,
            displayValue: false
          })
        })

        janela.focus()

        setTimeout(() => {
          janela.print()
          janela.close()
        }, 500)

      }, 300)
    }

  }
}
</script>