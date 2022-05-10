import { computed, h, nextTick, unref, watchEffect } from 'vue';
import { useEventListener } from '@tav-ui/hooks/event/useEventListener';
import TableFooter from '../components/TableFooter.vue';
import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps } from '../types/table';

type Recordable<T = any> = Record<string, T>;
type Nullable<T> = T | null;
interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}
type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

export function useTableFooter(
  propsRef: ComputedRef<BasicTableProps>,
  scrollRef: ComputedRef<{
    x: string | number | true;
    y: Nullable<number>;
    scrollToFirstRowOnChange: boolean;
  }>,
  tableElRef: Ref<ComponentRef>,
  getDataSourceRef: ComputedRef<Recordable>
) {
  const getIsEmptyData = computed(() => {
    return (unref(getDataSourceRef) || []).length === 0;
  });

  const getFooterProps = computed((): Recordable | undefined => {
    const { summaryFunc, showSummary, summaryData } = unref(propsRef);
    return showSummary && !unref(getIsEmptyData)
      ? () => h(TableFooter, { summaryFunc, summaryData, scroll: unref(scrollRef) })
      : undefined;
  });

  watchEffect(() => {
    handleSummary();
  });

  function handleSummary() {
    const { showSummary } = unref(propsRef);
    if (!showSummary || unref(getIsEmptyData)) return;

    nextTick(() => {
      const tableEl = unref(tableElRef);
      if (!tableEl) return;
      const bodyDomList = tableEl.$el.querySelectorAll('.ant-table-body');
      const bodyDom = bodyDomList[0];
      useEventListener({
        el: bodyDom,
        name: 'scroll',
        listener: () => {
          const footerBodyDom = tableEl.$el.querySelector(
            '.ant-table-footer .ant-table-body'
          ) as HTMLDivElement;
          if (!footerBodyDom || !bodyDom) return;
          footerBodyDom.scrollLeft = bodyDom.scrollLeft;
        },
        wait: 0,
        options: true,
      });
    });
  }
  return { getFooterProps };
}
