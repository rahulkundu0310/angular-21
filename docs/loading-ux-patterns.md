# Loading UX Patterns — Practical Cheat Sheet

This document outlines the standard loading patterns for this Angular 21 project. It establishes a
modern, seamless UI/UX by entirely replacing legacy top-progress bars with View Transitions,
Skeleton Loaders, and contextual inline feedback.

---

## Core Principles

- **No Global Progress Bars**: Navigation and data fetching should feel integrated into the page
  architecture, not bolted onto the top of the browser window.
- **Contextual Feedback**: Always place loading indicators near the specific element the user
  interacted with.
- **Perceived Performance**: Use animated skeleton loaders to establish the layout instantly, making
  the application feel faster and reducing layout shifts.
- **Stable UI**: Never replace existing data with a skeleton loader during a simple refresh; use
  subtle, localized indicators to maintain context.

---

## 1. Route Navigation (Page Transitions)

### The Pattern: View Transitions API

Do not block route activation or show a top progress bar. Instead, rely on Angular's native support
for the **View Transitions API** combined with immediate navigation.

**Implementation Rules:**

- Navigate immediately when the user clicks a link.
- Let the View Transition API handle the cross-fade or slide animation between the old route and the
  new route.
- Once the new route component mounts, display a **Skeleton Loader** matching the intended layout
  while data resolves.

_When to deviate:_ If critical auth checks are required, use a blocking resolver. Otherwise, always
prefer immediate navigation with a skeleton state.

---

## 2. Skeleton Loaders (First Meaningful Paint)

### Use When:

- A user visits a page or major section for the first time.
- The layout is predictable (e.g., table rows, data grids, profile cards).

### Best Practices:

- **Match the Final UI**: Skeletons must mimic the exact size, shape, and position of the actual
  content to prevent layout shifts.
- **Animation**: Always use a left-to-right "wave" or "shimmer" animation. A static skeleton looks
  like a broken UI.
- **Limit Usage**: Never use a skeleton loader for a simple data refresh if the user already has
  data on the screen.

---

## 3. Localized Inline Spinners

### Use When:

- A user interacts with a specific control (button, toggle, row action, icon button).
- You are fetching data specifically required to open a modal or sidebar.

### Best Practices:

- **Buttons**: Disable the clicked button and display a small, looping spinner _inside_ the button
  itself.
- **Row Actions**: Show the spinner only in the specific table row being acted upon (e.g., deleting
  a record) while keeping the rest of the table interactive.
- **Pre-fetching Modals**: Disable the trigger button, show an inline spinner on the trigger, and
  only open the modal once the data has fully arrived.

---

## 4. Local Area Refresh Indicators

### Use When:

- A table, list, or grid is updating due to filtering, sorting, or pagination.

### The Pattern:

- **Keep Data Visible**: Do not wipe the existing data. Do not revert to a skeleton loader.
- **Feedback**: Show a subtle inline spinner near the filter controls, or a localized
  "Refreshing..." text indicator.
- **Interaction**: Optionally dim the list/table slightly (via opacity) and disable pagination
  controls while the request runs to prevent duplicate submissions.

---

## 5. Modals and Sidebars

### Case A: Data is required before opening (Edit Form)

- **Do not open an empty shell.**
- On click: Disable the trigger button and show an inline spinner inside it.
- Once data arrives: Open the modal fully populated.

### Case B: The shell provides immediate context (Dashboards, Multi-step flows)

- **Open immediately.** Let the View Transition handle the overlay animation.
- Inside the body: Display a skeleton loader that matches the form or content layout.

### Submitting inside a Modal

- Keep the modal open.
- Disable the primary action button and show an inline spinner.
- Close the modal only upon success, followed by a toast/snackbar notification.

---

## 6. Full-Page Blocking Overlay (Rare)

### Use Only When:

- The entire application is genuinely unusable (e.g., critical mandatory migration, initial auth
  handshake).
- Preventing _any_ background interaction is a strict security requirement.

_Never use full-page blocking for normal route changes, form submissions, or table refreshes._

---

## Quick Decision Map

| Scenario                          | Recommended Pattern                                |
| :-------------------------------- | :------------------------------------------------- |
| **Route Change**                  | Immediate navigation + View Transitions API.       |
| **Initial Page Load (No Data)**   | Animated Skeleton Loader matching the UI.          |
| **Single Action (Submit/Delete)** | Inline spinner inside the clicked button.          |
| **Data Refresh (Filter/Sort)**    | Keep data visible + localized spinner/opacity dim. |
| **Infinite Scroll**               | Append spinner at the bottom of the list.          |
| **Critical Auth Check**           | Full-page blocking overlay (Rare).                 |
