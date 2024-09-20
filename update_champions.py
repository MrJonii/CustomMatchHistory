import json
import requests

champions = {}

with open('backend/.env') as file:
    env = file.readlines()

    for line in env:
        split = line.split('=')

        print(split)

        if split[0] == 'USER':
            backend_username = split[1].strip()

        if split[0] == 'PASSWORD':
            backend_password = split[1].strip()

with open('D:/Code/CustomMatchHistoryOld/Champions.json') as file:
    champions = json.load(file)

# for name in champions['data']:
#     response = requests.post('http://localhost:42069/api/champions', json={'key': champions['data'][name]['key'], 'name': name})
    
#response = requests.post('http://localhost:42069/api/champions', json={'key': '910', 'name': 'Hwei'})
#response = requests.post('http://localhost:42069/api/champions', json={'key': '901', 'name': 'Smolder'})
response = requests.post('https://jonii.org/api/champions', headers = {'Authorization': f'{backend_username}:{backend_password}'}, json={'key': '893', 'name': 'Aurora'})