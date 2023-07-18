const { pointsConditionSettingMap, employmentSettingMap } = require('../define.js')

export function transformRows(thursday, staffList, profiles, points, outflows, studies, workings) {
  var rows = []
  staffList.forEach(staff => {
    const profile = profiles.find(p => p.staff_id === staff.id)
    const pointList = points.filter(p => p.staff_id === staff.id)
    const outflowList = outflows.filter(p => p.situation_id === ((profile) ? profile.id : -1))
    const studyList = studies.filter(p => p.situation_id === ((profile) ? profile.id : -1))
    const workingList = workings.filter(p => p.situation_id === ((profile) ? profile.id : -1))

    const pointItems = [
      { type: 'base', style: 'text', hdr: point => ((point) ? point.points : staff.points_base) },
      { type: 'technical_training_plus', style: 'text', hdr: point => ((point) ? point.points : staff.points_technical_training_plus) },
      { type: 'management_training_plus', style: 'text', hdr: point => ((point) ? point.points : staff.points_management_training_plus) },
      { type: 'audit_case_plus', style: 'text', hdr: point => ((point) ? point.points : staff.points_audit_case_plus) },
      { type: 'seniority_plus', style: 'text', hdr: point => ((point) ? point.points : staff.points_seniority_plus) },
      { type: 'job_status', style: 'text', hdr: point => ((point) ? point.points : calculateTotalConditionPoints(profile)) },
      { type: 'working_hours', style: 'text', hdr: point => ((point) ? point.points : calculateWorkPoints(staff, workingList)) },
      { type: 'study_hours', style: 'input-box', hdr: point => ((point) ? point.points : calculateStudiesPoints(staff, studyList)) },
      { type: 'writing_letters', style: 'input-box', hdr: point => ((point) ? point.points : calculateOutflowPoints(staff, outflowList)) },
      { type: 'attending_staff', style: 'input-box', hdr: point => ((point) ? point.points : calculateAttendingStaffPoints(staff, profile)) },
      { type: 'non_submission', style: 'input-box', hdr: point => ((point) ? point.points : calculateNonSubmissionPoints(staff, profile)) },
      { type: 'gi', style: 'input-box', hdr: point => ((point) ? point.points : 0) },
      { type: 'gbs', style: 'input-box', hdr: point => ((point) ? point.points : 0) },
      { type: 'special_adjustment', style: 'input-box', hdr: point => ((point) ? point.points : 0) }
    ]

    const pointDataList = pointItems.map((pointItem) => {
      var point = pointList.find(p => p.points_type === pointItem.type)
      const points = pointItem.hdr(point)
      if (!point) {
        point = {
          remark: ''
        }
      }

      return {
        staff_id: staff.id,
        date: thursday,
        points_type: pointItem.type,
        points: points,
        remark: point.remark,
        style: pointItem.style
      }
    })

    var row = {
      date: thursday,
      staffId: staff.id,
      situationId: (profile) ? profile.id : 0,
      name: staff.name,
      position: staff.position,
      staffType: staff.employment_type,
      isButtonDisabled: profile,
      totalStatus: (profile) ? profile.general_condition : 0,
      individualStatus: (profile) ? profile.personal_condition : 0,
      formulaStatus: (profile) ? profile.finish_condition_formula : 0,
      staffMeeting: (profile) ? profile.attend_meeting : 0,
      comment: (profile) ? profile.annotation : '',
      pointDataList: pointDataList,
      totalPoints: (profile) ? calculateTotalPoints(pointDataList) : 0
    }

    rows.push(row)
  })

  return { rows }
}

// 週總狀況
function calculateTotalConditionPoints(profile) {
  if (!profile) {
    return 0
  }
  const point = pointsConditionSettingMap.get(profile.general_condition)
  if (point) {
    return point
  }
  return 0
}

// 工作時數
function calculateWorkPoints(staff, workingList) {
  if (!workingList || workingList.length === 0) {
    return 0
  }

  var totalHours = 0
  for (let i = 0; i < workingList.length; i++) {
    totalHours += workingList[i].working_hours
  }

  const prescribedHours = employmentSettingMap.get(staff.employment_type).hours
  var points = 0
  if (totalHours < prescribedHours) {
    const wh = -(prescribedHours - totalHours) * 10000 / prescribedHours
    points = wh * Number(staff.points_base)
    points /= 10000
  }
  return points
}

// 讀書時數
function calculateStudiesPoints(staff, studieList) {
  if (!studieList || studieList.length === 0) {
    return 0
  }

  var points = 0
  var studyHours = 0
  for (var i = 0; i < studieList.length; i++) {
    studyHours += Number(studieList[i].hours)
  }
  if (studyHours === 0) {
    points = employmentPoints(staff, -1)
  }
  return points
}

// 寫信
function calculateOutflowPoints(staff, outflowList) {
  if (!outflowList || outflowList.length === 0) {
    return 0
  }

  function calculateOutflowAmount(outflow_type) {
    const ourflow = outflowList.find(p => p.outflow_type === outflow_type)
    if (!ourflow) {
      return 0
    }

    return ourflow.amount
  }

  if (calculateOutflowAmount('promote') === 0 && calculateOutflowAmount('line') === 0) {
    return employmentPoints(staff, -1)
  }

  return 0
}

// 職員會議
function calculateAttendingStaffPoints(staff, profile) {
  if (!profile) {
    return 0
  }

  if (profile.attend_meeting === 'no') {
    return employmentPoints(staff, -1)
  }
  return 0
}

// 未交狀況公式
function calculateNonSubmissionPoints(staff, profile) {
  if (!profile) {
    return 0
  }

  if (profile.finish_condition_formula === 'no') {
    return employmentPoints(staff, -1)
  }
  return 0
}

function employmentPoints(staff, value) {
  value = Number(value)
  if (staff.employment_type === 'half_time') {
    return value / 2
  }
  return value
}

export function calculateTotalPoints(pointDataList) {
  var points = 0
  pointDataList.forEach(pointData => {
    points += 10000 * pointData.points
  })

  points = points / 10000
  if (points > 0) {
    return points
  }
  return 0
}
