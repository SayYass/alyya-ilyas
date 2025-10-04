import os
from PIL import Image
import shutil

# Folder asal dan tujuan
input_folder = "assets"
output_folder = "assets_webp"

# Buat folder output kalau belum ada
os.makedirs(output_folder, exist_ok=True)

# Kualitas WebP
QUALITY = 70  

for root, _, files in os.walk(input_folder):
    rel_path = os.path.relpath(root, input_folder)
    out_dir = os.path.join(output_folder, rel_path)
    os.makedirs(out_dir, exist_ok=True)

    for file in files:
        input_path = os.path.join(root, file)
        filename, ext = os.path.splitext(file)
        ext = ext.lower()

        if ext in [".jpg", ".jpeg", ".png"]:
            output_path = os.path.join(out_dir, f"{filename}.webp")
            try:
                img = Image.open(input_path)

                # cek kalau punya alpha channel → biarkan RGBA
                if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")

                img.save(output_path, "WEBP", quality=QUALITY, method=6)
                print(f"Converted: {input_path} → {output_path}")
            except Exception as e:
                print(f"❌ Gagal convert {input_path}: {e}")
        else:
            output_path = os.path.join(out_dir, file)
            shutil.copy2(input_path, output_path)
            print(f"Copied: {input_path} → {output_path}")

print("✅ Semua gambar berhasil dikonversi ke WebP tanpa hilang transparansi!")
