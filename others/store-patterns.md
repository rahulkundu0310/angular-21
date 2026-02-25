# NgRx Signal Store Architecture Guide

## Multi-Store Patterns, Shared State, and Request Tracking

---

## Table of Contents

1. [The Problem Statement](#1-the-problem-statement)
2. [Core Architectural Rules](#2-core-architectural-rules)
3. [Layer Architecture](#3-layer-architecture)
4. [The God Object Problem and How We Avoid It](#4-the-god-object-problem-and-how-we-avoid-it)
5. [Naming Rules](#5-naming-rules)
6. [The Snapshot Action Pattern](#6-the-snapshot-action-pattern)
7. [Shared Domain Layer — Code](#7-shared-domain-layer--code)
8. [Feature Domain Layer — Code](#8-feature-domain-layer--code)
9. [Coupling Rules](#9-coupling-rules)
10. [Request Tracking — Selector Cleanup](#10-request-tracking--selector-cleanup)
11. [Quick Reference Decision Tree](#11-quick-reference-decision-tree)

---

## 1. The Problem Statement

In a large Angular app using NgRx Signal Store, we faced four compounding issues:

- **Request tracking noise** — `selectRequestStatus` generics were verbose and repetitive at call
  sites
- **Cross-store data needs** — Creating/updating a user requires master roles from the roles domain,
  but each domain has its own store
- **Multiple request UX** — When a page needs data from multiple sources, requests resolving at
  different times cause UI elements to pop in unexpectedly — bad UX
- **State ownership ambiguity** — If Store A needs data owned by Store B, who patches what? Patching
  another store's state from a foreign store was considered but correctly rejected as a violation

---

## 2. Core Architectural Rules

These rules were established through reasoning about what breaks down at scale. Every decision below
traces back to one of these.

**Rule 1 — Stores own their domain exclusively.** A store is the sole authority over its own state.
No other store, service, or component should call `patchState` on it except its own paired service
and internal methods.

**Rule 2 — Stores are scoped to their lifetime.** Feature stores are provided at the route level,
not root. They are created when you enter the route and destroyed when you leave. This prevents
stale data accumulation and memory bloat. Root-scoped stores are only for genuinely shared, app-wide
reference data.

**Rule 3 — Components talk to one store.** A component should only call methods on and read signals
from its own feature store. It reads shared domain data directly from shared stores as read-only
signals. It does not orchestrate across stores.

**Rule 4 — Name things by what they are, not by who uses them.** `CommonStore` describes a
relationship ("everyone uses this"). `AccessControlStore` describes a domain ("this manages access
control"). Names based on relationships become dumping grounds. Names based on domains stay bounded.

**Rule 5 — Group by functional cohesion, not by data shape.** Two pieces of state belong in the same
store if they change for the same business reason, are always configured together, and are always
needed together. Roles and permissions satisfy this. Countries and regions satisfy this. Roles and
countries do not.

---

## 3. Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  SHARED DOMAIN LAYER                         │
│                  (providedIn: 'root')                        │
│                                                              │
│  AccessControlService + AccessControlStore                   │
│    → master roles, permissions, role-permission mappings     │
│                                                              │
│  GeographyService + GeographyStore                           │
│    → countries, regions, cities, timezones                   │
│    (Named Geography not Location to avoid Angular's          │
│     built-in Location service naming conflict)               │
│                                                              │
│  LookupService + LookupStore                                 │
│    → status codes, categories, generic reference data        │
│                                                              │
│  ~3 to 6 stores max for even a large enterprise app          │
└───────────────────┬─────────────────────────────────────────┘
                    │  feature stores inject shared services
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
┌─────────┐   ┌──────────┐   ┌──────────┐
│UserStore│   │OrderStore│   │InvoiceStore│  ← FEATURE DOMAIN LAYER
│(route)  │   │(route)   │   │(route)   │     (provided at route level)
└─────────┘   └──────────┘   └──────────┘
     ▲
     │  component reads shared store signals directly
     │  component only calls methods on its own feature store
     │
┌─────────────────┐
│  UserComponent  │
└─────────────────┘
```

---

## 4. The God Object Problem and How We Avoid It

### The Failure Mode

The instinct when you have shared data across modules is to create a `CommonService` and
`CommonStore`. This feels right initially. It fails over time because the name "Common" is not a
domain — it is a relationship. It describes who uses the data, not what the data is. Because it
describes a relationship and not a thing, there is no natural boundary that stops it from growing.
Every developer who needs shared data adds to it. Two years later it has 47 methods and nobody wants
to touch it.

### The Fix

Every piece of "shared" data actually belongs to a real domain. Find that domain and name the store
after it.

```
❌ Wrong boundary:
   CommonService / CommonStore  ← grows forever, no natural limit

✅ Right boundary:
   AccessControlService + AccessControlStore  ← roles + permissions domain
   GeographyService     + GeographyStore      ← location reference data domain
   LookupService        + LookupStore         ← generic reference data domain
```

Each pair is small and focused. `AccessControlStore` will never have geography data added to it
because that would make no domain sense. The boundary is enforced by what the name describes, not by
a rule you have to remember to follow.

### How Many Shared Stores Will You Have?

Realistically 3 to 6, even in a large enterprise app. Genuinely shared reference data is finite.
Feature stores scale with your module count but shared stores only grow when a genuinely new
independent domain is introduced, which is rare.

---

## 5. Naming Rules

**Name stores by purpose, not by contents.**

| ❌ Contents-based (bad) | ✅ Purpose-based (good)     |
| ----------------------- | --------------------------- |
| `RolesPermissionsStore` | `AccessControlStore`        |
| `CountriesRegionsStore` | `GeographyStore`            |
| `CommonStore`           | (split into actual domains) |
| `HelperService`         | (find the actual domain)    |

**The one-sentence test.** Can you describe the store's responsibility in one sentence without using
"and" to join unrelated concerns? If yes, the boundary is right. If the "and" joins naturally
related things (roles and their permissions, countries and their regions), that is fine — cohesion,
not coupling.

```
✅ "AccessControlStore manages who can access what in the application."
✅ "GeographyStore manages geographic reference data — countries, regions, cities."
❌ "CommonStore manages roles, permissions, countries, status codes, and categories."
```

**Never name a service or store after a relationship:** `Common`, `Shared`, `Global`, `Util`,
`Helper`. If you cannot name it after the thing it manages, you have not found the right boundary
yet.

---

## 6. The Snapshot Action Pattern

### The Core Idea

A page's readiness is a **single atomic operation** from the component's perspective. Instead of
tracking multiple individual request statuses in a component, each page gets one snapshot action
that resolves everything it needs via `forkJoin`. The component tracks one signal. Either everything
is ready or it is not.

```
USER_CREATE_SNAPSHOT → forkJoin([masterRoles$, permissions$])
USER_UPDATE_SNAPSHOT → forkJoin([masterRoles$, permissions$, getUser$])
USER_LIST_SNAPSHOT   → forkJoin([getUsers$, userStats$])
```

### Two Distinct Action Types

Do not mix these. They serve different purposes and have different lifecycles.

```
Init Snapshots (one per page)
  USER_LIST_SNAPSHOT    → runs once on page load, loads all page data
  USER_CREATE_SNAPSHOT  → runs once on page load, loads form dependencies
  USER_UPDATE_SNAPSHOT  → runs once on page load, loads form dependencies + selected record

Mutations (triggered by user action)
  CREATE_USER   → triggered by form submit
  UPDATE_USER   → triggered by form submit
  DELETE_USER   → triggered by delete confirmation
```

The init snapshot tells you "page is ready to show content". The mutation action tells you "submit
succeeded or failed". By the time a mutation runs, the snapshot has already ensured all prerequisite
data is loaded. They should never be merged into one action.

---

## 7. Shared Domain Layer — Code

### How Shared Domain Pairs Work

Each shared domain is a service + store pair. The service owns the loading logic and patches its own
store. Feature stores inject the service only, never the shared store directly. Shared store state
is read by components as read-only signals.

The service uses a **cache-first pattern** — if data is already in the store, it returns it
immediately as `of(cached)` without making an API call. This means navigating between routes that
need the same shared data does not trigger redundant requests.

---

### `AccessControlStore` — Roles and Permissions

```typescript
// access-control.store.ts
interface IAccessControlState {
	masterRoles: IRole[];
	permissions: IPermission[];
}

export const AccessControlStore = signalStore(
	{ providedIn: 'root' },
	withState<IAccessControlState>({
		masterRoles: [],
		permissions: []
	})
	// No withRequestStatus — this store has no actions of its own.
	// No methods — AccessControlService is the sole authority for loading
	// and patching this store. The store is purely a state container.
);
```

```typescript
// access-control.service.ts
@Injectable({ providedIn: 'root' })
export class AccessControlService {
	private readonly http = inject(HttpClient);
	private readonly accessControlStore = inject(AccessControlStore);

	/**
	 * Ensures master roles are loaded. Returns cached data immediately on
	 * subsequent calls — no redundant API requests across route navigations.
	 * Patches AccessControlStore internally; callers receive the data but
	 * never interact with AccessControlStore directly.
	 */
	ensureMasterRoles$(): Observable<IRole[]> {
		const cached = this.accessControlStore.masterRoles();
		if (cached.length > 0) return of(cached);

		return this.http.get<IApiResponse<IRole[]>>('/api/master-roles').pipe(
			map((response) => response.data),
			tap((masterRoles) => patchState(this.accessControlStore, { masterRoles }))
		);
	}

	/**
	 * Ensures permissions are loaded. Same cache-first pattern.
	 */
	ensurePermissions$(): Observable<IPermission[]> {
		const cached = this.accessControlStore.permissions();
		if (cached.length > 0) return of(cached);

		return this.http.get<IApiResponse<IPermission[]>>('/api/permissions').pipe(
			map((response) => response.data),
			tap((permissions) => patchState(this.accessControlStore, { permissions }))
		);
	}
}
```

---

### `GeographyStore` — Countries, Regions, Cities, Timezones

Note: Named `GeographyService` not `LocationService` to avoid collision with Angular's built-in
`Location` service. The import paths would distinguish them, but an explicit name avoids any
ambiguity entirely.

```typescript
// geography.store.ts
interface IGeographyState {
	countries: ICountry[];
	regions: IRegion[];
	cities: ICity[];
	timezones: ITimezone[];
}

export const GeographyStore = signalStore(
	{ providedIn: 'root' },
	withState<IGeographyState>({
		countries: [],
		regions: [],
		cities: [],
		timezones: []
	})
	// Same pattern as AccessControlStore — state container only.
	// GeographyService owns loading and patching.
);
```

```typescript
// geography.service.ts
@Injectable({ providedIn: 'root' })
export class GeographyService {
	private readonly http = inject(HttpClient);
	private readonly geographyStore = inject(GeographyStore);

	ensureCountries$(): Observable<ICountry[]> {
		const cached = this.geographyStore.countries();
		if (cached.length > 0) return of(cached);

		return this.http.get<IApiResponse<ICountry[]>>('/api/countries').pipe(
			map((response) => response.data),
			tap((countries) => patchState(this.geographyStore, { countries }))
		);
	}

	ensureRegions$(countryCode: string): Observable<IRegion[]> {
		const cached = this.geographyStore.regions();
		if (cached.length > 0) return of(cached);

		return this.http.get<IApiResponse<IRegion[]>>(`/api/regions/${countryCode}`).pipe(
			map((response) => response.data),
			tap((regions) => patchState(this.geographyStore, { regions }))
		);
	}

	ensureTimezones$(): Observable<ITimezone[]> {
		const cached = this.geographyStore.timezones();
		if (cached.length > 0) return of(cached);

		return this.http.get<IApiResponse<ITimezone[]>>('/api/timezones').pipe(
			map((response) => response.data),
			tap((timezones) => patchState(this.geographyStore, { timezones }))
		);
	}
}
```

---

## 8. Feature Domain Layer — Code

### User Events

```typescript
// user-events.ts
export enum UserEvent {
	// Init snapshots — one per page with distinct data requirements
	USER_LIST_SNAPSHOT = 'USER_LIST_SNAPSHOT',
	USER_CREATE_SNAPSHOT = 'USER_CREATE_SNAPSHOT',
	USER_UPDATE_SNAPSHOT = 'USER_UPDATE_SNAPSHOT',

	// Mutations — triggered by user actions, independent of snapshots
	CREATE_USER = 'CREATE_USER',
	UPDATE_USER = 'UPDATE_USER',
	DELETE_USER = 'DELETE_USER'
}

export type TUserEvent = (typeof UserEvent)[keyof typeof UserEvent];

// Event map — associates each event with its resolved data type.
// This is what gives full TypeScript support for event data in selectors.
export type TUserEvents = {
	[UserEvent.USER_LIST_SNAPSHOT]: void;
	[UserEvent.USER_CREATE_SNAPSHOT]: void;
	[UserEvent.USER_UPDATE_SNAPSHOT]: IUser; // resolves with the fetched user
	[UserEvent.CREATE_USER]: IUser;
	[UserEvent.UPDATE_USER]: IUser;
	[UserEvent.DELETE_USER]: void;
};
```

---

### `UserStore` — Route-Scoped Feature Store

```typescript
// user.store.ts
interface IUserState {
	users: IUser[];
	selectedUser: IUser | null;
	userStats: IUserStats | null;
}

const initialState: IUserState = {
	users: [],
	selectedUser: null,
	userStats: null
};

export const UserStore = signalStore(
	// NOT providedIn: 'root' — provided at the route level.
	// Created on route enter, destroyed on route leave. No stale data.
	withState(initialState),
	withRequestStatus<IUserState, TUserEvent>({ events: values(UserEvent) }),
	withMethods((store) => {
		const userService = inject(UserService);
		const accessControlService = inject(AccessControlService); // service, not store
		const geographyService = inject(GeographyService); // service, not store

		/**
		 * Loads everything the user list page needs in one shot.
		 * forkJoin: nothing renders until all data is ready.
		 */
		const loadUserListSnapshot = rxMethod<void>(
			pipe(
				tap(() => store.markPending(UserEvent.USER_LIST_SNAPSHOT)),
				switchMap(() =>
					forkJoin([
						userService.getUsers().pipe(map((r) => r.data)),
						userService.getUserStats().pipe(map((r) => r.data))
					]).pipe(
						tap(([users, userStats]) => {
							store.markFulfilled(UserEvent.USER_LIST_SNAPSHOT, {
								users,
								userStats,
								message: 'Ready'
							});
						}),
						catchError((error) => {
							store.markRejected(UserEvent.USER_LIST_SNAPSHOT, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		/**
		 * Loads everything the create user page needs.
		 * Array form of forkJoin with ignored results (,[,]) is intentional —
		 * ensureMasterRoles$ and ensurePermissions$ are self-managing.
		 * They load into AccessControlStore internally. This store only needs
		 * to know they completed successfully before marking fulfilled.
		 */
		const loadUserCreateSnapshot = rxMethod<void>(
			pipe(
				tap(() => store.markPending(UserEvent.USER_CREATE_SNAPSHOT)),
				switchMap(() =>
					forkJoin([
						accessControlService.ensureMasterRoles$(), // self-managing → AccessControlStore
						accessControlService.ensurePermissions$() // self-managing → AccessControlStore
					]).pipe(
						tap(() => {
							store.markFulfilled(UserEvent.USER_CREATE_SNAPSHOT, {
								message: 'Ready'
							});
						}),
						catchError((error) => {
							store.markRejected(UserEvent.USER_CREATE_SNAPSHOT, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		/**
		 * Loads everything the update user page needs — same shared data
		 * plus the specific user record. selectedUser goes into UserStore state.
		 * masterRoles and permissions go into AccessControlStore (via service).
		 * Each store owns its own patch. No foreign patching.
		 */
		const loadUserUpdateSnapshot = rxMethod<number>(
			pipe(
				tap(() => store.markPending(UserEvent.USER_UPDATE_SNAPSHOT)),
				switchMap((userId) =>
					forkJoin([
						accessControlService.ensureMasterRoles$(), // → AccessControlStore
						accessControlService.ensurePermissions$(), // → AccessControlStore
						userService.getUser(userId).pipe(map((r) => r.data)) // → UserStore
					]).pipe(
						tap(([, , selectedUser]) => {
							// Only the result this store owns (selectedUser) is used here.
							// The [,,] destructuring makes intent explicit: first two are ignored.
							store.markFulfilled(UserEvent.USER_UPDATE_SNAPSHOT, {
								selectedUser,
								message: 'Ready'
							});
						}),
						catchError((error) => {
							store.markRejected(UserEvent.USER_UPDATE_SNAPSHOT, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		// Mutations — independent of snapshot, triggered by user action

		const createUser = rxMethod<ICreateUserPayload>(
			pipe(
				tap(() => store.markPending(UserEvent.CREATE_USER)),
				switchMap((payload) =>
					userService.createUser(payload).pipe(
						tap((result) => {
							store.markFulfilled(UserEvent.CREATE_USER, {
								data: result.data,
								message: result.message
							});
						}),
						catchError((error) => {
							store.markRejected(UserEvent.CREATE_USER, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		const updateUser = rxMethod<IUpdateUserPayload>(
			pipe(
				tap(() => store.markPending(UserEvent.UPDATE_USER)),
				switchMap((payload) =>
					userService.updateUser(payload).pipe(
						tap((result) => {
							store.markFulfilled(UserEvent.UPDATE_USER, {
								data: result.data,
								message: result.message
							});
						}),
						catchError((error) => {
							store.markRejected(UserEvent.UPDATE_USER, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		return {
			loadUserListSnapshot,
			loadUserCreateSnapshot,
			loadUserUpdateSnapshot,
			createUser,
			updateUser
		};
	})
);
```

---

### User Create Component

```typescript
// user-create.component.ts
@Component({
    // UserStore is provided here, not globally.
    // It lives and dies with this component tree.
    providers: [UserStore],
    ...
})
export class UserCreateComponent {
    private readonly userStore          = inject(UserStore);
    protected readonly accessControl    = inject(AccessControlStore); // read-only signals

    private readonly select             = createUserEventSelector();

    // One signal for page init — all required data or nothing
    protected readonly snapshotStatus   = this.select(UserEvent.USER_CREATE_SNAPSHOT);

    // Separate signal for form submission
    protected readonly submitStatus     = this.select(UserEvent.CREATE_USER);

    // Shared data read directly from AccessControlStore signals
    protected readonly masterRoles      = this.accessControl.masterRoles;
    protected readonly permissions      = this.accessControl.permissions;

    constructor() {
        // Triggers forkJoin internally — component does not care how many APIs are called
        this.userStore.loadUserCreateSnapshot();
    }

    private readonly watchSubmit = effect(() => {
        const { isFulfilled, isRejected, message } = this.submitStatus();
        untracked(() => {
            if (isFulfilled) {
                this.toast.success(message ?? 'User created');
                this.router.navigate(['/users']);
            }
            if (isRejected) {
                this.toast.error(message ?? 'Failed to create user');
            }
        });
    });

    protected onSubmit(payload: ICreateUserPayload): void {
        this.userStore.createUser(payload);
    }
}
```

```html
<!-- user-create.component.html -->
<!-- One signal drives the entire page state — no multi-request juggling -->

@if (snapshotStatus().isPending) {
<app-page-skeleton />
} @if (snapshotStatus().isRejected) {
<app-error-state [message]="snapshotStatus().message" />
} @if (snapshotStatus().isFulfilled) {
<form>
	<!-- These come from AccessControlStore directly — always in sync -->
	<app-role-select [options]="masterRoles()" />
	<app-permissions-list [options]="permissions()" />

	<button [disabled]="submitStatus().isDisabled" (click)="onSubmit(form.value)">
		@if (submitStatus().isPending) { Creating... } @else { Create User }
	</button>
</form>
}
```

---

## 9. Coupling Rules

### What Is and Is Not Coupling

There is a meaningful difference between coupling and a dependency. Coupling is when two things are
entangled in a way that makes them hard to change or test independently. A dependency is when one
thing declares it needs something another thing provides through a public API.

```
❌ Actual coupling — Store A patches Store B's state directly:
   patchState(accessControlStore, { masterRoles })  ← inside UserStore
   This is a violation. UserStore now knows and controls AccessControlStore's internals.

❌ Actual coupling — Component patches store state:
   patchState(userStore, { masterRoles: roles })  ← inside a component
   Component should never patch store state directly.

✅ Dependency, not coupling — Store injects a service and calls its public method:
   accessControlService.ensureMasterRoles$()  ← inside UserStore rxMethod
   UserStore declares a need. AccessControlService fulfills it through its public API.
   AccessControlService internally patches its own store. UserStore never knows this.

✅ Dependency, not coupling — Component reads shared store signals:
   protected readonly masterRoles = this.accessControl.masterRoles;
   Reading a public signal is not coupling. The component has no control over the store.
```

### Why Store-to-Service Injection Is Acceptable

A developer reading UserStore's `withMethods` will see:

```typescript
const accessControlService = inject(AccessControlService);
```

They hover over `ensureMasterRoles$()`, read the JSDoc, and understand immediately: this method is
self-managing, it loads into its own store, callers only need to know it completed. The question
"where does the data go?" is answered by the method's name and documentation. There is no trail to
follow across multiple files.

The `[, , selectedUser]` destructuring in `forkJoin` results is intentional and communicates the
same thing visually — the first two results are intentionally unused here because their side effects
(patching AccessControlStore) already happened inside the service.

### The patchState Rule

```
Who can call patchState on a store?
  ✅ The store's own withMethods
  ✅ The store's paired service (same domain)
  ❌ Any other store
  ❌ Any component
  ❌ Any service outside the same domain
```

---

## 10. Request Tracking — Selector Cleanup

### The Noise Problem

Without a factory, every component that selects request status must spell out the full generic:

```typescript
// ❌ Verbose — repeated at every call site
const status = selectRequestStatus<Pick<TUserEvents, UserEvent.CREATE_USER>>(
	this.userStore,
	UserEvent.CREATE_USER
);
```

### The Fix — Event Selector Factory

Create a store-bound selector factory alongside the store's events file. The generic is specified
once. All call sites are clean.

```typescript
// user-events.ts — add alongside existing exports
export function createUserEventSelector() {
	const userStore = inject(UserStore);
	return createEventSelector<TUserEvents>(userStore);
}
```

```typescript
// In any component — clean, fully typed, no generics at call site
private readonly select       = createUserEventSelector();
private readonly submitStatus = this.select(UserEvent.CREATE_USER);
// submitStatus().data is typed as IUser automatically — no cast needed
```

The same pattern is applied per store:

```typescript
// In their respective events files:
export function createAuthEventSelector()  { ... }  // → TAuthEvents
export function createOrderEventSelector() { ... }  // → TOrderEvents
export function createUserEventSelector()  { ... }  // → TUserEvents
```

---

## 11. Quick Reference Decision Tree

### Where does this data belong?

```
Is this data specific to one feature/route?
  YES → Feature store, provided at route level

Is this data needed across multiple unrelated features?
  YES → Find the real domain it belongs to

    Does it govern who can do what? → AccessControlStore
    Is it geographic reference data? → GeographyStore
    Is it generic reference data (status codes, categories)? → LookupStore
    Is it something else? → Create a new named shared domain store
```

### How many shared stores should you have?

3 to 6 for even a large enterprise app. If you find yourself with more, check whether some of them
are actually feature data masquerading as shared data.

### What goes in a snapshot action vs a mutation action?

```
Snapshot (init)    → data needed before the page is usable
                   → runs on page load
                   → uses forkJoin — all or nothing

Mutation           → data changed by user action
                   → runs on form submit / button click
                   → uses switchMap — cancels previous if re-triggered
```

### Where does the component read shared data from?

```
Shared store signals directly, as read-only:
  protected readonly masterRoles = inject(AccessControlStore).masterRoles;

Not from the feature store, not duplicated in feature store state.
The shared store is the single source of truth.
```

---

## Summary

The architecture resolves all four original issues through these decisions:

The **snapshot action pattern** eliminates multi-request UX problems — one action, one signal, all
or nothing via `forkJoin`.

The **shared domain layer** eliminates cross-store state duplication — shared data lives once in its
own root-scoped store, read by anyone but patched only by its paired service.

The **service-level patchState** rule eliminates coupling — stores inject services not other stores,
each domain manages its own state, no foreign patching.

The **domain-based naming** rule eliminates god objects — stores named after real domains have
natural, enforced boundaries that prevent unbounded growth.

The **event selector factory** eliminates generic noise — type information captured once, all call
sites clean.
