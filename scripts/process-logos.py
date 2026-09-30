import os
from PIL import Image

logo_map = {
    "Asset 1.png": "park-yard-1",
    "Asset 2.png": "park-yard-2",
    "Asset 3.png": "capital-towers",
    "Asset 4.png": "point-11",
    "Asset 5.png": "point-9",
    "Asset 6.png": "park-point",
    "Asset 7.png": "win-plaza",
    "Asset 8.png": "capital-green",
    "Asset 9.png": "east-point",
    "Asset 10.png": "la-colina-west",
    "Asset 11.png": "la-colina-east"
}

source_dir = r"G:\Downloads\New folder\New folder"
target_dir = r"f:\ARTech\capital-hills-redesign\public\project-logos"
os.makedirs(target_dir, exist_ok=True)

# Cream color matching website text: #f5f2e9 -> rgb(245, 242, 233)
CREAM_RGB = (245, 242, 233)

for asset_name, project_slug in logo_map.items():
    src_path = os.path.join(source_dir, asset_name)
    if not os.path.exists(src_path):
        src_path = os.path.join(target_dir, asset_name)
        
    img = Image.open(src_path).convert("RGBA")
    
    # Save standard clean named version
    dest_standard = os.path.join(target_dir, f"{project_slug}.png")
    img.save(dest_standard, "PNG")
    
    # Create cream recolored version
    # Replace RGB of every pixel with CREAM_RGB, preserving the original alpha (anti-aliasing)
    r, g, b, a = img.split()
    # Create solid cream image with the same alpha
    cream_img = Image.new("RGBA", img.size, (*CREAM_RGB, 255))
    cream_img.putalpha(a)
    
    dest_cream = os.path.join(target_dir, f"{project_slug}-cream.png")
    cream_img.save(dest_cream, "PNG")
    print(f"Processed {project_slug}: {img.size} -> standard & cream versions saved.")

print("All logos successfully processed!")
