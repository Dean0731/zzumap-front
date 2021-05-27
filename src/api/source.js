import request from '@/utils/request'
export function fetchSourceList(query) {
  return request({
    url: '/source',
    method: 'get',
    params: query
  })
}

export function fetchSource(id) {
  return request({
    url: '/source/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteSource(idList) {
  return request({
    url: '/source',
    method: 'delete',
    params: { idList }
  })
}

export function createSource(data) {
  return request({
    url: '/source',
    method: 'post',
    data
  })
}

export function updateSource(data) {
  return request({
    url: '/source',
    method: 'put',
    data
  })
}

