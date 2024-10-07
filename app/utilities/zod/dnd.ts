import logger from '@funhouse-atelier/logger'
import { z } from 'zod'
import { id58, uuid } from './common'

const log = logger({ name: '@/app/utilities/zod/dnd.ts', level: 2 })

// const dndId = z.union([id58, uuid])
// export type DndId = z.infer<typeof dndId>

// const dndStart = z.object({
//   draggableId: dndId,
//   type: z.string(),
//   source: z.object({
//     droppableId: dndId,
//     index: z.number(),
//   }),
// })
// export type DndStart = z.infer<typeof dndStart>

// const dndUpdate = dndStart.extend({
//   destination: z
//     .object({
//       droppableId: dndId,
//       index: z.number(),
//     })
//     .optional(),
// })
// export type DndUpdate = z.infer<typeof dndUpdate>

// const dndEnd = dndUpdate.extend({
//   reason: z.union([z.literal('DROP'), z.literal('CANCEL')]),
// })
// export type DndEnd = z.infer<typeof dndEnd>
