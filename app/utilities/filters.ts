import logger from '@funhouse-atelier/logger'

const log = logger({ name: '@/app/utilities/filters.ts', level: 2 })
log.debug('logger instantiated')

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const filterIdProperty = (obj: any) => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { id, ...filteredObj } = obj
  return filteredObj
}
