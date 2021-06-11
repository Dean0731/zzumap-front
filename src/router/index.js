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
    redirect: '/building/select',
    name: 'building',
    meta: { title: '建筑物管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: 'select',
        name: 'select',
        component: () => import('@/views/building/index'),
        meta: { title: '查询', icon: 'el-icon-search' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/building/createOrUpdate'),
        meta: { title: '编辑', icon: 'el-icon-edit' }
      }
    ]
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/select',
    name: 'teacher',
    meta: { title: '教师管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'select',
        name: 'select',
        component: () => import('@/views/teacher/index'),
        meta: { title: '查询', icon: 'el-icon-search' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/teacher/createOrUpdate'),
        meta: { title: '编辑', icon: 'el-icon-edit' }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/select',
    name: 'course',
    meta: { title: '课程管理', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'select',
        name: 'select',
        component: () => import('@/views/course/index'),
        meta: { title: '查询', icon: 'el-icon-search' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/course/createOrUpdate'),
        meta: { title: '编辑', icon: 'el-icon-edit' }
      }
    ]
  },
  {
    path: '/source',
    component: Layout,
    redirect: '/source/select',
    name: 'source',
    meta: { title: '资源管理', icon: 'file' },
    children: [
      {
        path: 'select',
        name: 'select',
        component: () => import('@/views/source/index'),
        meta: { title: '查询', icon: 'el-icon-search' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/source/createOrUpdate'),
        meta: { title: '编辑', icon: 'el-icon-edit' }
      }
    ]
  },

  {
    path: '/room',
    component: Layout,
    redirect: '/room/index',
    name: 'room',
    meta: { title: 'room', icon: 'house' },
    children: [
      {
        path: 'room',
        name: 'room',
        component: () => import('@/views/room'),
        meta: { title: '房间管理', icon: 'house' }
      }
    ]
  },
  {
    path: '/tool',
    component: Layout,
    redirect: '/course/export',
    name: 'tool',
    meta: { title: 'tool', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'export',
        name: 'export',
        component: () => import('@/views/util/export'),
        meta: { title: '数据导出', icon: 'el-icon-download' }
      },
      {
        path: 'import',
        name: 'import',
        component: () => import('@/views/util/import'),
        meta: { title: '数据导入', icon: 'el-icon-upload2' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/dashboard'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  }
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

