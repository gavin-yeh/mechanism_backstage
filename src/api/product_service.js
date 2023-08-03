import request from '@/utils/request'

export function productServiceSearch(filter_name) {
  return request({
    url: '/product/service/search',
    method: 'get',
    params: { filter_name },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
