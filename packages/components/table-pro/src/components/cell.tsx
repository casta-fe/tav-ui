import { computed, defineComponent, unref } from 'vue'
import { CamelCaseToCls, ComponentCellName } from '../const'
import { useTableContext } from '../hooks/useTableContext'
import { useFormats } from '../utils/formats'
import type { TableProColumn } from '../types'
import type { RendererOptions } from 'vxe-table'
import type { PropType } from 'vue'

const ComponentPrefixCls = CamelCaseToCls(ComponentCellName)
export const ContentPrefixCls = CamelCaseToCls(`${ComponentCellName}Content`)

export const Cell = defineComponent({
  name: ComponentCellName,
  props: {
    type: {
      type: String,
      required: true,
    },
    column: {
      type: Object as PropType<TableProColumn>,
      required: true,
    },
  },
  setup(props, { slots, attrs }) {
    const { tablePropsRef } = useTableContext()

    // 类名处理
    const getContentClass = computed(() => {
      return [
        // ComponentPrefixCls,
        attrs.class,
        `${ContentPrefixCls}`,
        {
          [`-ellipsis`]: unref(tablePropsRef).fixedLineHeight,
        },
      ]
    })

    return () => {
      return (
        <div class={ComponentPrefixCls} data-type={props.type}>
          <div class={unref(getContentClass)}>{slots.default?.()}</div>
        </div>
      )
    }
  },
})

export const VxeCellRenderer: {
  name: string
  options: RendererOptions
} = {
  name: ComponentCellName,
  options: {
    renderHeader() {
      // eslint-disable-next-line prefer-rest-params
      const params = arguments[1]
      const { column } = params
      return [
        column.visible ? (
          <Cell type="header" column={column}>
            {column.title}
          </Cell>
        ) : (
          <></>
        ),
      ]
    },
    renderDefault(opt, params) {
      const { options } = opt
      const { customRender } = options![0]
      const { row, column } = params

      return [
        column.visible ? (
          <Cell type="body" column={column}>
            {customRender ? customRender(params) : useFormats(params) || row[column.field]}
          </Cell>
        ) : (
          <></>
        ),
      ]
    },
  },
}
