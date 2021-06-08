<template>
  <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
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
    <el-button @click="dialogFormVisible = false">
      Cancel
    </el-button>
    <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
      Confirm
    </el-button>
  </el-form>

</template>

<script>
import { createBuilding, updateBuilding } from '@/api/building'

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
      dialogStatus: '',
      cls: cls,
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
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createBuilding(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
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
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
          this.getList()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
