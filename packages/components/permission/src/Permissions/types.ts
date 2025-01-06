import { type ExtractPropTypes } from 'vue'

export const pagePermissionProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
}

export type PagePermissionProps = ExtractPropTypes<typeof pagePermissionProps>
