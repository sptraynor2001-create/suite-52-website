# Configuration Management System

This directory contains all application configuration, separated by concern for better organization and maintainability.

## Structure

```
src/config/
├── app.ts          # App-wide settings and metadata
├── routing.ts      # Route definitions and navigation
└── index.ts        # Unified config exports
```

## Usage

### Importing Configuration

```typescript
// Import specific configs
import { appConfig } from '@/config/app'
import { routes, navigation } from '@/config/routing'

// Import utilities
import { configUtils } from '@/config'

// Import all configs
import { appConfig, routes, navigation, configUtils } from '@/config'
```

### Using Configuration

```typescript
import { appConfig, configUtils } from '@/config'

// Check feature flags
if (configUtils.isFeatureEnabled('liveSets')) {
  // Show live sets feature
}

// Get app metadata
const meta = configUtils.getAppMeta()

// Get navigation items
const navItems = configUtils.getNavigationItems()
```

## Configuration Types

### App Configuration (`app.ts`)

- **name**: Application display name
- **description**: SEO description
- **features**: Feature flags for conditional rendering
- **animations**: Global animation timings
- **social**: Social media links and handles

### Routing Configuration (`routing.ts`)

- **routes**: URL path mappings
- **navigation**: Menu structure and labels

## Adding New Configuration

### For Features

Add to `appConfig.features`:

```typescript
export const appConfig = {
  features: {
    newFeature: true, // or false to disable
  },
} as const
```

### For Routes

Add to `routing.ts`:

```typescript
export const routes = {
  newPage: '/new-page',
} as const

export const navigation = {
  primary: [
    { path: routes.newPage, label: 'New Page' },
  ],
} as const
```

## Configuration Principles

1. **Type Safety**: All configs use `as const` for type inference
2. **Centralized**: Single source of truth for each setting
3. **Feature Flags**: Easy enable/disable of features
4. **Environment Aware**: Can be extended for different environments
5. **Documentation**: Clear comments for each setting

## Best Practices

- Keep configs small and focused
- Use meaningful names
- Document the purpose of each setting
- Consider performance impact of config values
- Test config-dependent features
