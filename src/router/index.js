import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/building',
    component: Layout,
    redirect: '/building/index',
    name: 'building',
    meta: { title: 'building', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/building'),
        meta: { title: '建筑物管理', icon: 'el-icon-office-building' }
      }
    ]
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/index',
    name: 'teacher',
    meta: { title: 'teacher', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'teacher',
        name: 'Teacher',
        component: () => import('@/views/teacher'),
        meta: { title: '教师管理', icon: 'el-icon-user-solid' }
      }
    ]
  },

  {
    path: '/source',
    component: Layout,
    redirect: '/source/index',
    name: 'source',
    meta: { title: 'source', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'source',
        name: 'Source',
        component: () => import('@/views/source'),
        meta: { title: '资源管理', icon: 'el-icon-picture' }
      }
    ]
  },

  {
    path: '/room',
    component: Layout,
    redirect: '/room/index',
    name: 'room',
    meta: { title: 'room', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'room',
        name: 'room',
        component: () => import('@/views/room'),
        meta: { title: '房间管理', icon: 'el-icon-house' }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/index',
    name: 'course',
    meta: { title: 'course', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'course',
        name: 'course',
        component: () => import('@/views/course'),
        meta: { title: '课程管理', icon: 'el-icon-notebook-2' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
