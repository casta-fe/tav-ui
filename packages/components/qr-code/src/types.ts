import type { ExtractPropTypes, PropType } from 'vue'
import type { LogoType, QRCodeRenderersOptions } from './qrcodePlus'

export const qrcodeProps = {
  value: {
    type: [String, Array] as PropType<string | any[]>,
    default: null,
  },
  // 参数
  options: {
    type: Object as PropType<QRCodeRenderersOptions>,
    default: null,
  },
  // 宽度
  width: {
    type: Number as PropType<number>,
    default: 200,
  },
  // 中间logo图标
  logo: {
    type: [String, Object] as PropType<Partial<LogoType> | string>,
    default: '',
  },
  // img 不支持内嵌logo
  tag: {
    type: String as PropType<'canvas' | 'img'>,
    default: 'canvas',
    validator: (v: string) => ['canvas', 'img'].includes(v),
  },
}

export type QrcodeProps = ExtractPropTypes<typeof qrcodeProps>
