from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import base64
import hashlib

def aes_encrypt(data: str, password: str) -> dict:
    """
    Encrypts the given data using AES-256 encryption.

    :param data: The plaintext to be encrypted.
    :param password: The encryption password.
    :return: A dictionary containing the encrypted data, IV, and salt.
    """
    # Generate salt and derive key
    salt = get_random_bytes(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, dklen=32)
    
    # Generate random IV
    iv = get_random_bytes(16)
    
    # Encrypt data
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ciphertext = cipher.encrypt(pad(data.encode(), AES.block_size))
    
    # Base64 encode results for easier storage/transmission
    return {
        "ciphertext": base64.b64encode(ciphertext).decode(),
        "iv": base64.b64encode(iv).decode(),
        "salt": base64.b64encode(salt).decode(),
    }


def aes_decrypt(encrypted_data: dict, password: str) -> str:
    """
    Decrypts the given encrypted data using AES-256.

    :param encrypted_data: A dictionary containing the ciphertext, IV, and salt.
    :param password: The decryption password.
    :return: The decrypted plaintext.
    """
    # Decode Base64-encoded values
    ciphertext = base64.b64decode(encrypted_data["ciphertext"])
    iv = base64.b64decode(encrypted_data["iv"])
    salt = base64.b64decode(encrypted_data["salt"])
    
    # Derive key from password and salt
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, dklen=32)
    
    # Decrypt data
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
    
    return plaintext.decode()
