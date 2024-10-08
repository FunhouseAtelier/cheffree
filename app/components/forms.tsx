import type { Ingredients, Steps } from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import {
  AddLineButton,
  FormCancelIconButton,
  FormSubmitIconButton,
} from './buttons'
import { CheckIcon, UpDownIcon, TrashIcon } from '~/components/icons'
import { Text } from './typography'
import {
  imperialWeightUnitOptions,
  imperialVolumeUnitOptions,
  imperialLengthUnitOptions,
  metricWeightUnitOptions,
  metricVolumeUnitOptions,
  metricLengthUnitOptions,
  yieldUnitOptions,
  ingredientUnitOptions,
} from '~/libraries/units'
import { FieldError, FieldLabel } from './typography'
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from '@hello-pangea/dnd'
import { AddIcon } from '~/components/icons'
import { UUID } from '~/utilities/zod/common'

const log = logger({ name: '@/app/components/forms.tsx', level: 2 })

export const Checkbox = ({ checked }: { checked: boolean }) => (
  <button
    type="button"
    className={`
        inline-flex items-center justify-center
        size-[1.75em]
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.25em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        transition-colors duration-300 ease-out active:transition-none
        text-zinc-200
        ${
          checked
            ? `
              bg-cyan-800/80 border-cyan-500
              disabled:bg-cyan-800/50
              hover:bg-cyan-800 
              active:bg-cyan-500`
            : `
              bg-zinc-800/80 border-zinc-500
              disabled:bg-zinc-800/50
              hover:bg-zinc-800
              active:bg-zinc-500`
        }
      `}
  >
    {checked && <CheckIcon />}
  </button>
)

export const CheckboxField = ({
  fieldName,
  label,
  value,
  handleToggle,
  disabled = false,
  error,
}: {
  fieldName: string
  label: string
  value: boolean
  handleToggle: (a: any) => void
  disabled?: boolean
  error?: string
}) => (
  <fieldset
    disabled={disabled}
    className="flex items-center gap-x-[1em]"
  >
    <span
      onClick={() => handleToggle(fieldName)}
      className={`inline-flex items-center gap-x-[0.5em] ${
        disabled ? '' : 'cursor-pointer'
      }`}
    >
      <Checkbox checked={value} />
      <span
        className={`font-bold ${
          value && !disabled
            ? 'text-zinc-800'
            : !value && disabled
            ? 'text-zinc-400'
            : 'text-zinc-600'
        }`}
      >
        {label}
      </span>
    </span>
    <FieldError>{error}</FieldError>
  </fieldset>
)

export const TextField = ({
  fieldName,
  label,
  placeholder = '',
  required = false,
  autoFocus = false,
  value,
  handleChange,
  error,
}: {
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
  autoFocus?: boolean
  value: string
  handleChange: (event: React.FormEvent) => void
  error?: string
}) => (
  <fieldset className="flex flex-col gap-y-[0.25em]">
    <div className="flex gap-x-[1em]">
      <FieldLabel htmlFor={`${fieldName}Input`}>{label}</FieldLabel>
      <FieldError>{error}</FieldError>
    </div>
    <input
      id={`${fieldName}Input`}
      type="text"
      name={fieldName}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      value={value}
      onChange={handleChange}
      className={`
        block
        w-full
        py-[0.25em] px-[0.5em]
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.5em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        transition-colors duration-300 ease-out
        bg-yellow-950
        focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none        
        ${
          error
            ? `
              text-red-200 border-red-400 
              ring-1 sm:ring-2 lg:ring ring-red-600`
            : `
              text-zinc-200 border-yellow-700 `
        }
      `}
    />
  </fieldset>
)

export const TextAreaField = ({
  fieldName,
  label,
  placeholder = '',
  rows = 3,
  required = false,
  autoFocus = false,
  value,
  handleChange,
  error,
}: {
  fieldName: string
  label: string
  placeholder?: string
  rows?: number
  required?: boolean
  autoFocus?: boolean
  value: string
  handleChange: (event: React.FormEvent) => void
  error?: string
}) => {
  return (
    <fieldset className="flex flex-col gap-y-[0.25em]">
      <div className="flex gap-x-[1em]">
        <FieldLabel htmlFor={`${fieldName}Input`}>{label}</FieldLabel>
        <FieldError>{error}</FieldError>
      </div>
      <textarea
        id={`${fieldName}Input`}
        name={fieldName}
        placeholder={placeholder}
        rows={rows}
        required={required}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        className={`
          block
          w-full
          py-[0.25em] px-[0.5em]
          border-2 sm:border-[3px] lg:border-4
          rounded-[0.5em]
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          transition-colors duration-300 ease-out                    
          bg-yellow-950
          focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
          ${
            error
              ? `
                text-red-200 border-red-400
                ring-1 sm:ring-2 lg:ring ring-red-600`
              : `
                text-zinc-200 border-yellow-700`
          }
        `}
      />
    </fieldset>
  )
}

export const YieldAmtField = ({
  value,
  handleChange,
}: {
  value: { qty?: string; unit?: string }
  handleChange: (event: React.FormEvent) => void
}) => {
  const options = [
    ...yieldUnitOptions,
    ...imperialWeightUnitOptions,
    ...metricWeightUnitOptions,
    ...imperialVolumeUnitOptions,
    ...metricVolumeUnitOptions,
    ...imperialLengthUnitOptions,
    ...metricLengthUnitOptions,
  ]
  return (
    <fieldset className="flex flex-col gap-y-[0.25em]">
      <FieldLabel htmlFor="yieldAmtQtyInput">Yield</FieldLabel>
      <span
        className={`
          w-[18em]
          rounded-[0.5em]          
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        `}
      >
        <input
          id="yieldAmtQtyInput"
          type="text"
          name="yieldAmtQty"
          value={value.qty}
          onChange={handleChange}
          className={`
            inline-flex items-center
            h-[2.25rem] sm:h-[2.625rem] lg:h-[3rem]
            w-[6em]
            px-[0.5em]
            border-2 sm:border-[3px] lg:border-4
            rounded-l-[0.5em]
            transition-colors duration-300 ease-out
            text-zinc-200 bg-yellow-950 border-yellow-700 
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
          `}
        />
        <select
          id="yieldAmtUnitInput"
          name="yieldAmtUnit"
          value={value.unit}
          onChange={handleChange}
          className={`
            inline-flex items-center
            h-[2.25rem] sm:h-[2.625rem] lg:h-[3rem]
            w-[12em]
            px-[0.5em] 
            border-2 sm:border-[3px] lg:border-4
            rounded-r-[0.5em]
            transition-colors duration-300 ease-out
            text-zinc-200 bg-yellow-950 border-yellow-700 
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
          `}
        >
          <option value="">(unit)</option>
          {options.map((option) => (
            <option
              key={option.label}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </fieldset>
  )
}

export const IngredientField = ({
  id,
  lineNumber,
  value,
  handleChange,
  handleCancel,
}: {
  id: UUID
  lineNumber: number
  value: { qty: string; unit: string; item: string }
  handleChange: (event: React.FormEvent) => void
  handleCancel: (
    fieldGroupName: 'ingredients' | 'steps',
    canceledIndex: number
  ) => void
}) => {
  const options = [
    ...ingredientUnitOptions,
    ...imperialWeightUnitOptions,
    ...metricWeightUnitOptions,
    ...imperialVolumeUnitOptions,
    ...metricVolumeUnitOptions,
    ...imperialLengthUnitOptions,
    ...metricLengthUnitOptions,
  ]
  return (
    <Draggable
      draggableId={id}
      index={lineNumber - 1}
    >
      {(provided) => (
        <fieldset
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="py-[0.125em] max-w-[344px] sm:max-w-full sm:flex drop-shadow sm:drop-shadow-md lg:drop-shadow-lg"
        >
          <div className="flex items-center">
            <span
              {...provided.dragHandleProps}
              className="
                inline-flex justify-center items-center
                h-[2.25rem] sm:h-[2.625rem] lg:h-[3rem]
                w-[1.25em]
                rounded-tl-[0.5em] sm:rounded-bl-[0.5em]
                bg-yellow-700
              "
            >
              <UpDownIcon />
            </span>
            <input
              id={`ingredient_${lineNumber}_QtyInput`}
              type="text"
              name={`ingredient_${lineNumber}_Qty`}
              value={value.qty}
              onChange={handleChange}
              className={`
                inline-flex items-center
                h-[2.25rem] sm:h-[2.625rem] lg:h-[3rem]
                w-[6em]
                px-[0.5em]
                border-2 sm:border-[3px] lg:border-4
                transition-colors duration-300 ease-out
                text-zinc-200
                bg-yellow-950 border-yellow-700 
                focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
              `}
            />
            <select
              id={`ingredient_${lineNumber}_UnitInput`}
              name={`ingredient_${lineNumber}_Unit`}
              value={value.unit}
              onChange={handleChange}
              className={`
                inline-flex items-center
                h-[2.25rem] sm:h-[2.625rem] lg:h-[3rem]
                w-[12em]
                px-[0.5em]
                border-2 sm:border-[3px] lg:border-4
                transition-colors duration-300 ease-out
                text-zinc-200
                bg-yellow-950 border-yellow-700 
                focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
              `}
            >
              <option value="">(unit)</option>
              {options.map((option) => (
                <option
                  key={option.label}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleCancel('ingredients', +lineNumber - 1)}
              tabIndex={-1}
              className={`
                inline-flex sm:hidden items-center justify-center
                size-[2.25rem]
                border-2 sm:border-[3px] lg:border-4
                rounded-tr-[0.5em]
                transition-colors duration-300 ease-out         
                text-zinc-200 bg-red-800/80 border-red-500
                hover:bg-red-800
              `}
            >
              <Text size="lg">
                <TrashIcon />
              </Text>
            </button>
          </div>
          <div className="w-full sm:flex">
            <input
              id={`ingredient_${lineNumber}_NameInput`}
              type="text"
              name={`ingredient_${lineNumber}_Name`}
              value={value.item}
              onChange={handleChange}
              className={`
                inline-flex items-center
                h-[2.25rem] sm:h-[2.625rem] lg:h-[3rem]
                w-full sm:grow
                px-[0.5em]
                border-2 sm:border-[3px] lg:border-4
                rounded-b-[0.5em] sm:rounded-b-none
                transition-colors duration-300 ease-out
                text-zinc-200 bg-yellow-950 border-yellow-700 
                focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
              `}
            />
            <button
              type="button"
              onClick={() => handleCancel('ingredients', +lineNumber - 1)}
              tabIndex={-1}
              className={`
                hidden sm:inline-flex items-center justify-center
                shrink-0 sm:size-[2.625rem] lg:size-[3rem]
                border-2 sm:border-[3px] lg:border-4
                rounded-r-[0.5em]
                transition-colors duration-300 ease-out
                text-zinc-200 bg-red-800/80 border-red-500
                hover:bg-red-800
              `}
            >
              <Text size="lg">
                <TrashIcon />
              </Text>
            </button>
          </div>
        </fieldset>
      )}
    </Draggable>
  )
}

export const IngredientList = ({
  ingredients,
  handleChange,
  handleCancel,
}: {
  ingredients: Ingredients
  handleChange: (event: React.FormEvent) => void
  handleCancel: (
    fieldGroupName: 'ingredients' | 'steps',
    canceledIndex: number
  ) => void
}) => (
  <Droppable droppableId="ingredientList">
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {ingredients.map((ingredient, index) => (
          <IngredientField
            key={ingredient.key}
            id={ingredient.key}
            lineNumber={index + 1}
            value={ingredient}
            handleChange={handleChange}
            handleCancel={handleCancel}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
)

export const ProcessField = ({
  id,
  lineNumber,
  value,
  handleChange,
  handleCancel,
}: {
  id: UUID
  lineNumber: number
  value: string
  handleChange: (event: React.FormEvent) => void
  handleCancel: (
    fieldGroupName: 'ingredients' | 'steps',
    canceledIndex: number
  ) => void
}) => (
  <Draggable
    draggableId={id}
    index={lineNumber - 1}
  >
    {(provided) => (
      <fieldset
        {...provided.draggableProps}
        ref={provided.innerRef}
        className="py-[0.125em] flex drop-shadow sm:drop-shadow-md lg:drop-shadow-lg"
      >
        <div className="grow flex">
          <span
            {...provided.dragHandleProps}
            className="
            inline-flex justify-center items-center
            h-full
            w-[1.25em]
            rounded-l-[0.5em]
            bg-yellow-700
          "
          >
            <UpDownIcon />
          </span>
          <textarea
            id={`step_${lineNumber}_TextInput`}
            name={`step_${lineNumber}_Text`}
            value={value}
            rows={3}
            onChange={handleChange}
            className="
            grow
            px-[0.5em] py-[0.25em]
            border-2 sm:border-[3px] lg:border-4
            transition-colors duration-300 ease-out
            text-zinc-200 bg-yellow-950 border-yellow-700
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
          "
          />
          <button
            type="button"
            onClick={() => handleCancel('steps', +lineNumber - 1)}
            tabIndex={-1}
            className={`
            inline-flex items-center justify-center
            h-full
            w-[2.25rem] sm:w-[2.625rem] lg:w-[3rem]
            border-2 sm:border-[3px] lg:border-4
            rounded-r-[0.5em]
            transition-colors duration-300 ease-out          
            text-zinc-200 bg-red-800/80 border-red-500
            hover:bg-red-800         
          `}
          >
            <Text size="lg">
              <TrashIcon />
            </Text>
          </button>
        </div>
      </fieldset>
    )}
  </Draggable>
)

export const ProcessList = ({
  steps,
  handleChange,
  handleCancel,
}: {
  steps: Steps
  handleChange: (event: React.FormEvent) => void
  handleCancel: (
    fieldGroupName: 'ingredients' | 'steps',
    canceledIndex: number
  ) => void
}) => (
  <Droppable droppableId="processList">
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {steps.map((step, index) => (
          <ProcessField
            key={step.key}
            id={step.key}
            lineNumber={index + 1}
            value={step.text}
            handleChange={handleChange}
            handleCancel={handleCancel}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
)

/*  */

export const SingletonTextFieldSet = ({
  fieldName,
  label,
  placeholder = '',
  required = false,
  autoFocus = false,
  value,
  onChange,
  error,
  activeFieldName,
  onCancel,
  setActiveFieldName,
}: {
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
  autoFocus?: boolean
  value: string
  onChange: (event: React.FormEvent) => void
  error?: string
  activeFieldName: string | null
  onCancel: (event: React.MouseEvent) => void
  setActiveFieldName: Function
}) => {
  return (
    <fieldset>
      <div
        className="
          text-sm sm:text-base lg:text-lg
          leading-normal sm:leading-normal lg:leading-normal
          flex gap-x-[1em]
          font-semibold
        "
      >
        <label htmlFor={`${fieldName}Input`}>{label}</label>
        <strong className="font-semibold text-red-700">{error}</strong>
      </div>
      <div className="flex my-[0.25em] gap-x-[0.5em]">
        {activeFieldName === fieldName ? (
          <>
            <input
              id={`${fieldName}Input`}
              type="text"
              name={fieldName}
              placeholder={placeholder}
              required={required}
              autoFocus={autoFocus}
              value={value}
              onChange={onChange}
              className="
                rounded-[0.25em]
                px-[0.5em]
                grow flex items-center
                text-zinc-200
                bg-yellow-950
                drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
              "
            />
            <FormSubmitIconButton disabled={!!error} />
            <FormCancelIconButton onClick={onCancel} />
          </>
        ) : (
          <>
            <div
              onClick={() => setActiveFieldName(fieldName)}
              className="
                flex items-center grow px-[0.5em] h-9 sm:h-10 lg:h-12 rounded-[0.25em] bg-yellow-300
              "
            >
              {value}
            </div>
            <div className="size-9 sm:size-10 lg:size-12" />
            <div className="size-9 sm:size-10 lg:size-12" />
          </>
        )}
      </div>
    </fieldset>
  )
}

export const FormError = ({ children }: { children: React.ReactNode }) => {
  return (
    <strong className="min-h-[1.625em] block font-semibold text-center text-red-700">
      {children}
    </strong>
  )
}
