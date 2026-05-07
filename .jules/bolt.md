## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-19 - [Extracting and Memoizing Nested Functional Components]
**Learning:** Defining functional components inside a parent component's render scope (e.g. `CartContent` inside `CashierClient`) is an anti-pattern. It causes complete component unmounting and remounting on every parent render, leading to local state loss and UI lag, particularly in performance-sensitive areas like a POS cart.
**Action:** Always extract sub-components to the module level and memoize them properly using `React.memo` and pass memoized callbacks with `React.useCallback` to prevent unnecessary re-renders and full component unmounts.
