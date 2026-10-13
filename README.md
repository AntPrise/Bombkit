# BombKit — Game of Bombs script workspace

An organized, English-named collection of Game of Bombs JavaScript tools and a local-first browser/Electron script library. The workspace allows safe text editing, categorization, search, import and export. **It does not execute imported scripts.**

## Quick start

**Browser:** Open `app/index.html` in Chrome or Edge. No dependencies needed. Scripts are stored in the browser's local storage.

**Desktop (Node.js 22 LTS recommended):**

```bash
npm install
npm start
```

To package the desktop application, run `npm run dist:win` on Windows.

## Organization

- `app/` — dashboard (separate HTML, CSS and JavaScript; no frameworks)
- `desktop/` — security-conscious Electron wrapper and limited IPC bridge
- `scripts/` — source scripts grouped by function; Tampermonkey scripts use `.user.js`
- `assets/` — theme and sprite files
- `catalog.json` — list of source names and original paths for traceability
- `docs/` — security notes and maintenance guidance

### Install a userscript

Open a file in `scripts/` ending in `.user.js` and install it in a userscript manager after reviewing its access permissions and configuration. Scripts under `scripts/` are historic community experiments, **not security-audited production software**. Scripts ending in `.js` may be snippets intended for browser developer tools and are not necessarily standalone Node programs.

### Import an existing script

The dashboard accepts a JSON array with `name`, `category`, `description`, `code` keys. Script content is treated as text, not executable code. You can also create and edit entries from scratch. Your library is stored locally and is not synced or automatically populated from the repository files.

## Security and maintenance

See [SECURITY.md](SECURITY.md) for important limitations and remediation. The legacy Telegram credentials were removed from distributed script sources; **the old token must be revoked and replaced with a new token**. Do not place secrets in client-side JS or a repository. The desktop app uses isolated/sandboxed rendering and a strict Content Security Policy, and imports are bounded by file size.

## Scope of this cleanup

Renamed and sorted scripts/assets, added proper JS extensions, removed eight high-risk/noisy account, chat-abuse and token-transfer utilities, deleted duplicate dashboards and obsolete generated app scaffold, rebuilt the library UI, and added a maintainable Electron entry point. Some legacy scripts still rely on old game internals and may need manual adaptation before use. See catalog for historical provenance.

## License

No license was supplied for the original scripts. Ownership/licensing must be confirmed before public redistribution; this project is intentionally marked `UNLICENSED`.
