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

url = f'https://jonii.org/api/matches'
urlS4 = f'https://jonii.org/api/matches?season=4'

response = requests.get(urlS4)
j = response.json()

# for match in j:
#     blue = False
#     red = False


#     for team in match['teams']:
#         for ban in team['bans']:
#             if ban == 'Orianna':
#                 if team['side'] == 'Blue':
#                     blue = True
#                 else:
#                     red = True

#     if blue and red:
#         x = 5




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