export * from './download'
export * from './setup'
export * from './types'
export * from './validate'
export * from './visibile'

export const sleep = (milliseconds: number) => {
  return new Promise((res) => setTimeout(res, milliseconds))
}
