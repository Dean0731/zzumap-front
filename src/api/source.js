import request from '@/utils/request'
export function fetchSourceList(query) {
  return request({
    url: '/admin/source',
    method: 'get',
    params: query
  })
}

export function fetchSource(id) {
  return request({
    url: '/admin/source/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteSource(idList) {
  return request({
    url: '/admin/source',
    method: 'delete',
    params: { idList }
  })
}

export function createSource(data) {
  return request({
    url: '/admin/source',
    method: 'post',
    data
  })
}

export function updateSource(data) {
  return request({
    url: '/admin/source',
    method: 'put',
    data
  })
}

