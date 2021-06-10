<template>
  <div class="app-container">
    <div style="text-align: center;"><h2>{{ dialogStatus }}</h2></div>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
      <el-form-item label="类型" prop="type">
        <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
          <el-option v-for="item in cls" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属对象" prop="oid">
        <el-select
          v-model="temp.oid"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in options"
            :key="item.rid || item.bid "
            :label="item.childName || item.roomNumber"
            :value="item.rid || item.bid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="temp.url" />
      </el-form-item>
      <el-form-item label="时间" prop="takeTime">
        <el-date-picker v-model="temp.takeTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" />
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-input v-model="temp.tag" />
      </el-form-item>
      <el-button @click="dialogFormVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="dialogStatus==='添加'?createData():updateData()">
        Confirm
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { loadingFullScreen } from '@/utils/loading'
import { fetchBuildingList } from '@/api/building'
import { fetchRoomList } from '@/api/room'
import { createSource, fetchSource, updateSource } from '@/api/source'
const cls = [
  { key: '房间', display_name: '房间' },
  { key: '建筑物', display_name: '建筑物' },
  { key: '其他', display_name: '其他' }
]
export default {
  name: 'CreateOrUpdateVue',
  data() {
    return {
      options: [],
      value: [],
      cls,
      temp: {
        oid: undefined,
        title: undefined,
        url: undefined,
        tag: undefined,
        takeTime: undefined,
        type: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '添加'
    }
  },
  mounted() {
    if (this.$route.query.sid !== undefined) {
      this.dialogStatus = '修改'
      const sid = this.$route.query.sid
      fetchSource(sid).then(response => {
        this.temp = response.data
      })
    }
  },
  methods: {
    remoteMethod(search) {
      if (this.temp.type === '建筑物') {
        fetchBuildingList({ childName: search }).then(response => {
          this.options = response.data.records
        })
      } else if (this.temp.type === '房间') {
        fetchRoomList({ roomNumber: search }).then(response => {
          this.options = response.data.records
        })
      } else {
        this.$message.warning('请先选择类型')
      }
    },
    resetTemp() {
      this.temp = {
        oid: undefined,
        title: undefined,
        url: undefined,
        tag: undefined,
        takeTime: undefined,
        type: undefined
      }
    },
    createData() {
      const loading = loadingFullScreen(this)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSource(this.temp).then(() => {
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
          updateSource(tempData).then(() => {
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
