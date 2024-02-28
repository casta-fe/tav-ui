import { defineComponent, reactive } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { formatToDateTime } from '@tav-ui/utils/dateUtil'
import type { PropType } from 'vue'
// import { getPopupContainer } from "/@/utils";

type Format = 'YYYY' | 'YYYY-01-01' | 'YYYY-01-01 00:00:00' | 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss'

export default defineComponent({
  name: 'YearPicker',
  props: {
    valueFormat: {
      type: String as PropType<Format>,
      default: 'YYYY-01-01 00:00:00',
    },
    getPopupContainer: Function as PropType<(...arg: any[]) => any>,
    // value: {
    //   type: String
    // }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const state = reactive({
      isopen: false,
      time: null as any,
    })

    return () => (
      <DatePicker
        value={state.time}
        open={state.isopen}
        mode="year"
        placeholder="请选择年份"
        format="YYYY"
        valueFormat={props.valueFormat}
        onOpenChange={(status) => {
          state.isopen = !!status
        }}
        onPanelChange={(v) => {
          state.time = v
          state.isopen = false
          emit('change', formatToDateTime(v, props.valueFormat))
        }}
        onChange={() => {
          state.time = null
          emit('change', undefined)
        }}
        getPopupContainer={props.getPopupContainer}
      />
    )
  },
})
