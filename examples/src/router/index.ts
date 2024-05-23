import { createRouter, createWebHashHistory } from 'vue-router'
import TableProSingleHeader from '../components/TablePro/single-header'
import TableProMultiHeader from '../components/TablePro/multi-header'
import TestDemo from '../components/TablePro/test-demo.vue'
import MultiSelect from '../components/Form/multi-select.vue'
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
  {
    path: '/multi-select',
    name: 'MultiSelect',
    component: MultiSelect,
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
