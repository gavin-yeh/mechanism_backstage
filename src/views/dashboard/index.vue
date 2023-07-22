<template>
  <div class="dashboard-container">
    <div class="dashboard-text">職員姓名：{{ name }}</div>

    <Curve :popup-data="curveData" />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Curve from '../staff-product-report/curve/curve.vue'

export default {
  name: 'Dashboard',
  components: {
    Curve
  },
  data() {
    return {
      curveData: { staffId: 0 }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'staffId'
    ])
  },
  async created() {
    this.curveData = { staffId: this.staffId }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.curve-container {
  width: 1200px;            // 設定框框的寬度
  height: 150px;            // 設定框框的高度
  border: 1px solid #ccc; // 設定框框的邊框樣式
}

</style>
