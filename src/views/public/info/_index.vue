<template>
  <div>
    <!-- 顶部标题栏 -->
    <el-row type="flex" class="title-row">
      <el-col :span="24">
        <h2 class="title">大眾資料</h2>
      </el-col>
    </el-row>

    <!-- <el-date-picker
      v-model="selectedDate"
      type="date"
      placeholder="選擇日期"
      style="width: 100%"
    ></el-date-picker>

    <el-time-picker
      v-model="selectedTime"
      type="fixed-time"
      placeholder="選擇時間"
      style="width: 100%"
    ></el-time-picker> -->

    <!-- 切换样式的按钮 -->
    <el-row type="flex" class="button-row">
      <el-col :span="12">
        <el-button @click="changeStyle(1)">資訊</el-button>
      </el-col>
      <el-col :span="12">
        <el-button @click="changeStyle(2)">註冊</el-button>
      </el-col>
    </el-row>

    <!-- 根据按钮切换的内容区域 -->
    <el-row type="flex" class="content-row">
      <el-col :span="24">
        <!-- 这里根据样式的不同加载不同的 Vue 组件 -->
        <component :is="currentStyleComponent"></component>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Style1 from '../add/index.vue';
import Style2 from '../../cashier-system/index.vue';

export default {
  name: 'CustomerData',
  components: {
    Style1,
    Style2,
  },
  data() {
    return {
      currentStyleComponent: 'Style1', // 默认显示样式1
    };
  },
  created() {
    console.log(this.$route.params.data)
  },
  methods: {
    changeStyle(styleNumber) {
      this.currentStyleComponent = `Style${styleNumber}`;
    },
  },
};
</script>
