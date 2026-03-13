# Angular 21

An enterprise-grade Angular 21 application built with a strict standalone-first architecture, highly
optimized reactive state management via `@ngrx/signals`, and comprehensive code quality automation.

## 🚀 Architectural Overview

This project is structured for high scalability, enforcing strict domain boundaries and a clear
separation of concerns.

- **Framework:** [Angular 21](https://angular.dev/) (Strict Standalone Components)
- **State Management:** `@ngrx/signals` (Custom Feature & Shared Domain pattern)
- **Styling:** SCSS (Modular ITCSS-inspired architecture)
- **Code Quality:** ESLint, Prettier, Husky, and `lint-staged`

## 📂 Project Structure

```text
angular-21/
├─ .husky/                # Git hooks for automated pre-commit linting/formatting
├─ docs/                  # Internal architectural standards and style guides
├─ public/                # Static assets (fonts, images, SCSS architecture)
│  └─ scss/               # Global styles, variables, mixins, themes, layout grids
├─ src/
│  ├─ app/
│  │  ├─ configs/         # Environment-agnostic app configurations
│  │  ├─ core/            # Singleton services, interceptors, guards, strategies
│  │  ├─ pages/           # Routable feature modules and their respective stores
│  │  ├─ shared/          # Reusable UI components, pipes, directives, utilities
│  │  └─ store/           # Root-provided shared domain stores (e.g., Layout, Viewport)
│  ├─ environments/       # Environment-specific configuration variables
│  └─ types/              # Global TypeScript declaration files
```

### Directory Roles

| Directory | Purpose                                                                                                                            |
| :-------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `core/`   | Framework-level implementations. Contains HTTP interceptors, global error handlers, route strategies, and foundational singletons. |
| `pages/`  | Feature domains. Each page manages its own route-scoped NgRx Signal Store, ensuring state is created and destroyed with the route. |
| `shared/` | Highly reusable, stateless presentation logic. Subdivided into `composites`, `fallbacks`, `skeletons`, and `widgets`.              |
| `store/`  | Root-scoped state management. Strictly reserved for data shared across multiple domains (e.g., `viewport-store`, `layout-store`).  |

## 📖 Developer Standards & Documentation

Before contributing to this repository, please review the strict architectural guidelines located in
the `docs/` directory. **Adherence to these standards is required for all PR approvals.**

- [File Naming Conventions](docs/file-naming.md) — Naming rules for standalone components,
  configurations, and barrel exports.
- [Access Modifiers](docs/access-modifiers.md) — Strict encapsulation rules (`public`, `protected`,
  `private`) for template vs. class usage.
- [State Management Architecture](docs/store-patterns.md) — Rules for cross-store communication,
  snapshot actions, and the `patchState` boundary.
- [Loading UX Patterns](docs/loading-ux-patterns.md) — Implementation guides for View Transitions,
  skeleton loaders, and localized spinners.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm (v10.x or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd angular-21
    ```

2. Install dependencies (this automatically registers Husky Git hooks):

    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`. The application will automatically reload if you change
    any of the source files.

## 📜 CLI Commands

| Command          | Description                                                         |
| :--------------- | :------------------------------------------------------------------ |
| `npm start`      | Starts the local development server.                                |
| `npm run build`  | Compiles the application into the `dist/` directory for production. |
| `npm run lint`   | Runs ESLint to identify code quality issues.                        |
| `npm run format` | Runs Prettier to automatically format code across the workspace.    |

## 🛡️ Code Quality & Git Hooks

This project enforces code quality automatically via **Husky** and **lint-staged**.

When executing `git commit`, the pre-commit hook intercepts the action and automatically runs:

1. `eslint --fix` on all staged `.ts` and `.html` files.
2. `prettier --write` on all staged `.scss`, `.css`, `.json`, and `.md` files.

If linting errors cannot be automatically resolved, the commit will be aborted until the developer
manually fixes the highlighted issues. If the `.git` directory is ever recreated, run `npx husky` to
restore the hooks.
