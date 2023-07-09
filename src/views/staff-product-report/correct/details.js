
import { studyItems } from '../define.js'
import { showCheckAndChangeMessage } from '../rendering.js'

export function showModal(staff, situation, staffSituationItems, staffSituationStudies) {
  var mainCurve = []
  var subCurve = []

  for (var i = 0; i < staffSituationItems.length; i++) {
    const curve = staffSituationItems[i]
    const c = {
      name: curve.curve_name,
      statistics: { caption: curve.statistics_caption, style: curve.statistics_style, values: [curve.statistics1, curve.statistics2, curve.statistics3] },
      condition: { caption: curve.condition_caption, style: curve.condition_style, values: [curve.condition1, curve.condition2, curve.condition3] }
    }
    if (curve.type === 'main_curve') {
      mainCurve.push(c)
    } else {
      subCurve.push(c)
    }
  }

  const studyHours = {}
  for (const item of staffSituationStudies) {
    const studyItem = studyItems.find(i => i.value === item.type)
    if (studyItem) {
      studyHours[studyItem.key] = {
        hours: Number(item.hours),
        name: item.study_name,
        progress: item.study_progress
      }
    }
  }

  var input = {
    situation_id: situation.id,
    staffName: staff.name,
    date: new Date(situation.settlement_date),
    position: situation.position,
    mainCurve: mainCurve,
    subCurve: subCurve,
    workHours: [
      0,
      Number(situation.working_hours_w1),
      Number(situation.working_hours_w2),
      Number(situation.working_hours_w3),
      Number(situation.working_hours_w4),
      Number(situation.working_hours_w5),
      Number(situation.working_hours_w6),
      Number(situation.working_hours_w7)
    ],
    studyHours: studyHours,
    outflow: {
      letter: situation.outflow_letter,
      line: situation.outflow_line,
      email: situation.outflow_email,
      promote: situation.outflow_promote
    }
  }

  showCheckAndChangeMessage('每週產品報告', input)
}
