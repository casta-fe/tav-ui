export type ScrollType = 'default' | 'main'

type RefType<T> = T | null
type Nullable<T> = T | null

export interface ScrollContainerOptions {
  enableScroll?: boolean
  type?: ScrollType
}

export type ScrollActionType = RefType<{
  scrollBottom: () => void
  getScrollWrap: () => Nullable<HTMLElement>
  scrollTo: (top: number) => void
}>
