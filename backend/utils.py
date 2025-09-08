import bcrypt

def hash_password(password):
    # Hash using bcrypt and decode to store as string in DB
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    # Convert stored hash string back to bytes before checking
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
