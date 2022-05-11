<template>
  <BasicTitle v-if="getTitle" :class="prefixCls" :help-message="helpMessage">
    {{ getTitle }}
  </BasicTitle>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { isFunction } from '@tav-ui/utils/is'
import BasicTitle from '@tav-ui/components/basic-title'
import type { PropType } from 'vue'

type Recordable<T = any> = Record<string, T>

export default defineComponent({
  name: 'BasicTableTitle',
  components: { BasicTitle },
  props: {
    title: {
      type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
    },
    getSelectRows: {
      type: Function as PropType<() => Recordable[]>,
    },
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
  },
  setup(props) {
    const prefixCls = 'ta-basic-table-title'

    const getTitle = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const { title, getSelectRows = () => {} } = props
      let tit = title

      if (isFunction(title)) {
        tit = title({
          selectRows: getSelectRows(),
        })
      }
      return tit
    })

    return { getTitle, prefixCls }
  },
})
</script>
