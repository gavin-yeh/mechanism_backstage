import request from '@/utils/request'

export function productBookSearch(filter_name) {
  return request({
    url: '/product/book/search',
    method: 'get',
    params: { filter_name },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
export function productBookList(book_ids) {
  return request({
    url: '/product/book/list',
    method: 'get',
    params: { book_ids },
    baseURL: process.env.VUE_APP_SERVER_API
  })
}
