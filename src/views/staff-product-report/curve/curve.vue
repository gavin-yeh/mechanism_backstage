<template>
  <div class="dashboard-editor-container">

    <el-container>
      <el-aside width="350px">
        <el-menu>
          <el-menu-item
            v-for="(button, index) in buttons"
            :key="index"
          >
            <el-button :style="{ width: '310px' }" @click="buttonClick(index)">
              {{ button }}
            </el-button>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart :chart-data="lineChartData" />
        </el-row>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import LineChart from '@/components/Dashboard/LineChart'
import { staffCurveItem } from '@/api/staff_cruve'

export default {
  components: {
    LineChart
  },
  props: {
    popupData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      lineChartData: {
        xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        lines: [
          {
            name: 'Visitis',
            data: [100, 120, 161, 134, 105, 160, 165]
          },
          {
            name: '',
            data: []
          }
        ]
      },
      buttons: ['按鈕1', '按鈕2', '按鈕3', '按鈕4', '按鈕5', '按鈕6']
    }
  },
  mounted() {
    this.$watch('popupData', this.handlePopupDataChange)
    this.handlePopupDataChange()
  },
  methods: {
    buttonClick(index) {
      const row = this.rows[index]

      const thursdayList = row.curve_datas.map(obj => obj.thursday)
      const statisticsList = [
        row.curve_datas.map(obj => obj.statistics1),
        row.curve_datas.map(obj => obj.statistics2),
        row.curve_datas.map(obj => obj.statistics3)
      ]

      const tags = JSON.parse(row.tags)
      var showNames = JSON.parse(row.show_names)

      const tag = tags.find((obj) => obj === 'format-time')
      if (showNames.length === 0) {
        showNames.push(row.curve_name)
      }
      if (tag) {
        for (var i = 0; i < statisticsList[0].length; i++) {
          const hours = statisticsList[0][i]
          const minutes = statisticsList[1][i]

          statisticsList[0][i] = hours * 60 + minutes
          statisticsList[1][i] = 0
        }
        showNames = [row.curve_name + '(分鐘)']
      }

      var chartDatas = []
      showNames.forEach((showName, i) => {
        const chartData = {
          name: showName,
          data: statisticsList[i]
        }
        chartDatas.push(chartData)
      })

      this.lineChartData.xAxis = thursdayList
      this.lineChartData.lines = chartDatas
    },
    async handlePopupDataChange() {
      const query = staffCurveItem(this.popupData.staffId, this.popupData.date)
      const [response] = await Promise.all([query])

      this.rows = response.data.rows

      const curveNameList = this.rows.map(obj => obj.curve_name)
      this.buttons = curveNameList

      this.buttonClick(0)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
