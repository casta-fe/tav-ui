<script setup lang="ts">
import {
  type CSSProperties,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  /*useSlots,*/
  useAttrs,
} from 'vue'
import { Empty, Spin } from 'ant-design-vue'
import waterfall from 'masonry-layout'
import { tavI18n } from '@tav-ui/locales'
import {
  DEFAULT_APIPARAMS,
  DEFAULT_FILECARDS_CLASSNAME,
  DEFAULT_FILECARDS_ID,
  DEFAULT_FILECARD_CLASSNAME,
} from '../consts'
import { useDisable, useGlobalConfigProps, useLoading, useMergedProps, useRequest } from '../hooks'
import {
  type FileActionUploadApiResponseRecord,
  type FileTypeSelectApiResponseRecord,
} from '../typings'
import {
  type FileCardEmits,
  type FileCardInstance,
  type FileCardProps,
  TaFileCard,
} from '../FileCard'
import { type ArgumentsOf } from '../utils'
import {
  type FileCardMultiple,
  type FileCardsCatagory,
  type FileCardsProps,
  fileCardsEmits,
  fileCardsProps,
} from './types'
import { useMode } from './hooks'

const EmptyImage = Empty.PRESENTED_IMAGE_SIMPLE

defineOptions({
  name: 'TaFileCards',
  inheritAttrs: false,
})

const props = defineProps(fileCardsProps)
const emits = defineEmits(fileCardsEmits)
// const slots = useSlots()
const attrs = useAttrs()

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileCardsProps>(globalConfigProps, props, 'TaFileCards', {
  ...DEFAULT_APIPARAMS,
})

const fileCardsElRef = ref<HTMLDivElement>()
const fileActualIdsValueMap = ref<{ [key: string]: ArgumentsOf<FileCardEmits['actualidsChange']> }>(
  {}
)

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

const fileCardRefs: { [key: string]: FileCardInstance } = {}
function handleFileCardRefs(fileCardValue: string, fileCardRef?: FileCardInstance) {
  if (fileCardRef) fileCardRefs[fileCardValue] = fileCardRef
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

function isFileCardHasDataSource(fileCard: FileCardsProps['fileCard']) {
  if (!fileCard) return false

  if (!Array.isArray(fileCard)) {
    return false
  } else {
    return (
      fileCard.filter((fileCard) => fileCard.dataSource && Array.isArray(fileCard.dataSource))
        .length === fileCard.length
    )
  }
}

const catagories = ref<FileCardsCatagory[]>()
/** 这里只做初始化分类，后续的更新与合并在 fileCardProps 中 */
async function catagory() {
  const hasDatasources = isFileCardHasDataSource(mergedProps.value.fileCard)

  function useFileCardArrayObjectCreateCatagoriesValue() {
    return (
      (mergedProps.value.fileCard as FileCardMultiple | undefined)?.map((fileCard) => {
        if (fileCard.value && !fileActualIdsValueMap.value[fileCard.value]) {
          fileActualIdsValueMap.value[fileCard.value] = [] as any
        }
        return {
          label: fileCard.label,
          value: fileCard.value,
          dataSource: fileCard.dataSource ?? [],
        }
      }) ?? []
    )
  }

  function useFileCardObjectCreateCatagoriesValue() {
    return [] as any[]
  }

  async function useApiCreateCatagoriesValue() {
    // 传入 immediate 时只使用接口构造数据，并且不考虑合并 datasource
    const fileTypes = await useFileTypeSelectCatgory()
    const files = await useFileListCatgory()
    return (
      fileTypes?.map((fileType) => {
        if (fileType.code && !fileActualIdsValueMap.value[fileType.code]) {
          fileActualIdsValueMap.value[fileType.code] = [] as any
        }

        const currentTypeFiles = files?.filter((file) => file.typeCode === fileType.code) ?? []
        return {
          label: fileType.name,
          value: fileType.code,
          dataSource: [...currentTypeFiles],
          __dataSourceFromCards: true,
        }
      }) ?? []
    )
  }

  if (mergedProps.value.immediate) {
    if (hasDatasources) {
      catagories.value = useFileCardArrayObjectCreateCatagoriesValue()
    } else {
      // 没有 datasource 只有俩中情况
      // 1. filecard 没传，使用 api 构造
      // 2. filecard 传了对象（不包含 label/value/datasource），使用 api 构造并且将 filecard 统一配置合并
      catagories.value = await useApiCreateCatagoriesValue()
    }
  } else {
    if (hasDatasources) {
      catagories.value = useFileCardArrayObjectCreateCatagoriesValue()
    } else {
      // 没有 datasource 只有俩中情况
      // 1. filecard 没传，使用 api 构造
      // 2. filecard 传了对象（不包含 label/value/datasource）
      catagories.value = useFileCardObjectCreateCatagoriesValue()
    }
  }
}

const fileCardProps = computed(() => (_catagory: FileCardsCatagory | undefined) => {
  // 1. filecard 为对象数组时，使用分类中的 typecode 找到传入的 filecard
  // 2. filecard 为对象时（不包含 label/value/datasource）只做统一配置
  const targetFileCard = mergedProps.value.fileCard
    ? Array.isArray(mergedProps.value.fileCard)
      ? mergedProps.value.fileCard.find((fileCard) => fileCard.value === _catagory?.value) ??
        ({} as any)
      : mergedProps.value.fileCard
    : ({} as any)

  // 对传入的 filecard 与初始化分类数据进行合并
  const mergedCatagory = {
    ...(_catagory ?? {}),
    autoValidate: mergedProps.value.autoValidate,
    ...targetFileCard,
    dataSource: [
      ...(mergedProps.value.immediate
        ? _catagory?.dataSource ?? []
        : targetFileCard?.dataSource ?? []),
    ],
    fileActionUpload: {
      ...(mergedProps.value.fileActionUpload ?? {}),
      ...(targetFileCard.fileActionUpload ?? {}),
    },
    fileActionUploadLink: {
      ...(mergedProps.value.fileActionUploadLink ?? {}),
      ...(targetFileCard.fileActionUploadLink ?? {}),
    },
  }
  return {
    ...mergedCatagory,
    mode: props.mode,
    apiParams: {
      //@ts-ignore
      typeCode: mergedCatagory.value!,
      ...mergedProps.value.apiParams,
      ...(targetFileCard.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
    },
  }
})

async function handleFileCardActualidsChange(...args: [FileCardProps['value'], any]) {
  const [value, _args] = args as unknown as [
    FileCardProps['value'],
    ArgumentsOf<FileCardEmits['actualidsChange']>
  ]
  fileActualIdsValueMap.value = { ...fileActualIdsValueMap.value, [value!]: _args }
  const fileActualIdsValue: { [key: string]: ArgumentsOf<FileCardEmits['actualidsChange']> } =
    JSON.parse(JSON.stringify(fileActualIdsValueMap.value))

  const result = [] as any[]
  for (const fileActualIds of Object.values(fileActualIdsValue)) {
    result.push(...fileActualIds)
  }
  emits('update:fileActualIds', result)

  await retriggerWaterfall()
}

const fileCardWaterfallStyle = ref<CSSProperties>()
async function retriggerWaterfall() {
  if (!mergedProps.value.waterfallConfig.enabled) return

  await nextTick()
  if (fileCardsElRef.value) {
    const wrapperEl = fileCardsElRef.value.querySelector(
      `.${DEFAULT_FILECARDS_CLASSNAME}-main--waterfall`
    )
    if (wrapperEl) {
      const columnWidth = mergedProps.value.waterfallConfig.width ?? 400
      fileCardWaterfallStyle.value = { ...fileCardWaterfallStyle.value, width: `${columnWidth}px` }
      new waterfall(`.${DEFAULT_FILECARDS_CLASSNAME}-main--waterfall`, {
        itemSelector: `.${DEFAULT_FILECARD_CLASSNAME}`,
        columnWidth,
        gutter: 20,
      })
    }
  }
}

onMounted(async () => {
  await catagory()

  await retriggerWaterfall()
})

// 清空状态
async function cleanup() {
  const fileCardCleanupPromises = Object.values(fileCardRefs).map(
    // eslint-disable-next-line no-return-await
    async (fileCardRef) => await fileCardRef.cleanup()
  )
  await Promise.all(fileCardCleanupPromises)
}

// mode 变化
watch(
  () => mergedProps.value.mode,
  async () => {
    // if(mergedProps.value.visible) {}
    await cleanup()
    loading.value.value = true
    await catagory()
    loading.value.value = false

    await retriggerWaterfall()
  }
)

// apiparams 变化重新请求
watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  async (curApiParams, preApiParams) => {
    if (curApiParams && curApiParams !== preApiParams) {
      if (mergedProps.value.immediate) {
        const curTSAO = typeSelectApiOptions(mergedProps.value.apiParams)
        if (!curTSAO) return
        const preTSAO = typeSelectApiOptions(JSON.parse(preApiParams))
        if (!preTSAO) return
        const curQFLO = apiQueryFileListOptions(mergedProps.value.apiParams)
        if (!curQFLO) return
        const preQFLO = apiQueryFileListOptions(JSON.parse(preApiParams))
        if (!preQFLO) return
        if (curApiParams !== preApiParams && curTSAO !== preTSAO && curQFLO !== preQFLO) {
          loading.value.value = true
          await catagory()
          loading.value.value = false

          retriggerWaterfall()
        }
      }
    }
  }
)

onBeforeUnmount(async () => {
  await cleanup()
})

defineExpose({
  cleanup,
  getFileCardRefMap: () => fileCardRefs,
  getDataSource: (cardPropValue?: string) => {
    if (!cardPropValue) {
      return Object.values(fileCardRefs).map((fileCardRef) => fileCardRef.getDataSource())
    } else {
      return fileCardRefs[cardPropValue].getDataSource()
    }
  },
  validate: async (cardPropValue?: string) => {
    if (!cardPropValue) {
      const promises = Object.values(fileCardRefs).map(
        // eslint-disable-next-line no-return-await
        async (fileCardRef) => await fileCardRef.validate()
      )
      // eslint-disable-next-line no-return-await
      return await Promise.all(promises)
    } else {
      // eslint-disable-next-line no-return-await
      return await fileCardRefs[cardPropValue].validate()
    }
  },
  clearValidate: (cardPropValue?: string) => {
    if (!cardPropValue) {
      return Object.values(fileCardRefs).map((fileCardRef) => fileCardRef.clearValidate())
    } else {
      return fileCardRefs[cardPropValue].clearValidate()
    }
  },
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section
      :id="DEFAULT_FILECARDS_ID"
      ref="fileCardsElRef"
      :class="`${DEFAULT_FILECARDS_CLASSNAME} ${attrs.class ? attrs.class : ''}`"
    >
      <!-- <section :class="`${DEFAULT_FILECARDS_CLASSNAME}-header`"></section> -->
      <section :class="`${DEFAULT_FILECARDS_CLASSNAME}-main`">
        <Spin :spinning="loading.value" :tip="tavI18n('Tav.common.loadingText')">
          <template v-if="catagories?.length === 0 || apiError">
            <span v-if="apiError">{{ apiError }}</span>
            <br />
            <Empty :image="EmptyImage" />
          </template>
          <template v-else>
            <template v-if="mergedProps.waterfallConfig.enabled">
              <div :class="`${DEFAULT_FILECARDS_CLASSNAME}-main--waterfall`">
                <TaFileCard
                  v-for="item in catagories"
                  :key="`${item.value}`"
                  :ref="(instance: any) => handleFileCardRefs(item.value, instance)"
                  v-bind="fileCardProps(item)"
                  :style="fileCardWaterfallStyle"
                  @actualids-change="(args: any[]) => handleFileCardActualidsChange(item.value, args)"
                />
              </div>
            </template>
            <template v-else>
              <TaFileCard
                v-for="item in catagories"
                :key="`${item.value}`"
                :ref="(instance: any) => handleFileCardRefs(item.value, instance)"
                v-bind="fileCardProps(item)"
                @actualids-change="(args: any[]) => handleFileCardActualidsChange(item.value, args)"
              />
            </template>
          </template>
        </Spin>
      </section>
      <!-- <section :class="`${DEFAULT_FILECARDS_CLASSNAME}-footer`"></section> -->
    </section>
  </template>
</template>
