with open('app/dashboard/cashier/cashier-client.tsx', 'r') as f:
    content = f.read()

# Add setSelectedTable to props
content = content.replace(
    '  setIsCheckoutOpen: (open: boolean) => void;\n  router: any;\n}',
    '  setIsCheckoutOpen: (open: boolean) => void;\n  setSelectedTable: (table: any) => void;\n  router: any;\n}'
)

content = content.replace(
    '  setIsCheckoutOpen,\n  router\n}: CartContentProps) {',
    '  setIsCheckoutOpen,\n  setSelectedTable,\n  router\n}: CartContentProps) {'
)

# And add it in CashierClient usage
content = content.replace(
    '          setIsCheckoutOpen={setIsCheckoutOpen}\n          router={router}\n        />',
    '          setIsCheckoutOpen={setIsCheckoutOpen}\n          setSelectedTable={setSelectedTable}\n          router={router}\n        />'
)

with open('app/dashboard/cashier/cashier-client.tsx', 'w') as f:
    f.write(content)

print("Done")
