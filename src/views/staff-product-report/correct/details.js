
import { studyItems } from '../define.js'
import { showCheckAndChangeMessage } from '../rendering.js'

export function showModal(staff, situation, items, studies, outflows, workings) {
  var mainCurve = []
  var subCurve = []

  for (var i = 0; i < items.length; i++) {
    const curve = items[i]
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
  for (const item of studies) {
    const studyItem = studyItems.find(i => i.value === item.type)
    if (studyItem) {
      studyHours[studyItem.key] = {
        hours: Number(item.hours),
        name: item.study_name,
        progress: item.study_progress
      }
    }
  }

  const letter = outflows.find(p => p.outflow_type === 'letter')
  const line = outflows.find(p => p.outflow_type === 'line')
  const email = outflows.find(p => p.outflow_type === 'email')
  const promote = outflows.find(p => p.outflow_type === 'promote')

  var input = {
    situation_id: situation.id,
    staffName: staff.name,
    date: new Date(situation.settlement_date),
    position: situation.position,
    mainCurve: mainCurve,
    subCurve: subCurve,
    workHours: [
      0,
      Number(workings.find(p => p.week_day === 'monday').working_hours),
      Number(workings.find(p => p.week_day === 'tuesday').working_hours),
      Number(workings.find(p => p.week_day === 'wednesday').working_hours),
      Number(workings.find(p => p.week_day === 'thursday').working_hours),
      Number(workings.find(p => p.week_day === 'friday').working_hours),
      Number(workings.find(p => p.week_day === 'saturday').working_hours),
      Number(workings.find(p => p.week_day === 'sunday').working_hours)
    ],
    studyHours: studyHours,
    outflow: {
      letter: (letter) ? letter.amount : 0,
      line: (line) ? line.amount : 0,
      email: (email) ? email.amount : 0,
      promote: (promote) ? promote.amount : 0
    }
  }

  showCheckAndChangeMessage('每週產品報告', input)
}
