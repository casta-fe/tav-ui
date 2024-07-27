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
  props: K,
  componentNames: string[]
) {
  const result: Record<string, any> = {}
  const isSignleComponent = componentNames.length === 1

  return computed(() => {
    for (let i = 0; i < componentNames.length; i++) {
      // 已 props 传入的为准，globalconfig 为辅
      const globalConfigComponentProps = globalConfigProps.value[componentNames[i]] ?? {}
      result[componentNames[i]] = {
        ...(props[componentNames[i]] ?? isSignleComponent ? props : {}),
        ...{
          mode:
            (props[componentNames[i]] ?? ((isSignleComponent ? props : {}) as any))['mode'] ??
            props['mode'],
        },
      }
      Object.keys(result[componentNames[i]]).forEach((key) => {
        // if (!result[componentNames[i]][key] && !globalConfigComponentProps[key]) {
        //   console.warn(
        //     `[tavui TaFile] use-props.ts warning, props: ${key} is not exist in globalConfig & file props`
        //   )
        // }
        if (!result[componentNames[i]][key] && globalConfigComponentProps[key]) {
          result[componentNames[i]][key] = globalConfigComponentProps[key]
        }
      })
    }

    return {
      ...props,
      ...(componentNames.length !== 1 ? result : result[componentNames[0]]),
    } as unknown as T & K
  })
}
