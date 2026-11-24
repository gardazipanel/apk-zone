#!/usr/bin/env python3
"""APK files se size aur SHA-256 nikal kar data/apps.json mein likhta hai.
Optional: --release  ->  GitHub Releases par upload (gh CLI chahiye)
Usage:
  python3 scripts/sync.py             # sirf size/sha update
  python3 scripts/sync.py --release   # update + GitHub release banao/upload karo
"""
import json, hashlib, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "apps.json"
db = json.loads(DATA.read_text(encoding="utf-8"))

for a in db["apps"]:
    apk = ROOT / "apks" / a["file"]
    if not apk.exists():
        print(f"[skip] {a['name']}: apks/{a['file']} nahi mila")
        continue
    a["sizeBytes"] = apk.stat().st_size
    a["sha256"] = hashlib.sha256(apk.read_bytes()).hexdigest()
    print(f"[ok]   {a['name']}: {a['sizeBytes']/1e6:.1f} MB")
    if "--release" in sys.argv:
        tag = a["releaseTag"]
        exists = subprocess.run(["gh", "release", "view", tag], capture_output=True).returncode == 0
        if exists:
            cmd = ["gh", "release", "upload", tag, str(apk), "--clobber"]
        else:
            cmd = ["gh", "release", "create", tag, str(apk),
                   "--title", f"{a['name']} v{a['version']}",
                   "--notes", f"{a['name']} version {a['version']}"]
        print("       ->", " ".join(cmd[:4]))
        subprocess.run(cmd, check=True)

DATA.write_text(json.dumps(db, indent=2, ensure_ascii=False), encoding="utf-8")
print("data/apps.json update ho gaya.")
