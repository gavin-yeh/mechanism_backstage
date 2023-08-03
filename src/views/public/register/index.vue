<template>
  <div>
    <!-- 第一區塊 -->
    <el-form label-position="top">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="接觸職員">
            <el-select v-model="contact1">
              <el-option v-for="contact in data.staffs" :key="contact.id" :label="contact.name" :value="contact.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="接觸職員">
            <el-select v-model="contact2">
              <el-option v-for="contact in data.staffs" :key="contact.id" :label="contact.name" :value="contact.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="接觸職員">
            <el-select v-model="contact3">
              <el-option v-for="contact in data.staffs" :key="contact.id" :label="contact.name" :value="contact.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="IAS會員">
            <el-select v-model="iasMember" @change="onIASMemberChange(iasMember)">
              <el-option v-for="tone in data.iasMembers" :key="tone.key" :label="tone.name" :value="tone.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="日期">
            <el-date-picker v-model="date" type="datetime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="情緒度">
            <el-select v-model="tone">
              <el-option v-for="tone in data.tones" :key="tone.id" :label="tone.name" :value="tone.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="服務收據">
            <el-input v-model="serviceReceipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="書籍收據">
            <el-input v-model="bookReceipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="付款方式">
            <el-select v-model="paymentMethod">
              <el-option v-for="tone in data.paymentMethods" :key="tone.id" :label="tone.name" :value="tone.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="描述">
            <el-input v-model="description" />
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
        <el-table-column label="註冊" width="350">
          <template slot-scope="scope">
            <el-autocomplete v-model="serviceData[scope.$index].product_name" :fetch-suggestions="fetchServiceSuggestions" placeholder="請輸入內容" @select="handleServiceSelect($event, serviceData[scope.$index])" style="width: 100%" />
          </template>
        </el-table-column>

        <el-table-column label="價格" width="180">
          <template slot-scope="scope">
            <el-input-number v-model="serviceData[scope.$index].price" :min="0" @change="handlePriceChange()" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="預計開始日期" width="170" >
          <template slot-scope="scope">
            <el-date-picker v-model="serviceData[scope.$index].start_date" type="date" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="備註">
          <template slot-scope="scope">
            <el-input v-model="serviceData[scope.$index].remark" />
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="注意事項"/>
        <el-table-column label="操作" width="90" >
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteServiceRow(scope.$index)" style="width: 100%">刪除</el-button>
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
        <el-table-column label="註冊" width="350">
          <template slot-scope="scope">
            <el-autocomplete v-model="bookData[scope.$index].product_name" :fetch-suggestions="fetchBookSuggestions" placeholder="請輸入內容" @select="handleBookSelect($event, bookData[scope.$index])" style="width: 100%" />
          </template>
        </el-table-column>

        <el-table-column label="價格" width="180">
          <template slot-scope="scope">
            <el-input-number v-model="bookData[scope.$index].price" :min="0" @change="handlePriceChange()" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="行動" width="170">
          <template slot-scope="scope">
            <el-select v-model="bookData[scope.$index].action">
              <el-option label="提書" value="take" />
              <el-option label="註冊" value="register" />
              <el-option label="註冊且提書" value="all" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="備註">
          <template slot-scope="scope">
            <el-input v-model="bookData[scope.$index].remark" />
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="注意事項" />
        <el-table-column label="操作" width="90" >
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteBookRow(scope.$index)" style="width: 100%">刪除</el-button>
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

<script src="./init.js"></script>
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
