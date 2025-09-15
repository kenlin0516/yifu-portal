
const AUTH_CONFIG = {
  adminHash: "0b4a4ed19f1f905520da34642869aa96931b5aa33d8ead25a23ea747818fd6aa",
  userHash:  "831c237928e6212bedaa4451a514ace3174562f6761f6a157a2fe5082b36e2fb", 
  hmacSecret: "CHANGE_ME_SECRET_please_long_random_string", 
  tokenTTLSeconds: 60*60*8, // 8 小時
};

function toHex(buffer){
  return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
function b64urlEncode(buf){
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function b64urlEncodeText(str){
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function b64urlDecodeText(s){
  s = s.replace(/-/g,'+').replace(/_/g,'/');
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  s += "=".repeat(pad);
  return decodeURIComponent(escape(atob(s)));
}
async function sha256(text){
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return toHex(buf);
}
async function hmacSign(message){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(AUTH_CONFIG.hmacSecret), {name:"HMAC", hash:"SHA-256"}, false, ["sign","verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return b64urlEncode(sig);
}
async function hmacVerify(message, signature){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(AUTH_CONFIG.hmacSecret), {name:"HMAC", hash:"SHA-256"}, false, ["sign","verify"]
  );
  const sigBuf = Uint8Array.from(atob(signature.replace(/-/g,'+').replace(/_/g,'/')), c=>c.charCodeAt(0));
  return await crypto.subtle.verify("HMAC", key, sigBuf, enc.encode(message));
}

async function issueToken(role){
  const header = { alg:"HS256", typ:"JWT" };
  const now = Math.floor(Date.now()/1000);
  const payload = { role, iat:now, exp: now + AUTH_CONFIG.tokenTTLSeconds };
  const h = b64urlEncodeText(JSON.stringify(header));
  const p = b64urlEncodeText(JSON.stringify(payload));
  const sig = await hmacSign(`${h}.${p}`);
  return `${h}.${p}.${sig}`;
}

async function verifyToken(token){
  if(!token || typeof token !== "string" || token.split(".").length!==3) return { ok:false, reason:"格式錯誤" };
  const [h,p,sig] = token.split(".");
  const valid = await hmacVerify(`${h}.${p}`, sig);
  if(!valid) return { ok:false, reason:"簽章錯誤" };
  try{
    const payload = JSON.parse(b64urlDecodeText(p));
    const now = Math.floor(Date.now()/1000);
    if(payload.exp && now > payload.exp) return { ok:false, reason:"逾時" };
    if(!payload.role) return { ok:false, reason:"缺少角色" };
    return { ok:true, payload };
  }catch(e){
    return { ok:false, reason:"payload 解析失敗" };
  }
}

async function loginWithPassword(role, password){
  const hash = await sha256(password || "");
  const target = role === "admin" ? AUTH_CONFIG.adminHash : AUTH_CONFIG.userHash;
  if(hash !== target) return { ok:false, message:"密碼錯誤" };
  const token = await issueToken(role);
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("token", token);
  return { ok:true, token, role };
}

function logout(){
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("token");
}

async function getCurrent(){
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const v = await verifyToken(token);
  if(v.ok) return { ok:true, role: v.payload.role, token };
  logout();
  return { ok:false };
}

async function requireAdminOrRedirect(){
  const cur = await getCurrent();
  if(!cur.ok || cur.role !== "admin"){
    alert("只有管理員可以進入此頁面。");
    location.href = "index.html";
    return false;
  }
  return true;
}

async function requireSignedInOrRedirect(){
  const cur = await getCurrent();
  if(!cur.ok){
    alert("請先登入。");
    location.href = "index.html";
    return false;
  }
  return true;
}

window.Auth = {
  sha256, loginWithPassword, logout, getCurrent,
  requireAdminOrRedirect, requireSignedInOrRedirect, verifyToken, issueToken
};
