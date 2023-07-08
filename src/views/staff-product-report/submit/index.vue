<template>
  <div class="report-page">
    <div id="confirm-modal" class="modal">
      <div class="modal-content">
        <table>
          <tr>
            <td colspan="2">
              <p id="confirm-message-header" />
            </td>
          </tr>
          <tr>
            <td>
              <p id="confirm-message-main-curve" />
            </td>
            <td>
              <p id="confirm-message-sub-curve" />
            </td>
          </tr>
          <tr>
            <td>
              <p id="confirm-message-work" />
            </td>
            <td>
              <p id="confirm-message-study" />
            </td>
          </tr>
        </table>
        <p>確認資料正確，且為本人填寫：<input id="auth-check" type="checkbox"></p>
        <div class="btn-container">
          <el-button @click="cancel">取消返回</el-button>
          <el-button @click="confirm">確定送出</el-button>
        </div>
      </div>
    </div>
    <div id="loading-overlay">
      <div id="loading-spinner" />
      <div id="loading-message">正在加载，请稍候...</div>
    </div>
    <div class="form-container">
      <form id="mainForm">
        <p style="display: flex; justify-content: space-between; align-items: center;">
          To:檢視與報告課
          <span>
            日期: <span id="dateSelect" />
          </span>
        </p>
        <p>From:____<span id="position" />____(職位名稱)</p>

        <h2 class="center">每週產品報告單</h2>
        <h3>主曲線:</h3>
        <table>
          <tr>
            <td>曲線名稱: <span id="confirm-main-curve-name-1" /></td>
            <td>曲線名稱: <span id="confirm-main-curve-name-2" /></td>
          </tr>
          <tr>
            <td id="confirm-main-curve-statistics-1">曲線值: </td>
            <td id="confirm-main-curve-statistics-2">曲線值: </td>
          </tr>
          <tr>
            <td>狀況: <span id="confirm-main-curve-condition-1" /></td>
            <td>狀況: <span id="confirm-main-curve-condition-2" /></td>
          </tr>
        </table>
        <table>
          <tr>
            <td>曲線名稱: <span id="confirm-main-curve-name-3" /></td>
            <td>曲線名稱: <span id="confirm-main-curve-name-4" /></td>
          </tr>
          <tr>
            <td id="confirm-main-curve-statistics-3">曲線值: </td>
            <td id="confirm-main-curve-statistics-4">曲線值: </td>
          </tr>
          <tr>
            <td>狀況: <span id="confirm-main-curve-condition-3" /></td>
            <td>狀況: <span id="confirm-main-curve-condition-4" /></td>
          </tr>
        </table>
        <table>
          <tr>
            <td>曲線名稱: <span id="confirm-main-curve-name-5" /></td>
            <td>曲線名稱: <span id="confirm-main-curve-name-6" /></td>
          </tr>
          <tr>
            <td id="confirm-main-curve-statistics-5">曲線值: </td>
            <td id="confirm-main-curve-statistics-6">曲線值: </td>
          </tr>
          <tr>
            <td>狀況: <span id="confirm-main-curve-condition-5" /></td>
            <td>狀況: <span id="confirm-main-curve-condition-6" /></td>
          </tr>
        </table>
        <table>
          <tr>
            <td>曲線名稱: <span id="confirm-main-curve-name-7" /></td>
            <td>曲線名稱: <span id="confirm-main-curve-name-8" /></td>
          </tr>
          <tr>
            <td id="confirm-main-curve-statistics-7">曲線值: </td>
            <td id="confirm-main-curve-statistics-8">曲線值: </td>
          </tr>
          <tr>
            <td>狀況: <span id="confirm-main-curve-condition-7" /></td>
            <td>狀況: <span id="confirm-main-curve-condition-8" /></td>
          </tr>
        </table>

        <h3>副曲線:</h3>
        <table>
          <tr>
            <td>曲線名稱: <span id="confirm-sub-curve-name-1" /></td>
            <td>曲線名稱: <span id="confirm-sub-curve-name-2" /></td>
          </tr>
          <tr>
            <td id="confirm-sub-curve-statistics-1">曲線值: </td>
            <td id="confirm-sub-curve-statistics-2">曲線值: </td>
          </tr>
          <tr>
            <td>狀況: <span id="confirm-sub-curve-condition-1" /></td>
            <td>狀況: <span id="confirm-sub-curve-condition-2" /></td>
          </tr>
        </table>
        <table>
          <tr>
            <td>曲線名稱: <span id="confirm-sub-curve-name-3" /></td>
            <td>曲線名稱: <span id="confirm-sub-curve-name-4" /></td>
          </tr>
          <tr>
            <td id="confirm-sub-curve-statistics-3">曲線值: </td>
            <td id="confirm-sub-curve-statistics-4">曲線值: </td>
          </tr>
          <tr>
            <td>狀況: <span id="confirm-sub-curve-condition-3" /></td>
            <td>狀況: <span id="confirm-sub-curve-condition-4" /></td>
          </tr>
        </table>

        <h3>工作時數:</h3>
        <table>
          <tr>
            <th>w4</th>
            <th>w5</th>
            <th>w6</th>
            <th>w日</th>
            <th>w1</th>
            <th>w2</th>
            <th>w3</th>
            <th>累計</th>
          </tr>
          <tr>
            <td><input id="w4" type="number" step="0.1"></td>
            <td><input id="w5" type="number" step="0.1"></td>
            <td><input id="w6" type="number" step="0.1"></td>
            <td><input id="w7" type="number" step="0.1"></td>
            <td><input id="w1" type="number" step="0.1"></td>
            <td><input id="w2" type="number" step="0.1"></td>
            <td><input id="w3" type="number" step="0.1"></td>
            <td><span id="sum_work_hours">0</span></td>
          </tr>
        </table>

        <h3>進修時數:</h3>
        <table>
          <tr>
            <th>項目</th>
            <th>進教室</th>
            <th>函授</th>
            <th>聽析</th>
            <th>品格計劃案</th>
            <th>累計</th>
          </tr>
          <tr>
            <td>時數</td>
            <td><input id="class_hours" type="number" step="0.1"></td>
            <td><input id="correspondence_hours" type="number" step="0.1"></td>
            <td><input id="analysis_hours" type="number" step="0.1"></td>
            <td><input id="character_plan_hours" type="number" step="0.1"></td>
            <td><span id="sum_study_hours">0</span></td>
          </tr>
          <tr>
            <td>名稱</td>
            <td><input id="class_name" type="text"></td>
            <td><input id="correspondence_name" type="text"></td>
            <td><input id="analysis_name" type="text"></td>
            <td><input id="character_plan_name" type="text"></td>
          </tr>
          <tr>
            <td>進度</td>
            <td><input id="class_progress" type="text"></td>
            <td><input id="correspondence_progress" type="text"></td>
            <td><input id="analysis_progress" type="text"></td>
            <td><input id="character_plan_progress" type="text"></td>
          </tr>
        </table>

        <p>手寫信：<input id="flow-letter" type="number">、LINE：<input id="flow-line" type="number">、E-mail：<input id="flow-email" type="number">、宣傳品數量：<input id="flow-promote" type="number"></p>
        <div class="empty-line" />

        <p style="display: flex; justify-content: space-between; align-items: center;">
          <el-button @click="openModal">送出</el-button>
          <span>
            姓名：<span id="staff_name" />
          </span>
        </p>
        <div class="empty-line" />
      </form>
    </div>
  </div>
</template>

<script src="./init.js"></script>

<style scoped>
body {
  background-color: rgba(244, 198, 13, 0.863);
}

.form-container {
  padding: 0 130px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

.center {
  text-align: center;
}

.empty-line {
  margin-bottom: 70px;
}

input[type="number"] {
  width: 60px;
}

#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

#loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  font-size: 24px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.btn-container {
  text-align: center;
}

.btn-container button {
  margin: 5px;
}
</style>
