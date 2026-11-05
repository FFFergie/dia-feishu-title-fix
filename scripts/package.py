"""Build the unpacked Dia extension ZIP using the Python standard library."""
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "extension/manifest.json").read_text())
version = manifest["version"]
output = root / "dist" / f"dia-feishu-title-fix-{version}.zip"
output.parent.mkdir(exist_ok=True)
with ZipFile(output, "w", ZIP_DEFLATED) as archive:
    for name in ("manifest.json", "content.js"):
        archive.write(root / "extension" / name, name)
    archive.write(root / "LICENSE", "LICENSE")
print(output)
