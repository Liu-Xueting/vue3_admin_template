// 品牌管理接口
import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'

enum API {
  TRADMARK_URL = '/admin/product/baseTrademark/',
  ADD_TRADMARK_URL = '/admin/product/baseTrademark/save',
  UPDATE_TRADMARK_URL = '/admin/product/baseTrademark/update',
  DELETE_TRADMARK_URL = '/admin/product/baseTrademark/remove/',
}

// 获取已有品牌接口方法
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADMARK_URL + `${page}/${limit}`)

// 添加|修改 品牌
export const reqAddOrUpdateTrademark = (trademark: TradeMark) => {
  if (trademark.id) {
    return request.put<any, any>(API.UPDATE_TRADMARK_URL, trademark)
  } else {
    return request.post<any, any>(API.ADD_TRADMARK_URL, trademark)
  }
}

// 删除品牌
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_TRADMARK_URL + id)
/*
  code:
  message:
  data: null
  ok:true
*/
