import { type ComputedRef, computed } from 'vue'
import { type EditorProps } from '../typings'

export function useEditorToolbar(options: { mergedProps: ComputedRef<EditorProps> }) {
  const { mergedProps } = options

  /** see: https://www.tiny.cloud/docs/tinymce/5/statusbar-configuration-options/ */
  const toolbarConfig = computed(() => {
    return {
      // toolbar: `undo redo removeformat | formatselect bold italic | lists aligns blockquote hr | image media link charmap emoticons times | restoredraft preview fullscreen code help`
      toolbar: `undo redo removeformat | formatselect bold italic | lists aligns blockquote hr | table uploadimage uploadfile link | restoredraft fullscreen code`,
      toolbarOptions: {
        /** 工具栏是否固定 */
        toolbar_sticky: true,
        /** 按钮过多的显示模式 */
        toolbar_mode: 'floating' as any,
      },
    }
  })

  return {
    toolbarConfig,
  }
}
