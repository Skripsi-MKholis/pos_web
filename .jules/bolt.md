## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-05-25 - Extracting Nested Components from Render Functions
**Learning:** Defining a functional component (like `CartContent`) inside the render body of a parent component (like `CashierClient`) is a serious React anti-pattern. Every time the parent renders, the inner component function is completely recreated, causing React to treat it as a brand new component type. This results in the complete unmounting and remounting of the DOM tree for that child component on every single parent render, leading to massive UI lag and the destruction of any local state within the nested component or its children.
**Action:** Always extract nested component definitions to the module level. Pass required state as props, and ensure that if the parent renders frequently (like a POS client updating cart state), the extracted child is wrapped in `React.memo` and the callbacks passed to it are wrapped in `React.useCallback`.
