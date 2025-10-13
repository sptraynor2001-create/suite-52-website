# Design System

Complete design system for Suite 52 website. Midnight blue futuristic aesthetic with ominous, technical atmosphere.

## Philosophy

**Introspective. Deep. Technical. Digital.**

The design system embodies a sharp, futuristic aesthetic that blurs the line between utopian and dystopian. It's ominous yet beautiful, technical yet emotional - creating an atmosphere of being at the forefront of technology and culture.

## Core Aesthetic

- **Midnight to Black Gradient** - Deep blues fading to pure black
- **Neon Accents** - Electric cyan, blue, purple for technical feel
- **Sharp & Technical** - Clean lines, precise typography
- **Ominous Atmosphere** - Mysterious, slightly unsettling
- **Futuristic** - Forward-thinking, cutting-edge

## Color Palette

### Primary Colors

**Midnight** - Deep blue tones
```typescript
midnight.500  // #252f4f - Base midnight blue
midnight.900  // #3f4b7d - Lighter accent
```

**Abyss** - True blacks with blue tint
```typescript
abyss.500  // #05090e - Base abyss
abyss.50   // #000000 - Pure black
```

### Neon Accents

**Electric Colors** for technical feel
```typescript
neon.cyan    // #00f3ff - Primary accent
neon.blue    // #0088ff - Secondary accent  
neon.purple  // #8b5cf6 - Tertiary accent
neon.pink    // #ec4899 - Highlight
neon.green   // #10b981 - Success/matrix
```

### Usage Guidelines

**Primary Text:** Always white or near-white for contrast
**Accents:** Use neon colors sparingly for impact
**Backgrounds:** Layer midnight and abyss gradients
**Borders:** Subtle cyan glow (0.1-0.2 opacity)

## Typography

### Font Families

**Display Font** - Orbitron (futuristic headers)
```typescript
font-display  // Headers, titles, brand name
```

**Body Font** - Inter (clean, modern)
```typescript
font-sans  // Paragraphs, body text
```

**Code Font** - JetBrains Mono (technical elements)
```typescript
font-mono  // Code blocks, technical data
```

### Scale

```
text-xs   - 12px  // Small labels
text-sm   - 14px  // Secondary text
text-base - 16px  // Body text
text-xl   - 20px  // Subheadings
text-3xl  - 30px  // Section titles
text-6xl  - 60px  // Hero headings
text-8xl  - 96px  // Large hero text
```

### Best Practices

- Use `font-display` for brand and major headings
- Use `font-semibold` or `font-bold` for emphasis
- Use `uppercase` with `tracking-wider` for labels
- Line height 1.5-1.75 for readability

## Gradients

### Midnight Gradient

Background gradient from black → midnight → black
```typescript
gradients.midnight.vertical    // Top to bottom
gradients.midnight.horizontal  // Left to right
gradients.midnight.diagonal    // 135deg angle
```

### Neon Gradients

Glowing accent gradients
```typescript
gradients.neon.blue    // Blue glow
gradients.neon.cyan    // Cyan glow
gradients.neon.purple  // Purple glow
```

### Card Backgrounds

Translucent midnight gradients
```typescript
gradients.card.default  // 20-40% opacity
gradients.card.hover    // 40-60% opacity
gradients.card.elevated // 50-80% opacity
```

### Mesh Gradient

Complex radial gradient for atmospheric effects
```typescript
gradients.mesh  // Multiple radial gradients
```

## Shadows & Glows

### Neon Glow Effects

```typescript
// Box shadows
shadow-glow-cyan-sm   // 10px cyan glow
shadow-glow-cyan-md   // 20px cyan glow
shadow-glow-cyan-lg   // 30px cyan glow

shadow-glow-blue-sm   // 10px blue glow
shadow-glow-blue-md   // 20px blue glow
```

### Text Glow

```typescript
// Text shadows
text-shadow-glow-cyan-sm  // Subtle text glow
text-shadow-glow-cyan-md  // Medium text glow
```

### Usage

- Use glows on interactive elements (buttons, links)
- Animate glow intensity on hover
- Layer multiple glows for depth
- Keep glows subtle for atmospheric effect

## Atomic Components

### Button

```tsx
<Button variant="primary" size="md">
  Click Me
</Button>
```

**Variants:**
- `primary` - Neon gradient, cyan glow
- `secondary` - Midnight gradient, subtle shadow
- `ghost` - Transparent, cyan text
- `danger` - Red gradient

**Sizes:** `sm`, `md`, `lg`

### Card

```tsx
<Card variant="default" className="p-6">
  Content here
</Card>
```

**Variants:**
- `default` - Standard card background
- `elevated` - Stronger background
- `neon` - Neon gradient border

### GlowText

```tsx
<GlowText variant="cyan" intensity="md">
  Glowing Text
</GlowText>
```

**Variants:** `blue`, `cyan`, `purple`
**Intensity:** `sm`, `md`, `lg`

## Layout Patterns

### Hero Section

```tsx
<div className="min-h-screen flex items-center justify-center">
  <h1 className="text-8xl font-display">
    <GlowText variant="cyan" intensity="lg">
      TITLE
    </GlowText>
  </h1>
</div>
```

### Feature Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <Card variant="default" className="p-8">
    <h3 className="text-2xl font-display mb-4">Feature</h3>
    <p>Description</p>
  </Card>
</div>
```

### Content Section

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  <h2 className="text-4xl font-display mb-8">
    <GlowText>Section Title</GlowText>
  </h2>
  <div className="prose">
    Content...
  </div>
</div>
```

## Animation

### Pulse Glow

```tsx
<div className="animate-glow">
  Pulsing element
</div>
```

### Slow Pulse

```tsx
<div className="animate-pulse-slow">
  Breathing effect
</div>
```

### Hover Transitions

```tsx
<div className="transition-all duration-300 hover:scale-105">
  Scales on hover
</div>
```

## Effects

### Backdrop Blur

```tsx
<div className="backdrop-blur-md bg-abyss-500/80">
  Glass morphism effect
</div>
```

### Neon Border

```tsx
<div className="border border-neon-cyan/20 shadow-glow-cyan-sm">
  Glowing border
</div>
```

### Mesh Background

```tsx
<div className="bg-gradient-mesh opacity-30">
  Atmospheric background
</div>
```

## Responsive Design

### Mobile First

Always design for mobile first, then scale up:
```tsx
className="text-base sm:text-lg md:text-xl"
```

### Breakpoints

- `sm:` - 640px (mobile landscape)
- `md:` - 768px (tablet)
- `lg:` - 1024px (desktop)
- `xl:` - 1280px (large desktop)

### Touch Targets

Minimum 44x44px for mobile:
```tsx
className="p-3 md:p-2"  // Larger padding on mobile
```

## Best Practices

### Do's

✅ Use midnight/abyss for backgrounds
✅ Add neon accents sparingly
✅ Use glow effects on interactive elements
✅ Layer gradients for depth
✅ Keep typography sharp and clean
✅ Use uppercase for emphasis
✅ Add subtle animations
✅ Test on dark backgrounds

### Don'ts

❌ Don't overuse neon colors
❌ Don't use light backgrounds
❌ Don't ignore mobile responsiveness
❌ Don't forget hover states
❌ Don't use too many font families
❌ Don't animate everything
❌ Don't sacrifice readability

## File Structure

```
src/
├── design/
│   ├── index.ts        # Central export
│   ├── colors.ts       # Color palette
│   ├── gradients.ts    # Gradient definitions
│   └── tokens.ts       # Design tokens
└── shared/
    └── components/
        └── atoms/      # Atomic components
            ├── Button.tsx
            ├── Card.tsx
            └── GlowText.tsx
```

## Usage Example

```tsx
import { Card, Button, GlowText } from '@/shared/components/atoms'
import { colors, gradients } from '@/design'

function MyComponent() {
  return (
    <Card variant="elevated" className="p-8">
      <h2 className="text-3xl font-display mb-4">
        <GlowText variant="cyan" intensity="md">
          TITLE
        </GlowText>
      </h2>
      
      <p style={{ color: colors.text.secondary }}>
        Description text
      </p>
      
      <Button variant="primary" className="mt-6">
        Take Action
      </Button>
    </Card>
  )
}
```

## Extending the System

### Adding New Colors

Edit `src/design/colors.ts`:
```typescript
export const colors = {
  // ... existing colors
  newColor: {
    500: '#hexcode',
  },
}
```

### Adding New Components

Create in `src/shared/components/atoms/`:
```tsx
import { colors, tokens } from '@/design'

function NewComponent({ ...props }) {
  return (
    <div style={{ color: colors.neon.cyan }}>
      {children}
    </div>
  )
}
```

### Adding New Gradients

Edit `src/design/gradients.ts`:
```typescript
export const gradients = {
  // ... existing gradients
  newGradient: 'linear-gradient(...)',
}
```

## Resources

- **Color Palette**: `src/design/colors.ts`
- **Gradients**: `src/design/gradients.ts`
- **Design Tokens**: `src/design/tokens.ts`
- **Components**: `src/shared/components/atoms/`
- **Tailwind Config**: `tailwind.config.js`

