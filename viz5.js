/* Widget Lapis 5. Memakai alat bantu dari viz.js (window.VIZ). */
(function () {
  var V = window.VIZ, W = V.W, Plane = V.Plane, frame = V.frame, button = V.button, el = V.el, fmt = V.fmt, heads = V.heads, draggable = V.draggable, clamp = V.clamp;
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function mk(svg, o) { var p = Plane(svg, o); p.svg = svg; return p; }
  function clip(p) { return el("g", { "clip-path": "url(#" + p.svg.querySelector("clipPath").id + ")" }, p.svg); }
  function path(p, pts, cls, g) { return el("path", { d: pts.map(function (q, i) { return (i ? "L" : "M") + p.X(q[0]).toFixed(1) + " " + p.Y(q[1]).toFixed(1); }).join(""), "class": cls }, g || p.svg); }
  function bar(p, x0, x1, y, cls, y0) { y0 = y0 || 0; return el("rect", { x: p.X(x0), y: p.Y(Math.max(y, y0)), width: p.X(x1) - p.X(x0), height: Math.abs(p.Y(y) - p.Y(y0)), "class": cls }, p.svg); }
  function cell(p, x0, y0, x1, y1, op, cls) { return el("rect", { x: p.X(x0), y: p.Y(y1), width: p.X(x1) - p.X(x0), height: p.Y(y0) - p.Y(y1), "class": cls || "s1 fill", style: "fill-opacity:" + op.toFixed(3) + ";stroke:var(--line2);stroke-width:.6" }, p.svg); }
  function sig(z) { return 1 / (1 + Math.exp(-z)); }
  function Ncdf(x) { var t = 1 / (1 + 0.2316419 * Math.abs(x)), d = 0.3989423 * Math.exp(-x * x / 2), q = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - q : q; }
  function Npdf(x, m, s) { return Math.exp(-(x - m) * (x - m) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); }

  /* 5.1 regresi logistik satu fitur */
  W.logit = function (h) {
    var f = frame(h, "Titik di atas = kelas 1 (ungu), di bawah = kelas 0 (biru muda). Atur w dan b; kurva = peluang kelas 1", [{ id: "w", label: "bobot w", min: -4, max: 6, step: 0.1, v: 1, d: 1 }, { id: "b", label: "bias b", min: -12, max: 6, step: 0.1, v: -2, d: 1 }]);
    var p = mk(f.svg, { x0: 0, x1: 6, y0: -0.1, y1: 1.1, h: 280, sx: 1, sy: 0.25 }), r = rng(4), D = [];
    for (var i = 0; i < 24; i++) { var y = i % 2, x = clamp((y ? 3.8 : 2.2) + 0.9 * gauss(r), 0.2, 5.8); D.push([x, y]); }
    h._draw = function () {
      var w = f.vals.w, b = f.vals.b, L = 0, ok = 0; p.clear();
      p.curve(function (x) { return sig(w * x + b); }, "ink line");
      if (Math.abs(w) > 1e-6) { var xb = -b / w; if (xb > 0 && xb < 6) { p.seg(xb, -0.1, xb, 1.1, "guide"); p.text(xb, 1.04, "batas", "lbl", "middle"); } }
      D.forEach(function (d) { var q = sig(w * d[0] + b); L -= d[1] ? Math.log(Math.max(q, 1e-12)) : Math.log(Math.max(1 - q, 1e-12)); if ((q > 0.5) === !!d[1]) ok++; p.dot(d[0], d[1], d[1] ? "s1 dot" : "s2 dot", 5); });
      f.out.innerHTML = "Cross-entropy rata-rata = <b>" + fmt(L / D.length, 3) + "</b>, benar " + ok + " dari " + D.length + ". Decision boundary di x = −b/w = " + (Math.abs(w) > 1e-6 ? fmt(-b / w, 2) : "tidak ada") + ". Coba buat kurva lebih curam (w besar): loss turun kalau batasnya tepat, tapi titik yang salah sisi dihukum makin berat.";
    }; h._draw();
  };

  /* 5.2 satu belahan pohon: Gini */
  W.stump = function (h) {
    var f = frame(h, "Geser ambang belahan. Ungu = kelas \"ya\", biru muda = \"tidak\". Kurva bawah = Gini berbobot untuk setiap ambang", [{ id: "s", label: "ambang", min: 0, max: 10, step: 0.1, v: 5, d: 1 }]);
    var X = [0.8, 1.5, 2.1, 2.9, 3.4, 4.2, 4.6, 5.3, 5.9, 6.4, 7.2, 7.7, 8.5, 9.1], Y = [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1];
    var p = mk(f.svg, { x0: 0, x1: 10, y0: 0, y1: 1, h: 300, sx: 1, sy: 0.25 });
    function g(lst) { if (!lst.length) return 0; var a = lst.filter(function (v) { return v; }).length / lst.length; return 1 - a * a - (1 - a) * (1 - a); }
    function wg(s) { var L = [], R = []; X.forEach(function (x, i) { (x < s ? L : R).push(Y[i]); }); return { L: L, R: R, v: (L.length * g(L) + R.length * g(R)) / X.length }; }
    h._draw = function () {
      var s = f.vals.s, c = wg(s), best = 0, bv = 9; p.clear();
      p.curve(function (t) { return wg(t).v; }, "s2 line"); for (var t = 0; t <= 10; t += 0.05) { var v = wg(t).v; if (v < bv - 1e-9) { bv = v; best = t; } }
      X.forEach(function (x, i) { p.dot(x, 0.85, Y[i] ? "s1 dot" : "s2 dot", 6); });
      p.seg(s, 0, s, 1, "ink line"); p.dot(s, c.v, "ink dot", 5);
      f.out.innerHTML = "Kiri: " + c.L.length + " titik, Gini " + fmt(g(c.L), 3) + ". Kanan: " + c.R.length + " titik, Gini " + fmt(g(c.R), 3) + ". Berbobot: <b>" + fmt(c.v, 3) + "</b> (sebelum dibelah " + fmt(g(Y), 3) + "). Ambang terbaik sekitar " + fmt(best, 1) + " dengan Gini " + fmt(bv, 3) + ". Algoritma pohon mencoba semua ambang dan memilih titik terendah kurva.";
    }; h._draw();
  };

  /* 5.3 k-means langkah demi langkah */
  W.kmeans = function (h) {
    var f = frame(h, "Tekan Langkah: bergantian menugaskan titik ke pusat terdekat dan memindahkan pusat ke rata-rata", []);
    var p = mk(f.svg, { x0: 0, x1: 10, y0: 0, y1: 7, h: 340, w: 520, sx: 1, sy: 1 }), r0 = rng(9), P = [], C = [], lab = [], phase = 0, seed = 1, k = 3;
    [[2.5, 2], [7, 2.5], [5, 5.3]].forEach(function (c) { for (var i = 0; i < 18; i++) P.push([c[0] + 0.8 * gauss(r0), c[1] + 0.7 * gauss(r0)]); });
    function init() { var r = rng(seed); C = []; for (var j = 0; j < k; j++) C.push(P[Math.floor(r() * P.length)].slice()); lab = P.map(function () { return -1; }); phase = 0; }
    function sse() { var s = 0; P.forEach(function (q, i) { if (lab[i] >= 0) s += Math.pow(q[0] - C[lab[i]][0], 2) + Math.pow(q[1] - C[lab[i]][1], 2); }); return s; }
    var cls = ["s1", "s2", "ink"], moved = 0;
    h._draw = function () {
      p.clear();
      P.forEach(function (q, i) { p.dot(q[0], q[1], lab[i] < 0 ? "ink dot" : cls[lab[i]] + " dot", lab[i] < 0 ? 2.5 : 4); });
      C.forEach(function (c, j) { el("rect", { x: p.X(c[0]) - 7, y: p.Y(c[1]) - 7, width: 14, height: 14, "class": cls[j] + " fill", style: "stroke:var(--sheet);stroke-width:2.5" }, p.svg); });
      f.out.innerHTML = (lab[0] < 0 ? "Pusat awal dipilih acak (kotak). Tekan Langkah untuk menugaskan titik." : (phase ? "Baru saja <b>menugaskan</b>: " + moved + " titik berpindah kelompok. Berikutnya: pindahkan pusat." : "Baru saja <b>memindahkan</b> pusat ke rata-rata anggotanya. Berikutnya: tugaskan ulang.") + " Jumlah kuadrat jarak = <b>" + fmt(sse(), 2) + "</b>, tidak pernah naik.") + (lab[0] >= 0 && phase && moved === 0 ? " Tidak ada yang pindah: <b>selesai</b>. Coba Acak pusat; hasil akhir bisa berbeda (minimum lokal)." : "");
    };
    button(f, "Langkah", function () {
      if (phase === 0) { moved = 0; P.forEach(function (q, i) { var bj = 0, bd = 1e9; C.forEach(function (c, j) { var d = Math.pow(q[0] - c[0], 2) + Math.pow(q[1] - c[1], 2); if (d < bd) { bd = d; bj = j; } }); if (lab[i] !== bj) moved++; lab[i] = bj; }); phase = 1; }
      else { C = C.map(function (c, j) { var s = [0, 0], n = 0; P.forEach(function (q, i) { if (lab[i] === j) { s[0] += q[0]; s[1] += q[1]; n++; } }); return n ? [s[0] / n, s[1] / n] : c; }); phase = 0; }
      h._draw(); });
    button(f, "Acak pusat", function () { seed++; init(); h._draw(); });
    init(); h._draw();
  };

  /* 5.4 jaringan kecil maju dan mundur */
  W.backprop = function (h) {
    var f = frame(h, "Jaringan 2–2–1 dari contoh, dengan ReLU. Atur masukan dan target; angka ungu = nilai maju, biru muda = gradien mundur", [{ id: "x1", label: "x₁", min: -2, max: 2, step: 0.1, v: 1, d: 1 }, { id: "x2", label: "x₂", min: -2, max: 2, step: 0.1, v: 2, d: 1 }, { id: "t", label: "target t", min: -3, max: 3, step: 0.1, v: 1, d: 1 }]);
    var p = mk(f.svg, { x0: 0.001, x1: 10, y0: 0.001, y1: 6, h: 320, sx: 100, sy: 100 }), W1 = [[0.5, -1], [1, 0.5]], w2 = [1, -1];
    h._draw = function () {
      var x = [f.vals.x1, f.vals.x2], t = f.vals.t, z = [W1[0][0] * x[0] + W1[0][1] * x[1], W1[1][0] * x[0] + W1[1][1] * x[1]], hh = z.map(function (v) { return Math.max(0, v); }), y = w2[0] * hh[0] + w2[1] * hh[1], L = 0.5 * (y - t) * (y - t);
      var dy = y - t, dh = [dy * w2[0], dy * w2[1]], dz = [dh[0] * (z[0] > 0), dh[1] * (z[1] > 0)];
      p.clear(); var IN = [[1.2, 4.3], [1.2, 1.7]], HN = [[5, 4.3], [5, 1.7]], ON = [8.6, 3];
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) { var l = p.seg(IN[j][0], IN[j][1], HN[i][0], HN[i][1], "faint line"); l.setAttribute("style", "stroke-dasharray:none;opacity:" + (dz[i] ? 0.9 : 0.25)); p.text((IN[j][0] + HN[i][0]) / 2 + (i ? 0.4 : -0.4), (IN[j][1] + HN[i][1]) / 2 + (j ? -0.25 : 0.25), "∂=" + fmt(dz[i] * x[j], 2), "lbl s2t", "middle"); }
      for (i = 0; i < 2; i++) { p.seg(HN[i][0], HN[i][1], ON[0], ON[1], "faint line").setAttribute("style", "stroke-dasharray:none"); p.text((HN[i][0] + ON[0]) / 2, (HN[i][1] + ON[1]) / 2 + 0.3, "∂=" + fmt(dy * hh[i], 2), "lbl s2t", "middle"); }
      IN.forEach(function (n, j) { p.dot(n[0], n[1], "ink dot", 13); p.text(n[0] - 0.5, n[1] + 0.05, "x=" + fmt(x[j], 1), "lbl s1t", "end"); });
      HN.forEach(function (n, i) { p.dot(n[0], n[1], z[i] > 0 ? "s1 dot" : "ink dot", 13); p.text(n[0], n[1] + 0.75, "z=" + fmt(z[i], 2) + " h=" + fmt(hh[i], 2), "lbl s1t", "middle"); if (z[i] <= 0) p.text(n[0], n[1] - 0.95, "mati (ReLU)", "lbl", "middle"); });
      p.dot(ON[0], ON[1], "s1 dot", 13); p.text(ON[0], ON[1] + 0.75, "ŷ=" + fmt(y, 2), "lbl s1t", "middle"); p.text(ON[0], ON[1] - 0.95, "∂L/∂ŷ=" + fmt(dy, 2), "lbl s2t", "middle");
      f.out.innerHTML = "Loss ½(ŷ − t)² = <b>" + fmt(L, 3) + "</b>. Gradien bobot lapis 2 = (ŷ − t)·h = [" + fmt(dy * hh[0], 2) + "; " + fmt(dy * hh[1], 2) + "]. Gradien W₁ baris i = ∂L/∂zᵢ · x, dan ∂L/∂zᵢ = 0 untuk neuron yang mati. Garis pudar = jalur yang tidak meneruskan gradien.";
    }; h._draw();
  };

  /* 5.5 konvolusi 2D pada gambar 8×8 */
  W.conv2d = function (h) {
    var f = frame(h, "Gambar 8×8 (kiri) dan peta fitur 6×6 hasil kernel 3×3 (kanan). Ungu = positif, biru muda = negatif", []);
    var img = ["00000000", "00111100", "00100100", "00100100", "00111100", "00000100", "00000100", "00000000"].map(function (r) { return r.split("").map(Number); });
    var K = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], nama = "tepi tegak", p = mk(f.svg, { x0: 0.001, x1: 17, y0: 0.001, y1: 8, h: 300, w: 600, sx: 100, sy: 100 });
    h._draw = function () {
      p.clear(); var i, j, a, b, out = [], mx = 0;
      for (i = 0; i < 8; i++) for (j = 0; j < 8; j++) cell(p, j, 7 - i, j + 1, 8 - i, img[i][j] ? 0.85 : 0.04, "ink fill");
      for (i = 0; i < 6; i++) { out.push([]); for (j = 0; j < 6; j++) { var s = 0; for (a = 0; a < 3; a++) for (b = 0; b < 3; b++) s += img[i + a][j + b] * K[a][b]; out[i].push(s); mx = Math.max(mx, Math.abs(s)); } }
      for (i = 0; i < 6; i++) for (j = 0; j < 6; j++) { var v = out[i][j]; cell(p, 10 + j, 6 - i, 11 + j, 7 - i, mx ? Math.abs(v) / mx * 0.9 : 0, v >= 0 ? "s1 fill" : "s2 fill"); if (v) p.text(10.5 + j, 6.3 - i, fmt(v, 0), "lbl", "middle"); }
      p.text(13, 0.6, "peta fitur", "lbl", "middle"); p.text(8.9, 4, "→", "lbl", "middle");
      f.out.innerHTML = "Kernel " + nama + ": [" + K.map(function (r) { return r.map(function (v) { return fmt(v, 0); }).join(" "); }).join(" | ") + "]. Setiap kotak kanan = jumlah 9 piksel di bawah kernel dikali bobotnya. Perhatikan bagian mana yang menyala untuk setiap kernel: itulah pola yang dicari kernel tersebut.";
    };
    [["tepi tegak", [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]]], ["tepi datar", [[-1, -1, -1], [0, 0, 0], [1, 1, 1]]], ["rata-rata", [[1, 1, 1], [1, 1, 1], [1, 1, 1]]], ["sudut", [[0, 0, 0], [0, 1, 1], [0, 1, 0]]]].forEach(function (it) { button(f, it[0], function () { K = it[1]; nama = it[0]; h._draw(); }); });
    h._draw();
  };

  /* 5.6 vanishing gradient / meledak */
  W.vanish = function (h) {
    var f = frame(h, "Gradien setelah t backward pass ≈ λᵗ. Sumbu tegak memakai skala log (10ᵏ). Garis biru muda: LSTM dengan forget gate f", [{ id: "l", label: "faktor RNN λ", min: 0.5, max: 1.3, step: 0.01, v: 0.9 }, { id: "fg", label: "forget gate f", min: 0.5, max: 1, step: 0.01, v: 0.99 }]);
    var p = mk(f.svg, { x0: 0, x1: 100, y0: -8, y1: 4, h: 300, sx: 10, sy: 1, lx: 20, ly: 2 });
    h._draw = function () {
      var l = f.vals.l, fg = f.vals.fg; p.clear();
      p.curve(function (t) { return t * Math.log10(l); }, "s1 line"); p.curve(function (t) { return t * Math.log10(fg); }, "s2 line");
      p.seg(0, -2, 100, -2, "guide"); p.text(99, -1.7, "1%", "lbl", "end");
      var n1 = l < 1 ? Math.ceil(-2 / Math.log10(l)) : null, n2 = fg < 1 ? Math.ceil(-2 / Math.log10(fg)) : null;
      f.out.innerHTML = "RNN: setelah 50 langkah gradien dikali <b>" + (Math.pow(l, 50) < 1e-3 || Math.pow(l, 50) > 1e3 ? Math.pow(l, 50).toExponential(1).replace(".", ",") : fmt(Math.pow(l, 50), 3)) + "</b>" + (l > 1 ? ": <b>meledak</b>." : n1 ? "; turun di bawah 1% setelah " + n1 + " langkah." : ".") + " LSTM dengan f = " + fmt(fg, 2) + ": " + (n2 ? "di bawah 1% setelah " + n2 + " langkah." : "tidak melemah sama sekali.") + " Forget gate dipelajari, jadi jaringan bisa memilih f ≈ 1 untuk informasi yang perlu diingat lama.";
    }; h._draw();
  };

  /* 5.7 attention: seret query */
  W.attn = function (h) {
    var f = frame(h, "Seret query (titik ungu besar). Empat kunci; ukuran lingkaran = bobot attention. Kotak = keluaran (campuran value)", [{ id: "s", label: "skala skor (1/√d)", min: 0.2, max: 4, step: 0.1, v: 1, d: 1 }]);
    var p = mk(f.svg, { x0: -3, x1: 3, y0: -3, y1: 3, h: 380, w: 420, sx: 1, sy: 1 }), Q = [1.5, 0.5];
    var K = [[2, 0], [0, 2], [-2, 0], [1.4, 1.4]], Vv = [[2.4, -0.6], [-0.6, 2.4], [-2.4, -0.6], [1.6, 1.8]], nm = ["k₁", "k₂", "k₃", "k₄"];
    h._draw = function () {
      var s = f.vals.s, sc = K.map(function (k) { return s * (k[0] * Q[0] + k[1] * Q[1]); }), m = Math.max.apply(null, sc), e = sc.map(function (v) { return Math.exp(v - m); }), Z = e.reduce(function (a, b) { return a + b; }, 0), w = e.map(function (v) { return v / Z; });
      var o = [0, 0]; w.forEach(function (wi, i) { o[0] += wi * Vv[i][0]; o[1] += wi * Vv[i][1]; }); p.clear(); heads(f.svg);
      K.forEach(function (k, i) { p.arrow(0, 0, k[0] * 0.95, k[1] * 0.95, "s2"); el("circle", { cx: p.X(k[0]), cy: p.Y(k[1]), r: 4 + 26 * w[i], "class": "s2 area" }, p.svg); p.text(k[0] + 0.15, k[1] - 0.35, nm[i] + " " + fmt(w[i], 2), "lbl"); });
      el("rect", { x: p.X(o[0]) - 6, y: p.Y(o[1]) - 6, width: 12, height: 12, "class": "ink fill" }, p.svg);
      p.arrow(0, 0, Q[0], Q[1], "s1"); p.dot(Q[0], Q[1], "s1 dot handle", 9);
      f.out.innerHTML = "Skor q·kᵢ × skala = [" + sc.map(function (v) { return fmt(v, 2); }).join("; ") + "], bobot softmax = [" + w.map(function (v) { return fmt(v, 2); }).join("; ") + "]. Keluaran (kotak) = Σ bobot × value = (" + fmt(o[0], 2) + "; " + fmt(o[1], 2) + "). " + (s > 2.5 ? "Skala besar: softmax tajam, hampir hanya satu kunci yang dipakai." : s < 0.5 ? "Skala kecil: bobot hampir rata, keluaran mendekati rata-rata semua value." : "Kunci yang searah dengan query mendapat bobot terbesar.");
    };
    draggable(f.svg, p, function () { return [Q]; }, function (i, v) { Q = [clamp(v[0], -2.8, 2.8), clamp(v[1], -2.8, 2.8)]; h._draw(); });
    h._draw();
  };

  /* 5.8 SSM: rekursi = konvolusi */
  W.ssm = function (h) {
    var f = frame(h, "Masukan (batang hitam) melewati SSM h ← a·h + x. Garis ungu = keluaran. Kernel konvolusinya [1, a, a², …] (biru muda)", [{ id: "a", label: "a = e^(−Δ)", min: 0, max: 0.99, step: 0.01, v: 0.8 }]);
    var X = [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0], p = mk(f.svg, { x0: -0.5, x1: 19.5, y0: -1.5, y1: 3.5, h: 300, sx: 1, sy: 1, lx: 5 });
    h._draw = function () {
      var a = f.vals.a, hh = 0, out = []; X.forEach(function (x) { hh = a * hh + x; out.push(hh); }); p.clear();
      for (var k = 0; k < 20; k++) bar(p, k - 0.15, k + 0.15, Math.pow(a, k) * 0.9 - 1.4, "s2 area", -1.4);
      X.forEach(function (x, i) { if (x) { p.seg(i, 0, i, x, "ink line"); p.dot(i, x, "ink dot", 3.5); } });
      path(p, out.map(function (v, i) { return [i, v]; }), "s1 line"); out.forEach(function (v, i) { p.dot(i, v, "s1 dot", 3); });
      var half = a > 0 ? Math.log(0.5) / Math.log(a) : 0;
      f.out.innerHTML = "Sumbangan masukan menyusut menjadi separuh setelah <b>" + (a > 0 ? fmt(half, 1) : "0") + " langkah</b> (aᵏ = ½). Rekursi dan konvolusi dengan kernel aᵏ memberi keluaran yang sama persis. a mendekati 1: ingatan panjang. a mendekati 0: hanya masukan terakhir yang penting. Mamba memilih a per token.";
    }; h._draw();
  };

  /* 5.9 jadwal learning rate */
  W.sched = function (h) {
    var f = frame(h, "Learning rate selama pelatihan: naik linear (warmup), lalu turun mengikuti kosinus. Garis biru muda = tanpa jadwal", [{ id: "w", label: "warmup (% langkah)", min: 0, max: 40, step: 1, v: 10, d: 0 }, { id: "m", label: "batas bawah (% puncak)", min: 0, max: 50, step: 1, v: 0, d: 0 }]);
    var p = mk(f.svg, { x0: 0, x1: 1000, y0: 0, y1: 1.15, h: 280, sx: 100, sy: 0.25, lx: 200 });
    h._draw = function () {
      var w = f.vals.w * 10, mn = f.vals.m / 100; p.clear();
      var lr = function (t) { return t < w ? t / w : mn + (1 - mn) * 0.5 * (1 + Math.cos(Math.PI * (t - w) / (1000 - w))); };
      p.seg(0, 1, 1000, 1, "s2 line"); p.curve(lr, "s1 line"); p.text(990, 1.06, "puncak", "lbl", "end");
      f.out.innerHTML = "Dalam satuan puncak: langkah 50 → <b>" + fmt(lr(50), 3) + "</b>, langkah 500 → <b>" + fmt(lr(500), 3) + "</b>, langkah 900 → <b>" + fmt(lr(900), 3) + "</b>. Warmup melindungi awal pelatihan saat bobot masih acak; ujung yang kecil membuat model mengendap di dasar lembah.";
    }; h._draw();
  };

  /* 5.10 VAE: KL dan reparameterisasi */
  W.vae = function (h) {
    var f = frame(h, "Encoder memberi μ dan σ. Ungu = q(z|x) = N(μ, σ²), putus-putus = prior N(0, 1). Titik = sampel z = μ + σε", [{ id: "m", label: "μ", min: -3, max: 3, step: 0.1, v: 1, d: 1 }, { id: "s", label: "σ", min: 0.1, max: 2.5, step: 0.05, v: 0.5 }]);
    var p = mk(f.svg, { x0: -5, x1: 5, y0: 0, y1: 1.6, h: 280, sx: 1, sy: 0.4 }), r = rng(2), E = [];
    for (var i = 0; i < 30; i++) E.push(gauss(r));
    h._draw = function () {
      var m = f.vals.m, s = f.vals.s, kl = 0.5 * (m * m + s * s - 1 - Math.log(s * s)); p.clear();
      p.curve(function (x) { return Npdf(x, 0, 1); }, "ink line dash"); p.curve(function (x) { return Npdf(x, m, s); }, "s1 line");
      E.forEach(function (e, k) { p.dot(m + s * e, 0.06 + 0.012 * (k % 5), "s1 dot", 3); });
      f.out.innerHTML = "KL(q ‖ prior) = ½(μ² + σ² − 1 − ln σ²) = <b>" + fmt(kl, 3) + "</b>. Bagian dari μ: " + fmt(0.5 * m * m, 3) + ", bagian dari σ: " + fmt(0.5 * (s * s - 1 - Math.log(s * s)), 3) + ". Sampel z dibuat dari ε tetap (30 angka acak) yang digeser μ dan direntang σ: itulah trik reparameterisasi, sehingga z bisa diturunkan terhadap μ dan σ.";
    }; h._draw();
  };

  /* 5.11 GAN: discriminator terbaik */
  W.gan = function (h) {
    var f = frame(h, "Data asli p (ungu, dua puncak) dan generator q (biru muda, normal). Garis tebal = discriminator terbaik D* = p/(p + q)", [{ id: "m", label: "rata-rata q", min: -3, max: 3, step: 0.1, v: 1.5, d: 1 }, { id: "s", label: "simpangan baku q", min: 0.2, max: 3, step: 0.05, v: 0.6 }]);
    var p = mk(f.svg, { x0: -5, x1: 5, y0: 0, y1: 1.05, h: 300, sx: 1, sy: 0.25 });
    var P = function (x) { return 0.5 * Npdf(x, -1.5, 0.6) + 0.5 * Npdf(x, 1.5, 0.6); };
    h._draw = function () {
      var m = f.vals.m, s = f.vals.s, Q = function (x) { return Npdf(x, m, s); }, js = 0, dx = 0.01; p.clear();
      for (var x = -8; x <= 8; x += dx) { var a = P(x), b = Q(x), mm = (a + b) / 2; if (a > 1e-12) js += 0.5 * a * Math.log(a / mm) * dx; if (b > 1e-12) js += 0.5 * b * Math.log(b / mm) * dx; }
      p.curve(P, "s1 line"); p.curve(Q, "s2 line"); p.curve(function (x) { var a = P(x), b = Q(x); return a + b > 1e-9 ? a / (a + b) : NaN; }, "ink line"); p.seg(-5, 0.5, 5, 0.5, "guide");
      f.out.innerHTML = "JSD(p ‖ q) = <b>" + fmt(js, 3) + "</b> nat (maksimum ln 2 ≈ 0,693). Nilai permainan dengan D* = −log 4 + 2·JSD = <b>" + fmt(-Math.log(4) + 2 * js, 3) + "</b>; minimum −1,386 hanya kalau q = p. Satu normal tidak bisa menutup dua puncak: kalau ia memilih satu puncak saja, itulah gambaran mode collapse.";
    }; h._draw();
  };

  /* 5.12 difusi maju pada data dua puncak */
  W.diffuse = function (h) {
    var f = frame(h, "Data asli: dua kelompok di −2 dan +2. Geser langkah t: histogram x_t = √ᾱ·x₀ + √(1−ᾱ)·ε. Putus-putus = N(0, 1)", [{ id: "t", label: "langkah t", min: 0, max: 1000, step: 10, v: 0, d: 0 }]);
    var p = mk(f.svg, { x0: -4.5, x1: 4.5, y0: 0, y1: 1.4, h: 300, sx: 1, sy: 0.25 }), r = rng(8), X0 = [], EP = [], ab = [1];
    for (var i = 0; i < 2000; i++) { X0.push((i % 2 ? 2 : -2) + 0.25 * gauss(r)); EP.push(gauss(r)); }
    for (var t = 1; t <= 1000; t++) ab.push(ab[t - 1] * (1 - (1e-4 + (0.02 - 1e-4) * (t - 1) / 999)));
    h._draw = function () {
      var t = f.vals.t, a = Math.sqrt(ab[t]), b = Math.sqrt(1 - ab[t]), bins = new Array(45).fill(0), w = 0.2; p.clear();
      X0.forEach(function (x, k) { var v = a * x + b * EP[k], j = Math.floor((v + 4.5) / w); if (j >= 0 && j < 45) bins[j]++; });
      bins.forEach(function (c, j) { bar(p, -4.5 + j * w, -4.5 + (j + 1) * w, c / (2000 * w), "s1 area"); });
      p.curve(function (x) { return Npdf(x, 0, 1); }, "ink line dash");
      f.out.innerHTML = "t = " + t + ": bagian sinyal √ᾱ = <b>" + fmt(a, 3) + "</b>, bagian noise √(1 − ᾱ) = <b>" + fmt(b, 3) + "</b>. " + (t < 150 ? "Dua kelompok masih jelas." : t < 450 ? "Kelompok mulai melebur." : t < 800 ? "Hampir tak bisa dibedakan dari noise." : "Sudah noise normal murni, apa pun data awalnya.") + " Model difusi belajar berjalan dari kanan ke kiri slider ini.";
    }; h._draw();
  };

  /* 5.13 model bigram dengan suhu */
  W.bigram = function (h) {
    var f = frame(h, "Model bigram dari korpus kecil. Pilih kata, lihat peluang kata berikutnya pada suhu T, lalu bangkitkan kalimat", [{ id: "T", label: "suhu T", min: 0.1, max: 3, step: 0.1, v: 1, d: 1 }]);
    var korpus = "aku suka kopi . aku suka teh manis . kamu suka kopi pahit . aku minum teh . kamu minum kopi manis . dia suka teh . dia minum kopi . aku suka kamu .".split(" ");
    var C = {}; for (var i = 0; i + 1 < korpus.length; i++) { var a = korpus[i]; C[a] = C[a] || {}; C[a][korpus[i + 1]] = (C[a][korpus[i + 1]] || 0) + 1; }
    var cur = "suka", seed = 1, kal = "", p = mk(f.svg, { x0: 0, x1: 6.2, y0: 0, y1: 1, h: 260, sx: 9, sy: 0.25 });
    function dist(wd, T) { var c = C[wd] || { ".": 1 }, ks = Object.keys(c), lg = ks.map(function (k) { return Math.log(c[k]) / T; }), m = Math.max.apply(null, lg), e = lg.map(function (v) { return Math.exp(v - m); }), Z = e.reduce(function (x, y) { return x + y; }, 0); return ks.map(function (k, j) { return [k, e[j] / Z, c[k]]; }).sort(function (x, y) { return y[1] - x[1]; }); }
    h._draw = function () {
      var d = dist(cur, f.vals.T); p.clear();
      d.slice(0, 6).forEach(function (q, j) { var c = j + 0.7; bar(p, c - 0.3, c + 0.3, q[1], "s1 area"); p.text(c, -0.07, q[0], "lbl", "middle"); p.text(c, q[1] + 0.03, fmt(q[1], 2), "lbl", "middle"); });
      f.out.innerHTML = "Setelah \"<b>" + cur + "</b>\": hitungan di korpus " + d.map(function (q) { return q[0] + " " + q[2] + "×"; }).join(", ") + ". Peluang = softmax(log hitungan ÷ T); T = 1 memberi frekuensi asli." + (kal ? "<br>Kalimat dibangkitkan: <b>" + kal + "</b>" : "");
    };
    ["aku", "suka", "minum", "teh"].forEach(function (wd) { button(f, wd, function () { cur = wd; h._draw(); }); });
    button(f, "Bangkitkan", function () { var r = rng(seed++), w = ["aku", "kamu", "dia"][Math.floor(r() * 3)], out = [w]; for (var n = 0; n < 10 && w !== "."; n++) { var d = dist(w, f.vals.T), u = r(), c = 0; for (var j = 0; j < d.length; j++) { c += d[j][1]; if (u <= c) { w = d[j][0]; break; } } out.push(w); } kal = out.join(" "); h._draw(); });
    h._draw();
  };

  /* 5.14 value iteration di gridworld */
  W.grid = function (h) {
    var f = frame(h, "Dunia kotak 6×5. Ungu = tujuan (+1), biru muda = jurang (−1), kotak gelap = dinding. Tekan Iterasi: nilai menyebar dari tujuan", [{ id: "g", label: "diskon γ", min: 0.5, max: 0.99, step: 0.01, v: 0.9 }]);
    var Cn = 6, Rn = 5, goal = [5, 4], pit = [5, 2], wall = { "2,1": 1, "2,2": 1, "2,3": 1, "4,3": 1 }, Vv, it = 0, p = mk(f.svg, { x0: 0.001, x1: 6, y0: 0.001, y1: 5, h: 330, w: 420, sx: 100, sy: 100 });
    function reset() { Vv = []; for (var x = 0; x < Cn; x++) { Vv.push([]); for (var y = 0; y < Rn; y++) Vv[x].push(0); } it = 0; }
    function term(x, y) { return (x === goal[0] && y === goal[1]) || (x === pit[0] && y === pit[1]); }
    var D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    function nxt(x, y, d) { var a = x + d[0], b = y + d[1]; return a < 0 || b < 0 || a >= Cn || b >= Rn || wall[a + "," + b] ? [x, y] : [a, b]; }
    function rew(q) { return q[0] === goal[0] && q[1] === goal[1] ? 1 : q[0] === pit[0] && q[1] === pit[1] ? -1 : 0; }
    function step() { var g = f.vals.g, N = Vv.map(function (c) { return c.slice(); }); for (var x = 0; x < Cn; x++) for (var y = 0; y < Rn; y++) { if (wall[x + "," + y] || term(x, y)) continue; var best = -9; D.forEach(function (d) { var q = nxt(x, y, d), v = rew(q) + (term(q[0], q[1]) ? 0 : g * Vv[q[0]][q[1]]); if (v > best) best = v; }); N[x][y] = best; } Vv = N; it++; }
    h._draw = function () {
      p.clear(); heads(f.svg);
      for (var x = 0; x < Cn; x++) for (var y = 0; y < Rn; y++) {
        if (wall[x + "," + y]) { cell(p, x, y, x + 1, y + 1, 1, "ink fill").setAttribute("style", "fill:var(--sheet);stroke:var(--line2);stroke-width:.6"); p.text(x + 0.5, y + 0.42, "dinding", "lbl faintt", "middle"); continue; }
        if (term(x, y)) { cell(p, x, y, x + 1, y + 1, 0.7, x === goal[0] && y === goal[1] ? "s1 fill" : "s2 fill"); p.text(x + 0.5, y + 0.42, x === goal[0] && y === goal[1] ? "+1" : "−1", "lbl", "middle"); continue; }
        var v = Vv[x][y]; cell(p, x, y, x + 1, y + 1, Math.max(0, v) * 0.6, "s1 fill"); p.text(x + 0.5, y + 0.6, fmt(v, 2), "lbl", "middle");
        if (it) { var bd = null, bv = -9; D.forEach(function (d) { var q = nxt(x, y, d), w = rew(q) + (term(q[0], q[1]) ? 0 : f.vals.g * Vv[q[0]][q[1]]); if (w > bv + 1e-9) { bv = w; bd = d; } }); if (bd && bv > 0) p.arrow(x + 0.5 - bd[0] * 0.15, y + 0.28 - bd[1] * 0.08, x + 0.5 + bd[0] * 0.25, y + 0.28 + bd[1] * 0.14, "ink"); }
      }
      f.out.innerHTML = "Iterasi ke-" + it + ". Setiap iterasi menerapkan Bellman: V(s) = max atas 4 arah [reward + γ·V(berikutnya)]. Nilai menyebar satu kotak per iterasi, dan panah = arah terbaik. γ kecil membuat agen \"tidak sabar\": nilai kotak jauh hampir nol.";
    };
    button(f, "Iterasi", function () { step(); h._draw(); });
    button(f, "10×", function () { for (var k = 0; k < 10; k++) step(); h._draw(); });
    button(f, "Ulang", function () { reset(); h._draw(); });
    reset(); h._draw();
  };

  /* 5.15 Black–Scholes */
  W.bs = function (h) {
    var f = frame(h, "Harga opsi beli (ungu) terhadap harga saham hari ini. Putus-putus = pembayaran saat jatuh tempo max(S − K, 0). K = 100, r = 5%", [{ id: "s", label: "volatilitas σ", min: 0.05, max: 0.8, step: 0.01, v: 0.2 }, { id: "T", label: "waktu T (tahun)", min: 0.05, max: 3, step: 0.05, v: 1 }, { id: "S", label: "harga saham S", min: 60, max: 140, step: 1, v: 100, d: 0 }]);
    var K = 100, r = 0.05, p = mk(f.svg, { x0: 60, x1: 140, y0: 0, y1: 50, h: 300, sx: 10, sy: 10, lx: 20 });
    function C(S, s, T) { var d1 = (Math.log(S / K) + (r + s * s / 2) * T) / (s * Math.sqrt(T)), d2 = d1 - s * Math.sqrt(T); return { c: S * Ncdf(d1) - K * Math.exp(-r * T) * Ncdf(d2), d: Ncdf(d1) }; }
    h._draw = function () {
      var s = f.vals.s, T = f.vals.T, S = f.vals.S, v = C(S, s, T); p.clear();
      p.curve(function (x) { return Math.max(x - K, 0); }, "ink line dash"); p.curve(function (x) { return C(x, s, T).c; }, "s1 line");
      p.seg(S, 0, S, v.c, "guide"); p.dot(S, v.c, "s1 dot");
      f.out.innerHTML = "Harga opsi C = <b>" + fmt(v.c, 2) + "</b>, delta N(d₁) = <b>" + fmt(v.d, 3) + "</b> (saham yang dijual untuk lindung nilai per opsi). Nilai waktu (C dikurangi pembayaran kalau dilaksanakan sekarang) = " + fmt(v.c - Math.max(S - K, 0), 2) + ". Naikkan σ atau T: kurva menjauh dari garis putus-putus, karena ketidakpastian membuat hak (bukan kewajiban) lebih berharga.";
    }; h._draw();
  };
})();
