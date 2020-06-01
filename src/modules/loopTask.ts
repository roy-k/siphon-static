import { TaskHandler } from 'types'
import { sleep } from '../util/util'

/**
 * 并发
 * @param taskList
 * @param parallel
 */
export async function loopTaskParallel(taskList: TaskHandler[], parallel = 1) {
  if (parallel === 1) {
    return loopTaskInterval(taskList, 0)
  }

  let threads = parallel

  const runTask = async () => {
    if (!taskList.length || threads <= 0) {
      return
    }

    return Promise.all(
      Array(threads)
        .fill(1)
        .map(async () => {
          const task = taskList.shift()

          if (!task) {
            return
          }

          threads -= 1
          await task()
          threads += 1

          await runTask()
        })
    )
  }

  await runTask()
}

/**
 * 间隔
 * @param taskList
 * @param interval
 */
export async function loopTaskInterval(
  taskList: TaskHandler[],
  interval = 2000
) {
  while (taskList.length) {
    const task = taskList.shift()
    task && (await task())
    await sleep(interval)
  }
}

export function loopTask(
  taskList: TaskHandler[],
  parallel?: number,
  interval?: number
) {
  if (!parallel && !interval) {
    return loopTaskParallel(taskList)
  }

  if (parallel && interval) {
    return loopTaskInterval(taskList, Math.ceil(interval / parallel))
  }

  if (parallel) {
    return loopTaskParallel(taskList, parallel)
  }

  return loopTaskInterval(taskList, interval)
}
