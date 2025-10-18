# Content Management System

This directory contains all website copy and content, organized by purpose for easy management and localization.

## Structure

```
src/content/
├── pages/          # Page-specific content
├── components/     # Component content (buttons, forms, etc.)
├── shared/         # Shared content across pages
└── index.ts        # Unified content exports
```

## Usage

### Importing Content

```typescript
// Import specific page content
import { homeContent } from '@/content/pages/home'
import { aboutContent } from '@/content/pages/about'

// Import component content
import { componentContent } from '@/content/components'

// Import shared content
import { sharedContent } from '@/content/shared'

// Import all content
import { homeContent, componentContent, sharedContent } from '@/content'
```

### Using Content in Components

```typescript
import { aboutContent } from '@/content/pages/about'

function About() {
  return (
    <PageLayout title={aboutContent.title}>
      <p>{aboutContent.bio.description}</p>
    </PageLayout>
  )
}
```

### Content Organization Principles

1. **Page Content**: Everything specific to a page (titles, descriptions, sections)
2. **Component Content**: Reusable text for buttons, forms, links, etc.
3. **Shared Content**: Navigation, footer, loading states, errors
4. **Type Safety**: All content is typed with `as const` for IntelliSense

## Adding New Content

### For a New Page

1. Create `src/content/pages/newPage.ts`
2. Export content object with `as const`
3. Add to `src/content/index.ts`
4. Import and use in your component

### For a New Component

1. Add to `src/content/components/index.ts`
2. Follow existing naming patterns
3. Use in components as needed

## Content Guidelines

- Use clear, descriptive keys
- Keep text concise but meaningful
- Use proper casing and punctuation
- Consider accessibility (screen readers)
- Plan for future localization (avoid hardcoded assumptions)

## Examples

### Page Content Structure
```typescript
export const exampleContent = {
  title: 'Page Title',
  subtitle: 'Page subtitle text',
  sections: {
    hero: {
      heading: 'Hero heading',
      description: 'Hero description',
    },
  },
} as const
```

### Component Content Structure
```typescript
export const componentContent = {
  buttons: {
    primary: 'Continue',
    secondary: 'Cancel',
  },
  forms: {
    labels: {
      name: 'Full Name',
      email: 'Email Address',
    },
  },
} as const
```
