/* Cek bahwa setiap simbol di setiap rumus (class "tx") punya arti di LEGENDA[id] atau SIMBOL.
   Pakai: node tools/cek_legenda.js            -> daftar simbol yang belum dijelaskan
          node tools/cek_legenda.js --dump f.json -> simpan simbol + contoh rumus per pelajaran */
const fs = require("fs"), vm = require("vm"), path = require("path");
const dir = path.join(__dirname, ".."), ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
const files = fs.readdirSync(dir).filter(f => /^(lapis\w*|dalam\d?|legenda(-\w+)?)\.js$/.test(f)).sort((a, b) => (a.startsWith("legenda") - b.startsWith("legenda")) || ((a === "legenda.js") ? -1 : (b === "legenda.js") ? 1 : a.localeCompare(b)));
for (const f of files) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f });
const W = ctx.window, LEG = W.LEG, L = W.LESSONS, D = W.DALAM || {};
const unesc = s => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const dump = {}; let miss = 0;
for (const id of Object.keys(L)) {
  const d = D[id] || {}, html = [L[id].why, L[id].body, d.deep].concat(d.salah || [], d.ringkas || [], d.uji || []).join("\n");
  const fx = [...html.matchAll(/class="tx( d)?">([\s\S]*?)<\/(span|div)>/g)].map(m => unesc(m[2]));
  const mk = [...html.matchAll(/<mark>([\s\S]*?)<\/mark>/g)].map(m => m[1]).filter(m => !/class="tx/.test(m)).map(m => unesc(m.replace(/<[^>]+>/g, "")));
  for (const m of html.matchAll(/<div class="rule">([\s\S]*?)<\/div>/g)) if (!/class="tx|<mark>/.test(m[1])) mk.push(unesc(m[1].replace(/<[^>]+>/g, "")));
  const lg = W.LEGENDA[id] || {}, need = {}, tk = f => (fx.includes(f) ? LEG.tokens(f) : LEG.tokensPlain(f));
  for (const f of fx.concat(mk)) for (const t of tk(f)) if (!lg[t] && !LEG.SIMBOL[t]) (need[t] = need[t] || []).length < 3 && need[t].push(f.slice(0, 140));
  const ks = Object.keys(need); miss += ks.length;
  if (ks.length) { dump[id] = need; if (!process.argv.includes("--dump")) console.log(id + ": " + ks.join(" ")); }
  for (const k of Object.keys(lg)) if (!fx.concat(mk).some(f => tk(f).includes(k))) console.log("  (tidak terpakai) " + id + " " + k);
}
if (process.argv.includes("--dump")) fs.writeFileSync(process.argv[process.argv.indexOf("--dump") + 1], JSON.stringify(dump, null, 1));
console.log("simbol tanpa arti:", miss); process.exit(miss ? 1 : 0);
