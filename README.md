# 益福入口 Portal — SSO 導向版（已移除本地示範頁）

本入口頁部署在 **GitHub Pages**（純前端），登入後**直接開新分頁**把 JWT 帶到你的兩台外部伺服器的 SSO 端點：

- `{YIFU_TARGET}/sso/consume?jwt=...&redirect=/`
- `{SALARY_TARGET}/sso/consume?jwt=...&redirect=/`（僅管理員可進）

對應的目標位址可在 `index.html` 直接修改兩個常數：

```html
const YIFU_TARGET = 'http://yifucar.ddns.net:3000';
const SALARY_TARGET = 'http://yifucar.ddns.net:3001';
```

你的伺服器端需已實作 `/sso/consume`，並與前端 `auth.js` 的 HMAC 密鑰一致（詳見 `README_SSO.md`）。

---

## 目前檔案一覽

- `index.html`：**唯一入口**。登入後以 `window.open()` 開新分頁前往外部伺服器 `/sso/consume`。
- `auth.js`：前端簡易的角色驗證 / JWT 產生（示範用）。
- `style.css`：樣式。
- `README_SSO.md`：SSO 端到端說明。
- ~~`yifu.html`~~、~~`salary.html`~~：**已刪除**（避免混淆與重複實作）。實際流程**不再使用**這兩頁。

> 本次清理（2025-09-18 04:13）將 `README.md` 從「index → yifu/salary 本地頁」改為「index 直接 SSO」的最新說明。

---

## 部署

1. 建一個 GitHub repo（Pages 開啟 HTTPS）。
2. 將本資料夾檔案放到 **根目錄**（`index.html` 必須在根目錄）。
3. **Settings → Pages**：Source 選擇 *Deploy from a branch*；Branch 選 `main` 與 `/ (root)`。
4. 完成後以顯示的 Pages 網址存取入口頁。

## 自訂

- 調整登入密碼：修改 `auth.js` 的雜湊（可用瀏覽器 console 跑 `Auth.sha256('新密碼')` 取得）。
- 如需讓一般使用者也能選擇不同目標，可在外部伺服器 `/sso/consume` 讀取自訂 query（或告訴我要哪種行為，我幫你加）。

