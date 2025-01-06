<script setup lang="ts">
import {
  provide,
  reactive,
  ref,
  toRefs,
  useAttrs,
  // useSlots
} from 'vue'
import { permissionsContextKey } from '../constants'
import { DEFAULT_PERMISSIONS_CLASSNAME, DEFAULT_PERMISSIONS_ID } from './constants'
import { pagePermissionProps } from './types'
import type { PermissionContext, PermissionsContext } from '../types'

defineOptions({
  name: 'TaPermissions',
  // inheritAttrs: false,
})

const id = ref(DEFAULT_PERMISSIONS_ID())
const type = ref(DEFAULT_PERMISSIONS_CLASSNAME)
const props = defineProps(pagePermissionProps)
// const emits = defineEmits(pagePermissionEmits)
// const slots = useSlots()
const attrs = useAttrs()

const { disabled } = toRefs(props)

const permissionsContext: PermissionContext[] = []

const getPermission: PermissionsContext['getPermission'] = (id) => {
  return permissionsContext.find((permissionContext) => permissionContext.id === id)
}
const addPermission: PermissionsContext['addPermission'] = (permissionContext) => {
  permissionsContext.push(permissionContext)
}
const removePermission: PermissionsContext['removePermission'] = (permissionContext) => {
  if (permissionContext.id) {
    permissionsContext.splice(permissionsContext.indexOf(permissionContext), 1)
  }
}

provide(
  permissionsContextKey,
  reactive({
    // ...toRefs(props),
    id,
    type,
    disabled,
    getPermission,
    addPermission,
    removePermission,
  })
)
defineExpose({
  id,
  permissionsContext,
  getPermission,
})
</script>

<template>
  <slot v-bind="{ ...toRefs(props), ...attrs }" />
</template>
