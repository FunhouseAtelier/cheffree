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
const yieldAmt = z.object({
  qty: z.string(),
  unit: z.string(),
})
const ingredient = z.object({
  qty: z.string(),
  unit: z.string(),
  name: z.string(),
})
const step = z.string().max(1024)

const basicRecipeData = z.object({
  id58,
  title,
  description,
  author,
})
export type BasicRecipeData = z.infer<typeof basicRecipeData>

const ingredients = z.array(
  z.object({
    id: uuid,
    data: ingredient,
  })
)

export type Ingredients = z.infer<typeof ingredients>

const steps = z.array(
  z.object({
    id: uuid,
    data: step,
  })
)

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
    isPublished: z.string(),
    yieldAmt: z.object({
      qty: z.string(),
      unit: z.string(),
    }),
    /* adjust these to match revise zodParse logic for arrays of form data */
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
  })
  .partial()
export type EditRecipeFormErrors = z.infer<typeof editRecipeFormErrors>

export const recipeUpdates = z.object({
  isPublished,
  title,
  description,
  yieldAmt,
  ingredients: z.array(ingredient),
  steps: z.array(step),
})
