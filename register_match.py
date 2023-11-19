import requests
import base64
import sys

LOCKFILE = 'C:/Riot Games/League of Legends/lockfile'
CERT = 'D:/Code/CustomMatchHistory/riotgames.pem'

with open(LOCKFILE) as file:
    content = file.readline()
    port = content.split(':')[2]
    password = content.split(':')[3]

url = f'https://127.0.0.1:{port}/lol-match-history/v1/games/{sys.argv[1]}'
auth = f"Basic {base64.b64encode(f'riot:{password}'.encode('ascii')).decode('ascii')}"

response = requests.get(url, verify = CERT, headers = {'Authorization': auth})
print(response.status_code)

url = f'http://127.0.0.1:42069/api/matches'

response = requests.post(url, headers = {'Authorization': 'admin:auD79ERBjYLLikjeNvAL'}, json = response.json())
print(response.status_code)
print(response.json())
