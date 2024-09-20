# ChefFree

## Description

A web app for storing and sharing recipes.

## Currently Under Development

- Stub out a home page.
- Stub out an "About" page.
- Add user auth with Clerk.

## Future Plans

- Store recipes in a database.
- Show feeds of recipes.
- Connect with other users.
- Share recipes with other users.

## Revision History

### 0.2.0

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
