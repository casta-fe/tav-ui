import { computed, shallowRef, unref } from 'vue'

export function useFileList() {
  const fileListRef = shallowRef<any[]>([])

  const fileList = computed(() => unref(fileListRef))

  function setFileList(fileList: any[]) {
    if (fileList.length === 0) {
      // 清空
      fileListRef.value = []
    } else {
      // 合并
      fileListRef.value = [...fileListRef.value, ...fileList]
    }
  }

  return { fileList, setFileList }
}

export type UseFileListReturn = ReturnType<typeof useFileList>
