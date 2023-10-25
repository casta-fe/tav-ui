<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ tavI18n('Tav.common.redo') }}</span>
    </template>
    <RedoOutlined @click="redo" />
  </Tooltip>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { RedoOutlined } from '@ant-design/icons-vue'
import { tavI18n } from '@tav-ui/locales'
import { useTableContext } from '../../hooks/useTableContext'

export default defineComponent({
  name: 'RedoSetting',
  components: {
    RedoOutlined,
    Tooltip,
  },
  setup() {
    const table = useTableContext()

    function redo() {
      table.reload()
    }

    return { redo, tavI18n }
  },
})
</script>
