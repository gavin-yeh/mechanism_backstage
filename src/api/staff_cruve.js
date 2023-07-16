import request from '@/utils/request'

export function staffCurveItem(staff_id, date) {
  return request({
    url: '/staff-curve/item',
    method: 'get',
    params: { staff_id, date },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
