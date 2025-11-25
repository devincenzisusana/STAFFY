# Design System - Modern Dashboard

## Color Palette

### Primary Colors (Blue)

- Used for primary actions, links, and highlights
- Range from `primary.50` (lightest) to `primary.900` (darkest)
- Main: `#2196F3`

### Secondary Colors (Purple)

- Used for secondary actions and accents
- Range from `secondary.50` to `secondary.900`
- Main: `#9C27B0`

### Neutral Colors (Gray)

- Used for text, backgrounds, and borders
- Range from `neutral.50` (almost white) to `neutral.900` (almost black)

### Semantic Colors

- **Success**: Green tones for positive actions
- **Warning**: Orange tones for caution
- **Error**: Red tones for errors and destructive actions
- **Info**: Blue tones for informational content

## Typography

### Font Families

- **Sans**: `Inter` - Main UI font
- **Display**: `Plus Jakarta Sans` - Headings and display text
- **Mono**: `Fira Code` - Code snippets

### Font Sizes

- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px
- 6xl: 60px

### Font Weights

- light: 300
- normal: 400
- medium: 500
- semibold: 600
- bold: 700
- extrabold: 800

## Spacing Scale

Based on 4px grid system (0.25rem)

- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 6: 24px
- 8: 32px
- 12: 48px
- 16: 64px

## Border Radius

- sm: 4px
- base: 6px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px (circular)

## Shadows

Five levels of elevation:

- sm: Subtle shadow
- base: Default shadow
- md: Medium shadow
- lg: Large shadow
- xl: Extra large shadow
- 2xl: Maximum shadow

## Breakpoints

- xs: 320px (mobile)
- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (small laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large screens)

## Usage

Import tokens in your components:

```typescript
import { colors, typography, spacing } from "@/styles/tokens";

const MyComponent = () => (
  <div
    style={{
      color: colors.primary[500],
      fontFamily: typography.fontFamily.sans,
      padding: spacing[4],
    }}
  >
    Hello World
  </div>
);
```
