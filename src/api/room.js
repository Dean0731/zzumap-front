import request from '@/utils/request'
export function fetchRoomList(query) {
  return request({
    url: '/admin/room',
    method: 'get',
    params: query
  })
}

export function fetchRoom(id) {
  return request({
    url: '/admin/room/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteRoom(idList) {
  return request({
    url: '/admin/room',
    method: 'delete',
    params: { idList }
  })
}

export function createRoom(data) {
  return request({
    url: '/admin/room',
    method: 'post',
    data
  })
}

export function updateRoom(data) {
  return request({
    url: '/admin/room',
    method: 'put',
    data
  })
}

