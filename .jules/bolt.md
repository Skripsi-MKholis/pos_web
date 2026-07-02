## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2024-05-18 - Hoisting List Filter String Allocations
**Learning:** Calling `.toLowerCase()` inside `.filter()` operations on arrays inside React components leads to O(N) string allocation bottlenecks during re-renders, especially when not memoized. Furthermore, deriving stats from the same arrays by iterating over them multiple times scales poorly to O(mN).
**Action:** Always hoist invariant derivations like `.toLowerCase()` out of the `.filter()` loop to achieve O(1) allocation overhead, and use `.reduce()` over a single pass to consolidate multiple derived statistics computations.
