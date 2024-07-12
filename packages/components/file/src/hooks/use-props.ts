import { type ComputedRef, type Ref, computed } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { type FileInjectedProps, fileInjectedPropsKeys } from '../typings'
import { DEFAULT_API_PARAMS } from '../consts'

/**
 * 取出 file 组件 globalconfig 注入的相关数据
 * @returns
 */
export function useFileGlobalConfig() {
  const appIdGlobalConfig = (useGlobalConfig('appId') as Ref<string>).value
  const fileGlobalConfig = (useGlobalConfig('components') as Ref<Record<string, any>>).value?.TaFile

  return computed(
    () =>
      ({
        appId: appIdGlobalConfig || '',
        ...(fileGlobalConfig || {}),
      } as unknown as FileInjectedProps)
  )
}

/**
 * merge props
 * @param globalConfigProps 全局注入 props
 * @param props 组件 props
 * @returns
 */
export function useMergedProps<T, K extends Record<string, any>>(
  globalConfigProps: ComputedRef<T>,
  props: Readonly<K>
) {
  return computed<T & K>(() => {
    const apiParams = {
      // 将 apiparams 默认值合并
      ...DEFAULT_API_PARAMS,
      ...(props['apiParams'] ?? {}),
    }
    const singleUseProps = {
      ...globalConfigProps.value,
      ...props,
    }

    return {
      ...singleUseProps,
      apiParams,
    }
  })
}
