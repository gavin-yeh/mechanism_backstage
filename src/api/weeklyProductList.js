import request from '@/utils/request'

export function weeklyProductListGet(date) {
  return request({
    url: '/weeklyProductList',
    method: 'get',
    params: { date },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function weeklyProductListSubmit(data) {
  return request({
    url: '/weeklyProductList',
    method: 'post',
    data,
    timeout: 30000,
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
