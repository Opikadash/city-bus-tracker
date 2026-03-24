#!/usr/bin/env python3
\"\"\"Get Auth0 JWT Access Token - VALIDATED + Multi-Env Save\"\"\"

import http.client
import urllib.parse
import json
from datetime import datetime

# ===== REPLACE THESE =====
DOMAIN = "domian.auth0.com"
CLIENT_ID = "client_id" 
CLIENT_SECRET = "secret"  
AUDIENCE = "Audience for JWT Access Token"
# ========================

def get_access_token():
    conn = http.client.HTTPSConnection(DOMAIN)
    
    payload = urllib.parse.urlencode({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'audience': AUDIENCE
    })
    
    headers = {'content-type': "application/x-www-form-urlencoded"}
    
    conn.request("POST", "/oauth/token", payload, headers)
    res = conn.getresponse()
    data = res.read()
    
    if res.status == 200:
        token_data = json.loads(data.decode("utf-8"))
        
        # ✅ VALIDATE
        if 'access_token' not in token_data or len(token_data['access_token']) < 100:
            print("❌ Invalid/missing token")
            return
        
        token = token_data['access_token']
        expires = token_data.get('expires_in', 0)
        
        print("✅ TOKEN VALIDATED & SAVED!")
        print(f"Preview: {token[:20]}...{token[-20:]}")
        print(f"Expires: +{expires}s | Scope: {token_data.get('scope', 'N/A')}")
        
        # 💾 ENV CONTENT
        env_vars = f"""# Generated {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
AUTH0_DOMAIN={DOMAIN}
AUTH0_ACCESS_TOKEN={token}
AUTH0_TOKEN_TYPE={token_data.get('token_type', 'Bearer')}
AUTH0_EXPIRES_IN={expires}
AUTH0_SCOPE={token_data.get('scope', '')}
AUTH0_AUDIENCE={AUDIENCE}"""
        
        # Backend
        with open('backend/.env.auth0', 'w') as f:
            f.write(env_vars)
        print("💾 backend/.env.auth0")
        
        # Frontend (VITE_)
        frontend_env = env_vars.replace('AUTH0_', 'VITE_AUTH0_')
        with open('frontend/.env.local', 'w') as f:
            f.write(frontend_env)
        print("💾 frontend/.env.local")
        
        # Root
        with open('.env.local', 'w') as f:
            f.write(env_vars)
        print("💾 .env.local")
        
        print("\n🚀 Backend auto-loads token from .env.auth0")
        print("Use: process.env.AUTH0_ACCESS_TOKEN")
        
    else:
        print(f"❌ HTTP {res.status}: {data.decode('utf-8')}")
        print("\n🔧 Fix: Check CLIENT_ID/SECRET/AUDIENCE")

if __name__ == "__main__":
    get_access_token()

