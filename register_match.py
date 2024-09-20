import requests
import base64
import sys
import json
import os

LOCKFILE = 'C:/Riot Games/League of Legends/lockfile'
CERT = 'D:/Code/CustomMatchHistory/riotgames.pem'

with open(LOCKFILE) as file:
    content = file.readline()
    port = content.split(':')[2]
    password = content.split(':')[3]

with open('backend/.env') as file:
    env = file.readlines()

    for line in env:
        split = line.split('=')

        print(split)

        if split[0] == 'USER':
            backend_username = split[1].strip()

        if split[0] == 'PASSWORD':
            backend_password = split[1].strip()

url = f'https://127.0.0.1:{port}/lol-match-history/v1/games/{sys.argv[1]}'
auth = f"Basic {base64.b64encode(f'riot:{password}'.encode('ascii')).decode('ascii')}"

response = requests.get(url, verify = CERT, headers = {'Authorization': auth})
print(response.status_code)

j = response.json()

j['season'] = 4
j['teams'][0]['bans'] = []
j['teams'][1]['bans'] = []

for i in range(10):
    team = 0 if i < 5 else 1
    j['teams'][team]['bans'].append(sys.argv[i + 2])
       
with open('match.json', 'w') as file:
    file.write(json.dumps(j, indent = 4))

url = f'https://jonii.org/api/matches'

response = requests.post(url, headers = {'Authorization': f'{backend_username}:{backend_password}'}, json = j)
j = response.json()

exit()

url = f'https://jonii.org/api/matches/{j["_id"]}'
response = requests.get(url, headers = {'Authorization': f'{backend_username}:{backend_password}'})

m = response.json()

for t in m['teams']:
    for p in t['players']:
        if p['champion'] == sys.argv[12] or p['champion'] == sys.argv[13]:
            p['mvp'] = True

response = requests.patch(url, headers = {'Authorization': f'{backend_username}:{backend_password}'}, json = m)

os.system(f'py update_bans.py')

