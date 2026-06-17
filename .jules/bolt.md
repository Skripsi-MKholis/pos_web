## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2026-05-13 - [O(N^2) Memory Allocation in Array Reduce]
**Learning:** Using the spread operator `[...acc, ...items]` within a `reduce` loop to aggregate arrays creates a severe O(N^2) memory allocation bottleneck, as it creates a new array on every single iteration.
**Action:** When aggregating items from multiple arrays inside a loop or `reduce`, use a single pass with a `for` loop and `push(...items)` or use `flatMap` to keep it O(N). Also, wrap such derived data calculations in `useMemo` to prevent redundant executions on every render.
