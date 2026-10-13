# Maintenance guide

Place new Tampermonkey scripts in `scripts/<category>/<name>.user.js` and include complete userscript metadata (`@match`, `@grant`, and `@run-at` as appropriate). For non-userscript JavaScript use `.js`. Keep credentials out of source control. Keep historic variants distinguishable, and delete unsupported versions only after confirming usage. Run `npm run check` before release. Import/export does not execute code and does not load directly from the `scripts/` directory.
