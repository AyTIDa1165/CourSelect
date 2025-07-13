import json
from collections import defaultdict

# Load the JSON data
with open('courses.json', 'r') as f:
    courses = json.load(f)

# Group courses by (name, acronym)
grouped = defaultdict(list)
for course in courses:
    key = (course['name'], course['acronym'])
    grouped[key].append(course)

# Merge courses with same (name, acronym)
merged_courses = []
for (name, acronym), entries in grouped.items():
    merged = dict(entries[0])  # Take attributes from the first entry
    merged['code'] = '/'.join(sorted(entry['code'] for entry in entries))
    merged_courses.append(merged)

# Write back to the JSON file
with open('courses.json', 'w') as f:
    json.dump(merged_courses, f, indent=4)
