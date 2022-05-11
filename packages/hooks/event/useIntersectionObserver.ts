import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'

interface IntersectionObserverProps {
  target: Ref<Element | null | undefined>
  root?: Ref<any>
  onIntersect: IntersectionObserverCallback
  rootMargin?: string
  threshold?: number
}

declare type Nullable<T> = T | null

export function useIntersectionObserver({
  target,
  root,
  onIntersect,
  rootMargin = '0px',
  threshold = 0.1,
}: IntersectionObserverProps) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let cleanup = () => {}
  const observer: Ref<Nullable<IntersectionObserver>> = ref(null)
  const stopEffect = watchEffect(() => {
    cleanup()

    observer.value = new IntersectionObserver(onIntersect, {
      root: root ? root.value : null,
      rootMargin,
      threshold,
    })

    const current = target.value

    current && observer.value.observe(current)

    cleanup = () => {
      if (observer.value) {
        observer.value.disconnect()
        target.value && observer.value.unobserve(target.value)
      }
    }
  })

  return {
    observer,
    stop: () => {
      cleanup()
      stopEffect()
    },
  }
}
