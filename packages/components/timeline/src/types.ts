export interface TimeLinePropsType {
  list?: ListItemDefaultDataType[]
  useLoadingMore?: Boolean
}

// export interface ListData=Array<ListItemDefaultDataType>

export interface ListItemDefaultDataType {
  times?: string[]
  status?: 'success' | 'fail' | 'continue'
  title?: string
  tags?: TagPropsType[]
  description?: string[]
}

export interface TagPropsType {
  color?: string
  label?: string
  tooltip?: string
  [key: string]: any
}
