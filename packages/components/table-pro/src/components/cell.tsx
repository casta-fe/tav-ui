import { computed, defineComponent, unref } from 'vue'
import { CamelCaseToCls, ComponentCellName, ComponentEditCellName } from '../const'
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
    params: {
      type: Object as any,
      required: true,
    },
  },
  setup(props, { slots, attrs }) {
    const { tablePropsRef, customCell } = useTableContext()

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
        <div
          class={ComponentPrefixCls}
          data-type={props.type}
          onMouseenter={(e) => customCell.onMouseenter({ ...props.params, cell: e.target })}
          onMouseleave={(e) => customCell.onMouseleave({ ...props.params, cell: e.target })}
        >
          <div class={unref(getContentClass)}>{slots.default?.()}</div>
        </div>
      )
    }
  },
})

function createOptions(type: 'normal' | 'edit'): RendererOptions {
  const DEFAULT_OPTIONS: RendererOptions = {
    renderHeader(opt, params) {
      const { column } = params
      return [
        column.visible ? (
          <Cell type="header" column={column} params={params}>
            {column.title}
          </Cell>
        ) : (
          <></>
        ),
      ]
    },
    renderFooter(opt, params) {
      const { column, $columnIndex, items } = params
      return [
        items && items.length > 1 ? (
          <Cell type="footer" column={column} params={params}>
            {items[$columnIndex]}
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
          <Cell type="body" column={column} params={params}>
            {customRender ? customRender(params) : useFormats(params) || row[column.field]}
          </Cell>
        ) : (
          <></>
        ),
      ]
    },
  }

  if (type === 'edit') {
    const renderCell = DEFAULT_OPTIONS.renderDefault
    Reflect.deleteProperty(DEFAULT_OPTIONS, 'renderDefault')
    return { ...DEFAULT_OPTIONS, renderCell }
  }
  return DEFAULT_OPTIONS
}

export const VxeCellRenderer: {
  name: string
  options: RendererOptions
} = {
  name: ComponentCellName,
  options: createOptions('normal'),
}

export const VxeCellEditRenderer: {
  name: string
  options: RendererOptions
} = {
  name: ComponentEditCellName,
  options: {
    ...createOptions('edit'),
    renderEdit(opt, params) {
      const { options } = opt
      const { customEditRender } = options![0]
      const { row, column } = params

      return [
        column.visible ? customEditRender ? customEditRender(params) : row[column.field] : <></>,
      ]
    },
  },
}
