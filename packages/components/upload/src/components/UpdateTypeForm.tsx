import { type PropType, defineComponent } from 'vue'
import { Select } from 'ant-design-vue'
import type { Handler } from '../main'
import type { FileItemType, Fn } from '../types'

export const UpdateTypeForm = defineComponent({
  props: {
    row: { type: Object as PropType<FileItemType>, required: true },
    handler: Object as PropType<Handler>,
    customOptions: Array as PropType<any[]>,
    onSelect: Function as PropType<Fn>,
    onChange: Function,
  },
  setup(props, { attrs }) {
    return () => (
      <Select
        {...attrs}
        value={props.row.typeCode}
        style="width: 200px"
        options={props.customOptions}
        onSelect={props.onSelect}
        onChange={(typeCode, option) => {
          props.onChange?.(option, () =>
            props.handler?.apis.updateFileType?.(props.row.id!, typeCode)
          )
        }}
        getPopupContainer={(target) => target.parentElement}
      />
    )
  },
})
