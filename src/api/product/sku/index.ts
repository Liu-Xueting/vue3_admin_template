import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'

enum API {
  SKU_URL = '/admin/product/list/',
  SALE_URL = '/admin/product/onSale/',
  CANCEL_SALE_URL = '/admin/product/cancelSale/',
  SKUINFO_URL = '/admin/product/getSkuInfo/',
}

// 获取商品sku
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

// 已有商品上架请求
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)

// 商品下架接口
export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(API.CANCEL_SALE_URL + skuId)

// 根据商品id得到商品信息
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
/*
    code:
    message:
    data:{
      id:
      createTime:
      updateTime:
      spuId:
      price:
      skuName:
      skuDesc:
      weight:
      tmId:
      category3Id:
      skuDefaultImg:
      isSale
      skuImageList:[{
        id:
        createTime:
        updateTime:
        skuId:
        imgName:
        imgUrl:
        spuImgId:
        isDefault
      }],
      skuAttrValueList:[{
        id:
         createTime:
        updateTime:
        attrId:
        valueId:
        skuId:
        attrName:
        valueName
      }],
      skuSaleAttrValueList:[{
        id:
        createTime:
        updateTime:
        skuId:
        spuId:
        saleAttrId:
        saleAttrName:
        saleAttrValueId:
        saleAttrValueName:

      }],
      ok:true
    }
*/
