import { onMounted } from 'vue'
export function useComputedHeight(intance, minHeight) {
  onMounted(() => {
    const tableBoxEl = intance && intance.value
    if (tableBoxEl) {
      const currentHeight = tableBoxEl.offsetHeight
      console.log(currentHeight, 'currentHeightcurrentHeight', minHeight)
      tableBoxEl.style.height = currentHeight > minHeight ? `${currentHeight}px` : `${minHeight}px`
    }
  })
}
