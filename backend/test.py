import base64

# Input Base64 string
base64_string = "IZkU+xbgZLpkXvK4vWhvCfnTpj4BjHx3aiG6kTxMzt5jv6Et"

# Add necessary padding to the Base64 string
# Add padding `=` to make the length a multiple of 4
padded_base64_string = base64_string + "=" * ((4 - len(base64_string) % 4) % 4)

# Now try decoding it
try:
    encrypted_data = base64.b64decode(padded_base64_string)
    print(f"Encrypted Data (decoded): {encrypted_data}")
except Exception as e:
    print(f"Error decoding Base64: {e}")
