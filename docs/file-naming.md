# File Naming Convention

This document defines the file naming rules used across this Angular 21 project.

The goal is to keep naming predictable, scalable, and aligned with the current standalone-first
structure used in the repository.

## Naming Principles

- Use `kebab-case` for all file and folder names.
- Keep the same base name across related files.
- Name files by responsibility, not by vague technical labels.
- Use suffixes only when they improve clarity and are already part of the project pattern.
- Keep template and style files next to the primary TypeScript file.
- Prefer consistency with the existing repository structure over mixing old and new naming styles.

## Main File Types

| File Type               | File Name                                                 | Main Symbol                                   | Test File                         | Related Files                            | Notes                                                               |
| ----------------------- | --------------------------------------------------------- | --------------------------------------------- | --------------------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| Component               | `user-profile.ts`                                         | `UserProfile`                                 | `user-profile.spec.ts`            | `user-profile.html`, `user-profile.scss` | Standard standalone component pattern.                              |
| Service                 | `navigation.ts`                                           | `Navigation` or `NavigationService`           | `navigation.spec.ts`              | N/A                                      | Plain responsibility-based naming is preferred in this project.     |
| Service (API)           | `user-api.ts`                                             | `UserApi`                                     | `user-api.spec.ts`                | N/A                                      | Use when the file is specifically API-oriented.                     |
| Service (State)         | `auth-store.ts`                                           | `AuthStore`                                   | `auth-store.spec.ts`              | N/A                                      | Preferred for signal or state container files.                      |
| Service (Cache)         | `data-cache.ts`                                           | `DataCache`                                   | `data-cache.spec.ts`              | N/A                                      | Use when the file manages caching behavior.                         |
| Service (Manager)       | `notification-manager.ts`                                 | `NotificationManager`                         | `notification-manager.spec.ts`    | N/A                                      | Use only when “manager” truly reflects the responsibility.          |
| Service (Client)        | `payment-client.ts`                                       | `PaymentClient`                               | `payment-client.spec.ts`          | N/A                                      | Good for transport or SDK-style integrations.                       |
| Directive               | `highlight.ts`                                            | `Highlight`                                   | `highlight.spec.ts`               | N/A                                      | No `.directive.ts` suffix in this project style.                    |
| Guard                   | `auth-guard.ts`                                           | `AuthGuard`                                   | `auth-guard.spec.ts`              | N/A                                      | Keep the `-guard` suffix.                                           |
| Interceptor             | `logging-interceptor.ts`                                  | `LoggingInterceptor`                          | `logging-interceptor.spec.ts`     | N/A                                      | Keep the `-interceptor` suffix.                                     |
| Resolver                | `user-resolver.ts`                                        | `UserResolver`                                | `user-resolver.spec.ts`           | N/A                                      | Keep the `-resolver` suffix.                                        |
| Pipe                    | `currency-pipe.ts`                                        | `CurrencyPipe`                                | `currency-pipe.spec.ts`           | N/A                                      | Keep the `-pipe` suffix.                                            |
| Module                  | `shared-module.ts`                                        | `SharedModule`                                | `shared-module.spec.ts`           | N/A                                      | Rare in this repo; use only when a real Angular module is required. |
| Model                   | `user.model.ts`                                           | `UserModel` or `UserProfile`                  | `user.model.spec.ts`              | N/A                                      | Use only when a dedicated model layer is needed.                    |
| Interface / Domain Type | `user.types.ts` or `user.ts`                              | `User`, `UserProfile`                         | `user.types.spec.ts`              | N/A                                      | Prefer `*.types.ts` when grouping related interfaces and aliases.   |
| Type Definitions        | `user.types.ts`                                           | `UserRole`, `UserStatus`                      | `user.types.spec.ts`              | N/A                                      | Standard grouped type file.                                         |
| Validator               | `email-validator.ts`                                      | `emailValidator`                              | `email-validator.spec.ts`         | N/A                                      | Use for standalone validation logic.                                |
| Utility                 | `date-time-utils.ts`                                      | `formatDate`, `parseDate`                     | `date-time-utils.spec.ts`         | N/A                                      | Preferred for stateless utility helpers.                            |
| Helper                  | `user-helpers.ts`                                         | `calculateAge`, `formatName`                  | `user-helpers.spec.ts`            | N/A                                      | Use only when `utils` is not a better fit.                          |
| Store                   | `user-store.ts`                                           | `UserStore`                                   | `user-store.spec.ts`              | N/A                                      | Standard store naming.                                              |
| Store Feature           | `with-request-status.ts`                                  | `withRequestStatus`                           | `with-request-status.spec.ts`     | N/A                                      | Use for composable store extensions.                                |
| Store Selector          | `request-status-selector.ts`                              | `selectRequestStatus`                         | `request-status-selector.spec.ts` | N/A                                      | Use for extracted selector or accessor logic.                       |
| Provider Helper         | `provide-auth.ts` or `provide-document-title-strategy.ts` | `provideAuth`, `provideDocumentTitleStrategy` | matching spec file                | N/A                                      | Preferred for provider factory helpers.                             |
| Factory                 | `logger-factory.ts`                                       | `LoggerFactory`                               | `logger-factory.spec.ts`          | N/A                                      | Use for controlled object creation.                                 |
| Builder                 | `form-builder.ts`                                         | `FormBuilder`                                 | `form-builder.spec.ts`            | N/A                                      | Use only when a builder abstraction truly exists.                   |
| Adapter                 | `api-adapter.ts`                                          | `ApiAdapter`                                  | `api-adapter.spec.ts`             | N/A                                      | Use at data transformation boundaries.                              |
| Mapper                  | `user-mapper.ts`                                          | `UserMapper`                                  | `user-mapper.spec.ts`             | N/A                                      | Use for explicit mapping logic.                                     |
| Strategy                | `cached-route-strategy.ts`                                | `CachedRouteStrategy`                         | `cached-route-strategy.spec.ts`   | N/A                                      | Keep the `-strategy` suffix.                                        |
| Exception / Error       | `exception.ts`, `exception-handler.ts`                    | `Exception`, `ExceptionHandler`               | matching spec file                | N/A                                      | Name by actual responsibility.                                      |
| Schema                  | `sign-in.schema.ts`                                       | `signInSchema`                                | `sign-in.schema.spec.ts`          | N/A                                      | Use for Zod or validation schema definitions.                       |
| Barrel Export           | `index.ts`                                                | N/A                                           | N/A                               | N/A                                      | Use only for exports and re-exports.                                |
| Declaration             | `global.d.ts`                                             | ambient declarations                          | N/A                               | N/A                                      | Reserved for TypeScript declaration files.                          |

## Special Configuration Files

| File Type               | File Name                    | Main Symbol         | Test File                         | Notes                                                 |
| ----------------------- | ---------------------------- | ------------------- | --------------------------------- | ----------------------------------------------------- |
| Routes                  | `app.routes.ts`              | `routes`            | `app.routes.spec.ts`              | Use dot notation for route definition files.          |
| Feature Routes          | `users.routes.ts`            | `routes`            | `users.routes.spec.ts`            | Use inside feature areas.                             |
| Config                  | `app.config.ts`              | `appConfig`         | `app.config.spec.ts`              | Root application config file.                         |
| Feature Config          | `application.config.ts`      | `applicationConfig` | `application.config.spec.ts`      | Use for dedicated config files under config folders.  |
| Named Config            | `prime-ng.config.ts`         | `primeNgConfig`     | `prime-ng.config.spec.ts`         | Use dot notation with responsibility-based names.     |
| Environment             | `environment.ts`             | `environment`       | `environment.spec.ts`             | Base environment file.                                |
| Environment Development | `environment.development.ts` | `environment`       | `environment.development.spec.ts` | Development environment file.                         |
| Environment Staging     | `environment.staging.ts`     | `environment`       | `environment.staging.spec.ts`     | Staging environment file.                             |
| Environment Production  | `environment.production.ts`  | `environment`       | `environment.production.spec.ts`  | Use this naming if a production-specific file exists. |

## Test-Specific Files

| File Type        | File Name                          | Purpose                              |
| ---------------- | ---------------------------------- | ------------------------------------ |
| Unit Test        | `component-name.spec.ts`           | Standard unit test file.             |
| Integration Test | `feature-name.integration.spec.ts` | Cross-unit or cross-feature testing. |
| E2E Test         | `user-flow.e2e.spec.ts`            | End-to-end browser workflow testing. |
| Mock             | `user-api.mock.ts`                 | Mock implementation for tests.       |
| Stub             | `payment-service.stub.ts`          | Minimal test double.                 |
| Fixture          | `user-data.fixture.ts`             | Static test data.                    |

## Quick Reference

### No extra suffix

Use plain file names when the artifact type is already clear from the folder or the project
convention.

```text
Components:    filename.ts          → filename.spec.ts
Services:      service-name.ts      → service-name.spec.ts
Directives:    directive-name.ts    → directive-name.spec.ts
```
