import request from '@/utils/request'

export function publicGet(public_id) {
  return request({
    url: '/public',
    method: 'get',
    params: { public_id },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function publicSearch(current_page, page_size, filter_text) {
  return request({
    url: '/public/search',
    method: 'get',
    params: { current_page, page_size, filter_text },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function publicAdd(nickname, full_name, phone, fsm_id, ts) {
  return request({
    url: '/public',
    method: 'post',
    data: { nickname, full_name, phone, fsm_id, ts },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function publicRegister(submitData) {
  return request({
    url: '/public/product/register',
    method: 'post',
    data: { submitData },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
