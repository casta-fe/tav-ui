export type QRCodeErrorCorrectionLevel =
  | 'low'
  | 'medium'
  | 'quartile'
  | 'high'
  | 'L'
  | 'M'
  | 'Q'
  | 'H'

export interface QRCodeOptions {
  /**
   * QR Code version. If not specified the more suitable value will be calculated.
   */
  version?: number | undefined
  /**
   * Error correction level.
   * Possible values are low, medium, quartile, high or L, M, Q, H.
   * Default: M
   */
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel | undefined
  /**
   * Helper function used internally to convert a kanji to its Shift JIS value.
   * Provide this function if you need support for Kanji mode.
   */
  toSJISFunc?: ((codePoint: string) => number) | undefined
}

export interface QRCodeToDataURLOptions extends QRCodeRenderersOptions {
  /**
   * Data URI format.
   * Default: image/png
   */
  type?: 'image/png' | 'image/jpeg' | 'image/webp' | undefined
  rendererOpts?:
    | {
        /**
         * A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp.
         * Default: 0.92
         */
        quality?: number | undefined
      }
    | undefined
}

export interface QRCodeToStringOptions extends QRCodeRenderersOptions {
  /**
   * Output format.
   * Default: utf8
   */
  type?: 'utf8' | 'svg' | 'terminal' | undefined
}

export interface QRCodeToFileOptions extends QRCodeRenderersOptions {
  /**
   * Output format.
   * Default: png
   */
  type?: 'png' | 'svg' | 'utf8' | undefined
  rendererOpts?:
    | {
        /**
         * Compression level for deflate.
         * Default: 9
         */
        deflateLevel?: number | undefined
        /**
         * Compression strategy for deflate.
         * Default: 3
         */
        deflateStrategy?: number | undefined
      }
    | undefined
}

export interface QRCodeToFileStreamOptions extends QRCodeRenderersOptions {
  /**
   * Output format. Only png supported for file stream
   */
  type?: 'png' | undefined
  rendererOpts?:
    | {
        /**
         * Compression level for deflate.
         * Default: 9
         */
        deflateLevel?: number | undefined
        /**
         * Compression strategy for deflate.
         * Default: 3
         */
        deflateStrategy?: number | undefined
      }
    | undefined
}

export interface QRCodeToBufferOptions extends QRCodeRenderersOptions {
  /**
   * Output format. Only png supported for Buffer.
   */
  type?: 'png' | undefined
  rendererOpts?:
    | {
        /**
         * Compression level for deflate.
         * Default: 9
         */
        deflateLevel?: number | undefined
        /**
         * Compression strategy for deflate.
         * Default: 3
         */
        deflateStrategy?: number | undefined
      }
    | undefined
}

export interface QRCodeRenderersOptions extends QRCodeOptions {
  /**
   * Define how much wide the quiet zone should be.
   * Default: 4
   */
  margin?: number | undefined
  /**
   * Scale factor. A value of 1 means 1px per modules (black dots).
   * Default: 4
   */
  scale?: number | undefined
  /**
   * Forces a specific width for the output image.
   * If width is too small to contain the qr symbol, this option will be ignored.
   * Takes precedence over scale.
   */
  width?: number | undefined
  color?:
    | {
        /**
         * Color of dark module. Value must be in hex format (RGBA).
         * Note: dark color should always be darker than color.light.
         * Default: #000000ff
         */
        dark?: string | undefined
        /**
         * Color of light module. Value must be in hex format (RGBA).
         * Default: #ffffffff
         */
        light?: string | undefined
      }
    | undefined
}

export interface QRCodeSegment {
  data: string | Buffer | Uint8ClampedArray
  mode: 'alphanumeric' | 'numeric' | 'kanji' | 'byte'
}

export interface QRCode {
  /**
   * Bitmatrix class with modules data
   */
  modules: any
  /**
   * Calculated QR Code version
   */
  version: number
  /**
   * Error Correction Level
   */
  errorCorrectionLevel: number
  /**
   * Calculated Mask pattern
   */
  maskPattern: any
  /**
   * Generated segments
   */
  segments: QRCodeSegment[]
}

interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export type ContentType = string | QRCodeSegment[]

export type LogoType = {
  src: string
  logoSize: number
  borderColor: string
  bgColor: string
  borderSize: number
  crossOrigin: string
  borderRadius: number
  logoRadius: number
}

export interface RenderQrCodeParams {
  canvas: any
  content: ContentType
  width?: number
  options?: QRCodeRenderersOptions
  logo?: LogoType | string
  image?: HTMLImageElement
  downloadName?: string
  download?: boolean | Fn
}

export type ToCanvasFn = (options: RenderQrCodeParams) => Promise<unknown>

export interface QrCodeActionType {
  download: (fileName?: string) => void
}

export interface QrcodeDoneEventParams {
  url: string
  ctx?: CanvasRenderingContext2D | null
}
