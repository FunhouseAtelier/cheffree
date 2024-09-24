import { z } from 'zod'
import * as zs from './zod.schemas'

export type AppSettingsForm = z.infer<typeof zs.appSettingsFormSchema>
export type OnboardingForm = z.infer<typeof zs.onboardingFormSchema>
