import re

"""
Regex expression to match alphanumeric characters and whitespaces only
"""
alnum_and_whitespaces = re.compile(r"^[a-zA-Z0-9 ]+$")


def is_alnum_and_whitespaces(s: str) -> bool:
    return alnum_and_whitespaces.fullmatch(s) is not None
