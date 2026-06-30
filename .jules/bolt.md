## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2024-06-30 - Array Spreading inside Reduce
**Learning:** Using `reduce` coupled with array spread syntax (`[...acc, ...items]`) creates an O(N^2) memory allocation bottleneck, as a new array is created and all previous items are copied during every iteration.
**Action:** Replace `reduce` array spreading with `flatMap` or by directly mutating the accumulator (e.g., `acc.push(...items)`) when consolidating arrays in performance-critical paths.

## 2024-06-30 - Rules of Hooks in JSX
**Learning:** Calling `React.useMemo` (or any hook) directly inside JSX return blocks (e.g., `<h3>{React.useMemo(() => ...)}</h3>`) is a major anti-pattern that violates the Rules of Hooks if the block is conditionally rendered.
**Action:** Always extract memoized logic to the top level of the component and assign it to variables before returning JSX.
