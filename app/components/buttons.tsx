import logger from '@funhouse-atelier/logger'
import { useLocation } from '@remix-run/react'
import { NavLink } from '@remix-run/react'
import {
  SignInButton,
  SignUpButton,
  UserButton as ClerkUserButton,
} from '@clerk/remix'
import { CheckIcon, XmarkIcon, EditDocumentIcon } from '~/components/icons'
import { Link } from '@remix-run/react'
import { Text } from './typography'
import { AddIcon } from '~/components/icons'

const log = logger({ name: '@/app/components/buttons.ts', level: 2 })

const customAuthPageRouteByAction = {
  signup: '/sign-up',
  login: '/log-in',
}
const customAuthPageRoutes = Object.values(customAuthPageRouteByAction)

export const NavButton = ({
  children,
  to,
  className,
}: {
  children: React.ReactNode
  to: string
  className?: string
}) => {
  /* Define a function that will make a conditional class list based on the `isActive` and `isPending` arguments passed to it by the Remix `<NavLink>` component via the `className` prop. This allows for the button to have different apparences based on the navigation status and whether the current route is the one the button navigates to. */
  const makeClassList = ({
    isActive,
    isPending,
  }: {
    isActive: boolean
    isPending: boolean
  }) => {
    return `
      drop-shadow-sm sm:drop-shadow lg:drop-shadow-md
      border-2
      rounded-[0.25em]
      px-[0.5em] py-[0.125em]
      ring-inset ring-2
      [transition-property:background-color,box-shadow]
      duration-200 ease-out
      border-emerald-500
      text-zinc-200
      active:transition-none
      focus:ring-yellow-400 focus:outline-none
      ${
        isActive
          ? 'ring-emerald-500 bg-emerald-500'
          : isPending
          ? 'ring-emerald-500/75 bg-emerald-500/75'
          : 'ring-emerald-800 bg-emerald-800 active:bg-emerald-500'
      }
      ${className ?? ''}
    `
  }
  return (
    /* Prefetch the resource when the button is visible in the viewport. */
    <NavLink
      to={to}
      prefetch="viewport"
      className={makeClassList}
    >
      {children}
    </NavLink>
  )
}

export const AccountSettingsButton = () => {
  return (
    /* Wrap the `<ClerkUserButton>` component in a div of the same fixed size to prevent layout shift when `<ClerkUserButton>` first renders. */
    <div className="size-8 sm:size-9 lg:size-10">
      <ClerkUserButton
        appearance={{
          elements: {
            userButtonTrigger:
              'focus:ring-2 focus:ring-yellow-400 focus:outline-none',
            avatarBox: 'size-8 sm:size-9 lg:size-10',
          },
        }}
      />
    </div>
  )
}

export const SignUpNavButton = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { pathname } = useLocation()
  /* If the current route is the sign up page or the log in page, render a regular navigation button. */
  if (customAuthPageRoutes.includes(pathname)) {
    return (
      <NavButton to={customAuthPageRouteByAction.signup}>{children}</NavButton>
    )
  }
  /* Otherwise render a button that will open the Clerk sign up modal. */
  return (
    <SignUpButton mode="modal">
      <button
        className={`
          drop-shadow-sm sm:drop-shadow lg:drop-shadow-md
          border-2
          rounded-[0.25em]
          px-[0.5em] py-[0.125em]
          ring-inset ring-2
          [transition-property:background-color,box-shadow]
          duration-200 ease-out 
          border-emerald-500 ring-emerald-800
          bg-emerald-800 text-zinc-200
          active:bg-emerald-500 active:transition-none
          focus:ring-yellow-400 focus:outline-none
          ${className ?? ''}
        `}
      >
        {children}
      </button>
    </SignUpButton>
  )
}

export const LogInNavButton = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { pathname } = useLocation()
  /* If the current route is the sign up page or the log in page, render a regular navigation button. */
  if (customAuthPageRoutes.includes(pathname)) {
    return (
      <NavButton to={customAuthPageRouteByAction.login}>{children}</NavButton>
    )
  }
  /* Otherwise render a button that will open the Clerk sign in modal. */
  return (
    <SignInButton mode="modal">
      <button
        className={`
          drop-shadow-sm sm:drop-shadow lg:drop-shadow-md
          border-2
          rounded-[0.25em]
          px-[0.5em] py-[0.125em]
          ring-inset ring-2
          [transition-property:background-color,box-shadow]
          duration-200 ease-out 
          border-emerald-500 ring-emerald-800
          bg-emerald-800 text-zinc-200
          active:bg-emerald-500 active:transition-none
          focus:ring-yellow-400 focus:outline-none
          ${className ?? ''}
        `}
      >
        {children}
      </button>
    </SignInButton>
  )
}

/* TODO: add pending UI when form is submitting to show the submission is being performed and to prevent multiple simultaneous submissions. */
export const FormSubmitButton = ({
  children,
  disabled,
  className,
}: {
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`
        text-lg sm:text-xl lg:text-2xl
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[1.25em]
        py-[0.5em] px-[1em]
        ring-inset ring-2
        text-center
        [transition-property:box-shadow,opacity]
        duration-200 ease-out
        border-emerald-500 ring-emerald-800
        bg-emerald-800 text-zinc-200
        disabled:opacity-50
        focus:ring-yellow-400 focus:outline-none
        ${className ?? ''}
      `}
    >
      {children}
    </button>
  )
}

export const FormCancelButton = ({
  children,
  disabled,
  to,
  className,
}: {
  children: React.ReactNode
  disabled?: boolean
  to: string
  className?: string
}) => {
  return (
    <Link
      to={to}
      className={`
        text-lg sm:text-xl lg:text-2xl
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[1.25em]
        py-[0.5em] px-[1em]
        ring-inset ring-2
        text-center
        [transition-property:box-shadow,opacity]
        duration-200 ease-out
        border-zinc-500 ring-zinc-800
        bg-zinc-800 text-zinc-200
        disabled:opacity-50
        focus:ring-yellow-400 focus:outline-none
        ${className ?? ''}
      `}
    >
      {children}
    </Link>
  )
}

export const FormDeleteButton = ({
  children,
  disabled,
  className,
}: {
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`
        text-lg sm:text-xl lg:text-2xl
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[1.25em]
        py-[0.5em] px-[1em]
        ring-inset ring-2
        text-center
        [transition-property:box-shadow,opacity]
        duration-200 ease-out
        border-red-700 ring-red-900
        bg-red-900 text-zinc-200
        disabled:opacity-50
        focus:ring-yellow-400 focus:outline-none
        ${className ?? ''}
      `}
    >
      {children}
    </button>
  )
}

/* TODO: add pending UI when form is submitting to show the submission is being performed and to prevent multiple simultaneous submissions. */
export const SingletonSubmitButton = ({
  disabled,
  className,
}: {
  disabled?: boolean
  className?: string
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`
        inline-flex justify-center items-center
        size-[2.25em] sm:size-[2.3333em] lg:size-[2.4em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.5em]
        ring-inset ring-2        
        [transition-property:box-shadow,opacity]
        duration-200 ease-out
        border-emerald-500 ring-emerald-800
        bg-emerald-800 text-zinc-200
        disabled:opacity-50
        focus:ring-yellow-400 focus:outline-none
        ${className ?? ''}
      `}
    >
      <Text size="lg">
        <CheckIcon />
      </Text>
    </button>
  )
}

/* TODO: add pending UI when form is submitting to show the submission is being performed and to prevent multiple simultaneous submissions. */
export const SingletonCancelButton = ({
  onClick,
  className,
}: {
  onClick: (event: React.MouseEvent) => void
  className?: string
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex justify-center items-center
        size-[2.25em] sm:size-[2.3333em] lg:size-[2.4em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.5em]
        ring-inset ring-2
        [transition-property:box-shadow,opacity]
        duration-200 ease-out
        border-zinc-500 ring-zinc-800
        bg-zinc-800 text-zinc-200
        focus:ring-yellow-400 focus:outline-none
        ${className ?? ''}
      `}
    >
      <Text size="lg">
        <XmarkIcon />
      </Text>
    </button>
  )
}

export const EditDocumentButton = ({
  to,
  className,
}: {
  to: string
  className?: string
}) => {
  return (
    <Link
      to={to}
      className={`
        text-base sm:text-lg lg:text-xl
        inline-flex justify-center items-center
        size-[2.25em] sm:size-[2.3333em] lg:size-[2.4em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.5em]
        ring-inset ring-2        
        [transition-property:box-shadow,opacity]
        duration-200 ease-out
        border-amber-500 ring-amber-800
        bg-amber-800 text-zinc-200
        disabled:opacity-50
        focus:ring-yellow-400 focus:outline-none
        ${className ?? ''}
      `}
      // className={`
      //   text-lg sm:text-xl lg:text-2xl
      //   leading-normal sm:leading-normal lg:leading-normal
      //   size-[2em]
      //   border-[0.125em] border-amber-500
      //   rounded-[0.25em]
      //   drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
      //   inline-flex items-center justify-center
      //   text-zinc-200 bg-amber-800/80
      //   hover:bg-amber-800 active:bg-amber-500 disabled:bg-amber-800/50
      //   transition-colors duration-200 ease-out active:transition-none
      //   ${className ?? ''}
      // `}
    >
      <Text size="lg">
        <EditDocumentIcon />
      </Text>
    </Link>
  )
}

export const AddLineButton = ({
  handleAdd,
}: {
  handleAdd: (event: React.MouseEvent) => void
}) => {
  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`
        inline-flex justify-center items-center
        size-[2.5em]
        ml-auto
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        border-2 sm:border-[3px] lg:border-4
        rounded-[0.5em]
        ring-inset ring-2
        transition-shadow duration-200 ease-out
        border-emerald-500 ring-emerald-800
        bg-emerald-800 text-zinc-200
        focus:ring-yellow-400 focus:outline-none
      `}
    >
      <Text size="lg">
        <AddIcon />
      </Text>
    </button>
  )
}
