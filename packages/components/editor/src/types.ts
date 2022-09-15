import { plugins, toolbar } from './const'
import type { RawEditorSettings } from 'tinymce'
import type { ExtractPropTypes, PropType } from 'vue'

export const editorProps = {
  options: {
    type: Object as PropType<Partial<RawEditorSettings>>,
    default: {},
  },
  value: {
    type: String,
  },

  toolbar: {
    type: Array as PropType<string[]>,
    default: toolbar,
  },
  plugins: {
    type: Array as PropType<string[]>,
    default: plugins,
  },
  modelValue: {
    type: String,
  },
  height: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: 350,
  },
  width: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: '100%',
  },
  theme: {
    type: String as PropType<'drak' | 'light'>,
    default: 'light',
  },
  lang: {
    type: String as PropType<'zh_CN' | 'en'>,
    default: 'zh_CN',
  },
  publicPath: {
    type: String,
    default: '/',
  },
}

export type EditorProps = ExtractPropTypes<typeof editorProps>
