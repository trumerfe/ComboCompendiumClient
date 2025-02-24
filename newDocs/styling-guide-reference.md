# Combo Compendium - Dark Theme Styling Guide

## Table of Contents
1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Component Styles](#component-styles)
   - [Cards with Glassmorphism](#cards-with-glassmorphism)
   - [Buttons](#buttons)
   - [Form Elements](#form-elements)
5. [Layout Guidelines](#layout-guidelines)
6. [Utility Classes](#utility-classes)
7. [Implementation Guide](#implementation-guide)
8. [Component Examples](#component-examples)

## Color System

Our application uses a dark theme with purple accents and glassmorphism effects.

### Base Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--color-primary` | `#6d28d9` | Main purple accent |
| `--color-primary-light` | `#8b5cf6` | Lighter purple for hover states |
| `--color-primary-dark` | `#5b21b6` | Darker purple for active states |
| `--color-bg-main` | `#0f172a` | Main background (dark blue/slate) |
| `--color-bg-card` | `rgba(30, 41, 59, 0.7)` | Semi-transparent card background |
| `--color-bg-elevated` | `#1e293b` | Slightly elevated surface |

### Text Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--color-text-primary` | `#f8fafc` | Primary text (almost white) |
| `--color-text-secondary` | `#cbd5e1` | Secondary text (light gray) |
| `--color-text-muted` | `#94a3b8` | Muted text (medium gray) |

### Accent Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--color-accent-1` | `#f472b6` | Pink accent |
| `--color-accent-2` | `#38bdf8` | Sky blue accent |
| `--color-accent-3` | `#4ade80` | Green accent |

### Feedback Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--color-success` | `#22c55e` | Success state (green) |
| `--color-warning` | `#f59e0b` | Warning state (amber) |
| `--color-error` | `#ef4444` | Error state (red) |
| `--color-info` | `#3b82f6` | Info state (blue) |

### Glassmorphism Effects

| Variable | Value | Description |
|----------|-------|-------------|
| `--glass-blur` | `16px` | Blur amount for backdrop-filter |
| `--glass-opacity` | `0.7` | Opacity for glass effects |
| `--glass-border-color` | `rgba(255, 255, 255, 0.1)` | Subtle border for glass effect |
| `--card-border-radius` | `12px` | Rounded corners for cards |
| `--card-shadow` | `0 4px 20px rgba(0, 0, 0, 0.25)` | Shadow for cards |

### Transition Speeds

| Variable | Value | Description |
|----------|-------|-------------|
| `--transition-fast` | `150ms` | Fast transitions (buttons) |
| `--transition-normal` | `250ms` | Normal transitions (cards) |
| `--transition-slow` | `350ms` | Slow transitions (page transitions) |

## Typography

### Font Families

| Variable | Value | Description |
|----------|-------|-------------|
| `--font-main` | `'Inter', system-ui, -apple-system, sans-serif` | Main body text |
| `--font-heading` | `'Inter', system-ui, -apple-system, sans-serif` | Headings |
| `--font-mono` | `'Roboto Mono', monospace` | Monospace text (code) |

### Font Sizes

| Variable | Value | Description |
|----------|-------|-------------|
| `--text-xs` | `0.75rem` | Extra small text (12px) |
| `--text-sm` | `0.875rem` | Small text (14px) |
| `--text-base` | `1rem` | Base text size (16px) |
| `--text-lg` | `1.125rem` | Large text (18px) |
| `--text-xl` | `1.25rem` | Extra large text (20px) |
| `--text-2xl` | `1.5rem` | 2X large text (24px) |
| `--text-3xl` | `1.875rem` | 3X large text (30px) |
| `--text-4xl` | `2.25rem` | 4X large text (36px) |

### Font Weights

| Variable | Value | Description |
|----------|-------|-------------|
| `--weight-light` | `300` | Light text |
| `--weight-normal` | `400` | Normal text |
| `--weight-medium` | `500` | Medium text |
| `--weight-semibold` | `600` | Semi-bold text |
| `--weight-bold` | `700` | Bold text |

### Line Heights

| Variable | Value | Description |
|----------|-------|-------------|
| `--line-height-tight` | `1.25` | Tight line height (headings) |
| `--line-height-normal` | `1.5` | Normal line height (body) |
| `--line-height-loose` | `1.75` | Loose line height (large text) |

## Spacing System

Our spacing system is based on a 4px grid, with consistent increments.

| Variable | Value | Description |
|----------|-------|-------------|
| `--spacing-1` | `0.25rem` | 4px spacing |
| `--spacing-2` | `0.5rem` | 8px spacing |
| `--spacing-3` | `0.75rem` | 12px spacing |
| `--spacing-4` | `1rem` | 16px spacing |
| `--spacing-5` | `1.25rem` | 20px spacing |
| `--spacing-6` | `1.5rem` | 24px spacing |
| `--spacing-8` | `2rem` | 32px spacing |
| `--spacing-10` | `2.5rem` | 40px spacing |
| `--spacing-12` | `3rem` | 48px spacing |
| `--spacing-16` | `4rem` | 64px spacing |
| `--spacing-20` | `5rem` | 80px spacing |

### Component-Specific Spacing

| Variable | Value | Description |
|----------|-------|-------------|
| `--page-padding` | `var(--spacing-6)` | Standard page padding |
| `--card-padding` | `var(--spacing-6)` | Standard card padding |
| `--section-spacing` | `var(--spacing-12)` | Spacing between sections |
| `--component-gap` | `var(--spacing-6)` | Gap between components |

## Component Styles

### Cards with Glassmorphism

Cards use a glassmorphism effect with subtle transparency and blur.

```scss
@mixin glass-effect {
  background: var(--color-bg-card);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-color);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
}

.card {
  @include glass-effect;
  padding: var(--card-padding);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }
  
  &__header {
    margin-bottom: var(--spacing-4);
  }
  
  &__content {
    margin-bottom: var(--spacing-4);
  }
  
  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-2);
  }
  
  // Card variations
  &--primary {
    border-top: 4px solid var(--color-primary);
  }
  
  &--accent-1 {
    border-top: 4px solid var(--color-accent-1);
  }
}
```

### Buttons

Consistent button styles with various types and states.

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  border-radius: 8px;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  
  &--primary {
    background-color: var(--color-primary);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-dark);
    }
  }
  
  &--secondary {
    background-color: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
  
  &--glass {
    @include glass-effect;
    color: var(--color-text-primary);
  }
  
  &--large {
    padding: var(--spacing-3) var(--spacing-6);
    font-size: var(--text-lg);
  }
  
  &--small {
    padding: var(--spacing-1) var(--spacing-3);
    font-size: var(--text-sm);
  }
}
```

### Form Elements

Standard form elements with proper styling.

```scss
.form {
  &__group {
    margin-bottom: var(--spacing-6);
  }
  
  &__label {
    display: block;
    margin-bottom: var(--spacing-2);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }
  
  &__input {
    width: 100%;
    padding: var(--spacing-3);
    background-color: var(--color-bg-elevated);
    border: 1px solid rgba(203, 213, 225, 0.2);
    border-radius: 8px;
    color: var(--color-text-primary);
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.2);
    }
  }
}
```

## Layout Guidelines

### Containers

```scss
.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--page-padding);
  padding-right: var(--page-padding);
}
```

### Page Structure

```scss
.page {
  padding: var(--page-padding);
  
  &__header {
    margin-bottom: var(--spacing-8);
    
    &-title {
      font-size: var(--text-3xl);
      margin-bottom: var(--spacing-2);
    }
    
    &-subtitle {
      color: var(--color-text-secondary);
    }
  }
  
  &__content {
    margin-bottom: var(--spacing-8);
  }
  
  &__section {
    margin-bottom: var(--section-spacing);
  }
}
```

### Grid System

```scss
.grid {
  display: grid;
  gap: var(--component-gap);
  grid-template-columns: 1fr;
  
  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include respond-to('xl') {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### App Layout

```scss
.app {
  display: flex;
  min-height: 100vh;
  
  &__sidebar {
    width: 280px;
    flex-shrink: 0;
    background-color: var(--color-bg-elevated);
    border-right: 1px solid var(--glass-border-color);
    padding: var(--spacing-6);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
  
  &__main {
    flex: 1;
    min-width: 0;
  }
}
```

## Utility Classes

### Spacing Utilities

```scss
// Margin utilities
.m-0 { margin: 0; }
.m-2 { margin: var(--spacing-2); }
.m-4 { margin: var(--spacing-4); }
.m-6 { margin: var(--spacing-6); }

// Margin-top
.mt-0 { margin-top: 0; }
.mt-2 { margin-top: var(--spacing-2); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-6 { margin-top: var(--spacing-6); }

// Margin-bottom
.mb-0 { margin-bottom: 0; }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }

// Padding utilities
.p-0 { padding: 0; }
.p-2 { padding: var(--spacing-2); }
.p-4 { padding: var(--spacing-4); }
.p-6 { padding: var(--spacing-6); }

// More spacing utilities...
```

### Helper Classes

```scss
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

.w-full { width: 100%; }
.h-full { height: 100%; }

.rounded { border-radius: var(--card-border-radius); }
.overflow-hidden { overflow: hidden; }
.relative { position: relative; }
.absolute { position: absolute; }

// More helper classes...
```

## Implementation Guide

### Directory Structure

```
src_new/styles/
├── abstracts/
│   ├── _variables.scss
│   ├── _breakpoints.scss
│   └── _mixins.scss
├── base/
│   ├── _reset.scss
│   └── _typography.scss
├── components/
│   ├── _card.scss
│   ├── _buttons.scss
│   └── _forms.scss
├── layout/
│   └── _containers.scss
├── utils/
│   ├── _spacing.scss
│   └── _helpers.scss
└── main.scss
```

### Main SCSS File

```scss
// styles/main.scss

// Base styles
@import 'base/reset';
@import 'base/typography';

// Abstract styles
@import 'abstracts/variables';
@import 'abstracts/breakpoints';
@import 'abstracts/mixins';

// Component styles
@import 'components/card';
@import 'components/buttons';

// Layout styles
@import 'layout/containers';

// Utility styles
@import 'utils/spacing';
@import 'utils/helpers';
```

### Using BEM Methodology

All components follow the Block Element Modifier (BEM) methodology:

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

Example:
```scss
.game-card {
  // Game card block
  
  &__image {
    // Game card image element
  }
  
  &--featured {
    // Featured game card modifier
  }
}
```

### Responsive Design

Use the `respond-to` mixin for responsive designs:

```scss
.component {
  width: 100%;
  
  @include respond-to('md') {
    width: 50%;
  }
  
  @include respond-to('lg') {
    width: 33.333%;
  }
}
```

## Component Examples

### Game Card Component

```jsx
// GameCard.jsx
const GameCard = ({ game, onSelect }) => {
  return (
    <div className="game-card">
      <div className="game-card__image-container">
        <img 
          src={game.imageUrl} 
          alt={game.name} 
          className="game-card__image" 
        />
        <div className="game-card__overlay">
          <div className="game-card__badge">
            {game.releaseYear || 'New'}
          </div>
        </div>
      </div>
      <div className="game-card__content">
        <h3 className="game-card__title">{game.name}</h3>
        <p className="game-card__subtitle">{game.developer}</p>
        <div className="game-card__footer">
          <span className="game-card__platform">
            {game.platform}
          </span>
          <button 
            className="game-card__select-button"
            onClick={() => onSelect(game)}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};
```

```scss
// GameCard.scss
.game-card {
  @include glass-effect;
  transition: all var(--transition-normal);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    
    .game-card__image {
      transform: scale(1.05);
    }
  }
  
  &__image-container {
    overflow: hidden;
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
    transition: transform var(--transition-normal);
  }
  
  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-2);
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    display: flex;
    justify-content: flex-end;
  }
  
  &__badge {
    background-color: var(--color-accent-1);
    color: white;
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: 4px;
  }
  
  // More styles...
}
```

### Page Component

```jsx
// GameSelectionPage.jsx
const GameSelectionPage = () => {
  return (
    <div className="page game-selection-page">
      <header className="page__header">
        <h1 className="page__header-title">
          <span className="text-gradient">Choose Your Game</span>
        </h1>
        <p className="page__header-subtitle">
          Select a fighting game to view its characters and combos
        </p>
      </header>
      
      <div className="page__content">
        <GameSelection />
      </div>
    </div>
  );
};
```

```scss
// GameSelectionPage.scss
.game-selection-page {
  min-height: 100vh;
  
  .page__header {
    text-align: center;
    margin-bottom: var(--spacing-12);
    
    &-title {
      font-size: var(--text-4xl);
      margin-bottom: var(--spacing-4);
      
      @include respond-to('md') {
        font-size: calc(var(--text-4xl) * 1.25);
      }
    }
    
    &-subtitle {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
  }
}
```
