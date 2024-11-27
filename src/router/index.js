// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Home from '@/pages/Home.vue'

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/home',
    component: Home,
    meta: {
      requiresAuth: true, // Add this meta field
    },
  },
  {
    path: '/',
    redirect: '/home',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem('jwt')

    if (!token) {
      // Redirect to login if no token is found
      next('/login')
    } else {
      next() // Proceed to the requested route
    }
  } else {
    next() // Proceed if the route doesn't require authentication
  }
})

export default router
