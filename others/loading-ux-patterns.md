# Loading UX Patterns (Angular) — Practical Cheat Sheet

Use this as a consistent rulebook for when to show a top progress bar vs skeletons vs spinners,
across routes, lists, tables, modals, and forms.

---

## Core principles

- Prefer **contextual** feedback (near the thing the user interacted with) over global feedback.
- Avoid blocking the whole UI unless the whole UI is truly unavailable.
- Use skeletons for “first meaningful paint”; use spinners/progress for “already have UI, now
  updating”.
- Keep UI stable: minimize layout shifts and “jumps”.

---

## What to use, when

### 1) Top progress bar (global)

Use when:

- The user initiates a **route/navigation** change (URL changes, page-level transition).
- A “page-level” fetch is happening and the user’s focus is not on a single component.
- You are loading a new route + its data (and possibly lazy chunks).

Avoid when:

- Only one component (table/list/widget) is updating.
- A single button action is running (save, delete, submit). Prefer button spinner.

Good for:

- Apps like Google/GitHub-style navigation: immediate feedback after click, no full-page blocking.

---

### 2) Skeleton loaders

Use when:

- It’s the **first load** of a view or a major section and you want instant structure.
- The layout is predictable (table rows/columns, card grid shapes).

Best practices:

- Skeleton should match real layout (columns, spacing, typical content height).
- Don’t show skeleton repeatedly for minor refreshes; it becomes distracting.

Avoid when:

- You already have real content and are just re-fetching updated results (use refresh indicators
  instead).
- The user is performing small actions that shouldn’t “reset” the UI.

---

### 3) Inline spinners (localized)

Use when:

- A user clicks a specific control: **button, icon button, row action, toggle**, etc.
- You are fetching data required before opening something (modal/sidebar) and you don’t want to show
  an empty shell.

Pattern:

- Disable the clicked control + show a small spinner inside it.
- Keep surrounding UI interactive if possible.

Avoid when:

- Long-running global navigation is happening (prefer top progress bar).

---

### 4) Local linear progress bar (component-scoped)

Use when:

- A **table/list** is updating due to pagination, sorting, filtering, refresh.
- You want progress feedback without wiping the content.

Placement:

- Attach to the top edge of the table/list container (not the browser top).

Avoid when:

- It’s the initial load (skeleton is better).

---

### 5) Full-page blocking spinner/overlay

Use only when:

- The whole app cannot be used (auth handshake, mandatory migration, hard dependency).
- You must prevent _any_ interaction for safety reasons (rare).

Avoid for:

- Normal route changes, table refresh, modal open, form submit.

---

## Routing (navigation) rules

### Recommended modern routing behavior

- Do not block route activation “just to fetch data”.
- Navigate immediately, show:
    - **Top progress bar** for the transition.
    - Inside the new view: skeleton for the main layout if needed.

When resolvers are OK:

- If you _must_ guarantee data exists before rendering (e.g., SEO/SSR needs, or critical auth
  gating).
- Keep resolver usage selective, not for every page.

---

## List page patterns (cards or table)

### Initial page load (first time user sees page)

Cards:

- Show **card skeleton grid** matching expected layout.

Table:

- Show **table skeleton** matching columns + ~5–10 rows.

### Subsequent refreshes (search/filter/sort/pagination)

Goal: tell user “updating” without wiping context.

Table (pagination/filter/sort):

- Keep existing rows visible.
- Show **local linear progress bar** at container top.
- Optionally disable pagination controls while request runs.

Cards (filter/search/sort):

- Keep cards visible if feasible.
- Show a **small inline spinner** near filter/search area OR local linear progress bar for the card
  container.

### Infinite scroll (card view)

- Don’t re-skeleton the whole page.
- Append a **bottom-of-list spinner** (or “Loading more…”).
- Keep already loaded cards stable and interactive.

### Explicit “Load more”

- Disable the button + show **spinner inside the button**.

---

## “How do I show loading on 2nd/3rd fetch?” (without skeleton)

Choose one:

1. **Local linear progress bar** on the results container.
2. **Inline spinner** near the control that triggered it (search input, filter apply button).
3. Preserve content + show subtle “Refreshing…” text indicator (good for dashboards).

Avoid:

- Replacing existing content with skeleton repeatedly (feels like flicker/reset).

---

## Modals and sidebars

### Case A: Needs data before it is useful (edit form, detail panel)

Best pattern:

- Don’t open empty overlay.
- On trigger click: disable trigger + show **spinner inside trigger**.
- When data arrives: open modal/sidebar fully populated.

Why:

- Prevents user from seeing blank fields/placeholder confusion.

### Case B: Overlay can open immediately (shell is useful even while loading)

Best pattern:

- Open overlay immediately.
- Inside body:
    - Skeleton for form/content layout OR
    - Centered spinner if layout is not predictable.

Use this when:

- Showing the overlay itself provides context (title, tabs, structure), even if body loads.

### Submitting inside modal/sidebar

- Disable primary action (Save/Submit) + show **button spinner**.
- Keep overlay open until success; then close + show success toast/snackbar.
- On error: keep open, show inline field errors or a non-blocking error banner.

---

## Forms & buttons

### Form invalid state

- Disable submit button until form is valid (standard modern behavior).
- Still show validation messages so users know what to fix.

### Form submit (valid -> saving)

- Disable submit button + show **spinner inside button**.
- If save affects only part of page, do not show full-page overlay.

### Row actions (delete, archive, retry)

- Show spinner only in that row/action area.
- Keep rest of table usable.

---

## Quick decision map

- Is it a **route change**? → Top progress bar.
- Is it **first time layout** (no content yet)? → Skeleton.
- Is it a **single control action** (button/toggle/row action)? → Inline spinner in that control.
- Is it a **component refresh** (table/list updates) while content exists? → Local linear progress
  bar (and optionally disable that component’s controls).
- Does the entire app become unusable? → Full-page blocking (rare).

---

## Recommended “standard set” to implement in your Angular app

1. Global top progress bar driven by router navigation start/end.
2. Component-scoped loading API:
    - `isLoadingInitial` → skeleton
    - `isRefreshing` → local linear bar
    - `isActionLoading` → inline button spinner
3. Per-feature conventions:
    - Lists/tables never re-skeleton on every request.
    - Modals: either “fetch-then-open with button spinner” OR “open shell + skeleton inside”.

---
