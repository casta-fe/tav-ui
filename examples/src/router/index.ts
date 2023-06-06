import { createRouter, createWebHashHistory } from 'vue-router'
import Test from '../components/Test.vue'
import Home from '../components/Home.vue'
import TableProSingleHeader from '../components/TablePro/single-header'
import TableProMultiHeader from '../components/TablePro/multi-header'
import TestDemo from '../components/TablePro/test-demo.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/table-pro-single-header',
    name: 'TableProSingleHeader',
    component: TableProSingleHeader,
  },
  {
    path: '/table-pro-multi-header',
    name: 'TableProMultiHeader',
    component: TableProMultiHeader,
  },
  {
    path: '/test-demo',
    name: 'TestDemo',
    component: TestDemo,
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
