import { defineComponent, renderSlot } from 'vue'
import { provideGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { configProviderProps } from './types'

export default defineComponent({
  name: 'TaConfigProvider',
  props: configProviderProps,

  setup(props, { slots }) {
    const config = provideGlobalConfig(props)
    return () => renderSlot(slots, 'default', { config: config?.value })
  },
})
