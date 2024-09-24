import { z } from 'zod'

export const displayNameSchema = z
  .string({
    required_error: 'required',
    invalid_type_error: 'must be a string',
  })
  .min(1, { message: 'required' })
  .max(32, { message: 'too long (32 max)' })

export const onboardingFormSchema = z.object({
  displayName: displayNameSchema,
})

export const appSettingsFormSchema = z.object({
  displayName: displayNameSchema,
})
