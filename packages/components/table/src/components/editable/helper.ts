import { tavI18n } from '@tav-ui/locales'
import type { ComponentType } from '../../types/componentType'

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes('Input')) {
    return tavI18n('Tav.common.inputText')
  }
  if (component.includes('Picker')) {
    return tavI18n('Tav.common.chooseText')
  }

  if (
    component.includes('Select') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch') ||
    component.includes('DatePicker') ||
    component.includes('TimePicker')
  ) {
    return tavI18n('Tav.common.chooseText')
  }
  return ''
}
