
# GitHub Pages + SSO（跳轉到你的伺服器）

入口頁部署在 GitHub Pages；點按鈕會帶 JWT 到：
- http://yifucar.ddns.net:3000/sso/consume?jwt=...&redirect=/
- http://yifucar.ddns.net:3001/sso/consume?jwt=...&redirect=/

## 必要條件
1) 你的兩個伺服器必須實作 `/sso/consume`（我先前提供的 Express 範例即可）。
2) 伺服器端的 `HMAC_SECRET` 要跟 `auth.js` 的 `AUTH_CONFIG.hmacSecret` 一致。
3) 若一般使用者要選 1 或 2，可在伺服器 `/sso/consume` 讀 query `u=1|2`（此版本未帶 u，如需我可再加入）。
