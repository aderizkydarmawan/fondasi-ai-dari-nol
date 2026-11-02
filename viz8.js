/* Widget diperdalam (W+) lapis 4–5. Semua angka dihitung langsung dari rumusnya di dalam widget. */
(function () {
  var V = window.VIZ, W = V.W, el = V.el, fmt = V.fmt, Plane = V.Plane, frame = V.frame, button = V.button, heads = V.heads, tebak = V.tebak, tx = V.tx;
  function softmax(z, T) { var m = Math.max.apply(null, z), e = z.map(function (v) { return Math.exp((v - m) / T); }), s = e.reduce(function (a, b) { return a + b; }, 0); return e.map(function (v) { return v / s; }); }
  function randn() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function batang(s, x0, y0, w, H, ps, label, kelas) {
    var bw = w / ps.length;
    ps.forEach(function (q, i) { var hh = q * H; el("rect", { x: x0 + i * bw + 4, y: y0 - hh, width: bw - 8, height: hh, "class": (kelas || "s1") + " fill" }, s); tx(s, x0 + i * bw + bw / 2, y0 + 18, label[i], "lbl", "middle"); tx(s, x0 + i * bw + bw / 2, y0 - hh - 6, fmt(q, 3), "tick lbl", "middle"); });
  }

  /* 4.1 Suhu meratakan atau memusatkan peluang */
  W.suhuLembah = function (h) {
    var E = [0, 1, 2, 3];
    var f = frame(h, "Empat lembah dengan energi 0, 1, 2, 3. Peluang bola berada di lembah i sebanding e^(−E/T)", [{ id: "T", label: "suhu T", min: 0.1, max: 10, step: 0.1, v: 1, d: 1 }]);
    var sudah = false;
    tebak(f, "Kalau suhu dibuat sangat tinggi, bola-bola akan…", ["semua di lembah terdalam", "tersebar hampir rata", "semua di lembah tertinggi"], 1, "e^(−E/T) mendekati 1 untuk semua lembah kalau T besar, jadi peluangnya hampir rata. Kalau T kecil, hampir semua bola jatuh ke energi 0.", function () { sudah = true; h._draw(); });
    h._draw = function () {
      var s = f.svg, ps = softmax(E.map(function (e) { return -e; }), f.vals.T); s.setAttribute("viewBox", "0 0 560 300"); s.innerHTML = "";
      var d = "M20 60"; E.forEach(function (e, i) { var x = 40 + i * 130, y = 150 - (3 - e) * 25; d += " Q" + (x + 25) + " " + (y + 30) + " " + (x + 50) + " " + y + " Q" + (x + 85) + " 40 " + (x + 120) + " 60"; });
      batang(s, 30, 270, 500, 110, ps, E.map(function (e) { return "E = " + e; }));
      f.out.innerHTML = "T = " + fmt(f.vals.T, 1) + ": peluang " + ps.map(function (q) { return fmt(q, 3); }).join(", ") + ". " + (f.vals.T < 0.5 ? "Suhu rendah: hampir semuanya di energi terendah." : f.vals.T > 5 ? "Suhu tinggi: hampir rata." : "Di tengah: lembah dalam lebih disukai, tapi lembah lain tetap kebagian.");
    }; h._draw();
  };

  /* 4.2 Softmax dengan suhu: urutan tetap, ketajaman berubah */
  W.softmaxSuhu = function (h) {
    var kata = ["kucing", "anjing", "burung", "meja"], z = [3, 2.5, 1.5, 0.2];
    var f = frame(h, "Logit untuk kata berikutnya setelah \"Saya memelihara seekor …\": 3; 2,5; 1,5; 0,2", [{ id: "T", label: "temperature T", min: 0.05, max: 5, step: 0.05, v: 1 }]);
    var sudah = false;
    tebak(f, "Kalau T dibuat mendekati 0, peluangnya…", ["semua jadi rata", "hampir semua ke \"kucing\"", "urutannya berubah"], 1, "Membagi logit dengan T kecil memperbesar selisihnya, jadi softmax memilih yang terbesar dengan peluang hampir 1. Urutannya tidak pernah berubah. Ini rumus Boltzmann yang sama dengan 4.1, energi diganti −logit.", function () { sudah = true; h._draw(); });
    h._draw = function () {
      var s = f.svg, ps = softmax(z, f.vals.T); s.setAttribute("viewBox", "0 0 560 260"); s.innerHTML = "";
      batang(s, 30, 220, 500, 170, ps, kata);
      f.out.innerHTML = "T = " + fmt(f.vals.T, 2) + ": " + kata.map(function (k, i) { return k + " " + fmt(ps[i], 3); }).join(", ") + ". Jumlahnya selalu 1, urutannya selalu kucing > anjing > burung > meja.";
    }; h._draw();
  };

  /* 4.3 Energi bebas: F = E − T·S, minimum di kompromi */
  W.energiBebas = function (h) {
    var f = frame(h, "Tebakan q selebar σ. Energi rata-rata E = σ²/2 ingin σ kecil, entropi S = ln σ ingin σ besar", [{ id: "s", label: "lebar tebakan σ", min: 0.1, max: 3, step: 0.05, v: 0.5 }, { id: "T", label: "suhu T", min: 0.2, max: 4, step: 0.1, v: 1, d: 1 }]);
    var p = Plane(f.svg, { x0: 0, x1: 3.2, y0: -2, y1: 4.5, h: 300, sx: 0.5, sy: 1, lx: 1, ly: 1 });
    h._draw = function () {
      var T = f.vals.T, sg = f.vals.s; p.clear();
      p.curve(function (x) { return x * x / 2; }, "s1 line", 0.05, 3.2);
      p.curve(function (x) { return -T * Math.log(x); }, "s2 line dash", 0.05, 3.2);
      p.curve(function (x) { return x * x / 2 - T * Math.log(x); }, "ink line", 0.05, 3.2);
      var Fv = sg * sg / 2 - T * Math.log(sg), so = Math.sqrt(T);
      p.dot(sg, Fv, "ink dot"); p.seg(so, -2, so, 4.5, "guide");
      p.text(2.6, 3.7, "E", "lbl s1t"); p.text(2.6, -T * Math.log(2.6) - 0.35, "−TS", "lbl s2t"); p.text(0.25, 4.1, "F = E − TS", "lbl");
      f.out.innerHTML = "σ = " + fmt(sg, 2) + ": E = " + fmt(sg * sg / 2, 3) + ", −TS = " + fmt(-T * Math.log(sg), 3) + ", F = <b>" + fmt(Fv, 3) + "</b>. Minimum F ada di σ = √T = " + fmt(so, 3) + " (garis tegak). Suhu tinggi menggeser kompromi ke tebakan yang lebih lebar.";
    }; h._draw();
  };

  /* 4.5 OU: arus menarik ke tengah, noise menyebar, keduanya seimbang */
  W.ouSeimbang = function (h) {
    var f = frame(h, "dX = −θX dt + σ dW. 400 partikel mulai di X = 3", [{ id: "th", label: "kekuatan arus θ", min: 0, max: 3, step: 0.1, v: 1, d: 1 }, { id: "sg", label: "kekuatan noise σ", min: 0, max: 2, step: 0.1, v: 0.8, d: 1 }]);
    var xs, t;
    function ulang() { xs = []; for (var i = 0; i < 400; i++) xs.push(3); t = 0; }
    ulang();
    button(f, "jalan 1 detik", function () { for (var k = 0; k < 100; k++) { var dt = 0.01; for (var i = 0; i < xs.length; i++) xs[i] += -f.vals.th * xs[i] * dt + f.vals.sg * Math.sqrt(dt) * randn(); } t += 1; h._draw(); });
    button(f, "ulang", function () { ulang(); h._draw(); });
    var p = Plane(f.svg, { x0: -4, x1: 4, y0: 0, y1: 1.2, h: 280, sx: 1, sy: 0.2 });
    h._draw = function () {
      var s = f.svg, th = f.vals.th, sg = f.vals.sg, bins = new Array(32).fill(0), bw = 0.25; p.clear();
      xs.forEach(function (x) { var k = Math.floor((x + 4) / bw); if (k >= 0 && k < 32) bins[k]++; });
      bins.forEach(function (c, k) { var d = c / xs.length / bw; if (d) el("rect", { x: p.X(-4 + k * bw), y: p.Y(Math.min(d, 1.2)), width: p.X(bw) - p.X(0) - 1, height: p.Y(0) - p.Y(Math.min(d, 1.2)), "class": "s1 area" }, s); });
      var vst = th > 0 ? sg * sg / (2 * th) : Infinity;
      if (th > 0 && sg > 0) p.curve(function (x) { return Math.exp(-x * x / (2 * vst)) / Math.sqrt(2 * Math.PI * vst); }, "s2 line");
      var m = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length, v = xs.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / xs.length;
      f.out.innerHTML = "t = " + t + " detik. Rata-rata " + fmt(m, 2) + ", varians " + fmt(v, 3) + ". " + (th > 0 ? "Keseimbangan (garis biru): rata-rata 0, varians σ²/(2θ) = <b>" + fmt(vst, 3) + "</b>." : "Tanpa arus (θ = 0), sebarannya terus melebar dan tidak pernah seimbang.");
    }; h._draw();
  };

  /* 4.6 Kepadatan melebar, luasnya tetap 1, arus menggeser puncak */
  W.panasArus = function (h) {
    var f = frame(h, "Kepadatan partikel yang mulai di 0: melebar karena difusi D, bergeser karena arus v", [{ id: "t", label: "waktu t", min: 0.05, max: 4, step: 0.05, v: 0.5 }, { id: "D", label: "difusi D", min: 0.1, max: 1, step: 0.05, v: 0.5 }, { id: "v", label: "arus v", min: -1, max: 1, step: 0.1, v: 0, d: 1 }]);
    var p = Plane(f.svg, { x0: -6, x1: 6, y0: 0, y1: 1.2, h: 280, sx: 1, sy: 0.2 });
    h._draw = function () {
      var t = f.vals.t, D = f.vals.D, v = f.vals.v, va = 2 * D * t, mu = v * t; p.clear();
      var g = function (x) { return Math.exp(-(x - mu) * (x - mu) / (2 * va)) / Math.sqrt(2 * Math.PI * va); };
      var d = "M" + p.X(-6) + " " + p.Y(0); for (var x = -6; x <= 6.001; x += 0.05) d += "L" + p.X(x).toFixed(1) + " " + p.Y(Math.min(g(x), 1.25)).toFixed(1); d += "L" + p.X(6) + " " + p.Y(0) + "Z";
      el("path", { d: d, "class": "s1 area" }, f.svg); p.curve(g, "s1 line");
      var L = 0; for (x = -30; x < 30; x += 0.01) L += g(x + 0.005) * 0.01;
      p.seg(mu, 0, mu, 1.2, "guide");
      f.out.innerHTML = "Puncak di v·t = " + fmt(mu, 2) + ", varians 2Dt = " + fmt(va, 3) + ", tinggi puncak " + fmt(g(mu), 3) + ". Luas di bawah kurva: <b>" + fmt(L, 4) + "</b>, selalu 1: partikel tidak hilang, hanya menyebar.";
    }; h._draw();
  };

  /* 4.7 Bidang fase: Euler spiral keluar, leapfrog tetap di elips */
  W.bidangFase = function (h) {
    var f = frame(h, "Pegas: posisi q, momentum p, energi H = (q² + p²)/2. Mulai di q = 1, p = 0", [{ id: "dt", label: "langkah dt", min: 0.05, max: 0.5, step: 0.05, v: 0.2 }]);
    var cara = "leapfrog", sudah = false;
    var bt = button(f, "ganti ke Euler", function () { cara = cara === "leapfrog" ? "Euler" : "leapfrog"; bt.textContent = "ganti ke " + (cara === "leapfrog" ? "Euler" : "leapfrog"); h._draw(); });
    tebak(f, "Di bidang posisi–momentum, lintasan pegas yang sempurna berbentuk…", ["garis lurus", "lingkaran/elips yang tertutup", "spiral ke tengah"], 1, "Energi tetap berarti q² + p² tetap, jadi titiknya berputar di lingkaran yang sama selamanya. Euler keluar dari lingkaran (energinya naik); leapfrog tetap di dekatnya.", function () { sudah = true; h._draw(); });
    var P = Plane(f.svg, { x0: -2.2, x1: 2.2, y0: -2.2, y1: 2.2, h: 330, sx: 0.5, sy: 0.5, lx: 1, ly: 1 });
    h._draw = function () {
      var dt = f.vals.dt, q = 1, p = 0, d = "M" + P.X(q) + " " + P.Y(p), n = Math.round(6 * Math.PI / dt); P.clear();
      if (sudah) { var c = ""; for (var a = 0; a <= 64; a++) c += (a ? "L" : "M") + P.X(Math.cos(a / 64 * 2 * Math.PI)).toFixed(1) + " " + P.Y(Math.sin(a / 64 * 2 * Math.PI)).toFixed(1); el("path", { d: c, "class": "faint line" }, f.svg); }
      for (var i = 0; i < n; i++) {
        if (cara === "Euler") { var q2 = q + dt * p, p2 = p - dt * q; q = q2; p = p2; }
        else { p -= dt / 2 * q; q += dt * p; p -= dt / 2 * q; }
        if (Math.abs(q) > 2.2 || Math.abs(p) > 2.2) break;
        d += "L" + P.X(q).toFixed(1) + " " + P.Y(p).toFixed(1);
      }
      el("path", { d: d, "class": (cara === "Euler" ? "s2" : "s1") + " line" }, f.svg);
      P.text(2.0, 0.15, "q", "lbl"); P.text(0.1, 2.0, "p", "lbl");
      f.out.innerHTML = cara + ", dt = " + fmt(dt, 2) + ", tiga putaran: energi awal 0,5, energi akhir <b>" + fmt((q * q + p * p) / 2, 3) + "</b>. " + (cara === "Euler" ? "Euler menambah energi setiap langkah (dikali 1 + dt²), sehingga spiralnya membesar." : "Leapfrog tidak menyimpan energi persis, tapi selisihnya tetap kecil dan tidak menumpuk.");
    }; h._draw();
  };

  /* 5.1 Regresi: total luas persegi galat */
  W.regresiPersegi = function (h) {
    var X = [1, 2, 3, 4, 5], Y = [1.5, 1.8, 3.6, 3.8, 5.2];
    var f = frame(h, "Seret dua titik putih untuk memindah garis. Setiap galat digambar sebagai persegi", []);
    var A = [0.5, 1], B = [5.5, 4];
    var p = Plane(f.svg, { x0: 0, x1: 6, y0: 0, y1: 6.5, h: 330, sx: 1, sy: 1 });
    button(f, "garis terbaik (kuadrat terkecil)", function () { var mx = 3, my = Y.reduce(function (a, b) { return a + b; }, 0) / 5, sxy = 0, sxx = 0; X.forEach(function (x, i) { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) * (x - mx); }); var m = sxy / sxx, b = my - m * mx; A = [0.5, m * 0.5 + b]; B = [5.5, m * 5.5 + b]; h._draw(); });
    V.draggable(f.svg, p, function () { return [A, B]; }, function (i, q) { var t = [i ? 5.5 : 0.5, Math.max(0, Math.min(6.5, Math.round(q[1] * 10) / 10))]; if (i) B = t; else A = t; h._draw(); });
    h._draw = function () {
      var s = f.svg, m = (B[1] - A[1]) / (B[0] - A[0]), b = A[1] - m * A[0], tot = 0; p.clear();
      X.forEach(function (x, i) { var yh = m * x + b, e = Y[i] - yh, w = Math.abs(p.Y(Y[i]) - p.Y(yh)); tot += e * e; el("rect", { x: p.X(x), y: Math.min(p.Y(Y[i]), p.Y(yh)), width: w, height: w, "class": (e >= 0 ? "s1" : "s2") + " area" }, s); });
      p.curve(function (x) { return m * x + b; }, "ink line");
      X.forEach(function (x, i) { p.dot(x, Y[i], "s1 dot", 5); });
      el("circle", { cx: p.X(A[0]), cy: p.Y(A[1]), r: 9, "class": "ink dot handle" }, s); el("circle", { cx: p.X(B[0]), cy: p.Y(B[1]), r: 9, "class": "ink dot handle" }, s);
      f.out.innerHTML = "Garis y = " + fmt(m, 3) + "x + " + fmt(b, 3) + ". Total luas persegi (jumlah kuadrat galat) = <b>" + fmt(tot, 3) + "</b>. Garis kuadrat terkecil untuk data ini y = 0,94x + 0,36, totalnya 0,532, tidak ada garis lain yang lebih kecil.";
    }; h._draw();
  };

  /* 5.2 Belahan yang paling memurnikan (Gini) */
  W.giniBelah = function (h) {
    var pts = [[0.5, 0], [1.2, 0], [1.8, 0], [2.6, 0], [3.1, 1], [3.4, 0], [3.7, 0], [4.2, 1], [4.8, 1], [5.5, 1], [6.1, 1]];
    var f = frame(h, "Titik ungu = kelas 0, biru = kelas 1. Geser garis belah; makin kecil Gini, makin murni", [{ id: "c", label: "belah di x =", min: 0, max: 6.5, step: 0.1, v: 1.5 }]);
    var sudah = false;
    tebak(f, "Garis belah terbaik ada di sekitar…", ["x = 1,5", "x = 2,9", "x = 4"], 2, "Di x = 4 (antara 3,7 dan 4,2) kiri berisi 6 ungu + 1 biru, kanan 4 biru murni: Gini 0,156. Di x = 2,9 kiri murni tapi kanan masih tercampur 2 ungu + 5 biru (Gini 0,260). Di x = 1,5 Gini 0,404.", function () { sudah = true; h._draw(); });
    function gini(c) { var L = [0, 0], R = [0, 0]; pts.forEach(function (q) { (q[0] < c ? L : R)[q[1]]++; }); function g(a) { var n = a[0] + a[1]; return n ? 1 - (a[0] / n) * (a[0] / n) - (a[1] / n) * (a[1] / n) : 0; } var nl = L[0] + L[1], nr = R[0] + R[1]; return { g: (nl * g(L) + nr * g(R)) / pts.length, L: L, R: R }; }
    var p = Plane(f.svg, { x0: 0, x1: 6.5, y0: -0.1, y1: 0.6, h: 280, sx: 0.5, sy: 0.1, lx: 1 });
    h._draw = function () {
      var c = f.vals.c, r = gini(c); p.clear();
      if (sudah) { var d = ""; for (var x = 0; x <= 6.5; x += 0.05) d += (d ? "L" : "M") + p.X(x).toFixed(1) + " " + p.Y(gini(x).g).toFixed(1); el("path", { d: d, "class": "faint line" }, f.svg); }
      pts.forEach(function (q) { p.dot(q[0], 0.02, q[1] ? "s2 dot" : "s1 dot", 7); });
      p.seg(c, -0.1, c, 0.6, "ink line"); p.dot(c, r.g, "ink dot", 5);
      f.out.innerHTML = "Kiri: " + r.L[0] + " ungu, " + r.L[1] + " biru. Kanan: " + r.R[0] + " ungu, " + r.R[1] + " biru. Gini berbobot = <b>" + fmt(r.g, 3) + "</b> (titik hitam)." + (sudah ? " Garis tipis = Gini untuk setiap posisi belahan; pohon memilih titik terendahnya." : "");
    }; h._draw();
  };

  /* 5.3 k-means satu langkah demi satu langkah, inersia selalu turun */
  W.kmeansLangkah = function (h) {
    var f = frame(h, "Dua langkah bergantian: (1) setiap titik ikut pusat terdekat, (2) pusat pindah ke rata-rata anggotanya", []);
    var data = [], C, lab, fase, log;
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    [[1.5, 1.5], [4.5, 2], [3, 4.5]].forEach(function (c) { for (var i = 0; i < 12; i++) data.push([c[0] + (rnd() - 0.5) * 2, c[1] + (rnd() - 0.5) * 2]); });
    function ulang() { C = [[0.5, 4.8], [1, 4.2], [5.5, 0.5]]; lab = data.map(function () { return -1; }); fase = 0; log = []; }
    ulang();
    function inersia() { return data.reduce(function (a, q, i) { var c = C[lab[i] < 0 ? 0 : lab[i]]; return a + (q[0] - c[0]) * (q[0] - c[0]) + (q[1] - c[1]) * (q[1] - c[1]); }, 0); }
    button(f, "satu langkah", function () {
      if (fase === 0) lab = data.map(function (q) { var b = 0, bd = 1e9; C.forEach(function (c, k) { var d = (q[0] - c[0]) * (q[0] - c[0]) + (q[1] - c[1]) * (q[1] - c[1]); if (d < bd) { bd = d; b = k; } }); return b; });
      else C = C.map(function (c, k) { var n = 0, sx = 0, sy = 0; data.forEach(function (q, i) { if (lab[i] === k) { n++; sx += q[0]; sy += q[1]; } }); return n ? [sx / n, sy / n] : c; });
      log.push(fmt(inersia(), 2)); fase = 1 - fase; h._draw();
    });
    button(f, "ulang", function () { ulang(); h._draw(); });
    var p = Plane(f.svg, { x0: 0, x1: 6, y0: 0, y1: 6, h: 320, sx: 1, sy: 1 });
    h._draw = function () {
      var kls = ["s1", "s2", "ink"]; p.clear();
      data.forEach(function (q, i) { p.dot(q[0], q[1], lab[i] < 0 ? "faint dot" : kls[lab[i]] + " dot", 4.5); });
      C.forEach(function (c, k) { el("rect", { x: p.X(c[0]) - 8, y: p.Y(c[1]) - 8, width: 16, height: 16, transform: "rotate(45 " + p.X(c[0]) + " " + p.Y(c[1]) + ")", "class": kls[k] + " fill" }, f.svg); });
      f.out.innerHTML = "Langkah berikutnya: " + (fase === 0 ? "(1) tentukan anggota" : "(2) geser pusat") + ". Inersia (jumlah kuadrat jarak ke pusatnya) tercatat: " + (log.length ? log.join(" → ") : "belum ada") + ". Angkanya tidak pernah naik, jadi algoritmanya pasti berhenti.";
    }; h._draw();
  };

  /* 5.5 Medan penerimaan membesar lapis demi lapis */
  W.medanTerima = function (h) {
    var f = frame(h, "Konvolusi 3×3 ditumpuk. Pilih lapis, lalu lihat berapa piksel input yang \"dilihat\" satu sel", []);
    var L = 1;
    [1, 2, 3].forEach(function (k) { button(f, "sel di lapis " + k, function () { L = k; h._draw(); }); });
    h._draw = function () {
      var s = f.svg, n = 9, u = 28, ox = 150, oy = 20, r = L, c = 4; s.setAttribute("viewBox", "0 0 560 290"); s.innerHTML = "";
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) { var on = Math.abs(i - c) <= r && Math.abs(j - c) <= r; el("rect", { x: ox + j * u, y: oy + i * u, width: u - 2, height: u - 2, "class": on ? "s1 area" : "cell" }, s); }
      el("rect", { x: ox + c * u, y: oy + c * u, width: u - 2, height: u - 2, "class": "s2 fill" }, s);
      var w = 2 * r + 1;
      f.out.innerHTML = "Satu sel di lapis " + L + " bergantung pada <b>" + w + "×" + w + " = " + w * w + "</b> piksel input (kotak ungu). Setiap lapis 3×3 menambah satu piksel di setiap sisi, jadi lapis awal melihat tepi kecil dan lapis dalam melihat sudut, lalu bentuk utuh.";
    }; h._draw();
  };

  /* 5.6 Sinyal dikali w berulang: meledak atau lenyap */
  W.vanishTebak = function (h) {
    var f = frame(h, "Sinyal dikali bobot w yang sama di setiap langkah waktu (sumbu tegak: skala log)", [{ id: "w", label: "w", min: 0.5, max: 1.5, step: 0.01, v: 0.9 }]);
    var sudah = false, lstm = false;
    tebak(f, "Dengan w = 0,9, setelah 30 langkah sinyalnya tinggal…", ["sekitar 0,9", "sekitar 0,04", "sekitar 27"], 1, "0,9³⁰ = 0,042. Sedikit di bawah 1 sudah cukup membuat sinyal hampir lenyap. Dengan w = 1,1, sinyalnya jadi 1,1³⁰ = 17,4.", function () { sudah = true; h._draw(); });
    var bl = button(f, "tampilkan jalur LSTM", function () { lstm = !lstm; bl.textContent = lstm ? "sembunyikan jalur LSTM" : "tampilkan jalur LSTM"; h._draw(); });
    var p = Plane(f.svg, { x0: 0, x1: 31, y0: -3, y1: 2, h: 280, sx: 5, sy: 1 });
    h._draw = function () {
      var w = f.vals.w, s = f.svg; p.clear();
      p.text(0.3, 1.7, "10²", "tick lbl"); p.text(0.3, -2.8, "10⁻³", "tick lbl");
      if (sudah || w !== 0.9) p.curve(function (t) { return t * Math.log10(w); }, "s1 line", 0, 30);
      if (lstm) p.curve(function () { return Math.log10(0.98) * 0; }, "s2 line dash", 0, 30);
      f.out.innerHTML = (sudah || w !== 0.9) ? "w = " + fmt(w, 2) + ": setelah 30 langkah sinyalnya " + fmt(Math.pow(w, 30), 4) + " kali semula. " + (lstm ? "Garis biru: jalur sel LSTM. Gerbang lupa yang dekat 1 dan penjumlahan (bukan perkalian berulang) membuat sinyalnya bertahan. " : "") + "Ini nilai eigen |λ| dari 2.7: di bawah 1 lenyap, di atas 1 meledak." : "Tebak dulu.";
    }; h._draw();
  };

  /* 5.8 SSM: satu kartu ingatan yang diperbarui, Mamba memilih apa yang dicatat */
  W.ssmKartu = function (h) {
    var x = [0, 0, 5, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 0, 0, 1, 0, 0];
    var f = frame(h, "h baru = a·h lama + (1 − a)·x. Pita atas = input, garis = isi kartu ingatan h", [{ id: "a", label: "a (dekat 1 = susah lupa)", min: 0, max: 0.99, step: 0.01, v: 0.8 }]);
    var pilih = false;
    var bp = button(f, "mode Mamba: hanya catat input penting (≥ 4)", function () { pilih = !pilih; bp.textContent = pilih ? "mode SSM biasa" : "mode Mamba: hanya catat input penting (≥ 4)"; h._draw(); });
    var p = Plane(f.svg, { x0: -0.5, x1: 17.5, y0: 0, y1: 6, h: 280, sx: 1, sy: 1, lx: 2 });
    h._draw = function () {
      var a = f.vals.a, hh = 0, H = []; p.clear();
      x.forEach(function (v, t) { var at = pilih ? (v >= 4 ? 0 : 1) : a; hh = at * hh + (1 - at) * v; H.push(hh); if (v) { p.seg(t, 0, t, v, "s2 line thick"); } });
      var d = ""; H.forEach(function (v, t) { d += (t ? "L" : "M") + p.X(t).toFixed(1) + " " + p.Y(v).toFixed(1); p.dot(t, v, "s1 dot", 3.5); }); el("path", { d: d, "class": "s1 line" }, f.svg);
      f.out.innerHTML = pilih ? "Mamba: untuk input penting a = 0 (timpa kartu dengan input), untuk sisanya a = 1 (jangan ubah). Kartu menyimpan 5 lalu 4 tanpa memudar, dan angka kecil 1 diabaikan. Nilai akhir h = <b>" + fmt(hh, 3) + "</b>." : "a = " + fmt(a, 2) + ": nilai akhir h = <b>" + fmt(hh, 3) + "</b>. a kecil: kartu cepat lupa dan hanya mengikuti input terakhir. a dekat 1: kartu ingat lama, tapi setiap input tercampur samar.";
    }; h._draw();
  };

  /* 5.10 Kode berupa titik vs awan */
  W.vaeAwan = function (h) {
    var f = frame(h, "Ruang laten 2D. Lingkaran (kiri) dan persegi (kanan) punya kode. Seret titik penjelajah", []);
    var awan = false, pr = [3, 3];
    var bt = button(f, "ganti titik dengan awan (VAE)", function () { awan = !awan; bt.textContent = awan ? "kembali ke titik (autoencoder biasa)" : "ganti titik dengan awan (VAE)"; h._draw(); });
    var p = Plane(f.svg, { x0: 0, x1: 10, y0: 0, y1: 6, h: 300, sx: 1, sy: 1 });
    V.draggable(f.svg, p, function () { return [pr]; }, function (i, q) { pr = [Math.max(0, Math.min(6, q[0])), Math.max(0, Math.min(6, q[1]))]; h._draw(); });
    var A = [1.5, 3], B = [4.5, 3];
    h._draw = function () {
      var s = f.svg; p.clear();
      var dA = Math.hypot(pr[0] - A[0], pr[1] - A[1]), dB = Math.hypot(pr[0] - B[0], pr[1] - B[1]);
      var r = awan ? 1.8 : 0.35, dikenal = Math.min(dA, dB) < r || (awan && pr[0] > A[0] && pr[0] < B[0] && Math.abs(pr[1] - 3) < 1.4);
      [A, B].forEach(function (c, k) { if (awan) el("ellipse", { cx: p.X(c[0]), cy: p.Y(c[1]), rx: p.X(1.8) - p.X(0), ry: p.Y(0) - p.Y(1.6), "class": (k ? "s2" : "s1") + " area" }, s); p.dot(c[0], c[1], k ? "s2 dot" : "s1 dot", 6); });
      el("circle", { cx: p.X(pr[0]), cy: p.Y(pr[1]), r: 9, "class": "ink dot handle" }, s);
      /* hasil dekoder di kanan: bentuk antara lingkaran dan persegi kalau dikenal, coretan acak kalau tidak */
      var cx = p.X(8.2), cy = p.Y(3), R = 55, t = Math.max(0, Math.min(1, (pr[0] - A[0]) / (B[0] - A[0]))), d = "";
      if (dikenal) { for (var i = 0; i <= 64; i++) { var a = i / 64 * 2 * Math.PI, c = Math.cos(a), sn = Math.sin(a), k = 1 / Math.max(Math.abs(c), Math.abs(sn)), rr = R * ((1 - t) + t * k * 0.8); d += (i ? "L" : "M") + (cx + rr * c).toFixed(1) + " " + (cy + rr * sn).toFixed(1); } el("path", { d: d, "class": "ink line" }, s); }
      else { var seed = Math.round(pr[0] * 37 + pr[1] * 91); for (var j = 0; j < 14; j++) { seed = (seed * 16807 + 11) % 2147483647; var u = seed / 2147483647; seed = (seed * 16807 + 11) % 2147483647; var v = seed / 2147483647; d += (j ? "L" : "M") + (cx + (u - 0.5) * 120).toFixed(1) + " " + (cy + (v - 0.5) * 120).toFixed(1); } el("path", { d: d, "class": "faint line" }, s); }
      tx(s, cx, p.Y(0.25), "hasil dekoder", "lbl", "middle");
      f.out.innerHTML = (dikenal ? "Daerah ini pernah dilatih, jadi dekodernya menghasilkan bentuk yang masuk akal" + (t > 0.05 && t < 0.95 ? ", di antara lingkaran dan persegi." : ".") : "Daerah ini tidak pernah dilatih, jadi hasilnya coretan.") + " " + (awan ? "Dengan awan, setiap kode menutupi wilayah, dan wilayah di antara dua kode ikut terlatih." : "Dengan titik, hanya dua titik kecil yang dilatih. Celah di antaranya kosong.") + " (Gambar ini ilustrasi gagasannya, bukan model yang dilatih.)";
    }; h._draw();
  };

  /* 5.11 GAN 1D: D dan G bergantian */
  W.ganLangkah = function (h) {
    var f = frame(h, "Data asli: normal di 3 (ungu). Generator: normal di μ (biru). D(x) = peluang x asli (garis hitam)", []);
    var mu = -1, fase = 0, log = [];
    var sg = 0.6;
    function pd(x, m) { return Math.exp(-(x - m) * (x - m) / (2 * sg * sg)) / (sg * Math.sqrt(2 * Math.PI)); }
    var Dmu = null;
    function D(x) { var a = pd(x, 3), b = pd(x, Dmu); return a / (a + b + 1e-300); }
    button(f, "satu langkah", function () {
      if (fase === 0) { Dmu = mu; log.push("D belajar membedakan"); }
      else { /* G menaikkan rata-rata log D(G(z)): gradien dihitung numerik dari D yang sekarang */
        var g = 0, n = 0; for (var z = -3; z <= 3; z += 0.05) { var x = mu + sg * z, w = Math.exp(-z * z / 2), e = 1e-3; g += w * (Math.log(D(x + e) + 1e-12) - Math.log(D(x - e) + 1e-12)) / (2 * e); n += w; }
        g /= n; var step = Math.max(-1.2, Math.min(1.2, 0.4 * g)); mu += step; log.push("G geser " + fmt(step, 2));
      }
      fase = 1 - fase; h._draw();
    });
    button(f, "ulang", function () { mu = -1; fase = 0; log = []; Dmu = null; h._draw(); });
    var p = Plane(f.svg, { x0: -3, x1: 6, y0: 0, y1: 1.1, h: 280, sx: 1, sy: 0.2 });
    h._draw = function () {
      p.clear();
      p.curve(function (x) { return pd(x, 3) * 0.9; }, "s1 line"); p.curve(function (x) { return pd(x, mu) * 0.9; }, "s2 line dash");
      if (Dmu !== null) p.curve(D, "ink line");
      f.out.innerHTML = "μ generator = <b>" + fmt(mu, 2) + "</b>. Langkah berikutnya: " + (fase === 0 ? "discriminator" : "generator") + ". " + (log.length ? log.slice(-4).join(" → ") + ". " : "") + "D naik di tempat data asli lebih padat; G bergeser ke arah D naik. Ketika μ = 3, D = 0,5 di mana-mana: D tidak bisa membedakan lagi.";
    }; h._draw();
  };

  /* 5.13 Satu tebakan token, lalu diulang, dengan temperature */
  W.tokenSuhu = function (h) {
    var lanjut = { "saya": [["suka", 2.2], ["makan", 1.6], ["pergi", 1.2], ["tidur", 0.6], ["kucing", -0.5]], "suka": [["makan", 2.0], ["kopi", 1.7], ["kamu", 1.0], ["tidur", 0.4], ["saya", -0.8]], "makan": [["nasi", 2.4], ["roti", 1.5], ["kopi", 0.3], ["saya", -0.3], ["tidur", -0.6]], "pergi": [["ke", 2.6], ["tidur", 0.8], ["makan", 0.6], ["kamu", 0], ["nasi", -1]], "ke": [["pasar", 2.0], ["kantor", 1.8], ["rumah", 1.6], ["nasi", -1], ["kopi", -1.2]] };
    var umum = [["dan", 1.2], ["lalu", 1.0], ["saya", 0.8], ["tidur", 0.3], ["kopi", 0.1]];
    var f = frame(h, "Model memberi peluang untuk 5 kandidat kata berikutnya. Pilih sendiri, atau biarkan diundi", [{ id: "T", label: "temperature", min: 0.1, max: 3, step: 0.1, v: 1, d: 1 }]);
    var kal = ["saya"];
    button(f, "undi satu kata", function () { var c = kand(), ps = softmax(c.map(function (q) { return q[1]; }), f.vals.T), u = Math.random(), k = 0; while (k < ps.length - 1 && u > ps[k]) { u -= ps[k]; k++; } kal.push(c[k][0]); h._draw(); });
    button(f, "mulai lagi", function () { kal = ["saya"]; h._draw(); });
    function kand() { return lanjut[kal[kal.length - 1]] || umum; }
    h._draw = function () {
      var s = f.svg, c = kand(), ps = softmax(c.map(function (q) { return q[1]; }), f.vals.T); s.setAttribute("viewBox", "0 0 560 270"); s.innerHTML = "";
      tx(s, 20, 28, "\"" + kal.join(" ") + " …\"", "lbl");
      ps.forEach(function (q, i) {
        var y = 52 + i * 42, g = el("g", { tabindex: 0, role: "button", "aria-label": "pilih kata " + c[i][0] }, s); g.style.cursor = "pointer";
        el("rect", { x: 120, y: y, width: Math.max(2, q * 400), height: 30, rx: 4, "class": "s1 fill" }, g);
        tx(g, 110, y + 21, c[i][0], "lbl", "end"); tx(g, 128 + q * 400, y + 21, fmt(q, 3), "lbl");
        function pilih() { kal.push(c[i][0]); h._draw(); }
        g.addEventListener("click", pilih); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pilih(); } });
      });
      f.out.innerHTML = "Klik batang untuk memilih kata sendiri. Setiap kata baru menjadi konteks untuk tebakan berikutnya; itulah seluruh cara kerja LLM, diulang ribuan kali. Temperature rendah hampir selalu memilih kata teratas, temperature tinggi lebih nekat (rumus yang sama dengan 4.2).";
    }; h._draw();
  };

  /* 5.14 Nilai merambat mundur dari hadiah (iterasi Bellman) */
  W.bellmanLangkah = function (h) {
    var f = frame(h, "Kotak bintang memberi hadiah +1. Setiap iterasi: nilai kotak = γ × nilai tetangga terbaik (γ = 0,9). Kotak gelap = tembok", []);
    var n = 5, G = [0, 4], wall = { "1,1": 1, "2,1": 1, "2,3": 1, "3,3": 1 }, Vv, it, sudah = false;
    function ulang() { Vv = []; for (var i = 0; i < n; i++) { Vv.push(new Array(n).fill(0)); } it = 0; }
    ulang();
    function iterasi() { var B = Vv.map(function (r) { return r.slice(); }); for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) { if (wall[i + "," + j]) continue; if (i === G[0] && j === G[1]) { B[i][j] = 1; continue; } var best = 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var a = i + d[0], b = j + d[1]; if (a >= 0 && a < n && b >= 0 && b < n && !wall[a + "," + b]) best = Math.max(best, Vv[a][b]); }); B[i][j] = 0.9 * best; } Vv = B; it++; h._draw(); }
    button(f, "satu iterasi Bellman", iterasi); button(f, "ulang", function () { ulang(); h._draw(); });
    tebak(f, "Setelah iterasi pertama hanya kotak bintang yang bernilai 1. Pada iterasi kedua, kotak mana yang menyala?", ["semua kotak sekaligus", "hanya tetangga langsung bintang", "kotak pojok kiri bawah"], 1, "Nilai hanya bisa datang dari tetangga, jadi setiap iterasi nilainya merambat satu kotak lebih jauh: 1 → 0,9 → 0,81 → …", function () { sudah = true; });
    h._draw = function () {
      var s = f.svg, u = 52, ox = 150, oy = 15; s.setAttribute("viewBox", "0 0 560 290"); s.innerHTML = "";
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
        var x = ox + j * u, y = oy + i * u, w = wall[i + "," + j];
        var r = el("rect", { x: x, y: y, width: u - 3, height: u - 3, rx: 4, "class": w ? "ink fill" : "s1 fill" }, s);
        if (!w) r.setAttribute("fill-opacity", 0.08 + 0.85 * Vv[i][j]);
        if (!w) tx(s, x + u / 2 - 1, y + u / 2 + 5, i === G[0] && j === G[1] ? "★ " + fmt(Vv[i][j], 2) : fmt(Vv[i][j], 2), "lbl", "middle");
      }
      f.out.innerHTML = "Iterasi ke-" + it + ". Nilai tiap kotak = hadiah yang bisa diharapkan kalau bergerak terbaik dari sana. Panah kebijakan cukup menunjuk ke tetangga bernilai paling tinggi.";
    }; h._draw();
  };
})();
