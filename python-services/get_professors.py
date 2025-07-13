import requests
from bs4 import BeautifulSoup
import json

urls = [
    "https://www.iiitd.ac.in/people/faculty",
    "https://www.iiitd.ac.in/people/visiting-faculty",
    "https://www.iiitd.ac.in/people/adjunct-faculty",
    "https://www.iiitd.ac.in/people/pop-faculty"
]

professors = []

for url in urls:
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    for div in soup.find_all("div", class_="post-content"):
        name_tag = div.find("h3", class_="team-title")
        desc_tag = div.find("h2", class_="team-subtitle")
        email_tag = div.find("div", class_="team-description")
        
        email = None
        if email_tag:
            a_tag = email_tag.find("a", href=True)
            if a_tag and a_tag['href'].startswith('mailto:'):
                email = a_tag['href'].replace('mailto:', '')

        if name_tag and desc_tag:
            professor = {
                "name": name_tag.get_text(strip=True),
                "description": desc_tag.get_text(strip=True),
                "email": email
            }
            professors.append(professor)

# Save to JSON
with open("./professors.json", "w", encoding="utf-8") as f:
    json.dump(professors, f, ensure_ascii=False, indent=4)
