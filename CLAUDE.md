# OSFC Website - Coding Guidelines

This document contains coding guidelines and conventions for the OSFC conference website (osfc.io), built with Astro.

## Project Overview

- **Framework**: Astro 7.x
- **Styling**: PostCSS with modern CSS features
- **Deployment**: Static output (`output: "static"`), deployed to Netlify. No adapter.

## Component Development

### Astro Components

- Place components in `src/components/` with their associated CSS files
- Each component should have its own folder if it includes CSS or multiple files
- Use Astro's component props with TypeScript-style destructuring
- Validate slot content when expecting specific markup (see [Scroller.astro](src/components/Scroller/Scroller.astro) for reference)

Example structure:

```
src/components/
  ComponentName/
    ComponentName.astro
    ComponentName.css
```

### Component Props

- Destructure props in the frontmatter with default values where appropriate
- Use descriptive prop names (e.g., `scrollAlign`, `itemMinWidth`)
- Support `class` prop for external styling: `class: className`
- Pass className to root element using `class:list`

### Slot Validation

When components expect specific markup:

- Check for slot content with `Astro.slots.has("default")`
- Validate rendered content structure when necessary
- Provide clear console errors/warnings for invalid usage
- Use boolean flags like `shouldRender` to conditionally render components

## Styling

### CSS Architecture

- Use separate CSS files imported via `@import` in component `<style>` blocks
- Leverage CSS custom properties for dynamic values via `define:vars`
- Import global CSS in component styles when needed

### CSS Writing Conventions

This project follows principles aligned with the **CUBE CSS methodology**.

**Units and Spacing**

- Use space tokens (`var(--space-400)`, `var(--space-800)`) for spacing where possible
- When space tokens don't fit, use `rem` values
- Always prefer `rem` over `px` for sizing and spacing
- Only use `px` for very small values like `1px` border widths

**Component Spacing**

- Components should NOT have margins
- Use layout components with gaps to handle spacing between elements
- This keeps components composable and prevents margin collisions

Examples:

```css
/* ✅ Good - Use space tokens */
.component {
  padding: var(--space-400);
  gap: var(--space-300);
}

/* ✅ Good - Use rem when tokens don't fit */
.component {
  border-radius: 0.5rem;
}

/* ✅ Good - px for borders */
.component {
  border: 1px solid var(--color-gray);
}

/* ❌ Bad - Don't use px for spacing */
.component {
  padding: 24px;
}

/* ❌ Bad - Don't add margins to components */
.component {
  margin-bottom: var(--space-700);
}
```

### PostCSS

- Modern CSS features are available via postcss-preset-env
- Target browsers: `> 0.5% and not dead and supports css-media-range-syntax`
- Use CSS nesting, custom media queries, and other modern features
- Import global CSS patterns with postcss-import-ext-glob

### Responsive Design

- Fluid font sizes are `clamp()` values built with `interpolate()` from [tokens/helpers/interpolate.ts](tokens/helpers/interpolate.ts)
- Prefer CSS custom properties for dynamic styling
- Support both auto and forced scrolling modes via data attributes

## Design Tokens System

This project uses a token-based design system that automatically generates CSS variables and utility classes from TypeScript configuration files.

### Token Files

Token files are located in the [tokens/](tokens/) directory:

- [tokens/colors.ts](tokens/colors.ts) - Color palette
- [tokens/fontSize.ts](tokens/fontSize.ts) - Typography scale: every spacing step plus fluid `{min}-{max}` steps
- [tokens/spacing.ts](tokens/spacing.ts) - Numeric spacing scale (`100`–`900`, `major`), defined in px and output as rem
- [tokens/fontWeight.ts](tokens/fontWeight.ts) - Font weights
- [tokens/lineHeight.ts](tokens/lineHeight.ts) - Line heights

Each token file exports an object with key-value pairs that define design tokens.

### Generated Files

The build script at [src/utils/build-scripts/generate-variables-utilities.ts](src/utils/build-scripts/generate-variables-utilities.ts) automatically generates two CSS files:

1. **[src/styles/generated/\_variables.css](src/styles/generated/_variables.css)** - CSS custom properties
2. **[src/styles/generated/\_utilities.css](src/styles/generated/_utilities.css)** - Utility classes

These files are regenerated automatically on every dev server start and production build via Astro integration hooks.

### CSS Variables

Generated variables follow these naming conventions:

- **Colors**: `--color-{name}` (e.g., `--color-black`, `--color-peach`)
- **Typography**: `--text-{size}` (e.g., `--text-400`, `--text-600-700`, `--text-800-major`)
- **Spacing**: `--space-{size}` (e.g., `--space-300`, `--space-800`, `--space-major`)
- **Font Weights**: `--weight-{name}` (e.g., `--weight-regular`, `--weight-bold`, `--weight-black`)
- **Line Heights**: `--leading-{name}` (e.g., `--leading-flat`, `--leading-tight`, `--leading-loose`)

### Utility Classes

Generated utility classes include:

**Typography**

- `.text-{size}` - Font sizes (e.g., `.text-400`, `.text-800-major`)
- Use fluid sizes (e.g. `.text-300-400`) instead of breakpoint-based font-size changes
- `.weight-{name}` - Font weights (e.g., `.weight-bold`)
- `.leading-{name}` - Line heights (e.g., `.leading-tight`)

**Colors**

- `.text-{color}` - Text color (e.g., `.text-black`)
- `.bg-{color}` - Background color (e.g., `.bg-white`)

**Spacing (Padding)**

- `.p-{size}` - Padding on all sides
- `.pt-{size}` - Padding block start (top)
- `.pb-{size}` - Padding block end (bottom)
- `.py-{size}` - Padding block (vertical)
- `.px-{size}` - Padding inline (horizontal)

**Layout**

- `.stack-{size}` - Vertical spacing between child elements using margin-block-start
- `.my-stack-space-{size}` - Override the stack space for a single child

### Working with Tokens

**Adding a new color:**

```typescript
// tokens/colors.ts
export const colors = {
  black: "#000000",
  white: "#ffffff",
  "brand-primary": "#FF5500", // Add new color
};
```

This automatically generates:

- Variable: `--color-brand-primary`
- Utilities: `.text-brand-primary`, `.bg-brand-primary`

**Modifying the type scale:**

```typescript
// tokens/fontSize.ts
export const fontSize = {
  ...spacing,
  // Fluid size from 24px to 32px between 480px and 1440px viewport width
  "600-700": interpolate({ min: spacingPx[600], max: spacingPx[700] }),
};
```

**Using tokens in components:**

```css
/* Use CSS variables directly */
.my-component {
  color: var(--color-brand-primary);
  font-size: var(--text-600);
  padding: var(--space-400);
}

/* Or use utility classes */
<div class="text-600 py-900 bg-white">
```

### Token Best Practices

- Prefer using generated CSS variables over hardcoded values
- Use utility classes for common styling patterns
- Modify tokens in the [tokens/](tokens/) directory, not in generated CSS files
- Generated files are gitignored and should not be manually edited
- Keep token names semantic (describe purpose, not visual properties when possible)
- Use the fluid `{min}-{max}` font sizes for headings and large text

## Data Sources

- Conference data (talks, speakers, schedules) comes from Pretalx. Details are documented once the Pretalx sync script exists.

## Scripts and Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Git Workflow

- Keep commits focused and atomic
- Follow existing commit message style (see recent commits)
- Don't commit without testing changes locally

## Code Quality

- Use consistent indentation (check existing files)
- Prefer modern JavaScript/TypeScript features
- Add console warnings for misuse, errors for invalid states

## Accessibility

- Use semantic HTML elements
- Include `role="list"` on lists when styling removes default list semantics
- Ensure keyboard navigation works for scrollable components

## Things to Avoid

- Don't add unnecessary error handling for internal component logic
- Don't over-engineer simple components
- Don't add comments for self-explanatory code
- Don't create abstractions until they're needed in multiple places
