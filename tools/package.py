"""Create personal unsigned packages. Sign both with YOUR author certificate."""
import argparse,json,secrets,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--native-build',type=Path,help='Directory containing the built HomeControls.dll')
parser.add_argument('--catalogue-snapshot',type=Path,help='Optional personally obtained catalogue metadata')
args=parser.parse_args()
private=root/'private';private.mkdir(exist_ok=True);private.chmod(0o700)
auth_file=private/'device-auth.json'
if not auth_file.exists():
 auth_file.write_text(json.dumps({'token':secrets.token_hex(32)}));auth_file.chmod(0o600)
auth=json.loads(auth_file.read_text());auth.update(companionId='HomeCtl001.Control',transport='messageport')
out=root/'build/unsigned';out.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(out/'Home-unsigned.wgt','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted((root/'web').rglob('*')):
  if p.is_file() and p.name not in ('device-config.js','device-config.local.js'):z.write(p,p.relative_to(root/'web'))
 z.writestr('device-config.js','window.HomeDeviceConfig = '+json.dumps(auth)+';\n' if args.native_build else 'window.HomeDeviceConfig = null;\n')
if args.native_build:
 with zipfile.ZipFile(out/'HomeControls-unsigned.tpk','w',zipfile.ZIP_DEFLATED) as z:
  z.write(root/'native/tizen-manifest.xml','tizen-manifest.xml')
  for name in ['HomeControls.dll','HomeControls.runtimeconfig.json']:z.write(args.native_build/name,'bin/'+name)
  z.write(args.native_build/'HomeControls.deps.json','HomeControls.deps.json')
  z.write(root/'web/icon.png','shared/res/icon.png')
  z.writestr('res/device-auth.json',json.dumps({'token':auth['token']}))
  if args.catalogue_snapshot:z.write(args.catalogue_snapshot,'res/catalogue-snapshot.json')
for p in out.iterdir():p.chmod(0o600)
print('Personal unsigned packages created in build/unsigned. Keep private/ and build/ out of Git.')
