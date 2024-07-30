import { type ComputedRef, type Ref, computed } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { type GlobalConfigFileProps } from '../typings'

export function useGlobalConfigProps() {
  const globalConfigAppId = (useGlobalConfig('appId') as Ref<string>).value
  const globalConfigFile = (useGlobalConfig('components') as Ref<Record<string, any>>).value

  return computed(
    () =>
      ({
        appId: globalConfigAppId || '',
        ...(globalConfigFile || {}),
      } as unknown as GlobalConfigFileProps)
  )
}

/**
 * 方便组件在单独使用时合并 globalconfigprops
 * @param globalConfigProps
 * @param props
 * @param componentNames
 * @returns
 */
export function useMergedProps<T extends Record<string, any>, K extends Record<string, any>>(
  globalConfigProps: ComputedRef<T>,
  props: any,
  componentName: string
) {
  return computed(() => {
    const result = {} as any // props 不允许赋值所以这里新建变量存储
    const globalConfigComponentProps = globalConfigProps.value[componentName] ?? {}
    const globalConfigAppId = globalConfigProps.value.appId

    // props 属性为 undefined 的话从 globalconfig 中取对应的值（目前只是 api 与 appId）
    Object.keys(props).forEach((key) => {
      if (!props[key] && globalConfigComponentProps[key]) {
        result[key] = globalConfigComponentProps[key]
      }
    })

    return {
      ...props,
      ...result,
      apiParams: {
        ...props.apiParams,
        appId: props.apiParams?.appId ?? globalConfigAppId,
      },
    } as unknown as T & K
  })
}
