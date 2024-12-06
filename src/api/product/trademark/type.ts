export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有品牌数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含全部品牌数据类型
export type Records = TradeMark[]

// 获取已有品牌数据的类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
