<template>
  <div class="date-interval-wrapper">
    <RangePicker
      :allow-clear="allowClear"
      :value-format="valueFormat"
      :format="format"
      :value="currentDate"
      @change="handleDateChange"
    />

    <Dropdown trigger="click">
      <TaButton pre-icon="ant-design:calendar-filled" />
      <template #overlay>
        <Menu :selected-keys="[currentRange]" @click="handleRangeChange">
          <MenuItem v-for="item in computedDateRangeList" :key="item.key">
            <span>{{ item.label }}</span>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import { type PropType, computed, defineComponent, onMounted, ref, unref, watch } from 'vue'
import dayjs, { type OpUnitType } from 'dayjs'
import { Dropdown, Menu, MenuItem, RangePicker } from 'ant-design-vue'
import { TaButton } from '@tav-ui/components/button'
import { formatToDateTime } from '@tav-ui/utils/dateUtil'
import { getDateRangeRecord } from './types'
import type { Dayjs } from 'dayjs'
type DateRangeKeyType =
  | 'day'
  | 'year'
  | 'month'
  | 'week'
  | 'quarter'
  | 'lastWeek'
  | 'lastMonth'
  | 'lastQuarter'
  | 'lastYear'
  | 'quarter_1'
  | 'quarter_2'
  | 'quarter_3'
  | 'quarter_4'
const defaultDateRangeKeyList: DateRangeKeyType[] = [
  'month',
  'quarter_1',
  'quarter_2',
  'quarter_3',
  'quarter_4',
  'year',
  'lastYear',
]
export default defineComponent({
  name: 'DateInterval',
  components: { RangePicker, Dropdown, TaButton, MenuItem, Menu },
  props: {
    value: { type: Array, default: () => [] },
    defaultRange: { type: String, default: () => 'month' },
    format: { type: String, default: 'YYYY-MM-DD' },
    valueFormat: { type: String, default: 'YYYY-MM-DD  HH:mm:ss' },
    allowClear: Boolean,
    dateRangeList: Array as PropType<any[]>,
    dateRangeKeyList: {
      type: Array as PropType<DateRangeKeyType[]>,
      default: () => defaultDateRangeKeyList,
    },
    autoChoose: { type: String as PropType<any | 'none'>, default: 'month' },
  },
  emits: ['change', 'search', 'getCurDate'],
  setup(props, { emit }) {
    const dateRangeRecord = getDateRangeRecord()
    type DateRangeRecordType = typeof dateRangeRecord
    type DateRangeValueType = DateRangeRecordType[DateRangeKeyType]
    const computedDateRangeList = computed<DateRangeValueType[]>(() => {
      if (props.dateRangeList) return props.dateRangeList

      const res: DateRangeValueType[] = []
      for (const key of props.dateRangeKeyList) {
        res.push(dateRangeRecord[key])
      }
      return res
    })

    // 当前时间区间
    const currentRange = ref(props.defaultRange)
    // 当前默认时间
    const currentDate = ref<any>(
      unref(computedDateRangeList)
        .find((x) => x.key === unref(currentRange))
        ?.dateRange?.map((x) => formatToDateTime(x)) || []
    )
    console.log(currentDate, currentRange)

    // 选中自定义时间触发
    const handleDateChange = (val: [string, string] | [Dayjs, Dayjs]) => {
      currentRange.value = ''
      const relVal = val || []
      if (val === null) {
        currentDate.value = []
      } else if (props.autoChoose === 'none') {
        currentDate.value = relVal
      } else {
        currentDate.value = [
          dayjs(relVal[0]).startOf(props.autoChoose as OpUnitType),
          dayjs(relVal[1]).endOf(props.autoChoose as OpUnitType),
        ].map((x) => formatToDateTime(x))
      }
      handleEmitEvent()
    }

    // 选中时间区间触发
    const handleRangeChange = ({ key }) => {
      currentRange.value = key
      currentDate.value = unref(computedDateRangeList).find((x) => x.key === key)?.dateRange
      handleEmitEvent()
    }

    const handleEmitEvent = () => {
      const data = (unref(currentDate) || []).map((v) => dayjs(v).format(props.valueFormat))
      emit('change', data)
      emit('search', data)
    }

    onMounted(() => {
      // 抛出当前默认时间
      const data = unref(currentDate) || []
      emit('getCurDate', data)
    })
    watch(
      () => props.value,
      (v) => {
        currentDate.value = [...props.value]
      }
    )

    return {
      computedDateRangeList,
      currentRange,
      currentDate,
      handleDateChange,
      handleRangeChange,
    }
  },
})
</script>
