<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  useAttrs,
  // useSlots,
  watch,
} from 'vue'
import { Spin as ASpain } from 'ant-design-vue'
import { DEFAULT_APIPARAMS, permissionContextKey, permissionsContextKey } from '../constants'
import { useMergedProps } from '../hooks/use-props'
import {
  DEFAULT_TABLEPERMISSIONDATAQUERY_CLASSNAME,
  DEFAULT_TABLEPERMISSIONDATAQUERY_ID,
} from './constants'
import { tablePermissionDataQueryProps } from './types'
import type { PermissionContext } from '../types'

defineOptions({
  name: 'TaTablePermissionDataQuery',
  // inheritAttrs: false,
})

const id = ref(DEFAULT_TABLEPERMISSIONDATAQUERY_ID())
const type = ref(DEFAULT_TABLEPERMISSIONDATAQUERY_CLASSNAME)
const props = defineProps(tablePermissionDataQueryProps)
// const emits = defineEmits(pagePermissionEmits)
// const slots = useSlots()
const attrs = useAttrs()

const mergedProps = useMergedProps(props, 'TaTablePermissionDataQuery', DEFAULT_APIPARAMS)
const permissionContent = ref<PermissionContext['permission']>()
const isUseApi = computed(() => mergedProps.value.apiParams && mergedProps.value.apiPermissionData)
const loading = ref(false)

async function handlePermission() {
  if (mergedProps.value.disabled) return
  if (isUseApi.value) {
    permissionContent.value = {
      apiParams: mergedProps.value.apiParams!,
      apiPermissionData: mergedProps.value.apiPermissionData!,
    }
  }
}

onBeforeMount(async () => {
  if (props.immediate) {
    await handlePermission()
  }
})

watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  async (curVal, preVal) => {
    if (curVal && curVal !== '{}' && curVal !== preVal) {
      await handlePermission()
    }
  }
)

const permissionsContext = inject(permissionsContextKey, undefined)
const context: PermissionContext = reactive({
  // ...toRefs(props),
  id,
  type,
  disabled: mergedProps.value.disabled,
  permission: permissionContent,
})

onMounted(() => {
  permissionsContext?.addPermission(context)
})

onBeforeUnmount(() => {
  permissionsContext?.removePermission(context)
})

provide(permissionContextKey, context)

defineExpose({
  id,
  permissionContext: context,
})
</script>

<template>
  <ASpain v-if="loading" size="large" tip="正在加载权限，请稍等 👾" />
  <slot v-else v-bind="{ ...mergedProps.value, ...attrs, permission: permissionContent }" />
</template>
