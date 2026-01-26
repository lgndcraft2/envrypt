from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize Limiter
# key_func=get_remote_address uses the client's IP address to track usage
limiter = Limiter(key_func=get_remote_address)
