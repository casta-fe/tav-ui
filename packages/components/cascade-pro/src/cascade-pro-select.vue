<template>
  <Modal
    :title="getBindValue.title"
    :visible="visible"
    :width="800"
    closable
    destroy-on-close
    wrap-class-name="ta-cascade-pro-modal"
    @cancel="handleCancel"
  >
    <CascadePro ref="cascadeProRef" v-bind="getBindValue" />
    <template #footer>
      <Button type="primary" @click="handleConfirm">确定</Button>
      <Button @click="handleCancel">取消</Button>
    </template>
  </Modal>

  <div class="ta-cascade-pro-select ant-input" @click="handleClick">
    <span v-if="!selectOptions.length" style="color: rgba(60, 60, 60, 0.33)">
      {{ getBindValue.placeholder }}
    </span>
    <Tag v-for="option in selectOptions" v-else :key="option.idPath">
      {{ option.namePath }}
    </Tag>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, unref, watch } from 'vue'
import { Tag } from 'ant-design-vue'
import Modal from '@tav-ui/components/modal'
import Button from '@tav-ui/components/button'
import { cascadeProSelectProps } from './types'
import CascadePro from './components/cascade-pro.vue'
import { DEFAULT_CASCADE_PRO_OPTIONS_KEY_CONFIG } from './constants'
import type { CascadeProOption } from './types'
import type { CascadeProInstance } from './components/cascade-pro.vue'

export default defineComponent({
  name: 'TaCascadeProSelect',
  components: { Tag, Modal, Button, CascadePro },
  inheritAttrs: false,
  props: cascadeProSelectProps,
  emits: ['change'],
  setup(props, { attrs, emit }) {
    const cascadeProRef = ref<CascadeProInstance | null>(null)
    const visible = ref<boolean>(false)
    const selectValue = ref<CascadeProOption[]>([])
    const selectDefaultValue = ref<CascadeProOption[]>(props.value)

    const handleFormItemResult = (options: CascadeProOption[]) => {
      if (unref(options).length > props.maxTagCount) {
        const rest = unref(selectValue).slice(0, props.maxTagCount)
        const ellipse: CascadeProOption = {
          id: 'cascade-prop-ellipse',
          idPath: 'cascade-prop-ellipse',
          pid: 'cascade-prop-ellipse-pid',
          name: `+${unref(selectValue).length - props.maxTagCount}...`,
          namePath: `+${unref(selectValue).length - props.maxTagCount}...`,
        }
        return [...rest, ellipse]
      }

      return unref(options)
    }

    const handleSelectResult = (options: CascadeProOption[], type: 'inner' | 'outer' = 'inner') => {
      if (type === 'inner') {
        return unref(options).map((option) => {
          const temp: CascadeProOption = { ...option }
          for (const [k, v] of Object.entries(DEFAULT_CASCADE_PRO_OPTIONS_KEY_CONFIG)) {
            if (option[k]) {
              temp[v] = option[k]
            }
          }

          const idPathSplitResult = temp.idPath.split('-')
          const namePathSplitResult = temp.namePath.split('-')
          for (let i = 0; i < props.fields.length; i++) {
            const key = props.fields[i]
            temp[key] = idPathSplitResult[i]
            temp[`${key}Name`] = namePathSplitResult[i]
          }
          return temp
        })
      } else {
        return unref(options).map((option) => {
          const temp: CascadeProOption = { ...option }
          const fields = props.fields
          let idPath = ''
          let namePath = ''
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i]
            if (option[field]) {
              idPath = idPath ? `${idPath}-${option[field]}` : option[field]
              namePath = namePath ? `${namePath}-${option[`${field}Name`]}` : option[`${field}Name`]
            }
          }

          return {
            ...temp,
            idPath,
            namePath,
          }
        })
      }
    }

    const handleConfirm = () => {
      handleCancel()
    }

    const selectOptions = computed(() => {
      if (unref(selectValue).length) {
        // 内部选中
        return handleFormItemResult(unref(selectValue))
      } else {
        // 外部传入
        return handleFormItemResult(handleSelectResult(props.value, 'outer'))
      }
    })

    const getBindValue = computed(() => ({
      ...props,
      ...attrs,
      defaultValue: selectDefaultValue as any,
    }))

    const handleCancel = async () => {
      if (!props.disabled) {
        visible.value = false

        const result = (unref(cascadeProRef)?.selectResultRef?.options || []) as CascadeProOption[]
        selectValue.value = handleSelectResult(result)
        selectDefaultValue.value = unref(selectValue)
        await nextTick()

        emit('change', unref(selectDefaultValue))
      }
    }

    const handleClick = () => {
      if (!props.disabled) {
        visible.value = true
      }
    }

    return {
      cascadeProRef,
      getBindValue,
      visible,
      selectValue,
      selectOptions,
      handleConfirm,
      handleCancel,
      handleClick,
    }
  },
})
</script>
