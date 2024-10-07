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
  FormError,
  IngredientList,
  ProcessList,
} from '~/components/forms'
import { AddIcon } from '~/components/icons'
import {
  AddLineButton,
  FormSubmitButton,
  FormCancelButton,
  FormDeleteButton,
} from '~/components/buttons'
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd'
import { ClientOnly } from 'remix-utils/client-only'

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
      ? recipe.ingredients
      : [{ id: uuidv4(), data: { qty: '', unit: '', name: '' } }],
    steps: recipe.steps.length ? recipe.steps : [{ id: uuidv4(), data: '' }],
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
      const ingredientData = ingredients[ingredientIndex]
      ingredients[ingredientIndex] = {
        key: ingredientData.key,
        qty: name.endsWith('Qty') ? value : ingredientData.qty,
        unit: name.endsWith('Unit') ? value : ingredientData.unit,
        item: name.endsWith('Name') ? value : ingredientData.item,
      }
      const lastIngredientData = ingredients[ingredients.length - 1]
      if (
        lastIngredientData.qty &&
        lastIngredientData.unit &&
        lastIngredientData.item
      ) {
        ingredients.push({
          key: uuidv4(),
          qty: '',
          unit: '',
          item: '',
        })
      }
      newFormData = { ...formData, ingredients }
    } else if (name.startsWith('step')) {
      const steps = [...formData.steps]
      const stepIndex = +name.split('_')[1] - 1
      const stepData = steps[stepIndex]
      steps[stepIndex] = { key: stepData.key, text: value }
      const lastStepData = steps[steps.length - 1]
      if (lastStepData.text) steps.push({ key: uuidv4(), text: '' })
      newFormData = { ...formData, steps }
    } else {
      newFormData = { ...formData, [name]: value }
    }
    log.debug('newFormData:\n', newFormData)
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
        ? { key: uuidv4(), data: { qty: '', unit: '', name: '' } }
        : fieldGroupName === 'steps'
        ? { key: uuidv4(), data: '' }
        : null
    const newFieldGroupData = [...formData[fieldGroupName], newElement]
    const newFormData = { ...formData, [fieldGroupName]: newFieldGroupData }
    updateFormData(newFormData)
  }

  /* TODO: Use dnd type property to refactor these drop handlers into one. */
  const handleIngredientDrop: OnDragEndResponder = (result) => {
    const { destination, source } = result
    if (!destination) return
    if (destination.index === source.index) return
    const ingredients = [...formData.ingredients]
    const movedIngredient = ingredients[source.index]
    ingredients.splice(source.index, 1)
    ingredients.splice(destination.index, 0, movedIngredient)
    setFormData({ ...formData, ingredients })
  }

  const handleStepDrop: OnDragEndResponder = (result) => {
    const { destination, source } = result
    if (!destination) return
    if (destination.index === source.index) return
    const steps = [...formData.steps]
    const movedIngredient = steps[source.index]
    steps.splice(source.index, 1)
    steps.splice(destination.index, 0, movedIngredient)
    setFormData({ ...formData, steps })
  }

  log.debug('ingredients:\n', formData.ingredients)
  log.debug('steps:\n', formData.steps)

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
        />
        <Heading
          Tag="h2"
          size="xl"
          className="text-center"
        >
          Ingredients
        </Heading>
        <ClientOnly fallback={<div />}>
          {() => (
            <DragDropContext onDragEnd={handleIngredientDrop}>
              <IngredientList
                ingredients={formData.ingredients}
                handleChange={handleChange}
                handleCancel={handleCancel}
              />
            </DragDropContext>
          )}
        </ClientOnly>
        <AddLineButton handleAdd={() => handleAdd('ingredients')} />
        <Heading
          Tag="h2"
          size="xl"
          className="text-center"
        >
          Process
        </Heading>
        <ClientOnly fallback={<div />}>
          {() => (
            <DragDropContext onDragEnd={handleStepDrop}>
              <ProcessList
                steps={formData.steps}
                handleChange={handleChange}
                handleCancel={handleCancel}
              />
            </DragDropContext>
          )}
        </ClientOnly>
        <AddLineButton handleAdd={() => handleAdd('steps')} />
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
