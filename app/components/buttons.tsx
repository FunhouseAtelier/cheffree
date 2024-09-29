import logger from '@funhouse-atelier/logger'
import { useLocation } from '@remix-run/react'
import { NavLink } from '@remix-run/react'
import { SignInButton, SignUpButton, UserButton } from '@clerk/remix'
import { CheckIcon, XmarkIcon } from '~/components/icons'

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
      text-base sm:text-lg lg:text-xl
      leading-normal sm:leading-normal lg:leading-normal
      h-[2em]
      px-[0.5em]
      border-[0.125em] border-emerald-500
      rounded-[0.25em]
      drop-shadow-sm sm:drop-shadow lg:drop-shadow-md
      flex items-center justify-center
      text-zinc-200
      transition-colors duration-300 ease-out active:transition-none
      ${
        isActive
          ? 'bg-emerald-500/80'
          : isPending
          ? 'bg-emerald-500'
          : 'bg-emerald-800/80 hover:bg-emerald-800 active:bg-emerald-500'
      }
      ${className ?? ''}
    `
  }
  return (
    /* Prefetch the resource when the button is visible in the viewport. */
    <NavLink to={to} prefetch="viewport" className={makeClassList}>
      {children}
    </NavLink>
  )
}

export const AccountSettingsButton = () => {
  return (
    /* Wrap the Clerk `<UserButton>` component in a div of the same fixed size to prevent layout shift when `<UserButton>` first renders. */
    <div className="size-8 sm:size-9 lg:size-10">
      <UserButton
        appearance={{
          elements: {
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
          text-base sm:text-lg lg:text-xl
          leading-normal sm:leading-normal lg:leading-normal
          h-[2em]
          px-[0.5em]
          border-[0.125em] border-emerald-500
          rounded-[0.25em]
          drop-shadow-sm sm:drop-shadow lg:drop-shadow-md
          flex items-center justify-center
          text-zinc-200
          bg-emerald-800/80 hover:bg-emerald-800 active:bg-emerald-500
          transition-colors duration-300 ease-out active:transition-none
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
          text-base sm:text-lg lg:text-xl
          leading-normal sm:leading-normal lg:leading-normal
          h-[2em]
          px-[0.5em]
          border-[0.125em] border-emerald-500
          rounded-[0.25em]
          drop-shadow-sm sm:drop-shadow lg:drop-shadow-md
          flex items-center justify-center
          text-zinc-200
          bg-emerald-800/80 hover:bg-emerald-800 active:bg-emerald-500          
          transition-colors duration-300 ease-out active:transition-none
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
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <button
      type="submit"
      className={`
        text-lg sm:text-xl lg:text-2xl
        leading-normal sm:leading-normal lg:leading-normal
        my-[0.75em]
        h-[2.5em]
        border-[0.125em] border-emerald-500
        rounded-[1.25em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        flex items-center justify-center
        text-zinc-200
        bg-emerald-800/80 hover:bg-emerald-800 active:bg-emerald-500
        transition-colors duration-300 ease-out active:transition-none
        ${className ?? ''}
      `}
    >
      {children}
    </button>
  )
}

/* TODO: add pending UI when form is submitting to show the submission is being performed and to prevent multiple simultaneous submissions. */
export const FormSubmitIconButton = ({
  error,
  className,
}: {
  error?: string
  className?: string
}) => {
  return (
    <button
      type="submit"
      disabled={!!error}
      className={`
        text-lg sm:text-xl lg:text-2xl
        leading-normal sm:leading-normal lg:leading-normal
        size-[2em]
        border-[0.125em] border-emerald-500
        rounded-[0.25em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        flex items-center justify-center
        text-zinc-200 bg-emerald-800/80
        hover:bg-emerald-800 active:bg-emerald-500 disabled:bg-emerald-800/50
        transition-colors duration-300 ease-out active:transition-none
        ${className ?? ''}
      `}
    >
      <CheckIcon />
    </button>
  )
}

/* TODO: add pending UI when form is submitting to show the submission is being performed and to prevent multiple simultaneous submissions. */
export const FormCancelIconButton = ({
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
        text-lg sm:text-xl lg:text-2xl
        leading-normal sm:leading-normal lg:leading-normal
        size-[2em]
        border-[0.125em] border-zinc-500
        rounded-[0.25em]
        drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        flex items-center justify-center
        text-zinc-200 bg-zinc-800/80
        hover:bg-zinc-800 active:bg-zinc-500 disabled:bg-zinc-800/50
        transition-colors duration-300 ease-out active:transition-none
        ${className ?? ''}
      `}
    >
      <XmarkIcon />
    </button>
  )
}
