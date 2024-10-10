import type { Ingredients, Steps } from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import { SingletonFormCancelButton, SingletonFormSubmitButton } from './buttons'
import { CheckIcon, UpDownIcon, TrashIcon } from '~/components/icons'
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
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { UUID } from '~/utilities/zod/common'
import { Container } from './containers'
import './forms.css'

const log = logger({ name: '@/app/components/forms.tsx', level: 2 })
log.debug('logger instantiated')

export const Checkbox = ({ checked }: { checked: boolean }) => (
  <button
    type="button"
    className={`
        inline-flex justify-center items-center
        size-[2em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.5em]
        ring-inset ring-2
        [transition-property:background-color,box-shadow,opacity]
        duration-200 ease-out
        text-zinc-200
        focus:ring-yellow-400 focus:outline-none
        active:transition-none        
        ${
          checked
            ? `
              border-cyan-500 ring-cyan-800
              bg-cyan-800
              disabled:opacity-50 active:bg-cyan-500`
            : `
              border-zinc-500 ring-zinc-800
              bg-zinc-800
              disabled:opacity-50 active:bg-zinc-500`
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
  handleToggle: (s: string) => void
  disabled?: boolean
  error?: string
}) => (
  <fieldset
    disabled={disabled}
    className="flex items-center gap-x-[1em]"
  >
    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
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
  value,
  handleChange,
  error,
}: {
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
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
      value={value}
      onChange={handleChange}
      className={`
        block
        w-full
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.5em]
        py-[0.25em] px-[0.5em]
        ring-inset ring-2
        transition-shadow duration-200 ease-out
        ring-yellow-950
        bg-yellow-950
        focus:ring-yellow-400 focus:outline-none
        active:transition-none   
        ${
          error
            ? `border-red-500 text-red-200`
            : `border-yellow-700 text-zinc-200`
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
  value,
  handleChange,
  error,
}: {
  fieldName: string
  label: string
  placeholder?: string
  rows?: number
  required?: boolean
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
        value={value}
        onChange={handleChange}
        className={`
          block
          w-full
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          border-2 sm:border-[3px] lg:border-4
          rounded-[0.5em]
          py-[0.25em] px-[0.5em]
          ring-inset ring-2
          transition-shadow duration-200 ease-out
          ring-yellow-950
          bg-yellow-950
          focus:ring-yellow-400 focus:outline-none
          active:transition-none 
          ${
            error
              ? `border-red-500 text-red-200`
              : `border-yellow-700 text-zinc-200`
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
      <div
        className={`
          flex items-center
          w-[18em]
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          rounded-[0.5em]
        `}
      >
        <input
          id="yieldAmtQtyInput"
          type="text"
          name="yieldAmtQty"
          value={value.qty}
          onChange={handleChange}
          className={`
            w-[6em]
            border-2 sm:border-[3px] lg:border-4
            rounded-l-[0.5em]
            py-[0.25em] px-[0.5em]
            ring-inset ring-2
            transition-shadow duration-200 ease-out
            border-yellow-700 ring-yellow-950
            bg-yellow-950 text-zinc-200
            focus:ring-yellow-400 focus:outline-none
            active:transition-none
          `}
        />
        <select
          id="yieldAmtUnitInput"
          name="yieldAmtUnit"
          value={value.unit}
          onChange={handleChange}
          className={`
            h-full w-[12em]
            border-2 sm:border-[3px] lg:border-4
            rounded-r-[0.5em]
            py-[0.25em] px-[0.5em]
            ring-inset ring-2
            transition-shadow duration-200 ease-out
            border-yellow-700 ring-yellow-950
            bg-yellow-950 text-zinc-200
            focus:ring-yellow-400 focus:outline-none
            active:transition-none
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
      </div>
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
  value: { qty?: string; unit?: string; item?: string }
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
          className="
            ingredientFieldset
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
            py-[0.25em]
            rounded-[0.5em]            
          "
        >
          <div className="collapsingFields">
            <div className="inputGroup-1">
              <a
                {...provided.dragHandleProps}
                className="
                  inline-flex justify-center items-center
                  w-[2em]
                  border-2 sm:border-[3px] lg:border-4
                  rounded-tl-[0.5em] sm:rounded-bl-[0.5em]
                  ring-inset ring-2
                  transition-shadow duration-200 ease-out
                  border-yellow-700 ring-yellow-700 
                  bg-yellow-700 text-zinc-800
                  focus:ring-yellow-400 focus:outline-none
                  active:transition-none
                "
              >
                <UpDownIcon />
              </a>
              <input
                id={`ingredient_${lineNumber}_QtyInput`}
                type="text"
                name={`ingredient_${lineNumber}_Qty`}
                value={value.qty}
                onChange={handleChange}
                className={`
                  qtyInput
                  border-2 sm:border-[3px] lg:border-4
                  py-[0.25em] px-[0.5em]
                  ring-inset ring-2
                  transition-shadow duration-200 ease-out
                  border-yellow-700 ring-yellow-950
                  bg-yellow-950 text-zinc-200
                  focus:ring-yellow-400 focus:outline-none
                  active:transition-none
                `}
              />
              <select
                id={`ingredient_${lineNumber}_UnitInput`}
                name={`ingredient_${lineNumber}_Unit`}
                value={value.unit}
                onChange={handleChange}
                className={`
                  unitInput
                  border-2 sm:border-[3px] lg:border-4
                  px-[0.5em] py-[0.125em]
                  ring-inset ring-2
                  transition-shadow duration-200 ease-out
                  border-yellow-700 ring-yellow-950
                  bg-yellow-950 text-zinc-200
                  focus:ring-yellow-400 focus:outline-none
                  active:transition-none
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
            </div>
            <div className="inputGroup-2">
              <input
                id={`ingredient_${lineNumber}_ItemInput`}
                type="text"
                name={`ingredient_${lineNumber}_Item`}
                value={value.item}
                onChange={handleChange}
                className={`
                  itemInput
                  border-2 sm:border-[3px] lg:border-4
                  rounded-b-[0.5em] sm:rounded-b-none
                  py-[0.25em] px-[0.5em]
                  ring-inset ring-2
                  transition-shadow duration-200 ease-out
                  border-yellow-700 ring-yellow-950
                  bg-yellow-950 text-zinc-200
                  focus:ring-yellow-400 focus:outline-none
                  active:transition-none
                `}
              />
            </div>
            <button
              type="button"
              onClick={() => handleCancel('ingredients', +lineNumber - 1)}
              className={`
                deleteButton
                inline-flex justify-center items-center
                w-[2em]
                border-2 sm:border-[3px] lg:border-4
                rounded-tr-[0.5em] sm:rounded-br-[0.5em]
                ring-inset ring-2
                transition-shadow duration-200 ease-out
                border-red-700 ring-red-900
                bg-red-900 text-zinc-200
                focus:ring-yellow-400 focus:outline-none
                active:transition-none
              `}
            >
              <TrashIcon />
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
    {(provided, snapshot) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className={`
          py-[0.25em] px-[0.5em]
          rounded-[0.25em]
          ${snapshot.isDraggingOver ? 'bg-emerald-900/30' : 'bg-zinc-900/15'}
        `}
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
  value: string | undefined
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
        className="
          flex
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          py-[0.25em]
          rounded-[0.5em]
        "
      >
        <div className="grow flex">
          <a
            {...provided.dragHandleProps}
            className="
              inline-flex justify-center items-center
              w-[2em]
              border-2 sm:border-[3px] lg:border-4              
              rounded-l-[0.5em]
              ring-inset ring-2
              transition-shadow duration-200 ease-out
              border-yellow-700 ring-yellow-700 
              bg-yellow-700 text-zinc-800
              focus:ring-yellow-400 focus:outline-none
              active:transition-none
            "
          >
            <UpDownIcon />
          </a>
          <textarea
            id={`step_${lineNumber}_TextInput`}
            name={`step_${lineNumber}_Text`}
            value={value}
            rows={3}
            onChange={handleChange}
            className="
              grow
              border-2 sm:border-[3px] lg:border-4
              py-[0.25em] px-[0.5em]
              ring-inset ring-2
              transition-shadow duration-200 ease-out
              border-yellow-700 ring-yellow-950
              bg-yellow-950 text-zinc-200
              focus:ring-yellow-400 focus:outline-none
              active:transition-none
            "
          />
          <button
            type="button"
            onClick={() => handleCancel('steps', +lineNumber - 1)}
            className={`
              inline-flex justify-center items-center
              w-[2em]
              border-2 sm:border-[3px] lg:border-4
              rounded-r-[0.5em]
              ring-inset ring-2
              transition-shadow duration-200 ease-out
              border-red-700 ring-red-900
              bg-red-900 text-zinc-200
              focus:ring-yellow-400 focus:outline-none
              active:transition-none
            `}
          >
            <TrashIcon />
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
    {(provided, snapshot) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className={`
          py-[0.25em] px-[0.5em]
          rounded-[0.25em]
          ${snapshot.isDraggingOver ? 'bg-emerald-900/30' : 'bg-zinc-900/15'}
        `}
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

export const SingletonTextField = ({
  fieldName,
  label,
  placeholder = '',
  required = false,
  value,
  handleChange,
  error,
  activeFieldName,
  handleCancel,
  setActiveFieldName,
}: {
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
  value: string
  handleChange: (event: React.FormEvent) => void
  error?: string
  activeFieldName: string | null
  handleCancel: (event: React.MouseEvent) => void
  setActiveFieldName: (s: string) => void
}) => {
  return (
    <fieldset className="flex flex-col gap-y-[0.25em]">
      <div className="flex gap-x-[1em]">
        <FieldLabel htmlFor={`${fieldName}Input`}>{label}</FieldLabel>
        <FieldError>{error}</FieldError>
      </div>
      <Container
        flex
        className="gap-x-[0.5em]"
      >
        {activeFieldName === fieldName ? (
          <>
            <input
              id={`${fieldName}Input`}
              type="text"
              name={fieldName}
              placeholder={placeholder}
              required={required}
              value={value}
              onChange={handleChange}
              className={`
                grow
                drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
                border-2 sm:border-[3px] lg:border-4
                rounded-[0.5em]
                py-[0.25em] px-[0.5em]
                ring-inset ring-2
                transition-shadow duration-200 ease-out
                ring-yellow-950
                bg-yellow-950
                focus:ring-yellow-400 focus:outline-none
                active:transition-none   
                ${
                  error
                    ? `border-red-500 text-red-200`
                    : `border-yellow-700 text-zinc-200`
                }
              `}
            />
            <SingletonFormSubmitButton disabled={!!error} />
            <SingletonFormCancelButton handleCancel={handleCancel} />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveFieldName(fieldName)}
              className="
                grow flex items-center
                h-[2.25em] sm:h-[2.3333em] lg:h-[2.4em]
                border-2 sm:border-[3px] lg:border-4
                rounded-[0.5em]
                px-[0.5em]
                transition-colors duration-200 ease-out
                border-lime-200
                bg-lime-200
                focus:ring-2 focus:ring-yellow-400 focus:outline-none
                active:transition-none
              "
            >
              {value}
            </button>
            <div className="size-[2.25em] sm:size-[2.3333em] lg:size-[2.4em]" />
            <div className="size-[2.25em] sm:size-[2.3333em] lg:size-[2.4em]" />
          </>
        )}
      </Container>
    </fieldset>
  )
}

export const FormError = ({ children }: { children: React.ReactNode }) => {
  return (
    <strong className="min-h-[1.5em] block font-semibold text-center text-red-700">
      {children}
    </strong>
  )
}
