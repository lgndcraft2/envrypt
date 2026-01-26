import os
import base64
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag
from fastapi import HTTPException
from .config import settings

def get_master_key() -> bytes:
    key_str = settings.MASTER_ENCRYPTION_KEY
    if not key_str:
        raise ValueError("MASTER_ENCRYPTION_KEY is not set")
    
    # Strict key handling: Expect valid Base64 encoded 32-byte key (AES-256)
    try:
        if len(key_str) == 32:
             # Try assuming it is raw string bytes if length is exactly 32 (rare for env var unless hex/base64 decoded)
             # But base64 for 32 bytes is approx 44 chars.
             # If user put raw 32 chars:
             return key_str.encode('utf-8')
             
        key_bytes = base64.b64decode(key_str)
        if len(key_bytes) not in [16, 24, 32]:
            raise ValueError(f"Invalid key length: {len(key_bytes)} bytes. AES-GCM requires 16, 24, or 32 bytes.")
        return key_bytes
    except Exception as e:
        # Fallback for development/legacy: Hash the passphrase
        print(f"Warning: MASTER_ENCRYPTION_KEY is not a valid 32-byte base64 string. Falling back to SHA-256 hash. Error: {e}")
        return hashlib.sha256(key_str.encode()).digest()

def generate_data_key() -> bytes:
    """Generates a fresh 32-byte AES key."""
    return AESGCM.generate_key(bit_length=256)

def encrypt_value(plaintext: str) -> dict:
    """
    Envelope Encryption:
    1. Generate a new Data Key.
    2. Encrypt the plaintext with the Data Key.
    3. Encrypt the Data Key with the Master Key.
    Returns: {"value": str (b64), "key": str (b64)}
    """
    if not plaintext:
        return {"value": None, "key": None}

    MASTER_KEY = get_master_key()

    # 1. Generate unique Data Key for this secret
    data_key = generate_data_key()
    
    # 2. Encrypt the content using the Data Key
    aesgcm_data = AESGCM(data_key)
    nonce_data = os.urandom(12)
    ciphertext_data = aesgcm_data.encrypt(nonce_data, plaintext.encode('utf-8'), None)
    
    # Format data: nonce + ciphertext
    encrypted_value = base64.b64encode(nonce_data + ciphertext_data).decode('utf-8')

    # 3. Encrypt the Data Key using the Master Key
    aesgcm_master = AESGCM(MASTER_KEY)
    nonce_master = os.urandom(12)
    ciphertext_key = aesgcm_master.encrypt(nonce_master, data_key, None)
    
    # Format key: nonce + ciphertext
    encrypted_key = base64.b64encode(nonce_master + ciphertext_key).decode('utf-8')

    return {
        "value": encrypted_value,  # The actual secret (goes to value_encrypted)
        "key": encrypted_key       # The locked key (goes to encrypted_key)
    }

def decrypt_value(encrypted_value: str, encrypted_key: str) -> str:
    """
    Envelope Decryption:
    1. Decrypt the Data Key using the Master Key.
    2. Decrypt the secret using the decrypted Data Key.
    """
    if not encrypted_value or not encrypted_key:
        return None

    MASTER_KEY = get_master_key()

    try:
        # 1. Decrypt the Data Key
        raw_enc_key = base64.b64decode(encrypted_key)
        nonce_master = raw_enc_key[:12]
        ciphertext_key_body = raw_enc_key[12:]
        
        aesgcm_master = AESGCM(MASTER_KEY)
        data_key = aesgcm_master.decrypt(nonce_master, ciphertext_key_body, None)

        # 2. Decrypt the actual secret using the decrypted Data Key
        raw_enc_val = base64.b64decode(encrypted_value)
        nonce_data = raw_enc_val[:12]
        ciphertext_data_body = raw_enc_val[12:]

        aesgcm_data = AESGCM(data_key)
        plaintext = aesgcm_data.decrypt(nonce_data, ciphertext_data_body, None)
        
        return plaintext.decode('utf-8')
    except (InvalidTag, ValueError):
        raise HTTPException(status_code=500, detail="Decryption failed. Integrity check failed.")
    except Exception as e:
        print(f"Decryption error: {e}")
        raise HTTPException(status_code=500, detail="Internal decryption error")

def hash_token(token: str) -> str:
    """SHA-256 hash for service tokens"""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()
