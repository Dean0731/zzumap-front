import request from '@/utils/request'
export function fetchRoomList(query) {
  return request({
    url: '/room',
    method: 'get',
    params: query
  })
}

export function fetchRoom(id) {
  return request({
    url: '/room/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteRoom(idList) {
  return request({
    url: '/room',
    method: 'delete',
    params: { idList }
  })
}

export function createRoom(data) {
  return request({
    url: '/room',
    method: 'post',
    data
  })
}

export function updateRoom(data) {
  return request({
    url: '/room',
    method: 'put',
    data
  })
}

