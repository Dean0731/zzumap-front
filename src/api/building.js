import request from '@/utils/request'
export function fetchBuildingList(query) {
  return request({
    url: '/admin/building',
    method: 'get',
    params: query
  })
}

export function fetchBuilding(id) {
  return request({
    url: '/admin/building/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteBuilding(idList) {
  return request({
    url: '/admin/building',
    method: 'delete',
    params: { idList }
  })
}

export function createBuilding(data) {
  return request({
    url: '/admin/building',
    method: 'post',
    data
  })
}

export function updateBuilding(data) {
  return request({
    url: '/admin/building',
    method: 'put',
    data
  })
}

