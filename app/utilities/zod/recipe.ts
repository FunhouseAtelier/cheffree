import logger from '@funhouse-atelier/logger'
import { z } from 'zod'
import {
  id,
  id58,
  uuid,
  requireSomeProperty,
  requireSomePropertyMsg,
} from './common'
import { displayName, imageUrl } from './user'

const log = logger({ name: '@/app/utilities/zod/recipe.ts', level: 2 })

const title = z.string().min(1).max(64)
export type Title = z.infer<typeof title>

const description = z.string().max(1024)
export type Description = z.infer<typeof description>

const isPublished = z.boolean()
export type isPublished = z.infer<typeof isPublished>

const author = z.object({
  id58,
  displayName,
  imageUrl,
})

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

const recipeBasicData = z.object({
  id58,
  title,
  description,
  author,
})
export type RecipeBasicData = z.infer<typeof recipeBasicData>

const getRecipeWhereArgs = z
  .object({
    id,
    id58,
  })
  .partial()
  .refine(requireSomeProperty, requireSomePropertyMsg)
export type GetRecipeWhereArgs = z.infer<typeof getRecipeWhereArgs>
/**
 *
 */
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
