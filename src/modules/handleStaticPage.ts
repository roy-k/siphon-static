import { repeatAsync } from '../util/util'
import { getPageData } from './getPageData'
import { getFieldsFromPageData } from './readPageData'

import { SiOptions, PageData, TaskHandler } from 'types'
import { loopTask, taskListGenerator } from './loopTask'
import { msg } from '../util/console'

/**
 * 默认翻页地址
 * @param target 起始页面地址
 * @param page 页码
 */
function defaultComposeUrlFn(target: string, page: number | string) {
  return `${target}/${page}`
}
/**
 * 默认格式化页码/页数
 * @param page 页码/页数
 */
function defaultFormatPageFn(page: string) {
  return parseInt(page)
}

async function fetchAndReadPage(target: string, options: SiOptions) {
  const { retryTimes } = options

  // 1. 请求页面
  try {
    const htmlData = await repeatAsync(() => getPageData(target), retryTimes)

    // 2. 解析数据
    return getFieldsFromPageData(htmlData, options)
  } catch (error) {
    msg.error(`getPageData error: ${error}`, '2')
  }
}

function resolvePage(options: SiOptions, onlyContent = false) {
  return async function taskHandler(target: string, addItems: any) {
    const { pagination, onEmitPageData } = options

    // 1. 请求 / 解读数据
    const result = await fetchAndReadPage(target, options)

    if (onlyContent || !pagination) {
      onEmitPageData && onEmitPageData(null, result)
      return
    }

    if (!result) {
      // todo 数据格式 梳理
      onEmitPageData &&
        onEmitPageData({ msg: '页面数据请求失败', target }, null)
      return
    }

    // todo 逻辑需要重新梳理
    // 3. 处理分页
    const pageDataPagination = result.pagination
    if (!pageDataPagination) {
      msg.error(`分页数据获取失败: ${target}`, '2')
      // todo 这种错误怎么处理
      onEmitPageData && onEmitPageData('分页获取失败', result)
      return
    }

    const formatFieldsValue =
      pagination.formatFieldsValue || defaultFormatPageFn
    const composeUrlFn = pagination.composeUrlFn || defaultComposeUrlFn

    const { totalPage } = pageDataPagination

    // 3.1 多页 total
    if (totalPage) {
      const restTaskLength = formatFieldsValue(totalPage) - 1
      if (restTaskLength < 0) {
        return result
      }

      // 添加至任务表
      // ! 避免重复的分页逻辑
      const onlyContentHandler = resolvePage(options, true)

      const taskList = new Array(restTaskLength).fill(1).map((i, index) => {
        const targetUrl = composeUrlFn(target, index + 2)
        return () => onlyContentHandler(targetUrl, addItems)
      })

      addItems(...taskList)
    }

    onEmitPageData && onEmitPageData(null, result)
  }
}

/**
 * 静态页面
 * @param targetList 目标url数组
 * @param options 抓取配置
 */
async function handleStaticPage(targetList: string[], options: SiOptions) {
  // 1. mapTask
  const { parallel, interval } = options
  const {list, addItems} = taskListGenerator<TaskHandler>()
  // 2. handle 函数
  const taskHandler = resolvePage(options)
  const taskList = targetList.map((target) => () => taskHandler(target, addItems))
  addItems(taskList)
  // 3. emitPageData
  return loopTask(list, parallel, interval)
}

export default handleStaticPage
