## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-23 - Avoid O(N^2) Array Concatenation via Spread Operator
**Learning:** Found multiple \`reduce\` operations using the spread operator \`[...acc, ...items]\` within the tables monitoring UI to aggregate nested transaction items. Using the spread operator inside a loop dynamically allocates memory exponentially and invokes garbage collection repeatedly, creating an O(N^2) time complexity bottleneck.
**Action:** When aggregating items from nested arrays, prefer pre-allocating an array and using \`.push(...items)\` within a standard loop or a single-pass reducer. Ensure such computations are wrapped in \`useMemo\` if derived during a React render cycle.
