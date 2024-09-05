<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  /*useSlots, useAttrs*/
} from 'vue'
import { Empty, Spin } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { DEFAULT_APIPARAMS, DEFAULT_FILECARDS_CLASSNAME, DEFAULT_FILECARDS_ID } from '../consts'
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
// const attrs = useAttrs()

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileCardsProps>(globalConfigProps, props, 'TaFileCards', {
  ...DEFAULT_APIPARAMS,
})

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

const catagories = ref<FileCardsCatagory[]>()
/** 这里只做初始化分类，后续的更新与合并在 fileCardProps 中 */
async function catagory() {
  // 因为 filecard 的 label 和 value 必传所以这里只需要判断 datasurce 即可
  const hasDatasources = mergedProps.value.fileCard
    ? mergedProps.value.fileCard.filter(
        (fileCard) => fileCard.dataSource && fileCard.dataSource.length > 0
      ).length === mergedProps.value.fileCard.length
    : false

  function createDefaultCatagoriesValue() {
    return (
      mergedProps.value.fileCard?.map((fileCard) => {
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

  if (!hasDatasources && mergedProps.value.immediate) {
    // 传入 immediate 时只使用接口构造数据，并且不考虑合并 datasource
    const fileTypes = await useFileTypeSelectCatgory()
    const files = await useFileListCatgory()
    catagories.value = fileTypes?.map((fileType) => {
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
    })
  } else {
    catagories.value = createDefaultCatagoriesValue()
  }
}

const fileCardProps = computed(() => (_catagory: FileCardsCatagory) => {
  // 使用分类中的 typecode 找到传入的 filecard
  const targetFileCard =
    mergedProps.value.fileCard?.find((fileCard) => fileCard.value === _catagory.value) ??
    ({} as any)

  // 对传入的 filecard 与初始化分类数据进行合并
  const mergedCatagory = {
    ..._catagory,
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

function handleFileCardActualidsChange(...args: [FileCardProps['value'], any]) {
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
}

onMounted(async () => {
  await catagory()
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
    <section :id="DEFAULT_FILECARDS_ID" :class="DEFAULT_FILECARDS_CLASSNAME">
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
              v-bind="fileCardProps(item)"
              :ref="(instance: any) => handleFileCardRefs(item.value, instance)"
              @actualids-change="(args: any[]) => handleFileCardActualidsChange(item.value, args)"
            />
          </template>
        </Spin>
      </section>
      <!-- <section :class="`${DEFAULT_FILECARDS_CLASSNAME}-footer`"></section> -->
    </section>
  </template>
</template>
