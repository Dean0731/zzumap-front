<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roomNumber" placeholder="房间号" style="width: 200px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
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
          <span>{{ row.rid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间号" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.roomNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属建筑" align="center" width="180">
        <template slot-scope="{row}">
          <el-button type="text" @click="handlerBuilding(row)">{{ row.bid }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="介绍" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="所属建筑" prop="bid">
          <el-select
            v-model="temp.bid"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in buildings"
              :key="item.bid"
              :label="item.name+'('+item.bid+')'"
              :value="item.bid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="temp.roomNumber" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input v-model="temp.tag" />
        </el-form-item>
        <el-form-item label="介绍" prop="introduction">
          <el-input v-model="temp.introduction" type="textarea" />
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
    <el-dialog
      title="房间信息"
      :visible.sync="dialogVisibleBuilding"
      width="30%"
      center
    >
      <ul>
        <li class="showInfo"><span>名字:{{ building.name }}</span></li>
        <li class="showInfo"><span>名字2:{{ building.childName }}</span></li>
        <li class="showInfo"><span>所属校区:{{ building.belong }}</span></li>
        <li class="showInfo"><span>高度:{{ building.height }}</span></li>
        <li class="showInfo"><span>电话:{{ building.tel }}</span></li>
        <li class="showInfo"><span>介绍:{{ building.introduction }}</span></li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRoomList, updateRoom, createRoom, deleteRoom } from '@/api/room'
import { fetchSourceList } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { fetchBuilding, fetchBuildingList } from '@/api/building'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      sourceList: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        roomNumber: undefined
      },
      temp: {
        bid: undefined,
        roomNumber: undefined,
        tah: undefined,
        introduction: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogVisibleBuilding: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      buildings: [],
      building: {
        name: undefined,
        childName: undefined,
        belong: undefined,
        height: undefined,
        tel: undefined,
        introduction: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    remoteMethod(query) {
      fetchBuildingList({ childName: query }).then(response => {
        this.buildings = response.data.records
      })
    },
    getList() {
      this.listLoading = true
      fetchRoomList(this.listQuery).then(response => {
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
      const query = { oid: row.rid }
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
          createRoom(this.temp).then(() => {
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
    handlerBuilding(row) {
      this.dialogVisibleBuilding = true
      fetchBuilding(row.bid).then(response => {
        if (response.data != null) {
          this.building = response.data
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
          updateRoom(tempData).then(() => {
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
        deleteRoom(row.rid)
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
    }
  }
}
</script>
<style>
.showInfo{
  margin-bottom: 18px;
}
</style>
