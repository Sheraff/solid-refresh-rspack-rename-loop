# solid-refresh: renaming a component loops forever on Rspack

Minimal repro for a solid-refresh HMR bug (`$$refreshStandard`, webpack/Rspack).

```sh
npm install
npx playwright install chromium   # or set CHROME_PATH
npm run rename     # renames `Page` to `RenamedPage`, counts evaluations of Page.jsx over 5 s
npm run hot-data   # adds `import.meta.webpackHot.data ??= {}` to Page.jsx, then edits its text
```

Output with solid-refresh 0.7.8:

```
evaluations of Page.jsx in the 5 s after the rename: 179095
edit NOT shown (and no reload)
```

Expected: a few evaluations, and `edit shown`.
