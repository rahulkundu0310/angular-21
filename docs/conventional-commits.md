# Conventional Commits Reference

A quick reference for writing consistent, meaningful commit messages.

---

## Format

```
<type>: <short description>
- Optional bullet point for more detail
- Another bullet point if needed
```

- **Type** — always lowercase
- **Description** — short, imperative tense ("add" not "added", "fix" not "fixed")
- **Bullet points** — only when the commit needs more context

---

## Single Line vs Bullet Points

### Use a single line when the change is focused and self-explanatory

One commit, one clear thing done. The type and description together tell the full story.

```
fix: resolve eslint errors and configure lint rules for angular 21 boilerplate
chore: update angular to v21.2.6 and cdk to v21.2.5
refactor: migrate password and phone fields to signal-based FormValueControl architecture
```

When to stick to a single line:

- The commit touches one area or concern
- The description already makes the change obvious
- A dependency bump, config update, or small fix

---

### Use bullet points when the commit covers multiple related changes

The first line is still the summary. Bullets explain the individual pieces underneath.

```
feat: implement core animation architecture and interface motion
- Configure custom easing variables, keyframes, and global animation mixins.
- Standardize structural documentation across typography, reset, grid, and animation stylesheets.
- Integrate entrance and departure sequences for navigation sub-menus and error feedback.
- Apply standardized sliding transitions to the initial app preloader and global overlays.
```

```
feat: update SCSS architecture, error states, and app flow
- Add SCSS functions, mixins, variables, reset, and typography
- Add shared error state component for exception pages
- Remove Angular input/output aliases per style guide
- Fix sign-out flicker with smart delay before clearing store
```

When to use bullet points:

- The commit touches multiple files across different concerns
- Each bullet represents a distinct, describable change
- A reviewer would benefit from knowing what was done within the commit
- The summary line alone would not make the scope clear

---

### Rules for bullet points

- Each bullet should start with a capital letter
- Each bullet should be a complete thought, not a fragment
- Aim for 2–5 bullets — if you have more, consider splitting into separate commits
- Do not use bullets just to pad a simple commit — one clear line is always better

---

## Types

### `feat` — New Feature

Use when you are **building something new** that did not exist before.

```
feat: add password field component with visibility toggle
feat: scaffold analytics, dashboard, and users feature modules
feat: setup App component with global overlays and sign-in persistence
```

When to use:

- New components, pages, or modules
- New functionality added to an existing feature
- New routes or navigation structures
- New stores, services, or providers

---

### `fix` — Bug Fix

Use when you are **correcting something that was broken or behaving incorrectly**.

```
fix: resolve eslint errors in angular 21 boilerplate
fix: refine sign-out flow with delayed session teardown
fix: prevent autofill from triggering on phone field
```

When to use:

- Fixing broken UI behavior
- Correcting logic errors
- Resolving linting or compilation errors
- Patching incorrect data handling

---

### `refactor` — Code Restructure

Use when you are **changing how code is written without changing what it does**.

```
refactor: migrate password and phone fields to signal-based architecture
refactor: update signal form types and annotate form utilities
refactor: centralize auth session handling into dedicated service
```

When to use:

- Restructuring existing components or services
- Migrating to a new pattern (e.g. signals, standalone components)
- Simplifying or cleaning up logic without behaviour change
- Renaming files, classes, or functions for clarity

---

### `chore` — Maintenance

Use for **work that does not affect production code or user-facing behaviour**.

```
chore: bump javascript-time-ago, lodash-es, and zod to latest versions
chore: update angular to v21.2.6 and cdk to v21.2.5
chore: Work in progress — stash progress on scss grid system
```

When to use:

- Updating dependencies or package versions
- Config file changes (eslint, tsconfig, angular.json)
- WIP stash commits
- Build tooling updates
- Node or npm version bumps

---

### `docs` — Documentation

Use when you are **only adding or updating documentation**.

```
docs: add and standardize inline comments across all configuration files
docs: standardize TSDoc blocks for eslint and typescript workspace configurations
docs: add store patterns and loading UX pattern guides
```

When to use:

- Adding or updating README
- Writing or editing files in the `/docs` folder
- Adding inline comments or TSDoc blocks
- Updating code examples or guides

---

### `style` — Formatting Only

Use when you are **only changing formatting with no logic changes**.

```
style: reformat template whitespace across components
style: enforce single quotes across all typescript files
style: fix indentation in platform layout template
```

When to use:

- Whitespace or indentation fixes
- Enforcing quote style
- Removing trailing spaces or blank lines
- Prettier or formatter auto-fixes

---

### `perf` — Performance

Use when you are **improving speed or efficiency** without changing behaviour.

```
perf: lazy load analytics and integrations feature modules
perf: memoize navigation items computation in platform store
perf: switch image assets to WebP format
```

When to use:

- Lazy loading routes or modules
- Optimising change detection strategy
- Reducing bundle size
- Caching expensive computations

---

### `test` — Tests

Use when you are **only adding or updating tests**.

```
test: add unit tests for signal form utilities
test: add e2e tests for sign-in flow
test: update specs after phone field refactor
```

When to use:

- Writing new unit or integration tests
- Updating existing tests after a refactor
- Adding test utilities or mocks

---

### `ci` — CI/CD Pipeline

Use when you are **changing continuous integration or deployment configuration**.

```
ci: add github actions workflow for pull request checks
ci: configure lint and test steps in pipeline
ci: update node version in ci environment
```

When to use:

- Adding or editing GitHub Actions, GitLab CI, etc.
- Updating deployment scripts
- Changing environment variables in pipeline config

---

### `build` — Build System

Use when you are **changing the build system or its dependencies**.

```
build: configure custom webpack optimisation for production
build: update angular build target to es2022
build: add path aliases to tsconfig for cleaner imports
```

When to use:

- Changes to `angular.json` build configuration
- tsconfig path or target changes
- Adding or modifying build scripts in `package.json`

---

### `revert` — Reverting a Commit

Use when you are **undoing a previous commit**.

```
revert: feat: add password field component with visibility toggle
```

When to use:

- Rolling back a feature that caused issues
- Undoing a bad merge or change

---

## Quick Decision Guide

| What you did                                 | Type       |
| -------------------------------------------- | ---------- |
| Built a new component, page, or feature      | `feat`     |
| Fixed a bug or broken behaviour              | `fix`      |
| Restructured code without changing behaviour | `refactor` |
| Updated dependencies or config files         | `chore`    |
| Added or updated comments or docs            | `docs`     |
| Fixed formatting only                        | `style`    |
| Improved speed or reduced bundle size        | `perf`     |
| Added or updated tests                       | `test`     |
| Changed CI/CD pipeline                       | `ci`       |
| Changed build configuration                  | `build`    |
| Undid a previous commit                      | `revert`   |

---

## Good Habits

- Always use **imperative tense** — "add", "fix", "update", not "added", "fixed", "updated"
- Keep the first line **under 72 characters**
- Use **bullet points** only when a single line is not enough to explain the change
- Never use `chore` for new features — if it ships to users, it is `feat`
- When in doubt between `refactor` and `chore` — if it touches application logic, use `refactor`
