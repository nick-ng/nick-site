import requests
from bs4 import BeautifulSoup

pants = requests.get('https://www.serebii.net/swordshield/galarpokedex.shtml')

soup = BeautifulSoup(pants.text, 'html.parser')

table = soup.select('table:contains("Grookey")')[0]
# print(len(table))

# print(table.find_all('td', { 'class': 'fooevo' }))

headers1 = [header.text.strip() for header in table.find_all('td', { 'class': 'fooevo' })]
headers = [h for h in headers1 if not h in ['Base Stats']]
# print(headers)
print(table.find_all('tr')[2])
results = [{headers[i]: cell.text.strip() for i, cell in enumerate(row.find_all('td', { 'class': 'fooinfo' }))}
    for row in table.find_all('tr')]

def not_empty(row):
    return 'Name' in row

results2 = list(filter(not_empty, results))

# for result in results2:
#     print(result['Name'])

names = [result['Name'] for result in results2]
print(names)
print(len(names))