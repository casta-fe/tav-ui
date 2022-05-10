import { computed, nextTick, ref, unref, watch } from 'vue';
import { onMountedOrActivated } from '@tav-ui/hooks/core/onMountedOrActivated';
import { useWindowSizeFn } from '@tav-ui/hooks/event/useWindowSizeFn';
import { getViewportOffset } from '@tav-ui/utils/domUtils';
import { isBoolean } from '@tav-ui/utils/is';
import { useDebounceFn } from '@vueuse/core';
import { useModalContext } from '../../../modal/src/hooks/useModalContext';
import type { ComputedRef, Ref } from 'vue';
import type { BasicColumn, BasicTableProps, TableRowSelection } from '../types/table';

type Nullable<T> = T | null;
type Recordable<T = any> = Record<string, T>;
interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}
type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

export function useTableScroll(
  propsRef: ComputedRef<BasicTableProps>,
  tableElRef: Ref<ComponentRef>,
  columnsRef: ComputedRef<BasicColumn[]>,
  rowSelectionRef: ComputedRef<TableRowSelection | null>,
  getDataSourceRef: ComputedRef<Recordable[]>,
  slots
) {
  const tableHeightRef: Ref<Nullable<number>> = ref(null);

  const modalFn = useModalContext();

  // Greater than animation time 280
  const debounceRedoHeight = useDebounceFn(redoHeight, 100);

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  watch(
    () => [unref(getCanResize), unref(getDataSourceRef)?.length],
    () => {
      debounceRedoHeight();
    },
    {
      flush: 'post',
    }
  );

  function redoHeight() {
    nextTick(() => {
      calcTableHeight();
    });
  }

  function setHeight(height: number) {
    tableHeightRef.value = height;
    //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
    modalFn?.redoModalHeight?.();
  }

  // No need to repeat queries
  let paginationEl: HTMLElement | null;
  let footerEl: HTMLElement | null;
  let bodyEl: HTMLElement | null;

  async function calcTableHeight() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resizeHeightOffset, pagination, maxHeight, fullHeight } = unref(propsRef);
    const tableData = unref(getDataSourceRef);
    //处理设置fullheight为false 不生效的问题
    const table = unref(tableElRef);
    if (!table) return;

    const tableEl: Element = table.$el;
    if (!tableEl) return;

    if (!bodyEl) {
      bodyEl = tableEl.querySelector('.ant-table-body');
      if (!bodyEl) return;
    }

    const hasScrollBarY = bodyEl.scrollHeight > bodyEl.clientHeight;
    const hasScrollBarX = bodyEl.scrollWidth > bodyEl.clientWidth;

    if (hasScrollBarY) {
      tableEl.classList.contains('hide-scrollbar-y') &&
        tableEl.classList.remove('hide-scrollbar-y');
    } else {
      !tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.add('hide-scrollbar-y');
    }

    if (hasScrollBarX) {
      tableEl.classList.contains('hide-scrollbar-x') &&
        tableEl.classList.remove('hide-scrollbar-x');
    } else {
      !tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.add('hide-scrollbar-x');
    }

    bodyEl!.style.height = 'unset';

    // if (!unref(getCanResize) || tableData.length === 0) return;
    if (!unref(getCanResize)) return;

    await nextTick();
    //Add a delay to get the correct bottomIncludeBody paginationHeight footerHeight headerHeight

    const headEl = tableEl.querySelector('.ant-table-thead ');
    if (!headEl) return;

    // Table height from bottom
    const { bottomIncludeBody } = getViewportOffset(headEl);
    // hack:底部padding + table底部padding
    const paddingHeight = 32;
    // Pager height
    let paginationHeight = 32; // 默认高度？
    if (!isBoolean(pagination)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paginationEl = tableEl.querySelector('.ant-pagination') as HTMLElement;
      paginationHeight = 32;
    } else {
      paginationHeight = 0;
    }

    let footerHeight = 0;
    if (!isBoolean(pagination)) {
      if (!footerEl) {
        footerEl = tableEl.querySelector('.ant-table-footer') as HTMLElement;
      } else {
        const offsetHeight = footerEl.offsetHeight;
        footerHeight += offsetHeight || 0;
      }
    }

    let headerHeight = 0;
    if (headEl) {
      headerHeight = (headEl as HTMLElement).offsetHeight;
    }
    let height =
      bottomIncludeBody -
      (resizeHeightOffset || 0) -
      paddingHeight -
      paginationHeight -
      footerHeight -
      headerHeight;

    height = (height > maxHeight! ? (maxHeight as number) : height) ?? height;
    setHeight(height);
    if (!slots.footer) {
      if (tableData.length === 0) {
        //处理空数据时滚动条消失问题
        const TbodyEl = bodyEl.querySelector('.ant-table-tbody') as HTMLElement;
        TbodyEl!.style.height = `1px`;
      }
      bodyEl!.style.height = `${height}px`;
    }
  }
  useWindowSizeFn(calcTableHeight, 280);
  onMountedOrActivated(() => {
    calcTableHeight();
    nextTick(() => {
      debounceRedoHeight();
    });
  });

  const getScrollX = computed(() => {
    let width = 0;
    if (unref(rowSelectionRef)) {
      width += 60;
    }

    // TODO props ?? 0;
    const NORMAL_WIDTH = 150;

    const columns = unref(columnsRef).filter((item) => !item.defaultHidden);
    columns.forEach((item) => {
      width += Number.parseInt(item.width as string) || 0;
    });
    const unsetWidthColumns = columns.filter((item) => !Reflect.has(item, 'width'));

    const len = unsetWidthColumns.length;
    if (len !== 0) {
      width += len * NORMAL_WIDTH;
    }

    const table = unref(tableElRef);
    const tableWidth = table?.$el?.offsetWidth ?? 0;
    return tableWidth > width ? '100%' : width;
  });

  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    const { canResize, scroll } = unref(propsRef);
    return {
      x: unref(getScrollX),
      y: canResize ? tableHeight : null,
      scrollToFirstRowOnChange: true,
      ...scroll,
    };
  });

  return { getScrollRef, redoHeight };
}
