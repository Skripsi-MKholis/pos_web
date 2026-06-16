## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-06-16 - [String Allocation in List Filters]
**Learning:** [React re-evaluates `string.toLowerCase()` inside `array.filter` callbacks on every render for every item, leading to excessive O(N) memory allocation and GC pressure, particularly noticeable in large lists like POS product grids or customer tables.]
**Action:** [Always hoist invariant string operations (like converting a search query to lowercase) OUTSIDE of the filter loop, and memoize the entire derived list using `React.useMemo` to cache the result between renders.]
