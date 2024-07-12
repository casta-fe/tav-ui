import { computed, shallowRef, unref } from 'vue'
import { type FileType } from '../types'

export function useFileList() {
  const fileListRef = shallowRef<FileType[]>([])

  const fileList = computed(() => unref(fileListRef))

  function setFileList(fileList: FileType[]) {
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
