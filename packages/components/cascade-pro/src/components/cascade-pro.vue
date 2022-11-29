<template>
  <div class="ta-cascade-pro">
    <div class="ta-cascade-pro-header">
      <Search
        :search-visible="searchVisible"
        :search-placeholder="searchPlaceholder"
        :generate-search-item="generateSearchItem"
        @search="handleSearch"
      />
      <Hot
        ref="hotRef"
        :hot-visible="hotVisible"
        :hot-key-words="hotKeyWords"
        :generate-hot-list="generateHotList"
        @change="handleHotChange"
      />
    </div>
    <div class="ta-cascade-pro-content">
      <FirstLetter
        ref="firstLetterRef"
        :first-letter-visible="firstLetterVisible"
        :title="firstLetterTitle"
        @change="handleFirstLetterChange"
      />
      <Pannel
        ref="pannelRef"
        :generate-pannel-item="generatePannelItem"
        @click="handlePannelOptionClick"
      />
    </div>
    <div class="ta-cascade-pro-footer">
      <SelectResult
        ref="selectResultRef"
        @clear="handleSearchResultClear"
        @clear-all="handleSearchResultClearAll"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, unref } from 'vue'
import { cascadeProProps } from '../types'
import { getDefaultValue, handleOptions } from '../utils'
import { createCascadeProContext, useSelectRecord, useSelectRecords } from '../hooks'
import Search from './search.vue'
import Hot from './hot.vue'
import FirstLetter from './first-letter.vue'
import Pannel from './pannel'
import SelectResult from './select-result.vue'
import type { CascadeProHotInstance } from './hot.vue'
import type { CascadeProFirstLetterInstance } from './first-letter.vue'
import type { CascadeProPannelInstance } from './pannel'
import type { CascadeProSelectResultInstance } from './select-result.vue'
import type { CascadeProOption } from '../types'
import type { ComputedRef, Ref } from 'vue'

export interface CascadeProInstance {
  selectResultRef: Ref<CascadeProSelectResultInstance | null>
}

export default defineComponent({
  name: 'TaCascadePro',
  components: { Search, Hot, FirstLetter, Pannel, SelectResult },
  props: cascadeProProps,
  setup(props, { expose }) {
    const hotRef = ref<CascadeProHotInstance | null>(null)
    const firstLetterRef = ref<CascadeProFirstLetterInstance | null>(null)
    const pannelRef = ref<CascadeProPannelInstance | null>(null)
    const selectResultRef = ref<CascadeProSelectResultInstance | null>(null)

    const firstLetterVisible = computed(() => props.firstLetterVisible)

    /** 字段值 */
    const fields = computed(() => props.fields)

    /** 处理源数据 */
    const options = computed(() =>
      handleOptions(
        props.options,
        props.optionsKeyConfig,
        props.fields.length,
        unref(firstLetterVisible)
      )
    )

    const { selectRecords, setSelectRecords } = useSelectRecords()

    const defaultValue = computed(() => {
      // const test = [
      //   {
      //     city: '130100',
      //     cityName: '石家庄市',
      //     district: '130104',
      //     districtName: '桥西区',
      //     province: '130000',
      //     provinceName: '河北省',
      //   },
      // ]
      return getDefaultValue(
        unref(props.value),
        // unref(props.value || DEFAULT_CASCADE_PRO_SELECT_RECORDS),
        unref(fields)
      )
    })

    const { selectRecord, setSelectRecord, selectRecordFibers } = useSelectRecord({
      defaultValue,
      fields,
    })

    createCascadeProContext({
      firstLetterVisible,
      fields,
      options,
      selectRecord,
      setSelectRecord,
      selectRecordFibers,
      selectRecords,
      setSelectRecords,
      id: computed(() => props.id!),
    })

    const handleSearch = async (option: CascadeProOption) => {
      unref(pannelRef)?.handleOptionClick(option)
      await nextTick()
      const idPath = option.idPath.split('-')[0]
      const firstLetter = unref(options).list.find(
        (option) => option.idPath === idPath
      )?.firstLetter
      unref(pannelRef)?.handlePannelFieldScrollToLetter(firstLetter!)
    }

    const handleHotChange = async (info: {
      added: CascadeProOption[]
      deleted: CascadeProOption[]
    }) => {
      if (info.added && info.added.length > 0) {
        for (let i = 0; i < info.added.length; i++) {
          unref(pannelRef)?.handleOptionClick(info.added[i])
          await nextTick()

          if (i === info.added.length - 1) {
            const idPath = info.added[i].idPath.split('-')[0]
            const firstLetter = unref(options).list.find(
              (option) => option.idPath === idPath
            )?.firstLetter
            unref(pannelRef)?.handlePannelFieldScrollToLetter(firstLetter!)
          }
        }
      }

      if (info.deleted && info.deleted.length > 0) {
        for (let i = 0; i < info.deleted.length; i++) {
          unref(selectResultRef)?.handleClear(info.deleted[i], info.deleted[i].type)
          await nextTick()
        }
      }
    }

    const handleFirstLetterChange = (letters: string[]) => {
      if (letters.length > 0) {
        unref(pannelRef)?.handlePannelFieldScrollToLetter(letters[0])
      }
    }

    const handlePannelOptionClick = (/*option: CascadeProOption*/) => {
      // console.log('handlePannelOptionClick')
    }

    const handleSearchResultClear = (newSelectRecords: CascadeProOption[]) => {
      unref(pannelRef)?.handleFieldClear(newSelectRecords)
    }

    const handleSearchResultClearAll = () => {
      unref(pannelRef)?.handleFieldClear([], 0)
      unref(hotRef)?.handleHotClearAll()
      unref(firstLetterRef)?.handleFirstLetterClearAll()
    }

    onMounted(async () => {
      const renewRecords: CascadeProOption[] = []
      for (let i = 0; i < unref(defaultValue).selectRecords.length; i++) {
        const idPathSplitResult = unref(defaultValue).selectRecords[i].idPath.split('-')
        if (idPathSplitResult.length === 1) {
          renewRecords.push(unref(defaultValue).selectRecords[i])
        } else {
          for (let j = 0; j < idPathSplitResult.length - 1; j++) {
            const groupOptions = unref(options).group[j]
            const parentRecord = groupOptions.find((option) => option.id === idPathSplitResult[j])
            const isSame = renewRecords.find((option) => option.idPath === parentRecord?.idPath)
            parentRecord && !isSame && renewRecords.push(parentRecord)
          }
          renewRecords.push(unref(defaultValue).selectRecords[i])
        }
      }

      if (
        renewRecords.length > 0 &&
        unref(defaultValue).selectRecords[0].id !== '' &&
        unref(defaultValue).selectRecords[0].idPath !== ''
      ) {
        setSelectRecords([...renewRecords], 'recover')
      }

      await nextTick()

      if (
        unref(defaultValue).selectRecord.id !== '' &&
        unref(defaultValue).selectRecord.idPath !== ''
      ) {
        const idPath = unref(defaultValue).selectRecord.idPath.split('-')[0]
        const firstLetter = unref(options).list.find(
          (option) => option.idPath === idPath
        )?.firstLetter
        unref(pannelRef)?.handlePannelFieldScrollToLetter(firstLetter!)
      }
    })

    expose({
      selectResultRef,
    })

    return {
      hotRef,
      firstLetterRef,
      pannelRef,
      selectResultRef,
      handleSearch,
      handleHotChange,
      handleFirstLetterChange,
      handlePannelOptionClick,
      handleSearchResultClear,
      handleSearchResultClearAll,
    }
  },
})
</script>
