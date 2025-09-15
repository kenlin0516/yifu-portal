
# 益福入口 Portal — GitHub Pages 版

這個資料夾可直接放到 GitHub 倉庫，啟用 GitHub Pages 後即可使用（純前端，無需伺服器）。

## 功能
- 入口頁 `index.html`：登入（前端示範，WebCrypto 於 HTTPS 下可用）、分流到：
  - `yifu.html`（自動判定目前登入角色並顯示）
  - `salary.html`（僅管理員可進入）
- `auth.js`：前端角色驗證與 Token 發行（示範用途）。

## 部署步驟
1. 建一個 GitHub repo（公開或私有都可，Pages 用公開最簡單）。
2. 把本資料夾內的檔案全部放進 repo 根目錄（`index.html` 必須在根目錄）。
3. 到 **Settings → Pages**：
   - Source 選擇 `Deploy from a branch`
   - Branch 選擇 `main`（或 `master`）與 `/ (root)`
   - 儲存後等它顯示你的網站網址（通常 https://<使用者>.github.io/<repo>/ ）
4. 造訪該網址即可。

## 注意
- WebCrypto 僅在「安全環境」可用；GitHub Pages 提供 HTTPS，因此可正常使用。
- 若要自訂密碼，請修改 `auth.js` 的雜湊值（可在瀏覽器 console 跑 `Auth.sha256('新密碼')` 算出來，貼回 `adminHash` / `userHash`）。
