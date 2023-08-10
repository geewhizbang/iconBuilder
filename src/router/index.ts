import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/',
      name: 'colorPicker',
      component: () => import('../views/ColorPicker.vue')
    },
    {
      path: '/svgScaler',
      name: 'svgScaler',
      component: () => import('../views/SvgRescale.vue')
    },
    // {
    //   path: '/colorWheel',
    //   name: 'colorWheel',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/ColorWheel.vue')
    // }
  ]
})

export default router
