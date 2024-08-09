<script setup lang="ts">
import { type UnwrapRef, computed, onUnmounted, ref, watch /*useSlots, useAttrs*/ } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type ITableProInstance, TaModal, TaTablePro } from '@tav-ui/components'
import componentSetting from '@tav-ui/settings/src/componentSetting'
import { DEFAULT_FILELOG_CLASSNAME, DEFAULT_FILELOG_ID } from '../../consts'
import { useGlobalConfigProps, useMergedProps } from '../../hooks'
import { type FileLogInstance, type FileLogProps, fileLogEmits, fileLogProps } from './types'
import { useColumns, useMode } from './hooks'

const {
  table: {
    pageSizeOptions,
    defaultPageSize,
    // fetchSetting: { listField, totalField },
  },
} = componentSetting

/**
 * fileLog 只用 datasource 来展示数据
 */
defineOptions({
  name: 'TaFileLog',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileLogInstance['elRef']>>()
const fileLogTableProRef = ref<ITableProInstance>()
const props = defineProps(fileLogProps)
const emits = defineEmits(fileLogEmits)
// const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 fileLog props 结合，同名 props 已 fileLog props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileLogProps>(globalConfigProps, props, 'TaFileLog')

// 针对业务抽象不同模式进行数据处理
const {
  apiActions: { logApiOptions },
} = useMode({ mergedProps })

const dataSource = ref(mergedProps.value.dataSource)
const dataSourceOrApiConfig = computed<{
  data: any
  api: any
  beforeApi: any
  afterApi: any
}>(() => {
  if (dataSource.value) {
    return {
      data: dataSource.value,
      api: undefined,
      beforeApi: undefined,
      afterApi: undefined,
    }
  } else if (mergedProps.value.apiQueryFileLog) {
    return {
      data: undefined,
      api: async ({ filter, model }: Record<string, any>) => {
        const options = logApiOptions(mergedProps.value.apiParams, mergedProps.value.file!)
        const { apiParams = {} } = options || {}

        const result = await mergedProps.value.apiQueryFileLog?.({
          filter: {
            ...filter,
            ...apiParams,
          },
          model: {
            ...model,
          },
        })

        return result
      },
      beforeApi: mergedProps.value.beforeApiQueryFileLog,
      afterApi: mergedProps.value.afterApiQueryFileLog,
      pagerConfig: {
        size: 'mini',
        layouts: ['PrevPage', 'Number', 'NextPage', 'Sizes', 'Total'],
        pageSize: defaultPageSize,
        pageSizes: pageSizeOptions.map((size) => Number(size)),
        controller: 'backend',
      },
    }
  } else {
    return {
      data: [] as any,
      api: undefined,
      beforeApi: undefined,
      afterApi: undefined,
    }
  }
})

// 统一内部 loading 状态
const _loading = ref(mergedProps.value.loading)
const loading = computed({
  get() {
    return _loading
  },
  set(newLoading: any) {
    _loading.value = newLoading.value
  },
})

// 处理表格列
const columns = useColumns({
  mergedProps,
})

const modalVisible = ref(mergedProps.value.visible)

watch(
  () => mergedProps.value.visible,
  (visible) => {
    if (visible) {
      if (!modalVisible.value) open()
    } else {
      if (modalVisible.value) close()
    }
  }
)

async function open() {
  modalVisible.value = true
  emits('open')
  emits('update:visible', modalVisible.value)
}

function close() {
  modalVisible.value = false
  emits('close')
  emits('update:visible', modalVisible.value)
}

function handleOnVisibleChange(isOpen: boolean) {
  if (!isOpen) {
    close()
  }
}

// 清空状态
function cleanup() {
  close()
}

// mode 变化置空状态
watch(
  () => mergedProps.value.mode,
  async () => {
    cleanup()
    // if (mergedProps.value.immediate && modalVisible.value) {
    //   loading.value.value = false
    //   const options = logApiOptions(mergedProps.value.apiParams, mergedProps.value.file!)
    //   const { apiParams = {} } = options || {}
    //   const tableProInstance = (fileLogTableProRef.value as any)?.instance as any
    //   await tableProInstance?.reload({ filter: apiParams })
    //   loading.value.value = true
    // }
  }
)
// apiparams 变化重新请求
watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  async (curApiParams, preApiParams) => {
    if (curApiParams && curApiParams !== preApiParams) {
      if (mergedProps.value.immediate && modalVisible.value) {
        loading.value.value = false
        const options = logApiOptions(mergedProps.value.apiParams, mergedProps.value.file!)
        const { apiParams = {} } = options || {}
        const tableProInstance = (fileLogTableProRef.value as any)?.instance as any
        await tableProInstance?.reload({ filter: apiParams })
        loading.value.value = true
      }
    }
  }
)

onUnmounted(() => {
  cleanup()
})

defineExpose({
  elRef,
  open,
  close,
  cleanup,
})
</script>

<template>
  <section :id="DEFAULT_FILELOG_ID" ref="elRef" :class="DEFAULT_FILELOG_CLASSNAME">
    <TaModal
      :visible="modalVisible"
      title="TaFileLog"
      :width="mergedProps.width"
      :min-height="400"
      :wrap-class-name="`${DEFAULT_FILELOG_CLASSNAME}-modal ${mergedProps.wrapClassName ?? ''}`"
      :destroy-on-close="mergedProps.destroyOnClose"
      :mask-closable="mergedProps.maskClosable"
      :get-popup-container="mergedProps.getPopupContainer"
      :footer="null"
      @visible-change="handleOnVisibleChange"
    >
      <template #title>
        <div :class="`${DEFAULT_FILELOG_CLASSNAME}-modal-title`">
          {{
            `${mergedProps.file?.fullName || mergedProps.file?.name} ${tavI18n('Tav.file.modal.2')}`
          }}
        </div>
      </template>
      <template #default>
        <div :class="`${DEFAULT_FILELOG_CLASSNAME}-modal-body`">
          <TaTablePro
            ref="fileLogTableProRef"
            :loading="loading.value"
            :checkbox-config="mergedProps.checkboxConfig"
            :pager-config="mergedProps.pagerConfig"
            :show-operations="mergedProps.showOperations"
            :fill-inner="mergedProps.fillInner"
            :columns="columns"
            v-bind="dataSourceOrApiConfig"
            :immediate="mergedProps.immediate"
          />
        </div>
      </template>
    </TaModal>
  </section>
</template>
