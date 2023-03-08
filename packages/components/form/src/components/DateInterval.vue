<template>
  <div class="date-range-wrapper">
    <RangePicker
      :allow-clear="false"
      format="YYYY-MM"
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
          <MenuItem v-for="item in dateRangeList" :key="item.key">
            <span>{{ item.label }}</span>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import { Dropdown, Menu, MenuItem, RangePicker } from 'ant-design-vue'
import { TaButton } from '@tav-ui/components/button'
import { formatToDate } from '@tav-ui/utils/dateUtil'

const dateRangeList = [
  // { label: '今天', key: 'day', dateRange: [moment().startOf('day'), moment().endOf('day')] },
  // { label: '本周', key: 'week', dateRange: [moment().startOf('week'), moment().endOf('week')] },
  {
    label: '本月',
    key: 'month',
    dateRange: [moment().startOf('month'), moment().endOf('month')],
  },
  // {
  //   label: '本季度',
  //   key: 'quarter',
  //   dateRange: [moment().startOf('quarter'), moment().endOf('quarter')],
  // },
  {
    label: '第一季度',
    key: 'quarter_1',
    dateRange: [moment().quarter(1).startOf('quarter'), moment().quarter(1).endOf('quarter')],
  },
  {
    label: '第二季度',
    key: 'quarter_2',
    dateRange: [moment().quarter(2).startOf('quarter'), moment().quarter(2).endOf('quarter')],
  },
  {
    label: '第三季度',
    key: 'quarter_3',
    dateRange: [moment().quarter(3).startOf('quarter'), moment().quarter(3).endOf('quarter')],
  },
  {
    label: '第四季度',
    key: 'quarter_4',
    dateRange: [moment().quarter(4).startOf('quarter'), moment().quarter(4).endOf('quarter')],
  },
  {
    label: '本年',
    key: 'year',
    dateRange: [moment().startOf('year'), moment().endOf('year')],
  },
  {
    label: '上一年度',
    key: 'lastYear',
    dateRange: [
      moment().subtract(1, 'year').startOf('year'),
      moment().subtract(1, 'year').endOf('year'),
    ],
  },
  // {
  //   label: '下一年度',
  //   key: 'nextYear',
  //   dateRange: [moment().add(1, 'year').startOf('year'), moment().add(1, 'year').endOf('year')],
  // },
]

export default defineComponent({
  name: 'DateInterval',
  components: { RangePicker, Dropdown, TaButton, MenuItem, Menu },
  props: { defaultRange: { type: String, default: () => 'month' } },
  emits: ['change', 'search', 'getCurDate'],
  setup(props, { emit }) {
    // 当前时间区间
    const currentRange = ref(props.defaultRange)
    // 当前默认时间
    const currentDate = ref<any>(
      dateRangeList
        .find((x) => x.key === unref(currentRange))
        ?.dateRange.map((el) => el.format('YYYY-MM-DD'))
    )

    // 选中自定义时间触发
    const handleDateChange = (momentList) => {
      currentRange.value = ''
      currentDate.value = [
        moment(momentList[0]).startOf('month'),
        moment(momentList[1]).endOf('month'),
      ].map((el) => el.format('YYYY-MM-DD'))
      handleEmitEvent()
    }

    // 选中时间区间触发
    const handleRangeChange = ({ key }) => {
      currentRange.value = key
      currentDate.value = dateRangeList
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
      dateRangeList,
      currentRange,
      currentDate,
      handleDateChange,
      handleRangeChange,
    }
  },
})
</script>
