# ChefFree

## Description

A web app for storing and sharing recipes.

## Currently Under Development

- Stubbed out profile edit view.
- Stubbed out app settings view.

## Future Plans

- Store recipes in a database.
- Show feeds of recipes.
- Connect with other users.
- Share recipes with other users.

## Revision History

### 0.1.8

### 0.1.7

- Set limit of display name length at 64 bytes (32 regular characters; emojis count for multiple characters).
- Stubbed out user profile page with display name, avatar image, how long ago they joined, how long ago they were last seen, and button stubs for editing the profile and changing the app settings.

### 0.1.6

- Changed onboarding logic to check database instead of Clerk public Metadata, to avoid needing to double-submit the onboarding form, possibly because session data was not refreshed. It was not a timing issue, as a one-second delay before redirecting did not solve the problem.

### 0.1.5

- Set up Prisma and MongoDB database connection.
- Made custom TypeScript declarations inline.
- Added logger utility function and initialized in every script.
- Stubbed out onboarding flow.

### 0.1.4

- Added active link styling to header navbar.
- Added Clerk Sign Up and Log In.
- Added user menu button and sign-up/log-in modal openers to header navbar.

### 0.1.3

Revised all components and stubbed out About page.

### 0.1.2

Got rid of Remix logo images. Fixed problem with conditional semibold class for headings. Created a header navbar to display on every page, with styles that include sizing, colors, reactive display when hovering or activating with a smooth transition, and drop shadows for a subtle 3-D appearance. Fixed body not being sized based on the content, while still being minimally the size of the viewport and added a subtle color gradient to the background.

### 0.1.1

Added custom code formatting rules, moved the default page title and description to the root layout, cleared the Remix example page, created page container and typography components, and demonstrated the components on the home page.

### 0.1.0

Modified the default Remix installation with project-specific information and settings.
