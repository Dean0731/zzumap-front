import request from '@/utils/request'
export function fetchBuildingList(query) {
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

export function deleteBuilding(idList) {
  return request({
    url: '/building',
    method: 'delete',
    params: { idList }
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

