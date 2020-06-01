import {msg} from './console'
/**
 * 模拟 sleep
 * @param millionSeconds 等待毫秒数
 */
export function sleep(millionSeconds: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, millionSeconds)
  })
}

type AsyncFn = () => Promise<any>
/**
 * 异步请求重试
 * @param fn promise 函数
 * @param times 重试次数
 */
export async function repeatAsync(fn: AsyncFn, times = 1) {
  if (times <= 1) {
    return fn()
  }

  while (times > 0) {
    try {
      const res = await fn()
      return res
    } catch (error) {
      if (error && error === 'netError') {
        msg.info('任务重试', '1')
        times--
        continue
      } else {
        return Promise.reject(error)
      }
    }
  }
}
