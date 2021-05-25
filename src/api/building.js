import request from '@/utils/request'
// import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/building',
    method: 'get',
    params: query
  })
}

export function fetchBuilding(id) {
  return request({
    url: '/building/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteBuilding(id) {
  return request({
    url: '/building',
    method: 'get',
    params: { id }
  })
}

export function createBuilding(data) {
  return request({
    url: '/building',
    method: 'post',
    data
  })
}

export function updateBuilding(data) {
  return request({
    url: '/building',
    method: 'put',
    data
  })
}

