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
    lim: "lim", overline: "¯", widehat: "ˆ", prime: "′", ldots: "…", dots: "…", cdots: "…", star: "*", ast: "*", circ: "∘", sqrt: "√", equiv: "≡", forall: "∀", Pr: "Pr", Var: "Var", Cov: "Cov", E: "𝔼", KL: "KL", Normal: "𝒩"
  };
  var FONT = { mathbb: { E: "𝔼", R: "ℝ", N: "ℕ", P: "ℙ", "1": "𝟙" }, mathcal: { N: "𝒩", L: "ℒ", D: "𝒟", U: "𝒰" } };
  var SKIP = /^(frac|dfrac|tfrac|left|right|bigl|bigr|Bigl|Bigr|big|Big|quad|qquad|cdot|times|div|underbrace|overbrace|begin|end|text|mathrm|operatorname|textbf|mathbf|boldsymbol|displaystyle|limits|,|;|!|:| |\{|\}|%|&|#|_|\$|underset|overset|binom|color|textstyle|vphantom|phantom|lbrace|rbrace|lfloor|rfloor|lceil|rceil|cases|pmatrix|bmatrix|matrix|aligned|\\)$/;
  function tokens(tex) {
    var s = String(tex), out = [], seen = {};
    function add(t) { if (!seen[t]) { seen[t] = 1; out.push(t); } }
    /* ‖ di dalam D_KL(q ‖ p) adalah pemisah, bukan panjang vektor */
    if (/KL/.test(s)) s = s.replace(/\\\|/g, function () { add("‖KL"); return " "; });
    /* garis tegak di dalam p(…|…) atau P(…|…) berarti "dengan syarat" */
    s = s.replace(/([pPqQ]\s*\([^()]*?)\|/g, function (_, a) { return a + "\\mid "; });
    /* nama operator seperti \operatorname{Var} atau \text{KL} tetap masuk legenda */
    s = s.replace(/\\(text|mathrm|operatorname)\s*\{\s*(Var|Cov|KL|softmax)\s*\}/g, function (_, f, w) { add(w); return " "; });
    s = s.replace(/\\(text|mathrm|operatorname|textbf|begin|end|color)\s*\{[^{}]*\}/g, " ");
    s = s.replace(/\\(mathbb|mathcal)\s*\{?\s*([A-Za-z0-9])\s*\}?/g, function (_, f, l) { add((FONT[f] || {})[l] || l); return " "; });
    s = s.replace(/\\(mathbf|boldsymbol|vec)\s*\{([^{}]*)\}/g, " $2 ");
    s = s.replace(/\\([A-Za-z]+|.)/g, function (_, c) {
      if (SKIP.test(c)) return " ";
      if (CMD[c]) { add(CMD[c]); return " "; }
      add("\\" + c); return " ";
    });
    s.replace(/[A-Za-z]|'|!|\||\*/g, function (c) { add(c === "'" ? "′" : c === "|" ? "|·|" : c); return c; });
    return out;
  }
  /* Rumus yang ditulis sebagai teks biasa (dalam <mark>): huruf tunggal, huruf Yunani, dan lambang. */
  var SUP = { "ᵢ": "i", "ⱼ": "j", "ₙ": "n", "ₖ": "k", "ₜ": "t", "ₓ": "x", "ⁿ": "n", "ᵐ": "m", "ˣ": "x", "ᵏ": "k", "ᵗ": "t", "ʸ": "y", "ᶻ": "z", "ᵃ": "a", "ᵇ": "b", "ᵀ": "ᵀ" };
  var WORD = { log: 1, ln: 1, exp: 1, max: 1, min: 1, cos: 1, sin: 1, tanh: 1, lim: 1, det: 1, Var: 1, Cov: 1, KL: 1, TP: 1, FP: 1, FN: 1, TN: 1 };
  function tokensPlain(txt, formula) {
    var out = [], seen = {};
    function add(t) { if (!seen[t]) { seen[t] = 1; out.push(t); } }
    var s = String(txt).replace(/[ᵢⱼₙₖₜₓⁿᵐˣᵏᵗʸᶻᵃᵇᵀ]/g, function (c) { return " " + SUP[c] + " "; }).replace(/̄/g, " ¯ ").replace(/̂/g, " ˆ ");
    s.replace(/[A-Za-zΑ-Ωα-ω]+|[∑Σ∏∫∇∂∞∼∝√‖⟨⟩←→⊙∈±¯ˆ|]|ᵀ/g, function (w) {
      if (WORD[w]) add(w);
      else if (/[A-Za-zΑ-Ωα-ω]/.test(w)) {
        /* huruf tunggal = variabel; gabungan pendek (ηv, ab, wx) di dalam rumus = beberapa variabel; kata biasa dilewati */
        if (/^(ke|di|vs|ya|se|si|yg)$/i.test(w)) return w;
        if (w.length === 1 || /[Α-Ωα-ω]/.test(w) || (formula && w.length <= 2)) w.split("").forEach(function (c) { add(c === "Σ" ? "∑" : c); });
      }
      else add(w === "Σ" ? "∑" : w === "‖" ? "‖‖" : (w === "⟨" || w === "⟩") ? "⟨⟩" : w === "|" ? "|·|" : w);
      return w;
    });
    return out;
  }
  var SIMBOL = {
    "∑": "jumlahkan semua suku (sigma besar) (1.6)", "∏": "kalikan semua suku (pi besar) (5.12)", "∫": "integral: jumlah kontinu / luas di bawah kurva (2.4)",
    "∇": "gradien (nabla): daftar semua turunan parsial (2.3)", "∂": "turunan parsial: turunan terhadap satu variabel saja (2.3)", "∞": "tak hingga",
    "∼": "berdistribusi menurut (\"diambil dari\"); soal distribusi lihat (2.9)", "∝": "sebanding dengan (sama sampai pengali konstan) (3.3)", "≈": "kira-kira sama dengan",
    "ᵀ": "transpos: tukar baris dan kolom (2.6)", "|": "dengan syarat / diketahui (peluang bersyarat) (2.11)", "→": "menuju / menjadi",
    "←": "isi ulang dengan nilai baru (pembaruan)", "⇒": "maka", "√": "akar kuadrat (0.4)", "⟨⟩": "kurung sudut: rata-rata (ekspektasi) dari isinya (4.3)",
    "‖‖": "panjang (norma) vektor (1.8)", "‖KL": "pemisah di KL(q ‖ p): q dibandingkan dengan p", "𝟙": "fungsi indikator: 1 kalau syaratnya benar, 0 kalau tidak", "ˆ": "topi: nilai tebakan/perkiraan", "¯": "garis atas: rata-rata", "˜": "tilde: versi lain / versi bernoise", "˙": "titik atas: laju perubahan terhadap waktu",
    "log": "logaritma (1.5)", "ln": "logaritma natural (basis e) (1.5)", "exp": "exp(x) = eˣ (1.5)", "max": "nilai terbesar", "min": "nilai terkecil",
    "arg": "arg max/min: nilai masukan yang membuat fungsi terbesar/terkecil (3.2)", "det": "determinan: faktor pengali luas (2.5)",
    "tanh": "tangen hiperbolik, fungsi aktivasi berbentuk S antara −1 dan 1 (5.6)", "sin": "sinus (0.6)", "cos": "kosinus (0.6)", "lim": "limit: nilai yang didekati (2.1)",
    "≤": "kurang dari atau sama dengan", "≥": "lebih dari atau sama dengan", "≠": "tidak sama dengan", "⊙": "kali per elemen (posisi sama dikalikan) (5.6)",
    "⊗": "hasil kali tensor/luar", "∈": "anggota dari", "±": "plus atau minus", "≪": "jauh lebih kecil dari", "≫": "jauh lebih besar dari", "…": "dan seterusnya",
    "*": "bintang: nilai terbaik (optimal)", "∘": "komposisi fungsi", "≡": "didefinisikan sama dengan", "∀": "untuk semua",
    "𝔼": "ekspektasi: rata-rata berbobot peluang (2.10)", "𝒩": "distribusi normal 𝒩(rata-rata, varians) (2.9)", "ℝ": "himpunan bilangan real",
    "ℒ": "loss atau likelihood", "′": "aksen: turunan (f′ = turunan f) (2.1)", "!": "faktorial: n! = 1·2·…·n (2.9)", "|·|": "nilai mutlak (jarak ke nol) atau banyak anggota",
    "Δ": "delta: selisih atau perubahan (ΔE = selisih energi); soal laju perubahan lihat (0.7)", "π": "pi ≈ 3,14159", "e": "bilangan Euler ≈ 2,718 (1.5)", "Pr": "peluang", "Var": "varians (1.7)", "Cov": "kovarians (2.12)", "KL": "divergensi KL (3.4)", "softmax": "softmax: mengubah skor jadi peluang yang jumlahnya 1 (4.2)"
  };
  var api = { tokens: tokens, tokensPlain: tokensPlain, SIMBOL: SIMBOL };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) {
    root.LEGENDA = root.LEGENDA || {};
    root.LEG = api;
    var esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
    var NAMA = { "‖KL": "‖", "|·|": "| |", "⟨⟩": "⟨ ⟩", "‖‖": "‖ ‖" };
    function nama(t) { return NAMA[t] || t; }
    /* Arti simbol slider yang ditulis khusus per widget (dipakai kalau arti umum di pelajaran kurang pas) */
    var VIZLEG = {
      "0.2": [["w", "bobot: seberapa kuat input memengaruhi neuron"], ["x", "input yang masuk ke neuron"], ["b", "bias: angka geser yang ditambahkan"]],
      "0.3": [["p", "pembilang (angka di atas garis pecahan)"], ["q", "penyebut (angka di bawah garis pecahan)"]],
      "1.2": [["c₁, c₂", "dua angka tetap (konstanta) yang kamu atur"]],
      "1.9": [["w₁", "harga tambahan per 10 m² luas"], ["w₂", "harga tambahan per kamar"]],
      "2.5": [["a", "angka kiri atas matriks"], ["b", "angka kanan atas"], ["c", "angka kiri bawah"], ["d", "angka kanan bawah"]],
      "2.6": [["A", "matriks regangan: meregangkan bidang ke arah sumbu x"], ["R", "matriks putaran sebesar sudut yang dipilih"]],
      "2.7": [["v", "vektor yang kamu putar; disebut vektor eigen kalau Av searah dengannya"], ["A", "matriks yang dipilih lewat tombol preset"]],
      "2.9": [["n", "banyaknya lemparan koin"], ["p", "peluang berhasil (gambar) di tiap lemparan"]],
      "3.2": [["n", "banyaknya lemparan"], ["k", "banyaknya hasil gambar dari n lemparan"]],
      "3.4": [["p₁, p₂, p₃", "distribusi peluang yang benar"], ["q₁, q₂, q₃", "distribusi tebakan model"]],
      "3.7": [["Δt", "ukuran satu langkah waktu di metode Euler"]],
      "3.8": [["P(cerah → hujan)", "peluang besok hujan kalau hari ini cerah"], ["P(hujan → cerah)", "peluang besok cerah kalau hari ini hujan"]],
      "4.1": [["kT", "suhu dikali konstanta Boltzmann: suhu dalam satuan energi"]],
      "4.3": [["q₁, q₂, q₃", "bobot distribusi tebakan q (dinormalkan jadi peluang)"], ["kT", "suhu dalam satuan energi"]],
      "4.7": [["Δt", "ukuran satu langkah waktu"]],
      "5.4": [["x₁, x₂", "dua angka input"], ["t", "target: jawaban yang benar"]],
      "5.6": [["λ", "faktor pengali gradien per langkah di RNN biasa"], ["f", "forget gate: bagian memori lama yang disimpan tiap langkah"]],
      "5.7": [["d", "dimensi vektor key; skor dibagi √d"]],
      "5.11": [["q", "sebaran data buatan generator; kamu atur rata-rata dan simpangan bakunya"]],
      "5.13": [["T", "suhu: makin tinggi, pilihan token makin acak"]]
    };
    function arti(id, t) { var L = root.LEGENDA[id] || {}; return L[t] || SIMBOL[t] || null; }
    /* nomor pelajaran "(2.3)" di teks legenda jadi link ke pelajaran tempat simbol itu diajarkan */
    function tautkan(h) { return h.replace(/\(([0-6])\.(\d{1,2})\)/g, function (m, a, b) { var k = a + "." + b; return root.LESSONS && root.LESSONS[k] ? '(<a href="#p' + a + "-" + b + '">' + k + "</a>)" : m; }); }
    root.legendify = function (view, id) {
      var all = [], seen = {}, groups = [];
      [].forEach.call(view.querySelectorAll(".tx, mark"), function (el) {
        if (el.closest(".viz, pre, .lg") || (el.tagName === "MARK" && el.querySelector(".tx"))) return;
        var tk = (el.tagName === "MARK" ? tokensPlain(el.textContent, true) : tokens(el.textContent)).filter(function (t) { return arti(id, t); });
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
      /* Urut sesuai posisi di halaman. Setiap baris menjelaskan simbol yang baru muncul;
         simbol yang sudah dijelaskan di atasnya cukup disebut namanya. */
      groups.sort(function (a, b) { return a.host.compareDocumentPosition(b.host) & 4 ? -1 : 1; });
      var shown = {};
      groups.forEach(function (g) {
        var baru = g.tk.filter(function (t) { return !shown[t]; }), lama = g.tk.filter(function (t) { return shown[t]; });
        baru.forEach(function (t) { shown[t] = 1; });
        var d = document.createElement("div"); d.className = "lg";
        d.innerHTML = "<b>Legenda</b> " + baru.map(function (t) { return '<span><i>' + esc(nama(t)) + "</i> " + tautkan(esc(arti(id, t))) + "</span>"; }).join("") +
          (lama.length ? '<span class="lg-lama">' + (baru.length ? "Juga" : "Semua simbol") + " sudah dijelaskan di atas: " + lama.map(function (t) { return "<i>" + esc(nama(t)) + "</i>"; }).join(", ") + "</span>" : "");
        if (g.host.classList.contains("rule")) g.host.appendChild(d); else g.host.insertAdjacentElement("afterend", d);
      });
      if (!all.length) return;
      var box = document.createElement("details"); box.className = "lgbox";
      box.innerHTML = "<summary>Legenda semua simbol di pelajaran ini (" + all.length + ")</summary><dl>" +
        all.map(function (t) { return "<div><dt>" + esc(nama(t)) + "</dt><dd>" + tautkan(esc(arti(id, t))) + "</dd></div>"; }).join("") + "</dl>";
      var why = view.querySelector(".why"); if (why) why.insertAdjacentElement("afterend", box);
    };
    /* Legenda untuk simbol di label slider widget (dipanggil setelah widget terpasang) */
    root.legendifyViz = function (view, id) {
      var khusus = VIZLEG[id];
      [].forEach.call(view.querySelectorAll(".viz .viz-c"), function (c) {
        if (c.parentNode.querySelector(".lg-viz")) return;
        if (khusus) {
          var d0 = document.createElement("div"); d0.className = "lg lg-viz";
          d0.innerHTML = "<b>Legenda</b> " + khusus.map(function (p) { return '<span><i>' + esc(p[0]) + "</i> " + esc(p[1]) + "</span>"; }).join("");
          c.insertAdjacentElement("afterend", d0); return;
        }
        var tk = [];
        [].forEach.call(c.querySelectorAll("label > span"), function (s) {
          var txt = s.textContent.split("=")[0];
          tokensPlain(txt, true).forEach(function (t) { if (arti(id, t) && tk.indexOf(t) < 0) tk.push(t); });
        });
        if (!tk.length) return;
        var d = document.createElement("div"); d.className = "lg lg-viz";
        d.innerHTML = "<b>Legenda</b> " + tk.map(function (t) { return '<span><i>' + esc(nama(t)) + "</i> " + esc(arti(id, t)) + "</span>"; }).join("");
        c.insertAdjacentElement("afterend", d);
      });
    };
  }
})(typeof window !== "undefined" ? window : null);
