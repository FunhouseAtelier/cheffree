import { z } from 'zod'
/* Import the Zod custom error mapping logic to enable custom error reporting when parsing data with Zod, in a brief, human-readable format that can be easily used by forms to display error messages. (See: https://zod.dev/ERROR_HANDLING?id=customizing-errors-with-zoderrormap) */
import '~/utilities/zod/error-map'

/* Define the individual values within user data. */
const userId58 = z.coerce.string().regex(/^[a-km-zA-HJ-NP-Z1-9]{17}$/)
const clerkId = z.coerce.string().regex(/^user_[a-zA-Z0-9_]{27}$/)
const displayName = z.coerce.string().min(1).max(32)
const imageUrl = z.coerce.string().url()

export type UserId58 = z.infer<typeof userId58>
export type ClerkId = z.infer<typeof clerkId>

/* Define the schema for basic user data. */
const basicUserDataSchema = z.object({
  id58: userId58,
  displayName,
  imageUrl,
})

export type BasicUserData = z.infer<typeof basicUserDataSchema>

/* Define the schema for the onboarding form and its possible errors. */
export const onboardingFormSchema = z.object({ displayName })

export type OnboardingForm = z.infer<typeof onboardingFormSchema>

const onboardingFormErrors = z
  .object({
    _global: z.coerce.string(),
    displayName: z.coerce.string(),
  })
  .partial()

export type OnboardingFormErrors = z.infer<typeof onboardingFormErrors>

/* Define the schema for the app settings form and its possible errors. */
export const appSettingsFormSchema = z.object({ displayName })

export type AppSettingsForm = z.infer<typeof appSettingsFormSchema>

const appSettingsFormErrors = z
  .object({
    _global: z.coerce.string(),
    displayName: z.coerce.string(),
  })
  .partial()

export type AppSettingsFormErrors = z.infer<typeof appSettingsFormErrors>
