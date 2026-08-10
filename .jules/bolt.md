## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-20 - Memoization in Complex Filters
**Learning:** Initializing objects like `Date` inside `.filter` array loops runs on every single iteration of the array and every re-render of the component. The same applies for operations like `toLowerCase()`. For large arrays or frequently updated components (like interactive charts and search inputs), this memory allocation and CPU overhead adds up quickly and degrades performance.
**Action:** Pre-calculate constant values, such as target Date objects or search query lowercasing, outside of the `.filter` loop inside the `useMemo` block.
