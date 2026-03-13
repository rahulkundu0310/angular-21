# NgRx Signal Store Architecture

This document defines the state management architecture for this Angular 21 project, utilizing
`@ngrx/signals`. It outlines how to manage shared state, feature state, and coordinate cross-store
data requirements efficiently.

---

## 1. Core Architectural Rules

1. **Stores own their domain.** A store is the sole authority over its own state. A feature store
   may call a public method on a shared store, but it may never call `patchState` on a foreign
   store.
2. **Feature stores are route-scoped.** Feature stores are provided at the component/route level,
   not the root. They are created on entry and destroyed on exit, preventing stale data.
3. **Shared stores are root-scoped.** Only genuinely shared reference data (e.g., Roles, Geography)
   is provided at the root level.
4. **Name by domain, not relationship.** Never use names like `CommonStore` or `SharedStore`. Use
   specific domain names: `AccessControlStore`, `GeographyStore`.

---

## 2. Layer Architecture

```text
┌────────────────────────────────────────────────────────┐
│                  SHARED DOMAIN LAYER                   │
│                  (providedIn: 'root')                  │
│                                                        │
│  AccessControlStore (Roles, Permissions)               │
│  GeographyStore (Countries, Regions, Timezones)        │
│  LookupStore (Status codes, Categories)                │
└─────────────────────────┬──────────────────────────────┘
                          │
      ┌───────────────────┼────────────────────┐
      ▼                   ▼                    ▼
┌───────────┐       ┌────────────┐       ┌────────────┐
│ UserStore │       │ OrderStore │       │InvoiceStore│
│ (route)   │       │ (route)    │       │ (route)    │
└───────────┘       └────────────┘       └────────────┘
      ▲
      │ Components read shared signals directly.
      │ Components trigger methods on their Feature Store.
┌─────────────────┐
│     User        │
└─────────────────┘
```

---

## 3. The Snapshot Action Pattern

A page's readiness should be a **single atomic operation**. Components should not track multiple
independent request statuses. Instead, the feature store exposes a single `loadSnapshot` method that
resolves all necessary page data via `forkJoin`.

- **Init Snapshots**: Run once on page load (e.g., `USER_CREATE_SNAPSHOT`). Uses `forkJoin` to
  ensure all or nothing.
- **Mutations**: Triggered by user actions (e.g., `CREATE_USER`). Uses `switchMap` or `exhaustMap`.

---

## 4. Shared Domain Implementation

Shared stores expose custom methods returning Observables that handle caching internally. Feature
stores consume these methods in their `forkJoin` pipelines. The shared store updates its own state
when the observable completes.

### Access Control Store

```typescript
interface IAccessControlState {
	masterRoles: IRole[];
	permissions: IPermission[];
}

export const AccessControlStore = signalStore(
	{ providedIn: 'root' },
	withState<IAccessControlState>({ masterRoles: [], permissions: [] }),
	withMethods((store, http = inject(HttpClient)) => ({
		ensureMasterRoles: (): Observable<IRole[]> => {
			const cached = store.masterRoles();
			if (cached.length > 0) return of(cached);

			return http.get<IApiResponse<IRole[]>>('/api/roles').pipe(
				map((r) => r.data),
				tap((masterRoles) => patchState(store, { masterRoles }))
			);
		},

		ensurePermissions: (): Observable<IPermission[]> => {
			const cached = store.permissions();
			if (cached.length > 0) return of(cached);

			return http.get<IApiResponse<IPermission[]>>('/api/permissions').pipe(
				map((r) => r.data),
				tap((permissions) => patchState(store, { permissions }))
			);
		}
	}))
);
```

---

## 5. Feature Domain Implementation

Feature stores inject shared stores directly, calling their `ensure` methods inside a `forkJoin`.
This guarantees all data is loaded and updated without cross-store patching violations.

### User Store

```typescript
export const UserStore = signalStore(
	withState({ users: [], selectedUser: null }),
	withRequestStatus<IUserState, TUserEvent>({ events: values(UserEvent) }),
	withMethods((store) => {
		const user = inject(User); // Inject Service without "Service" suffix
		const accessControlStore = inject(AccessControlStore); // Inject Shared Store

		const loadUserUpdateSnapshot = rxMethod<number>(
			pipe(
				tap(() => store.markPending(UserEvent.USER_UPDATE_SNAPSHOT)),
				switchMap((userId) =>
					forkJoin([
						accessControlStore.ensureMasterRoles(), // Updates AccessControlStore
						accessControlStore.ensurePermissions(), // Updates AccessControlStore
						user.getUser(userId).pipe(map((r) => r.data)) // Mapped for UserStore
					]).pipe(
						tap(([, , selectedUser]) => {
							// Only selectedUser is patched here. Shared stores updated themselves.
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

		return { loadUserUpdateSnapshot };
	})
);
```

---

## 6. Component Consumption

Components read read-only signals from shared stores and track a single loading state from the
feature store.

To eliminate generic noise, we use an Event Selector factory (`createUserEventSelector()`).

```typescript
@Component({
	selector: 'app-user-update',
	providers: [UserStore],
	templateUrl: './user-update.html'
})
export class UserUpdate {
	// Component without "Component" suffix
	private readonly userStore = inject(UserStore);
	protected readonly accessControlStore = inject(AccessControlStore);

	private readonly select = createUserEventSelector();

	// Single loading state for the entire page
	protected readonly snapshotStatus = this.select(UserEvent.USER_UPDATE_SNAPSHOT);

	// Direct reads from shared state
	protected readonly masterRoles = this.accessControlStore.masterRoles;
	protected readonly permissions = this.accessControlStore.permissions;

	constructor() {
		this.userStore.loadUserUpdateSnapshot(this.userId);
	}
}
```

---

## 7. Coupling Rules Matrix

| Action                                   | Allowed | Why                                  |
| :--------------------------------------- | :-----: | :----------------------------------- |
| Store A calls a method on Store B        | ✅ Yes  | Dependency via public API.           |
| Store A reads a signal from Store B      | ✅ Yes  | Read-only dependency.                |
| Component reads signal from Shared Store | ✅ Yes  | Prevents state duplication.          |
| Store A calls `patchState` on Store B    |  ❌ No  | Violates domain encapsulation.       |
| Component calls `patchState` on Store    |  ❌ No  | Stores must control their own state. |

---

## 8. Quick Reference

- **Route scope vs Root scope:** Feature stores are route-scoped. Shared domains are root-scoped.
- **Snapshot pattern:** Use `forkJoin` in feature stores to call APIs _and_ shared store `ensure`
  methods simultaneously.
- **Self-patching:** Shared stores return observables but patch their own state via `tap` before
  returning.
- **Clean selectors:** Use `createEventSelector()` factories to remove generic typing noise in
  components.
