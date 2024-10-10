import logger from '@funhouse-atelier/logger'
import {
  NavButton,
  AccountSettingsButton,
  SignUpNavButton,
  LogInNavButton,
} from '../buttons'
import { KitchenSetIcon, GearIcon } from '../icons'
import { SignedIn, SignedOut } from '@clerk/remix'
import { Container } from '../containers'

const log = logger({
  name: '@/app/components/navbars/HeaderNavbar.ts',
  level: 2,
})

export default function HeaderNavbar() {
  return (
    <Container
      Tag="header"
      containerSize="fluid"
      className="p-[0.5em]"
    >
      {/* Use drop shadow to give the navbar an appearance of being lifted up from the page background, and give the background color a gradient so it doesn't look so plain. */}
      <nav
        className="
          flex items-center gap-x-[0.5em]
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          rounded-[0.25em]
          p-[0.5em]
          bg-gradient-to-br from-emerald-100 to-teal-200
        "
      >
        {/* The home button. */}
        <NavButton to="/">
          <KitchenSetIcon />
        </NavButton>
        {/* The brand/about button. Later this could open a menu that can be used to access various pages of app-specific information like About, FAQ, Terms of Service, and Privacy Policy. */}
        <NavButton to="/about">ChefFree</NavButton>
        {/* An invisible divider that expands to fill the empty space between the left-side and right-side navbar buttons. */}
        <div className="grow" />
        {/* Content to be displayed only if the user is authenticated. */}
        <SignedIn>
          {/* The app settings button. Navigates to a page where users can change their profile information or how the app behaves. */}
          <NavButton to="/settings">
            <GearIcon />
          </NavButton>
          {/* The account settings button. Opens a Clerk dialog that can be used to sign out, change the email address(es) or avatar image associated with the account, and delete or otherwise manage the Clerk account. */}
          <AccountSettingsButton />
        </SignedIn>
        {/* Content to be displayed only if the user is not authenticated. */}
        <SignedOut>
          {/* A button that opens the Clerk sign up modal, unless already on a sign up or log in page, in which case it navigates to the sign up page. */}
          <SignUpNavButton>Sign up</SignUpNavButton>
          {/* A button that opens the Clerk log in modal, unless already on a sign up or log in page, in which case it navigates to the log in page. */}
          <LogInNavButton>Log in</LogInNavButton>
        </SignedOut>
      </nav>
    </Container>
  )
}
