<template>
  <div>

    <div style="display: flex; align-items: center;">
      <el-input v-model="filterText" placeholder="請輸入姓名或電話，並按下 Enter" @input="handleFilterInput" />
      <el-button @click="handleButtonClick">新增大眾</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="電話" prop="phone" />
      <el-table-column label="狀態" prop="status" />
      <el-table-column label="最後接觸時間" prop="updated_at" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleView(scope.row)">詳情</el-button>
          <el-button @click="handleRegister(scope.row)">註冊</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增分頁組件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    />

    <el-dialog :visible.sync="dialogVisible" title="新增大眾" width="80%">
      <AddPublic />
    </el-dialog>
  </div>
</template>

<script src="./init.js"></script>

