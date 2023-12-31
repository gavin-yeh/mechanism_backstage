<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    createLine1(line) {
      return {
        name: line.name,
        smooth: true,
        type: 'line',
        itemStyle: {
          normal: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          }
        },
        data: line.data,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      }
    },
    createLine2(line) {
      return {
        name: line.name,
        smooth: true,
        type: 'line',
        itemStyle: {
          normal: {
            color: '#3888fa',
            lineStyle: {
              color: '#3888fa',
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            }
          }
        },
        data: line.data,
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    },
    createLine3(line) {
      return {
        name: line.name,
        smooth: true,
        type: 'line',
        itemStyle: {
          normal: {
            color: '#FF00FF',
            lineStyle: {
              color: '#FF00FF',
              width: 2
            },
            areaStyle: {
              color: '#ACD6FF'
            }
          }
        },
        data: line.data,
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    },
    setOptions({ xAxis, lines } = {}) {
      this.chart.clear()
      const names = lines.map(obj => obj.name)

      const createFunctions = [
        this.createLine1,
        this.createLine2,
        this.createLine3
      ]
      var series = []
      for (var i = 0; i < 3; i++) {
        const line = lines[i]
        if (!line) {
          continue
        }
        const hdr = createFunctions[i]
        const lineOpt = hdr(line)
        series.push(lineOpt)
      }

      this.chart.setOption({
        xAxis: {
          data: xAxis,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: names
        },
        series: series
      })
    }
  }
}
</script>
