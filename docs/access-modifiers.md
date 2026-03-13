# Angular Access Modifier Reference

This document outlines the strict access modifier standards used across this Angular 21 project to
enforce proper encapsulation and define explicit public APIs.

## Core Rule

Ask one question: **who needs to access this member?**

- Only the template → `protected`
- Only inside the class (effects, helpers, getters) → `private`
- Template + inside the class → `protected` (`protected` is fully accessible within the class)
- External consumers / public API via `@ViewChild` or injection → `public`
- Should the reference never be reassigned? → add `readonly`

---

## Quick Reference

### Signals & Injections

| Member Type                                               | Modifier             | Reason                                                        |
| --------------------------------------------------------- | -------------------- | ------------------------------------------------------------- |
| **Dependency Injection** (`inject()`)                     | `private readonly`   | Internal implementation detail, never exposed.                |
| **`input()` / `input.required()`**                        | `public readonly`    | Part of the component's public API surface.                   |
| **`output()`**                                            | `public readonly`    | Part of the component's public API surface.                   |
| **`model()`**                                             | `public readonly`    | Part of the component's public API surface.                   |
| **Queries** (`viewChild`, `contentChildren`) — class only | `private readonly`   | Internal implementation detail, never reaches template.       |
| **Queries** — template only or template + class           | `protected readonly` | Not public API; `protected` covers template and class access. |
| **Store property** — template only                        | `protected readonly` | Not public API, not needed outside the component.             |
| **Store property** — class only (effect, method)          | `private readonly`   | Internal use only, never reaches the template.                |
| **`computed()`** — template only                          | `protected readonly` | Derived UI state, not a public API.                           |
| **`computed()`** — class only                             | `private readonly`   | Internal derivation, never reaches the template.              |

### Standard Properties & Methods

| Member Type                                     | Modifier    | Reason                                                       |
| ----------------------------------------------- | ----------- | ------------------------------------------------------------ |
| **Template Event Handlers** (`onClick`)         | `protected` | Bound to template events, not meant to be called externally. |
| **Internal helper methods**                     | `private`   | Encapsulated logic, never reaches template or external API.  |
| **Lifecycle Hooks** (`ngOnInit`, `ngOnDestroy`) | `public`    | Required by Angular framework interfaces.                    |
| **External API methods** (`open()`, `close()`)  | `public`    | Explicitly designed to be called by parent components.       |
| **Internal state variables** (non-signal)       | `private`   | Standard encapsulation.                                      |
| **Template-bound variables** (non-signal)       | `protected` | Required for template interpolation, not public API.         |
| **Getters / Setters** — template bound          | `protected` | Safe read/write access for the UI.                           |

---

## Examples

```ts
import {
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	model,
	output,
	viewChild,
	OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { MyStore } from './my-store';

@Component({
	selector: 'app-example',
	templateUrl: './example.html'
})
export class ExampleComponent implements OnInit {
	// ==========================================
	// Dependencies
	// ==========================================
	private readonly myStore = inject(MyStore);
	private readonly router = inject(Router);

	// ==========================================
	// Inputs, Outputs & Models (Public API)
	// ==========================================
	public readonly label = input<string>('');
	public readonly checked = model<boolean>(false);
	public readonly valueChange = output<string>();

	// ==========================================
	// Queries
	// ==========================================
	private readonly inputRef = viewChild<ElementRef>('inputRef'); // class only
	protected readonly listRef = viewChild<ElementRef>('listRef'); // template + class

	// ==========================================
	// Store Properties
	// ==========================================
	protected readonly menuItems = this.myStore.menuItems; // template only
	protected readonly breadcrumbs = this.myStore.breadcrumbs; // template + effect
	private readonly internalFlag = this.myStore.someInternalFlag; // class only

	// ==========================================
	// Computed Signals
	// ==========================================
	protected readonly isRequired = computed(() => this.label() !== ''); // template only
	private readonly derivedCount = computed(() => this.menuItems().length); // class only

	// ==========================================
	// Non-Signal State
	// ==========================================
	protected isExpanded = false; // template + class
	private calculationCache = new Map<string, number>(); // class only

	// ==========================================
	// Effects
	// ==========================================
	private readonly syncEffect = effect(() => {
		// Can freely read private, protected, or public members
		const count = this.derivedCount();
		const items = this.menuItems();
	});

	// ==========================================
	// Lifecycle Hooks
	// ==========================================
	public ngOnInit(): void {
		this.initializeComponent();
	}

	// ==========================================
	// Methods
	// ==========================================

	/** Template event handler */
	protected onToggleClick(): void {
		this.isExpanded = !this.isExpanded;
		this.formatData();
	}

	/** Public API meant to be called via @ViewChild */
	public resetState(): void {
		this.isExpanded = false;
	}

	/** Internal helper */
	private formatData(): void {
		// Internal logic hidden from template and external consumers
	}
}
```
