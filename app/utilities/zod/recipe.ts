import logger from '@funhouse-atelier/logger'
import { z } from 'zod'
import { id58 } from './common'
import { displayName, imageUrl } from './user'

const log = logger({ name: '@/app/utilities/zod/recipe.ts', level: 2 })

const title = z.coerce.string().min(1).max(64)
const description = z.coerce.string().max(1024)
const isPublished = z.coerce.boolean()
const author = z.object({
  id58,
  displayName,
  imageUrl,
})
const yieldAmt = z.object({
  qty: z.coerce.number(),
  unit: z.coerce.string(),
})
const ingredients = z.array(
  z.object({
    qty: z.coerce.number(),
    unit: z.coerce.string(),
    name: z.coerce.string(),
  })
)
const steps = z.array(z.coerce.string().max(1024))

/* Define the schema for basic recipe data. */
const basicRecipeData = z.object({
  id58,
  title,
  description,
  author,
})

export type BasicRecipeData = z.infer<typeof basicRecipeData>

/* Define the schema for the edit recipe form and its possible errors. */
export const editRecipeForm = z.object({
  title,
  description,
  isPublished,
  yieldAmt,
  ingredients,
  steps,
})

export type EditRecipeForm = z.infer<typeof editRecipeForm>

const editRecipeFormErrors = z
  .object({
    _global: z.coerce.string(),
    title: z.coerce.string(),
    description: z.coerce.string(),
    isPublished: z.coerce.string(),
    yieldAmt: z.coerce.string(),
    ingredients: z.array(z.coerce.string()),
    steps: z.array(z.coerce.string()),
  })
  .partial()

export type EditRecipeFormErrors = z.infer<typeof editRecipeFormErrors>
