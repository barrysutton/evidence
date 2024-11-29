import json

# File paths
input_file = "/Users/barrysutton/Dropbox/evidence-data-viz/data/evidence.json"  # Absolute path to the evidence JSON file
output_file = "/Users/barrysutton/Dropbox/evidence-data-viz/data/arweave_urls.json"  # Absolute path for output file

def extract_arweave_urls(input_file, output_file):
    try:
        with open(input_file, "r") as file:
            data = json.load(file)
        
        # Extract all image URLs
        arweave_urls = {
            item_id: item_data["imageUrl"]
            for item_id, item_data in data.items()
            if "imageUrl" in item_data and "arweave.net" in item_data["imageUrl"]
        }
        
        # Write the extracted URLs to a new file
        with open(output_file, "w") as file:
            json.dump(arweave_urls, file, indent=4)
        
        print(f"Arweave URLs successfully extracted! Saved as: {output_file}")
    
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the function
extract_arweave_urls(input_file, output_file)