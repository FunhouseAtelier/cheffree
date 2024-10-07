import logger from '@funhouse-atelier/logger'
import { base58 } from 'base-id'

const log = logger({ name: '@scripts/encode-id58.js', level: 0 })

log.info(base58.encode('66f1ac6daa21793c3dadb7ae'))
log.info(base58.encode('66f8e331163d16cae984fa92'))
log.info(base58.encode('66f90cb6b99a92c1509c95fd'))
log.info(base58.encode('66f90cecb99a92c1509c95fe'))
