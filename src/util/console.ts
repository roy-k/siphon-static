import c from 'ansi-colors'
import { DebugLevel } from 'types'

/** debug level */

// process.env.siphon_debug

// message
function warn(msg: string, level: DebugLevel = '0') {
  const debugLevel = process.env.SI_DEBUG_LEVEL || '2'
  level >= debugLevel && console.log(c.yellow(msg))
}

function error(msg: string, level: DebugLevel = '0') {
  const debugLevel = process.env.SI_DEBUG_LEVEL || '2'
  level >= debugLevel && console.log(c.red(msg))
}

function info(msg: string, level: DebugLevel = '0') {
  const debugLevel = process.env.SI_DEBUG_LEVEL || '2'
  level >= debugLevel && console.log(msg)
}

export const msg = {
  warn,
  error,
  info,
}
