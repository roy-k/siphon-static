import { checkSiConfig, getTargetList } from '../si'

describe('check config', () => {
  test('need target', async() => {
    const res = checkSiConfig({
      target: '',
      options: {
        selector: '',
        fields: {},
      },
    })

    expect(res).toBe(false)
  })

  test('debug env', async() => {
    const res = checkSiConfig({
      target: '123',
      options: {
        selector: '',
        fields: {},
        debugLevel: '1',
      },
    })

    expect(res).toBe(true)
    expect(process.env.SI_DEBUG_LEVEL).toBe('1')
  })
})

describe('format target list', () => {
  test('string to array', () => {
    const res = getTargetList('href')
    expect(res).toEqual(['href'])
  })

  test('array return', () => {
    const res = getTargetList(['href'])
    expect(res).toEqual(['href'])
  })

  test('function return called', () => {
    const res = getTargetList(() => ['href'])
    expect(res).toEqual(['href'])
  })
})
