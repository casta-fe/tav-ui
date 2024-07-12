import { type ComputedRef, computed, shallowRef, watch } from 'vue'
import { type FileProps, fileInjectedPropsKeys } from '../typings'

/**
 * 从父组件分发子组件 props，方便子组件单独使用
 * @param componentName 子组件名称
 * @param _props 父组件 props
 * @returns
 */
export function useComponentProps<T extends Record<string, any>>(
  componentName: string,
  _props: ComputedRef<FileProps>
) {
  const componentPropsRef = shallowRef<T>({} as any)

  _props.value &&
    watch(
      () => _props.value,
      (curProps, preProps) => {
        if (JSON.stringify(curProps) !== JSON.stringify(preProps)) {
          const componentProps = {} as Record<string, any>
          // 组装 fileInjectedProps
          for (const key of fileInjectedPropsKeys) {
            componentProps[key] = (curProps as any)[key]
          }
          // 组装 apiparams
          componentProps['apiParams'] = (curProps as any)['apiParams']
          componentPropsRef.value = {
            ...componentProps,
            ...((curProps as any)[componentName] || {}),
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )

  const componentProps = computed(() => componentPropsRef.value as unknown as T)

  /**
   * 修改子组件 props，注意这里的子组件 props 保存在 shadowref 中，修改时需要完全覆盖。see：https://cn.vuejs.org/api/reactivity-advanced.html#shallowref
   * @param componentProps
   */
  function setComponentProps<K extends Record<string, any>>(componentProps: K) {
    componentPropsRef.value = {
      ...componentProps,
    }
  }

  return { componentProps, setComponentProps }
}

export type UseComponentProps = ReturnType<typeof useComponentProps>
