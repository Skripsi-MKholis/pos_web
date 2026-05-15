## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2026-05-15 - [Extract and Memoize Inline Components]
**Learning:** Defining functional components inside a parent component's render scope (like `CartContent` inside `CashierClient`) is an anti-pattern. It causes complete component unmounting and remounting on every render, which loses local state and causes severe UI lag, especially in heavy POS interfaces.
**Action:** Always extract inline components to the module level and memoize them properly with `React.memo()` and `React.useCallback()` to maintain referential stability and performance.
