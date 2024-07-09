import { type ComputedRef, type Ref, inject, provide } from 'vue'
import { type ApiParams } from '../typings'

const key = Symbol('file')

export interface FileContext {
  apiParams: ComputedRef<ApiParams['apiParams']>
}

export function createFileContext(context: FileContext) {
  provide(key, context)
}

export function useFileContext(): FileContext {
  return inject(key) as FileContext
}
