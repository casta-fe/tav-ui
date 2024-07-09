import { type Slots } from 'vue'
import { useSlotKeys } from '../../../hooks/use-slot-keys'

export function useFileActionsSlots(slots: Slots, prefix = 'FileAction') {
  return useSlotKeys(slots, prefix)
}
