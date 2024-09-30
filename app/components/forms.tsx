import { FormCancelIconButton, FormSubmitIconButton } from './buttons'

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
      <label
        htmlFor={`${fieldName}Input`}
        className="
          text-sm sm:text-base lg:text-lg
          leading-normal sm:leading-normal lg:leading-normal
          block
          font-semibold
        "
      >
        {label}
      </label>
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
      <strong
        className="
          text-sm sm:text-base lg:text-lg
          leading-normal sm:leading-normal lg:leading-normal
          block min-h-[1.625em]
          text-center
          font-semibold
          text-red-700
        "
      >
        {error}
      </strong>
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
      <label
        htmlFor={`${fieldName}Input`}
        className="
          text-sm sm:text-base lg:text-lg
          leading-normal sm:leading-normal lg:leading-normal
          block
          font-semibold
        "
      >
        {label}
      </label>
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
            <FormSubmitIconButton error={error} />
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
      <strong
        className="
          text-sm sm:text-base lg:text-lg
          leading-normal sm:leading-normal lg:leading-normal
          block min-h-[1.625em]
          text-center
          font-semibold
          text-red-700
        "
      >
        {error}
      </strong>
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
