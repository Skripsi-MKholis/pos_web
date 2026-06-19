## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2026-06-19 - [Hoist Invariant Operations Outside filter Loops in React Components]
**Learning:** When filtering arrays in React components, invariant operations like `.toLowerCase()` on search queries are often placed inside the `.filter` loop, causing O(N) string allocation overhead on every render.
**Action:** Always hoist these invariant operations outside of the loop and wrap the filtering logic in `React.useMemo` to reduce computational overhead from O(N) to O(1) and prevent redundant recalculations.
