import AddPublic from '../add/index.vue'
import { publicSearch } from '@/api/public'
import { formatTime } from '@/utils/index.js'

export default {
  components: {
    AddPublic
  },
  data() {
    return {
      filterText: '',
      tableData: [],
      totalCount: 1,
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false
    }
  },
  async created() {
    await this.fetchData()
  },
  computed: {
  },
  methods: {
    fetchData() {
      return new Promise((resolve, reject) => {
        publicSearch(this.currentPage, this.pageSize, this.filterText).then(response => {
          var rows = response.data.rows
          var totalCount = response.data.total_count

          rows = rows.map(row => {
            return {
              ...row,
              created_at: formatTime(new Date(row.created_at)),
              updated_at: formatTime(new Date(row.updated_at)),
            }
          })

          this.tableData = rows
          this.totalCount = totalCount

          resolve()
        }).catch((err) => {
          alert(err)
          reject(err)
        })
      })
    },
    // 搜尋
    async handleFilterInput(val) {
        this.filterText = val
      await this.fetchData()
    },
    // 操作
    async handleView(row) {
      console.log('View:', row)
    },
    async handleRegister(row) {
      this.$router.push({ name: 'public_info', params: { data: row } })
    },
    // 分頁組件
    async handleSizeChange(val) {
      this.pageSize = val
    },
    async handleCurrentChange(val) {
      this.currentPage = val
      await this.fetchData()
    },
    // 新增大眾-彈窗按鈕
    async handleButtonClick() {
      this.dialogVisible = true
    },
    async handleDialogClose() {
      this.dialogVisible = false
    }
  }
}