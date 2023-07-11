<template>
  <div>
    <div id="modal-check-profile" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDetails">&times;</span>
        <table>
          <tr>
            <td colspan="2">
              <span id="confirm-message-header" />
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
          <tr>
            <td colspan="2">
              <p>手寫信：<input id="flow-letter" type="number" style="width: 90px;">、LINE：<input id="flow-line" type="number" style="width: 90px;">、E-mail：<input id="flow-email" type="number" style="width: 90px;">、宣傳品數量：<input id="flow-promote" type="number" style="width: 90px;"></p>
            </td>
          </tr>
        </table>
        <el-button @click="submitUpdate">更新</el-button>
      </div>
    </div>
    <div id="loading-overlay">
      <div id="loading-spinner" />
      <div id="loading-message">正在加载，请稍候...</div>
    </div>

    <h1>產品狀況回饋</h1>
    <p style="display: flex; justify-content: center; align-items: center;">
      <span style="text-align: right; margin-left: 280px;">
        日期: <span id="dateSelect" />
      </span>
    </p>
    <div id="staff-list-container">
      <table id="staff-list">
        <tr>
          <th>日期</th>
          <th>姓名</th>
          <th>職位</th>
          <th>職員<br>類型</th>
          <th>詳細<br>資訊</th>
          <th>總<br>狀況</th>
          <th>個人<br>狀況</th>
          <th>狀況<br>公式</th>
          <th>職員<br>會議</th>
          <th>批注</th>
          <th>基本<br>點數</th>
          <th>技術<br>訓練<br>加給</th>
          <th>管理<br>訓練<br>加給</th>
          <th>聽析<br>個案<br>加給</th>
          <th>年資<br>加給</th>
          <th>職位<br>狀況</th>
          <th>工作<br>時數</th>
          <th>讀書<br>時數</th>
          <th>寫信</th>
          <th>未交<br>狀況<br>公式</th>
          <th>出席<br>職員<br>會議</th>
          <th>GI</th>
          <th>GBS</th>
          <th>總計<br>點數</th>
          <th>備註</th>
        </tr>
        <tr v-for="item in rows" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.position }}</td>
          <td>{{ getStaffTypeValue(item.staffType) }}</td>
          <td>
            <button :disabled="isButtonDisabled(item)" @click="showDetails(item)">{{ item.buttonText }}</button>
          </td>
          <td>
            <select v-model="item.totalStatus" @change="onChangeTotalStatus(item)">
              <option value="non-existence">不存在</option>
              <option value="danger">危險</option>
              <option value="emergency">緊急</option>
              <option value="normal operation">正常</option>
              <option value="normal operation plus">正常+1</option>
              <option value="affluence">豐盛</option>
            </select>
          </td>
          <td>
            <select v-model="item.individualStatus" @change="onChangeIndividualStatus(item)">
              <option value="in operation">正常上班</option>
              <option value="on holiday">請假中</option>
              <option value="ethics">品格處理</option>
              <option value="on remote">遠端工作</option>
            </select>
          </td>
          <td>
            <select v-model="item.formulaStatus" @change="onChangeFormulaStatus(item)">
              <option value="yes">已交</option>
              <option value="no">未交</option>
            </select>
          </td>
          <td>
            <select v-model="item.staffMeeting" @change="onChangeStaffMeeting(item)">
              <option value="yes">出席</option>
              <option value="no">未出席</option>
            </select>
          </td>
          <td><input v-model="item.comment" type="text"></td>
          <td>{{ item.basicPoints }}</td>
          <td>{{ item.technicalTraining }}</td>
          <td>{{ item.managementTraining }}</td>
          <td>{{ item.caseAnalysis }}</td>
          <td>{{ item.seniority }}</td>
          <td><input v-model="item.positionStatus" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.workHours" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.studyHours" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.letter" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.unsubmittedStatus" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.attendStaffMeeting" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.GI" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.GBS" type="number" step="0.01" style="width: 60px;" @change="onChangePoints(item)"></td>
          <td><input v-model="item.totalPoints" type="number" step="0.01" style="width: 60px;"></td>
          <td><input v-model="item.note" type="text"></td>
        </tr>
      </table>
    </div>
    <el-button @click="submitPoints">更新</el-button>
    <el-button @click="submitPointsAndOutput">更新並輸出點數表單</el-button>
  </div>
</template>

<style src="./styles.css" scoped></style>
<script src="./init.js"></script>
