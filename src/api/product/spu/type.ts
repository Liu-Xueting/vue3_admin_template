// 服务器返回数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string // 品牌ID
  spuSaleAttrList: null | SpuSaleAttr[] // 销售属性
  spuImageList: null | SpuImage[] // SPU图片
}

// 数组
export type Records = SpuData[]

// 定义获取spu列表接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有品牌数据的类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回数据的类型
export interface TrademarkResponseData extends ResponseData {
  data: Trademark[]
}

// 商品图片ts类型
export interface SpuImage {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url: string
}

// 已有SPU图片返回数据类型
export interface SpuHasImage extends ResponseData {
  data: SpuImage[]
}

// 销售属性值类型
export interface SpuSaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  baseSaleAttrId: number | string
  spuId?: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
export type spuSaleAttrValueList = SpuSaleAttrValue[]

// 销售属性对象
export interface SpuSaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  baseSaleAttrId: number | string
  spuId?: number
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU已有销售属性接口返回的数据类型
export interface SaleAttrResponse extends ResponseData {
  data: SpuSaleAttr[]
}

// 已有全部SPU属性的数据类型
export interface HasSaleAttr {
  id: number
  name: string
}

// 返回全部销售属性的数据类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface SkuData {
  category3Id: string | number
  spuId: string | number
  tmId: string | number
  skuName: string
  price: string | number
  weight: string | number
  skuDesc: string
  skuAttrValueList: [
    // 平台属性
    {
      attrId?: number | string // 平台属性id
      valueId?: number | string // 平台属性值id
    },
  ]
  skuSaleAttrValueList: [
    // 销售属性
    {
      saleAttrId?: number | string // 属性ID
      saleAttrValueId?: number | string // 属性值Id
    },
  ]
  skuDefaultImg: string // 售卖sku图片地址
}

// 获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
