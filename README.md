# Angular 21

An enterprise-grade Angular 21 application built with a strict **standalone-first architecture**,
highly optimized reactive state management via `@ngrx/signals`, and comprehensive code quality
automation.

---

## 🚀 Architectural Overview

This project is structured for high scalability, enforcing strict domain boundaries and a clear
separation of concerns.

- **Framework:** [Angular 21](https://angular.dev/) (Strict Standalone Components)
- **State Management:** `@ngrx/signals` (Custom Feature & Shared Domain pattern)
- **Styling:** SCSS (ITCSS-inspired architecture via `public/scss`)
- **Change Detection:** `OnPush` (Global Default for Performance)
- **Code Quality:** ESLint, Prettier, Husky, and `lint-staged`

---

## 📂 Project Structure

```text
angular-21/
├── .husky/                # Git hooks (pre-commit linting, formatting enforcement)
├── docs/                  # Internal architecture, coding standards, and store patterns
├── public/                # Static assets and global UI resources
│   ├── data/              # Static JSON data (e.g., countries, translations)
│   ├── icons/             # Custom SVG icons and favicons
│   ├── images/            # Static imagery and logos
│   └── scss/              # Global ITCSS: abstracts, base, layouts, themes, vendors
├── src/
│   ├── app/
│   │   ├── configs/       # App settings: menus, icons, third-party lib configurations
│   │   ├── core/          # Infrastructure: auth, http agents, interceptors, providers
│   │   ├── pages/         # Routed feature domains (Dashboard, Users, Analytics)
│   │   ├── shared/        # UI building blocks: composites, widgets, directives, pipes
│   │   └── store/         # Global Signal Stores and functional extensions (with-*)
│   ├── environments/      # Environment-specific files (dev, staging, prod)
│   ├── types/             # Global TypeScript declarations and ambient types
│   └── styles.scss        # Project-level style overrides
├── .eslintrc.json         # ESLint rules and Angular-specific linting profiles
├── .lintstagedrc          # Configuration for lint-staged (pre-commit triggers)
├── .prettierrc            # Prettier code formatting rules
├── angular.json           # CLI workspace: build targets, budgets, and port 5454
├── package.json           # Project dependencies and custom scripts
└── tsconfig.json          # Root TypeScript configuration
```

---

## 📁 Directory & File Roles

| Path              | Responsibility                                                                                                                  |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **app/configs/**  | Centralized configuration for the app wiring, menu structures, and icon sets.                                                   |
| **app/core/**     | **The "Engine":** Low-level infrastructure. Contains auth logic, HTTP interceptors, global error handling, and providers.       |
| **app/pages/**    | **The "Business":** Domain-driven feature folders. Contains routed components, feature-specific Signal Stores, and Zod schemas. |
| **app/shared/**   | **The "Library":** Reusable UI components (Form Fields, Widgets), directives, and pipes. Zero dependencies on `pages`.          |
| **app/store/**    | **The "State":** Global Signal Stores for cross-cutting concerns (e.g., UI state, global progress, notifications).              |
| **public/scss/**  | **The "Skin":** ITCSS architecture. Includes global variables, mixins, and theme tokens (light/dark).                           |
| **angular.json**  | Workspace management. Configures the **5454** port, SCSS include paths, and schematic defaults.                                 |
| **.lintstagedrc** | Optimization for Git: runs linting/formatting only on changed files to keep commits fast.                                       |

---

## ⚙️ Development Standards (Schematics)

To maintain architectural integrity, the `angular.json` workspace enforces the following standards
during code generation:

- **Change Detection:** `OnPush` is the default for all components to ensure optimal performance.
- **Component Structure:** Components default to `display: block` with external templates and SCSS
  styles.
- **Zero-Test Policy:** CLI generators are configured with `skipTests: true` to prioritize custom
  integration and E2E testing strategies over auto-generated specs.
- **Style Preprocessing:** Global SCSS include paths are mapped to `public/scss`, allowing clean
  `@use 'abstracts'` imports without relative paths.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js:** v20.x or higher
- **npm:** v10.x or higher
- **Angular CLI:** `npm install -g @angular/cli`

### Installation

1. **Clone & Enter:** git clone <repository-url> cd angular-21

2. **Setup Dependencies:** npm install

3. **Launch Dev Environment:** npm start

Navigate to **http://localhost:5454/**. The application serves on port `5454` by default.

---

## 📜 CLI Commands

| Command                 | Description                                                     |
| :---------------------- | :-------------------------------------------------------------- |
| `npm start`             | Starts the local development server on **port 5454**.           |
| `npm run build`         | Compiles for production with strict 6MB initial bundle budgets. |
| `npm run build:staging` | Builds using `environment.staging.ts` file replacements.        |
| `npm run lint`          | Runs ESLint across all `.ts` and `.html` files.                 |
| `npm run format`        | Runs Prettier to automatically format the workspace.            |

---

## 🧠 Architecture Decisions: Why @ngrx/signals?

We have opted for **NgRx SignalStore** over traditional Redux-based NgRx Store for the following
reasons:

1. **Native Reactivity:** Seamless integration with Angular Signals, reducing the need for
   `AsyncPipe`.
2. **Reduced Boilerplate:** No need for separate Actions, Reducers, or Selectors.
3. **Functional Extensions:** Share logic using custom features like `withRequestStatus()` or
   `withStorage()`.
4. **OnPush Optimization:** Native signal support makes `OnPush` change detection highly efficient.

---

## 🛡️ Code Quality & Git Hooks

This project enforces code quality automatically via **Husky** and **lint-staged**.

When executing `git commit`, the pre-commit hook intercepts the action and automatically runs:

1. **ESLint (`--fix`)**: Checks logic and accessibility.
2. **Prettier (`--write`)**: Standardizes formatting.

**Budgets:** Production builds fail if the initial bundle exceeds **6MB** or any component style
exceeds **150KB**.
