import requests
import base64
import sys

LOCKFILE = 'C:/Riot Games/League of Legends/lockfile'
CERT = 'D:/Code/CustomMatchHistory/riotgames.pem'

with open(LOCKFILE) as file:
    content = file.readline()
    port = content.split(':')[2]
    password = content.split(':')[3]

with open('backend/.env') as file:
    env = file.readlines()
    backend_username = env.split('\n')

    for line in env.split('\n'):
        split = line.split('=')

        if split[0] == 'USER':
            backend_username = split[1]

        if split[0] == 'PASSWORD':
            backend_password = split[1]


url = f'https://127.0.0.1:{port}/lol-match-history/v1/games/{sys.argv[1]}'
auth = f"Basic {base64.b64encode(f'riot:{password}'.encode('ascii')).decode('ascii')}"

response = requests.get(url, verify = CERT, headers = {'Authorization': auth})
print(response.status_code)

url = f'http://127.0.0.1:42069/api/matches'

response = requests.post(url, headers = {'Authorization': f'{backend_username}:{backend_password}'}, json = response.json())
print(response.status_code)
print(response.json())
