<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名字" style="width: 200px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.tag" placeholder="标签" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.belong" placeholder="校区" clearable class="filter-item" style="width: 200px;margin-right:10px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>
    <br>
    <el-table
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
          <span>{{ row.bid }}</span>
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
          <span>{{ cls[Number(row.type)]['display_name'] }}</span>
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
      <el-table-column label="详细地址" align="center" width="100">
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
  </div>
</template>

<script>
import { fetchBuildingList, deleteBuilding } from '@/api/building'
import { fetchSourceList } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
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
      cls: cls,
      sourceList: [],
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
      calendarTypeOptions
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
      this.$alert(row.introduction, '详细介绍', {
        confirmButtonText: '确定'
        // callback: action => {
        //   this.$message({
        //     type: 'info',
        //     message: `action: ${action}`
        //   })
        // }
      })
    },
    handleGetImage(row) {
      const query = { oid: row.bid }
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
    handleUpdate(row) {
      this.$router.push({ path: '/building/edit', query: {
        bid: row.bid }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将任务状态改为删除状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBuilding(row.bid)
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
