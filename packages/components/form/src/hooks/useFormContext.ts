/* eslint-disable symbol-description */
import type { InjectionKey } from 'vue'
import { createContext, useContext } from '@tav-ui/hooks/core/useContext'

export interface FormContextProps {
  resetAction: () => Promise<void>
  submitAction: () => Promise<void>
}

const key: InjectionKey<FormContextProps> = Symbol()

export function createFormContext(context: FormContextProps) {
  return createContext<FormContextProps>(context, key)
}

export function useFormContext() {
  return useContext<FormContextProps>(key)
}
