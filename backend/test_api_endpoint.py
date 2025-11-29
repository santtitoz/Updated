import requests

def test_api():
    url = "http://localhost:8000/api/v1/users/users/?search=eliabi"
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Success!")
            print(response.json())
        else:
            print("Failed!")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
