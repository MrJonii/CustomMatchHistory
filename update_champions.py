import json
import requests

champions = {}

with open('D:/Code/CustomMatchHistoryOld/Champions.json') as file:
    champions = json.load(file)

for name in champions['data']:
    response = requests.post('http://localhost:42069/api/champions', json={'key': champions['data'][name]['key'], 'name': name})