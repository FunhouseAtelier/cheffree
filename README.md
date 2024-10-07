# ChefFree

## Description

A web app for storing and sharing recipes.

## Currently Under Development

- Allow ingredients and steps to change in order via drag and drop.

- Refactor zod logic, form logic, and components.
- Revise cosmetics on all pages and components.

- Improve input and display of quantities to allow for more conventional formats than strictly decimal values.
- Implement standard unit abbreviations.

- Add Cloudinary image uploads of recipes.

- Allow for scaling the recipe size by converting the ingredient quantites as the desired yield is adjusted.
- Allow for conversion between imperial and metric units.

- Adjust zodParse to properly handle arrays of form data.

## Future Plans

- Connect with other users.
- Share recipes with other users.
- Implement feeback regarding best practices for recipe-authoring. \*(per Scooter)

## Revision History

### 0.1.25

- Allow ingredients and steps to change in order via drag and drop.

### 0.1.24

- Fixed incorrect text color on yield unit select input.
- Added typography demo and verbose commenting to `@/app/routes/about.tsx`.

### 0.1.23

- fixed border color on edit recipe description field

### 0.1.22

- Fixed compiling errors due to other routes not being updated with latest changes to components.

### 0.1.21

- Allow any ingredients or steps to be removed, now that there is an add button.
- Skip tab-indexing the "remove line" or "add line" buttons on the edit recipe page.
- Implement submitting a form with JSON data so that `formValues` can be easily transmitted and parsed in services.
- Improve Edit Recipe form display and adapt for mobile viewport sizes.
- Quietly filter out any blank steps or yields/ingredients with no data points when updating a recipe.
- Implement UUID for ad hoc arrays of form data.

### 0.1.20

- Fixed issue with recipe display when `yieldAmt` does not exist in recipe record.

### 0.1.19

- Added ingredients and process lists to recipes.

### 0.1.18

- Fixed problem with trying to get recipes for feed page when user is not authenticated.

### 0.1.17

- Added full CRUD flows for recipes, with titles, optional descriptions, and author data.
- Added a recipe feed page.

### 0.1.16

- Created `zodParse` utility function to simplify parsing data and returning an app-standard `success` or `failure` result.

### 0.1.15

- Improved initial rendering of SVG icons.
- Implemented Zod for parsing form data and inferring types of selected data from database schema.
- Replaced Remix example favicon with a Chef kiss emoji.
- Did a major refactoring of all existing code and added many inline comments.

### 0.1.14

- Improved user profiles future additions outline.

### 0.1.13

- Improved user profiles layout and outlined future additions.

### 0.1.12

- Added controlled inputs and dual-side validation of form data with Zod.

### 0.1.11

- Installed FontAwesome and used Web Fonts icons in place of emojis.

### 0.1.10

- Switched to newly published `@funhouse-atelier/logger` package.
- Changed `requireAuthenticated()` to redirect to log in page if not authenticated.
- Stubbed out app settings page.

### 0.1.9

- Changed banner color on user profiles to distinguish it from navbars.

### 0.1.8

- Added links on home page to view user profiles.

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
