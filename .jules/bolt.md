## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-18 - Extract Nested Functional Components
**Learning:** Defining functional components inside a parent component's render scope (like `CartContent` inside `CashierClient`) is an anti-pattern. It causes complete unmounting and remounting of the nested component on every render, leading to local state loss and significant UI lag.
**Action:** Always extract inner components to the module level. If they rely on the parent's state, pass those down as props and use `React.memo` combined with `React.useCallback` for event handlers.

## 2026-05-01 - [Optimizing Extracting Components & Types]
**Learning:** When creating Prop definitions while extracting components out of complex blocks, taking the time to define proper types instead of `any` is essential for codebase maintenance, however, in rapid prototyping an `any` type can work but is considered bad practice long-term. Also be mindful when tools generate `pnpm-lock.yaml` unintentionally as committing that pollutes a clean PR.
**Action:** Remove unintentional `pnpm-lock.yaml` files before commit.
