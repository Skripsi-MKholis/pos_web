## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2026-05-02 - [Array Allocation Bottlenecks with Spread Syntax]
**Learning:** Using the spread operator (`[...acc, ...items]`) inside a `reduce` function's accumulator to aggregate nested arrays creates a significant O(N²) memory allocation bottleneck. The application creates a new array in memory for every single loop iteration, dramatically increasing garbage collection pauses and freezing the UI when dataset sizes increase (e.g. processing large batches of transactions on the frontend monitoring dashboard).
**Action:** Always replace spread syntax in array aggregation `reduce` loops with direct mutation (`.push(...items)`), a single-pass  loop, or `.flatMap()` in performance-sensitive parts of the codebase.
## 2026-05-02 - [Array Allocation Bottlenecks with Spread Syntax]
**Learning:** Using the spread operator (`[...acc, ...items]`) inside a `reduce` function's accumulator to aggregate nested arrays creates a significant O(N²) memory allocation bottleneck. The application creates a new array in memory for every single loop iteration, dramatically increasing garbage collection pauses and freezing the UI when dataset sizes increase (e.g. processing large batches of transactions on the frontend monitoring dashboard).
**Action:** Always replace spread syntax in array aggregation `reduce` loops with direct mutation (`.push(...items)`), a single-pass `for` loop, or `.flatMap()` in performance-sensitive parts of the codebase.
