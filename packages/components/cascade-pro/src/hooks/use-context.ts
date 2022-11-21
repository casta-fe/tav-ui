import { inject, provide } from 'vue'
import type { IUseCascadeProContext } from '../types'

const key = Symbol('cascade-pro')

export function createCascadeProContext(context: IUseCascadeProContext) {
  provide(key, context)
}

export function useCascadeProContext(): IUseCascadeProContext {
  return inject(key) as IUseCascadeProContext
}
