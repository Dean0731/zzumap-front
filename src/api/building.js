import request from '@/utils/request'
// function checkBlank(query) {
//   for (var key in query) {
//     if (query[key] === '') {
//       query[key] = undefined
//     }
//   }
//   return query
// }
export function fetchBuildingList(query) {
  // query = checkBlank(query)
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

