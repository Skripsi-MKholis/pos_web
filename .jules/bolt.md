## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2026-05-01 - [Optimizing Array Aggregation inside React Components]
**Learning:** Using the spread operator `[...acc, ...items]` inside a `reduce` function in a React component creates an O(N^2) memory allocation bottleneck, and doing multiple `reduce` passes on the same array is inefficient.
**Action:** When deriving data from arrays, consolidate multiple passes into a single `reduce` loop inside a `useMemo` hook, and use `.push(...items)` instead of the spread operator to mutate the accumulator directly and save memory.
