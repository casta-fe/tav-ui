<script setup lang="ts">
import { ref } from 'vue'
import {
  TaPermissionDataQuery,
  TaPermissionQuery,
  TaPermissions,
} from '@tav-ui/components/permission'

const permissionQueryRef = ref()
const permissionQueryApiParams = ref({
  code: 'PERMISSION_DEMO',
  // "subCodes": []
})

const permissionDataQueryRef = ref()
const permissionDataQueryApiParams = ref({
  code: 'PERMISSION_DEMO:DATA_TABLE:ACTION_DETAIL',
  // "subCodes": [],
  resource: `/demo/load/88933`,
  body: {
    filter: {},
    model: {},
  },
  recordkeyName: 'id',
})

function handleApiSuccess(...args: any) {
  console.log('🚀 ~ handleApiSuccess ~ args:', args)
}

setTimeout(() => {
  console.log('🚀 ~ setTimeout ~ refs:', permissionQueryRef, permissionDataQueryRef)
  // permissionQueryApiParams.value = { ...permissionQueryApiParams.value, code: 'ccc' }

  setTimeout(() => {
    permissionQueryRef.value?.reload?.()
    permissionDataQueryRef.value?.reload?.()
  }, 16.7 * 200)
}, 16.7 * 100)
</script>

<template>
  <TaPermissions ref="permissionsRef">
    <section class="page-permission">
      <header>page-permission header</header>
      <TaPermissionQuery ref="permissionQueryRef" :api-params="permissionQueryApiParams">
        <section>
          <div>page-permission content</div>
          <TaPermissionDataQuery
            ref="permissionDataQueryRef"
            :api-params="permissionDataQueryApiParams"
            @api-success="handleApiSuccess"
          >
            page-permission content data
          </TaPermissionDataQuery>
        </section>
      </TaPermissionQuery>
    </section>
  </TaPermissions>
</template>
