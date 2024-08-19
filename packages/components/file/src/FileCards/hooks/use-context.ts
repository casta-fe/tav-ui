import { inject, provide } from 'vue'

export function createContext<T>(options: { key: string; context: T }) {
  provide(options.key, options.context)
}

export function useContext<T>(options: { key: string; context: T }) {
  return inject(options.key) as T
}
