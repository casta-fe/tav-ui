import { createContext, useContext } from '@tav-ui/hooks/core/useContext'
import type { InjectionKey } from 'vue'

export interface ModalContextProps {
  redoModalHeight: () => void
}

const key: InjectionKey<ModalContextProps> = Symbol()

export function createModalContext(context: ModalContextProps) {
  return createContext<ModalContextProps>(context, key)
}

export function useModalContext() {
  return useContext<ModalContextProps>(key)
}
