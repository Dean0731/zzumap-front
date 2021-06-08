<template>
  <div class="app-container">
    资源：<el-select v-model="type" placeholder="请选择" clearable class="filter-item" style="width: 200px;margin-right:10px">
      <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
    </el-select>
    页码：<el-input v-model="page" style="width: 200px;margin-right:10px" />
    大小：<el-input v-model="size" style="width: 200px;margin-right:10px" />
    <el-button @click="download">下载</el-button>
  </div>
</template>

<script>
import { exportToExcel } from '@/utils/export'
import { fetchBuildingList } from '@/api/building'
import { fetchSourceList } from '@/api/source'
import { fetchTeacherList } from '@/api/teacher'
import { fetchCourseList } from '@/api/course'
import { fetchRoomList } from '@/api/room'

const calendarTypeOptions = [
  { key: '建筑物', display_name: '建筑物', header: ['bid', 'name', 'childName', 'belong', 'height', 'gid', 'type', 'tag', 'tel', 'address'], 'method': fetchBuildingList },
  { key: '资源信息', display_name: '资源信息', header: ['oid', 'title', 'url', 'takeTime', 'tag', 'type'], 'method': fetchSourceList },
  { key: '教师', display_name: '教师', header: ['tid', 'name', 'email', 'tel', 'introduction'], 'method': fetchTeacherList },
  { key: '课程', display_name: '课程', header: ['cid', 'name', 'tid', 'rid', 'week', 'startTime', 'endTime', 'introduction'], 'method': fetchCourseList },
  { key: '房间', display_name: '房间', header: ['rid', 'roomNumber', 'bid', 'tag', 'introduction'], 'method': fetchRoomList }
]
export default {
  name: 'Export',
  data() {
    return {
      calendarTypeOptions,
      page: 1,
      size: -1,
      type: undefined
    }
  },
  methods: {
    download() {
      if (this.type === undefined) {
        this.$message.warning('请先选择资源！')
        return
      }
      for (var i = 0; i < this.calendarTypeOptions.length; i++) {
        if (this.type === this.calendarTypeOptions[i]['key']) {
          const query = { page: this.page, size: this.size }
          this.calendarTypeOptions[i]['method'](query).then(response => {
            exportToExcel(response.data.records, this.calendarTypeOptions[i]['header'])
          })
          return
        }
      }
    }
  }
}
</script>
<style scoped>

</style>
