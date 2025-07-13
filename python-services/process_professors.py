import json
import re

# Load the JSON data
with open('professors.json', 'r') as f:
    professors = json.load(f)

valid_departments = {"CB", "ECE", "CSE", "HCD", "MTH", "SSH"}

for prof in professors:
    # Replace (Math) with (MTH)
    prof['name'] = prof['name'].replace("(Math)", "(MTH)")
    prof['description'] = prof['description'].replace("(Math)", "(MTH)")

    # Find all bracketed strings in description and name
    brackets_in_description = re.findall(r'\((.*?)\)', prof['description'])
    brackets_in_name = re.findall(r'\((.*?)\)', prof['name'])

    # Combine and search for first matching department
    selected_department = None
    all_brackets = brackets_in_description + brackets_in_name
    for item in all_brackets:
        parts = [p.strip() for p in item.split(', ')]
        for part in parts:
            if part in valid_departments:
                selected_department = part
                break
        if selected_department:
            break

    # Set department attribute and remove old description
    prof['department'] = selected_department if selected_department else ""
    prof.pop('description', None)

    # Remove all bracketed parts from name
    prof['name'] = re.sub(r'\s*\(.*?\)', '', prof['name']).strip()

    # Keep only the first email, remove all whitespace
    prof['email'] = re.sub(r'\s+', '', prof['email'].split(',')[0])

# Write back to the JSON file
with open('professors.json', 'w') as f:
    json.dump(professors, f, indent=4)
