import Vue from 'vue'
import Router from 'vue-router'

import AuthLayout from '@/layout/AuthLayout'
import ContainerLayout from '@/layout/ContainerLayout'

Vue.use(Router)

export const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  routes: [
    {
      path: '/:companyId/',
      component: ContainerLayout,
      children: [
        {
          path: '',
          name: 'Home',
          meta: { requireAuth: false },
          component: () => import(/* webpackChunkName: "demo" */ '@/components/Home.vue')
        },
        {
          path: 'recursos',
          name: 'Resources',
          meta: { requireAuth: false },
          component: () => import(/* webpackChunkName: "demo" */ '@/components/Resource.vue')
        }
      ]
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import(/* webpackChunkName: "demo" */ '@/views/pages/Login.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const authRequired = to.matched.some(record => record.meta.requireAuth)
  const isAuthenticated = Vue.prototype.$session.exists('user')
  if (authRequired && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})
