import logger from '@funhouse-atelier/logger'

import { v4 as uuid } from 'uuid'

const log = logger({ name: '@scripts/generate-uuid.js', level: 0 })

for (let i = 0; i < 8; i++) {
  log.info(uuid())
}
