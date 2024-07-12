import { inject, provide } from 'vue'

export const FileContextKey = Symbol('file')

export interface FileContext {
  [key: string]: any
}

export function createFileContext(context: FileContext) {
  provide(FileContextKey, context)
}

export function useFileContext(): FileContext {
  return inject(FileContextKey) as FileContext
}
