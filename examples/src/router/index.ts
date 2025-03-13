import { createRouter, createWebHashHistory } from 'vue-router'
// import TableProSingleHeader from '../components/TablePro/single-header'
// import TableProMultiHeader from '../components/TablePro/multi-header'
// import TestDemo from '../components/TablePro/test-demo.vue'
// import MultiSelect from '../components/Form/multi-select.vue'
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
    path: '/table-pro-export',
    name: 'TableProExport',
    component: () => import('../components/TablePro/testTree'),
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
  {
    path: '/multi-select',
    name: 'MultiSelect',
    component: () => import('../components/Form/multi-select.vue'),
  },
  {
    path: '/file',
    name: 'File',
    component: () => import('../components/File/index.vue'),
  },
  {
    path: '/file-type-select',
    name: 'FileTypeSelect',
    component: () => import('../components/File/type-select.vue'),
  },
  {
    path: '/file-upload',
    name: 'FileUpload',
    component: () => import('../components/File/upload.vue'),
  },
  {
    path: '/file-normal-upload',
    name: 'FileNormalUpload',
    component: () => import('../components/File/normal-upload.vue'),
  },
  {
    path: '/file-table',
    name: 'FileTable',
    component: () => import('../components/File/table.vue'),
  },
  {
    path: '/file-cards',
    name: 'FileCards',
    component: () => import('../components/File/cards.vue'),
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../components/Editor/index.vue'),
  },
  {
    path: '/editor-form',
    name: 'EditorForm',
    component: () => import('../components/Editor/form.vue'),
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import('../components/Tree/index.vue'),
  },
  {
    path: '/permission',
    name: 'permission',
    component: () => import('../components/Permission/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
