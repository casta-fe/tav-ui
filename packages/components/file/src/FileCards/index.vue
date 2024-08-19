<script setup lang="ts">
import {
  type UnwrapRef,
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  /*useSlots, useAttrs*/
} from 'vue'
import { Empty, Spin } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { DEFAULT_APIPARAMS, DEFAULT_FILECARDS_CLASSNAME, DEFAULT_FILECARDS_ID } from '../consts'
import { useDisable, useGlobalConfigProps, useLoading, useMergedProps, useRequest } from '../hooks'
import {
  type FileActionUploadApiResponseRecord,
  type FileTypeSelectApiResponseRecord,
} from '../typings'
import { type FileCardInstance, type FileCardProps, TaFileCard } from '../FileCard'
import {
  type FileCardsInstance,
  type FileCardsProps,
  fileCardsEmits,
  fileCardsProps,
} from './types'
import { useMode } from './hooks'

interface Catagory {
  label: FileCardProps['label']
  value: FileCardProps['value']
  dataSource: FileCardProps['dataSource']
}

const { createMessage } = useMessage()
const EmptyImage = Empty.PRESENTED_IMAGE_SIMPLE

defineOptions({
  name: 'TaFileCards',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileCardsInstance['elRef']>>()
const props = defineProps(fileCardsProps)
const emits = defineEmits(fileCardsEmits)
// const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileCardsProps>(globalConfigProps, props, 'TaFileCards', {
  ...DEFAULT_APIPARAMS,
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

const {
  apiActions: { typeSelectApiOptions, apiQueryFileListOptions },
} = useMode({ mergedProps })

// 使用 api 处理数据
const { setDisable } = useDisable()
const { setLoading } = useLoading()
const {
  result: ApiResult,
  error: apiError,
  handleApi,
} = useRequest({
  setLoading,
  setDisable,
  loading,
})

const fileCardRefs: FileCardInstance[] = []
function handleFileCardRefs(fileCardRef?: FileCardInstance) {
  if (fileCardRef) fileCardRefs.push(fileCardRef)
}

async function useFileTypeSelectCatgory() {
  loading.value.value = true

  const options = typeSelectApiOptions(mergedProps.value.apiParams)
  if (!options) {
    loading.value.value = false
    return
  }

  await handleApi(options)
  loading.value.value = false

  return ApiResult.value as FileTypeSelectApiResponseRecord[]
}

async function useFileListCatgory() {
  loading.value.value = true

  const options = apiQueryFileListOptions(mergedProps.value.apiParams)
  if (!options) {
    loading.value.value = false
    return
  }

  await handleApi(options)
  loading.value.value = false

  return ApiResult.value as FileActionUploadApiResponseRecord[]
}

// TODO:
// 1. 取出 apiparams typecodes，请求 queryfiletype
// 2. 将传入值与响应值做匹配非只读模式下响应值与传入值长度、内容不符合直接报错
// 3. 用响应值分类
// 4. 带着响应值请求 queryfilelist 手动分类数据 Record<string, FileActionUploadApiResponseRecord[]>
const catagories = ref<Catagory[]>()
/** 这里只做初始化分类，后续的更新与合并在 fileCardProps 中 */
async function catagory() {
  if (mergedProps.value.immediate) {
    const fileTypes = await useFileTypeSelectCatgory()
    const files = await useFileListCatgory()

    catagories.value = fileTypes?.map((fileType) => {
      const currentTypeFiles = files?.filter((file) => file.typeCode === fileType.code) ?? []
      // const fileCardDataSource =
      //   mergedProps.value.fileCard?.find((fileCard) => fileCard.value === fileType.code)
      //     ?.dataSource ?? []
      return {
        label: fileType.name,
        value: fileType.code,
        // dataSource: [...fileCardDataSource, ...currentTypeFiles],
        dataSource: [...currentTypeFiles],
      }
    })
  } else {
    catagories.value =
      mergedProps.value.fileCard?.map((fileCard) => ({
        label: fileCard.label,
        value: fileCard.value,
        // dataSource: fileCard.dataSource,
        dataSource: [],
      })) ?? []
  }
}

const fileCardProps = computed(() => (_catagory: Catagory, idx: number) => {
  // 使用分类中的 typecode 找到传入的 filecard
  const targetFileCard =
    mergedProps.value.fileCard?.find((fileCard) => fileCard.value === _catagory.value) ??
    ({} as any)

  // 对传入的 filecard 与初始化分类数据进行合并
  const mergedCatagory = {
    ..._catagory,
    ...(mergedProps.value.fileCard?.[idx] ?? {}),
    dataSource: [...(targetFileCard?.dataSource ?? []), ...(_catagory?.dataSource ?? [])],
  }
  return {
    ...mergedCatagory,
    mode: props.mode,
    apiParams: {
      //@ts-ignore
      typeCode: mergedCatagory.value!,
      ...mergedProps.value.apiParams,
      ...(mergedProps.value.fileCard?.[idx]?.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
    },
  }
})

onMounted(async () => {
  await catagory()
})

// 清空状态
async function cleanup() {
  const fileCardCleanupPromises = fileCardRefs.map(
    // eslint-disable-next-line no-return-await
    async (fileCardRef) => await fileCardRef.cleanup()
  )
  await Promise.all(fileCardCleanupPromises)
}

// // mode 变化置空状态
// watch(
//   () => mergedProps.value.mode,
//   async () => {
//     cleanup()
//     // if (mergedProps.value.immediate && modalVisible.value) {
//     //   loading.value.value = true
//     //   await useModeFetchDataSource()
//     //   setTimeout(() => {
//     //     loading.value.value = false
//     //   }, 150)
//     // }
//   }
// )
// // apiparams 变化重新请求
// watch(
//   () => JSON.stringify(mergedProps.value.apiParams),
//   async (curApiParams, preApiParams) => {
//     if (curApiParams && curApiParams !== preApiParams) {
//       // if (mergedProps.value.immediate && modalVisible.value) {
//       //   loading.value.value = true
//       //   await useModeFetchDataSource()
//       //   setTimeout(() => {
//       //     loading.value.value = false
//       //   }, 150)
//       // }
//     }
//   }
// )

onBeforeUnmount(async () => {
  await cleanup()
})

defineExpose({
  elRef,
  cleanup,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section :id="DEFAULT_FILECARDS_ID" ref="elRef" :class="DEFAULT_FILECARDS_CLASSNAME">
      <!-- <section :class="`${DEFAULT_FILECARDS_CLASSNAME}-header`"></section> -->
      <section :class="`${DEFAULT_FILECARDS_CLASSNAME}-main`">
        <Spin :spinning="loading.value" :tip="tavI18n('Tav.common.loadingText')">
          <template v-if="catagories?.length === 0 || apiError">
            <span v-if="apiError">{{ apiError }}</span>
            <br />
            <Empty :image="EmptyImage" />
          </template>
          <template v-else>
            <TaFileCard
              v-for="(item, idx) in catagories"
              :key="`${item.value}-${idx}`"
              v-bind="fileCardProps(item, idx)"
              :ref="handleFileCardRefs"
            />
          </template>
        </Spin>
      </section>
      <!-- <section :class="`${DEFAULT_FILECARDS_CLASSNAME}-footer`"></section> -->
    </section>
  </template>
</template>
