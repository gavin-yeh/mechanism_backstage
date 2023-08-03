import { staffAll } from '@/api/staff'
import { publicRegister } from '@/api/public'
import { productServiceSearch } from '@/api/product_service'
import { productBookSearch, productBookList } from '@/api/product_book'


export default {
  data() {
    return {
      data: {
        iasMembers: [
          { key: 'lifelong', name: '終身會員' },
          { key: 'year', name: '年度會員' },
          { key: 'free', name: '免費會員' },
          { key: 'no', name: '否' },
        ],
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
        paymentMethods: [
          { id: 1, value: 'creditCard', name: '信用卡' },
          { id: 2, value: 'cash', name: '現金' },
          { id: 3, value: 'remittance', name: '匯款' },
          { id: 4, value: 'cheque', name: '支票' },
          { id: 5, value: 'remittance (Blue New)', name: '匯款(藍新)' },
          { id: 6, value: 'creditCard (blue new)', name: '信用卡(藍新)' },
          { id: 7, value: 'creditCard (Red Sun)', name: '信用卡(紅陽)' },
          { id: 8, value: 'linePay', name: 'LINE Pay' },
          { id: 9, value: 'other', name: '其他' }
        ],
        staffs: [],
      },
      contact1: '',
      contact2: '',
      contact3: '',
      iasMember: '',
      date: new Date().toISOString(),
      tone: '',
      serviceReceipt: 'FX',
      bookReceipt: 'FY',
      paymentMethod: '',
      description: '',
      serviceData: [],
      bookData: [],
      settlement: {
        service: 100,
        book: 100,
        total: 100,
      }
    }
  },
  async created() {
    this.addServiceRow()
    this.staffAll()

    this.handlePriceChange()
  },
  methods: {
    async staffAll() {
      const query = staffAll()
      const [response] = await Promise.all([query])

      var staffs = []
      for (const s of response.data.staffs) {
        const staff = {
          id: s.id,
          name: s.name,
        }
        staffs.push(staff)
      }
      
      this.data.staffs = staffs
    },
    handlePriceChange() {
      const servicePrice = this.serviceData.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price
      }, 0)
      const bookPrice = this.bookData.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price
      }, 0)

      this.settlement = {
        service: servicePrice,
        book: bookPrice,
        total: Number(servicePrice) + Number(bookPrice),
      }
    },
    onIASMemberChange(iasMember) {
      for (const data of this.bookData) {
        data.price = iasMember === 'no' ? data.profile.price : data.profile.ias_price
      }

      this.handlePriceChange()
    },
    // 服務事件
    async fetchServiceSuggestions(queryString, cb) {
      const query = productServiceSearch(queryString)
      const [response] = await Promise.all([query])

      const productServiceDatas = response.data.productServiceDatas.map(row => {
        return {
          ...row,
          value: row.product_name,
        }
      })

      cb(productServiceDatas)
    },
    async handleServiceSelect(productServiceData, scope) {
      // 設定金額等後續資料
      scope.id = productServiceData.service_id
      scope.price = productServiceData.price
      scope.notes = productServiceData.remark

      // 找出相關的書籍
      const bookIds = productServiceData.books.map(obj => obj.book_id)
      const query = productBookList(bookIds)
      const [response] = await Promise.all([query])

      // 寫入相關書籍
      for (const book of response.data.productBooks) {
        this.bookData.push({
          id: book.book_id,
          product_name: book.product_name,
          price: this.iasMember === 'no' ? book.price : book.ias_price,
          action: '註冊且提書',
          remark: '',
          notes: book.remark,
          profile: book,
        })
      }
      this.handlePriceChange()
    },
    addServiceRow() {
      this.serviceData.push({
        product_name: '',
        price: '',
        start_date: '',
        remark: '',
        notes: ''
      })
      this.handlePriceChange()
    },
    deleteServiceRow(index) {
      this.serviceData.splice(index, 1)
      this.handlePriceChange()
    },
    // 書籍事件
    async fetchBookSuggestions(queryString, cb) {
      const query = productBookSearch(queryString)
      const [response] = await Promise.all([query])

      const productBooks = response.data.productBooks.map(row => {
        return {
          ...row,
          value: row.product_name,
        }
      })

      cb(productBooks)
    },
    handleBookSelect(data, scope) {
      // 設定金額等後續資料
      scope.id = data.service_id
      scope.price = this.iasMember === 'no' ? data.price : data.ias_price
      scope.notes = data.remark
    },
    addBookRow() {
      this.bookData.push({
        product_name: '',
        price: '',
        action: '',
        remark: '',
        notes: ''
      })
      this.handlePriceChange()
    },
    deleteBookRow(index) {
      this.bookData.splice(index, 1)
      this.handlePriceChange()
    },
    // 提交註冊資料
    registerSubmit() {
      if (!this.contact1 && !this.contact2 && !this.contact3) {
        alert('接觸職員未填寫')
        return
      }

      if (!this.iasMember) {
        alert('IAS會員未填寫')
        return
      }

      if (!this.tone) {
        alert('情緒度未填寫')
        return
      }

      if (this.serviceData.length !== 0 && this.serviceReceipt.length <= 2) {
        alert('服務收據號碼格式錯誤或未填寫')
        return
      }

      if (this.bookData.length !== 0 && this.bookReceipt.length <= 2) {
        alert('書籍收據號碼格式錯誤或未填寫')
        return
      }

      if (!this.paymentMethod) {
        alert('付款方式未填寫')
        return
      }

      console.log(this.contact1)
      console.log(this.contact2)
      console.log(this.contact3)
      console.log(this.iasMember)
      console.log(this.date)
      console.log(this.tone)
      console.log(this.serviceReceipt)
      console.log(this.bookReceipt)
      console.log(this.paymentMethod)
      console.log(this.description)
      console.log(this.serviceData)
      console.log(this.bookData)
      console.log(this.settlement)

      const submitData = {
        contact1: contact1,
        contact2: contact2,
        contact3: contact3,
        ias_member: iasMember,
        date: date,
        tone: tone,
        service_receipt: serviceReceipt,
        book_receipt: bookReceipt,
        payment_method: paymentMethod,
        description: description,
        service_data: serviceData,
        book_data: bookData,
      }

      publicRegister(submitData)
    }
  }
}