# Roadmap

Index for the [flow-profile example](../FLOCK.md) — one line per item, machine-writable
([spec §3.3](../../../spec/SPEC.md#33-machine-writable-index-new-in-02)). Detail lives
in the linked documents, never here. The linked documents are illustrative and not part
of this example.

| Item | Target | Status | Docs |
|---|---|---|---|
| Passkey sign-in — replace password auth | 1.0 | Done 2026-08-14 | [feature](feature/PASSKEY_SIGNIN.md) · [blueprint](blueprint/PASSKEY_SIGNIN_BLUEPRINT.md) · [worklog](worklog/PASSKEY_SIGNIN_WORKLOG.md) |
| CSV import — bring existing data in | 1.1 | Building | [feature](feature/CSV_IMPORT.md) · [blueprint](blueprint/CSV_IMPORT_BLUEPRINT.md) · [worklog](worklog/CSV_IMPORT_WORKLOG.md) |
| Share links — read-only project URLs | 1.1 | Design | [feature](feature/SHARE_LINKS.md) |
| Offline mode | — | Parked | [feature](feature/OFFLINE_MODE.md) |

The rows mirror the [§3.4 transitions](../../../spec/SPEC.md#34-stage-transitions-new-in-02):
a `Design` item has only its feature document (Open created it), a `Building` item has
all three (Advance created the blueprint and worklog), and a `Done` status carries its
date as part of the label.
