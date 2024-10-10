import logger from '@funhouse-atelier/logger'
import { z } from 'zod'
import {
  id,
  id58,
  createdAt,
  updatedAt,
  requireSomeProperty,
  requireSomePropertyMsg,
} from './common'

const log = logger({ name: '@/app/utilities/zod/user.ts', level: 2 })
log.debug('logger instantiated')

const clerkId = z.string().regex(/^user_[a-zA-Z0-9_]{27}$/)
export type ClerkId = z.infer<typeof clerkId>

const email = z.string().email({
  message: 'must be a valid email address *',
})
export type Email = z.infer<typeof email>

export const displayName = z.string().min(1).max(32)
export type DisplayName = z.infer<typeof displayName>

export const imageUrl = z.string().url()
export type ImageUrl = z.infer<typeof imageUrl>

const userBasicData = z.object({
  id58,
  displayName,
  imageUrl,
})
export type UserBasicData = z.infer<typeof userBasicData>

const userProfileData = userBasicData.extend({
  createdAt,
  updatedAt,
})
export type UserProfileData = z.infer<typeof userProfileData>

const userOnboardingData = z.object({
  id58,
  email,
  imageUrl,
  updatedAt,
})
export type UserOnboardingData = z.infer<typeof userOnboardingData>

const getUserWhereArgs = z
  .object({
    id,
    id58,
    clerkId,
    email,
  })
  .partial()
  .refine(requireSomeProperty, requireSomePropertyMsg)
export type GetUserWhereArgs = z.infer<typeof getUserWhereArgs>

/* Define the schema for the onboarding form and its possible errors. */
export const onboardingFormData = z.object({ displayName })
export type OnboardingFormData = z.infer<typeof onboardingFormData>

const onboardingFormErrors = z
  .object({
    _global: z.coerce.string(),
    displayName: z.coerce.string(),
  })
  .partial()
export type OnboardingFormErrors = z.infer<typeof onboardingFormErrors>

/* Define the schema for the app settings form and its possible errors. */
export const appSettingsFormData = z.object({ displayName })
export type AppSettingsFormData = z.infer<typeof appSettingsFormData>

const appSettingsFormErrors = z
  .object({
    _global: z.coerce.string(),
    displayName: z.coerce.string(),
  })
  .partial()
export type AppSettingsFormErrors = z.infer<typeof appSettingsFormErrors>
