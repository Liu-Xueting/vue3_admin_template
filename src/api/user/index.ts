// 统一管理用户相关接口
import request from '@/utils/request'
// import type {
//   loginFormData,
//   loginResponseData,
//   userInfoResponseData,
// } from './type'
import type { LoginForm, LoginResponseData, UserInfoResponseData } from './type'
enum API {
  // LOGIN_URL = '/admin/acl/index/login',
  LOGIN_URL = '/user/login',
  // USERINFO_URL = '/admin/acl/index/info',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}
// 登录
export const reqLogin = (data: LoginForm) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserInfo = () =>
  request.get<any, UserInfoResponseData>(API.USERINFO_URL)

// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
