from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

# Path to ChromeDriver
service = Service('./chromedriver.exe')  # Replace with your ChromeDriver path
driver = webdriver.Chrome(service=service)

# Open the webpage
url = "https://techtree.iiitd.edu.in/"  # Replace with your actual course directory URL
driver.get(url)

# Wait for the table to load
wait = WebDriverWait(driver, 10)
table = wait.until(EC.presence_of_element_located((By.ID, "data-table")))  # Adjust if necessary

# Extract the course data from the table
courses = []
rows = table.find_elements(By.TAG_NAME, "tr")

for row in rows:
    cells = row.find_elements(By.TAG_NAME, "td")
    if len(cells) > 0:
        try:
            name = cells[1].text
            acronym = cells[2].text if len(cells) > 1 else ""
            code = cells[3].text if len(cells) > 2 else ""
            semester = cells[6].text if len(cells) > 2 else ""
            
            courses.append({
                'name': name,
                'acronym': acronym,
                'code': code,
                'semester': semester
            })
        except Exception as e:
            print("Skipping row due to error:", e)
            continue

file_path = './courses.json'

# Write the list of dictionaries to the file
with open(file_path, 'w') as f:
    json.dump(courses, f, indent=4)

print(f"Data has been written to {file_path}")

# Close the driver
driver.quit()


