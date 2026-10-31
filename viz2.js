/* Widget Lapis 2 ke atas. Memakai alat bantu dari viz.js (window.VIZ). Setiap widget memperagakan inti pelajarannya. */
(function () {
  var V = window.VIZ, W = V.W, Plane = V.Plane, frame = V.frame, button = V.button, el = V.el, fmt = V.fmt, heads = V.heads, draggable = V.draggable, clamp = V.clamp;
  /* acak yang bisa diulang (seed tetap), supaya gambar sama setiap dibuka */
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function poly(p, pts, cls) { return el("polygon", { points: pts.map(function (q) { return p.X(q[0]).toFixed(1) + "," + p.Y(q[1]).toFixed(1); }).join(" "), "class": cls }, p.svg || p._svg); }
  function rect(p, svg, x0, y0, x1, y1, cls) { return el("rect", { x: p.X(Math.min(x0, x1)), y: p.Y(Math.max(y0, y1)), width: Math.abs(p.X(x1) - p.X(x0)), height: Math.abs(p.Y(y1) - p.Y(y0)), "class": cls }, svg); }
  /* grup yang dipotong ke bidang gambar (margin 34 px seperti Plane) */
  function clipG(p, svg) { var id = "cg" + Math.random().toString(36).slice(2, 8), d = el("defs", {}, svg); el("rect", { x: 34, y: 34, width: p.W - 68, height: p.H - 68 }, el("clipPath", { id: id }, d)); return el("g", { "clip-path": "url(#" + id + ")" }, svg); }
  function preset(f, list, apply) {
    list.forEach(function (it) { button(f, it[0], function () { apply(it[1]); }); });
  }
  function setVals(f, o) {
    [].forEach.call(f.ctl.querySelectorAll("label"), function (lab) {
      var inp = lab.querySelector("input"), key = lab.getAttribute("data-k");
      if (key in o) { inp.value = o[key]; inp.dispatchEvent(new Event("input")); }
    });
  }
  function keyLabels(f, keys) { [].forEach.call(f.ctl.querySelectorAll("label"), function (lab, i) { lab.setAttribute("data-k", keys[i]); }); }

  /* 2.1 garis potong menjadi garis singgung */
  W.deriv = function (h) {
    var f = frame(h, "Kecilkan h: garis potong (ungu) mendekati garis singgung (biru muda putus-putus)", [{ id: "x", label: "titik x", min: -2, max: 2, step: 0.1, v: 1.5 }, { id: "h", label: "selang h", min: 0.01, max: 1.5, step: 0.01, v: 1 }]);
    var p = Plane(f.svg, { x0: -2.6, x1: 3.2, y0: -4, y1: 6, h: 320, sx: 1, sy: 1, ly: 2 });
    var F = function (x) { return x * x * x - 3 * x; }, D = function (x) { return 3 * x * x - 3; };
    h._draw = function () {
      var x = f.vals.x, d = f.vals.h, m = (F(x + d) - F(x)) / d, t = D(x); p.clear();
      p.curve(F, "ink line");
      p.curve(function (u) { return F(x) + t * (u - x); }, "s2 line dash");
      p.curve(function (u) { return F(x) + m * (u - x); }, "s1 line");
      p.dot(x, F(x), "ink dot"); p.dot(x + d, F(x + d), "s1 dot");
      f.out.innerHTML = "f(x) = x³ − 3x. Kemiringan garis potong = (f(x+h) − f(x)) ÷ h = <b>" + fmt(m, 3) + "</b>. Turunan sebenarnya f'(x) = 3x² − 3 = <b>" + fmt(t, 3) + "</b>. Selisihnya " + fmt(Math.abs(m - t), 3) + ". " + (Math.abs(t) < 0.05 ? "Di sini f' ≈ 0: puncak atau lembah." : t > 0 ? "f' positif: fungsi sedang naik." : "f' negatif: fungsi sedang turun.");
    }; h._draw();
  };

  /* 2.2 aturan rantai: tiga kemiringan */
  W.chain = function (h) {
    var f = frame(h, "Tiga grafik, tiga kemiringan. Kemiringan rantai = hasil kali dua kemiringan lokal", [{ id: "x", label: "x", min: -1.5, max: 1.5, step: 0.1, v: 1 }]);
    var host = f.svg.parentNode, svgs = [f.svg];
    for (var i = 0; i < 2; i++) { var s = el("svg", { role: "img" }); host.insertBefore(s, f.out); svgs.push(s); }
    svgs.forEach(function (s) { s.style.maxWidth = "560px"; });
    svgs.forEach(function (s) { s.style.marginTop = "6px"; });
    var P1 = Plane(svgs[0], { x0: -1.6, x1: 1.6, y0: -3, y1: 5, h: 200, sx: 0.5, sy: 1, lx: 1, ly: 2 });
    var P2 = Plane(svgs[1], { x0: -3, x1: 5, y0: -1, y1: 17, h: 200, sx: 1, sy: 2, ly: 4 });
    var P3 = Plane(svgs[2], { x0: -1.6, x1: 1.6, y0: -1, y1: 17, h: 200, sx: 0.5, sy: 2, lx: 1, ly: 4 });
    P1.svgEl = svgs[0]; P2.svgEl = svgs[1]; P3.svgEl = svgs[2];
    svgs[0].setAttribute("aria-label", "u = 2x + 1 terhadap x"); svgs[1].setAttribute("aria-label", "y = u² terhadap u"); svgs[2].setAttribute("aria-label", "y terhadap x");
    function tan(P, F, x0, m, lbl) { P.clear(); P.curve(F, "ink line"); P.curve(function (u) { return F(x0) + m * (u - x0); }, "s1 line"); P.dot(x0, F(x0), "s1 dot"); var t = el("text", { x: 36, y: 18, "class": "lbl" }, P.svgEl); t.textContent = lbl; }
    h._draw = function () {
      var x = f.vals.x, u = 2 * x + 1, y = u * u;
      tan(P1, function (t) { return 2 * t + 1; }, x, 2, "u = 2x + 1   kemiringan du/dx = 2");
      tan(P2, function (t) { return t * t; }, u, 2 * u, "y = u²   kemiringan dy/du = 2u = " + fmt(2 * u));
      tan(P3, function (t) { return (2 * t + 1) * (2 * t + 1); }, x, 4 * u, "y = (2x+1)²   kemiringan dy/dx = " + fmt(4 * u));
      f.out.innerHTML = "x = " + fmt(x) + " → u = " + fmt(u) + " → y = " + fmt(y) + ". Aturan rantai: dy/du × du/dx = " + fmt(2 * u) + " × 2 = <b>" + fmt(4 * u) + "</b>, sama dengan kemiringan grafik ketiga.";
    }; h._draw();
  };

  /* 2.3 gradien di peta kontur */
  W.grad = function (h) {
    var f = frame(h, "Seret titik. Panah ungu = −∇f, arah turun paling curam. Tekan Langkah untuk menuruni lembah", [{ id: "eta", label: "learning rate η", min: 0.02, max: 0.35, step: 0.01, v: 0.1 }]);
    var p = Plane(f.svg, { x0: -3, x1: 3, y0: -2, y1: 2, h: 300, w: 560, sx: 1, sy: 1 }), Q = [2.4, 1.4], trail = [];
    var F = function (x, y) { return x * x + 3 * y * y; };
    h._draw = function () {
      p.clear(); heads(f.svg);
      [0.5, 1, 2, 4, 7, 11].forEach(function (c) { p.curve(function (x) { var v = (c - x * x) / 3; return v >= 0 ? Math.sqrt(v) : NaN; }, "faint line"); p.curve(function (x) { var v = (c - x * x) / 3; return v >= 0 ? -Math.sqrt(v) : NaN; }, "faint line"); });
      for (var i = 1; i < trail.length; i++) p.seg(trail[i - 1][0], trail[i - 1][1], trail[i][0], trail[i][1], "s2 line");
      var g = [2 * Q[0], 6 * Q[1]], L = Math.hypot(g[0], g[1]), k = L > 0 ? Math.min(1.2, 0.25 * L) / L : 0;
      if (L > 1e-6) p.arrow(Q[0], Q[1], Q[0] - g[0] * k, Q[1] - g[1] * k, "s1");
      p.dot(0, 0, "ink dot", 4); p.dot(Q[0], Q[1], "s1 dot handle", 9);
      f.out.innerHTML = "Titik (" + fmt(Q[0]) + "; " + fmt(Q[1]) + "), tinggi f = <b>" + fmt(F(Q[0], Q[1])) + "</b>. Gradien ∇f = (2x; 6y) = (" + fmt(g[0]) + "; " + fmt(g[1]) + "). Langkah: titik baru = titik − η·∇f." + (f.vals.eta > 1 / 3 ? " Dengan η > 1/3, langkah arah y dikali (1 − 6η) yang lebih dari 1 secara mutlak: titik akan meledak menjauh." : f.vals.eta > 1 / 6 ? " Dengan η > 1/6, langkah arah y melompati dasar dan berzig-zag, tapi masih menuju dasar." : "");
    };
    draggable(f.svg, p, function () { return [Q]; }, function (i, v) { Q = [clamp(v[0], -3, 3), clamp(v[1], -2, 2)]; trail = []; h._draw(); });
    button(f, "Langkah", function () { if (!trail.length) trail.push(Q.slice()); Q = [Q[0] - f.vals.eta * 2 * Q[0], Q[1] - f.vals.eta * 6 * Q[1]]; trail.push(Q.slice()); h._draw(); });
    button(f, "Ulang", function () { Q = [2.4, 1.4]; trail = []; h._draw(); });
    h._draw();
  };

  /* 2.4 jumlah Riemann */
  W.riemann = function (h) {
    var f = frame(h, "Luas di bawah y = x² dari 0 sampai 1. Tambah potongan dan lihat jumlahnya mendekati 1/3", [{ id: "n", label: "banyak potongan n", min: 1, max: 60, step: 1, v: 4, d: 0 }]);
    var p = Plane(f.svg, { x0: -0.05, x1: 1.1, y0: -0.05, y1: 1.1, h: 320, sx: 0.25, sy: 0.25, lx: 0.5, ly: 0.5 }), side = 1;
    var bR = button(f, "Tinggi di ujung kanan", function () { side = 1; h._draw(); }), bL = button(f, "Tinggi di ujung kiri", function () { side = 0; h._draw(); });
    h._draw = function () {
      var n = f.vals.n, dx = 1 / n, sum = 0; p.clear();
      bR.setAttribute("aria-pressed", side === 1); bL.setAttribute("aria-pressed", side === 0);
      for (var i = 0; i < n; i++) { var x = (i + side) * dx, y = x * x; sum += y * dx; rect(p, f.svg, i * dx, 0, (i + 1) * dx, y, "s1 area"); }
      p.curve(function (x) { return x * x; }, "ink line", 0, 1.05);
      f.out.innerHTML = "Jumlah " + n + " persegi panjang = <b>" + fmt(sum, 5) + "</b>. Nilai sebenarnya ∫₀¹ x² dx = 1/3 ≈ 0,33333. Selisih " + fmt(Math.abs(sum - 1 / 3), 5) + ".";
    }; h._draw();
  };

  /* 2.5 matriks membengkokkan grid */
  W.matrix = function (h) {
    var f = frame(h, "Kolom matriks = tujuan sumbu. Persegi satuan (abu-abu) menjadi jajar genjang (ungu)", [{ id: "a", label: "a (kiri atas)", min: -2, max: 2, step: 0.1, v: 2 }, { id: "c", label: "c (kiri bawah)", min: -2, max: 2, step: 0.1, v: 0 }, { id: "b", label: "b (kanan atas)", min: -2, max: 2, step: 0.1, v: 0 }, { id: "d", label: "d (kanan bawah)", min: -2, max: 2, step: 0.1, v: 1 }]);
    keyLabels(f, ["a", "c", "b", "d"]);
    var p = Plane(f.svg, { x0: -3.5, x1: 3.5, y0: -3, y1: 3, h: 340, w: 560, sx: 1, sy: 1 });
    preset(f, [["Regang", { a: 2, b: 0, c: 0, d: 1 }], ["Putar 90°", { a: 0, b: -1, c: 1, d: 0 }], ["Geser", { a: 1, b: 1, c: 0, d: 1 }], ["Pipihkan", { a: 1, b: 2, c: 0.5, d: 1 }], ["Cermin", { a: -1, b: 0, c: 0, d: 1 }]], function (o) { setVals(f, o); });
    h._draw = function () {
      var a = f.vals.a, b = f.vals.b, c = f.vals.c, d = f.vals.d, T = function (x, y) { return [a * x + b * y, c * x + d * y]; }; p.clear(); heads(f.svg);
      var cg = clipG(p, f.svg); for (var k = -6; k <= 6; k++) { var A1 = T(k, -6), A2 = T(k, 6), B1 = T(-6, k), B2 = T(6, k); cg.appendChild(p.seg(A1[0], A1[1], A2[0], A2[1], "guide")); cg.appendChild(p.seg(B1[0], B1[1], B2[0], B2[1], "guide")); }
      poly({ X: p.X, Y: p.Y, svg: f.svg }, [[0, 0], [1, 0], [1, 1], [0, 1]], "cell");
      poly({ X: p.X, Y: p.Y, svg: f.svg }, [[0, 0], T(1, 0), T(1, 1), T(0, 1)], "s1 area");
      p.arrow(0, 0, a, c, "s1"); p.arrow(0, 0, b, d, "s2");
      var det = a * d - b * c;
      f.out.innerHTML = "A = [[" + fmt(a) + ", " + fmt(b) + "], [" + fmt(c) + ", " + fmt(d) + "]]. e₁ → (" + fmt(a) + ", " + fmt(c) + ") (panah ungu), e₂ → (" + fmt(b) + ", " + fmt(d) + ") (panah biru muda). det = ad − bc = <b>" + fmt(det) + "</b>: " + (Math.abs(det) < 0.005 ? "bidang dipipihkan jadi garis, tidak bisa dibalik." : det < 0 ? "luas dikali " + fmt(-det) + " dan bidang dicerminkan." : "luas dikali " + fmt(det) + ".");
    }; h._draw();
  };

  /* 2.6 urutan perkalian dan invers */
  W.matmul = function (h) {
    var f = frame(h, "Huruf F dikenai regangan A dan putaran R. Bandingkan RA (regang dulu) dengan AR (putar dulu)", [{ id: "s", label: "regangan A arah x", min: 0.5, max: 2.5, step: 0.1, v: 2 }, { id: "t", label: "putaran R (derajat)", min: -180, max: 180, step: 5, v: 90, d: 0 }]);
    var p = Plane(f.svg, { x0: -4, x1: 4, y0: -3, y1: 3, h: 330, w: 560, sx: 1, sy: 1 }), mode = "RA";
    var Fs = [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.6], [1.2, 1.6], [1.2, 2], [0, 2]];
    var bRA = button(f, "RA", function () { mode = "RA"; h._draw(); }), bAR = button(f, "AR", function () { mode = "AR"; h._draw(); }), bInv = button(f, "Kenakan invers", function () { mode = mode === "inv" ? "RA" : "inv"; h._draw(); });
    function mul(M, N) { return [[M[0][0] * N[0][0] + M[0][1] * N[1][0], M[0][0] * N[0][1] + M[0][1] * N[1][1]], [M[1][0] * N[0][0] + M[1][1] * N[1][0], M[1][0] * N[0][1] + M[1][1] * N[1][1]]]; }
    function app(M, q) { return [M[0][0] * q[0] + M[0][1] * q[1], M[1][0] * q[0] + M[1][1] * q[1]]; }
    h._draw = function () {
      var s = f.vals.s, th = f.vals.t * Math.PI / 180, A = [[s, 0], [0, 1]], R = [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
      var RA = mul(R, A), AR = mul(A, R), M = mode === "AR" ? AR : RA; p.clear();
      bRA.setAttribute("aria-pressed", mode === "RA"); bAR.setAttribute("aria-pressed", mode === "AR"); bInv.setAttribute("aria-pressed", mode === "inv");
      poly({ X: p.X, Y: p.Y, svg: f.svg }, Fs, "cell");
      var img = Fs.map(function (q) { return app(M, q); });
      if (mode === "inv") { var det = RA[0][0] * RA[1][1] - RA[0][1] * RA[1][0], Inv = [[RA[1][1] / det, -RA[0][1] / det], [-RA[1][0] / det, RA[0][0] / det]]; poly({ X: p.X, Y: p.Y, svg: f.svg }, Fs.map(function (q) { return app(RA, q); }), "s2 area"); img = Fs.map(function (q) { return app(Inv, app(RA, q)); }); }
      poly({ X: p.X, Y: p.Y, svg: f.svg }, img, "s1 area");
      var show = function (M) { return "[[" + fmt(M[0][0]) + ", " + fmt(M[0][1]) + "], [" + fmt(M[1][0]) + ", " + fmt(M[1][1]) + "]]"; };
      f.out.innerHTML = mode === "inv" ? "Biru muda: hasil RA. Ungu: hasil RA lalu dikenai (RA)⁻¹. Huruf F kembali tepat ke tempat asal (abu-abu): invers membatalkan gerakan." :
        "RA = " + show(RA) + ", AR = " + show(AR) + ". " + (Math.abs(RA[0][1] - AR[0][1]) + Math.abs(RA[1][0] - AR[1][0]) < 1e-6 ? "Kali ini sama (putaran 0° atau 180°, atau regangan 1): kasus khusus." : "Berbeda: urutan gerakan mengubah hasil.");
    }; h._draw();
  };

  /* 2.7 mencari arah eigen */
  W.eigen = function (h) {
    var f = frame(h, "Putar v (biru muda). Kalau Av (ungu) searah dengan v, kamu menemukan vektor eigen", [{ id: "t", label: "sudut v (derajat)", min: 0, max: 180, step: 1, v: 20, d: 0 }]);
    var p = Plane(f.svg, { x0: -3.5, x1: 3.5, y0: -3, y1: 3, h: 340, w: 560, sx: 1, sy: 1 }), M = [[2, 1], [1, 2]], name = "simetris";
    preset(f, [["[[2,1],[1,2]]", [[2, 1], [1, 2]]], ["Regang [[2,0],[0,1]]", [[2, 0], [0, 1]]], ["Geser [[1,1],[0,1]]", [[1, 1], [0, 1]]], ["Putar 90°", [[0, -1], [1, 0]]]], function (m) { M = m; h._draw(); });
    h._draw = function () {
      var th = f.vals.t * Math.PI / 180, v = [Math.cos(th), Math.sin(th)], Av = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
      var cross = v[0] * Av[1] - v[1] * Av[0], lam = v[0] * Av[0] + v[1] * Av[1], ok = Math.abs(cross) < 0.03; p.clear(); heads(f.svg);
      p.curve(function (x) { return Math.sqrt(Math.max(0, 1 - x * x)); }, "faint line", -1, 1); p.curve(function (x) { return -Math.sqrt(Math.max(0, 1 - x * x)); }, "faint line", -1, 1);
      p.seg(-3.5 * v[0], -3.5 * v[1], 3.5 * v[0], 3.5 * v[1], "guide");
      p.arrow(0, 0, Av[0], Av[1], "s1"); p.arrow(0, 0, v[0], v[1], "s2");
      var ang = Math.abs(Math.atan2(cross, lam)) * 180 / Math.PI;
      f.out.innerHTML = "A = [[" + M[0].join(", ") + "], [" + M[1].join(", ") + "]]. Sudut antara v dan Av: <b>" + fmt(Math.min(ang, 180 - ang), 1) + "°</b>. " + (ok ? "Searah! v adalah vektor eigen dengan λ ≈ <b>" + fmt(lam) + "</b>." : "Belum searah. Terus putar v.") + (M[0][0] === 0 && M[0][1] === -1 ? " (Putaran 90° tidak punya arah eigen real: semua arah dibelokkan.)" : "");
    }; h._draw();
  };

  /* 2.8 PCA: putar garis, cari varians proyeksi terbesar */
  W.pca = function (h) {
    var f = frame(h, "Putar garis. Panjang bayangan titik di garis = varians yang tertangkap; garis abu-abu = yang hilang", [{ id: "t", label: "sudut garis (derajat)", min: 0, max: 180, step: 1, v: 100, d: 0 }]);
    var p = Plane(f.svg, { x0: -4, x1: 4, y0: -3, y1: 3, h: 330, w: 560, sx: 1, sy: 1 }), r = rng(7), D = [];
    for (var i = 0; i < 40; i++) { var a = gauss(r) * 1.6, b = gauss(r) * 0.45; D.push([a * 0.89 - b * 0.45, a * 0.45 + b * 0.89]); }
    var mx = D.reduce(function (s, q) { return s + q[0]; }, 0) / D.length, my = D.reduce(function (s, q) { return s + q[1]; }, 0) / D.length; D = D.map(function (q) { return [q[0] - mx, q[1] - my]; });
    var sxx = 0, syy = 0, sxy = 0; D.forEach(function (q) { sxx += q[0] * q[0]; syy += q[1] * q[1]; sxy += q[0] * q[1]; }); sxx /= D.length; syy /= D.length; sxy /= D.length;
    var best = 0.5 * Math.atan2(2 * sxy, sxx - syy) * 180 / Math.PI; if (best < 0) best += 180;
    button(f, "Cari garis terbaik", function () { var inp = f.ctl.querySelector("input"); inp.value = Math.round(best); inp.dispatchEvent(new Event("input")); });
    h._draw = function () {
      var th = f.vals.t * Math.PI / 180, u = [Math.cos(th), Math.sin(th)], vin = 0, vout = 0; p.clear();
      clipG(p, f.svg).appendChild(p.seg(-6 * u[0], -6 * u[1], 6 * u[0], 6 * u[1], "s1 line"));
      D.forEach(function (q) { var t = q[0] * u[0] + q[1] * u[1], pr = [t * u[0], t * u[1]]; vin += t * t; vout += Math.pow(q[0] - pr[0], 2) + Math.pow(q[1] - pr[1], 2); p.seg(q[0], q[1], pr[0], pr[1], "guide"); p.dot(pr[0], pr[1], "s1 dot", 3); });
      D.forEach(function (q) { p.dot(q[0], q[1], "s2 dot", 4.5); });
      vin /= D.length; vout /= D.length;
      f.out.innerHTML = "Varians sepanjang garis: <b>" + fmt(vin) + "</b> dari total " + fmt(vin + vout) + " (" + fmt(100 * vin / (vin + vout), 1) + "%). Komponen utama pertama ada di sudut ≈ " + fmt(best, 0) + "°, tempat varians tertangkap paling besar dan jarak titik ke garis paling kecil, sekaligus.";
    }; h._draw();
  };

  /* 2.9 binomial menuju normal */
  W.binom = function (h) {
    var f = frame(h, "Distribusi binomial (batang). Perbesar n: bentuknya mendekati lonceng normal (garis)", [{ id: "n", label: "banyak lemparan n", min: 1, max: 60, step: 1, v: 10, d: 0 }, { id: "p", label: "peluang berhasil p", min: 0.05, max: 0.95, step: 0.05, v: 0.5 }]);
    var p = Plane(f.svg, { x0: -0.5, x1: 60.5, y0: 0, y1: 0.5, h: 300, sx: 10, sy: 0.1, ly: 0.1 });
    function lc(n, k) { var s = 0; for (var i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i); return s; }
    h._draw = function () {
      var n = f.vals.n, q = f.vals.p, mu = n * q, sd = Math.sqrt(n * q * (1 - q)), mx = 0, P = [];
      for (var k = 0; k <= n; k++) { var v = Math.exp(lc(n, k) + k * Math.log(q) + (n - k) * Math.log(1 - q)); P.push(v); mx = Math.max(mx, v); }
      p.o.x1 = Math.max(10, n) + 0.5; p.o.y1 = Math.max(0.1, Math.ceil(mx * 12) / 10); p.o.sx = n > 30 ? 10 : n > 12 ? 5 : 1; p.o.sy = p.o.y1 > 0.3 ? 0.1 : 0.05; p.o.ly = p.o.sy; p.clear();
      P.forEach(function (v, k) { rect(p, f.svg, k - 0.4, 0, k + 0.4, v, "s1 area"); });
      if (sd > 0) p.curve(function (x) { return Math.exp(-Math.pow(x - mu, 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)); }, "s2 line");
      var km = 0; P.forEach(function (v, k) { if (v > P[km]) km = k; });
      f.out.innerHTML = "Rata-rata np = <b>" + fmt(mu) + "</b>, simpangan baku √(np(1−p)) = <b>" + fmt(sd) + "</b>. Hasil paling mungkin: " + km + " berhasil, peluang " + fmt(P[km], 3) + ". Kurva biru muda adalah normal dengan μ dan σ yang sama.";
    }; h._draw();
  };

  /* 2.10 rata-rata n dadu: ekspektasi tetap, varians dibagi n */
  W.dice = function (h) {
    var f = frame(h, "2000 kali percobaan: lempar n dadu, catat rata-ratanya. Perbesar n dan lihat sebarannya menyempit", [{ id: "n", label: "dadu per rata-rata n", min: 1, max: 30, step: 1, v: 1, d: 0 }]);
    var p = Plane(f.svg, { x0: 0.5, x1: 6.5, y0: 0, y1: 1, h: 300, sx: 0.5, sy: 0.25, lx: 1, ly: 0.5 }), seed = 3;
    button(f, "Ulang acak", function () { seed++; h._draw(); });
    h._draw = function () {
      var n = f.vals.n, r = rng(seed * 101 + n), M = [], bins = {}, w = 1 / n, sum = 0, sq = 0;
      for (var i = 0; i < 2000; i++) { var s = 0; for (var j = 0; j < n; j++) s += 1 + Math.floor(r() * 6); var m = s / n; M.push(m); sum += m; sq += m * m; var b = Math.round(m * n); bins[b] = (bins[b] || 0) + 1; }
      var mean = sum / 2000, vr = sq / 2000 - mean * mean, mx = 0; for (var k in bins) mx = Math.max(mx, bins[k] / 2000 / w);
      p.o.y1 = Math.max(0.25, Math.ceil(mx * 4) / 4); p.o.sy = p.o.y1 > 1.5 ? 0.5 : 0.25; p.o.ly = p.o.y1 > 1.5 ? 1 : 0.5; p.clear();
      for (var k2 in bins) { var x = k2 / n; rect(p, f.svg, x - w * 0.45, 0, x + w * 0.45, bins[k2] / 2000 / w, "s1 area"); }
      p.seg(3.5, 0, 3.5, p.o.y1, "s2 line dash");
      f.out.innerHTML = "Rata-rata dari 2000 rata-rata: <b>" + fmt(mean, 3) + "</b> (ekspektasi 3,5, tidak berubah). Variansnya <b>" + fmt(vr, 3) + "</b>; teori: (35/12) ÷ " + n + " = " + fmt(35 / 12 / n, 3) + ".";
    }; h._draw();
  };

  /* 2.11 Bayes dengan 1000 orang */
  W.bayes = function (h) {
    var f = frame(h, "1000 orang. Titik terang = hasil tes positif. Berapa bagian dari yang positif benar-benar sakit?", [{ id: "pv", label: "yang sakit (%)", min: 0.5, max: 30, step: 0.5, v: 1, d: 1 }, { id: "se", label: "tes menangkap penderita (%)", min: 50, max: 100, step: 1, v: 90, d: 0 }, { id: "fp", label: "positif palsu pada orang sehat (%)", min: 0, max: 30, step: 0.5, v: 5, d: 1 }]);
    f.svg.setAttribute("viewBox", "0 0 560 240");
    h._draw = function () {
      var N = 1000, sick = Math.round(N * f.vals.pv / 100), tp = Math.round(sick * f.vals.se / 100), fpN = Math.round((N - sick) * f.vals.fp / 100), svg = f.svg; svg.innerHTML = "";
      for (var i = 0; i < N; i++) {
        var col = i % 50, row = Math.floor(i / 50), isS = i < sick, pos = isS ? i < tp : (i - sick) < fpN;
        el("circle", { cx: 12 + col * 10.9, cy: 12 + row * 10.9, r: pos ? 4.2 : 3, "class": isS ? "s1 fill" : "s2 fill", "fill-opacity": pos ? 1 : 0.22 }, svg);
      }
      var post = tp / Math.max(1, tp + fpN);
      f.out.innerHTML = "Sakit: " + sick + " orang (ungu), " + tp + " di antaranya positif. Sehat: " + (N - sick) + " orang (biru muda), " + fpN + " positif palsu. Dari " + (tp + fpN) + " yang positif, yang sakit hanya <b>" + tp + " (" + fmt(100 * post, 1) + "%)</b>.";
    }; h._draw();
  };

  /* 2.12 korelasi */
  W.cov = function (h) {
    var f = frame(h, "Atur korelasi ρ. Kotak kanan atas dan kiri bawah menyumbang kovarians positif, dua kotak lain negatif", [{ id: "r", label: "korelasi ρ", min: -1, max: 1, step: 0.05, v: 0.7 }]);
    var p = Plane(f.svg, { x0: -3.2, x1: 3.2, y0: -3.2, y1: 3.2, h: 360, w: 400, sx: 1, sy: 1 }), r = rng(11), Z = [];
    for (var i = 0; i < 150; i++) Z.push([gauss(r), gauss(r)]);
    h._draw = function () {
      var rho = f.vals.r, P = Z.map(function (z) { return [z[0], rho * z[0] + Math.sqrt(1 - rho * rho) * z[1]]; });
      var mx = 0, my = 0; P.forEach(function (q) { mx += q[0]; my += q[1]; }); mx /= P.length; my /= P.length;
      var c = 0, vx = 0, vy = 0, pos = 0; P.forEach(function (q) { var d = (q[0] - mx) * (q[1] - my); c += d; vx += Math.pow(q[0] - mx, 2); vy += Math.pow(q[1] - my, 2); if (d > 0) pos++; });
      c /= P.length; vx /= P.length; vy /= P.length; p.clear();
      rect(p, f.svg, mx, my, 3.2, 3.2, "s1 area"); rect(p, f.svg, -3.2, -3.2, mx, my, "s1 area"); rect(p, f.svg, -3.2, my, mx, 3.2, "s2 area"); rect(p, f.svg, mx, -3.2, 3.2, my, "s2 area");
      P.forEach(function (q) { p.dot(q[0], q[1], "ink dot", 3.2); });
      f.out.innerHTML = "Kovarians = <b>" + fmt(c, 3) + "</b>, korelasi = <b>" + fmt(c / Math.sqrt(vx * vy), 3) + "</b>. " + pos + " dari 150 titik ada di kotak ungu (hasil kali selisih positif). Korelasi sampel 150 titik sedikit berbeda dari ρ yang kamu atur: itulah keacakan sampel.";
    }; h._draw();
  };
})();
