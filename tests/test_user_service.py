import requests
ENDPOINT = "http://user-service:3001/"

def login(email: str, password: str) -> requests.Response:
    endpoint = f"{ENDPOINT}auth/login"
    payload = {
      "email": email,
      "password": password
    }
    resp = requests.post(endpoint, json=payload)
    return resp

def test_create_user():
    endpoint = f"{ENDPOINT}users"
    payload = {
      "username": "SampleUserName",
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    resp = requests.post(endpoint, json=payload)
    assert resp.status_code == 201
    # if resp.status_code != 201:
    #     print(resp.json())
    #     return False
    # return True
    
def test_login_user_valid():
    resp = login("sample@gmail.com", "SecurePassword")
    assert resp.status_code == 200
    # if resp.status_code != 200:
    #     print(resp.json())
    #     return False
    # return True

def test_login_user_invalid():
    resp = login("sample@gmail.com", "WrongPassword")
    assert resp.status_code == 401
    # if resp.status_code != 401:
    #     print(resp.json())
    #     return False
    # return True

def test_verify_token_valid():
    resp = login("sample@gmail.com", "SecurePassword")
    token = resp.json()["data"]["accessToken"]
    endpoint = f"{ENDPOINT}auth/verify-token"
    headers = {
      "Authorization": f"Bearer {token}"
    }
    resp = requests.get(endpoint, headers=headers)
    assert resp.status_code == 200
    # if resp.status_code != 200:
    #     print(resp.json())
    #     return False
    # return True

def test_verify_token_no_token():
    endpoint = f"{ENDPOINT}auth/verify-token"
    resp = requests.get(endpoint)
    assert resp.status_code == 401
    # if resp.status_code != 401:
    #     print(resp.json())
    #     return False
    # return True

def test_verify_token_invalid():
    endpoint = f"{ENDPOINT}auth/verify-token"
    headers = {
      "Authorization": f"Bearer wrongToken"
    }
    resp = requests.get(endpoint, headers=headers)
    assert resp.status_code == 401
    # if resp.status_code != 401:
    #     print(resp.json())
    #     return False
    # return True
