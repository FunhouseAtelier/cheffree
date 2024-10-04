import {
  CheckedButton,
  FormCancelIconButton,
  FormSubmitIconButton,
  UncheckedButton,
} from './buttons'
import { XmarkIcon } from '~/components/icons'
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

export const TextFieldSet = ({
  fieldName,
  label,
  placeholder = '',
  required = false,
  autoFocus = false,
  value,
  onChange,
  error,
}: {
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
  autoFocus?: boolean
  value: string
  onChange: (event: React.FormEvent) => void
  error?: string
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
          my-[0.25em]
          w-full
          rounded-[0.25em]
          px-[0.5em] py-[0.25em]
          text-zinc-200
          bg-amber-950
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          block
        "
      />
    </fieldset>
  )
}

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
                bg-amber-950
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
                flex items-center grow px-[0.5em] h-9 sm:h-10 lg:h-12 rounded-[0.25em] bg-amber-300
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

export const TextAreaFieldSet = ({
  fieldName,
  label,
  placeholder = '',
  rows = 6,
  required = false,
  autoFocus = false,
  value,
  onChange,
  error,
}: {
  fieldName: string
  label: string
  placeholder?: string
  rows?: number
  required?: boolean
  autoFocus?: boolean
  value: string
  onChange: (event: React.FormEvent) => void
  error?: string
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
      <textarea
        id={`${fieldName}Input`}
        name={fieldName}
        placeholder={placeholder}
        rows={rows}
        required={required}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        className="
          my-[0.25em]
          w-full
          rounded-[0.25em]
          px-[0.5em] py-[0.25em]
          text-zinc-200
          bg-amber-950
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          block
        "
      />
    </fieldset>
  )
}

export const CheckboxFieldSet = ({
  fieldName,
  label,
  value,
  onToggle,
  error,
}: {
  fieldName: string
  label: string
  value: boolean
  onToggle: () => void
  error?: string
}) => {
  return (
    <fieldset>
      <input
        id={`${fieldName}Input`}
        type="hidden"
        name={fieldName}
        value={value ? 'checked' : ''}
      />
      <div
        className="
          text-base sm:text-lg lg:text-xl
          leading-normal sm:leading-normal lg:leading-normal
          flex items-center gap-x-[0.5em]
          font-semibold
        "
      >
        {value ? (
          <CheckedButton onToggle={onToggle} />
        ) : (
          <UncheckedButton onToggle={onToggle} />
        )}
        <label htmlFor={`${fieldName}Input`}>{label}</label>
        <strong className="font-semibold text-red-700">{error}</strong>
      </div>
    </fieldset>
  )
}

export const YieldAmtFieldSet = ({
  value,
  onChange,
  error,
}: {
  value: { qty?: number; unit?: string }
  onChange: (event: React.FormEvent) => void
  error?: string
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
      <div
        className="
          text-sm sm:text-base lg:text-lg
          leading-normal sm:leading-normal lg:leading-normal
          flex gap-x-[1em]
          font-semibold
        "
      >
        <label htmlFor="yieldAmtQtyInput">Yield</label>
        <strong className="font-semibold text-red-700">{error}</strong>
      </div>
      <input
        id="yieldAmtQtyInput"
        type="number"
        name="yieldAmtQty"
        value={value.qty || ''}
        onChange={onChange}
        className="
          my-[0.25em]
          w-[6em]
          rounded-l-[0.25em]
          px-[0.5em] py-[0.25em]
          text-zinc-200
          bg-amber-950
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        "
      />
      <select
        id="yieldAmtUnitInput"
        name="yieldAmtUnit"
        value={value.unit}
        onChange={onChange}
        className="
          my-[0.25em]
          h-[2.125em] w-[9em]
          rounded-r-[0.25em]
          px-[0.5em] py-[0.25em]
          text-zinc-200
          bg-amber-950
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        "
      >
        <option value=""></option>
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </fieldset>
  )
}

// needs to stack on <sm viewports
export const IngredientFieldSet = ({
  lineNumber,
  value,
  onChange,
  onCancel,
  error,
}: {
  lineNumber: number
  value: { qty?: number; unit?: string; name?: string }
  onChange: (event: React.FormEvent) => void
  onCancel: () => void
  error?: string
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
    <fieldset>
      <div
        className="
          text-sm sm:text-base lg:text-lg
          leading-normal sm:leading-normal lg:leading-normal
          flex gap-x-[1em]
          font-semibold
        "
      >
        <label htmlFor={`ingredient-${lineNumber}-QtyInput`}>
          Ingredient # {lineNumber}
        </label>
        <strong className="font-semibold text-red-700">{error}</strong>
      </div>
      <div className="flex items-center">
        <input
          id={`ingredient-${lineNumber}-QtyInput`}
          type="number"
          name={`ingredient-${lineNumber}-Qty`}
          value={value.qty || ''}
          onChange={onChange}
          className="
            my-[0.25em]
            w-[6em]
            rounded-l-[0.25em]
            px-[0.5em] py-[0.25em]
            text-zinc-200
            bg-amber-950
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          "
        />
        <select
          id={`ingredient-${lineNumber}-UnitInput`}
          name={`ingredient-${lineNumber}-Unit`}
          value={value.unit}
          onChange={onChange}
          className="
            my-[0.25em]
            h-[2.125em] w-[9em]
            px-[0.5em] py-[0.25em]
            text-zinc-200
            bg-amber-950
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          "
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          id={`ingredient-${lineNumber}-NameInput`}
          type="text"
          name={`ingredient-${lineNumber}-Name`}
          value={value.name}
          onChange={onChange}
          className="
            my-[0.25em]
            rounded-r-[0.25em]
            px-[0.5em] py-[0.25em]
            grow
            text-zinc-200
            bg-amber-950
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          "
        />
        {lineNumber > 1 && (
          <button
            type="button"
            onClick={onCancel}
            className={`
              ml-[0.5em]
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
            <span
              className=" text-lg sm:text-xl lg:text-2xl
            leading-normal sm:leading-normal lg:leading-normal"
            >
              <XmarkIcon />
            </span>
          </button>
        )}
      </div>
    </fieldset>
  )
}

export const ProcessFieldSet = ({
  lineNumber,
  value,
  onChange,
  onCancel,
  error,
}: {
  lineNumber: number
  value: string
  onChange: (event: React.FormEvent) => void
  onCancel: () => void
  error?: string
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
        <label htmlFor={`step-${lineNumber}-TextInput`}>
          Step # {lineNumber}
        </label>
        <strong className="font-semibold text-red-700">{error}</strong>
      </div>
      <div className="flex items-center">
        <textarea
          id={`step-${lineNumber}-TextInput`}
          name={`step-${lineNumber}-Text`}
          value={value}
          rows={3}
          onChange={onChange}
          className="
            my-[0.25em]
            rounded-[0.25em]
            px-[0.5em] py-[0.25em]
            grow
            text-zinc-200
            bg-amber-950
            drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          "
        />
        {lineNumber > 1 && (
          <button
            type="button"
            onClick={onCancel}
            className={`
              ml-[0.5em]
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
            <span
              className=" text-lg sm:text-xl lg:text-2xl
            leading-normal sm:leading-normal lg:leading-normal"
            >
              <XmarkIcon />
            </span>
          </button>
        )}
      </div>
    </fieldset>
  )
}
