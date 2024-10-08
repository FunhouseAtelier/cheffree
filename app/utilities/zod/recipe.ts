import logger from '@funhouse-atelier/logger'
import { z } from 'zod'
import { id58, uuid } from './common'
import { displayName, imageUrl } from './user'

const log = logger({ name: '@/app/utilities/zod/recipe.ts', level: 2 })

const isPublished = z.boolean()
const title = z.string().min(1).max(64)
const description = z.string().max(1024)

const author = z.object({
  id58,
  displayName,
  imageUrl,
})

const basicRecipeData = z.object({
  id58,
  title,
  description,
  author,
})
export type BasicRecipeData = z.infer<typeof basicRecipeData>

const yieldAmt = z
  .object({
    qty: z.string(),
    unit: z.string(),
  })
  .partial()

const ingredient = z.object({
  key: uuid,
  qty: z.string().optional(),
  unit: z.string().optional(),
  item: z.string().optional(),
})
export type Ingredient = z.infer<typeof ingredient>

const step = z.object({
  key: uuid,
  text: z.string().max(1024).optional(),
})
export type Step = z.infer<typeof step>

const ingredients = z.array(ingredient)
export type Ingredients = z.infer<typeof ingredients>

const steps = z.array(step)
export type Steps = z.infer<typeof steps>

export const editRecipeFormData = z.object({
  isPublished,
  title,
  description,
  yieldAmt,
  ingredients,
  steps,
})
export type EditRecipeFormData = z.infer<typeof editRecipeFormData>

const editRecipeFormErrors = z
  .object({
    _global: z.string(),
    title: z.string(),
    description: z.string(),
  })
  .partial()
export type EditRecipeFormErrors = z.infer<typeof editRecipeFormErrors>
