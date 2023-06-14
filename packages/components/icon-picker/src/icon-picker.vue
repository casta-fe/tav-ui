<script lang="ts">
// import svgIcons from "virtual:svg-icons-names";
import { defineComponent, ref, unref, watch, watchEffect } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Empty, Input, Pagination, Popover } from 'ant-design-vue'
import { useCopyToClipboard } from '@tav-ui/hooks/web/useCopyToClipboard'
import { usePagination } from '@tav-ui/hooks/web/usePagination'
import ScrollContainer from '@tav-ui/components/container-scroll'
import Icon from '@tav-ui/components/icon'
import SvgIcon from '@tav-ui/components/icon-svg'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import iconsData from '../data/icons.data'
import { iconPickerProps } from './types'
import type { ChangeEvent } from './types'

const AInput = Input
const APopover = Popover
const APagination = Pagination
const AEmpty = Empty

const { createMessage } = useMessage()

export default defineComponent({
  name: 'TaIconPicker',
  components: { AInput, APopover, APagination, AEmpty, ScrollContainer, SvgIcon, Icon },
  props: iconPickerProps,
  emits: ['change', 'update:value'],
  setup(props, { emit }) {
    function getIcons() {
      const data = iconsData as any
      const prefix: string = data?.prefix ?? ''
      let result: string[] = []
      if (prefix) result = (data?.icons ?? []).map((item) => `${prefix}:${item}`)
      else if (Array.isArray(iconsData)) result = iconsData as string[]

      return result
    }

    const isSvgMode = props.mode === 'svg'
    const icons = getIcons()

    const currentSelect = ref('')
    const visible = ref(false)
    const currentList = ref(icons)

    const prefixCls = 'ta-icon-picker'

    const debounceHandleSearchChange = useDebounceFn(handleSearchChange, 100)
    const { clipboardRef, isSuccessRef } = useCopyToClipboard(props.value)

    const { getPaginationList, getTotal, setCurrentPage } = usePagination(
      currentList,
      props.pageSize
    )

    watchEffect(() => {
      currentSelect.value = props.value
    })

    watch(
      () => currentSelect.value,
      (v) => {
        emit('update:value', v)
        return emit('change', v)
      }
    )

    function handlePageChange(page: number) {
      setCurrentPage(page)
    }

    function handleClick(icon: string) {
      currentSelect.value = icon
      if (props.copy) {
        clipboardRef.value = icon
        if (unref(isSuccessRef)) createMessage.success('复制图标成功')
      }
    }

    function handleSearchChange(e: ChangeEvent) {
      const value = e.target.value
      if (!value) {
        setCurrentPage(1)
        currentList.value = icons
        return
      }
      currentList.value = icons.filter((item) => item.includes(value))
    }
    return {
      isSvgMode,
      icons,
      currentSelect,
      visible,
      currentList,
      prefixCls,
      debounceHandleSearchChange,
      getPaginationList,
      handleClick,
      getTotal,
      handlePageChange,
    }
  },
})
</script>
<template>
  <AInput
    v-model:value="currentSelect"
    disabled
    :style="{ width }"
    placeholder="点击选择图标"
    :class="prefixCls"
  >
    <template #addonAfter>
      <a-popover
        v-model="visible"
        placement="bottomLeft"
        trigger="click"
        :overlay-class-name="`${prefixCls}-popover`"
      >
        <template #title>
          <div class="flex justify-between">
            <AInput placeholder="搜索图标" allow-clear @change="debounceHandleSearchChange" />
          </div>
        </template>

        <template #content>
          <div v-if="getPaginationList.length">
            <ScrollContainer class="border border-solid border-t-0">
              <ul class="flex flex-wrap px-2">
                <li
                  v-for="icon in getPaginationList"
                  :key="icon"
                  :class="currentSelect === icon ? 'border border-primary' : ''"
                  class="p-2 w-1/8 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid hover:border-primary"
                  :title="icon"
                  @click="handleClick(icon)"
                >
                  <!-- <Icon :icon="icon" :prefix="prefix" /> -->
                  <SvgIcon v-if="isSvgMode" :name="icon" />
                  <Icon v-else :icon="icon" />
                </li>
              </ul>
            </ScrollContainer>
            <div v-if="getTotal >= pageSize" class="flex py-2 items-center justify-center">
              <a-pagination
                show-less-items
                size="small"
                :page-size="pageSize"
                :total="getTotal"
                @change="handlePageChange"
              />
            </div>
          </div>
          <template v-else>
            <div class="p-5">
              <a-empty />
            </div>
          </template>
        </template>

        <span v-if="isSvgMode && currentSelect" class="cursor-pointer px-2 py-1 flex items-center">
          <SvgIcon :name="currentSelect" />
        </span>
        <Icon v-else :icon="currentSelect || 'ion:apps-outline'" class="cursor-pointer px-2 py-1" />
      </a-popover>
    </template>
  </AInput>
</template>
