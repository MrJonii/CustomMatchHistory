import requests
import base64
import sys
import json

with open('backend/.env') as file:
    env = file.readlines()

    for line in env:
        split = line.split('=')

        print(split)

        if split[0] == 'USER':
            backend_username = split[1].strip()

        if split[0] == 'PASSWORD':
            backend_password = split[1].strip()

url = f'http://127.0.0.1:42069/api/matches'

response = requests.get(url)
j = response.json()

for match in j:
    if len(match['teams'][0]['bans']) == 0:
        for i in range(len(match['riotMatch']['teams'])):
            rteam = match['riotMatch']['teams'][i]
            team = match['teams'][i]

            for ban in rteam['bans']:
                team['bans'].append(ban)

        response = requests.patch(f'{url}/{match["_id"]}', headers = {'Authorization': f'{backend_username}:{backend_password}'}, json = match)