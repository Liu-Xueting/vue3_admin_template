// 书写相关属性相关的API文件
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'
enum API {
  CATEGORY1_URL = '/admin/product/getCategory1', //获取一级分类
  CATEGORY2_URL = '/admin/product/getCategory2/', //获取二级分类
  CATEGORY3_URL = '/admin/product/getCategory3/', //获取三级分类
  ATTR_INFO_URL = '/admin/product/attrInfoList/', //获取平台属性列表
  ADD_OR_UPDATE_ATTR_URL = '/admin/product/saveAttrInfo', //添加或修改属性
  DELETE_ATTR_URL = '/admin/product/deleteAttr/', //删除属性
}

// 获取一级分类
export const reqCategory1 = () =>
  request.get<any, CategoryResponseData>(API.CATEGORY1_URL)

// 获取二级分类
export const reqCategory2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.CATEGORY2_URL + category1Id)

// 获取三级分类
export const reqCategory3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.CATEGORY3_URL + category2Id)

// 获取分类下已有属性
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_INFO_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

// 新增或修改
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADD_OR_UPDATE_ATTR_URL, data)

// 删除属性
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETE_ATTR_URL + attrId)
// 一级
/*
    code:200
    message:"成功"
    data:[
    {
        id:1,
        name:"图书、音像、电子书刊"
    },
    {
        id:2,
        name:"手机"
    }
    ]
    ok:true
*/

// 二级
/*
    code:200
    message:"成功"
    data:[
    {
        id:1,
        name:"手机通讯",
        category1Id:2
    },
    {
        id:2,
        name:"运营商",
        category1Id:2
    }
    ]
    ok:true
*/

// 三级
/*
    code:200
    message:"成功"
    data:[
    {
        id:1,
        name:"手机通讯",
        category2Id:1
    },
    {
        id:2,
        name:"运营商",
        category2Id:1
    }
    ]
    ok:true
*/

/*
    id: 106,
    attrName:"手机系统"
    categoryId: 2,        // 所属三级分类id
    categoryLevel: 1,     // 代表几级分类
    attrValueList:[
      {
        id: 1, 
        valueName: "苹果", 
        attrId: 106
      },
    ]
   
    新增一个属性:
   {
        attrName:string     // 新增属性名字
        categoryId: '',     三级分类id
        categoryLevel: 3,   
        attrValueList:[     // 新增属性值数组
            {
                valueName: string, 
            },
        ]
   }
*/
