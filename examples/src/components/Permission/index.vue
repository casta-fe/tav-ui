<script setup lang="ts">
import { ref } from 'vue'
import {
  TaPermissionQuery,
  TaPermissions,
  TaTablePermissionDataQuery,
} from '@tav-ui/components/permission'

const permissionQueryApiParams = ref({
  code: 'PERMISSION_TEST_1',
  // "subCodes": []
})

const tablePermissionDataQueryApiParams = ref({
  code: 'PERMISSION_DATA_FILTER_111',
  // "subCodes": [],
  // url: null,
  body: {
    filter: {},
    model: {},
  },
  recordkeyName: 'id',
})

const permissionsRef = ref()
const permissionQueryRef1 = ref()
const permissionQueryRef2 = ref()
const permissionQueryRef3 = ref()
const tablePermissionDataQueryRef = ref()
const tableElRef = ref()

setTimeout(() => {
  console.log(
    '🚀 ~ setTimeout ~ refs:',
    permissionsRef,
    // permissionQueryRef1,
    // permissionQueryRef2,
    // permissionQueryRef3,
    tablePermissionDataQueryRef
  )

  setTimeout(() => {
    console.log('🚀 ~ setTimeout ~ setTimeout:', tableElRef)
  }, 1000)
}, 16.7 * 100)
</script>

<template>
  <TaPermissions ref="permissionsRef">
    <section class="page-permission">
      <header>page-permission header</header>
      <TaPermissionQuery
        ref="permissionQueryRef1"
        :api-params="{ ...permissionQueryApiParams, code: 'section1' }"
      >
        <section>
          page-permission content
          <TaPermissionQuery
            ref="permissionQueryRef2"
            :api-params="{ ...permissionQueryApiParams, code: 'section2' }"
          >
            <div>page-permission content group1</div>
          </TaPermissionQuery>
          <TaPermissionQuery
            ref="permissionQueryRef3"
            :api-params="{ ...permissionQueryApiParams, code: 'section3' }"
          >
            <div>page-permission content group2</div>
            <TaTablePermissionDataQuery
              ref="tablePermissionDataQueryRef"
              :api-params="tablePermissionDataQueryApiParams"
            >
              <div ref="tableElRef">page-permission content group2 table</div>
            </TaTablePermissionDataQuery>
          </TaPermissionQuery>
        </section>
      </TaPermissionQuery>
    </section>
  </TaPermissions>
</template>
