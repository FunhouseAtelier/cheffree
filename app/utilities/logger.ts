import type { ChalkInstance } from 'chalk'
import type { LogLevelDesc, LogLevelNumbers, Logger } from 'loglevel'

import chalk from 'chalk'
import loglevel from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

type LoglevelMessage = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
const colors: {
  [key in LoglevelMessage]: ChalkInstance
} = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
}

prefix.reg(loglevel)
prefix.apply(loglevel, {
  timestampFormatter(date) {
    return date.toISOString()
  },
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[
      level.toUpperCase() as LoglevelMessage
    ](level)}${['INFO', 'WARN'].includes(level) ? ' ' : ''} ${chalk.green(
      `${name || 'global'}${'\n'}`
    )}`
  },
})

const logger = ({
  name,
  level,
}: {
  name?: string
  level?: LogLevelDesc | LogLevelNumbers
}): Logger => {
  const log = name ? loglevel.getLogger(name) : loglevel

  if (level || level === 0) log.setLevel(level)

  /* tests */
  // log.trace('testing log.trace()')
  // log.debug('testing log.debug()')
  // log.info('testing log.info()')
  // log.warn('testing log.warn()')
  // log.error('testing log.error()')

  return log
}
export default logger
