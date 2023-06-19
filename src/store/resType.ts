import { PageData, PageProps } from './editor'
import { ComponentData } from 'strive-lego-bricks'
export interface ResData<T = {}> {
  errno: number
  data: T
  message?: string
}

export interface ListData<T> {
  list: T[]
  count: number
  pageSize: number
  pageIndex: number
}

export interface WorkData extends Omit<PageData, 'props' | 'id'> {
  _id: string
  content: {
    components: ComponentData[] // 页面组件数组
    props?: PageProps // 页面props
  }
}
export type ResListData<T> = ResData<ListData<T>>
export type ResWorkData = ResData<WorkData>
