import Curve from '../curve/curve.vue'
import { setDateSelect, updateSum, createAndCheckData } from '../template.js'
import { showModal } from './details.js'
import { transformRows, calculateTotalPoints, employmentPoints } from './points.js'
import { weeklyProductReportGet, weeklyProductReportSubmit } from '@/api/weeklyProductReport'
import { weeklyProductListGet, weeklyProductListSubmit } from '@/api/weeklyProductList'
import { pointsConditionSettingMap, employmentSettingMap } from '../define.js'

export default {
  components: {
    Curve
  },
  data() {
    return {
      rows: [],
      thursday: '',
      thursdayList: [],
      staffName: '',
      dialogVisible: false,
      popupData: {}
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
    openDialog(item) {
      this.popupData = { staffId: item.staffId, date: item.date, staffName: item.name, position: item.position }
      this.dialogVisible = true
    },
    getDialogTitle() {
      return `曲線趨勢-${this.popupData.staffName}-${this.popupData.position}`
    },
    onChangeIndividualStatus(item) {
      item.totalPoints = calculateTotalPoints(item.pointDataList, item.individualStatus)
    },
    onChangeTotalStatus(item) {
      var pointData = item.pointDataList.find(p => p.points_type === 'job_status')
      const point = pointsConditionSettingMap.get(item.totalStatus)
      if (point) {
        pointData.points = point
      } else {
        pointData.points = 0
      }

      item.totalPoints = calculateTotalPoints(item.pointDataList)
    },
    onChangeFormulaStatus(item) {
      var pointData = item.pointDataList.find(p => p.points_type === 'non_submission')
      if (item.formulaStatus === 'no') {
        pointData.points = employmentPoints(item, -1)
      } else {
        pointData.points = 0
      }

      item.totalPoints = calculateTotalPoints(item.pointDataList)
    },
    onChangeStaffMeeting(item) {
      var pointData = item.pointDataList.find(p => p.points_type === 'attending_staff')
      if (item.staffMeeting === 'no') {
        pointData.points = employmentPoints(item, -1)
      } else {
        pointData.points = 0
      }

      item.totalPoints = calculateTotalPoints(item.pointDataList)
    },
    onChangePoints(item) {
      item.totalPoints = calculateTotalPoints(item.pointDataList)
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
          const outflows = response.data.outflows
          const workings = response.data.workings
          showModal(staff, profile, items, studies, outflows, workings)

          resolve()
        }).catch((err) => {
          alert(err)
          reject(err)
        })
      })
    },
    closeDetails() {
      const modal = document.getElementById('modal-check-profile')
      modal.style.display = 'none'
    },
    getPointDataList(pointDataList) {
      return pointDataList
    },
    submitUpdate() {
      const thursday = this.thursday
      const staffId = this.staffId
      const submitData = createAndCheckData()
      submitData.date = thursday

      return new Promise((resolve, reject) => {
        weeklyProductReportSubmit({ staffId, submitData }).then(response => {
          alert('已更新，此職員點數已重置，請重新檢視此職員點數')

          this.onChange(thursday)

          resolve()
        }).catch((err) => {
          alert(err)
          reject(err)
        })
      })
    },
    fetchData(date) {
      return new Promise((resolve, reject) => {
        weeklyProductListGet(date).then(response => {
          this.thursday = response.data.thursdayInfo.thursday
          this.thursdayList = response.data.thursdayInfo.thursdayList

          const staffList = response.data.staffList
          const profiles = response.data.profiles
          const points = response.data.points
          const outflows = response.data.outflows
          const studies = response.data.studies
          const workings = response.data.workings
          const { rows } = transformRows(this.thursday, staffList, profiles, points, outflows, studies, workings)

          this.rows = rows
          resolve()
        }).catch((err) => {
          alert(err)
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
          alert(err)
          reject(err)
        })
      })
    }
  }
}
