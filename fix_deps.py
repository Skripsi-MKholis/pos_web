with open('app/dashboard/cashier/cashier-client.tsx', 'r') as f:
    content = f.read()

# fix handleSaveOrder dependency array
content = content.replace(
    '  }, [cartTotal, store.id])\n\n\n  return (',
    '  }, [cart, selectedTable, finalTotal, discountAmount, appliedVoucher, store.id, cartTotal])\n\n\n  return ('
)

with open('app/dashboard/cashier/cashier-client.tsx', 'w') as f:
    f.write(content)

print("Done")
