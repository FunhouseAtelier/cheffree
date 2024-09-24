import logger from '@funhouse-atelier/logger'
import { Link } from '@remix-run/react'
import { NavLink } from '@remix-run/react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/remix'
import { useLocation } from '@remix-run/react'

const log = logger({ name: '@/app/components/navbars.ts', level: 2 })

const classList = {
  navbarLink: {
    all: 'flex items-center h-8 lg:h-10 text-lg lg:text-xl border border-emerald-900 transition-colors duration-300 ease-out active:bg-emerald-500 active:transition-none',
    nonStateful: 'bg-emerald-800/80 hover:bg-emerald-800',
    single:
      'px-2.5 lg:px-4 lg:border-2 rounded-[1rem] lg:rounded-[1.25rem] drop-shadow lg:drop-shadow-md',
    grouped:
      'px-1.5 lg:px-2 first:pl-3 first:lg:pl-4 first:rounded-l-[1rem] first:lg:rounded-l-[1.25rem] first:border-l-0',
    groupedLast:
      'pr-3 lg:pr-4 rounded-r-[1rem] lg:rounded-r-[1.25rem] border-r-0',
    pending: 'bg-emerald-500',
    active: 'bg-emerald-500/80',
  },
  navbarLinkGroup:
    'flex items-center h-8 lg:h-10 text-lg lg:text-xl rounded-[1rem] lg:rounded-[1.25rem] drop-shadow lg:drop-shadow-md border lg:border-2 border-emerald-900',
  headerNavbar:
    'h-12 lg:h-16 px-2 lg:px-4 rounded-md flex gap-2 lg:gap-4 items-center drop-shadow lg:drop-shadow-md text-zinc-200 bg-gradient-to-br from-emerald-100 to-teal-200',
  userButton: 'size-8 lg:size-10',
}

const customAuthPageRoutes = ['/sign-up', '/log-in']

export function NavbarLink({
  children,
  to,
  isStateful,
  className,
}: {
  children: React.ReactNode
  to: string
  isStateful?: boolean
  className?: string
}) {
  if (isStateful) {
    const makeSingleNavLinkClassList = ({
      isActive,
      isPending,
    }: {
      isActive: boolean
      isPending: boolean
    }) => {
      const commonClassList = `${classList.navbarLink.all} ${
        classList.navbarLink.single
      }${className ? ` ${className}` : ''}`
      return isPending
        ? `${commonClassList} ${classList.navbarLink.pending}`
        : isActive
        ? `${commonClassList} ${classList.navbarLink.active}`
        : `${commonClassList} ${classList.navbarLink.nonStateful}`
    }
    return (
      <NavLink to={to} prefetch="render" className={makeSingleNavLinkClassList}>
        {children}
      </NavLink>
    )
  }
  const navbarLinkClassList = `${classList.navbarLink.all} ${
    classList.navbarLink.nonStateful
  } ${classList.navbarLink.single}${className ? ` ${className}` : ''}`

  return (
    <Link to={to} prefetch="render" className={navbarLinkClassList}>
      {children}
    </Link>
  )
}

interface NavbarLinkGroupLink {
  to: string
  label: string
  isStateful?: boolean
  className?: string
  key: string | number
}
export function NavbarLinkGroup({
  links,
  className,
}: {
  links: NavbarLinkGroupLink[]
  className?: string
}) {
  const navbarLinkGroupClassList = `${classList.navbarLinkGroup}${
    className ? ` ${className}` : ''
  }`
  return (
    <div className={navbarLinkGroupClassList}>
      {links.map((link, index) => {
        if (link.isStateful) {
          const makeGroupedNavLinkClassList = ({
            isActive,
            isPending,
          }: {
            isActive: boolean
            isPending: boolean
          }) => {
            /* NOTE: Cannot use the Tailwind last: utilitiy classes here because Remix prefetching adds more child elements. */
            const commonClassList = `${classList.navbarLink.all} ${
              classList.navbarLink.grouped
            }${
              index === links.length - 1
                ? ` ${classList.navbarLink.groupedLast}`
                : ''
            }${link.className ? ` ${link.className}` : ''}`
            return isPending
              ? `${commonClassList} ${classList.navbarLink.pending}`
              : isActive
              ? `${commonClassList} ${classList.navbarLink.active}`
              : `${commonClassList} ${classList.navbarLink.nonStateful}`
          }
          return (
            <NavLink
              key={link.key}
              to={link.to}
              prefetch="render"
              className={makeGroupedNavLinkClassList}
            >
              {link.label}
            </NavLink>
          )
        }
        /* NOTE: Cannot use the Tailwind last: utilitiy classes here because Remix prefetching adds more child elements. */
        const navbarLinkClassList = `${classList.navbarLink.all} ${
          classList.navbarLink.nonStateful
        } ${classList.navbarLink.grouped}${
          index === links.length - 1
            ? ` ${classList.navbarLink.groupedLast}`
            : ''
        }${link.className ? ` ${link.className}` : ''}`
        return (
          <Link
            key={link.key}
            to={link.to}
            prefetch="render"
            className={navbarLinkClassList}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}

export function SignUpLink() {
  return (
    <NavbarLink to="/sign-up" isStateful={true}>
      Sign up
    </NavbarLink>
  )
}

export function SignUpModalOpener() {
  const navbarLinkClassList = `${classList.navbarLink.all} ${classList.navbarLink.nonStateful} ${classList.navbarLink.single}`
  return (
    <SignUpButton mode="modal">
      <button className={navbarLinkClassList}>Sign up</button>
    </SignUpButton>
  )
}

export function LogInLink() {
  return (
    <NavbarLink to="/log-in" isStateful={true}>
      Log in
    </NavbarLink>
  )
}

export function SignInModalOpener() {
  const navbarLinkClassList = `${classList.navbarLink.all} ${classList.navbarLink.nonStateful} ${classList.navbarLink.single}`
  return (
    <SignInButton mode="modal">
      <button className={navbarLinkClassList}>Log in</button>
    </SignInButton>
  )
}

export function HeaderNavbar() {
  const location = useLocation()
  const pathname = location.pathname
  log.debug(pathname)

  return (
    <div className="p-2">
      <nav className={`${classList.headerNavbar}`}>
        <NavbarLinkGroup
          links={[
            { to: '/', label: '🧑🏽‍🍳', isStateful: true, key: 1 },
            { to: '/about', label: 'ChefFree', isStateful: true, key: 2 },
          ]}
        />
        <div className="grow"></div>
        <SignedIn>
          <NavbarLink to="/settings" isStateful={true}>
            ⚙️
          </NavbarLink>
          <UserButton
            appearance={{
              elements: {
                avatarBox: classList.userButton,
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          {customAuthPageRoutes.includes(pathname) ? (
            <SignUpLink />
          ) : (
            <SignUpModalOpener />
          )}
          {customAuthPageRoutes.includes(pathname) ? (
            <LogInLink />
          ) : (
            <SignInModalOpener />
          )}
        </SignedOut>
      </nav>
    </div>
  )
}
