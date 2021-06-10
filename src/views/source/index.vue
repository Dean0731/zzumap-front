<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="名字" style="width: 200px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
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
      <el-table-column label="标签" align="center" width="300">
        <template slot-scope="{row}">
          <el-tag
            v-for="item in row.tag"
            :key="item.name"
            :type="item.type"
            effect="dark"
            style="margin: 0px 2px 0px 0px"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拍摄时间" align="center" width="160">
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
  </div>
</template>

<script>
import { fetchSourceList, deleteSource } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { changeTagList } from '@/utils/myutil'
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
      sourceList: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        title: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchSourceList(this.listQuery).then(response => {
        this.list = changeTagList(response.data.records)
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
    handleUpdate(row) {
      this.$router.push({ path: '/source/edit', query: {
        sid: row.sid }
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
    }
  }
}
</script>
