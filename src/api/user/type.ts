// 登录接口需要携带的ts类型
export interface LoginForm {
  username: string
  password: string
}

interface dataType {
  token?: string
  meesage?: string
}

// 登录接口返回数据类型
export interface LoginResponseData {
  code: number
  data: dataType
}

interface userInfo {
  userId: number
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}

interface user {
  checkUser: userInfo
}

// 用户信息接口返回数据类型
export interface UserInfoResponseData {
  code: number
  data: user
}

// // 定义用户相关数据的ts类型

// // 登录请求参数类型
// export interface loginFormData {
//   username: string
//   password: string
// }

// // 接口返回数据类型
// export interface ResponseData {
//   code: number
//   message: string
//   ok: boolean
// }

// // 登录接口返回数据类型
// export interface loginResponseData extends ResponseData {
//   data: string
// }

// // 获取用户信息返回书记类型
// export interface userInfoResponseData extends ResponseData {
//   data: {
//     routes: string[]
//     buttons: string[]
//     roles: string[]
//     name: string
//     avatar: string
//   }
// }
