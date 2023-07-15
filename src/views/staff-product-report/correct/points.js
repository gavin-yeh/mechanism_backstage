const { pointsConditionSettingMap, employmentSettingMap } = require('../define.js')

export function transformRows(thursday, staffList, profiles, points, outflows, studies, workings) {
  var rows = []
  staffList.forEach(staff => {
    const profile = profiles.find(p => p.staff_id === staff.id)
    const pointList = points.filter(p => p.situation_id === ((profile) ? profile.id : -1))
    const outflowList = points.filter(p => p.situation_id === ((profile) ? profile.id : -1))
    const studyList = studies.filter(p => p.situation_id === ((profile) ? profile.id : -1))
    const workingList = workings.filter(p => p.situation_id === ((profile) ? profile.id : -1))

    const base = pointList.find(p => p.point_type === 'base')
    const technical_training_plus = pointList.find(p => p.point_type === 'technical_training_plus')
    const management_training_plus = pointList.find(p => p.point_type === 'management_training_plus')
    const audit_case_plus = pointList.find(p => p.point_type === 'audit_case_plus')
    const seniority_plus = pointList.find(p => p.point_type === 'seniority_plus')
    const job_status = pointList.find(p => p.point_type === 'job_status')
    const working_hours = pointList.find(p => p.point_type === 'working_hours')
    const study_hours = pointList.find(p => p.point_type === 'study_hours')
    const writing_letters = pointList.find(p => p.point_type === 'writing_letters')
    const attending_staff = pointList.find(p => p.point_type === 'attending_staff')
    const non_submission = pointList.find(p => p.point_type === 'non_submission')
    const gi = pointList.find(p => p.point_type === 'gi')
    const gbs = pointList.find(p => p.point_type === 'gbs')

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
      basicPoints: (base) ? base.points : staff.points_base,
      technicalTraining: (technical_training_plus) ? technical_training_plus.points : staff.points_technical_training_plus,
      managementTraining: (management_training_plus) ? management_training_plus.points : staff.points_management_training_plus,
      caseAnalysis: (audit_case_plus) ? audit_case_plus.points : staff.points_audit_case_plus,
      seniority: (seniority_plus) ? seniority_plus.points : staff.points_seniority_plus,
      positionStatus: (job_status) ? job_status.points : calculateTotalConditionPoints(profile),
      workHours: (working_hours) ? working_hours.points : calculateWorkPoints(staff, workingList),
      studyHours: (study_hours) ? study_hours.points : calculateStudiesPoints(staff, studyList),
      letter: (writing_letters) ? writing_letters.points : calculateOutflowPoints(staff, outflowList),
      unsubmittedStatus: (attending_staff) ? attending_staff.points : calculateAttendingStaffPoints(staff, profile),
      attendStaffMeeting: (non_submission) ? non_submission.points : calculateNonSubmissionPoints(staff, profile),
      GI: (gi) ? gi.points : 0,
      GBS: (gbs) ? gbs.points : 0
    }

    if (!profile) {
      row.totalPoints = 0
    } else {
      row.totalPoints = calculateTotalPoints(row)
    }

    rows.push(row)
  })

  return rows
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
    const ourflow = outflowList.find(p => p.id === outflow_type)
    if (!ourflow) {
      return 0
    }

    return ourflow.amout
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

function calculateTotalPoints(item) {
  var points =
    10000 * Number(item.basicPoints) +
    10000 * Number(item.technicalTraining) +
    10000 * Number(item.managementTraining) +
    10000 * Number(item.caseAnalysis) +
    10000 * Number(item.seniority) +
    10000 * Number(item.positionStatus) +
    10000 * Number(item.workHours) +
    10000 * Number(item.studyHours) +
    10000 * Number(item.letter) +
    10000 * Number(item.unsubmittedStatus) +
    10000 * Number(item.attendStaffMeeting) +
    10000 * Number(item.GI) +
    10000 * Number(item.GBS)

  points = points / 10000
  if (points > 0) {
    return points
  }
  return 0
}
