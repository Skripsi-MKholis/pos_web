import re

with open('app/dashboard/cashier/cashier-client.tsx', 'r') as f:
    content = f.read()

# Extract CartContent
cart_content_match = re.search(r'  // Reusable Cart Content\n  const CartContent = \(\) => \((.*?)\n  \)\n\n  return \(', content, re.DOTALL)
if not cart_content_match:
    print("Could not find CartContent")
    exit(1)

cart_content_jsx = cart_content_match.group(1)

# Now, we define the props interface and the memoized component
props_interface = """
interface CartContentProps {
  cart: any[];
  selectedTable: any;
  notifiedTableRef: React.MutableRefObject<string | null>;
  appliedVoucher: any;
  isValidatingVoucher: boolean;
  cartTotal: number;
  discountAmount: number;
  finalTotal: number;
  showTables: boolean;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  handleApplyVoucher: (code: string) => Promise<void>;
  removeVoucher: () => void;
  handleSaveOrder: (shouldPrint?: boolean) => Promise<void>;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  router: any;
}

const CartContent = React.memo(function CartContent({
  cart,
  selectedTable,
  notifiedTableRef,
  appliedVoucher,
  isValidatingVoucher,
  cartTotal,
  discountAmount,
  finalTotal,
  showTables,
  updateQuantity,
  removeFromCart,
  handleApplyVoucher,
  removeVoucher,
  handleSaveOrder,
  setIsCartOpen,
  setIsCheckoutOpen,
  router
}: CartContentProps) {
  return (
""" + cart_content_jsx + """
  )
})
"""

# Place it right before CashierClient
content = re.sub(r'export function CashierClient\(', props_interface + '\nexport function CashierClient(', content)

# Remove the old CartContent definition
content = content.replace(cart_content_match.group(0), '\n  return (')

# Replace <CartContent /> with props
cart_content_usage = """<CartContent
          cart={cart}
          selectedTable={selectedTable}
          notifiedTableRef={notifiedTableRef}
          appliedVoucher={appliedVoucher}
          isValidatingVoucher={isValidatingVoucher}
          cartTotal={cartTotal}
          discountAmount={discountAmount}
          finalTotal={finalTotal}
          showTables={showTables}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          handleApplyVoucher={handleApplyVoucher}
          removeVoucher={removeVoucher}
          handleSaveOrder={handleSaveOrder}
          setIsCartOpen={setIsCartOpen}
          setIsCheckoutOpen={setIsCheckoutOpen}
          router={router}
        />"""

content = content.replace('<CartContent />', cart_content_usage)

# Add useCallback to functions inside CashierClient
# updateQuantity
content = content.replace(
    'const updateQuantity = (id: string, delta: number) => {\n    setCart(prev => prev.map(item => {',
    'const updateQuantity = React.useCallback((id: string, delta: number) => {\n    setCart(prev => prev.map(item => {'
)
content = content.replace(
    '      return item\n    }))\n  }',
    '      return item\n    }))\n  }, [])'
)

# removeFromCart
content = content.replace(
    'const removeFromCart = (id: string) => {\n    setCart(prev => prev.filter(item => item.id !== id))\n  }',
    'const removeFromCart = React.useCallback((id: string) => {\n    setCart(prev => prev.filter(item => item.id !== id))\n  }, [])'
)

# handleApplyVoucher
content = content.replace(
    'const handleApplyVoucher = async (code: string) => {',
    'const handleApplyVoucher = React.useCallback(async (code: string) => {'
)
content = content.replace(
    '    } finally {\n      setIsValidatingVoucher(false)\n    }\n  }',
    '    } finally {\n      setIsValidatingVoucher(false)\n    }\n  }, [cartTotal, store.id])'
)

# removeVoucher
content = content.replace(
    'const removeVoucher = () => {\n    setAppliedVoucher(null)\n    toast.info("Voucher dilepas")\n  }',
    'const removeVoucher = React.useCallback(() => {\n    setAppliedVoucher(null)\n    toast.info("Voucher dilepas")\n  }, [])'
)

# handleSaveOrder
content = content.replace(
    'const handleSaveOrder = async (shouldPrint: boolean = false) => {',
    'const handleSaveOrder = React.useCallback(async (shouldPrint: boolean = false) => {'
)
content = content.replace(
    '    } finally {\n      setIsValidatingVoucher(false)\n    }\n  }',
    '    } finally {\n      setIsValidatingVoucher(false)\n    }\n  }, [cart, selectedTable, finalTotal, discountAmount, appliedVoucher, store.id, store.name, store.address, store.phone, store.logo_url, userName])'
)


with open('app/dashboard/cashier/cashier-client.tsx', 'w') as f:
    f.write(content)

print("Done")
