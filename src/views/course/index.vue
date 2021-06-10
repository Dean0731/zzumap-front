<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="课程名" style="width: 200px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
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
          <span>{{ row.cid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上课周" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.week }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上课时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上课日期" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.day }}</span>
        </template>
      </el-table-column>
      <el-table-column label="介绍" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="showTeacher(row)">
            任课教师
          </el-button>
          <el-button type="primary" size="mini" @click="showRoom(row)">
            房间
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
    <el-dialog
      title="教师信息"
      :visible.sync="dialogVisibleTeacher"
      width="30%"
      center
    >
      <ul>
        <li class="showInfo"><span>姓名:{{ teacher.name }}</span></li>
        <li class="showInfo"><span>邮件:{{ teacher.email }}</span></li>
        <li class="showInfo"><span>电话:{{ teacher.tel }}</span></li>
        <li class="showInfo"><span>介绍:{{ teacher.introduction }}</span></li>
      </ul>
    </el-dialog>
    <el-dialog
      title="房间信息"
      :visible.sync="dialogVisibleRoom"
      width="30%"
      center
    >
      <ul>
        <li class="showInfo"><span>房间号:{{ room.roomNumber }}</span></li>
        <li class="showInfo"><span>所属建筑:{{ room.bid }}</span></li>
        <li class="showInfo"><span>标签:{{ room.tag }}</span></li>
        <li class="showInfo"><span>介绍:{{ room.introduction }}</span></li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCourseList, deleteCourse } from '@/api/course'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { fetchTeacher } from '@/api/teacher'
import { fetchRoom } from '@/api/room'
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
        name: undefined
      },
      dialogVisibleTeacher: false,
      teacher: {
        name: undefined,
        email: undefined,
        tel: undefined,
        introduction: undefined
      },
      dialogVisibleRoom: false,
      room: {
        roomNumber: undefined,
        bid: undefined,
        tag: undefined,
        introduction: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchCourseList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    showTeacher(row) {
      fetchTeacher(row.tid).then(response => {
        if (response.data != null) {
          this.dialogVisibleTeacher = true
          this.teacher = response.data
        }
      })
    },
    showRoom(row) {
      fetchRoom(row.rid).then(response => {
        if (response.data != null) {
          this.dialogVisibleRoom = true
          this.room = response.data
        }
      })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/course/edit', query: {
        cid: row.cid }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row, index) {
      this.$confirm('此操作将任务状态改为删除状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCourse(row.cid)
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
