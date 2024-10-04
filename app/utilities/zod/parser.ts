import logger from '@funhouse-atelier/logger'

const log = logger({ name: '@app/utilities/zod/parser.ts', level: 2 })

const appendToErrors = ({
  errors,
  parseFailure,
}: {
  errors: { [key: string]: string | object }
  parseFailure: object
}) => {
  for (const [parseFailureKey, parseFailureVal] of Object.entries(
    parseFailure
  )) {
    if (parseFailureKey === '_errors') {
      if (parseFailureVal.length) errors._global = parseFailureVal.join(' • ')
    } else {
      if (
        parseFailureVal._errors &&
        Object.keys(parseFailureVal).length === 1
      ) {
        errors[parseFailureKey] = parseFailureVal._errors.join(' • ')
      } else {
        for (const nestedKey of Object.keys(parseFailureVal)) {
          if (nestedKey !== '_errors') {
            const newNestingLevel: { [key: string]: string | object } = {}
            errors[parseFailureKey] = newNestingLevel
            appendToErrors({
              errors: newNestingLevel,
              parseFailure: parseFailureVal,
            })
          }
        }
      }
    }
  }
}

export default function zodParse({
  data,
  schema,
}: {
  data: any
  /* NOTE: For some reason using `ZodSchema` here causes a TypeScript warning when trying to access `schema._cached`. */
  schema: any
}) {
  const parseResult = schema.safeParse(data)
  if (parseResult.success) {
    const { data } = parseResult
    return { success: { data } }
  }
  const errors: { [key: string]: string | object } = {}
  const isNested = schema._cached.keys.some((key: string) => {
    return schema._cached.shape[key]._def.typeName === 'ZodObject'
  })
  if (isNested) {
    const parseFailure = parseResult.error.format()
    appendToErrors({ errors, parseFailure })
  } else {
    const parseFailure = parseResult.error.flatten()
    if (parseFailure.formErrors.length) {
      errors._global = parseFailure.formErrors.join(' • ')
    }
    for (const [fieldName, fieldErrorList] of Object.entries(
      parseFailure.fieldErrors
    )) {
      errors[fieldName] = (fieldErrorList as string[]).join(' • ')
    }
  }
  return { failure: { errors } }
}
