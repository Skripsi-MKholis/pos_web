## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-30 - [Performance] O(N^2) Array Allocation in React Render Loop
**Learning:** Found a common React anti-pattern in `TablesMonitoringClient` where `[...acc, ...items]` was used inside `.reduce()` to flatten an array, running on *every* component render. This creates an O(N^2) allocation bottleneck. Furthermore, multiple derived statistics were calculated using three separate `.reduce()` passes over the same array.
**Action:** Always combine multiple `.reduce()` operations on the same data into a single pass, wrap the logic in `useMemo` to preserve referential equality and avoid recalculations, and avoid the spread operator `[...acc, ...items]` inside reducers in favor of `.push(...items)` or `.flatMap()`.
