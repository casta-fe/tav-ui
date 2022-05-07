import type { ExtractPropTypes, PropType } from 'vue'

export const containerCollapseProps = {
  title: { type: String, default: '' },
  loading: { type: Boolean },
  /**
   *  Can it be expanded
   */
  canExpan: { type: Boolean, default: true },
  /**
   * Warm reminder on the right side of the title
   */
  helpMessage: {
    type: [Array, String] as PropType<string[] | string>,
    default: '',
  },
  /**
   * Whether to trigger window.resize when expanding and contracting,
   * Can adapt to tables and forms, when the form shrinks, the form triggers resize to adapt to the height
   */
  triggerWindowResize: { type: Boolean },
  /**
   * Delayed loading time
   */
  lazyTime: { type: Number, default: 0 },
}

export type ContainerCollapseProps = ExtractPropTypes<typeof containerCollapseProps>
