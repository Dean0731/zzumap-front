import request from '@/utils/request'
export function fetchCourseList(query) {
  return request({
    url: '/admin/course',
    method: 'get',
    params: query
  })
}

export function fetchCourse(id) {
  return request({
    url: '/admin/course/' + id,
    method: 'get'
    // params: { id }
  })
}

export function deleteCourse(idList) {
  return request({
    url: '/admin/course',
    method: 'delete',
    params: { idList }
  })
}

export function createCourse(data) {
  return request({
    url: '/admin/course',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request({
    url: '/admin/course',
    method: 'put',
    data
  })
}

