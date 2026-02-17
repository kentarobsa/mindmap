const PASSWORD = process.env.SITE_PASSWORD || 'admin';

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="ja"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>認証</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;display:flex;align-items:center;justify-content:center;height:100vh;font-family:'Segoe UI','Hiragino Sans',sans-serif}
.box{background:rgba(255,255,255,.06);padding:48px;border-radius:20px;text-align:center;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1)}
h2{color:#fff;margin-bottom:24px;font-size:20px}
input[type=password]{padding:14px 18px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:16px;width:260px;outline:none}
input[type=password]:focus{border-color:rgba(255,255,255,.4)}
button{margin-top:16px;padding:14px 40px;border-radius:10px;border:none;background:#e94560;color:#fff;font-size:16px;cursor:pointer;font-weight:600;transition:background .2s}
button:hover{background:#ff5577}
.err{color:#e55;margin-top:14px;font-size:14px}
</style>
</head><body>
<div class="box">
<h2>パスワードを入力してください</h2>
<form id="f"><input type="password" id="p" placeholder="パスワード" autofocus/><br/>
<button type="submit">ログイン</button>
<div class="err" id="e" style="display:none">パスワードが違います</div>
</form>
<script>
document.getElementById('f').addEventListener('submit',async function(ev){
  ev.preventDefault();
  const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pwd:document.getElementById('p').value})});
  if(r.ok){location.reload()}else{document.getElementById('e').style.display='block';document.getElementById('p').value='';document.getElementById('p').focus()}
});
</script>
</div></body></html>`;

export default function middleware(request) {
  const url = new URL(request.url);

  // Skip API routes
  if (url.pathname.startsWith('/api/')) return;

  // Check auth cookie
  const cookie = request.headers.get('cookie') || '';
  if (cookie.includes('mindmap-auth=ok')) return;

  // Not authenticated → show login page
  return new Response(LOGIN_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
