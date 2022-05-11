<script lang="tsx">
import { defineComponent, toRefs, unref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import { extendSlots } from '@tav-ui/utils/helper/tsxHelper'
import { useModalDragMove } from '../hooks/useModalDrag'
import { basicProps } from '../types'
import type { Recordable } from '../types'
export default defineComponent({
  name: 'BasicModal',
  inheritAttrs: false,
  props: basicProps,
  emits: ['cancel'],
  setup(props, { slots, emit }) {
    const { visible, draggable, destroyOnClose } = toRefs(props)
    const attrs = useAttrs()
    useModalDragMove({
      visible,
      destroyOnClose,
      draggable,
    })

    const handleCancel = (e: Event) => {
      emit('cancel', e)
    }

    return () => {
      const propsData = { ...unref(attrs), ...props } as Recordable
      return (
        <Modal {...propsData} onCancel={handleCancel}>
          {extendSlots(slots)}
        </Modal>
      )
    }
  },
})
</script>
