// import logger from '@funhouse-atelier/logger'
// import { PrismaClient } from '@prisma/client'
// import { v4 as uuid } from 'uuid'

// const log = logger({ name: '@scripts/migrate-db.js', level: 0 })

// const v = 1
// log.info(`Using migration version ${v}.`)

// const prisma = new PrismaClient()

// switch (v) {
//   case 1:
//     try {
//       // const allRecipes = await prisma.recipe.findMany()
//       // log.debug('allRecipes:\n', allRecipes)
//     } catch (error) {
//       log.error(error)
//       log.trace()
//       throw new Error('Migration failed.')
//     }
//     break
//   default:
//     log.error(`Version ${v} migration logic not being handled.`)
// }

// log.info('Migration succeeded.')
