import json  # Importing the JSON module to handle JSON files

# Specify the file path of evidence.json
file_path = "evidence.json"  # The script assumes the file is in the same folder as this script

# Load the JSON data
try:
    with open(file_path, "r") as file:  # Open evidence.json in read mode
        data = json.load(file)  # Parse the JSON file into a Python dictionary
except FileNotFoundError:
    print(f"Error: {file_path} not found. Make sure the file is in the same folder as this script.")
    exit()

# Add the 'id' field to each entry
for key, value in data.items():
    if "id" not in value:  # Check if the 'id' field is already present
        value["id"] = key  # Add the 'id' field using the key (e.g., "007")

# Save the updated JSON back to evidence.json
try:
    with open(file_path, "w") as file:  # Open evidence.json in write mode
        json.dump(data, file, indent=4)  # Write the updated data back with proper indentation
    print("Successfully added 'id' fields to all entries.")
except Exception as e:
    print(f"Error saving the file: {e}")  # Handle any unexpected file write errors