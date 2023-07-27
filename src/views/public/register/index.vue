<template>
  <div>
    <!-- 第一區塊 -->
    <el-form label-position="top">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="接觸職員">
            <el-select v-model="data.contact1">
              <el-option v-for="contact in data.contacts" :key="contact.id" :label="contact.name" :value="contact.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="接觸職員">
            <el-select v-model="data.contact2">
              <el-option v-for="contact in data.contacts" :key="contact.id" :label="contact.name" :value="contact.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="接觸職員">
            <el-select v-model="data.contact3">
              <el-option v-for="contact in data.contacts" :key="contact.id" :label="contact.name" :value="contact.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否是IAS會員">
            <el-select v-model="data.isIASMember">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="日期">
            <el-date-picker v-model="data.date" type="date" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="情緒度">
            <el-select v-model="data.tone">
              <el-option v-for="tone in data.tones" :key="tone.id" :label="tone.name" :value="tone.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="服務收據">
            <el-input v-model="data.serviceReceipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="書籍收據">
            <el-input v-model="data.bookReceipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="付款方式">
            <el-select v-model="data.paymentMethod">
              <el-option v-for="tone in data.paymentMethods" :key="tone.id" :label="tone.name" :value="tone.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="描述">
            <el-input v-model="data.description" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="total-container">
      <span class="total-label">服務總額</span>
      <span class="total-amount">{{ settlement.service }}</span>
      <span class="total-label">書籍總額</span>
      <span class="total-amount">{{ settlement.book }}</span>
      <span class="total-label">總額</span>
      <span class="total-amount">{{ settlement.total }}</span>
    </div>

    <!-- 第二區塊 -->
    <el-form label-position="top">
      <el-table :data="serviceData" style="width: 100%">
        <el-table-column label="註冊">
          <template slot-scope="scope">
            <el-autocomplete v-model="serviceData[scope.$index].registration" :fetch-suggestions="fetchSuggestions" placeholder="請輸入內容" @select="handleServiceSelect" />
          </template>
        </el-table-column>

        <el-table-column label="價格">
          <template slot-scope="scope">
            <el-input-number v-model="serviceData[scope.$index].price" :min="0" />
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="預計開始日期">
          <template slot-scope="scope">
            <el-date-picker v-model="serviceData[scope.$index].startDate" type="date" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="備註">
          <template slot-scope="scope">
            <el-input v-model="serviceData[scope.$index].remark" />
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="注意事項" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteServiceRow(scope.$index)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item>
        <el-button type="primary" @click="addServiceRow">新增行數</el-button>
      </el-form-item>
    </el-form>

    <!-- 第三區塊 -->
    <el-form label-position="top">
      <el-table :data="bookData" style="width: 100%">
        <el-table-column label="註冊">
          <template slot-scope="scope">
            <el-autocomplete v-model="bookData[scope.$index].registration" :fetch-suggestions="fetchSuggestions" placeholder="請輸入內容" @select="handleServiceSelect" />
          </template>
        </el-table-column>

        <el-table-column label="價格">
          <template slot-scope="scope">
            <el-input-number v-model="bookData[scope.$index].price" :min="0" />
          </template>
        </el-table-column>
        <el-table-column label="行動">
          <template slot-scope="scope">
            <el-select v-model="bookData[scope.$index].action">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="備註">
          <template slot-scope="scope">
            <el-input v-model="bookData[scope.$index].remark" />
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="注意事項" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteBookRow(scope.$index)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item>
        <el-button type="primary" @click="addBookRow">新增行數</el-button>
      </el-form-item>
    </el-form>

    <div class="container">
      <el-button type="primary" @click="registerSubmit">提交</el-button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        contacts: [
          { id: 1, name: '接觸職員1' },
          { id: 2, name: '接觸職員2' },
          { id: 3, name: '接觸職員3' }
        ],
        contact1: '',
        contact2: '',
        contact3: '',
        isIASMember: 'yes',
        date: new Date().toISOString(),
        description: '',
        tone: '',
        tones: [
          { id: 1, name: '4.0 熱忱' },
          { id: 2, name: '3.5 愉悅' },
          { id: 3, name: '3.0 保守' },
          { id: 4, name: '2.5 無聊' },
          { id: 5, name: '2.0 敵對' },
          { id: 6, name: '1.5 憤怒' },
          { id: 7, name: '1.1 隱藏的敵意' },
          { id: 8, name: '1.0 害怕' },
          { id: 9, name: '0.5 悲傷' },
          { id: 10, name: '沒注意' }
        ],
        serviceReceipt: 'FX',
        bookReceipt: 'FY',
        paymentMethod: '',
        paymentMethods: [
          { value: 'creditCard', name: '信用卡' },
          { value: 'cash', name: '現金' },
          { value: 'remittance', name: '匯款' },
          { value: 'cheque', name: '支票' },
          { value: 'remittance (Blue New)', name: '匯款(藍新)' },
          { value: 'creditCard (blue new)', name: '信用卡(藍新)' },
          { value: 'creditCard (Red Sun)', name: '信用卡(紅陽)' },
          { value: 'linePay', name: 'LINE Pay' },
          { value: 'other', name: '其他' }
        ]
      },
      serviceData: [
        {
          registration: '研習班 (HDS)',
          price: 3410,
          startDate: '',
          remark: '',
          notes: ''
        },
        {
          registration: 'PTS/SP課程',
          price: 3433,
          startDate: '',
          remark: '',
          notes: '必備條件：完成S.H'
        }
      ],
      bookData: [
        {
          registration: 'PTS/SP課程夾',
          price: 2222,
          action: '註冊',
          remark: '',
          notes: ''
        }
      ],
      settlement: {
        service: 100,
        book: 100,
        total: 100,
      }
    }
  },
  methods: {
    fetchSuggestions(queryString, cb) {
      const mockResults = [
        'Apple',
        'Apple is good',
        'Banana',
        'Cherry',
        'Durian',
        'Elderberry',
        '葉怡秀 Shiu, Ye',
        '葉麗英 Li-Ying, Ye',
        '葉曉曈 Elaine, Yei',
        '葉大裕 David Yei'
      ]
      const results = mockResults
        .filter(item => item.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        .map(item => ({ value: item }))
      cb(results)
    },
    handleServiceSelect(item) {
      this.data.public = item.value
    },
    addServiceRow() {
      this.serviceData.push({
        registration: '',
        price: '',
        startDate: '',
        remark: '',
        notes: ''
      })
    },
    deleteServiceRow(index) {
      this.serviceData.splice(index, 1)
    },
    addBookRow() {
      this.bookData.push({
        registration: '',
        price: '',
        action: '註冊',
        remark: '',
        notes: ''
      })
    },
    deleteBookRow(index) {
      this.bookData.splice(index, 1)
    },
    registerSubmit() {

    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  place-items: center;
}
.total-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  background-color: #f2f2f2;
  padding: 10px;
}

.total-label {
  margin-right: 10px;
}

.total-amount {
  margin-right: 20px;
}

</style>
