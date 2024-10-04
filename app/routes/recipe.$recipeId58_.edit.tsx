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
  YieldAmtFieldSet,
  IngredientFieldSet,
  ProcessFieldSet,
} from '~/components/forms'
import {
  FormSubmitButton,
  FormCancelButton,
  FormDeleteButton,
} from '~/components/buttons'
import { AddIcon } from '~/components/icons'

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
    yieldAmt: recipe.yieldAmt ?? { qty: 0, unit: '' },
    ingredients: recipe.ingredients.length
      ? recipe.ingredients
      : [{ qty: 0, unit: '', name: '' }],
    steps: recipe.steps.length ? recipe.steps : [''],
  })
  const [formErrors, setFormErrors] = useState<EditRecipeFormErrors>({})

  useEffect(() => {
    if (actionErrors) setFormErrors(actionErrors)
  }, [actionErrors])

  const handleChange = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    let newFormValues
    if (name.startsWith('yieldAmt')) {
      newFormValues = {
        ...formValues,
        yieldAmt: {
          qty: name === 'yieldAmtQty' ? +value : formValues.yieldAmt.qty,
          unit: name === 'yieldAmtUnit' ? value : formValues.yieldAmt.unit,
        },
      }
    } else if (name.startsWith('ingredient')) {
      const ingredients = [...formValues.ingredients]
      const ingredientIndex = +name.split('-')[1] - 1
      ingredients[ingredientIndex] = {
        qty: name.endsWith('Qty')
          ? +value
          : formValues.ingredients[ingredientIndex].qty,
        unit: name.endsWith('Unit')
          ? value
          : formValues.ingredients[ingredientIndex].unit,
        name: name.endsWith('Name')
          ? value
          : formValues.ingredients[ingredientIndex].name,
      }
      const lastIngredient = ingredients[ingredients.length - 1]
      if (lastIngredient.qty && lastIngredient.unit && lastIngredient.name) {
        ingredients.push({ qty: 0, unit: '', name: '' })
      }
      newFormValues = { ...formValues, ingredients }
    } else if (name.startsWith('step')) {
      const steps = [...formValues.steps]
      const stepIndex = +name.split('-')[1] - 1
      steps[stepIndex] = value
      const lastStep = steps[steps.length - 1]
      if (lastStep) {
        steps.push('')
      }
      newFormValues = { ...formValues, steps }
    } else {
      newFormValues = { ...formValues, [name]: value }
    }
    log.debug('newFormValues:\n', newFormValues)
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

  const handleCancelIngredient = (ingredientIndex: number) => {
    const ingredients = formValues.ingredients.filter(
      (value, index) => index !== ingredientIndex
    )
    const newFormValues = { ...formValues, ingredients }
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

  const handleCancelStep = (stepIndex: number) => {
    const steps = formValues.steps.filter((value, index) => index !== stepIndex)
    const newFormValues = { ...formValues, steps }
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

  const handleAddIngredient = () => {
    const newFormValues = {
      ...formValues,
      ingredients: [...formValues.ingredients, { qty: 0, unit: '', name: '' }],
    }
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

  const handleAddStep = () => {
    const newFormValues = {
      ...formValues,
      steps: [...formValues.steps, ''],
    }
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
        <Heading tag="h2" size="lg">
          Summary
        </Heading>
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
        <YieldAmtFieldSet
          value={formValues.yieldAmt}
          onChange={handleChange}
          error={formErrors.yieldAmt}
        />
        <Heading tag="h2" size="lg">
          Ingredients
        </Heading>
        {formValues.ingredients.map((ingredient, index) => (
          <IngredientFieldSet
            key={`ingredient-${index + 1}`}
            lineNumber={index + 1}
            value={ingredient}
            onChange={handleChange}
            onCancel={() => handleCancelIngredient(index)}
            error={formErrors.ingredients ? formErrors.ingredients[index] : ''}
          />
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className={`
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
          <span
            className=" text-lg sm:text-xl lg:text-2xl
            leading-normal sm:leading-normal lg:leading-normal"
          >
            <AddIcon />
          </span>
        </button>
        <Heading tag="h2" size="lg">
          Process
        </Heading>
        {formValues.steps.map((step, index) => (
          <ProcessFieldSet
            key={`step-${index + 1}`}
            lineNumber={index + 1}
            value={step}
            onChange={handleChange}
            onCancel={() => handleCancelStep(index)}
            error={formErrors.steps ? formErrors.steps[index] : ''}
          />
        ))}
        <button
          type="button"
          onClick={handleAddStep}
          className={`
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
          <span
            className=" text-lg sm:text-xl lg:text-2xl
            leading-normal sm:leading-normal lg:leading-normal"
          >
            <AddIcon />
          </span>
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
