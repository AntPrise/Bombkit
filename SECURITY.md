# Security policy and audit notes

This is a **best-effort cleanup, not a completed security audit**. Do not assume every legacy userscript is safe or currently compatible.

## Immediate actions

1. **Revoke the Telegram bot token used in the original archive with BotFather.** Redacting it from new files does not invalidate it, and repository history/copies may still expose it.
2. Replace Telegram credentials using a trusted backend or local environment, never public client-side scripts. `REPLACE_WITH_YOUR_OWN_TELEGRAM_BOT_TOKEN` and `REPLACE_WITH_CHAT_ID` are intentionally non-working placeholders.
3. Read each legacy script before running it. Some scripts monkey-patch browser APIs, intercept networking, or may behave unexpectedly.
4. Validate with the current Game of Bombs client before using scripts. No live server integration test was performed.

## Improvements included

- No dynamic `eval`, code execution, or HTML rendering of imported script content in the new dashboard; user strings are inserted as text nodes.
- Dashboard has a restrictive Content Security Policy and no external dependencies or network calls.
- Electron uses `contextIsolation`, `sandbox`, no Node integration in the renderer, limited preload IPC, navigation restrictions, and restricted external link opening.
- Import payload capped at 5 MB and item count capped at 5,000; browser storage limits still apply.
- Telegram token-like secrets and chat IDs redacted in all distributed script files.

## Remaining work

- Audit each historical script for unsafe DOM sinks, insecure API hooks, excessive permissions, and external endpoints before distributing it as a production-ready component.
- Install dependencies and run `npm audit` in a networked environment. Offline packaging cannot verify the actual resolved dependency tree.
- Establish a tested CI workflow and game-client integration tests. The dashboard is structurally validated but no Electron GUI integration test was run.
