import { type ExtractPropTypes } from 'vue'
import { type Editor as TEditor, type TinyMCE } from 'tinymce/tinymce'
import { globalConfigEditorProps } from './global-config'

export type Editor = TEditor
export type EditorOptions = Parameters<TinyMCE['init']>[0]
export type EditorPluginImageUploadHandler = Exclude<
  EditorOptions['images_upload_handler'],
  undefined
>

export const editorProps = {
  ...globalConfigEditorProps,

  /** 编辑器内容（双向绑定） */
  value: {
    type: String,
    default: '',
  },
  /** 编辑器 id，建议传入，尤其是同一页面多个编辑器的场景 */
  id: {
    type: [String, Number],
  },
  width: {
    type: [String, Number],
    default: '100%',
  },
  height: {
    type: [String, Number],
    default: 350,
  },
  placeholder: {
    type: String,
    default: '请输入...',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
}

export type EditorProps = ExtractPropTypes<typeof editorProps>

// interface NativeEventMap {
//   'beforepaste': Event;
//   'blur': FocusEvent;
//   'beforeinput': InputEvent;
//   'click': MouseEvent;
//   'compositionend': Event;
//   'compositionstart': Event;
//   'compositionupdate': Event;
//   'contextmenu': PointerEvent;
//   'copy': ClipboardEvent;
//   'cut': ClipboardEvent;
//   'dblclick': MouseEvent;
//   'drag': DragEvent;
//   'dragdrop': DragEvent;
//   'dragend': DragEvent;
//   'draggesture': DragEvent;
//   'dragover': DragEvent;
//   'dragstart': DragEvent;
//   'drop': DragEvent;
//   'focus': FocusEvent;
//   'focusin': FocusEvent;
//   'focusout': FocusEvent;
//   'input': InputEvent;
//   'keydown': KeyboardEvent;
//   'keypress': KeyboardEvent;
//   'keyup': KeyboardEvent;
//   'mousedown': MouseEvent;
//   'mouseenter': MouseEvent;
//   'mouseleave': MouseEvent;
//   'mousemove': MouseEvent;
//   'mouseout': MouseEvent;
//   'mouseover': MouseEvent;
//   'mouseup': MouseEvent;
//   'paste': ClipboardEvent;
//   'selectionchange': Event;
//   'submit': Event;
//   'touchend': TouchEvent;
//   'touchmove': TouchEvent;
//   'touchstart': TouchEvent;
//   'touchcancel': TouchEvent;
//   'wheel': WheelEvent;
// }
export const editorEmits = {
  'update:value': (...args: any[]) => args instanceof Object,
  init: (...args: any[]) => args instanceof Object,
  blur: (...args: any[]) => args instanceof Object,
  click: (...args: any[]) => args instanceof Object,
  dblclick: (...args: any[]) => args instanceof Object,
  focus: (...args: any[]) => args instanceof Object,
  change: (...args: any[]) => args instanceof Object, // input
}

export type EditorEmits = typeof editorEmits

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditorInstance {}
