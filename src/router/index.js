import { createRouter, createWebHistory } from 'vue-router'

/* Views */
import Login from '@/views/LoginPage.vue'
import Home from '@/views/HomePage.vue'
import Usuarios from '@/views/UsuariosPage.vue'
import CadastroUsuario from '@/views/CadastroUsuario.vue'
import Clientes from '@/views/Clientes.vue'
import CadastroCliente from '@/views/CadastroCliente.vue'
import ProdutosPage from '@/views/ProdutosPage.vue'
import CadastroProduto from '@/views/CadastroProduto.vue'
import EstoquePage from '@/views/EstoquePage.vue'
import HistoricoEstoquePage from '@/views/HistoricoEstoquePage.vue'
import SaidaItensPage from '@/views/SaidaItensPage.vue'
import EstoqueEntrada from '@/views/EstoqueEntrada.vue'
import EtiquetaPage from '@/views/EtiquetaPage.vue'
import PedidosPage from '@/views/PedidosPage.vue'
import CadastroPedido from '@/views/CadastroPedido.vue'
import ReservaPage from '@/views/ReservaPage.vue'

const routes = [
  
  {
    path: '/',
    component: Login,
    meta: { title: 'SGS - 1.0.0.1' }
  },

  
  {
    path: '/home',
    component: Home,
    meta: { title: 'SGS', requiresAuth: true }
  },

  
  {
    path: '/usuarios',
    component: Usuarios,
    meta: { title: 'Usuário', requiresAuth: true }
  },
  {
    path: '/usuarios/novo',
    component: CadastroUsuario,
    meta: { title: 'Novo Usuário', requiresAuth: true }
  },

 
  {
    path: '/clientes',
    component: Clientes,
    meta: { title: 'Cliente', requiresAuth: true }
  },
  {
    path: '/clientes/novo',
    component: CadastroCliente,
    meta: { title: 'Novo Cliente', requiresAuth: true }
  },

  
  {
    path: '/produtos',
    component: ProdutosPage,
    meta: { title: 'Produto', requiresAuth: true }
  },
  {
    path: '/produtos/novo',
    component: CadastroProduto,
    meta: { title: 'Novo Produto', requiresAuth: true }
  },

  
  {
    path: '/estoque',
    component: EstoquePage,
    meta: { title: 'Estoque', requiresAuth: true }
  },
  {
    path: '/estoque/entrada',
    component: EstoqueEntrada,
    meta: { title: 'Entrada de Estoque', requiresAuth: true }
  },
  {
    path: '/estoque/movimento/historico',
    component: HistoricoEstoquePage,
    meta: { title: 'Histórico de Estoque', requiresAuth: true }
  },
  {
    path: '/estoque/saida-itens',
    component: SaidaItensPage,
    meta: { title: 'Saída de Itens', requiresAuth: true }
  },

  
  {
    path: '/etiqueta',
    component: EtiquetaPage,
    meta: { title: 'Etiqueta', requiresAuth: true }
  },

  
  {
    path: '/pedido',
    component: PedidosPage,
    meta: { title: 'Pedido', requiresAuth: true }
  },
  {
    path: '/pedido/novo',
    component: CadastroPedido,
    meta: { title: 'Novo Pedido', requiresAuth: true }
  },
  {
    path: '/pedido/:id',
    component: PedidosPage,
    meta: { title: 'Detalhe do Pedido', requiresAuth: true }
  },

  
  {
    path: '/reserva',
    component: ReservaPage,
    meta: { title: 'Reserva', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* 🔐 GLOBAL GUARD */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 📄 Title automático
  document.title = to.meta.title || 'Sistema'

  // 🔐 Auth check
  if (to.meta.requiresAuth && !token) {
    return next('/')
  }

  next()
})

export default router