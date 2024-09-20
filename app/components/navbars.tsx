/* TODO:
 * - make pages for all links
 * - active link styling
 */

import { Link } from '@remix-run/react'

const classList = {
  navbarLink: {
    all: 'flex items-center h-8 lg:h-10 text-lg lg:text-xl border border-emerald-900 bg-emerald-800/80 transition-colors duration-300 ease-out hover:bg-emerald-800 active:bg-emerald-500 active:transition-none',
    single:
      'px-2.5 lg:px-4 lg:border-2 rounded-[1rem] lg:rounded-[1.25rem] drop-shadow lg:drop-shadow-md',
    grouped:
      'px-1.5 lg:px-2 first:pl-3 first:lg:pl-4 last:pr-3 last:lg:pr-4 first:rounded-l-[1rem] first:lg:rounded-l-[1.25rem] last:rounded-r-[1rem] last:lg:rounded-r-[1.25rem] first:border-l-0 last:border-r-0',
  },
  navbarLinkGroup: {
    all: 'flex items-center h-8 lg:h-10 text-lg lg:text-xl rounded-[1rem] lg:rounded-[1.25rem] drop-shadow lg:drop-shadow-md border lg:border-2 border-emerald-900',
  },
  headerNavbar: {
    all: 'h-12 lg:h-16 px-2 lg:px-4 rounded-md flex gap-2 lg:gap-4 items-center drop-shadow lg:drop-shadow-md text-zinc-200 bg-gradient-to-br from-emerald-100 to-teal-200',
  },
}

export function NavbarLink({
  children,
  to,
  className,
}: {
  children: React.ReactNode
  to: string
  className?: string
}) {
  return (
    <Link
      to={to}
      prefetch="render"
      className={`${classList.navbarLink.all} ${classList.navbarLink.single} ${className}`}
    >
      {children}
    </Link>
  )
}

export function NavbarLinkGroup({
  links,
  className,
}: {
  links: NavbarLinkGroupLink[]
  className?: string
}) {
  return (
    <div className={`${classList.navbarLinkGroup.all} ${className}`}>
      {links.map((link) => (
        <Link
          to={link.to}
          prefetch="render"
          className={`${classList.navbarLink.all} ${classList.navbarLink.grouped} ${link.className}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

export function HeaderNavbar() {
  return (
    <div className="p-2">
      <nav className={`${classList.headerNavbar.all}`}>
        <NavbarLinkGroup
          links={[
            { to: '/', label: '🧑🏽‍🍳' },
            { to: '#about', label: 'ChefFree' },
          ]}
        />
        <div className="grow"></div>
        <NavbarLink to="#sign-up">Sign up</NavbarLink>
        <NavbarLink to="#sign-in">Log in</NavbarLink>
      </nav>
    </div>
  )
}

export interface NavbarLinkGroupLink {
  to: string
  label: string
  className?: string
}
