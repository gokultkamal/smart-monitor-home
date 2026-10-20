# Home button on the development monitor

Tested only on Samsung M7 LS43DM700UWXXL, firmware 1340. Installing a signed
widget alone does not register it as the system Home screen. Ordinary Developer
Mode does not necessarily grant access to these system settings.

On this model the existing `tvctx-manager` loads `/opt/dbspace/.app-context.db`
at startup. The working setup combines a separately configured Home/startup
assignment with two added routing records. A short Home press then uses native
`force-launch` rather than a temporary input-reading process.

The experimental records used for this project's existing application ID were:

```sql
BEGIN IMMEDIATE;
INSERT INTO managed_app (appid, ui_type, source)
VALUES ('QuietTV001.QuietTV', NULL, NULL);
INSERT INTO key_filter
 (appid, key, longpress, override, on_selector, request, target_selector, args)
VALUES
 ('QuietTV001.QuietTV', 'XF86Home', NULL, 'true',
  '~context:monopoly,~system:ttx_active', 'force-launch',
  'package:QuietTV001.QuietTV', NULL);
COMMIT;
```

These are reference records, not a portable installer. Do not run them against a
different schema or an existing registration. Before any change, use SQLite's
backup mechanism, export the existing rows and Home/startup assignments, verify
the schema and integrity, and keep a way to restore the previous configuration.
Do not delete or replace Samsung's existing routes. Application IDs must match
the installed, signed packages. System write access is not supplied by this repo.

On the tested firmware the live manager reload notification is:

```
vconftool set -f -t int memory/appfw/app_context_db_change 1
```

Rollback removes only the exact added records and sends another reload
notification. Preserve all original rows and verify `PRAGMA integrity_check`.
Restore the captured Home/startup assignments separately if those were changed.

Physical verification: Netflix and YouTube each returned to custom Home with
one press in 1–2 seconds. The same Netflix test passed after disconnecting power
for 20 seconds; a changed kernel boot ID confirmed a genuine cold boot. No
background key-reading helper was needed. Firmware updates or package changes
may require checking the route again. A successful launch return code is not
proof of what is visible on screen.
