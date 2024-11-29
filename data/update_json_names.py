import json

# Path to the evidence.json file
file_path = "/Users/barrysutton/Dropbox/evidence-data-viz/data/evidence.json"

# Load the JSON data
with open(file_path, "r") as file:
    data = json.load(file)

# Update each entry to include a "name" field matching the ID
for id_key, entry in data.items():
    entry["name"] = id_key  # Add the "name" field equal to the ID

# Save the updated JSON back to the file
with open(file_path, "w") as file:
    json.dump(data, file, indent=4)

print("The 'name' field has been successfully added to each entry!")