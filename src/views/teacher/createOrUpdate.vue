<template>
  <div class="app-container">
    <div style="text-align: center;"><h2>{{ dialogStatus }}</h2></div>
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
      <el-form-item label="名字" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="temp.tel" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="temp.email" />
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
import { updateTeacher, createTeacher, fetchTeacher } from '@/api/teacher'
import { loadingFullScreen } from '@/utils/loading'

export default {
  name: 'CreateOrUpdateVue',
  data() {
    return {
      dialogStatus: '添加',
      temp: {
        name: undefined,
        email: undefined,
        introduction: undefined,
        tel: undefined
      }
    }
  },
  mounted() {
    if (this.$route.query.tid !== undefined) {
      this.dialogStatus = '修改'
      const tid = this.$route.query.tid
      fetchTeacher(tid).then(response => {
        this.temp = response.data
      })
    }
  },
  methods: {
    createData() {
      const loading = loadingFullScreen(this)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createTeacher(this.temp).then(() => {
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
          updateTeacher(tempData).then(() => {
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
