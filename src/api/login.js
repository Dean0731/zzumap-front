import request from '@/utils/request'
import qs from 'qs'
export function login(data) {
  data = qs.stringify(data)
  return request({
    url: '/login/loginForm',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
