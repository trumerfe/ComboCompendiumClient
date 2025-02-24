# Styling Architecture Guide

## Overview
This document outlines our styling architecture using SCSS and BEM methodology, including structure, best practices, and common patterns.

## Directory Structure
```
styles/
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _functions.scss
│   └── _shared.scss
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _grid.scss
├── themes/
│   ├── _light.scss
│   └── _dark.scss
└── main.scss
```

## SCSS Architecture

### 1. Abstracts Layer

#### Variables
```scss
// abstracts/_variables.scss

// Colors
$colors: (
  'primary': #3b82f6,
  'secondary': #6b7280,
  'success': #10b981,
  'error': #ef4444,
  'warning': #f59e0b,
  'info': #3b82f6
);

// Typography
$font-sizes: (
  'xs': 0.75rem,
  'sm': 0.875rem,
  'base': 1rem,
  'lg': 1.125rem,
  'xl': 1.25rem,
  '2xl': 1.5rem
);

// Breakpoints
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);

// Spacing
$spacing: (
  '0': 0,
  '1': 0.25rem,
  '2': 0.5rem,
  '3': 0.75rem,
  '4': 1rem,
  '6': 1.5rem,
  '8': 2rem
);
```

#### Mixins
```scss
// abstracts/_mixins.scss

// Responsive design
@mixin responsive($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Flexbox utilities
@mixin flex($direction: row, $justify: flex-start, $align: stretch) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

// Typography
@mixin text-style($size, $weight: normal, $line-height: 1.5) {
  font-size: map-get($font-sizes, $size);
  font-weight: $weight;
  line-height: $line-height;
}
```

### 2. Base Layer

#### Reset
```scss
// base/_reset.scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

#### Typography
```scss
// base/_typography.scss
h1 {
  @include text-style('2xl', 600);
  margin-bottom: map-get($spacing, '4');
}

h2 {
  @include text-style('xl', 600);
  margin-bottom: map-get($spacing, '3');
}

p {
  @include text-style('base');
  margin-bottom: map-get($spacing, '4');
}
```

## BEM Methodology

### Naming Convention
```scss
.block {
  // Block styles

  &__element {
    // Element styles
  }

  &--modifier {
    // Modifier styles
  }
}
```

### Example Implementation
```scss
.card {
  background: white;
  border-radius: 0.5rem;
  padding: map-get($spacing, '4');

  &__header {
    @include flex(row, space-between, center);
    margin-bottom: map-get($spacing, '3');
  }

  &__title {
    @include text-style('lg', 600);
  }

  &__content {
    margin-bottom: map-get($spacing, '4');
  }

  &__footer {
    @include flex(row, flex-end, center);
  }

  &--highlighted {
    border: 2px solid map-get($colors, 'primary');
  }
}
```

## Theme System

### Theme Configuration
```scss
// themes/_light.scss
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f3f4f6;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
}

// themes/_dark.scss
[data-theme="dark"] {
  --color-bg-primary: #1f2937;
  --color-bg-secondary: #111827;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #e5e7eb;
  --color-border: #374151;
}
```

### Usage
```scss
.component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

## Component Styling

### Component Structure
```
ComponentName/
├── ComponentName.jsx
├── ComponentName.scss
└── index.js
```

### Component-Specific Styles
```scss
// components/Button/Button.scss
.button {
  @include flex(row, center, center);
  padding: map-get($spacing, '2') map-get($spacing, '4');
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &__icon {
    margin-right: map-get($spacing, '2');
  }

  &--primary {
    background-color: map-get($colors, 'primary');
    color: white;

    &:hover {
      background-color: darken(map-get($colors, 'primary'), 10%);
    }
  }

  &--secondary {
    background-color: map-get($colors, 'secondary');
    color: white;
  }
}
```

## Responsive Design

### Breakpoint Usage
```scss
.component {
  width: 100%;

  @include responsive('md') {
    width: 50%;
  }

  @include responsive('lg') {
    width: 33.333%;
  }
}
```

## Best Practices

1. **File Organization**
   - Keep styles modular and organized
   - Use partial files with meaningful names
   - Follow consistent directory structure

2. **BEM Naming**
   - Use descriptive, clear names
   - Avoid deep nesting
   - Keep modifiers focused

3. **Variables and Mixins**
   - Use design tokens for consistency
   - Create reusable mixins
   - Maintain a single source of truth

4. **Responsive Design**
   - Mobile-first approach
   - Use breakpoint mixins
   - Avoid fixed dimensions

5. **Performance**
   - Minimize nesting
   - Use efficient selectors
   - Avoid !important

6. **Maintainability**
   - Document complex styles
   - Keep components focused
   - Use consistent formatting

## Common Patterns

### Grid System
```scss
.grid {
  display: grid;
  gap: map-get($spacing, '4');

  &--cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &--cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  @include responsive('md') {
    &--cols-md-2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
```

### Card Pattern
```scss
.card {
  &__media {
    position: relative;
    padding-top: 56.25%; // 16:9 aspect ratio
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    padding: map-get($spacing, '4');
  }
}
```

### Form Elements
```scss
.form {
  &__group {
    margin-bottom: map-get($spacing, '4');
  }

  &__label {
    display: block;
    margin-bottom: map-get($spacing, '2');
    @include text-style('sm', 500);
  }

  &__input {
    width: 100%;
    padding: map-get($spacing, '2');
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;

    &:focus {
      outline: none;
      border-color: map-get($colors, 'primary');
    }
  }
}
```