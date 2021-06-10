<template>
  <div class="app-container">
    <div style="text-align: center;"><h2>{{ dialogStatus }}</h2></div>
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
      <el-form-item label="课程名" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="教师" prop="tid">
        <el-select
          v-model="temp.tid"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethodTeacher"
        >
          <el-option
            v-for="item in teachers"
            :key="item.tid"
            :label="item.name"
            :value="item.tid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房间" prop="rid">
        <el-select
          v-model="temp.rid"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethodRoom"
        >
          <el-option
            v-for="item in rooms"
            :key="item.rid"
            :value="item.rid"
            :label="item.roomNumber"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上课周" prop="week">
        <el-input v-model="temp.week" />
      </el-form-item>
      <el-form-item label="周几" prop="day">
        <el-input v-model="temp.day" />
      </el-form-item>
      <el-form-item label="上课时间" prop="time">
        <el-input v-model="temp.time" />
      </el-form-item>
      <el-form-item label="介绍" prop="introduction">
        <el-input v-model="temp.introduction" type="textarea" />
      </el-form-item>
      <el-button>
        Cancel
      </el-button>
      <el-button type="primary" @click="dialogStatus==='添加'?createData():updateData()">
        Confirm
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { updateCourse, createCourse, fetchCourse } from '@/api/course'

import { loadingFullScreen } from '@/utils/loading'
import { fetchTeacherList } from '@/api/teacher'
import { fetchRoomList } from '@/api/room'
export default {
  name: 'CreateOrUpdateVue',
  data() {
    return {
      dialogStatus: '添加',
      temp: {
        name: undefined,
        tid: undefined,
        rid: undefined,
        week: undefined,
        day: undefined,
        time: undefined,
        introduction: undefined
      },
      teachers: [],
      rooms: []
    }
  },
  mounted() {
    if (this.$route.query.cid !== undefined) {
      this.dialogStatus = '修改'
      const cid = this.$route.query.cid
      fetchCourse(cid).then(response => {
        this.temp = response.data
      })
    }
  },
  methods: {
    resetTemp() {
      this.temp = {
        name: undefined,
        tid: undefined,
        rid: undefined,
        week: undefined,
        day: undefined,
        time: undefined,
        introduction: undefined
      }
    },
    remoteMethodTeacher(query) {
      fetchTeacherList({ name: query }).then(response => {
        this.teachers = response.data.records
      })
    },
    remoteMethodRoom(query) {
      fetchRoomList({ name: query }).then(response => {
        this.rooms = response.data.records
      })
    },
    createData() {
      const loading = loadingFullScreen(this)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCourse(this.temp).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            loading.close()
          })
        }
      })
    },
    updateData() {
      const loading = loadingFullScreen(this)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCourse(tempData).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            loading.close()
          })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
