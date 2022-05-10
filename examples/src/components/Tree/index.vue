<template>
  <div>
    <h2>Tree测试</h2>
    <TaTree :tree-data="state.treeData" />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { TaTree } from '../../../../dist/index.esm';
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

console.log(TaTree);
export default defineComponent({
  name: 'TreePage',
  components: { TaTree },
  setup() {
    const state = reactive<{
      treeData: TreeDataItem[];
    }>({
      treeData: [],
    });
    setTimeout(() => {
      state.treeData = [
        {
          title: 'parent 1',
          key: '0-0',
          child: [
            {
              title: '张晨成',
              key: '0-0-0',
              disabled: true,
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
    }, 3000);
    return {
      state,
    };
  },
});
</script>
