import axios from 'axios'

const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken = axios.CancelToken

/**
 * @description 取消请求
 * @params nowBrand {string} '请求url' + '&' + '方法类型(get||post||put||delete等)'
 */
axios.cancelFetch = (nowBrand) => {
  for (const p in pending) {
    if (nowBrand == null) { // 如果为空，删除所有
      pending[p].cancel() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    } else if (pending[p].brand === nowBrand) {
      pending[p].cancel()
      pending.splice(p, 1)
    }
  }
}

axios.interceptors.request.use((config) => {
  const {isAutoCancel = false, method, url} = config
  // 取消令牌标识是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
  const brand = url + '&' + method
  // 判断是否需要 - 设置自动取消(默认 false)
  if (isAutoCancel === true) {
    // 先取消有相同请求的请求
    axios.cancelFetch(brand)
    // 设置取消令牌
    config.cancelBrand = brand
    config.cancelToken = new CancelToken((cancel) => {
      pending.push({brand, cancel, config})
    })
  }
  return config
})

axios.interceptors.response.use((response) => {
  const {config: {cancelBrand}} = response
  cancelBrand && clearPending(cancelBrand)

  return response
}, (error) => {
  const {config} = error
  if (config) {
    const {cancelBrand} = config
    cancelBrand && clearPending(cancelBrand)
  }

  return error
})

function clearPending (cancelBrand) {
  if (cancelBrand) {
    for (const p in pending) {
      if (pending[p].brand === cancelBrand) {
        pending.splice(p, 1)
      }
    }
  } else {
    pending.length = 0
  }
}

export {
  axios
}

export default axios
