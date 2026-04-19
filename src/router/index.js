import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/LoginPage.vue'
import Home from '../views/HomePage.vue'
import Usuarios from '../views/UsuariosPage.vue'
import CadastroUsuario from '../views/CadastroUsuario.vue'
import Clientes from '../views/Clientes.vue'
import CadastroCliente from '../views/CadastroCliente.vue'
import ProdutosPage from '../views/ProdutosPage.vue'
import CadastroProduto from '../views/CadastroProduto.vue'
import EstoquePage from '@/views/EstoquePage.vue'
import HistoricoEstoquePage from '@/views/HistoricoEstoquePage.vue'
import SaidaItensPage from '../views/SaidaItensPage.vue'
import EstoqueEntrada from '@/views/EstoqueEntrada.vue'



const routes = [
  { path: '/', component: Login },

  { path: '/home', component: Home, meta: { requiresAuth: true } },

  { path: '/usuarios', component: Usuarios, meta: { requiresAuth: true } },

  { path: '/usuarios/novo', component: CadastroUsuario, meta: { requiresAuth: true } },

  { path: '/clientes', component: Clientes, meta: { requiresAuth: true } },

  { path: '/clientes/novo', component: CadastroCliente, meta:{ requiresAuth: true } },

  { path: '/produtos', component: ProdutosPage, meta: { requiresAuth: true } },

  { path: '/produtos/novo', component: CadastroProduto, meta: { requiresAuth: true }},

  { path: '/estoque', component: EstoquePage, meta: { requiresAuth: true }},

  { path: '/estoque/entrada', component: EstoqueEntrada, meta: { requiresAuth: true }},

  { path: '/estoque/movimento/historico', component: HistoricoEstoquePage, meta: { requiresAuth: true }},

  { path: '/estoque/saida-itens', component: SaidaItensPage, meta: { requiresAuth: true }}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 GUARD (DEPOIS de criar router)
router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')
  } else {
    next()
  }

})

export default router