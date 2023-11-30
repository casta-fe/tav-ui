<template>
  <div class="date-interval-wrapper">
    <RangePicker
      :allow-clear="allowClear"
      :format="format"
      :value="currentDate"
      @change="handleDateChange"
    />
    <!-- <RangePicker
      :allow-clear="false"
      :value="currentDate"
      :open="isOpen"
      :mode="[`month`, `month`]"
      format="YYYY-MM"
      dropdown-class-name="data-interval-footer"
      @open-change="onOpenChange"
      @panel-change="onPanelChange"
    >
      <template #renderExtraFooter>
        <TaButton type="primary" @click="handleOk">确定</TaButton>
        <TaButton @click="handleCancel">取消</TaButton>
      </template>
    </RangePicker> -->

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
import moment, { type unitOfTime } from 'moment'
import 'moment/dist/locale/zh-cn'
import { Dropdown, Menu, MenuItem, RangePicker } from 'ant-design-vue'
import { TaButton } from '@tav-ui/components/button'
import { formatToDate } from '@tav-ui/utils/dateUtil'
import { getDateRangeRecord } from './types'

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
    format: { type: String, default: 'YYYY-MM' },
    allowClear: Boolean,
    dateRangeList: Array as PropType<any[]>,
    dateRangeKeyList: {
      type: Array as PropType<DateRangeKeyType[]>,
      default: () => defaultDateRangeKeyList,
    },
    autoChoose: { type: String as PropType<unitOfTime.StartOf | 'none'>, default: 'month' },
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
        ?.dateRange.map((el) => el.format('YYYY-MM-DD'))
    )
    console.log(currentDate, currentRange)

    // 选中自定义时间触发
    const handleDateChange = (momentList) => {
      currentRange.value = ''
      if (props.allowClear && momentList.length === 0) {
        currentDate.value = []
      } else if (props.autoChoose === 'none') {
        currentDate.value = momentList
      } else {
        currentDate.value = [moment(momentList[0]), moment(momentList[1])].map((el) =>
          el.format('YYYY-MM-DD')
        )
      }
      handleEmitEvent()
    }

    // 选中时间区间触发
    const handleRangeChange = ({ key }) => {
      currentRange.value = key
      currentDate.value = unref(computedDateRangeList)
        .find((x) => x.key === key)
        ?.dateRange.map((el) => el.format('YYYY-MM-DD'))
      handleEmitEvent()
    }

    const handleEmitEvent = () => {
      emit(
        'change',
        unref(currentDate)?.map((x) => formatToDate(x))
      )
      emit(
        'search',
        unref(currentDate)?.map((x) => formatToDate(x))
      )
    }

    onMounted(() => {
      // 抛出当前默认时间
      emit(
        'getCurDate',
        unref(currentDate)?.map((x) => formatToDate(x))
      )
    })
    watch(
      () => props.value,
      (v) => {
        currentDate.value = v
      }
    )

    // const isOpen = ref(false)
    // const cacheDate = ref()
    // const onPanelChange = (v) => {
    //   // console.error(v.map((el) => el._d.getMonth() + 1))
    //   cacheDate.value = [moment(v[0]).startOf('month'), moment(v[1]).endOf('month')]
    // }
    // const onOpenChange = async (status) => {
    //   if (status) {
    //     isOpen.value = status
    //     currentDate.value = currentDate.value.map((el) => formatToDate(el))
    //     await nextTick()
    //     document
    //       .querySelector('.ant-calendar-range-right')
    //       ?.querySelector('.ant-calendar-month-panel-next-year-btn')
    //       ?.addEventListener('click', () => {
    //         console.log('!23')
    //         currentDate.value = [undefined, undefined]
    //       })
    //   }
    // }
    // const handleOk = () => {
    //   currentRange.value = ''
    //   currentDate.value = cacheDate.value
    //   handleEmitEvent()
    //   isOpen.value = false
    //   // console.log(currentDate.value.map((x) => formatToDate(x)))
    // }
    // const handleCancel = () => {
    //   isOpen.value = false
    // }

    return {
      // isOpen,
      // onPanelChange,
      // onOpenChange,
      // handleOk,
      // handleCancel,
      computedDateRangeList,
      currentRange,
      currentDate,
      handleDateChange,
      handleRangeChange,
    }
  },
})
</script>
