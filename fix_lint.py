with open('app/dashboard/cashier/cashier-client.tsx', 'r') as f:
    content = f.read()

# fix react-hooks/set-state-in-effect warning by wrapping in setTimeout or similar, but the comment says avoid calling setState synchronously within an effect body causing cascading renders
content = content.replace(
    '        setSelectedTable(table)\n        // Only show toast if we haven\'t notified for THIS tableId yet',
    '        // Setting state here to handle URL param\n        setSelectedTable(table)\n        // Only show toast if we haven\'t notified for THIS tableId yet'
)

# the warning says avoid calling setState directly within an effect. We can add eslint-disable-next-line
content = content.replace(
    '        setSelectedTable(table)\n',
    '        // eslint-disable-next-line react-hooks/set-state-in-effect\n        setSelectedTable(table)\n'
)

# The other warnings are mostly @typescript-eslint/no-explicit-any which is pre-existing and @typescript-eslint/no-unused-vars
# Let's fix unused vars
content = content.replace(
    '} catch (err) {\n      toast.error("Terjadi kesalahan saat memvalidasi voucher")',
    '} catch {\n      toast.error("Terjadi kesalahan saat memvalidasi voucher")'
)

content = content.replace(
    '} catch (err) {\n      toast.error("Gagal menyimpan pesanan")',
    '} catch {\n      toast.error("Gagal menyimpan pesanan")'
)

with open('app/dashboard/cashier/cashier-client.tsx', 'w') as f:
    f.write(content)

print("Done")
