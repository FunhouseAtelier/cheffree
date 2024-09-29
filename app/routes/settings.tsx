import type { ActionFunction } from '@remix-run/node'
import type {
  AppSettingsForm,
  AppSettingsFormErrors,
  BasicUserData,
} from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import { updateMe } from '~/services/user.server'
import { useState, useEffect } from 'react'
import { useRouteLoaderData, useActionData } from '@remix-run/react'
import { appSettingsFormSchema } from '~/utilities/zod/user'
import { MainContainer, Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import { SingletonTextFieldSet } from '~/components/forms'

const log = logger({ name: '@app/routes/settings.tsx', level: 2 })

export const action: ActionFunction = async (actionFunctionArgs) => {
  const formData = await actionFunctionArgs.request.formData()
  const updates = Object.fromEntries(formData)
  const updateMeResult = await updateMe({ actionFunctionArgs, updates })
  return { actionErrors: updateMeResult.failure?.errors }
}

export default function AppSettingsRoute() {
  const { me } = useRouteLoaderData<{ me: BasicUserData }>('root') ?? {}
  const { actionErrors } = useActionData<typeof action>() ?? {}

  const [activeFieldName, setActiveFieldName] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<AppSettingsForm>({
    displayName: '',
  })
  const [formErrors, setFormErrors] = useState<AppSettingsFormErrors>({})

  useEffect(() => {
    if (me) setFormValues({ ...formValues, displayName: me.displayName })
  }, [me])

  useEffect(() => {
    if (actionErrors) {
      setFormErrors(actionErrors)
      setActiveFieldName(Object.keys(actionErrors)[0])
    }
  }, [actionErrors])

  const handleChange = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    const newFormValues = { ...formValues, [name]: value }
    setFormValues(newFormValues)
    /* TODO: refactor Zod parsing into a utility function. */
    const parseResult = appSettingsFormSchema.safeParse(newFormValues)
    log.debug(parseResult)
    if (parseResult.success) {
      setFormErrors({})
    } else {
      const parseErrors = parseResult.error.format()
      const newFormErrors: AppSettingsFormErrors = {}
      for (const inputName in parseErrors) {
        if (inputName !== '_errors') {
          const inputError =
            parseErrors[inputName as keyof AppSettingsForm] ?? null
          if (inputError) {
            newFormErrors[inputName as keyof AppSettingsFormErrors] =
              parseErrors[inputName as keyof AppSettingsForm]?._errors.join(
                ' • '
              )
          }
        }
      }
      setFormErrors(newFormErrors)
    }
  }

  const handleCancel = () => {
    setActiveFieldName(null)
    setFormValues({ displayName: me?.displayName ?? '' })
    setFormErrors({})
  }

  const handleSubmit = () => {
    setActiveFieldName(null)
  }

  return (
    <MainContainer>
      <Heading className="text-center">App Settings</Heading>
      <Text tag="p">Click on a field to edit the value.</Text>
      <Container size="sm">
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-[0.125em]"
        >
          <SingletonTextFieldSet
            fieldName="displayName"
            label="Display Name"
            placeholder="What do you want to be called?"
            required
            autoFocus
            value={formValues.displayName}
            onChange={handleChange}
            error={formErrors.displayName}
            activeFieldName={activeFieldName}
            onCancel={handleCancel}
            setActiveFieldName={setActiveFieldName}
          />
        </Form>
      </Container>
    </MainContainer>
  )
}
