import argparse
import base64

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


def read_from_file(path: str) -> bytes:
    with open(path, "rb") as file:
        return file.read() 


def write_to_file(path: str, content: bytes):
    with open(path, "wb") as file:
        file.write(content)


def get_fernet(password: bytes, salt: bytes = b"") -> Fernet:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=1_200_000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password))

    return Fernet(key)


def encrypt_content(content: bytes, password: bytes, salt: bytes = b"") -> bytes:
    f = get_fernet(password, salt)

    return f.encrypt(content)


def decrypt_content(content: bytes, password: bytes, salt: bytes = b"") -> bytes:
    f = get_fernet(password, salt)

    return f.decrypt(content)


def encrypt_to_file(src_path: str, dst_path: str, password: bytes):
    src_content = read_from_file(src_path)
    dst_content = encrypt_content(src_content, password)
    write_to_file(dst_path, dst_content)


def decrypt_to_file(src_path: str, dst_path: str, password: bytes):
    src_content = read_from_file(src_path)
    dst_content = decrypt_content(src_content, password)
    write_to_file(dst_path, dst_content)


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