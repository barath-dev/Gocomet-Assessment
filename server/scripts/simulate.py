import requests
import random
import time
import threading

API_BASE_URL = "http://localhost:3000/api/leaderboard"

def submit_score(user_id):
    score = random.randint(100, 10000)
    try:
        response = requests.post(f"{API_BASE_URL}/submit", json={"userId": user_id, "score": score})
        if response.status_code != 201:
            print(f"⚠️ Submit Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"❌ Connection Error (Submit): {e}")

def get_top_players():
    try:
        response = requests.get(f"{API_BASE_URL}/top")
        
        if response.status_code != 200:
            print(f"⚠️ Top Players Error {response.status_code}: {response.text}")
            return []
            
        return response.json()
    except Exception as e:
        print(f"❌ Connection Error (Top): {e}")
        return []

def get_user_rank(user_id):
    try:
        response = requests.get(f"{API_BASE_URL}/rank/{user_id}")
        
        if response.status_code != 200:
            print(f"⚠️ Rank Error {response.status_code}: {response.text}")
            return {}
            
        return response.json()
    except Exception as e:
        print(f"❌ Connection Error (Rank): {e}")
        return {}

def simulate_user_activity():
    while True:
        user_id = random.randint(1, 1000000)
        
        # Actions
        submit_score(user_id)
        
        if random.random() > 0.8: # Fetch less often than submit
            print(f"Top 10: {get_top_players()}")
            print(f"User Rank: {get_user_rank(user_id)}")

        time.sleep(random.uniform(0.1, 0.5))

if __name__ == "__main__":
    print(f"🚀 Simulation starting on {API_BASE_URL}")
    print("Press Ctrl+C to stop.")
    
    threads = []
    for i in range(5):
        t = threading.Thread(target=simulate_user_activity)
        t.daemon = True
        t.start()
        threads.append(t)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Simulation stopped.")