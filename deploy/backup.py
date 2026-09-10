"""SQLite online backup + immutable uploaded files, seven verified snapshots.
Usage: python3 deploy/backup.py --root /www/wwwroot/zzwdesign --dest /www/backup/zzwdesign
No deployment or service operations. Only old verified snapshots under --dest are pruned.
"""
import argparse
import json
import shutil
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path


def verify(snapshot):
    with closing(sqlite3.connect(f'file:{(snapshot / "app.db").as_posix()}?mode=ro', uri=True)) as db:
        if db.execute('PRAGMA integrity_check').fetchone()[0] != 'ok':
            raise RuntimeError('SQLite integrity check failed')
        files = []
        for cover, images in db.execute('SELECT cover, images FROM Work'):
            files += [cover] + json.loads(images)
        for key, value in db.execute('SELECT key,value FROM Setting'):
            if key in ('mediaPath', 'aboutPortrait') and value:
                files.append(value)
        for value in filter(None, files):
            if not value.startswith('/uploads/') or Path(value).name in ('', '.', '..'):
                raise RuntimeError('Invalid stored media path')
            if not (snapshot / 'uploads' / Path(value).name).is_file():
                raise RuntimeError('Missing referenced media: ' + value)
    return len(files)


def backup(root, dest):
    root, dest = root.resolve(), dest.resolve()
    if not (root / 'data/app.db').is_file():
        raise RuntimeError('Database missing; no snapshot created')
    if dest == root or root in dest.parents:
        raise RuntimeError('Backup destination must be outside application directory')
    dest.mkdir(parents=True, exist_ok=True)
    snapshot = dest / ('snapshot-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ'))
    snapshot.mkdir()
    with closing(sqlite3.connect(f'file:{(root / "data/app.db").as_posix()}?mode=ro', uri=True)) as source:
        with closing(sqlite3.connect(snapshot / 'app.db')) as target:
            source.backup(target)
    # App never removes previously referenced upload files, so every DB reference remains available.
    shutil.copytree(root / 'public/uploads', snapshot / 'uploads')
    references = verify(snapshot)
    (snapshot / 'verified.json').write_text(json.dumps({'time':datetime.now(timezone.utc).isoformat(), 'references':references}), encoding='utf-8')
    completed = sorted(p for p in dest.glob('snapshot-*') if p.is_dir() and not p.is_symlink() and (p / 'verified.json').is_file())
    for old in completed[:-7]:
        if old.resolve().parent != dest:
            raise RuntimeError('Refusing prune outside backup root')
        shutil.rmtree(old)
    return snapshot


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--dest', type=Path, required=True)
    args = parser.parse_args()
    print(backup(args.root, args.dest))
