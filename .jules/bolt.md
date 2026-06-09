## 2026-05-01 - [Optimizing N+1 Server Action Pattern]
**Learning:** Using `Promise.all` on individual server action calls creates an N+1 network request pattern, which is inefficient. Consolidating into a bulk server action reduces network overhead and allows for atomic or more efficient database operations.
**Action:** Always check for batching opportunities when a client needs to perform the same operation on multiple items.

## 2024-05-18 - Memoize Cashier POS Product Grid
**Learning:** In a POS system, adding items to the cart updates the local cart state frequently. Without memoization, every keystroke in the cart or product addition causes the entire product grid to re-render, leading to noticeable UI lag on slower devices.
**Action:** Always wrap heavy list item components like `ProductCard` with `React.memo` and memoize callbacks (e.g. `addToCart` via `useCallback`) and derived lists (e.g. `filteredProducts` via `useMemo`) that are passed to them as props to prevent these cascading re-renders.

## 2024-06-09 - [Inline Component Render Bottleneck]
**Learning:** Defining a component functionally inside a parent's render scope (like `CartContent` inside `CashierClient`) is a fatal React anti-pattern. React treats it as a new component identity on every single parent render, completely unmounting the DOM and remounting it from scratch, causing massive UI lag and resetting any inner state (like focus or local inputs).
**Action:** Always extract sub-components to the top/module level, explicitly pass necessary closure variables as props, and wrap them in `React.memo` (along with `useCallback` for their prop handlers) if the parent renders frequently.
