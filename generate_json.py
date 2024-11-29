import pandas as pd
import json

# Load the CSV file
df = pd.read_csv("categories-traits.csv")

# Initialize an empty dictionary for the JSON
json_data = {}

# Iterate through each row in the dataframe
for _, row in df.iterrows():
    image_id = f"{int(row['Image']):03}"  # Format image ID as '001', '002', etc.
    json_data[image_id] = {
        "about": f"{row['Temporal Evidence'].split(' (')[0]} with intricate relationships across multiple dimensions.",
        "traits": {
            "temporal": {
                "name": row['Temporal Evidence'].split(' (')[0],
                "value": float(row['Temporal Evidence'].split(' (')[1].replace('%', '').replace(')', '')) / 100
            },
            "material": {
                "name": row['Material Analysis'].split(' (')[0] if isinstance(row['Material Analysis'], str) else "Unknown",
                "value": float(row['Material Analysis'].split(' (')[1].replace('%', '').replace(')', '')) / 100 if isinstance(row['Material Analysis'], str) else 0.0
            },
            "structural": {
                "name": row['Structural Analysis'].split(' (')[0] if isinstance(row['Structural Analysis'], str) else "Unknown",
                "value": float(row['Structural Analysis'].split(' (')[1].replace('%', '').replace(')', '')) / 100 if isinstance(row['Structural Analysis'], str) else 0.0
            },
            "emergent": {
                "name": row['Emergent Phenomena'].split(' (')[0] if isinstance(row['Emergent Phenomena'], str) else "Unknown",
                "value": float(row['Emergent Phenomena'].split(' (')[1].replace('%', '').replace(')', '')) / 100 if isinstance(row['Emergent Phenomena'], str) else 0.0
            },
        }
    }

    # Check if 'Fibonacci Sequence' exists
    if isinstance(row['Fibonacci Sequence'], str) and row['Fibonacci Sequence'] != "None":
        json_data[image_id]["traits"]["fibonacci"] = {
            "name": row['Fibonacci Sequence'].split(' (')[0],
            "value": float(row['Fibonacci Sequence'].split(' (')[1].replace('%', '').replace(')', '')) / 100
        }

# Write the JSON to a file
with open("data/evidence.json", "w") as json_file:
    json.dump(json_data, json_file, indent=4)

print("JSON file has been created successfully!")