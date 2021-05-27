<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.tag" placeholder="标签" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.belong" placeholder="校区" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <br>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60" :class-name="getSortClass('id')">
        <template slot-scope="{$index}">
          <span>{{ $index+1+listQuery.size*(listQuery.current-1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="GID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.gid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="校区" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.belong }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="子名字" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.childName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高度" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.height }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ cls[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="success" @click="handleGetIntroduce(row)">
            介绍
          </el-button>
          <el-button size="mini" type="success" @click="handleGetImage(row)">
            图片
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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
          <el-input v-model="temp.type" />
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchBuildingList, updateBuilding, createBuilding, deleteBuilding } from '@/api/building'
import { fetchSourceList } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: '东校区', display_name: '东' },
  { key: '南校区', display_name: '南' },
  { key: '北校区', display_name: '北' },
  { key: '医学院', display_name: '医' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      cls: { 0: '实验室', 1: '教学楼', 2: '行政楼', 3: '其他' },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        tag: undefined,
        name: undefined,
        belong: undefined
      },
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
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        belong: [{ required: true, message: 'belong is required', trigger: 'change' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        height: [{ required: true, message: 'height is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchBuildingList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleGetIntroduce(row) {
      this.$message({
        message: row.bid + row.introduction,
        type: 'success'
      })
    },

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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将任务状态改为删除状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteBuilding(row.bid)
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$message.info('操作已取消！')
      })
    },

    handleGetImage(row) {
      const query = { oid: row.bid }
      fetchSourceList(query).then(response => {
        alert(response.data.records)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['bid', 'name', 'childName', 'belong', 'height', 'gid', 'type', 'tag', 'tel', 'address', 'createTime']
        const filterVal = ['bid', 'name', 'childName', 'belong', 'height', 'gid', 'type', 'tag', 'tel', 'address', 'createTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
