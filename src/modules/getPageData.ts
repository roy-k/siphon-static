import axios from 'axios'
import { msg } from '../util/console'

export async function getPageData(target: string): Promise<string> {
  try {
    const { status, request, data } = await axios.get(target)

    if (status !== 200) {
      msg.error(
        `getPageData error; status: ${status}, request: ${request.toString()}`,
        '2'
      )
      return Promise.reject('netError')
    }

    return data
  } catch (err) {
    msg.error(err, '2')
    return Promise.reject()
  }
}
