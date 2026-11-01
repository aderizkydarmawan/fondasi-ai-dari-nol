/* Legenda simbol: setiap rumus (span/div class "tx") diberi penjelasan untuk setiap simbol di dalamnya.
   Arti huruf ada di LEGENDA[id pelajaran] (file legenda-*.js); lambang umum ada di SIMBOL di bawah.
   Dipakai juga oleh tools/cek_legenda.js untuk memastikan tidak ada simbol yang tertinggal. */
(function (root) {
  var CMD = {
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", kappa: "κ",
    lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ", sigma: "σ", tau: "τ", phi: "φ", varphi: "φ", chi: "χ", psi: "ψ", omega: "ω",
    Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω", Pi: "Π",
    nabla: "∇", partial: "∂", sum: "∑", prod: "∏", int: "∫", infty: "∞", sim: "∼", propto: "∝", approx: "≈",
    top: "ᵀ", intercal: "ᵀ", mid: "|", to: "→", rightarrow: "→", leftarrow: "←", gets: "←", Rightarrow: "⇒", sqrt: "√",
    langle: "⟨⟩", rangle: "⟨⟩", lVert: "‖‖", rVert: "‖‖", "|": "‖‖", Vert: "‖‖", hat: "ˆ", bar: "¯", tilde: "˜", dot: "˙",
    log: "log", ln: "ln", exp: "exp", max: "max", min: "min", arg: "arg", det: "det", tanh: "tanh", sin: "sin", cos: "cos",
    le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", odot: "⊙", otimes: "⊗", in: "∈", pm: "±", ll: "≪", gg: "≫",
    lim: "lim", ldots: "…", dots: "…", cdots: "…", star: "*", ast: "*", circ: "∘", sqrt: "√", equiv: "≡", forall: "∀", Pr: "Pr", Var: "Var", Cov: "Cov", E: "𝔼", KL: "KL", Normal: "𝒩"
  };
  var FONT = { mathbb: { E: "𝔼", R: "ℝ", N: "ℕ", P: "ℙ" }, mathcal: { N: "𝒩", L: "ℒ", D: "𝒟", U: "𝒰" } };
  var SKIP = /^(frac|dfrac|tfrac|left|right|bigl|bigr|Bigl|Bigr|big|Big|quad|qquad|cdot|times|div|underbrace|overbrace|begin|end|text|mathrm|operatorname|textbf|mathbf|boldsymbol|displaystyle|limits|,|;|!|:| |\{|\}|%|&|#|_|\$|underset|overset|binom|color|textstyle|vphantom|phantom|lbrace|rbrace|lfloor|rfloor|lceil|rceil|cases|pmatrix|bmatrix|matrix|aligned|\\)$/;
  function tokens(tex) {
    var s = String(tex), out = [], seen = {};
    function add(t) { if (!seen[t]) { seen[t] = 1; out.push(t); } }
    s = s.replace(/\\(text|mathrm|operatorname|textbf|begin|end|color)\s*\{[^{}]*\}/g, " ");
    s = s.replace(/\\(mathbb|mathcal)\s*\{?\s*([A-Za-z])\s*\}?/g, function (_, f, l) { add((FONT[f] || {})[l] || l); return " "; });
    s = s.replace(/\\mathbf\s*\{([^{}]*)\}/g, " $1 ").replace(/\\boldsymbol\s*\{([^{}]*)\}/g, " $1 ");
    s = s.replace(/\\([A-Za-z]+|.)/g, function (_, c) {
      if (SKIP.test(c)) return " ";
      if (CMD[c]) { add(CMD[c]); return " "; }
      add("\\" + c); return " ";
    });
    s.replace(/[A-Za-z]|'|!|\|/g, function (c) { add(c === "'" ? "′" : c === "|" ? "|·|" : c); return c; });
    return out;
  }
  /* Rumus yang ditulis sebagai teks biasa (dalam <mark>): huruf tunggal, huruf Yunani, dan lambang. */
  var SUP = { "ᵢ": "i", "ⱼ": "j", "ₙ": "n", "ₖ": "k", "ₜ": "t", "ₓ": "x", "ⁿ": "n", "ᵐ": "m", "ˣ": "x", "ᵏ": "k", "ᵗ": "t", "ʸ": "y", "ᶻ": "z", "ᵃ": "a", "ᵇ": "b", "ᵀ": "ᵀ" };
  var WORD = { log: 1, ln: 1, exp: 1, max: 1, min: 1, cos: 1, sin: 1, tanh: 1, lim: 1, det: 1, Var: 1, Cov: 1, KL: 1 };
  function tokensPlain(txt) {
    var out = [], seen = {};
    function add(t) { if (!seen[t]) { seen[t] = 1; out.push(t); } }
    var s = String(txt).replace(/[ᵢⱼₙₖₜₓⁿᵐˣᵏᵗʸᶻᵃᵇᵀ]/g, function (c) { return " " + SUP[c] + " "; }).replace(/̄/g, " ¯ ").replace(/̂/g, " ˆ ");
    s.replace(/[A-Za-zΑ-Ωα-ω]+|[∑Σ∏∫∇∂∞∼∝√‖⟨⟩←→⊙∈±¯ˆ]|ᵀ/g, function (w) {
      if (/^[A-Za-zΑ-Ωα-ω]$/.test(w) || WORD[w]) add(w === "Σ" ? "∑" : w);
      else if (!/[A-Za-zΑ-Ωα-ω]/.test(w)) add(w === "Σ" ? "∑" : w === "‖" ? "‖‖" : (w === "⟨" || w === "⟩") ? "⟨⟩" : w);
      return w;
    });
    return out;
  }
  var SIMBOL = {
    "∑": "jumlahkan semua suku (sigma besar)", "∏": "kalikan semua suku (pi besar)", "∫": "integral: jumlah kontinu / luas di bawah kurva",
    "∇": "gradien (nabla): daftar semua turunan parsial", "∂": "turunan parsial: turunan terhadap satu variabel saja", "∞": "tak hingga",
    "∼": "berdistribusi menurut (\"diambil dari\")", "∝": "sebanding dengan (sama sampai pengali konstan)", "≈": "kira-kira sama dengan",
    "ᵀ": "transpos: tukar baris dan kolom (2.6)", "|": "dengan syarat / diketahui (peluang bersyarat)", "→": "menuju / menjadi",
    "←": "isi ulang dengan nilai baru (pembaruan)", "⇒": "maka", "√": "akar kuadrat", "⟨⟩": "rata-rata (ekspektasi) dari isi kurung siku",
    "‖‖": "panjang (norma) vektor", "ˆ": "topi: nilai tebakan/perkiraan", "¯": "garis atas: rata-rata", "˜": "tilde: versi lain / versi berderau", "˙": "titik atas: laju perubahan terhadap waktu",
    "log": "logaritma", "ln": "logaritma natural (basis e)", "exp": "exp(x) = eˣ", "max": "nilai terbesar", "min": "nilai terkecil",
    "arg": "arg max/min: nilai masukan yang membuat fungsi terbesar/terkecil", "det": "determinan: faktor pengali luas (2.5)",
    "tanh": "tangen hiperbolik, fungsi aktivasi berbentuk S antara −1 dan 1", "sin": "sinus", "cos": "kosinus", "lim": "limit: nilai yang didekati",
    "≤": "kurang dari atau sama dengan", "≥": "lebih dari atau sama dengan", "≠": "tidak sama dengan", "⊙": "kali per elemen (posisi sama dikalikan)",
    "⊗": "hasil kali tensor/luar", "∈": "anggota dari", "±": "plus atau minus", "≪": "jauh lebih kecil dari", "≫": "jauh lebih besar dari", "…": "dan seterusnya",
    "*": "konvolusi atau nilai optimal (bintang)", "∘": "komposisi fungsi", "≡": "didefinisikan sama dengan", "∀": "untuk semua",
    "𝔼": "ekspektasi: rata-rata berbobot peluang (2.10)", "𝒩": "distribusi normal 𝒩(rata-rata, varians)", "ℝ": "himpunan bilangan real",
    "ℒ": "loss atau likelihood", "′": "aksen: turunan (f′ = turunan f)", "!": "faktorial: n! = 1·2·…·n", "|·|": "nilai mutlak (jarak ke nol) atau banyak anggota",
    "π": "pi ≈ 3,14159", "e": "bilangan Euler ≈ 2,718", "Pr": "peluang", "Var": "varians", "Cov": "kovarians", "KL": "divergensi KL (3.4)"
  };
  var api = { tokens: tokens, tokensPlain: tokensPlain, SIMBOL: SIMBOL };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) {
    root.LEGENDA = root.LEGENDA || {};
    root.LEG = api;
    var esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
    function arti(id, t) { var L = root.LEGENDA[id] || {}; return L[t] || SIMBOL[t] || null; }
    root.legendify = function (view, id) {
      var all = [], seen = {}, groups = [];
      [].forEach.call(view.querySelectorAll(".tx, mark"), function (el) {
        if (el.closest(".viz, pre, .lg") || (el.tagName === "MARK" && el.querySelector(".tx"))) return;
        var tk = (el.tagName === "MARK" ? tokensPlain : tokens)(el.textContent).filter(function (t) { return arti(id, t); });
        tk.forEach(function (t) { if (!seen[t]) { seen[t] = 1; all.push(t); } });
        var host = el.closest(".rule") || (el.classList.contains("d") ? el : null);
        if (!host || !tk.length) return;
        var g = groups.filter(function (x) { return x.host === host; })[0];
        if (!g) { g = { host: host, tk: [] }; groups.push(g); }
        tk.forEach(function (t) { if (g.tk.indexOf(t) < 0) g.tk.push(t); });
      });
      [].forEach.call(view.querySelectorAll(".rule"), function (el) {
        if (el.closest(".viz") || el.querySelector(".tx, mark")) return;
        var tk = tokensPlain(el.textContent).filter(function (t) { return arti(id, t); });
        if (!tk.length) return;
        tk.forEach(function (t) { if (!seen[t]) { seen[t] = 1; all.push(t); } });
        groups.push({ host: el, tk: tk });
      });
      groups.forEach(function (g) {
        var d = document.createElement("div"); d.className = "lg";
        d.innerHTML = "<b>Legenda</b> " + g.tk.map(function (t) { return '<span><i>' + esc(t) + "</i> " + esc(arti(id, t)) + "</span>"; }).join("");
        if (g.host.classList.contains("rule")) g.host.appendChild(d); else g.host.insertAdjacentElement("afterend", d);
      });
      if (!all.length) return;
      var box = document.createElement("details"); box.className = "lgbox";
      box.innerHTML = "<summary>Legenda semua simbol di pelajaran ini (" + all.length + ")</summary><dl>" +
        all.map(function (t) { return "<div><dt>" + esc(t) + "</dt><dd>" + esc(arti(id, t)) + "</dd></div>"; }).join("") + "</dl>";
      var why = view.querySelector(".why"); if (why) why.insertAdjacentElement("afterend", box);
    };
  }
})(typeof window !== "undefined" ? window : null);
