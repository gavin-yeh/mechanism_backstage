
export function employmentPoints(item, value) {
  value = Number(value)
  if (item.staffType === 'half_time') {
    return value / 2
  }
  return value
}

export function calculateTotalPoints(item) {
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
  if (points < 0) {
    points = 0
  }

  item.totalPoints = points
  return
}
