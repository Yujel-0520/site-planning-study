(async()=>{
  const files = ["app-1.txt", "app-2.txt", "app-3.txt", "app-4.txt"];
  const parts = await Promise.all(files.map(f=>fetch(f).then(r=>{if(!r.ok)throw new Error('載入 App 失敗: '+f);return r.text();})));
  (0,eval)(parts.join(''));
})().catch(err=>{console.error(err);document.body.insertAdjacentHTML('beforeend','<p style="color:#ff6b6b;padding:16px">App 載入失敗，請重新整理頁面。</p>');});
