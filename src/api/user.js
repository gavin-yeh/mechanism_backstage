import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    baseURL: process.env.VUE_APP_SERVER_API,
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    baseURL: process.env.VUE_APP_SERVER_API
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
