# dato-astro-boilerplate

## 📑 Table of Contents

- [Project Setup](#-project-setup)
- [Project Structure](#-project-structure)
- [Astro Commands](#-astro-commands)
- [Creating Components](#-creating-components)
- [Setting Up CSS](#-setting-up-css)
- [Using JavaScript](#-using-javascript)
- [DatoCMS Integration](#-datocms-integration)
- [Images from DatoCMS](#-images-from-datocms)
- [Local images](#-local-images)
- [Modular Content](#-modular-content)
- [Structured Text](#-structured-text)
- [Server Side Rendering](#-server-side-rendering-ssr--live-preview)
- [Helpful Tips](#-helpful-tips)

## 🛠️ Project Setup

> 🔔 **Important:** This boilerplate depends on a matching DatoCMS Starter Project. Before you start, make sure you have cloned the Dato Starter Project in your DatoCMS account. The content structure and queries in this codebase expect that starter project to be present.

Once your Dato project is set up, create a `.env` file in the root of your project and add your DatoCMS API token:

```env
DATOCMS_API_KEY=your-datocms-api-token
```

Replace `your-datocms-api-token` with your own API token from DatoCMS. You can find or generate this token in your DatoCMS project settings. Never commit your real API key to a public repository.

---

## 🚀 Project Structure

Inside of your project, you'll see the following folders and files:

```text
/
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── scripts/
│   │   └── svg/
│   ├── components/
│   │   ├── DummyComponent
│   │   │   ├── DummyComponent.astro
│   │   │   └── DummyComponent.css
│   │   └── dato/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/[blogPost].astro
│   ├── styles/
│   └── utils/
│       └── build-scripts/
├── tokens/
│   ├── colors.ts
│   ├── fontSize.ts
│   ├── fontWeight.ts
│   └── spacing.ts
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧞 Astro Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

---

## 🧱 Creating Components

In this boilerplate, components follow a specific structure that helps organize code and styles efficiently:

### Component Structure

Each component gets its own directory with two main files:

```text
src/components/
└── MyComponent/
    ├── MyComponent.astro
    ├── MyComponent.css
    └── MyComponent.js (optional)
```

- Use PascalCase for component folder and file names (e.g., `ProductCard/ProductCard.astro`)
- The `.astro` file contains the component markup and logic
- The `.css` file contains component-specific styles

### Creating a New Component

Here's how to create a new component:

1. Create a new folder in `src/components/` with your component name
2. Create two files inside this folder with the same name:
   - `ComponentName.astro` - Component template and logic
   - `ComponentName.css` - Component-specific styles

Example component:

```astro
---
// src/components/ProductCard/ProductCard.astro
const { title, price, imageUrl = "/placeholder.jpg" } = Astro.props;
---

<div class="product-card">
  <img src={imageUrl} alt={title} />
  <h3>{title}</h3>
  <p class="price">${price.toFixed(2)}</p>
  <button>Add to cart</button>
</div>

<!-- Import the CSS at the end of the component -->
<style>
  @import "./ProductCard.css";
</style>
```

```css
/* src/components/ProductCard/ProductCard.css */
.product-card {
  border: 1px solid var(--color-gray-light);
  border-radius: 8px;
  padding: var(--space-s);
  transition: transform 0.2s ease;
}

...
```

### Using the Component

Import and use your component in any Astro page or other component:

```astro
---
// src/pages/shop.astro
import ProductCard from "@/components/ProductCard/ProductCard.astro";
---

<h1>Our Products</h1>
<div class="product-grid">
  <ProductCard title="Coffee Mug" price={12.99} imageUrl="/images/mug.jpg" />
  <ProductCard title="T-Shirt" price={24.99} />
</div>
```

### CSS Scoping

When you import a CSS file using the `@import` inside the `<style>` tag, Astro automatically scopes those styles to the component. This means:

- Styles are only loaded when the component is used
- Class names won't conflict with other components
- The CSS is specific to this component

**Note:** If you need global styles instead of component-scoped styles, refer to the [Setting Up CSS](#-setting-up-css) section for how to create global utility classes and design tokens.

---

## 🎨 Setting Up CSS

### 1. Design Tokens

All design tokens for this project are located in the `tokens/` directory. Here you can adjust core design values such as colors, font sizes, font weights, and spacing by editing the following files:

- `tokens/colors.ts`
- `tokens/fontSize.ts`
- `tokens/fontWeight.ts`
- `tokens/spacing.ts`

These tokens are used to generate the CSS utility and variable files:

- `src/styles/generated/_utilities.css`
- `src/styles/generated/_variables.css`

Both of these generated files are already included in your main `global.css` file, so any changes you make to the tokens will be reflected throughout your project after regeneration.

### 2. CSS Structure: Blocks, Layout, Utilities

The main global CSS for your project is organized into the following folders:

- `src/styles/blocks/`
- `src/styles/layout/`
- `src/styles/utilities/`

All CSS files in these folders that start with an underscore (`_`) will automatically be included in the project. This convention helps keep your global styles organized and maintainable.

**Important:** Only add CSS here that should be globally available across your project, not styles that are specific to a single component. Before adding a file to the `blocks` folder, consider if the styles really belong globally or if they should be scoped to a component instead.

### 3. Generated Utility Classes

This boilerplate automatically generates utility classes from your design tokens. When you update your tokens in the `tokens/` directory, the following utility classes will be regenerated:

**Font Size Utilities**

```css
.text-xs {
  font-size: var(--text-xs);
}
.text-m {
  font-size: var(--text-m);
}
/* Additional sizes: s, l, xl, 2xl, 3xl */
```

**Color Utilities**

```css
.bg-black {
  background-color: var(--color-black);
}

.text-white {
  color: var(--color-white);
}
/* Generated for all colors in tokens/colors.ts */
```

**Spacing Utilities**

```css
/* Padding utilities */
.p-xs {
  padding: var(--space-xs);
}

.py-m {
  padding-block: var(--space-m);
}
/* Also: pt (top), pb (bottom), px (horizontal) for all spacing values */

/* Stack spacing utilities */
:where(.stack-s) > * + * {
  --stack-space: var(--space-s);
  margin-block-start: var(--stack-space, 1rem);
}
/* Generated for all spacing values */
```

**Font Weight Utilities**

```css
.weight-regular {
  font-weight: 400;
}

.weight-bold {
  font-weight: 700;
}
/* Generates all weights from the fontWeights.ts file */
```

**Line Height Utilities**

```css
.leading-tight {
  line-height: var(--leading-tight);
}

.leading-normal {
  line-height: var(--leading-normal);
}
/* Generated for all lineHeight values */
```

These utility classes are generated by the `src/utils/build-scripts/helpers/utilitiy-classes.ts` file during the build process. You can customize which utilities are generated by modifying this file.

---

### Using media queries

For media queries, we use [custom media queries](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media) that are defined in `src/styles/_media.css`.

```css
/* src/styles/_media.css */
@custom-media --s (width >= 25em);
@custom-media --m (width >= 40em);
```

You can extend these and use them anywhere in your CSS like this:

```css
.my-class {
  color: red;

  @media (--s) {
    color: blue;
  }
}
```

---

## ⚙️ Using JavaScript

### Global scripts

If you want to write a script that is used globally (like animations) or in components that are used more than once (e.g. modular content blocks) throughout the project, place it in the `src/js` directory. You can then import it on the layout page or any page by adding

```html
<script>
  import "@/js/filename.js";
</script>
```

at the bottom of the file.

### Single-use scripts

E.g. when writing the logic for the navigation component that will only be used once, you can place the file in the component folder:

```text
src/components/
└── MyComponent/
    ├── MyComponent.astro
    ├── MyComponent.css
    └── MyComponent.js
```

In `MyComponent.astro`, you can then import it at the bottom of the file

```html
<script>
  import "./MyComponent.js";
</script>
```

## 📝 DatoCMS Integration

### 1. Queries

All GraphQL queries for fetching content from DatoCMS are organized in the `src/utils/dato/queries/` directory. Each file in this folder defines a query for a specific content type or use case. You can add new queries here as your content model grows.

### 2. The `content.config.ts` File

> ⚠️ **Note:** When using Server Side Rendering (SSR) and a QueryListener, collections are not updated in real time. We tend to avoid using collections in this scenario. However, collections can still be useful if you need to perform more complex alterations of the queried content and want to have that content available in different locations.

The file `src/content.config.ts` is where you register all your DatoCMS collections for use in Astro. Each collection is defined using the `defineCollection` function, which loads data using a query from the queries folder.

To add a new collection:

1. Create a new query in `src/utils/dato/queries/` for your content type.
2. Import your query and use `defineCollection` in `content.config.ts` to register it. For example:

   ```ts
   import { MY_NEW_QUERY } from "./utils/dato/queries/myNewQuery";

   const myNewCollection = defineCollection({
     loader: async () => {
       const data = await fetchDatoCMS(MY_NEW_QUERY);
       return data.allMyNewItems;
     },
   });
   ```

3. Add your new collection to the exported `collections` object:

   ```ts
   export const collections = {
     myNewCollection,
   };
   ```

4. You can now use your new collection in any Astro page or component by calling Astro's `getCollection` function with the collection name. For example:

   ```ts
   import { getCollection } from "astro:content";
   const items = await getCollection("myNewCollection");
   ```

### 3. Single Instance Queries

For single-instance content (such as a homepage or settings), you can use a direct query with `fetchDatoCMS` and the appropriate query from your queries folder.

For example, in `src/pages/index.astro`:

```astro
---
import { fetchDatoCMS } from "@/utils/dato";
import { HOMEPAGE_QUERY } from "@/utils/dato/queries/homepage";
const { homepage } = await fetchDatoCMS(HOMEPAGE_QUERY);
---

<h1>{homepage.title}</h1>
```

---

## 🖼️ Images from DatoCMS

For rendering images from DatoCMS, this project provides a `DatoPicture` component (`src/components/dato/DatoPicture/DatoPicture.astro`). This component wraps Astro's `<Picture>` and makes it easy to render responsive, optimized images from DatoCMS.

**Key features:**

- Renders a responsive `<picture>` element for a DatoCMS image object.
- Supports custom alt text, aspect ratio, widths, formats, fit modes, and more.
- Handles responsive image sizes and multiple output formats (e.g., WebP, JPEG).
- Allows for decorative images and priority loading.

**Props:**

| Prop           | Type     | Default                         | Description                                                                  |
| :------------- | :------- | :------------------------------ | :--------------------------------------------------------------------------- |
| `image`        | object   | required                        | The DatoCMS image object. Must contain `url`, `width`, `height`.             |
| `alt`          | string   | -                               | Alternative text for the image. Falls back to `image.alt` or `image.title`.  |
| `ratio`        | number   | -                               | Override the original aspect ratio. If not provided, original ratio is used. |
| `pictureClass` | string   | -                               | CSS class for the outer `<picture>` element.                                 |
| `class`        | string   | -                               | CSS class for the image element.                                             |
| `widths`       | number[] | [200, 400]                      | List of responsive image widths. Largest value is used to determine height.  |
| `formats`      | string[] | ["webp"]                        | Output formats to generate (e.g., "webp", "jpeg").                           |
| `fit`          | string   | "crop"                          | The DatoCMS image fit mode ("crop", "fill", etc.).                           |
| `sizes`        | string   | "(min-width: 22em) 30vw, 100vw" | Sizes attribute for responsive behavior.                                     |
| `emptyAlt`     | boolean  | false                           | If true, forces alt text to be empty (for decorative images).                |
| `priority`     | boolean  | false                           | If true, marks the image as high-priority (loads eagerly).                   |

**Examples:**

Basic usage:

```astro
<DatoPicture image={myDatoImage} alt="Saskia Michalski" />
```

Advanced usage:

```astro
<DatoPicture
  image={myDatoImage}
  ratio={16 / 9}
  widths={[300, 600, 900]}
  formats={["webp", "jpeg"]}
  fit="crop"
  sizes="(min-width: 600px) 50vw, 100vw"
  emptyAlt
  priority
  pictureClass="gallery-image"
/>
```

---

## Local images

For serving local images, you can use Astro's `<Picture>` and `<Image>` Components from 'astro:assets'

```astro
---
import { Picture } from "astro:assets";
import localImage from "@/assets/images/laptop.jpg";
---

<Picture
  src={localImage}
  width={1600}
  widths={[600, 800, 1200, 1600]}
  sizes="100vw"
  formats={["avif", "webp"]}
  alt=""
/>
```

## 🧩 Modular Content

In DatoCMS, we use a block called Modular Content. Inside this, you define a Modular Content Block, where you specify all the blocks that can be used within modular content. Currently, these are "Structured Text" and "Gallery".

The matching query for modular content is found in `src/utils/dato/queries/modularContent.js`. This query includes all possible blocks, for example:

```graphql
... on GalleryRecord {
  id
  _modelApiKey
  __typename
  images {
    ${IMAGE_CONTENT_QUERY}
  }
}
```

The `src/components/dato/ModularContent/ModularContent.astro` component loops through all blocks and renders the appropriate component based on the `__typename` field (so make sure `__typename` is always included in your query). Each block component receives its data via a prop called `block`.

**How to add a new block to Modular Content:**

1. Create the new block in DatoCMS.
2. Add it to the Modular Content Block in your content model.
3. Add the corresponding query for your new block to `modularContent.js`.
4. Create a new component for your block in `src/components/dato/`.
5. Update the `ModularContent.astro` component to handle your new block in the switch statement.

This approach makes it easy to extend your modular content with new block types as your project grows.

---

## 📕 Structured Text

This project uses the `StructuredText` component from the `@datocms/astro` package to render rich text content from DatoCMS.

**Basic usage:**

First, import the component:

```js
import { StructuredText } from "@datocms/astro";
```

Then use it in your template:

```astro
<StructuredText data={datoDASTInformation} />
```

**Advanced usage with Modular Content Blocks:**

In DatoCMS, inside the Modular Content Block, you can add a Structured Text block. Within this, you can allow a group of custom blocks (in Dato, this group is named "📕 Structured Text Blocks"). Only the blocks added to this group are allowed to be used inside the Structured Text block in modular content.

The `StructuredTextBlock.astro` component (`src/components/dato/StructuredTextBlock/StructuredTextBlock.astro`) wraps the `StructuredText` component and defines all the allowed `blockComponents` for rendering custom blocks.

This boilerplate is already set up to support the blocks `HighlightBox`, `Quote`, and `Image` inside Structured Text.

If you want to allow more blocks in Structured Text, follow these steps:

1. Create the new block inside DatoCMS.
2. In the Structured Text Block, allow this block in the Validations tab.
3. Add the needed query for your new block to `structured-text.js`.
4. Finally, in `StructuredTextBlock.astro`, add your new component to the `blockComponents` rendering options.

---

## 🌐 Server Side Rendering (SSR) & Live Preview

This boilerplate supports Server Side Rendering (SSR) for live preview and real-time updates. When you set the environment variable `LIVE_PREVIEW=true`, Astro switches from prerendering to SSR. This behavior is configured in `astro.config.mjs`.

To enable SSR, you also need an adapter. This boilerplate includes the Netlify adapter out of the box.

With SSR and the `QueryListener` component, you can receive live updates in Astro whenever content is published in DatoCMS. For a practical example, see `src/pages/blog/[blogPost].astro`.

**Important notes:**

- The Netlify adapter does not support SVG images. In preview mode, the `<DatoPicture>` component automatically converts SVGs to WebP format for compatibility.
- If you want to opt out of SSR for a specific page, add `export const prerender = true;` to the frontmatter. See `src/pages/[slug].astro` for an example.

For more details, refer to the official Astro documentation: [On-Demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/)

---

## 💡 Helpful Tips

This section contains practical tips and solutions for common tasks in this boilerplate.

### Looping Through Data in Astro

Looping through arrays in Astro can be done using JavaScript's `map()` method inside curly braces:

```astro
---
// Your data in the frontmatter
const items = ["Apple", "Banana", "Cherry"];
---

<ul>
  {items.map((item) => <li>{item}</li>)}
</ul>
```

When looping through more complex data:

```astro
---
// Data from DatoCMS or other source
const blogPosts = await getCollection("blogPosts");
---

<div class="post-list">
  {
    blogPosts.map((post) => (
      <article>
        <h2>{post.data.title}</h2>
        <p>{post.data.excerpt}</p>
        <a href={`/blog/${post.data.slug}`}>Read more</a>
      </article>
    ))
  }
</div>
```

### Conditional Rendering in Astro

Astro allows for simple conditional rendering using JavaScript expressions. You can use `&&` to show something when a condition is true (read as "if this condition, then show this"), or use `||` to show something when a condition is false (read as "show this, or if not available, show that instead"):

```astro
---
const isLoggedIn = true;
const user = { name: "John", isAdmin: false };
---

{isLoggedIn && <p>Welcome back!</p>}

{isLoggedIn ? <button>Log out</button> : <button>Log in</button>}

<!-- Checking for properties -->
{user.isAdmin && <div class="admin-panel">Admin Controls</div>}
```

You can also combine conditional rendering with loops:

```astro
<ul class="item-list">
  {
    items.map((item) => (
      <li>
        <h3>{item.title}</h3>
        {item.image && <img src={item.image} alt={item.title} />}
        {item.description || <p>No description available</p>}
      </li>
    ))
  }
</ul>
```

### Linking to collection items

To link to items in a collection, use the `getItemPath` helper function to generate the correct URL based on the collection and item slug. This approach keeps your links accurate even if your URL structure changes. First, define a path-prefix map in `src/utils/helpers/getItemPath.ts` as an object whose keys match the `_modelApiKey` of your DatoCMS collections, for example:

```js
const pathPrefixMap = {
  variable_page: "/",
  blog_post: "/blog/",
  product: "/shop/",
};
```

Make sure your collection queries always include both `_modelApiKey` and `slug`. Then, import the `getItemPath` helper from `@/utils/helpers/getItemPath.js` and use it when rendering links. For example:

```astro
---
import { getItemPath } from "@/utils/helpers/getItemPath";
import { getCollection } from "astro:content";
const blogPosts = await getCollection("blogPosts");
---

<ul class="blog-posts">
  {
    blogPosts.map((post) => (
      <li>
        <a href={getItemPath(post.data)}>Read more</a>
      </li>
    ))
  }
</ul>
```

### Adding Inline SVGs

To include SVGs directly in your markup (inline SVGs) rather than as external files:

1. Place your SVG files in the `src/assets/svg/` directory.
2. Import the SVG in your component:

```astro
---
import Logo from "@/assets/svg/logo.svg";
---
```

3. Use the imported SVG as a component in your template:

```astro
<Logo />
```

This approach preserves the full SVG markup, allowing you to style it with CSS and manipulate it with JavaScript. For example, in the `SiteHead.astro` component:

```astro
---
import Logo from "@/assets/svg/logo.svg";
---

<header class="site-head | bg-black text-white py-m">
  <div class="wrapper">
    <a href="/" class="logo"><Logo /></a>
    <!-- more content -->
  </div>
</header>
```

### Search Engine Optimization (SEO)

This boilerplate includes SEO support through DatoCMS's SEO fields. To use it:

1. Include `_seoMetaTags` in your DatoCMS query:

```js
// In your query file (e.g., src/utils/dato/queries/homepage.js)
export const HOMEPAGE_QUERY = `
  query {
    homepage {
      title
      _seoMetaTags {
        tag
        attributes
        content
      }
      // other fields...
    }
  }
`;
```

2. Pass the SEO data to the `BaseLayout` component:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import { fetchDatoCMS } from "@/utils/dato";
import { HOMEPAGE_QUERY } from "@/utils/dato/queries/homepage";

const { homepage } = await fetchDatoCMS(HOMEPAGE_QUERY);
---

<BaseLayout seo={homepage._seoMetaTags}>
  <h1>{homepage.title}</h1>
  <!-- Rest of your content -->
</BaseLayout>
```

The `BaseLayout` component will automatically render the appropriate meta tags for SEO, including title, description, Open Graph tags, and more. This helps search engines better understand and index your content.

### Using Custom Fonts

This boilerplate uses the variable font Sora. For adding additional fonts, we recommend using [Fontsource](https://fontsource.org/) instead of loading fonts directly from Google Fonts. This approach offers better performance and more control:

1. Install the font package from Fontsource:

```bash
npm install @fontsource-variable/montserrat
# or for non-variable fonts
npm install @fontsource/roboto
```

2. Import the font in your `BaseLayout.astro` file:

```astro
---
// Variable font
import "@fontsource-variable/montserrat";
// Or regular font with specific weights
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
---
```

3. Use the font in your CSS:

```css
/* In your global CSS or component CSS */
h1 {
  font-family: "Montserrat Variable", sans-serif;
}

p {
  font-family: "Roboto", sans-serif;
}
```
