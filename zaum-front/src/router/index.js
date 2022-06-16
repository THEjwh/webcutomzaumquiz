import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LobbyView from '../views/LobbyView.vue'
import gameView from '../views/gameView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/home',
    redirect: {name:'home'}
  },
  {
    path: '/lobby/:by',
    name: 'lobby',
    component: LobbyView,
  },
  {
    path: '/game/:by',
    name: 'game',
    component: gameView,
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
