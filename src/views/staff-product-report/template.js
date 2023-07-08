import { studyItems } from './define.js'

export function setDateSelect(thursday, thursdayList, callback) {
  // 创建 <select> 元素
  var selectElement = document.createElement('select')
  selectElement.id = 'date'
  selectElement.onchange = () => {
    const date = selectElement.value
    callback(date)
  }

  // 将 <select> 元素添加到页面中的某个父元素中
  var parentElement = document.getElementById('dateSelect') // 请替换为实际的父元素 ID
  parentElement.appendChild(selectElement)

  // 生成選項
  thursdayList.forEach(function(currentDate) {
    var option = document.createElement('option')
    option.value = currentDate
    option.text = currentDate
    selectElement.appendChild(option)

    // 檢查選項是否為預設日期，若是則設定為選中狀態
    if (currentDate === thursday) {
      option.selected = true
    }
  })
}

export function handleDateChange(selectElement) {
  var selectedDate = selectElement.value
  window.location.href = `/admin/situation/correct/index.html?date=${encodeURIComponent(selectedDate)}`
}

//
// 更新總和欄位
//
export function updateSum() {
  const workHours = document.querySelectorAll('#w4, #w5, #w6, #w7, #w1, #w2, #w3')
  const studyHours = document.querySelectorAll('#class_hours, #correspondence_hours, #analysis_hours, #character_plan_hours')
  const sumWorkHours = document.querySelector('#sum_work_hours')
  const sumStudyHours = document.querySelector('#sum_study_hours')

  if (workHours.length === 0) {
    return
  }

  const totalWorkHours = Array.from(workHours).reduce((acc, input) => acc + Number(input.value), 0)
  const totalStudyHours = Array.from(studyHours).reduce((acc, input) => acc + Number(input.value), 0)

  sumWorkHours.textContent = totalWorkHours
  sumStudyHours.textContent = totalStudyHours
}

//
// 產生數據
//

export function createAndCheckData() {
  function createStyle(key) {
    var result = {
      values: [],
      style: '',
      caption: ''
    }
    const style = document.getElementById(key).value
    const elements = document.querySelectorAll(`[id^='${key}-']`)
    result.style = style
    elements.forEach((element) => {
      result.values.push(element.value)
    })

    result.caption = style
    result.values.forEach((value) => {
      result.caption = result.caption.replace('%v', value)
    })

    return result
  }

  function check(item, surceType, name) {
    for (let i = 0; i <= item.values.length; i++) {
      const value = item.values[i]
      if (value === '') {
        alert(`${surceType}有${name}未輸入`)
        return false
      }
    }
    return true
  }

  // 读取主曲線的值
  const mainCurve = []
  for (let i = 1; i <= 8; i++) {
    const nameElement = document.getElementById(`confirm-main-curve-name-${i}`)
    if (nameElement == null || nameElement.innerText === '') {
      continue
    }
    const name = nameElement.innerText
    const statistics = createStyle(`confirm-main-curve-statistics-${i}`)
    const condition = createStyle(`confirm-main-curve-condition-${i}`)

    if (!check(statistics, '主曲線', '統計值')) { return null }
    if (!check(condition, '主曲線', '狀況')) { return null }

    mainCurve.push({ name, statistics, condition })
  }

  // 读取副曲線的值
  const subCurve = []
  for (let i = 1; i <= 4; i++) {
    const nameElement = document.getElementById(`confirm-sub-curve-name-${i}`)
    if (nameElement == null || nameElement.innerText === '') {
      continue
    }
    const name = nameElement.innerText
    const statistics = createStyle(`confirm-sub-curve-statistics-${i}`)
    const condition = createStyle(`confirm-sub-curve-condition-${i}`)

    if (!check(statistics, '副曲線', '統計值')) { return null }
    if (!check(condition, '副曲線', '狀況')) { return null }

    subCurve.push({ name, statistics, condition })
  }

  // 读取工作时数的值
  const workHours = {}
  for (let i = 1; i <= 7; i++) {
    const id = `w${i}`
    var value = Number(document.getElementById(id).value)
    if (value == null) {
      value = 0
    }
    workHours[i] = value
  }

  // 读取读书时数的值
  const studyHours = {}
  for (const i of studyItems) {
    const hours = Number(document.getElementById(`${i.value}_hours`).value)
    const name = document.getElementById(`${i.value}_name`).value
    const progress = document.getElementById(`${i.value}_progress`).value
    if (hours == null || hours === 0) {
      continue
    }
    studyHours[i.key] = ({ name, hours, progress })
  }

  // 读取其他值
  const situation_id = document.getElementById('confirm-message-header').value
  const staffName = document.getElementById('staff_name').textContent
  const position = document.getElementById('position').textContent
  const date = document.getElementById('date').value
  const flowLetter = Number(document.getElementById('flow-letter').value)
  const flowLine = Number(document.getElementById('flow-line').value)
  const flowEmail = Number(document.getElementById('flow-email').value)
  const flowPromote = Number(document.getElementById('flow-promote').value)

  var i = {
    situationId: situation_id,
    staffName: staffName,
    date: date,
    position: position,
    mainCurve: mainCurve,
    subCurve: subCurve,
    workHours: workHours,
    studyHours: studyHours,
    flow: {
      letter: flowLetter,
      line: flowLine,
      email: flowEmail,
      promote: flowPromote
    }
  }
  return i
}
