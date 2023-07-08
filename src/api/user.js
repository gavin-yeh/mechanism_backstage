import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    // params: { token }
    baseURL: process.env.VUE_APP_SERVER_API
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
