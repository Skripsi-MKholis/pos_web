## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-18 - Extracted Nested CartContent from CashierClient
**Learning:** Defining a functional component (`CartContent`) inside its parent's (`CashierClient`) render function is an anti-pattern that causes the entire nested component to unmount and remount on every parent render. This destroys DOM nodes, drops local state, and heavily hits performance on dynamic pages like a POS system.
**Action:** Always verify that functional components are extracted to the module level. Use props to pass necessary state, and leverage `React.memo` and `React.useCallback` for stable references to prevent unnecessary downstream rendering.
