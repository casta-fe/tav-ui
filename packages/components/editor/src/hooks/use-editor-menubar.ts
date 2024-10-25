import { type ComputedRef, computed } from 'vue'
import { type EditorProps } from '../typings'

export function useEditorMenubar(options: { mergedProps: ComputedRef<EditorProps> }) {
  const { mergedProps } = options

  /** see: https://www.tiny.cloud/docs/tinymce/5/menus-configuration-options/ */
  const menubarConfig = computed(() => {
    return {
      menubar: false,
    }
  })

  return {
    menubarConfig,
  }
}
