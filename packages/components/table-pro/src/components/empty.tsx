import { defineComponent } from 'vue'
import { Empty } from 'ant-design-vue'
import { CamelCaseToCls, ComponentEmptyName } from '../const'

const ComponentPrefixCls = CamelCaseToCls(ComponentEmptyName)

export default defineComponent({
  name: ComponentEmptyName,
  setup() {
    return () => (
      <Empty
        class={ComponentPrefixCls}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={'暂无数据'}
      />
    )
  },
})
