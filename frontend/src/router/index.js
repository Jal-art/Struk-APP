import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Dashboard from '../views/Dashboard.vue'
import NewReceipt from '../views/NewReceipt.vue'
import ReceiptDetail from '../views/ReceiptDetail.vue'
import Settings from '../views/Settings.vue'
import Trash from '../views/Trash.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/new',
    name: 'new',
    component: NewReceipt,
    meta: { requiresAuth: true }
  },
  {
    path: '/receipt/:id',
    name: 'receipt',
    component: ReceiptDetail,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/trash',
    name: 'trash',
    component: Trash,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

