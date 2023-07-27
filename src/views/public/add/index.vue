<template>
  <div>
    <el-form :model="form" ref="newPublicForm" label-width="100px">
    <el-form-item label="稱呼" prop="nickname">
      <el-input v-model="form.nickname" placeholder="請輸入稱呼" id="nickname"></el-input>
    </el-form-item>

    <el-form-item label="姓名（必填）" prop="full_name">
      <el-input v-model="form.full_name" placeholder="請輸入姓名" id="full_name"></el-input>
    </el-form-item>

    <el-form-item label="手機" prop="phone">
      <el-input v-model="form.phone" placeholder="請輸入手機" id="phone"></el-input>
    </el-form-item>

    <el-form-item label="FSM" prop="fsm_id">
      <el-autocomplete v-model="fsm_name" :fetch-suggestions="fetchSuggestions" placeholder="請輸入文字搜尋" @select="handleSelect" id="fsm_id" />
    </el-form-item>

    <el-form-item label="日期" prop="date">
      <el-date-picker v-model="form.date" type="date" placeholder="選擇日期"  id="date"></el-date-picker>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { publicSearch, publicAdd } from '@/api/public'

export default {
  data() {
    return {
      form: {
        nickname: '',
        full_name: '',
        phone: '',
        fsm_id: 0,
        date: new Date()
      },
      fsm_name: ''
    }
  },
  methods: {
    submitForm() {
      const ts = this.form.date.getTime()
      publicAdd(this.form.nickname, this.form.full_name, this.form.phone, this.form.fsm_id, ts).then(response => {
        alert('已新增')
        location.reload()
      }).catch((err) => {
        alert(err)
      })
    },
    resetForm() {
      this.$refs.newPublicForm.resetFields()
    },
    // FSM
    fetchSuggestions(queryString, callback) {
      publicSearch(1, 7, queryString).then(response => {
        var rows = response.data.rows

        if (rows.length > 0) {
          rows = rows.map(row => {
            return {
              ...row,
              value: row.name,
            }
          })
        }
        
        callback(rows)
      }).catch((err) => {
        alert(err)
      })
    },
    handleSelect(item) {
      this.form.fsm_id = item.public_id
    },
  }
}
</script>
