import requests
import json

url = "https://yqhhznojfmtdhqacehsc.supabase.co"
key = "sb_secret_PvVF7d9siTputuMDPR2t4w_ygvhycO8"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}

# Infelizmente a API REST do Supabase não permite executar SQL arbitrário diretamente
# Isso só é possível via SQL Editor ou via uma Edge Function/RPC customizada.
# Mas eu posso usar a Service Key para verificar o esquema e dar o diagnóstico exato.

def check_schema():
    response = requests.get(f"{url}/rest/v1/", headers=headers)
    if response.status_code == 200:
        data = response.json()
        couples_props = data.get("definitions", {}).get("couples", {}).get("properties", {})
        print("Colunas atuais da tabela 'couples':")
        for prop in sorted(couples_props.keys()):
            print(f"- {prop}")
        
        vendors_exists = "vendors" in data.get("definitions", {})
        print(f"\nTabela 'vendors' existe? {'Sim' if vendors_exists else 'Não'}")
    else:
        print(f"Erro ao acessar API: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    check_schema()
