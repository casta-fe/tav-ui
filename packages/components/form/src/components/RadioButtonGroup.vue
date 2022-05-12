<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Radio } from 'ant-design-vue'
import { useRuleFormItem } from '@tav-ui/hooks/component/useFormItem'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import { isString } from '@tav-ui/utils/is'
import type { PropType } from 'vue'
import type { RadioButtonGroupOptionItem, RadioButtonGroupOptionsItem } from './types'

export default defineComponent({
  name: 'RadioButtonGroup',
  components: {
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
  },
  props: {
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
    },
    options: {
      type: Array as PropType<RadioButtonGroupOptionItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const attrs = useAttrs()
    // Embedded in the form, just use the hook binding to perform form verification
    const [state] = useRuleFormItem(props)

    // Processing options value
    const getOptions = computed((): RadioButtonGroupOptionsItem[] => {
      const { options } = props
      if (!options || options?.length === 0) return []

      const isStringArr = options.some((item) => isString(item))
      if (!isStringArr) return options as RadioButtonGroupOptionsItem[]

      return options.map((item) => ({ label: item, value: item })) as RadioButtonGroupOptionsItem[]
    })

    return { state, getOptions, attrs }
  },
})
</script>
<template>
  <RadioGroup v-bind="attrs" v-model:value="state" button-style="solid">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <RadioButton :value="item.value" :disabled="item.disabled">
        {{ item.label }}
      </RadioButton>
    </template>
  </RadioGroup>
</template>
