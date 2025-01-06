import { type ComputedRef, type Ref, computed } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { type GlobalConfigFileProps } from '../global-config-types'

function useGlobalConfigProps() {
  const globalConfigAppId = (useGlobalConfig('appId') as Ref<string>).value
  const globalConfigFile = (useGlobalConfig('components') as Ref<Record<string, any>>).value

  return computed(
    () =>
      ({
        appId: globalConfigAppId || '',
        ...(globalConfigFile || {}),
      } as unknown as GlobalConfigFileProps & {
        appId: string | number
      })
  )
}

/**
 * 方便组件在单独使用时合并 globalconfigprops
 * @param globalConfigProps
 * @param props
 * @param componentNames
 * @returns
 */
export function useMergedProps<K extends Record<string, any>>(
  props: K,
  componentName: keyof GlobalConfigFileProps,
  apiParamsDefault?: any
) {
  const globalConfigProps = useGlobalConfigProps() as ComputedRef<
    GlobalConfigFileProps & { appId: string | number }
  >
  return computed(() => {
    const result = {} as any // props 不允许赋值所以这里新建变量存储
    const globalConfigComponentProps = globalConfigProps.value[componentName]
    const globalConfigAppId = globalConfigProps.value.appId

    // props 属性为 undefined 的话从 globalconfig 中取对应的值（目前只是 api 与 appId）
    Object.keys(props).forEach((key) => {
      const _p =
        globalConfigComponentProps && (globalConfigComponentProps as any)[key]
          ? (globalConfigComponentProps as any)[key]
          : undefined

      result[key] = props[key] ?? _p
    })

    // apiParams 有一些默认值需要合并
    apiParamsDefault &&
      Object.keys(apiParamsDefault).forEach((key) => {
        if (result['apiParams']) {
          result['apiParams'][key] = result['apiParams'][key] ?? apiParamsDefault[key]
        } else {
          result['apiParams'] = {}
        }
      })

    return {
      ...props,
      ...result,
      apiParams: {
        ...props.apiParams,
        appId: props.apiParams?.appId ?? globalConfigAppId,
      },
    } as unknown as typeof globalConfigComponentProps & K
  })
}
