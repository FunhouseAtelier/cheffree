import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type {
  EditRecipeForm,
  EditRecipeFormErrors,
} from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import { redirect } from '@remix-run/node'
import { requireAuthorizedToEditRecipe } from '~/services/auth.server'
import { useState, useEffect } from 'react'
import zodParse from '~/utilities/zod/parser'
import { editRecipeForm } from '~/utilities/zod/recipe'
import { updateRecipe } from '~/services/recipe.server'
import { MainContainer } from '~/components/containers'
import { Heading } from '~/components/typography'
import { Form, useLoaderData, useActionData } from '@remix-run/react'
import {
  FormError,
  TextFieldSet,
  TextAreaFieldSet,
  CheckboxFieldSet,
} from '~/components/forms'
import {
  FormSubmitButton,
  FormCancelButton,
  FormDeleteButton,
} from '~/components/buttons'

const log = logger({
  name: '@/app/routes/recipe.$recipeId58_.edit.tsx',
  level: 2,
})

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  const { success } = await requireAuthorizedToEditRecipe({ routeHandlerArgs })
  const { recipe } = success.data
  return { recipe }
}

export const action: ActionFunction = async (routeHandlerArgs) => {
  const { success, failure } = await updateRecipe({ routeHandlerArgs })
  if (success) throw redirect(`/recipe/${success.data.recipe.id58}`)
  return { actionErrors: failure.errors }
}

export default function EditRecipeRoute() {
  const { recipe } = useLoaderData<typeof loader>()
  const { actionErrors } = useActionData<typeof action>() ?? {}

  const [formValues, setFormValues] = useState<EditRecipeForm>({
    title: recipe.title ?? '',
    description: recipe.description ?? '',
    isPublished: recipe.isPublished,
  })
  const [formErrors, setFormErrors] = useState<EditRecipeFormErrors>({})

  useEffect(() => {
    if (actionErrors) setFormErrors(actionErrors)
  }, [actionErrors])

  const handleChange = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    const newFormValues = { ...formValues, [name]: value }
    setFormValues(newFormValues)
    const zodParseResult = zodParse({
      data: newFormValues,
      schema: editRecipeForm,
    })
    if (zodParseResult.success) {
      setFormErrors({})
    } else {
      setFormErrors(zodParseResult.failure.errors)
    }
  }

  const handleToggle = (fieldName: keyof EditRecipeForm) => {
    const newFormValues = { ...formValues, [fieldName]: !formValues[fieldName] }
    setFormValues(newFormValues)
    const zodParseResult = zodParse({
      data: newFormValues,
      schema: editRecipeForm,
    })
    if (zodParseResult.success) {
      setFormErrors({})
    } else {
      setFormErrors(zodParseResult.failure.errors)
    }
  }

  return (
    <MainContainer size="lg">
      <Heading className="text-center">Edit Recipe</Heading>
      <Form method="post" className="flex flex-col gap-y-[0.5em]">
        <CheckboxFieldSet
          fieldName="isPublished"
          label="Published"
          value={formValues.isPublished}
          onToggle={() => handleToggle('isPublished')}
        />
        <TextFieldSet
          fieldName="title"
          label="Title"
          placeholder="What is the recipe called?"
          required
          autoFocus
          value={formValues.title}
          onChange={handleChange}
          error={formErrors.title}
        />
        <TextAreaFieldSet
          fieldName="description"
          label="Description"
          placeholder="(optional) Write a brief description of the recipe. No life stories, please."
          rows={3}
          value={formValues.description}
          onChange={handleChange}
          error={formErrors.description}
        />
        <div className="flex gap-x-[1em]">
          <FormCancelButton to={`/recipe/${recipe.id58}`}>
            Cancel
          </FormCancelButton>
          <FormSubmitButton disabled={!!Object.keys(formErrors).length}>
            Save Changes
          </FormSubmitButton>
        </div>

        <FormError>{formErrors._global}</FormError>
      </Form>
      <Form
        action={`/recipe/${recipe.id58}/delete`}
        className="flex flex-col gap-y-[0.5em]"
      >
        <FormDeleteButton>Delete Recipe</FormDeleteButton>
      </Form>
    </MainContainer>
  )
}
