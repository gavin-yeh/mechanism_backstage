import request from '@/utils/request'

export function staffAll() {
  return request({
    url: '/staffs',
    method: 'get',
    params: { },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
