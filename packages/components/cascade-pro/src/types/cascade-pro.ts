export interface CascadeProOption {
  name: string
  id: string
  pid: string
  children?: CascadeProOption[]
  /** 记录全路径的父子id关系，以 - 分割，快速回溯 */
  idPath: string
  /** 记录全路径的父子name关系，以 - 分割，快速回溯 */
  namePath: string
  /** 是否只有一个孩子节点，并且该孩子节点的id与当前节点id相同，兼容地址：北京与北京市*/
  isIdSameAsOnlyOneChild?: boolean
  /** 拼音首字母 */
  firstLetter?: string

  /** 兼容传入的其他数据 */
  [key: string]: any
}

export type CascadeProFunction = (...args: any) => any

export type CascadeProPromiseFunction = (...args: any) => Promise<any>

export type GenerateHotList = (list: CascadeProOption[], hot: string[]) => CascadeProOption[]
