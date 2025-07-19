import os
import urllib.request

# Create images directory if it doesn't exist
if not os.path.exists('images'):
    os.makedirs('images')

# List of image URLs and their local filenames
images = [
    ('https://cdn.prod.website-files.com/65e67a2bcd837a0b5bd3d5a3/67e45908be0c272eda9ff435_Screenshot%202025-03-26%20at%203.43.48%E2%80%AFPM.png', 'dkb-showcase-1.png'),
    ('https://cdn.prod.website-files.com/65e67a2bcd837a0b5bd3d5a3/67e4590a21cd32d2d4b71e7b_Screenshot%202025-03-26%20at%203.43.38%E2%80%AFPM.png', 'dkb-showcase-2.png'),
    ('https://cdn.prod.website-files.com/65e67a2bcd837a0b5bd3d5a3/67e4591591dada623fdd944e_Screenshot%202025-03-26%20at%203.43.27%E2%80%AFPM.png', 'dkb-showcase-3.png'),
    ('https://cdn.prod.website-files.com/65e67a2bcd837a0b5bd3d5a3/67e4595a45dd2fbe45a84335_Screenshot%202025-03-26%20at%203.45.23%E2%80%AFPM.png', 'dkb-showcase-4.png')
]

# Download each image
for url, filename in images:
    try:
        print(f'Downloading {filename}...')
        urllib.request.urlretrieve(url, os.path.join('images', filename))
        print(f'Successfully downloaded {filename}')
    except Exception as e:
        print(f'Failed to download {filename}: {str(e)}') 