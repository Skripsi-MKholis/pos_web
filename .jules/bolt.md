## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2026-07-08 - [Optimizing array aggregations with flatMap]\n**Learning:** Using  with the spread operator () inside a component render loop creates an O(N^2) memory allocation overhead which can cause UI lag.\n**Action:** Use  or standard loops for array consolidation, and wrap derived data that requires iteration in  to prevent redundant computation.

## 2026-05-02 - [Optimizing array aggregations with flatMap]
**Learning:** Using `reduce` with the spread operator (`[...acc, ...items]`) inside a component render loop creates an O(N^2) memory allocation overhead which can cause UI lag.
**Action:** Use `.flatMap()` or standard loops for array consolidation, and wrap derived data that requires iteration in `useMemo` to prevent redundant computation.
