import { z } from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (ctx.defaultError === 'Required') return { message: 'required' }
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'string') {
      return { message: 'must be a string' }
    }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      if (issue.minimum === 1) {
        return { message: 'required' }
      } else {
        return { message: `too short (${issue.minimum} min)` }
      }
    }
  }
  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'string') {
      return { message: `too long (${issue.maximum} max)` }
    }
  }
  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)
