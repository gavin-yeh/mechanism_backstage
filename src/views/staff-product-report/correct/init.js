import { setDateSelect, updateSum, createAndCheckData } from '../template.js'
import { showModal } from './details.js'
import { calculateTotalPoints, employmentPoints } from './modal.js'
import { weeklyProductReportGet, weeklyProductReportSubmit } from '@/api/weeklyProductReport'
import { weeklyProductListGet, weeklyProductListSubmit } from '@/api/weeklyProductList'
import { pointsConditionSettingMap, employmentSettingMap } from '../define.js'

export default {
  data() {
    return {
      rows: [],
      thursday: '',
      thursdayList: []
    }
  },
  async created() {
    const date = new Date()
    await this.fetchData(date.toISOString().split('T')[0])

    setDateSelect(this.thursday, this.thursdayList, this.onChange)
  },
  async mounted() {
    document.getElementById('loading-overlay').style.display = 'none'

    document.addEventListener('input', updateSum)
  },
  methods: {
    onChangeIndividualStatus(item) {
      if (item.individualStatus === 'on holiday' || item.individualStatus === 'ethics') {
        item.totalPoints = 0
      } else {
        calculateTotalPoints(item)
      }
    },
    onChangeTotalStatus(item) {
      const point = pointsConditionSettingMap.get(item.totalStatus)
      if (point) {
        item.positionStatus = point
      } else {
        item.positionStatus = 0
      }
      calculateTotalPoints(item)
    },
    onChangeFormulaStatus(item) {
      if (item.formulaStatus === 'no') {
        item.unsubmittedStatus = employmentPoints(item, -1)
      } else {
        item.unsubmittedStatus = 0
      }
      calculateTotalPoints(item)
    },
    onChangeStaffMeeting(item) {
      if (item.staffMeeting === 'no') {
        item.attendStaffMeeting = employmentPoints(item, -1)
      } else {
        item.attendStaffMeeting = 0
      }
      calculateTotalPoints(item)
    },
    onChangePoints(item) {
      calculateTotalPoints(item)
    },
    async onChange(date) {
      this.rows = []
      await this.fetchData(date)
    },
    isButtonDisabled(item) {
      if (!item.isButtonDisabled) {
        item.buttonText = '尚未填寫'
      } else {
        item.buttonText = '開啟詳情'
      }
      return !item.isButtonDisabled
    },
    getStaffTypeValue(staffType) {
      return employmentSettingMap.get(staffType).name
    },
    showDetails(item) {
      this.staffId = item.staffId // 儲存正要改的 staffId

      return new Promise((resolve, reject) => {
        weeklyProductReportGet(item.staffId, item.date).then(response => {
          var modal = document.getElementById('modal-check-profile')
          modal.style.display = 'block'

          const staff = response.data.staff
          const profile = response.data.profile
          const items = response.data.items
          const studies = response.data.studies
          showModal(staff, profile, items, studies)

          resolve()
        }).catch((err) => {
          alert('資料庫發生錯誤：' + err)
          reject(err)
        })
      })
    },
    closeDetails() {
      const modal = document.getElementById('modal-check-profile')
      modal.style.display = 'none'
    },
    submitUpdate() {
      const thursday = this.thursday
      const staffId = this.staffId
      const submitData = createAndCheckData()
      submitData.date = thursday

      return new Promise((resolve, reject) => {
        weeklyProductReportSubmit({ staffId, submitData }).then(response => {
          alert('已更新')

          this.onChange(thursday)

          resolve()
        }).catch((err) => {
          alert('資料庫發生錯誤：' + err)
          reject(err)
        })
      })
    },
    fetchData(date) {
      return new Promise((resolve, reject) => {
        weeklyProductListGet(date).then(response => {
          this.thursday = response.data.thursday
          this.thursdayList = response.data.thursdayList
          this.rows = response.data.rows
          resolve()
        }).catch((err) => {
          alert('資料庫發生錯誤：' + err)
          reject(err)
        })
      })
    },
    submitPoints() {
      this.submitForm('no')
    },
    submitPointsAndOutput() {
      this.submitForm('sheet')
    },
    submitForm(outputType) {
      const rows = this.rows
      const thursday = this.thursday

      document.getElementById('loading-overlay').style.display = 'block'

      return new Promise((resolve, reject) => {
        weeklyProductListSubmit({ thursday, outputType, rows }).then(response => {
          alert('已更新')
          document.getElementById('loading-overlay').style.display = 'none'
          if (outputType !== 'no') {
            window.location.href = response.data.url
          }

          resolve()
        }).catch((err) => {
          alert('資料庫發生錯誤：' + err)
          reject(err)
        })
      })
    }
  }
}
