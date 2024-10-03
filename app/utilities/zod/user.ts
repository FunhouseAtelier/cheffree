import logger from '@funhouse-atelier/logger'
import { z } from 'zod'
import { id58 } from './common'

const log = logger({ name: '@/app/utilities/zod/user.ts', level: 2 })

/* Define the individual values within user data. */
const clerkId = z.coerce.string().regex(/^user_[a-zA-Z0-9_]{27}$/)
export const displayName = z.coerce.string().min(1).max(32)
export const imageUrl = z.coerce.string().url()

export type ClerkId = z.infer<typeof clerkId>

/* Define the schema for basic user data. */
const basicUserData = z.object({
  id58,
  displayName,
  imageUrl,
})

export type BasicUserData = z.infer<typeof basicUserData>

/* Define the schema for the onboarding form and its possible errors. */
export const onboardingForm = z.object({ displayName })

export type OnboardingForm = z.infer<typeof onboardingForm>

const onboardingFormErrors = z
  .object({
    _global: z.coerce.string(),
    displayName: z.coerce.string(),
  })
  .partial()

export type OnboardingFormErrors = z.infer<typeof onboardingFormErrors>

/* Define the schema for the app settings form and its possible errors. */
export const appSettingsForm = z.object({ displayName })

export type AppSettingsForm = z.infer<typeof appSettingsForm>

const appSettingsFormErrors = z
  .object({
    _global: z.coerce.string(),
    displayName: z.coerce.string(),
  })
  .partial()

export type AppSettingsFormErrors = z.infer<typeof appSettingsFormErrors>
