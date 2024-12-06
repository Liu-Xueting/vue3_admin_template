import request from '@/utils/request'
import type {
  HasSpuResponseData,
  TrademarkResponseData,
  SpuHasImage,
  SaleAttrResponse,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'

enum API {
  HASSPU_URL = '/admin/product/',
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  SPUIMAGE_URL = '/admin/product/spuImageList/',
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  DELETE_URL = '/admin/product/deleteSpu/',
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  SKUINFO_URL = '/admin/product/findBySpuId/',
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}

// 获取已有SPU数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
/*
   code:200
   message:"成功"
   data:{
    records:[
       {
        "id": 27,
            spuName:"S10 pro"
            description:"S10 pro",
            category3Id:61
            tmId:6
            spuSaleAttrList:[]
            spuImageList:[]
        },
     ],
    total:6,
    size:3
    current:1
    searchCount:true
    pages:2
   }
*/

// 获取全部SPU品牌数据
export const reqAllTrademark = () =>
  request.get<any, TrademarkResponseData>(API.ALLTRADEMARK_URL)
/*
  code:200
  message:"成功"
  data:[
      {
        id:1,
        tmName:"华为"
        logoUrl:"http://47.93.148.192:8080/xxx.jpg"
      },
      {
        id:2,
        tmName:"小米"
        logoUrl:
      },
  ]
  ok:true
*/

// 获取某一个SPU下的图片列表
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImage>(API.SPUIMAGE_URL + spuId)
/*
  code:200
  message:"成功"
  data:[
      {
        id:1,
        createTime:
        updateTime:
        imgName:"xxx.jpg"
        imgUrl:"http://47.93.148.192:8080/xxx.jpg"
        spuId:27
      },
      {
        id:2,
        createTime:
        updateTime:
        imgName:"xxx.jpg"
        imgUrl:"http://47.93.148.192:8080/xxx.jpg"
        spuId:27
      }
  ]
*/

// 获取某一个SPU的销售属性列表
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponse>(API.SPUHASSALEATTR_URL + spuId)
/*
  code:200
  message:"成功"
  data:[
      {
        id:
        createTime:
        updateTime:
        spuId:
        baseSaleAttrId:1,
        saleAttrName:"颜色"
        spuSaleAttrValueList:[
          {
            id:
            createTime:
            updateTime:
            baseSaleAttrId:1
            spuId:
            saleAttrValueName:"白色"
            saleAttrName:"颜色"
            isChecked:null
          },
        ]
      }
  ]
  ok:true
*/

// 获取全部销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
/*
  code:200
  message:"成功"
  data:[
      {
        id:1,
        name:"颜色"
      },
      {
        id:2,
        name:"版本"
      }
      {
        id:3,
        name:"尺码"
      }
  ]
  ok:true
*/

// 追加一个新的SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.ADDSPU_URL, data)
  } else {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  }
}
/*
  携带的SPU对象
  id:
  spuName:
  tmId:6          // spu品牌id
  category3Id:61
  description:"S10 pro"
  spuImageList:[   // spu图片列表
  {
    id:
    imgName:"xxx.jpg"
    imgUrl:"http://47.93.148.192:8080/xxx.jpg"
    spuId:27
  }
  ]
  spuSaleAttrValueList:[
    {
      baseSaleAttrId:1
      id:
      spuId:
      saleAttrValueName:"白色"
      saleAttrName:"颜色"
      isChecked:null
    },
  ]
  
*/

// 添加SKU的请求方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)
/*
  POST参数：
  { 
    "category3Id": "61",
    "spuId":
    "tmId":
    "skuName":
    "price":
    "weight":
    "skuDesc":"S10 pro",
    "skuAttrValueList":[ // 平台属性
      { 
        "attrId":1,       // 平台属性id
        "attrName":"颜色",
        id:
        skuId:
        valueId:1         // 平台属性值id
        valueName:"白色"
      }
    ],
    "skuSaleAttrValueList":[ // 销售属性
      {
        "saleAttrId":             // 属性ID
        "saleAttrValueId":            // 属性值Id
      }]
    "skuDefaultImg":"",       // 售卖sku图片地址
  }
*/

// 获取SKU数据
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

// 删除spu
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
