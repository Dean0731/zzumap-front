<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="名字" style="width: 200px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="序号" prop="id" align="center" width="60">
        <template slot-scope="{$index}">
          <span>{{ $index+1+listQuery.size*(listQuery.current-1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.sid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="url" align="center" width="500">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" :content="row.url" placement="top-start">
            <span>{{ row.url | ellipsis }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row.takeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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
  </div>
</template>

<script>
import { fetchSourceList, updateSource, createSource, deleteSource } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

import { fetchBuildingList } from '@/api/building'
import { fetchRoomList } from '@/api/room'
const cls = [
  { key: '房间', display_name: '房间' },
  { key: '建筑物', display_name: '建筑物' },
  { key: '其他', display_name: '其他' }
]
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 50) {
        return value.slice(0, 50) + '...'
      }
      return value
    }
  },
  data() {
    return {
      tableKey: 0,
      cls: cls,
      sourceList: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        title: undefined
      },
      options: [],
      value: [],
      temp: {
        oid: undefined,
        title: undefined,
        url: undefined,
        tag: undefined,
        takeTime: undefined,
        type: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {},
      downloadLoading: false
    }
  },
  created() {
    this.getList()
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
    getList() {
      this.listLoading = true
      fetchSourceList(this.listQuery).then(response => {
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
    handleGetImage(row) {
      const query = { oid: row.tid }
      fetchSourceList(query).then(response => {
        const source = response.data.records
        if (source.length === 0) {
          this.$message.success('暂无资源！')
        } else {
          this.sourceList = source
          this.$message.success('以获取到图片信息,等待展示')
        }
      })
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
          createSource(this.temp).then(() => {
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
          updateSource(tempData).then(() => {
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
        deleteSource(row.sid)
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['oid', 'title', 'url', 'takeTime', 'tag', 'type']
        const filterVal = ['oid', 'title', 'url', 'takeTime', 'tag', 'type']
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
    }
  }
}
</script>
