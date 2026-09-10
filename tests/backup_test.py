import importlib.util
import tempfile
from pathlib import Path
spec = importlib.util.spec_from_file_location('backup', Path(__file__).resolve().parents[1] / 'deploy/backup.py')
backup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backup)
root = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='zzwdesign-backup-test-') as temporary:
    dest = Path(temporary)
    result = backup.backup(root, dest)
    references = backup.verify(result)
    assert references >= 100
    assert (result / 'verified.json').is_file()
    # Restore to a distinct disposable copy, never overwrite the live database.
    import shutil
    restored = dest / 'restored'
    shutil.copytree(result, restored)
    assert backup.verify(restored) == references
    print(f'PASS: consistent SQLite backup, {references} media references, restored-copy integrity')

# Retention fixture: disposable database and uploads, never business data.
import sqlite3
from contextlib import closing
with tempfile.TemporaryDirectory(prefix='zzwdesign-retention-test-') as temporary:
    base = Path(temporary)
    fixture = base / 'app'
    (fixture / 'data').mkdir(parents=True)
    (fixture / 'public/uploads').mkdir(parents=True)
    with closing(sqlite3.connect(fixture / 'data/app.db')) as db:
        db.execute('CREATE TABLE Work (cover TEXT, images TEXT)')
        db.execute('CREATE TABLE Setting (key TEXT, value TEXT)')
        db.commit()
    for _ in range(8):
        backup.backup(fixture, base / 'snapshots')
    assert len(list((base / 'snapshots').glob('snapshot-*'))) == 7
    print('PASS: retention keeps seven successful snapshots in disposable fixture')
