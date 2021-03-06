import request from '@/utils/request'
// import qs from 'qs'
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function fetchList(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteUser(id) {
  return request({
    url: '/user',
    method: 'get',
    params: { id }
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUpdate(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

