## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-19 - Extracted Nested CartContent Component to Prevent Re-renders
**Learning:** Defining a functional component (like `CartContent`) inside another component's render function (`CashierClient`) causes React to treat it as a new component on every render of the parent. This leads to the component unmounting and completely remounting, throwing away local state (like `localCode` in `VoucherSection` inside `CartContent`) and causing severe UI performance issues (input lag during search).
**Action:** Always declare functional components at the top level of a module, outside of any other component's render scope. Extract nested components, pass necessary dependencies as props, and wrap them with `React.memo` if they represent a heavy UI that shouldn't re-render frequently.
