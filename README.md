# ChefFree

## Description

A web app for storing and sharing recipes.

## Currently Under Development

- Stub out an "About" page.
- Add user auth with Clerk.

## Future Plans

- Store recipes in a database.
- Show feeds of recipes.
- Connect with other users.
- Share recipes with other users.

## Revision History

### 0.1.2

#### Summary

Got rid of Remix logo images. Fixed problem with conditional semibold class for headings. Created a header navbar to display on every page, with styles that include sizing, colors, reactive display when hovering or activating with a smooth transition, and drop shadows for a subtle 3-D appearance. Fixed body not being sized based on the content, while still being minimally the size of the viewport and added a subtle color gradient to the background.

#### Changes

- Deleted Remix logos in `public` folder.
- Edited `app/components/typography.tsx`
  - Fixed conditional `font-semibold` class for headings. It was applying `false` as a class because a logical AND operator was used instead of a ternary.
- Created `app/components/navbars.tsx`
  - Created `NavbarLink`, `NavbarLinkGroup`, and `HeaderNavbar` components.
  - Styled components and made them responsive.
- Edited `app/root.tsx`
  - Set `<body>` height and width to 100% of parent and minimums to 100% of viewport.
  - Added a color gradient to `<body>` background.
  - Set the `HeaderNavbar` component to display at the top of every page.

### 0.1.1

#### Summary

Added custom code formatting rules, moved the default page title and description to the root layout, cleared the Remix example page, created page container and typography components, and demonstrated the components on the home page.

#### Changes

- Added `prettierrc.json` for custom Prettier code formatting.
- Edited `app/root.tsx`.
  - Added fallback `meta` function export.
  - Set `<body>` height and width to viewport.
  - Set default background and text color.
- Created `app/components/containers.tsx`
  - Added `PageContainer` component.
    - Applies 0.5rem padding and breaks words to prevent text overflow.
- Created `app/components/typography.tsx`
  - Added `Typography` component.
    - Generic component for applying responsive text sizes.
  - Added `Heading` component.
    - Component for responsive-sized heading elements.
  - Added `Text` component.
    - Component for responsive-sized text elements.
- Edited `app/routes/_index.tsx`
  - Removed Remix example.
  - Added typography examples and 100 W's to demo word-breaking.

### 0.1.0

#### Summary

Modified the default Remix installation with project-specific information and settings.

#### Changes

- Updated `.gitignore` to exclude `_sundry`, a folder used in development for storing private files related but not integral to the app.
- Updated `package.json` to include the app name, version number, description, keywords, homepage, issues page, license, author, and repository.
- Outlined initial development goals and future plans.
