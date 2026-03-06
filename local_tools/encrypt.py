import argparse
import base64

from Crypto.Cipher import AES
from Crypto.Hash import HMAC, SHA256
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2


SALT_SIZE = 16
TAG_SIZE = 16
NONCE_SIZE = 12
ITERATIONS = 100000


def read_from_file(path: str) -> bytes:
    with open(path, "rb") as file:
        return file.read() 


def write_to_file(path: str, content: bytes):
    with open(path, "wb") as file:
        file.write(content)


def encrypt_to_file(src_path: str, dst_path: str, password: bytes):
    salt = get_random_bytes(SALT_SIZE)
    key = PBKDF2(password, salt, 32, count=100000)

    plain_data = read_from_file(src_path)

    cipher = AES.new(key, AES.MODE_GCM, nonce=get_random_bytes(NONCE_SIZE))
    ciphertext, tag = cipher.encrypt_and_digest(plain_data)

    with open(dst_path, "wb") as f:
        f.write(salt)
        f.write(tag)
        f.write(cipher.nonce)
        f.write(ciphertext)


def decrypt_to_file(src_path: str, dst_path: str, password: bytes):
    with open(src_path, "rb") as f:
        salt = f.read(SALT_SIZE)
        tag = f.read(TAG_SIZE)
        nonce = f.read(NONCE_SIZE)
        ciphertext = f.read()

    key = PBKDF2(password, salt, 32, count=ITERATIONS)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    try:
        message = cipher.decrypt_and_verify(ciphertext, tag)
    except ValueError:
        print("The message was modified!")
        exit()
    
    write_to_file(dst_path, message)


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("src_path", type=str)
    parser.add_argument("dst_path", type=str)
    parser.add_argument("password", type=str)
    parser.add_argument("-d", "--decrypt", action="store_true")

    return parser.parse_args()


def main():
    args = get_args()
    if args.decrypt:
        f = decrypt_to_file
    else:
        f = encrypt_to_file

    f(
        args.src_path,
        args.dst_path,
        bytes(args.password, "utf-8")
    )

if __name__ == "__main__":
    main()