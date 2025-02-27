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
import { normalizedPermissionQueryContent } from '../utils'
import { DEFAULT_PERMISSIONQUERY_CLASSNAME, DEFAULT_PERMISSIONQUERY_ID } from './constants'
import { type PermissionQueryContent, permissionQueryEmits, permissionQueryProps } from './types'
import type { PermissionContext } from '../types'

defineOptions({
  name: 'TaPermissionQuery',
  // inheritAttrs: false,
})

const id = ref(DEFAULT_PERMISSIONQUERY_ID())
const type = ref(DEFAULT_PERMISSIONQUERY_CLASSNAME)
const props = defineProps(permissionQueryProps)
const emits = defineEmits(permissionQueryEmits)
// const slots = useSlots()
const attrs = useAttrs()

const mergedProps = useMergedProps(props, 'TaPermissionQuery', DEFAULT_APIPARAMS)
const permissionContent = shallowRef<PermissionQueryContent>()
const isUseApi = computed(() => mergedProps.value.apiParams && mergedProps.value.apiPermission)
const loading = ref(false)

async function reload() {
  try {
    const { data, success } = await mergedProps.value.apiPermission!(mergedProps.value.apiParams!)
    if (data && success) {
      const _data = normalizedPermissionQueryContent(data)
      emits('apiSuccess', _data as any)
      return _data
    } else {
      return undefined
    }
  } catch (error: any) {
    console.warn('[tavui TaPermissionQuery] api has error', error)
    emits('apiError', error)
    return undefined
  }
}

async function handlePermission() {
  if (mergedProps.value.disabled) return
  if (isUseApi.value) {
    try {
      loading.value = true
      const data = await reload()
      permissionContent.value = data
    } catch (error: any) {
      console.warn('[tavui TaPermissionQuery] api has error', error)
    } finally {
      loading.value = false
    }
  } else {
    if (mergedProps.value.permission) {
      permissionContent.value = normalizedPermissionQueryContent({
        ...mergedProps.value.permission,
      })
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
