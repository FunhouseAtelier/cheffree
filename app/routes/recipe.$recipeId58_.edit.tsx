import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type {
  EditRecipeFormData,
  EditRecipeFormErrors,
} from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import { requireAuthorizedToEditRecipe } from '~/services/auth.server'
import { updateRecipe } from '~/services/recipe.server'
import { redirect } from '@remix-run/node'
import { useLoaderData, useActionData } from '@remix-run/react'
import { useState, useEffect } from 'react'
import zodParse from '~/utilities/zod/parser'
import { editRecipeFormData } from '~/utilities/zod/recipe'
import { v4 as uuidv4 } from 'uuid'
import { useSubmit } from '@remix-run/react'

import { MainContainer } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import {
  CheckboxField,
  TextField,
  TextAreaField,
  YieldAmtField,
  IngredientField,
  ProcessFieldSet,
  FormError,
} from '~/components/forms'
import { AddIcon } from '~/components/icons'
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
  const { failure } = await updateRecipe({ routeHandlerArgs })
  if (!failure) throw redirect(`/recipe/${routeHandlerArgs.params.recipeId58}`)
  return { actionErrors: failure.errors }
}

export default function EditRecipeRoute() {
  const { recipe } = useLoaderData<typeof loader>()
  const { actionErrors } = useActionData<typeof action>() ?? {}
  const submit = useSubmit()

  const [formData, setFormData] = useState<EditRecipeFormData>({
    title: recipe.title ?? '',
    description: recipe.description ?? '',
    isPublished: recipe.isPublished,
    yieldAmt: recipe.yieldAmt ?? { qty: '', unit: '' },
    ingredients: recipe.ingredients.length
      ? recipe.ingredients.map((data: { [key: string]: string }) => ({
          id: uuidv4(),
          data,
        }))
      : [{ id: uuidv4(), data: { qty: '', unit: '', name: '' } }],
    steps: recipe.steps.length
      ? recipe.steps.map((data: { [key: string]: string }) => ({
          id: uuidv4(),
          data,
        }))
      : [{ id: uuidv4(), data: '' }],
  })
  const [formErrors, setFormErrors] = useState<EditRecipeFormErrors>({})

  useEffect(() => {
    if (actionErrors) setFormErrors(actionErrors)
  }, [actionErrors])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    submit(formData, { method: 'post', encType: 'application/json' })
  }

  const updateFormData = (newFormData: EditRecipeFormData) => {
    setFormData(newFormData)
    const { success, failure } = zodParse(newFormData, editRecipeFormData)
    if (success) setFormErrors({})
    else setFormErrors(failure.errors)
  }

  const handleToggle = (fieldName: 'isPublished') => {
    const newFormData = { ...formData, [fieldName]: !formData[fieldName] }
    updateFormData(newFormData)
  }

  const handleChange = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    let newFormData
    if (name.startsWith('yieldAmt')) {
      newFormData = {
        ...formData,
        yieldAmt: {
          qty: name === 'yieldAmtQty' ? value : formData.yieldAmt.qty,
          unit: name === 'yieldAmtUnit' ? value : formData.yieldAmt.unit,
        },
      }
    } else if (name.startsWith('ingredient')) {
      const ingredients = [...formData.ingredients]
      const ingredientIndex = +name.split('_')[1] - 1
      const ingredientData = ingredients[ingredientIndex].data
      ingredients[ingredientIndex].data = {
        qty: name.endsWith('Qty') ? value : ingredientData.qty,
        unit: name.endsWith('Unit') ? value : ingredientData.unit,
        name: name.endsWith('Name') ? value : ingredientData.name,
      }
      const lastIngredientData = ingredients[ingredients.length - 1].data
      if (
        lastIngredientData.qty &&
        lastIngredientData.unit &&
        lastIngredientData.name
      ) {
        ingredients.push({
          id: uuidv4(),
          data: { qty: '', unit: '', name: '' },
        })
      }
      newFormData = { ...formData, ingredients }
    } else if (name.startsWith('step')) {
      const steps = [...formData.steps]
      const stepIndex = +name.split('_')[1] - 1
      steps[stepIndex].data = value
      const lastStep = steps[steps.length - 1]
      if (lastStep.data) steps.push({ id: uuidv4(), data: '' })
      newFormData = { ...formData, steps }
    } else {
      newFormData = { ...formData, [name]: value }
    }
    updateFormData(newFormData)
  }

  const handleCancel = (
    fieldGroupName: 'ingredients' | 'steps',
    canceledIndex: number
  ) => {
    const newFieldGroupData = formData[fieldGroupName].filter(
      (value, index) => index !== canceledIndex
    )
    const newFormData = { ...formData, [fieldGroupName]: newFieldGroupData }
    updateFormData(newFormData)
  }

  const handleAdd = (fieldGroupName: 'ingredients' | 'steps') => {
    const newElement =
      fieldGroupName === 'ingredients'
        ? { id: uuidv4(), data: { qty: '', unit: '', name: '' } }
        : fieldGroupName === 'steps'
        ? { id: uuidv4(), data: '' }
        : null
    const newFieldGroupData = [...formData[fieldGroupName], newElement]
    const newFormData = { ...formData, [fieldGroupName]: newFieldGroupData }
    updateFormData(newFormData)
  }

  return (
    <MainContainer size="lg">
      <Heading className="text-center">Edit Recipe</Heading>
      <Form
        onSubmit={handleSubmit}
        className="my-[0.5em] flex flex-col gap-y-[0.5em]"
      >
        <Heading
          Tag="h2"
          size="xl"
          className="text-center"
        >
          Summary
        </Heading>
        <CheckboxField
          fieldName="isPublished"
          label="Published"
          value={formData.isPublished}
          handleToggle={handleToggle}
          error={formErrors.isPublished}
        />
        <TextField
          fieldName="title"
          label="Title"
          placeholder="What is the recipe called?"
          required
          autoFocus={!formData.title}
          value={formData.title}
          handleChange={handleChange}
          error={formErrors.title}
        />
        <TextAreaField
          fieldName="description"
          label="Description"
          placeholder="(optional) Write a brief description of the recipe. No life stories, please."
          rows={3}
          value={formData.description}
          handleChange={handleChange}
          error={formErrors.description}
        />
        <YieldAmtField
          value={formData.yieldAmt}
          handleChange={handleChange}
          error={formErrors.yieldAmt}
        />
        <Heading
          Tag="h2"
          size="xl"
          className="text-center"
        >
          Ingredients
        </Heading>
        {formData.ingredients.map((ingredient, index) => {
          log.debug('ingredient:\n', ingredient)
          return (
            <IngredientField
              key={ingredient.id}
              lineNumber={index + 1}
              value={ingredient.data}
              handleChange={handleChange}
              handleCancel={handleCancel}
            />
          )
        })}
        <button
          type="button"
          onClick={() => handleAdd('ingredients')}
          tabIndex={-1}
          className={`
            ml-auto my-[0.25em]
            size-[2.125em]
            border-[0.125em] border-emerald-500
            rounded-[0.25em]
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
            flex items-center justify-center
            text-zinc-200 bg-emerald-800/80
            hover:bg-emerald-800 active:bg-emerald-500 disabled:bg-emerald-800/50
            transition-colors duration-300 ease-out active:transition-none
          `}
        >
          <Text size="lg">
            <AddIcon />
          </Text>
        </button>
        <Heading
          Tag="h2"
          size="xl"
          className="text-center"
        >
          Process
        </Heading>
        {formData.steps.map((step, index) => (
          <ProcessFieldSet
            key={step.id}
            lineNumber={index + 1}
            value={step.data}
            handleChange={handleChange}
            handleCancel={handleCancel}
          />
        ))}
        <button
          type="button"
          onClick={() => handleAdd('steps')}
          tabIndex={-1}
          className={`
            ml-auto my-[0.25em]
            size-[2.125em]
            border-[0.125em] border-emerald-500
            rounded-[0.25em]
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
            flex items-center justify-center
            text-zinc-200 bg-emerald-800/80
            hover:bg-emerald-800 active:bg-emerald-500 disabled:bg-emerald-800/50
            transition-colors duration-300 ease-out active:transition-none
          `}
        >
          <Text size="lg">
            <AddIcon />
          </Text>
        </button>
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
