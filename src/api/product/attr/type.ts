// 分类相关数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 相应的分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 属性与属性值的类型
/*
  code:number
  message:string
  ok:boolean
  data:{
    id: 106,
    attrName:"手机系统"
    categoryId: 2,  // 所属三级分类id
    categoryLevel: 1,// 代表几级分类
    attrValueList:[
      {
        id: 1, 
        valueName: "苹果", 
        attrId: 106
      },
    ]
  }
*/

// 属性值
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number // 属性id
  flag?: boolean
}

export type AttrValueList = AttrValue[]

// 属性
export interface Attr {
  id?: number
  attrName: string
  categoryId: number
  categoryLevel: number
  attrValueList?: AttrValueList
}

// 每个属性对象数组
export type AttrList = Attr[]

// 属性接口返回数据类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}
