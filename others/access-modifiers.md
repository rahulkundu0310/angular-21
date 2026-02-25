# Angular Access Modifier Reference

## Core Rule

Ask one question: **who needs to access this member?**

- Only the template → `protected`
- Only inside the class (effects, methods) → `private`
- Template + inside the class → `protected` (protected is accessible within the class itself)
- External consumers / public API → `public`
- Should the value never be reassigned? → add `readonly`

---

## Quick Reference

| Member Type                                                                               | Modifier             | Reason                                                            |
| ----------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------- |
| **Dependency Injection**                                                                  | `private readonly`   | Internal implementation detail, never exposed                     |
| **`input()` / `input.required()`**                                                        | `public readonly`    | Part of the component's public API surface                        |
| **`output()`**                                                                            | `public readonly`    | Part of the component's public API surface                        |
| **`model()`**                                                                             | `public readonly`    | Part of the component's public API surface                        |
| **Queries** (`viewChild`, `contentChild`, `viewChildren`, `contentChildren`) — class only | `private readonly`   | Internal implementation detail, never reaches template            |
| **Queries** — template only or template + class                                           | `protected readonly` | Not public API; `protected` covers both template and class access |
| **Queries** — external API                                                                | `public readonly`    | Rare; only if consumers need direct access to the query ref       |
| **Store property — template only**                                                        | `protected readonly` | Not public API, not needed outside component                      |
| **Store property — class only** (effect, method)                                          | `private readonly`   | Never reaches the template                                        |
| **Store property — template + class**                                                     | `protected readonly` | `protected` covers both template and class access                 |
| **`computed()` — template only**                                                          | `protected readonly` | Derived UI state, not public API                                  |
| **`computed()` — class only** (effect, method)                                            | `private readonly`   | Internal derivation, never reaches template                       |
| **`computed()` — template + class**                                                       | `protected readonly` | `protected` covers both                                           |
| **`computed()` — external API**                                                           | `public readonly`    | Rare; only if consumers need the derived value                    |
| **Internal class variables** (non-signal)                                                 | `private`            | Standard encapsulation                                            |

---

## Examples

```ts
@Component({ ... })
export class MyComponent {

    // DI — always private readonly
    private readonly myStore = inject(MyStore);
    private readonly router = inject(Router);

    // Inputs / Outputs / Models — always public readonly
    public readonly value = input<string>();
    public readonly valueChange = output<string>();
    public readonly checked = model<boolean>(false);

    // Queries — readonly + scope by usage
    private readonly inputRef = viewChild<ElementRef>('inputRef');         // class only
    protected readonly listRef = viewChild<ElementRef>('listRef');         // template + class

    // Store properties
    protected readonly menuItems = this.myStore.menuItems;                 // template only
    protected readonly breadcrumbs = this.myStore.breadcrumbs;            // template + effect
    private readonly internalFlag = this.myStore.someInternalFlag;        // class only

    // Computed signals
    protected readonly isRequired = computed(() => ...);                   // template only
    protected readonly groupClasses = computed(() => ...);                 // template + class
    private readonly derivedCount = computed(() => ...);                   // class only (e.g. used in effect)

    // Effects
    private readonly syncEffect = effect(() => {
        // can freely read private, protected, or public members
        const count = this.derivedCount();
        const items = this.menuItems();
    });
}
```

---

## Things to Remember

- `protected` is not template-only — it is accessible inside the class too (effects, methods,
  lifecycle hooks). You do not need to escalate to `public` just because both the template and an
  effect use the same signal.
- `readonly` on a signal prevents the **reference** from being reassigned. The signal's value can
  still be updated internally via `patchState` or `set` — `readonly` is about the property slot, not
  the signal's inner value.
- `public` on a computed or store property is a design smell in most cases. Prefer exposing state
  changes via `output()` instead.
- Style guide references:
    - `readonly` → https://angular.dev/style-guide#use-readonly-for-properties-that-shouldnt-change
    - `protected` →
      https://angular.dev/style-guide#use-protected-on-class-members-that-are-only-used-by-a-components-template
