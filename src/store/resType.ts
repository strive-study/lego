export interface ResData<T> {
  error: number
  data: T
  message: string
}

export interface ListData<T> {
  list: T[]
  count: number
  pageSize: number
  pageIndex: number
}

export type ResListData<T> = ResData<ListData<T>>
