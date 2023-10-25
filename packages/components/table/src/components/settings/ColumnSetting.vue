<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ '列设置23' }}</span>
    </template>
    <Popover
      placement="bottomLeft"
      trigger="click"
      :overlay-class-name="`${prefixCls}__cloumn-list`"
      :get-popup-container="getPopupContainer"
      @visible-change="handleVisibleChange"
    >
      <template #title>
        <div :class="`${prefixCls}__popover-title`">
          <Checkbox
            v-model:checked="checkAll"
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
          >
            {{ '列展示' }}
          </Checkbox>

          <Checkbox v-model:checked="checkIndex" @change="handleIndexCheckChange">
            {{ '序号列' }}
          </Checkbox>

          <Checkbox
            v-model:checked="checkSelect"
            :disabled="!defaultRowSelection"
            @change="handleSelectCheckChange"
          >
            {{ '勾选列' }}
          </Checkbox>

          <a-button size="small" type="link" @click="reset">
            {{ '重置' }}
          </a-button>
        </div>
      </template>

      <template #content>
        <ScrollContainer>
          <CheckboxGroup ref="columnListRef" v-model:value="checkedList" @change="onChange">
            <template v-for="item in plainOptions" :key="item.value">
              <div v-if="!('ifShow' in item && !item.ifShow)" :class="`${prefixCls}__check-item`">
                <DragOutlined class="table-column-drag-icon" />
                <Checkbox :value="item.value">
                  {{ item.label }}
                </Checkbox>

                <Tooltip
                  placement="bottomLeft"
                  :mouse-leave-delay="0.4"
                  :get-popup-container="getPopupContainer"
                >
                  <template #title>
                    {{ '固定到左侧' }}
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-left`,
                      {
                        active: item.fixed === 'left',
                        disabled: !checkedList.includes(item.value),
                      },
                    ]"
                    @click="handleColumnFixed(item, 'left')"
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip
                  placement="bottomLeft"
                  :mouse-leave-delay="0.4"
                  :get-popup-container="getPopupContainer"
                >
                  <template #title>
                    {{ '固定到右侧' }}
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-right`,
                      {
                        active: item.fixed === 'right',
                        disabled: !checkedList.includes(item.value),
                      },
                    ]"
                    @click="handleColumnFixed(item, 'right')"
                  />
                </Tooltip>
              </div>
            </template>
          </CheckboxGroup>
        </ScrollContainer>
      </template>
      <SettingOutlined />
    </Popover>
  </Tooltip>
</template>
<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, toRefs, unref, watchEffect } from 'vue'
import { Button, Checkbox, Divider, Popover, Tooltip } from 'ant-design-vue'
import { DragOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { cloneDeep, omit } from 'lodash-es'
import { useSortable } from '@tav-ui/hooks/web/useSortable'
import { isFunction, isNullAndUnDef } from '@tav-ui/utils/is'
import { getPopupContainer as getParentContainer } from '@tav-ui/utils/basic'
import ScrollContainer from '@tav-ui/components/container-scroll'
import Icon from '@tav-ui/components/icon'
import { useTableContext } from '../../hooks/useTableContext'
import type { BasicColumn, ColumnChangeParam } from '../../types/table'

interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}
type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

interface ChangeEvent extends Event {
  target: HTMLInputElement
}

interface State {
  checkAll: boolean
  checkedList: string[]
  defaultCheckList: string[]
}

interface Options {
  label: string
  value: string
  fixed?: boolean | 'left' | 'right'
}

export default defineComponent({
  name: 'ColumnSetting',
  components: {
    SettingOutlined,
    Popover,
    Tooltip,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    DragOutlined,
    ScrollContainer,
    Divider,
    Icon,
    AButton: Button,
  },
  emits: ['columns-change'],

  setup(_, { emit, attrs }) {
    const table = useTableContext()

    const defaultRowSelection = omit(table.getRowSelection(), 'selectedRowKeys')
    let inited = false

    const cachePlainOptions = ref<Options[]>([])
    const plainOptions = ref<Options[]>([])

    const plainSortOptions = ref<Options[]>([])

    const columnListRef = ref<ComponentRef>(null)

    const state = reactive<State>({
      checkAll: true,
      checkedList: [],
      defaultCheckList: [],
    })

    const checkIndex = ref(false)
    const checkSelect = ref(false)

    const prefixCls = 'ta-basic-column-setting'

    const getValues = computed(() => {
      return unref(table?.getBindValues)
    })

    watchEffect(() => {
      const columns = table.getColumns()
      if (columns.length) {
        init()
      }
    })

    watchEffect(() => {
      const values = unref(getValues)
      checkIndex.value = !!values?.showIndexColumn
      checkSelect.value = !!values?.rowSelection
    })

    function getColumns() {
      const ret: Options[] = []
      table.getColumns({ ignoreIndex: true, ignoreAction: true }).forEach((item) => {
        ret.push({
          label: (item.title as string) || (item.customTitle as string),
          value: (item.dataIndex || item.title) as string,
          ...item,
        })
      })
      return ret
    }

    function init() {
      const columns = getColumns()

      const checkList = table
        .getColumns({ ignoreAction: true })
        .map((item) => {
          if (item.defaultHidden) {
            return ''
          }
          return item.dataIndex || item.title
        })
        .filter(Boolean) as string[]

      if (!plainOptions.value.length) {
        plainOptions.value = columns
        plainSortOptions.value = columns
        cachePlainOptions.value = columns
        state.defaultCheckList = checkList
      } else {
        // const fixedColumns = columns.filter((item) =>
        //   Reflect.has(item, 'fixed')
        // ) as BasicColumn[];

        unref(plainOptions).forEach((item: BasicColumn) => {
          const findItem = columns.find((col: BasicColumn) => col.dataIndex === item.dataIndex)
          if (findItem) {
            item.fixed = findItem.fixed
          }
        })
      }
      state.checkedList = checkList
    }

    // checkAll change
    function onCheckAllChange(e: ChangeEvent) {
      const checkList = plainOptions.value.map((item) => item.value)
      if (e.target.checked) {
        state.checkedList = checkList
        setColumns(checkList)
      } else {
        state.checkedList = []
        setColumns([])
      }
    }

    const indeterminate = computed(() => {
      const len = plainOptions.value.length
      let checkedLen = state.checkedList.length
      unref(checkIndex) && checkedLen--
      return checkedLen > 0 && checkedLen < len
    })

    // Trigger when check/uncheck a column
    function onChange(checkedList: string[]) {
      const len = plainSortOptions.value.length
      state.checkAll = checkedList.length === len
      const sortList = unref(plainSortOptions).map((item) => item.value)
      checkedList.sort((prev, next) => {
        return sortList.indexOf(prev) - sortList.indexOf(next)
      })
      setColumns(checkedList)
    }

    // reset columns
    function reset() {
      state.checkedList = [...state.defaultCheckList]
      state.checkAll = true
      plainOptions.value = unref(cachePlainOptions)
      plainSortOptions.value = unref(cachePlainOptions)
      setColumns(table.getCacheColumns())
    }

    // Open the pop-up window for drag and drop initialization
    function handleVisibleChange() {
      if (inited) return
      nextTick(() => {
        const columnListEl = unref(columnListRef)
        if (!columnListEl) return
        const el = columnListEl.$el as any
        if (!el) return
        // Drag and drop sort
        const { initSortable } = useSortable(el, {
          handle: '.table-column-drag-icon',
          onEnd: (evt: { oldIndex: any; newIndex: any }) => {
            const { oldIndex, newIndex } = evt
            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return
            }
            // Sort column
            const columns = cloneDeep(plainSortOptions.value)

            if (oldIndex > newIndex) {
              columns.splice(newIndex, 0, columns[oldIndex])
              columns.splice(oldIndex + 1, 1)
            } else {
              columns.splice(newIndex + 1, 0, columns[oldIndex])
              columns.splice(oldIndex, 1)
            }

            plainSortOptions.value = columns
            setColumns(columns)
          },
        })
        initSortable()
        inited = true
      })
    }

    // Control whether the serial number column is displayed
    function handleIndexCheckChange(e: ChangeEvent) {
      table.setProps({
        showIndexColumn: e.target.checked,
      })
    }

    // Control whether the check box is displayed
    function handleSelectCheckChange(e: ChangeEvent) {
      table.setProps({
        rowSelection: e.target.checked ? defaultRowSelection : undefined,
      })
    }

    function handleColumnFixed(item: BasicColumn, fixed?: 'left' | 'right') {
      if (!state.checkedList.includes(item.dataIndex as string)) return

      const columns = getColumns() as BasicColumn[]
      const isFixed = item.fixed === fixed ? false : fixed
      const index = columns.findIndex((col) => col.dataIndex === item.dataIndex)
      if (index !== -1) {
        columns[index].fixed = isFixed
      }
      item.fixed = isFixed

      if (isFixed && !item.width) {
        item.width = 100
      }
      table.setCacheColumnsByField?.(item.dataIndex, { fixed: isFixed })
      setColumns(columns)
    }

    function setColumns(columns: BasicColumn[] | string[]) {
      table.setColumns(columns)
      const data: ColumnChangeParam[] = unref(plainSortOptions).map((col) => {
        const visible =
          columns.findIndex(
            (c: BasicColumn | string) =>
              c === col.value || (typeof c !== 'string' && c.dataIndex === col.value)
          ) !== -1
        return { dataIndex: col.value, fixed: col.fixed, visible }
      })

      emit('columns-change', data)
    }

    function getPopupContainer() {
      return isFunction(attrs.getPopupContainer) ? attrs.getPopupContainer() : getParentContainer()
    }

    return {
      ...toRefs(state),
      indeterminate,
      onCheckAllChange,
      onChange,
      plainOptions,
      reset,
      prefixCls,
      columnListRef,
      handleVisibleChange,
      checkIndex,
      checkSelect,
      handleIndexCheckChange,
      handleSelectCheckChange,
      defaultRowSelection,
      handleColumnFixed,
      getPopupContainer,
    }
  },
})
</script>
