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
  shallowRef,
  useAttrs,
  // useSlots,
  watch,
} from 'vue'
import { Spin as ASpain } from 'ant-design-vue'
import { DEFAULT_APIPARAMS, permissionContextKey, permissionsContextKey } from '../constants'
import { useMergedProps } from '../hooks/use-props'
import { DEFAULT_PERMISSIONDATAQUERY_CLASSNAME, DEFAULT_PERMISSIONDATAQUERY_ID } from './constants'
import {
  type PermissionQueryDataContent,
  permissionDataQueryEmits,
  permissionDataQueryProps,
} from './types'
import type { PermissionContext } from '../types'

defineOptions({
  name: 'TaPermissionDataQuery',
  // inheritAttrs: false,
})

const id = ref(DEFAULT_PERMISSIONDATAQUERY_ID())
const type = ref(DEFAULT_PERMISSIONDATAQUERY_CLASSNAME)
const props = defineProps(permissionDataQueryProps)
const emits = defineEmits(permissionDataQueryEmits)
// const slots = useSlots()
const attrs = useAttrs()

const mergedProps = useMergedProps(props, 'TaPermissionDataQuery', DEFAULT_APIPARAMS)
const permissionContent = shallowRef<PermissionQueryDataContent>()
const isUseApi = computed(() => mergedProps.value.apiParams && mergedProps.value.apiPermissionData)
const loading = ref(false)

async function reload() {
  try {
    const { data, success } = await mergedProps.value.apiPermissionData!(
      mergedProps.value.apiParams!
    )
    if (data && success) {
      permissionContent.value = data
      emits('apiSuccess', data)
      return data
    } else {
      permissionContent.value = undefined
      return undefined
    }
  } catch (error: any) {
    console.warn('[tavui TaPermissionDataQuery] api has error', error)
    permissionContent.value = undefined
    emits('apiError', error)
    return undefined
  }
}

async function handlePermission() {
  if (mergedProps.value.disabled) return
  if (isUseApi.value) {
    try {
      loading.value = true
      await reload()
    } catch (error: any) {
      console.warn('[tavui TaPermissionDataQuery] api has error', error)
    } finally {
      loading.value = false
    }
  } else {
    if (mergedProps.value.permission) {
      permissionContent.value = mergedProps.value.permission
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
      if (props.immediate) {
        await handlePermission()
      }
    }
  }
)

const permissionsContext = inject(permissionsContextKey, undefined)
// const parentPermissionContext = inject(permissionContextKey, undefined)
// console.log('🚀 ~ parentPermissionContext:', parentPermissionContext)
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
  reload,
})
</script>

<template>
  <ASpain v-if="loading" size="large" tip="正在加载权限，请稍等 👾" />
  <slot v-else v-bind="{ ...mergedProps.value, ...attrs, permission: permissionContent }" />
</template>
