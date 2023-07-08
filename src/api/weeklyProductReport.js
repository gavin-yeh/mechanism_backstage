import request from '@/utils/request'

export function weeklyProductReportGet(date) {
  return request({
    url: '/weeklyProductReport',
    method: 'get',
    params: { date },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function weeklyProductReportSubmit(data) {
  return request({
    url: '/weeklyProductReport',
    method: 'post',
    data,
    timeout: 10000,
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
