import { FormCancelIconButton, FormSubmitIconButton } from './buttons'
import { CheckIcon, XmarkIcon } from '~/components/icons'
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

export const Checkbox = ({ checked }: { checked: boolean }) => (
  <button
    type="button"
    className={`
        size-[1.5em]
        border-[0.125em]
        rounded-[0.25em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        inline-flex items-center justify-center
        text-zinc-200
        transition-colors duration-300 ease-out active:transition-none
        ${
          checked
            ? 'border-cyan-500 bg-cyan-800/80 hover:bg-cyan-800 active:bg-cyan-500 disabled:bg-cyan-800/50'
            : 'border-zinc-500 bg-zinc-800/80 hover:bg-zinc-800 active:bg-zinc-500 disabled:bg-zinc-800/50'
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
            ? 'text-zinc-500'
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
  <fieldset>
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
        mt-[0.25em] w-full
        px-[0.5em] py-[0.25em]
        border-[0.125em] rounded-[0.25em]
        block bg-yellow-950 
        focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        transition-colors duration-300 ease-out
        ${
          error
            ? 'border-red-400 text-red-200 ring-2 ring-red-600'
            : 'border-yellow-700 text-zinc-200'
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
    <fieldset>
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
          mt-[0.25em] w-full
          px-[0.5em] py-[0.25em]
          border-[0.125em] rounded-[0.25em]
          block bg-yellow-950
          focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          transition-colors duration-300 ease-out
          ${
            error
              ? 'border-red-400 text-red-200 ring-2 ring-red-600'
              : 'border-yellow-700 text-zinc-200'
          }
        `}
      />
    </fieldset>
  )
}

export const YieldAmtField = ({
  value,
  handleChange,
  error,
}: {
  value: { qty: string; unit: string }
  handleChange: (event: React.FormEvent) => void
  error?: { qty: string; unit: string }
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
    <fieldset>
      <div className="flex gap-x-[1em]">
        <FieldLabel htmlFor="yieldAmtQtyInput">Yield</FieldLabel>
        <FieldError>
          {error?.qty ?? ''}
          {error?.qty || error?.unit ? ' | ' : ''}
          {error?.unit ?? ''}
        </FieldError>
      </div>
      <div
        className={`
          mt-[0.25em]
          rounded-[0.25em]
          inline-block
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
            w-[6em]
            rounded-l-[0.25em]
            px-[0.5em] py-[0.25em]
            border-y-[0.125em] border-l-[0.125em] border-r-[0.0625em]
            bg-yellow-950 border-yellow-700 text-zinc-200
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
            transition-colors duration-300 ease-out
          `}
        />
        <select
          id="yieldAmtUnitInput"
          name="yieldAmtUnit"
          value={value.unit}
          onChange={handleChange}
          className={`
            w-[13.3125em] h-[2.222em]
            rounded-r-[0.25em]
            px-[0.5em] py-[0.25em]
            border-y-[0.125em] border-r-[0.125em] border-l-[0.0625em]
            bg-yellow-950 border-yellow-700 text-zinc-200'
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
            transition-colors duration-300 ease-out
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

// needs to stack on <sm viewports
export const IngredientField = ({
  lineNumber,
  value,
  handleChange,
  handleCancel,
}: {
  lineNumber: number
  value: { qty: string; unit: string; name: string }
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
    <fieldset className="my-[0.25em] max-w-[344px] sm:max-w-full sm:flex">
      <div className="flex items-center max-w-[344px] sm:max-w-full">
        <input
          id={`ingredient_${lineNumber}_QtyInput`}
          type="text"
          name={`ingredient_${lineNumber}_Qty`}
          value={value.qty}
          onChange={handleChange}
          className={`
            w-[6em] shrink-0
            px-[0.5em] py-[0.25em]
            rounded-tl-[0.25em] sm:rounded-l-[0.25em]
            border-y-[0.125em] border-l-[0.125em] border-r-[0.0625em]
            bg-yellow-950 border-yellow-700 text-zinc-200
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
            transition-colors duration-300 ease-out
          `}
        />
        <select
          id={`ingredient_${lineNumber}_UnitInput`}
          name={`ingredient_${lineNumber}_Unit`}
          value={value.unit}
          onChange={handleChange}
          className={`
            w-[13.3125em] h-[2.2em]
            px-[0.5em] py-[0.25em]
            border-y-[0.125em] border-l-[0.0625em] border-r-[0.125em] sm:border-r-[0.0625em]
            bg-yellow-950 border-yellow-700 text-zinc-200
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
            transition-colors duration-300 ease-out
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
            shrink-0 size-[2.2em]
            border-[0.125em] border-zinc-500
            rounded-tr-[0.25em]
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
            inline-flex sm:hidden items-center justify-center
            text-zinc-200 bg-zinc-800/80
            hover:bg-zinc-800 active:bg-zinc-500 disabled:bg-zinc-800/50
            transition-colors duration-300 ease-out active:transition-none
          `}
        >
          <Text size="lg">
            <XmarkIcon />
          </Text>
        </button>
      </div>
      <div className="w-full sm:flex">
        <input
          id={`ingredient_${lineNumber}_NameInput`}
          type="text"
          name={`ingredient_${lineNumber}_Name`}
          value={value.name}
          onChange={handleChange}
          className={`
            w-full sm:grow
            px-[0.5em] py-[0.25em]
            rounded-b-[0.25em] sm:rounded-b-none
            border-y-[0.125em] border-x-[0.125em] sm:border-l-[0.0625em] sm:border-r-[0.125em]
            bg-yellow-950 border-yellow-700 text-zinc-200
            focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
            transition-colors duration-300 ease-out
          `}
        />
        <button
          type="button"
          onClick={() => handleCancel('ingredients', +lineNumber - 1)}
          tabIndex={-1}
          className={`
            shrink-0 size-[2.2em]
            border-[0.125em] border-zinc-500
            rounded-tr-[0.25em] sm:rounded-br-[0.25em]
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
            hidden sm:inline-flex items-center justify-center
            text-zinc-200 bg-zinc-800/80
            hover:bg-zinc-800 active:bg-zinc-500 disabled:bg-zinc-800/50
            transition-colors duration-300 ease-out active:transition-none
          `}
        >
          <Text size="lg">
            <XmarkIcon />
          </Text>
        </button>
      </div>
    </fieldset>
  )
}

export const ProcessFieldSet = ({
  lineNumber,
  value,
  handleChange,
  handleCancel,
}: {
  lineNumber: number
  value: string
  handleChange: (event: React.FormEvent) => void
  handleCancel: (
    fieldGroupName: 'ingredients' | 'steps',
    canceledIndex: number
  ) => void
}) => {
  return (
    <fieldset className="my-[0.25em] flex gap-x-[0.5em] items-center">
      <textarea
        id={`step_${lineNumber}_TextInput`}
        name={`step_${lineNumber}_Text`}
        value={value}
        rows={3}
        onChange={handleChange}
        className="
          px-[0.5em] py-[0.25em]
          border-[0.125em] rounded-[0.25em]
          grow border-yellow-700 bg-yellow-950 text-zinc-200
          focus:bg-yellow-900 focus:border-yellow-400 focus:outline-none
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          transition-colors duration-300 ease-out
        "
      />
      <button
        type="button"
        onClick={() => handleCancel('steps', +lineNumber - 1)}
        tabIndex={-1}
        className={`
          size-[2.125em]
          border-[0.125em] border-zinc-500
          rounded-[0.25em]
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          flex items-center justify-center
          text-zinc-200 bg-zinc-800/80
          hover:bg-zinc-800 active:bg-zinc-500 disabled:bg-zinc-800/50
          transition-colors duration-300 ease-out active:transition-none
        `}
      >
        <Text size="lg">
          <XmarkIcon />
        </Text>
      </button>
    </fieldset>
  )
}

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
