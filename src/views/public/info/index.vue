<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="註冊" name="publicAdd">
                <PublicRegister />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { publicGet } from '@/api/public'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import PublicRegister from '../register/index.vue'


// import Account from './components/Account'

export default {
  name: 'Profile',
  // components: { UserCard, Activity, Timeline, Account },
  components: { UserCard, Timeline, PublicRegister },
  data() {
    return {
      user: {
        name: '',
        phone_number: '',
        status: '',
        remark: '',
        avatar: '',
      },
      activeTab: 'timeline'
    }
  },
  computed: {
  },
  async created() {
    const data = this.$route.params.data
    this.fetchPublicInfo(data.public_id)
  },
  mounted() {
  },
  methods: {
    async fetchPublicInfo(publicId) {
      const query = publicGet(publicId)
      const [response] = await Promise.all([query])

      const publicInfo = response.data.public

      var base_info = ``
      base_info += `開始服務日期：${new Date(publicInfo.started_date).toISOString().split('T')[0]}\n`
      if (!publicInfo.is_refund) {
        base_info += publicInfo.is_contact ? `可聯繫\n` : '不可聯繫\n'
        base_info += publicInfo.is_publicity ? `可宣傳\n` : `不可宣傳\n`
      } else {
        base_info += publicInfo.is_refund ? '退費\n' : ''
      }

      const addressType = [
        { type: 'home', value: '家用' },
        { type: 'company', value: '公司' },
      ]
      
      var main_address = ``
      var spare_address = ``
      if (publicInfo.main_address_type) {
        const addressMainTypeName = addressType.find(obj => obj.type == publicInfo.main_address_type).value
        main_address = `主地址：[${addressMainTypeName}]${publicInfo.main_address_county}${publicInfo.main_address_district}${publicInfo.main_address}`
      }
      if (publicInfo.spare_address_type) {
        const addressSpareTypeName = addressType.find(obj => obj.type == publicInfo.spare_address_type).value
        spare_address = `副地址：[${addressSpareTypeName}]${publicInfo.spare_address_county}${publicInfo.spare_address_district}${publicInfo.spare_address}`
      }


      var contact_info = ``
      contact_info += `手機：${publicInfo.phone_number}\n`
      contact_info += `電話：${publicInfo.telephone_number}\n`
      contact_info += `E-mail：${publicInfo.email}\n`
      contact_info += main_address
      contact_info += spare_address

      var fsm = ``
      fsm += `FSM：${publicInfo.fsm_user_id}\n`
      fsm += `關係：${publicInfo.fsm_relation}\n`


      this.user = {
        name: `${publicInfo.name}(${publicInfo.nickname}) / ${publicInfo.english_name}`,
        role: publicInfo.file_code,
        base_info: base_info,
        profile: `性別：${publicInfo.gender}\n婚姻：${publicInfo.marital_status}`,
        contact_info: contact_info,
        fsm: fsm,
        remark: publicInfo.remark,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      }
    }
  }
}
</script>
