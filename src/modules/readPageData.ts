import cheerio from 'cheerio'
import { msg } from '../util/console'

import {
  FieldProps,
  SiOptions,
  CollectRowListItem,
  PageData,
} from '../../types'

export function getFieldsFromPageData(
  htmlData: string,
  options: SiOptions
): PageData {
  const { selector, fields, pagination } = options

  try {
    const $ = cheerio.load(htmlData)

    const list = $(selector)

    // 目标元素列表
    const dataList = Array.from(list).map((item) => {
      const $Item = $(item)

      const res: CollectRowListItem = {}

      Object.entries(fields).forEach(([key, fieldProp]) => {
        const fieldValue = getElementField($Item, fieldProp)
        res[key] = fieldValue
      })

      return res
    })

    // 分页信息
    let paginationData
    if (pagination) {
      const { totalPage } = pagination
      if (totalPage) {
        const total = getElementField(list, totalPage, $)
        paginationData = {
          totalPage: total,
        }
      }
    }
    return {
      list: dataList,
      pagination: paginationData,
    } as PageData
  } catch (err) {
    msg.error(`解析页面出错: ${err.toString()}`, '2')
    return { list: [] }
  }
}

export function getElementField(
  el: Cheerio,
  fieldProp: FieldProps,
  $?: CheerioStatic
) {
  const { selector, selectorProps } = fieldProp

  try {
    const fieldEl = $ ? $(selector) : el.find(selector)

    if (!selectorProps) {
      return fieldEl.text()
    } else {
      const { type, name, formatter } = selectorProps

      let fieldValue = ''

      if (!type || type === 'text') {
        fieldValue = fieldEl.text()
      } else {
        if (!name) {
          msg.warn('when selectorProps.type != "text", name must be set')
        } else {
          fieldValue = name && fieldEl[type](name)
        }
      }

      return formatter ? formatter(fieldValue) : fieldValue
    }
  } catch (err) {
    msg.error(`解析元素字段出错: ${err.toString()}`, '2')
    return ''
  }
}

// export default getFieldsFromPageData
