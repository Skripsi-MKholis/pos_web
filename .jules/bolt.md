## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2024-05-14 - String Allocation in Render Loops
**Learning:** Found a recurring pattern in the codebase where `.toLowerCase()` is called on state variables inside `.filter()` loops within React components. Because the state value doesn't change during the filter operation, this results in O(N) unnecessary string allocations.
**Action:** Always check array iteration methods (`.filter()`, `.map()`, `.reduce()`) for invariant operations that can be hoisted outside the loop, especially operations that create new memory references like `.toLowerCase()`, `.split()`, or object creation. Use `useMemo` when calculating derived state to preserve referential stability.
