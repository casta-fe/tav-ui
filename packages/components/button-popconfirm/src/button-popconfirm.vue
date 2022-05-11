<script lang="ts">
import { computed, defineComponent, h, unref } from 'vue'
import { Popconfirm } from 'ant-design-vue'
import { omit } from 'lodash-es'
import { extendSlots } from '@tav-ui/utils/helper/tsxHelper'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import BasicButton from '@tav-ui/components/button'
import { buttonPopconfirmProps } from './types'

declare type Recordable<T = any> = Record<string, T>

export default defineComponent({
  name: 'TaButtonPopConfirm',
  inheritAttrs: false,
  props: buttonPopconfirmProps,
  setup(props, { slots }) {
    const attrs = useAttrs()

    // get inherit binding value
    const getBindValues = computed(() => {
      return Object.assign(
        {
          okText: '确认',
          cancelText: '取消',
        },
        { ...props, ...unref(attrs) }
      )
    })

    return () => {
      const bindValues = omit(unref(getBindValues), 'icon')
      const btnBind = omit(bindValues, 'title') as Recordable
      if (btnBind.disabled) btnBind.color = ''
      const Button = h(BasicButton, btnBind, extendSlots(slots))

      // If it is not enabled, it is a normal button
      if (!props.enable) return Button

      return h(Popconfirm, bindValues, { default: () => Button })
    }
  },
})
</script>
