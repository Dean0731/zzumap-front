import request from '@/utils/request'
export function fetchTeacherList(query) {
  return request({
    url: '/admin/teacher',
    method: 'get',
    params: query
  })
}

export function fetchTeacher(id) {
  return request({
    url: '/admin/teacher/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteTeacher(idList) {
  return request({
    url: '/admin/teacher',
    method: 'delete',
    params: { idList }
  })
}

export function createTeacher(data) {
  return request({
    url: '/admin/teacher',
    method: 'post',
    data
  })
}

export function updateTeacher(data) {
  return request({
    url: '/admin/teacher',
    method: 'put',
    data
  })
}

