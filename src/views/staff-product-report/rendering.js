import { studyItems } from './define.js'

export function showCheckMessage(title, input) {
  const newlineSymbol = `<br>`

  var header = title + newlineSymbol
  header += ['日期：', input.date, newlineSymbol].join('')
  header += ['職位：', input.position, newlineSymbol].join('')
  header += ['名字：', input.staffName, newlineSymbol].join('')
  document.getElementById('confirm-message-header').innerHTML = header

  var mainCurve = `<h3>主曲線:</h3>
  <table>`
  for (const curve of input.mainCurve) {
    if (curve.name === '') {
      continue
    }

    mainCurve += `
      <tr>
        <td>曲線名稱: ${curve.name}</td>
      </tr>
      <tr>
        <td>曲線值: ${curve.statistics.caption}</td>
      </tr>
      <tr>
        <td>狀況: ${curve.condition.caption}</td>
      </tr>
    `
  }
  mainCurve += `</table>`

  document.getElementById('confirm-message-main-curve').innerHTML = mainCurve

  var subCurve = `<h3>副曲線:</h3>
  <table>`
  for (const curve of input.subCurve) {
    if (curve.name === '') {
      continue
    }
    subCurve += `
      <tr>
        <td>曲線名稱: ${curve.name}</td>
      </tr>
      <tr>
        <td>曲線值: ${curve.statistics.caption}</td>
      </tr>
      <tr>
        <td>狀況: ${curve.condition.caption}</td>
      </tr>
      `
  }
  subCurve += `</table>`

  document.getElementById('confirm-message-sub-curve').innerHTML = subCurve

  const wh = input.workHours
  const whTotal = wh[4] + wh[5] + wh[6] + wh[7] + wh[1] + wh[2] + wh[3]
  var work = `
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
        <td>${wh[4]}</td>
        <td>${wh[5]}</td>
        <td>${wh[6]}</td>
        <td>${wh[7]}</td>
        <td>${wh[1]}</td>
        <td>${wh[2]}</td>
        <td>${wh[3]}</td>
        <td>${whTotal}</td>
      </tr>
    </table>`
  document.getElementById('confirm-message-work').innerHTML = work

  const sh = input.studyHours
  const shTotal = (sh[1] == null ? 0 : sh[1].hours) +
    (sh[2] == null ? 0 : sh[2].hours) +
    (sh[3] == null ? 0 : sh[3].hours) +
    (sh[4] == null ? 0 : sh[4].hours)
  var study = `
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
          <td>${(sh[1] == null) ? 0 : sh[1].hours}</td>
          <td>${(sh[2] == null) ? 0 : sh[2].hours}</td>
          <td>${(sh[3] == null) ? 0 : sh[3].hours}</td>
          <td>${(sh[4] == null) ? 0 : sh[4].hours}</td>
          <td>${shTotal}</td>
        </tr>
        <tr>
          <td>名稱</td>
          <td>${(sh[1] == null) ? '' : sh[1].name}</td>
          <td>${(sh[2] == null) ? '' : sh[2].name}</td>
          <td>${(sh[3] == null) ? '' : sh[3].name}</td>
          <td>${(sh[4] == null) ? '' : sh[4].name}</td>
          <td></td>
        </tr>
        <tr>
          <td>進度</td>
          <td>${(sh[1] == null) ? '' : sh[1].progress}</td>
          <td>${(sh[2] == null) ? '' : sh[2].progress}</td>
          <td>${(sh[3] == null) ? '' : sh[3].progress}</td>
          <td>${(sh[4] == null) ? '' : sh[4].progress}</td>
          <td></td>
        </tr>
    </table>`
  document.getElementById('confirm-message-study').innerHTML = study
}

export function showCheckAndChangeMessage(title, input) {
  var header = `
    <table>
      <span>名字: <span id="staff_name">${input.staffName}</span></span>
      <br>
      <span>職位: <span id="position">${input.position}</span></span>
      <br>
      <span>日期: <span id="date">${input.date.toLocaleDateString()}</span></span>
    </table>`
  document.getElementById('confirm-message-header').innerHTML = header
  document.getElementById('confirm-message-header').value = input.situation_id

  var mainCurve = `<h3>主曲線:</h3>
    <table>`

  var i = 0
  for (i = 0; i < input.mainCurve.length; i++) {
    const curveCount = i + 1

    mainCurve += `
      <tr>
        <td>曲線名稱: <span id="confirm-main-curve-name-${curveCount}"></span></td>
      </tr>
      <tr>
        <td id="confirm-main-curve-statistics-${curveCount}">曲線值: </td>
      </tr>
      <tr>
        <td>狀況: <span id="confirm-main-curve-condition-${curveCount}"></span></td>
      </tr>
    `
  }
  mainCurve += `</table>`

  document.getElementById('confirm-message-main-curve').innerHTML = mainCurve

  for (i = 0; i < input.mainCurve.length; i++) {
    const curveCount = i + 1
    const curve = input.mainCurve[i]

    const nameElement = document.getElementById('confirm-main-curve-name-' + curveCount)
    nameElement.innerHTML = curve.name
    setCurveStyle(curve.statistics.style, 'confirm-main-curve-statistics-' + curveCount, curve.statistics.values)
    setConditionStyle(curve.condition.style, 'confirm-main-curve-condition-' + curveCount, curve.condition.values)
  }

  var subCurve = `<h3>副曲線:</h3>
    <table>`

  for (i = 0; i < input.subCurve.length; i++) {
    const curveCount = i + 1

    subCurve += `
      <tr>
        <td>曲線名稱: <span id="confirm-sub-curve-name-${curveCount}"></span></td>
      </tr>
      <tr>
        <td id="confirm-sub-curve-statistics-${curveCount}">曲線值: </td>
      </tr>
      <tr>
        <td>狀況: <span id="confirm-sub-curve-condition-${curveCount}"></span></td>
      </tr>
    `
  }
  subCurve += `</table>`

  document.getElementById('confirm-message-sub-curve').innerHTML = subCurve

  for (i = 0; i < input.subCurve.length; i++) {
    const curveCount = i + 1
    const curve = input.subCurve[i]

    const nameElement = document.getElementById('confirm-sub-curve-name-' + curveCount)
    nameElement.innerHTML = curve.name
    setCurveStyle(curve.statistics.style, 'confirm-sub-curve-statistics-' + curveCount, curve.statistics.values)
    setConditionStyle(curve.condition.style, 'confirm-sub-curve-condition-' + curveCount, curve.condition.values)
  }

  const wh = input.workHours
  const whTotal = wh[4] + wh[5] + wh[6] + wh[7] + wh[1] + wh[2] + wh[3]
  var work = `
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
        <td><input style="width: 60px;" type="number" step="0.1" id="w4"></td>
        <td><input style="width: 60px;" type="number" step="0.1" id="w5"></td>
        <td><input style="width: 60px;" type="number" step="0.1" id="w6"></td>
        <td><input style="width: 60px;" type="number" step="0.1" id="w7"></td>
        <td><input style="width: 60px;" type="number" step="0.1" id="w1"></td>
        <td><input style="width: 60px;" type="number" step="0.1" id="w2"></td>
        <td><input style="width: 60px;" type="number" step="0.1" id="w3"></td>
        <td><span id="sum_work_hours">${whTotal}</span></td>
      </tr>
    </table>`
  document.getElementById('confirm-message-work').innerHTML = work

  for (let i = 1; i <= 7; i++) {
    const element = document.getElementById('w' + i)
    element.value = wh[i]
  }

  const sh = input.studyHours
  const shTotal = (sh[1] == null ? 0 : sh[1].hours) +
    (sh[2] == null ? 0 : sh[2].hours) +
    (sh[3] == null ? 0 : sh[3].hours) +
    (sh[4] == null ? 0 : sh[4].hours)
  var study = `
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
        <td><input style="width: 90px;" type="number" step="0.1" id="class_hours"></td>
        <td><input style="width: 90px;" type="number" step="0.1" id="correspondence_hours"></td>
        <td><input style="width: 90px;" type="number" step="0.1" id="analysis_hours"></td>
        <td><input style="width: 90px;" type="number" step="0.1" id="character_plan_hours"></td>
        <td><span id="sum_study_hours">${shTotal}</span></td>
      </tr>
      <tr>
        <td>名稱</td>
        <td><input style="width: 90px;" type="text" id="class_name"></td>
        <td><input style="width: 90px;" type="text" id="correspondence_name"></td>
        <td><input style="width: 90px;" type="text" id="analysis_name"></td>
        <td><input style="width: 90px;" type="text" id="character_plan_name"></td>
        <td></td>
      </tr>
      <tr>
        <td>進度</td>
        <td><input style="width: 90px;" type="text" id="class_progress"></td>
        <td><input style="width: 90px;" type="text" id="correspondence_progress"></td>
        <td><input style="width: 90px;" type="text" id="analysis_progress"></td>
        <td><input style="width: 90px;" type="text" id="character_plan_progress"></td>
        <td></td>
      </tr>
    </table>`
  document.getElementById('confirm-message-study').innerHTML = study

  for (const i of studyItems) {
    document.getElementById(`${i.value}_hours`).value = (sh[i.key] == null) ? 0 : sh[i.key].hours
    document.getElementById(`${i.value}_name`).value = (sh[i.key] == null) ? '' : sh[i.key].name
    document.getElementById(`${i.value}_progress`).value = (sh[i.key] == null) ? '' : sh[i.key].progress
  }

  document.getElementById('flow-letter').value = input.outflow.letter
  document.getElementById('flow-line').value = input.outflow.line
  document.getElementById('flow-email').value = input.outflow.email
  document.getElementById('flow-promote').value = input.outflow.promote
}

export function setCurveStyle(style, valueId, values) {
  if (style == null || style.length === 0) {
    style = '%v'
  }
  if (values == null) {
    values = []
  }
  const matchCount = style.match(/%v/g).length

  // 創建一個包含輸入框的 HTML 字符串
  let replacedStr = style
  for (let i = 0; i < matchCount; i++) {
    var value = values[i]
    if (value == null) {
      value = ''
    }
    const inputHtml = `<input type="number" id="${valueId}-${i + 1}" value="${value}" style="width: 80px;" />`
    replacedStr = replacedStr.replace('%v', inputHtml, 1) // 將字符串中的 %v 替換為輸入框 HTML
  }

  // 將替換後的字符串插入到指定的元素中
  const selector = document.querySelector(`#${valueId}`)
  selector.innerHTML += replacedStr
  selector.value = style
}

export function setConditionStyle(style, valueId, values) {
  if (style == null || style.length === 0) {
    style = '%v'
  }
  if (values == null) {
    values = []
  }
  const matchCount = style.match(/%v/g).length

  // 創建一個包含輸入框的 HTML 字符串
  let replacedStr = style
  for (let i = 0; i < matchCount; i++) {
    var value = values[i]
    if (value == null) {
      value = ''
    }
    const inputHtml = `
      <select id="${valueId}-${i + 1}">
        <option>${value}</option>
        <option>不存在</option>
        <option>危險</option>
        <option>緊急</option>
        <option>正常</option>
        <option>豐盛</option>
       </select>`
    replacedStr = replacedStr.replace('%v', inputHtml, 1) // 將字符串中的 %v 替換為輸入框 HTML
  }

  // 將替換後的字符串插入到指定的元素中
  const selector = document.querySelector(`#${valueId}`)
  selector.innerHTML += replacedStr
  selector.value = style
}
