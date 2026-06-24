## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-11-20 - [Performance] Hoisting invariant array mapping operations out of tight loops
**Learning:** In Next.js/React client components dealing with frequent UI state updates (e.g. typing in a search bar), performing string manipulations like `searchQuery.toLowerCase()` inside a high-frequency array operation like `.filter()` creates unnecessary Object/String allocations for *every* element resulting in an O(N) penalty.
**Action:** Always pre-compute and hoist loop-invariant values (like normalized search strings) to the outer closure scope, converting O(N) allocations down to O(1).
