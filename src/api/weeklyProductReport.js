import request from '@/utils/request'

export function userWeeklyProductReportGet(date) {
  return request({
    url: '/user/weeklyProductReport',
    method: 'get',
    params: { date },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function userWeeklyProductReportSubmit(data) {
  return request({
    url: '/user/weeklyProductReport',
    method: 'post',
    data,
    timeout: 30000,
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function weeklyProductReportGet(staffId, date) {
  return request({
    url: '/weeklyProductReport',
    method: 'get',
    params: { staffId, date },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function weeklyProductReportSubmit(data) {
  return request({
    url: '/weeklyProductReport',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
