export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface SkuData {
  id?: number
  category3Id?: string | number
  spuId?: string | number
  tmId?: string | number
  skuName?: string
  price?: string | number
  weight?: string | number
  isSale?: number
  skuDesc?: string
  skuAttrValueList?: [
    // 平台属性
    {
      id?: number
      attrId?: number | string // 平台属性id
      valueId?: number | string // 平台属性值id
    },
  ]
  skuSaleAttrValueList?: [
    // 销售属性
    {
      id?: number
      saleAttrId?: number | string // 属性ID
      saleAttrValueId?: number | string // 属性值Id
    },
  ]
  skuDefaultImg?: string // 售卖sku图片地址
}
// sku列表展示响应数据
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取sku商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
