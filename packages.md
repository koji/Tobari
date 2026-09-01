# Electron 関連パッケージ バージョン比較

> 生成日: 2026-09-01  
> 対象: `package.json` で Electron に関連するパッケージ（`electron` 本体 + 周辺プラグイン）  
> 確認コマンド: `npm view <pkg> version` / `npm ls <pkg>`

## サマリ

| パッケージ | 現在 (`package.json`) | インストール済み (`bun.lock` / `node_modules`) | 最新 (`npm@latest`) | 差分 | 更新優先度 | 備考 |
|---|---|---|---|---|---|---|
| `electron` | `^29.4.6` | `29.4.6` | `44.1.0` | **15メジャー** Behind | 🔴 高 | 29.x は EOL。44.x は Chromium 142 / Node 22 系。`electron-store@11` などは Electron 30+ を要求。Vite 7.3.6 とは互換するが、ネイティブモジュール再ビルドが必要。 |
| `electron-builder` | `^24.13.3` | `24.13.3` | `26.15.3` | 2メジャー Behind | 🟠 中 | 25.x で Node 20+ 必須、26.x で `app-builder-lib` 大幅更新。`electron@29` との組み合わせは動作するが、最新 Electron (44) を使うなら 26.x 推奨。 |
| `electron-store` | `^10.0.1` | `10.1.0` | `11.0.2` | 1メジャー Behind | 🟡 低〜中 | 11.x は ESM 専用（`require('electron-store')` → `import Store from 'electron-store'` への移行が必要）。`electron/main.js:3` は ESM import なので対応可能。10.x は CommonJS/ESM 両対応で安定。 |
| `vite-plugin-electron` | `^0.28.8` | `0.28.8` | `1.1.2` | 1メジャー Behind（0.x→1.x） | 🟠 中 | 0.28.x は `vite-plugin-electron-renderer: *` に依存。1.x は `peer vite >=6`（Vite 7.3.6 と互換）。1.x で `electron({ entry: 'electron/main.js' })` API は維持されるが、内部で `vite@6+` 向けに書き換え済み。 |
| `vite-plugin-electron-renderer` | `^0.14.6` | `0.14.6` | `1.0.0` | 1メジャー Behind（0.x→1.x） | 🟠 中 | 0.14.x は 1.0-beta を経て 1.0.0 へ。`renderer()` の呼び出しは 1.0 でも互換だが、型定義が厳格化。`vite-plugin-electron@1.1.2` とセットで更新推奨。 |

## 詳細

### 1. `electron` `29.4.6` → `44.1.0`

- **現状:** `package.json:31` / `bun.lock` で `29.4.6`。2024年リリースの 29.x 系。
- **最新:** `44.1.0` (2026年、Chromium 142, Node 22.11+)
- **Breaking changes (29→44):** 
  - Node 20+ 必須（プロジェクトは `mise.toml` で Node 24.11 を使用中なので OK）
  - `BrowserWindow` の `webPreferences` デフォルト変更（`contextIsolation: true` 推奨。本リポジトリは `electron/main.js:13-15` で `contextIsolation: false, nodeIntegration: true` を使用 → セキュリティ的に要見直し）
  - ネイティブ依存（`7zip-bin` など）の再ビルドが必要
- **推奨:** 段階的更新 `29 → 32 → 35 → 38 → 44` でテスト。または一括で `44.x` へ上げて `bun run electron:dev` / `electron:build` の動作確認。

```bash
bun add -d electron@^44.1.0
# または
npm install --save-dev electron@^44.1.0
```

### 2. `electron-builder` `24.13.3` → `26.15.3`

- **現状:** `24.13.3` は Electron 29 と組み合わせで安定。
- **最新:** `26.15.3`
- **Breaking:** 25.x で `dmg-builder` / `app-builder-lib` の設定キー変更、Node 20+ 必須。`package.json:47-66` の `build` フィールドは互換あり。
- **推奨:** Electron を 44 に上げるなら同時に `26.x` へ。

```bash
bun add -d electron-builder@^26.15.3
```

### 3. `electron-store` `10.0.1` → `11.0.2`

- **現状:** `10.1.0` (10.x 系は CJS/ESM ハイブリッド、`electron/main.js:3` の `import Store from 'electron-store'` と `src/contexts/DataContext.tsx:3` の `ipcRenderer` 経由で利用中。永続化バグは `fix/persist-data` で解消済み)
- **最新:** `11.0.2` (2025-10-05)
- **Breaking:** 11.x は **ESM 専用**。`require` が不可、`import` 必須。`type: module` プロジェクトなので影響は小さいが、`electron/main.js` が `type: module` でない場合の挙動に注意。
- **推奨:** `10.x` のままでも問題なし。ESM 移行を完了させるなら `11.x` へ。

```bash
bun add -d electron-store@^11.0.2
# 10.x に留まる場合は ^10.1.0 のまま
```

### 4. `vite-plugin-electron` `0.28.8` → `1.1.2`

- **現状:** `0.28.8` (旧 0.x 系、Vite 5 時代の API)
- **最新:** `1.1.2` (`peer vite >=6`, Vite 7.3.6 と検証済み)
- **Breaking:** 1.x で内部プラグイン構造を変更。`vite.config.ts:8-12` の `electron({ entry: 'electron/main.js' })` は 1.x でも同じシグネチャで動作。`0.28.8` は `vite-plugin-electron-renderer: *` に依存、1.1.2 は `peer vite-plugin-electron-renderer: *` に変更。
- **推奨:** Vite 7.3.6 使用中なので `1.1.2` へ更新推奨（`0.28.8` でも `vite build` は成功することを確認済み: 1806 client + 381 electron modules）。

```bash
bun add -d vite-plugin-electron@^1.1.2
```

### 5. `vite-plugin-electron-renderer` `0.14.6` → `1.0.0`

- **現状:** `0.14.6`
- **最新:** `1.0.0` (1.0.0-beta.1〜10 を経て安定版)
- **Breaking:** `renderer()` のオプション型が厳格化。`vite.config.ts:12` の `renderer()` 引数なし呼び出しは互換あり。
- **推奨:** `vite-plugin-electron` とセットで `1.0.0` へ。

```bash
bun add -d vite-plugin-electron-renderer@^1.0.0
```

## 一括更新コマンド

すべて最新へ上げる場合（破壊的変更を含むため、ブランチを切って検証推奨）:

```bash
# bun 使用
bun add -d electron@^44.1.0 electron-builder@^26.15.3 electron-store@^11.0.2 vite-plugin-electron@^1.1.2 vite-plugin-electron-renderer@^1.0.0

# npm 使用
npm install --save-dev electron@^44.1.0 electron-builder@^26.15.3 electron-store@^11.0.2 vite-plugin-electron@^1.1.2 vite-plugin-electron-renderer@^1.0.0
```

段階的更新（安全性重視）:

```bash
# Step 1: Vite 周りのみ (低リスク)
bun add -d vite-plugin-electron@^1.1.2 vite-plugin-electron-renderer@^1.0.0

# Step 2: ビルドツール
bun add -d electron-builder@^26.15.3

# Step 3: 本体 (要: 再起動・ネイティブ再ビルド・保存データ移行テスト)
bun add -d electron@^44.1.0

# Step 4: Store (ESM 移行確認)
bun add -d electron-store@^11.0.2
```

## 検証手順（更新後）

```bash
npx oxlint .          # または bun run lint
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.node.json --noEmit
npm run build         # tsc && vite build (Vite 7.3.6)
npx knip              # 未使用ファイル/依存チェック
bun run electron:dev  # 追加データ → 再起動で保持されることを確認 (fix/persist-data 済み)
```

## 付記

- `electron@29.4.6` は 2024 年 EOL のため、セキュリティ修正を含む `44.x` への更新を推奨。
- `electron-store@11` へ上げる場合は `electron/main.js:3` と `package.json:5` (`main: electron/main.js`) が ESM で動作することを確認してください（本リポジトリは `type: module` のため問題なし）。
- `vite@7.3.6` は最新安定版。`vite-plugin-electron@1.1.2` / `renderer@1.0.0` は Vite 7 公式サポートのため、まずこの2つから更新するのが最も安全です。
