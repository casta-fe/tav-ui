<template>
  <div>
    <h2>Tree测试</h2>
    <TaTree :tree-data="state.treeData" />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  components: {},
  setup() {
    const treeData = [
      {
        title: 'parent 1',
        key: '0-0',
        isLeaf: true,
        child: [
          {
            title: '张晨成',
            key: '0-0-0',
            disabled: true,
            isLeaf: true,
            child: [
              { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
              { title: 'leaf', key: '0-0-0-1' },
            ],
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            child: [{ key: '0-0-1-0', title: 'zcvc' }],
          },
        ],
      },
    ];
    const state = reactive({
      treeData,
    });
    return {
      state,
    };
  },
});
</script>
