import type { ExtractPropTypes, PropType } from 'vue'

export type FlowType = number

export const followProps = {
  id: {
    type: [String || Number || undefined],
    required: true,
  },
  type: {
    type: Number as PropType<FlowType>,
    required: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  initStatusApi: {
    type: Function,
  },
  updateStatusApi: {
    type: Function,
  },
}

export type FollowProps = ExtractPropTypes<typeof followProps>
