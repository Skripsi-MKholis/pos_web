## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.
## 2024-06-11 - [Refactored CartContent out of CashierClient's Render Scope]
**Learning:** Defining a functional component (like `CartContent`) inside another component's render function is a major anti-pattern in React. It causes the inner component to be recreated on every single render of the parent, losing its own local state, destroying memoization benefits of its children, and leading to severe performance bottlenecks and UI lag (especially in heavy components like a POS page).
**Action:** Always define components at the module level (outside other component scopes). If an inner component needs state from a parent, pass it explicitly as props and memoize both the child component using `React.memo` and the callbacks passed to it using `React.useCallback`.
