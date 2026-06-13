## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2024-05-18 - Hoist invariant string operations outside render loops
**Learning:** Calling `.toLowerCase()` inside a `.filter` array iteration method causes O(N) memory allocations for new strings. When building a POS client, filtering thousands of products per keystroke exacerbates UI lag on lower-end devices.
**Action:** Always hoist simple, invariant string transformations (like `.toLowerCase()`) on search queries outside of filtering loops. Wrap the resulting filtered list in `React.useMemo` to maintain referential stability.
