<script lang="ts">
// import { onBeforeRouteUpdate, useRouter } from "vue-router";
import { defineComponent, ref } from 'vue';
import Button from '../../button';
import type { ButtonItem } from './types';
import { buttonGroupProps } from './types';

export default defineComponent({
  name: 'TaButtonGroup',
  components: { Button },
  props: buttonGroupProps,
  emits: ['btnClick', 'update:active'],
  setup(props, { emit }) {
    const scrollRef = ref(null);
    // const router = useRouter();
    const getButtonValue = (route) => {
      // 如果是链接 那么就需要监听路由变化修改 选中的值
      if (props.islink) emit('update:active', route.path);
    };
    const clickHandle = (data: ButtonItem, index: number, event) => {
      if (data.value == props.active) return;
      if (props.islink) {
        // router.push({ path: data.value as string });
      }
      emit('update:active', data.value);
      emit('btnClick', data);
    };
    // onBeforeRouteUpdate((data) => {
    //   getButtonValue(data);
    // });
    const pageInit = () => {
      // getButtonValue(router.currentRoute.value);
    };
    pageInit();

    return {
      scrollRef,
      clickHandle,
    };
  },
});
</script>

<template>
  <div class="ta-button-group" @click.stop>
    <div ref="scrollRef" class="ta-button-group-inner">
      <Button
        v-for="(item, index) in buttons"
        :key="item.value"
        :type="active == item.value ? 'primary' : 'default'"
        :disabled="item.disabled"
        :permission="item.permission"
        @click="clickHandle(item, index, $event)"
      >
        {{ item.label }}
        <span v-if="item.number != null">（{{ item.number }}）</span>
      </Button>
    </div>
    <slot />
  </div>
</template>
