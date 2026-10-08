# osfc.io

## 📑 Table of Contents

- [Project Setup](#-project-setup)
- [Project Structure](#-project-structure)
- [Astro Commands](#-astro-commands)
- [Creating Components](#-creating-components)
- [Setting Up CSS](#-setting-up-css)
- [Using JavaScript](#-using-javascript)
- [Local images](#-local-images)
- [Helpful Tips](#-helpful-tips)

## 🛠️ Project Setup

```sh
npm install
npm run dev
```

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
// Data from a content collection or other source
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
