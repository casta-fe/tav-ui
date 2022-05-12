export interface ApiSelectOptionsItem {
  label: string
  value: string
  disabled?: boolean
}

export interface RadioButtonGroupOptionsItem {
  label: string
  value: string | number | boolean
  disabled?: boolean
}
export type RadioButtonGroupOptionItem = string | RadioButtonGroupOptionsItem
