<template>
  <span class="name-letter" :class="'letter-' + ((index % 4) + 1)">
    {{ letter }}
  </span>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      letter: '',
      index: 0,
    })
    const pageInit = () => {
      const { name, phone } = props.value
      state.letter = name.substring(0, 1)
      state.index = phone.substring(10, 1)
    }
    onMounted(() => {
      pageInit()
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>
