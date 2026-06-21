## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-06-21 - [Optimizing Array Filtering String Allocations]
**Learning:** In React components that filter arrays based on a search query (common in list/table clients), calling `.toLowerCase()` on the query inside the `.filter()` callback results in redundant string allocations (O(N)).
**Action:** Always hoist invariant operations like `searchQuery.toLowerCase()` outside of the array iteration method (e.g., `.filter`, `.map`, `.reduce`) into a constant to reduce overhead from O(N) to O(1), and wrap the entire filtering logic in `useMemo` so it only re-runs when dependencies change.
