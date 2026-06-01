## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2024-05-18 - [React Anti-Pattern: Nested Component Definitions]
**Learning:** Defining a functional component (e.g. `CartContent`) inside another component's render body (e.g. `CashierClient`) is a severe performance anti-pattern. React treats this nested component as a completely new reference on every single render of the parent, forcing it and its entire subtree to unmount and remount. This causes unnecessary layout thrashing, DOM recreation, and local state loss inside those elements.
**Action:** Always extract nested functional components to the module scope level. If they rely on the parent component's state, pass those values and callbacks as props. To prevent unnecessary re-renders of the extracted component, wrap it in `React.memo` and ensure the passed callbacks are stable by wrapping them in `React.useCallback`.
