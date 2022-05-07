import type { ExtractPropTypes } from 'vue';

export const basicArrowProps = {
  /**
   * Arrow expand state
   */
  expand: { type: Boolean },
  /**
   * Arrow up by default
   */
  up: { type: Boolean },
  /**
   * Arrow down by default
   */
  down: { type: Boolean },
  /**
   * Cancel padding/margin for inline
   */
  inset: { type: Boolean },
};

export type BasicArrowProps = ExtractPropTypes<typeof basicArrowProps>;
