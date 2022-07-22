import { computed, defineComponent, unref } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { CamelCaseToCls, ComponentCellName, TOOLTIP_PLACEMENT } from '../const'
import { useTableContext } from '../hooks/useTableContext'
import { useFormats } from '../utils/formats'
import type { RendererOptions } from 'vxe-table'
import type { PropType } from 'vue'
import type { TableProColumn } from '../types'

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

    const createTooltipTitle = (type = '') => {
      if (!type) return <></>
      return <span class={`${ComponentPrefixCls}--tooltip-title`}>{slots.default?.()}</span>
    }

    const createContent = (type = '', hasTooltip = false) => {
      if (!type) return <></>
      const clsPrefix = `${hasTooltip ? `${ComponentPrefixCls}--tooltip` : ''}`
      return <div class={`${clsPrefix}`}>{slots.default?.()}</div>
    }

    const createCell = () => {
      // const typeMapShowTooltip = {
      //   header: 'showHeaderTooltip',
      //   body: 'showTooltip',
      //   footer: 'showFooterTooltip',
      // }

      const isTableHasTooltip = unref(tablePropsRef).showTooltip
      // const isColumnHasTooltip = (unref(tablePropsRef).columns as TableProColumn[])?.find(
      //   (column) => column.field === props.column.field
      // )?.showTooltip
      // const hasTooltip = isUnDef(isColumnHasTooltip) ? isTableHasTooltip : isColumnHasTooltip
      const hasTooltip = isTableHasTooltip

      if (hasTooltip) {
        return (
          <Tooltip placement={TOOLTIP_PLACEMENT} destroyTooltipOnHide={true}>
            {{
              title: () => createTooltipTitle(props.type),
              default: () => createContent(props.type, true),
            }}
          </Tooltip>
        )
      } else {
        return createContent(props.type)
      }
    }

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
          {/* {createCell()} */}
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
