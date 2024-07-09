import { type ComputedRef, type Ref, type UnwrapRef, computed, unref } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { type FileInjectedProps, FileInjectedPropsKeys } from '../typings'

/**
 * 取出 file 组件 globalconfig 注入的相关数据
 * @returns
 */
export function useFileGlobalConfig() {
  const appIdGlobalConfig = (useGlobalConfig('appId') as Ref<string>).value
  const fileGlobalConfig = (useGlobalConfig('components') as Ref<Record<string, any>>).value?.TaFile

  return computed<FileInjectedProps>(() => ({
    appId: appIdGlobalConfig || '',
    ...(fileGlobalConfig || {}),
  }))
}

/**
 * merge props
 * @param props
 * @returns
 */
export function useMergedProps<T, K>(
  props: ComputedRef<T> | Ref<T> | T,
  mergedProps: ComputedRef<K> | Ref<K> | K
) {
  return computed<T & K>(() => {
    return {
      ...((props as any).value ? (props as any).value : props),
      ...((mergedProps as any).value ? (mergedProps as any).value : mergedProps),
    }
  })
}

/**
 * 组装子组件需要的 props，方便子组件单独使用
 * @param fileProps
 * @param filePropApiParams
 * @param props
 * @returns
 */
export function useComponentProps<T, K, V>(
  fileProps: ComputedRef<T> | Ref<T> | T,
  filePropApiParams: ComputedRef<K> | Ref<K> | K,
  props: ComputedRef<V> | Ref<V> | V
) {
  return computed<T & K & V>(() => {
    const componentProps = {} as Record<string, any>

    // 组装 fileInjectedProps
    for (const key of FileInjectedPropsKeys) {
      componentProps[key] = ((fileProps as any).value ? (fileProps as any).value : fileProps)[key]
    }

    // 组装 apiparams
    componentProps['apiParams'] = (filePropApiParams as any).value
      ? (filePropApiParams as any).value
      : filePropApiParams

    return {
      ...componentProps,
      ...((props as any).value ? (props as any).value : props),
    }
  })
}
