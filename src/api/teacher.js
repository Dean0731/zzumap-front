import request from '@/utils/request'
export function fetchTeacherList(query) {
  return request({
    url: '/teacher',
    method: 'get',
    params: query
  })
}

export function fetchTeacher(id) {
  return request({
    url: '/teacher/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteTeacher(idList) {
  return request({
    url: '/teacher',
    method: 'delete',
    params: { idList }
  })
}

export function createTeacher(data) {
  return request({
    url: '/teacher',
    method: 'post',
    data
  })
}

export function updateTeacher(data) {
  return request({
    url: '/teacher',
    method: 'put',
    data
  })
}

