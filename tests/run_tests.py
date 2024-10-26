from user_service import *

fail = False

# User Service tests
create = test_create_user()
if not create:
    fail = True
    print("Failed to create user")
login_valid = test_login_user_valid()
if not login_valid:
    fail = True
    print("Failed to login user with valid credentials")
login_invalid = test_login_user_invalid()
if not login_invalid:
    fail = True
    print("Failed to login user with invalid credentials")
verify_valid = test_verify_token_valid()
if not verify_valid:
    fail = True
    print("Failed to verify token with valid token")
verify_no_token = test_verify_token_no_token()
if not verify_no_token:
    fail = True
    print("Failed to verify token with no token")
verify_invalid = test_verify_token_invalid()
if not verify_invalid:
    fail = True
    print("Failed to verify token with invalid token")


if not fail:
    print("All tests passed!")
    exit(0)
else:
    print("Some tests failed")
    exit(1)