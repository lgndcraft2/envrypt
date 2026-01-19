import base64
import os
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from .config import settings

def get_master_key() -> bytes:
    key_str = settings.MASTER_ENCRYPTION_KEY
    if not key_str:
        raise ValueError("MASTER_ENCRYPTION_KEY is not set")
    
    # Strict key handling: Expect valid Base64 encoded 32-byte key (AES-256)
    try:
        key_bytes = base64.b64decode(key_str)
        if len(key_bytes) not in [16, 24, 32]:
            raise ValueError(f"Invalid key length: {len(key_bytes)} bytes. AST-GCM requires 16, 24, or 32 bytes.")
        return key_bytes
    except Exception as e:
        # Fallback for development/legacy: Hash the passphrase
        # intended for non-production use where convenience > strict security
        print(f"Warning: MASTER_ENCRYPTION_KEY is not a valid 32-byte base64 string. Falling back to SHA-256 hash of the string. Error: {e}")
        return hashlib.sha256(key_str.encode()).digest()

def encrypt_secret(plain_text: str) -> str:
    master_key = get_master_key()
    # AES-GCM is standard.
    aesgcm = AESGCM(master_key)
    nonce = os.urandom(12)
    data = plain_text.encode('utf-8')
    ciphertext = aesgcm.encrypt(nonce, data, None)
    # Return nonce + ciphertext as base64
    combined = nonce + ciphertext
    return base64.b64encode(combined).decode('utf-8')

def decrypt_secret(encrypted_text: str) -> str:
    master_key = get_master_key()
    aesgcm = AESGCM(master_key)
    try:
        raw_data = base64.b64decode(encrypted_text)
        nonce = raw_data[:12]
        ciphertext = raw_data[12:]
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        return plaintext.decode('utf-8')
    except Exception as e:
        raise ValueError("Decryption failed") from e

def hash_token(token: str) -> str:
    """SHA-256 hash for service tokens"""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()
