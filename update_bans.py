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
urlS3 = f'http://127.0.0.1:42069/api/matches?season=3'

response = requests.get(urlS3)
j = response.json()

for match in j:
    if len(match['teams'][0]['bans']) == 0:
        for i in range(len(match['riotMatch']['teams'])):
            rteam = match['riotMatch']['teams'][i]
            team = match['teams'][i]

            for ban in rteam['bans']:
                team['bans'].append(ban)

        response = requests.patch(f'{url}/{match["_id"]}', headers = {'Authorization': f'{backend_username}:{backend_password}'}, json = match)

    for team in match['teams']:
        for player in team['players']:
            if player['riotId'] == '419e74a6-983d-53fa-823b-333d69b07ab2':
                player['riotId'] = '98a8790d-3018-5351-8b89-4e36441ff486'

                response = requests.patch(f'{url}/{match["_id"]}', headers = {'Authorization': f'{backend_username}:{backend_password}'}, json = match)