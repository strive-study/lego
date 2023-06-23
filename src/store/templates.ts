import { Module } from 'vuex'
import { GlobalDataProps, actionWrapper } from '.'
import { ResListData } from './resType'
import { PageData } from './editor'
// export interface TemplateProps {
//   id: number
//   title: string
//   coverImg: string
//   author: string
//   copiedCount: number
// }

export type TemplateProps = Required<Omit<PageData, 'props' | 'setting'>>

export const templateTestData: any[] = [
  {
    id: 1,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    title: '前端架构师直播海报',
    author: 'viking',
    copiedCount: 1
  },
  {
    id: 2,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'viking',
    copiedCount: 1
  },
  {
    id: 3,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-682056.png',
    title: '前端架构师直播海报',
    author: 'viking',
    copiedCount: 1
  },
  {
    id: 4,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'viking',
    copiedCount: 1
  },
  {
    id: 5,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    title: '前端架构师直播海报',
    author: 'viking',
    copiedCount: 1
  },
  {
    id: 6,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'viking',
    copiedCount: 1
  }
]

export interface TemplatesProps {
  data: TemplateProps[]
  totalTemplates: number
  works: TemplateProps[]
  totalWorks: number
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
    totalTemplates: 0,
    works: [],
    totalWorks: 0
  },
  actions: {
    fetchTemplates: actionWrapper('/templates', 'fetchTemplates'),
    fetchWorks: actionWrapper('/works', 'fetchWorks')
  },
  mutations: {
    fetchTemplates(state, { data }: ResListData<TemplateProps>) {
      const { count, list } = data
      state.data = [...state.data, ...list]
      state.totalTemplates = count
    },
    fetchWorks(state, rawData: ResListData<TemplateProps>) {
      const { count, list } = rawData.data
      state.works = list
      state.totalWorks = count
    }
  },
  getters: {
    getTemplateById: state => (id: number) => {
      return state.data.find(t => t.id === id)
    }
  }
}

export default templates
