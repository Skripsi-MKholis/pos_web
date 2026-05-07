<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Parzello POS Next.js (App Router) project. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side via the Next.js 15.3+ instrumentation hook, with session replay, exception capture, and a reverse proxy route.
- `lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event tracking.

**Modified files:**
- `next.config.mjs` — Added reverse proxy rewrites for `/ingest/*` → PostHog US endpoints, and `skipTrailingSlashRedirect: true`.
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
- `app/(auth)/login/page.tsx` — `posthog.identify()` + `user_logged_in` capture on email login success; `user_logged_in_google` capture on Google OAuth click.
- `app/(auth)/register/page.tsx` — `posthog.identify()` + `user_signed_up` capture on successful registration.
- `app/dashboard/products/add-product-dialog.tsx` — `product_added` capture on successful product creation.
- `app/dashboard/products/delete-product-button.tsx` — `product_deleted` capture on successful product deletion.
- `app/dashboard/products/adjust-stock-dialog.tsx` — `stock_adjusted` capture with previous/new stock values.
- `app/dashboard/categories/add-category-dialog.tsx` — `category_created` capture on successful category creation.
- `app/dashboard/cashier/cashier-client.tsx` — `product_added_to_cart` capture per item added; `voucher_applied` capture on promo validation; `order_saved_pending` capture for pending table orders.
- `components/payment-modal.tsx` — `transaction_completed` capture with payment method, total, and mode on every successful transaction.
- `app/dashboard/settings/billing/billing-client.tsx` — `plan_upgraded` capture with plan name, slug, and price on plan changes.

## Events tracked

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully registers a new account via email/password | `app/(auth)/register/page.tsx` |
| `user_logged_in` | User successfully logs in with email/password | `app/(auth)/login/page.tsx` |
| `user_logged_in_google` | User initiates Google OAuth login | `app/(auth)/login/page.tsx` |
| `product_added` | User adds a new product to the store catalog | `app/dashboard/products/add-product-dialog.tsx` |
| `product_deleted` | User deletes a product from the store catalog | `app/dashboard/products/delete-product-button.tsx` |
| `product_added_to_cart` | Cashier adds a product to the active cart in the POS | `app/dashboard/cashier/cashier-client.tsx` |
| `voucher_applied` | Cashier successfully applies a promo voucher to the cart | `app/dashboard/cashier/cashier-client.tsx` |
| `order_saved_pending` | Cashier saves a pending order to a table | `app/dashboard/cashier/cashier-client.tsx` |
| `transaction_completed` | A transaction is successfully completed with payment | `components/payment-modal.tsx` |
| `plan_upgraded` | Store owner changes their subscription plan | `app/dashboard/settings/billing/billing-client.tsx` |
| `category_created` | User creates a new product category | `app/dashboard/categories/add-category-dialog.tsx` |
| `stock_adjusted` | User adjusts the stock quantity of a product | `app/dashboard/products/adjust-stock-dialog.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/149258/dashboard/1557137
- **Signup & Login Funnel:** https://us.posthog.com/project/149258/insights/ShIfM9iK
- **Daily Transactions Completed:** https://us.posthog.com/project/149258/insights/3YdCdbnW
- **Transaction Payment Method Breakdown:** https://us.posthog.com/project/149258/insights/izOG8NWo
- **Cashier Flow Funnel (Cart → Transaction):** https://us.posthog.com/project/149258/insights/PfHb7QFS
- **Plan Upgrades Over Time:** https://us.posthog.com/project/149258/insights/z03d0QA5

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
