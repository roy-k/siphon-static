import { SiConfig, SiTarget } from '../../types'

import { msg } from '../util/console'
import handleStaticPage from './handleStaticPage'

/**
 * 检查配置
 * @param config SiConfig
 */
export function checkSiConfig(config: SiConfig): boolean {
  const { target, options } = config
  if (!target) {
    msg.error('config error: config.target can not be empty', '2')
    return false
  }

  const { debugLevel = '2' } = options
  process.env.SI_DEBUG_LEVEL = debugLevel

  return true
}

/**
 * 获取目标页面列表
 * @param target SiTarget
 */
export function getTargetList(target: SiTarget): string[] {
  if (typeof target === 'string') {
    return [target]
  }
  if (Array.isArray(target)) {
    return target
  }
  if (typeof target === 'function') {
    return target()
  }

  console.log('target error: ', target)
  return []
}

/**
 * si
 * @param config SiConfig
 * @param config.target 页面地址
 * @param config.options 抓取配置
 */
export async function si(config: SiConfig) {
  if (!checkSiConfig(config)) {
    return
  }

  const { target, options } = config

  const targetList = getTargetList(target)
  if (!targetList.length) {
    return
  }

  return handleStaticPage(targetList, options)
}