import { updateSum, setDateSelect, createAndCheckData } from '../template.js'
import { setCurveStyle, setConditionStyle, showCheckMessage } from '../rendering.js'
import { userWeeklyProductReportGet, userWeeklyProductReportSubmit } from '@/api/weeklyProductReport'

export default {
  methods: {
    data() {
      return {
        thursday: null,
        thursdayList: null,
        staffName: '',
        position: '',
        staffSituationCurves: {},
        situations: []
      }
    },
    fetchData(date) {
      return new Promise((resolve, reject) => {
        userWeeklyProductReportGet(date).then(response => {
          this.respData = response.data
          resolve()

          if (this.respData.alreadyWrote) {
            alert('你的檔案本週資料庫已有數據，如要修改，請通知泯諭。')
            history.back()
            return
          }
        }).catch((err) => {
          alert('資料庫發生錯誤：' + err)
          reject(err)
        })
      })
    },
    submitForm() {
      document.getElementById('loading-overlay').style.display = 'block'

      return new Promise((resolve, reject) => {
        const submitData = createAndCheckData()

        userWeeklyProductReportSubmit(submitData).then(response => {
          document.getElementById('loading-overlay').style.display = 'none'
          alert('已完成，列印請使用黃色紙張')
          window.location.href = response.data.url

          resolve()
        }).catch((err) => {
          alert('資料庫發生錯誤：' + err)
          reject(err)
        })
      })
    },
    openModal() {
      const input = createAndCheckData()
      if (input == null) {
        return
      }

      showCheckMessage('曲線報告確認', input)
      document.getElementById('confirm-modal').style.display = 'block'
    },
    closeModal() {
      document.getElementById('confirm-modal').style.display = 'none'
    },
    cancel() {
      this.closeModal()
    },
    confirm() {
      var checkbox = document.getElementById('auth-check')
      if (!checkbox.checked) {
        alert('未勾選確認')
        return
      }

      this.closeModal()
      this.submitForm()
    },
    async onChange(date) {
      await this.fetchData(date)
    }
  },
  async mounted() {
    const date = new Date()
    await this.fetchData(date.toISOString().split('T')[0])

    // 初始化頁面
    document.getElementById('auth-check').checked = false // 取消勾選
    document.getElementById('loading-overlay').style.display = 'none' // 隐藏遮罩层
    document.getElementById('position').innerHTML = this.respData.position
    document.getElementById('staff_name').textContent = this.respData.staffName

    setDateSelect(this.respData.thursday, this.respData.thursdayList, this.onChange)

    let mainCurveIndex = 1
    let subCurveIndex = 1
    for (let i = 0; i < this.respData.curves.length; i++) {
      var curve = this.respData.curves[i]
      if (curve.type === 'main_curve') {
        const nameElement = document.getElementById('confirm-main-curve-name-' + mainCurveIndex)
        nameElement.innerHTML = curve.curve_name
        setCurveStyle(curve.statistics_style, 'confirm-main-curve-statistics-' + mainCurveIndex)
        setConditionStyle(curve.condition_style, 'confirm-main-curve-condition-' + mainCurveIndex)
        mainCurveIndex++
      } else {
        const nameElement = document.getElementById('confirm-sub-curve-name-' + subCurveIndex)
        nameElement.innerHTML = curve.curve_name
        setCurveStyle(curve.statistics_style, 'confirm-sub-curve-statistics-' + subCurveIndex)
        setConditionStyle(curve.condition_style, 'confirm-sub-curve-condition-' + subCurveIndex)
        subCurveIndex++
      }
    }

    const form = document.getElementById('mainForm')
    form.addEventListener('submit', function(event) {
      event.preventDefault() // 阻止默认的表单提交行为
    })

    document.addEventListener('input', updateSum)
  }
}
