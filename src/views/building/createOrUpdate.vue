<template>
  <div class="app-container">
    <div style="text-align: center;"><h2>{{ dialogStatus }}</h2></div>
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
      <el-form-item label="校区" prop="belong">
        <el-select v-model="temp.belong" class="filter-item" placeholder="Please select">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="子名字" prop="childName">
        <el-input v-model="temp.childName" />
      </el-form-item>
      <el-form-item label="高度" prop="height">
        <el-input v-model="temp.height" type="number" />
      </el-form-item>
      <el-form-item label="GID" prop="gid">
        <el-input v-model="temp.gid" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
          <el-option v-for="item in cls" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式" prop="tel">
        <el-input v-model="temp.tel" />
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-input v-model="temp.tag" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="temp.address" />
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
import { updateBuilding, createBuilding, fetchBuilding } from '@/api/building'
const calendarTypeOptions = [
  { key: '东校区', display_name: '东校区' },
  { key: '南校区', display_name: '南校区' },
  { key: '北校区', display_name: '北校区' },
  { key: '医学院', display_name: '医学院' }
]
const cls = [
  { key: '0', display_name: '教学楼' },
  { key: '1', display_name: '实验室' },
  { key: '2', display_name: '行政楼' },
  { key: '3', display_name: '其他' }
]
export default {
  name: 'CreateOrUpdateVue',
  data() {
    return {
      dialogStatus: '添加',
      cls,
      calendarTypeOptions,
      temp: {
        name: undefined,
        childName: undefined,
        belong: undefined,
        height: undefined,
        gid: undefined,
        type: undefined,
        tag: undefined,
        tel: undefined,
        address: undefined
      }
    }
  },
  mounted() {
    if (this.$route.query.bid !== undefined) {
      this.dialogStatus = '修改'
      const bid = this.$route.query.bid
      fetchBuilding(bid).then(response => {
        this.temp = response.data
      })
    }
  },
  methods: {
    resetTemp() {
      this.temp = {
        name: undefined,
        childName: undefined,
        belong: undefined,
        height: undefined,
        type: undefined,
        tag: undefined,
        tel: undefined,
        address: undefined
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createBuilding(this.temp).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateBuilding(tempData).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
