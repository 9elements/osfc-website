# Dato Astro Boilerplate - Coding Guidelines

This document contains coding guidelines and conventions for this Astro + DatoCMS boilerplate project.

## Project Overview

- **Framework**: Astro 6.x
- **CMS**: DatoCMS with @datocms/astro
- **Styling**: PostCSS with modern CSS features
- **Deployment**: Use Netlify via @astrojs/netlify adapter configured in astro.config.mjs

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

- Use space tokens (`var(--space-m)`, `var(--space-xl)`) for spacing where possible
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
  padding: var(--space-m);
  gap: var(--space-s);
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
  margin-bottom: var(--space-l);
}
```

### PostCSS

- Modern CSS features are available via postcss-preset-env
- Target browsers: `> 0.5% and not dead and supports css-media-range-syntax`
- Use CSS nesting, custom media queries, and other modern features
- Import global CSS patterns with postcss-import-ext-glob

### Responsive Design

- Use Utopia Core for fluid typography and spacing
- Prefer CSS custom properties for dynamic styling
- Support both auto and forced scrolling modes via data attributes

## Design Tokens System

This project uses a token-based design system that automatically generates CSS variables and utility classes from TypeScript configuration files.

### Token Files

Token files are located in the [tokens/](tokens/) directory:

- [tokens/colors.ts](tokens/colors.ts) - Color palette
- [tokens/fontSize.ts](tokens/fontSize.ts) - Fluid typography scale (using Utopia Core)
- [tokens/spacing.ts](tokens/spacing.ts) - Fluid spacing scale (using Utopia Core)
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

- **Colors**: `--color-{name}` (e.g., `--color-black`, `--color-light-pink`)
- **Typography**: `--text-step-{n}` (e.g., `--text-step-1`, `--text-step-0`, `--text-step--1`)
- **Spacing**: `--space-{size}` (e.g., `--space-xs`, `--space-m`, `--space-l`, `--space-xl-2xl`)
- **Font Weights**: `--weight-{name}` (e.g., `--weight-normal`, `--weight-bold`)
- **Line Heights**: `--leading-{name}` (e.g., `--leading-tight`, `--leading-normal`)

### Utility Classes

Generated utility classes include:

**Typography**

- `.text-step-{n}` - Font sizes (e.g., `.text-step-1`, `.text-step-0`)
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
  ...calculateTypeScale({
    minWidth: 320,
    maxWidth: 1140,
    minFontSize: 18, // Adjust base size
    maxFontSize: 22,
    minTypeScale: 1.25, // Adjust scale ratio
    maxTypeScale: 1.333,
    positiveSteps: 5, // Number of larger sizes
    negativeSteps: 1, // Number of smaller sizes
  }).reduce(/*...*/),
};
```

**Using tokens in components:**

```css
/* Use CSS variables directly */
.my-component {
  color: var(--color-brand-primary);
  font-size: var(--text-step-2);
  padding: var(--space-m);
}

/* Or use utility classes */
<div class="text-step-2 p-m bg-white">
```

### Token Best Practices

- Prefer using generated CSS variables over hardcoded values
- Use utility classes for common styling patterns
- Modify tokens in the [tokens/](tokens/) directory, not in generated CSS files
- Generated files are gitignored and should not be manually edited
- Keep token names semantic (describe purpose, not visual properties when possible)
- Use Utopia's fluid scales for typography and spacing to maintain responsive design

## DatoCMS Integration

- Use `@datocms/astro` for CMS integration
- Support live preview mode via `LIVE_PREVIEW=true` environment variable
- Use `data-uri` for SVG images in preview mode (see DatoPicture component)

## DatoCMS Queries

This project follows a specific pattern for organizing and reusing GraphQL query fragments.

### Query Organization

Queries are organized in two locations:

1. **General reusable queries**: `src/utils/dato/queries/`
   - Contains commonly reused query fragments
   - Examples: `linktarget.js`, `imageContent.js`, `link.js`

2. **Component-specific queries**: `src/components/dato/[ComponentName]/[ComponentName].query.js`
   - Each DatoCMS component has its own query file
   - Examples: `Hero.query.js`, `CallToAction.query.js`, `ImageBlock.query.js`

### Query Fragments vs Complete Queries

There are two types of query files in this project:

#### 1. Query Fragments (Partial Queries)

Most queries export **fragments** (partial query strings), not complete GraphQL queries. These fragments are meant to be composed together and embedded in larger queries.

Example:

```javascript
// This is a fragment, not a complete query
export const IMAGE_CONTENT_QUERY = `
  alt
  url
  width
  height
  focalPoint {
    x
    y
  }
`;
```

Fragments are used for:

- Component-specific queries that will be embedded in modular content
- Reusable field groups (like image data, links, etc.)
- Any query that will be composed into a larger query

#### 2. Complete Queries

When querying entire objects (like singleton models or page data), include the complete GraphQL query with the `query {}` wrapper:

```javascript
// Complete query for a singleton or page
export const GENERAL_INFO_QUERY = `
query {
  generalInfo {
    id
    _modelApiKey
    __typename
    footerAddress {
      value
    }
  }
}
`;
```

Complete queries are used for:

- Singleton models (like `generalInfo`, `homepage`)
- Page-level queries that fetch entire records
- Top-level queries that will be passed directly to `datoRequest()`

Examples:

- `homepage.js` - Complete query for homepage singleton
- `generalInfo.js` - Complete query for general info singleton
- `blogPost.js` - Complete query for individual blog post pages

### Structured Text Fields

DatoCMS structured text fields can contain simple text with basic markup or complex content with embedded blocks and links. **By default, only query the `value` field** unless you need advanced features.

#### Simple Structured Text (Default)

For structured text fields with only basic formatting (bold, italic, line breaks), query only the `value`:

```javascript
export const MY_QUERY = `
  description {
    value
  }
  footerAddress {
    value
  }
`;
```

This is sufficient for most use cases and keeps queries lightweight.

#### Complex Structured Text

Only use the full structured text query when the field contains:

- Embedded blocks (quotes, images, highlight boxes)
- Inline blocks
- Links to other records

```javascript
import { STRUCTURED_TEXT_QUERY } from "@/utils/dato/queries/structured-text.js";

export const MY_QUERY = `
  richContent {
    ${STRUCTURED_TEXT_QUERY}
  }
`;
```

The `STRUCTURED_TEXT_QUERY` includes:

- `blocks` - For embedded block content
- `inlineBlocks` - For inline embedded content
- `links` - For links to other records
- `value` - The actual content

**When in doubt, start with just `value` and only add complexity when needed.**

### Commonly Reused Queries

Two query fragments are used extensively throughout the project:

#### `LINKTARGET_QUERY`

Located in `src/utils/dato/queries/linktarget.js`, this fragment handles both internal and external links with support for multiple content types:

```javascript
export const LINKTARGET_QUERY = `
  externalLink
  internalLink {
    ... on VariablePageRecord {
      _modelApiKey
      __typename
      id
      slug
    }
    ... on BlogPostRecord {
      _modelApiKey
      __typename
      id
      slug
    }
    ... on CoachesPageRecord {
      _modelApiKey
      __typename
      id
      slug
    }
    ... on SeminarsPageRecord {
      _modelApiKey
      __typename
      id
      slug
    }
  }
  newWindow
`;
```

Use this whenever you need to query link targets. It's typically wrapped by `LINK_QUERY` which adds the link text.

#### `IMAGE_BLOCK_QUERY`

Located in `src/components/dato/ImageBlock/ImageBlock.query.js`, this fragment is used for image blocks with captions and sizing options:

```javascript
export const IMAGE_BLOCK_QUERY = `
  id
  _modelApiKey
  __typename
  image {
    ${IMAGE_CONTENT_QUERY}
  }
  showCaption
  size
`;
```

Note how it imports and embeds `IMAGE_CONTENT_QUERY` from `src/utils/dato/queries/imageContent.js`.

#### `IMAGE_CONTENT_QUERY`

Located in `src/utils/dato/queries/imageContent.js`, this is the base fragment for any image data:

```javascript
export const IMAGE_CONTENT_QUERY = `
  alt
  mimeType
  url
  id
  title
  copyright
  focalPoint {
    x
    y
  }
  filename
  width
  height
`;
```

Use this for any field that contains image data from DatoCMS.

### ModularContent Component

The `ModularContent` component (`src/components/dato/ModularContent/`) is a special pattern used to handle DatoCMS **Modular Content fields** where multiple different block types can be inserted.

#### How It Works

1. **Query file** (`modularContent.query.js`) imports all possible block queries and combines them with GraphQL union type syntax:

```javascript
import { STRUCTURED_TEXT_QUERY } from "@/components/dato/StructuredTextBlock/StructuredTextBlock.query.js";
import { ICON_BOX_LIST_QUERY } from "@/components/dato/IconBoxList/IconBoxList.query.js";
// ... more imports

export const MODULAR_CONTENT_QUERY = `
  content {
    ... on StructuredTextRecord {
      id
      _modelApiKey
      __typename
      text {
        ${STRUCTURED_TEXT_QUERY}
      }
    }
    ... on IconBoxListRecord {
      ${ICON_BOX_LIST_QUERY}
    }
    ... on CallToActionRecord {
      ${CALL_TO_ACTION_QUERY}
    }
    # ... more block types
  }
`;
```

2. **Component file** (`ModularContent.astro`) maps each block type to its corresponding Astro component:

```javascript
content.map((block) => {
  const typename = block.__typename?.replace(/Record$/, "");

  switch (typename) {
    case "StructuredText":
      return <StructuredTextBlock {block} />;
    case "IconBoxList":
      return <IconBoxList {block} />;
    case "CallToAction":
      return <CallToAction {block} />;
    // ... more cases
    default:
      return <p>Unknown block: {block.__typename}</p>;
  }
})
```

#### When to Use ModularContent

Use this pattern when:

- You have a DatoCMS field type of "Modular Content"
- Editors need to insert multiple different block types in flexible order
- Each block type has its own component and query

#### Adding a New Block to ModularContent

When adding a new block type:

1. Create the component and its query file following the standard pattern
2. Import the query in `modularContent.query.js`
3. Add a GraphQL fragment for the new block type
4. Import the component in `ModularContent.astro`
5. Add a case to the switch statement for rendering

### Creating New Queries

When creating a new DatoCMS query, follow these conventions:

#### File Location and Naming

- **Component-specific queries**: `src/components/dato/[ComponentName]/[ComponentName].query.js`
- **Reusable queries**: `src/utils/dato/queries/[queryName].js`
- Export query fragments as named constants in SCREAMING_SNAKE_CASE

#### Standard Fields

Always include these fields for block components:

```javascript
export const MY_COMPONENT_QUERY = `
  id
  _modelApiKey
  __typename
  // ... component-specific fields
`;
```

These fields are essential for:

- `id`: Unique identifier for React keys
- `_modelApiKey`: Identifying the block type
- `__typename`: Used by ModularContent to route to correct component

#### Composing Queries

Import and embed other query fragments using template literals:

```javascript
import { IMAGE_CONTENT_QUERY } from "@/utils/dato/queries/imageContent";
import { LINK_QUERY } from "@/utils/dato/queries/link";

export const MY_COMPONENT_QUERY = `
  id
  _modelApiKey
  __typename
  image {
    ${IMAGE_CONTENT_QUERY}
  }
  cta {
    ${LINK_QUERY}
  }
`;
```

#### Import Paths

Use the `@/` alias for imports to reference the `src` directory:

- `@/utils/dato/queries/...`
- `@/components/dato/...`

## Scripts and Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run live-preview` - Development with DatoCMS live preview

## Git Workflow

- Keep commits focused and atomic
- Follow existing commit message style (see recent commits)
- Don't commit without testing changes locally

## Code Quality

- Use consistent indentation (check existing files)
- Prefer modern JavaScript/TypeScript features
- Add console warnings for misuse, errors for invalid states
- Test components in both regular and live preview modes

## Accessibility

- Use semantic HTML elements
- Include `role="list"` on lists when styling removes default list semantics
- Ensure keyboard navigation works for scrollable components

## Things to Avoid

- Don't add unnecessary error handling for internal component logic
- Don't over-engineer simple components
- Don't add comments for self-explanatory code
- Don't create abstractions until they're needed in multiple places
