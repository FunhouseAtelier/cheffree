import logger from '@funhouse-atelier/logger'

const log = logger({ name: '@/app/utilities/filters.ts', level: 2 })

export const filterIdProperty = (obj: any) => {
  const { id, ...filteredObj } = obj
  return filteredObj
}
