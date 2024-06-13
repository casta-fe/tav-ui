import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../components/Test.vue'),
  },
  {
    path: '/table-pro-single-header',
    name: 'TableProSingleHeader',
    component: () => import('../components/TablePro/single-header'),
  },
  {
    path: '/table-pro-multi-header',
    name: 'TableProMultiHeader',
    component: () => import('../components/TablePro/multi-header'),
  },
  {
    path: '/table-pro-company-list',
    name: 'TableProCompanyList',
    component: () => import('../components/TablePro/company-list.vue'),
  },
  {
    path: '/test-demo',
    name: 'TestDemo',
    component: () => import('../components/TablePro/test-demo.vue'),
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../components/TaUpload/index.vue'),
  },
  {
    path: '/form',
    name: 'Form',
    component: () => import('../components/Form/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
