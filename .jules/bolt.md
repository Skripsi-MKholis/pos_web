## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2026-05-08 - Extract and Memoize Inline Components
**Learning:** Defining a functional component (like `CartContent`) inside the render body of a parent component (`CashierClient`) is a severe anti-pattern in React. It causes the component's function reference to be re-created on every render, forcing React to completely unmount and remount the subtree. This destroys local state (like scroll position or focus) and causes massive performance degradation, especially in a dynamic view like a POS cart.
**Action:** Always extract child functional components to the module level. Use `React.memo` for the extracted component and `React.useCallback` for event handlers passed as props to ensure stable references and avoid unnecessary cascading re-renders.
