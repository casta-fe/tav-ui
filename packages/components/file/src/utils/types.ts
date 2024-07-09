/**
 * Promise, or maybe not
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Null or whatever
 */
export type Nullable<T> = T | null | undefined

/**
 * Array, or not yet
 */
export type Arrayable<T> = T | Array<T>

/**
 * Object, or not yet
 */
export type Recordable<T = any> = Record<string, T>

/**
 * Function
 */
export type Fn<T = void> = () => T

/**
 * Constructor
 */
export type Constructor<T = void> = new (...args: any[]) => T

/**
 * Use generics get keyof result
 * @example
 * type keys = Keys<keyof {}>
 */
export type Keys<T> = T extends any ? T : never

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never

/**
 * Infers the arguments type of a function
 */
export type ArgumentsOf<T> = T extends (...args: infer A) => any ? A : never

/**
 * Infers the return type of a function
 */
export type ReturnOf<T extends (...args: any[]) => any> = ReturnType<T> extends Promise<infer R>
  ? R
  : ReturnType<T>

/**
 * Merge object, or not yet
 */
export type MergeRecord<T extends Recordable, V extends Recordable> = {
  [PK in keyof (T & V)]: PK extends keyof T ? T[PK] : PK extends keyof V ? V[PK] : never
}

/**
 * Defines an intersection type of all union items.
 *
 * @param U Union of any types that will be intersected.
 * @returns U items intersected
 * @see https://stackoverflow.com/a/50375286/9259330
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type MergeInsertions<T> = T extends object ? { [K in keyof T]: MergeInsertions<T[K]> } : T

export type DeepMerge<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
    ? S[K]
    : K extends keyof F
    ? F[K]
    : never
}>
