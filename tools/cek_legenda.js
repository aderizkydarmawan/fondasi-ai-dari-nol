/* Cek bahwa setiap simbol di setiap rumus (class "tx", <mark>, kotak Aturan) punya arti di LEGENDA[id] atau SIMBOL.
   Pakai: node tools/cek_legenda.js            -> uji pemecah simbol, lalu daftar simbol yang belum dijelaskan
          node tools/cek_legenda.js --dump f.json -> simpan simbol + contoh rumus per pelajaran */
const fs = require("fs"), vm = require("vm"), path = require("path"), assert = require("assert");
const dir = path.join(__dirname, ".."), ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
const files = fs.readdirSync(dir).filter(f => /^(lapis\w*|dalam\d?|legenda(-\w+)?)\.js$/.test(f)).sort((a, b) => (a.startsWith("legenda") - b.startsWith("legenda")) || ((a === "legenda.js") ? -1 : (b === "legenda.js") ? 1 : a.localeCompare(b)));
for (const f of files) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f });
const W = ctx.window, LEG = W.LEG, L = W.LESSONS, D = W.DALAM || {};

/* Uji pemecah simbol: kasus yang pernah salah */
const same = (a, b) => assert.deepStrictEqual([...a].sort(), [...b].sort());
same(LEG.tokensPlain("θ ← θ − ηv", true), ["θ", "←", "η", "v"]);
same(LEG.tokensPlain("Peluang A dan B terjadi"), ["A", "B"]);
same(LEG.tokens("P(A|B) = P(B|A)P(A)/P(B)"), ["P", "A", "|", "B"]);
same(LEG.tokens("D_{\\text{KL}}(q \\,\\|\\, p)"), ["D", "KL", "q", "‖KL", "p"]);
same(LEG.tokens("\\|x\\|"), ["‖‖", "x"]);
same(LEG.tokens("|x - y|"), ["|·|", "x", "y"]);
same(LEG.tokens("\\overline{x} + \\mathbb{1}[y]"), ["¯", "x", "𝟙", "y"]);
same(LEG.tokens("\\hat{y} = \\sigma(\\mathbf{w}^\\top \\mathbf{x})"), ["ˆ", "y", "σ", "w", "ᵀ", "x"]);
same(LEG.tokens("f'(x)"), ["f", "′", "x"]);
same(LEG.tokens("\\operatorname{Var}(aX) + \\text{KL}"), ["Var", "a", "X", "KL"]);
same(LEG.tokens("\\text{softmax}(z)"), ["softmax", "z"]);
assert.ok(!/siku/.test(LEG.SIMBOL["⟨⟩"]), "⟨⟩ adalah kurung sudut");
console.log("uji pemecah simbol: lulus");

const unesc = s => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const dump = {}; let miss = 0;
for (const id of Object.keys(L)) {
  const d = D[id] || {}, html = [L[id].why, L[id].body, d.deep].concat(d.salah || [], d.ringkas || [], d.uji || []).join("\n");
  const items = [];
  for (const m of html.matchAll(/class="tx( d)?">([\s\S]*?)<\/(span|div)>/g)) items.push([unesc(m[2]), LEG.tokens]);
  for (const m of html.matchAll(/<mark>([\s\S]*?)<\/mark>/g)) if (!/class="tx/.test(m[1])) items.push([unesc(m[1].replace(/<[^>]+>/g, "")), t => LEG.tokensPlain(t, true)]);
  for (const m of html.matchAll(/<div class="rule">([\s\S]*?)<\/div>/g)) if (!/class="tx|<mark>/.test(m[1])) items.push([unesc(m[1].replace(/<[^>]+>/g, "")), t => LEG.tokensPlain(t)]);
  const lg = W.LEGENDA[id] || {}, need = {}, used = new Set();
  for (const [f, tk] of items) for (const t of tk(f)) { used.add(t); if (!lg[t] && !LEG.SIMBOL[t]) (need[t] = need[t] || []).length < 3 && need[t].push(f.slice(0, 140)); }
  const ks = Object.keys(need); miss += ks.length;
  if (ks.length) { dump[id] = need; if (!process.argv.includes("--dump")) console.log(id + ": " + ks.join(" ")); }
  for (const k of Object.keys(lg)) if (!used.has(k)) console.log("  (tidak terpakai) " + id + " " + k);
}
if (process.argv.includes("--dump")) fs.writeFileSync(process.argv[process.argv.indexOf("--dump") + 1], JSON.stringify(dump, null, 1));
console.log("simbol tanpa arti:", miss); process.exit(miss ? 1 : 0);
