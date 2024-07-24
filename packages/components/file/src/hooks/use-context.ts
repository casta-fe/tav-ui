import { inject, provide } from 'vue'
import { type Emitter } from '@tav-ui/utils/mitt'

export const FileContextKey = Symbol('file')

export interface FileContext {
  emitter: Emitter
}

export function createFileContext(context: FileContext) {
  provide(FileContextKey, context)
}

export function useFileContext(): FileContext {
  return inject(FileContextKey) as FileContext
}
