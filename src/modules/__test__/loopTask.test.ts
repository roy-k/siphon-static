import { loopTaskInterval, loopTaskParallel } from '../loopTask'
import { sleep } from '../../util/util'

const tasks = ['a', 'b', 'c', 'd', 'e', 'f']

describe('loop 简单测试', () => {
  test('loopTaskParallel', async() => {
    let parallelTimes = 0
    const intervalTimes = 0
    const tempFn = async() => {
      await sleep(10)
      parallelTimes += 1
    }
    const parallelTaskList = tasks.map((e, index) => {
      return async() => {
        await sleep(10)
        parallelTimes += 1
        if (index < 2) {
          parallelTaskList.push(tempFn)
        }
      }
    })
    await loopTaskParallel(parallelTaskList, 3)

    expect(parallelTimes).toBe(8)
  })

  test('loopTaskInterval', async() => {
    let intervalTimes = 0
    const tempFn = async() => {
      await sleep(10)
      intervalTimes += 1
    }
    const parallelTaskList = tasks.map((e, index) => {
      return async() => {
        await sleep(10)
        intervalTimes += 1
        if (index < 2) {
          parallelTaskList.push(tempFn)
        }
      }
    })
    await loopTaskInterval(parallelTaskList, 10)

    expect(intervalTimes).toBe(8)
  })
})
