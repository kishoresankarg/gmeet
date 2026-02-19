import requests
import json

try:
    print("Testing GET /api/transcripts/sort...")
    response = requests.get("http://localhost:8000/api/transcripts/sort?sort_by=date-newest&skip=0&limit=10")
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Retrieved {len(data)} transcripts.")
        if len(data) > 0:
            print("First transcript sample:")
            print(json.dumps(data[0], indent=2))
    else:
        print(f"Failed with status {response.status_code}: {response.text}")

    print("\nTesting GET /api/transcripts (list)...")
    response = requests.get("http://localhost:8000/api/transcripts?skip=0&limit=10")
    if response.status_code == 200:
         data = response.json()
         print(f"Success! Retrieved {len(data)} transcripts.")
    else:
        print(f"Failed with status {response.status_code}: {response.text}")

except Exception as e:
    print(f"Error: {e}")
