/* Widget Lapis 3. Memakai alat bantu dari viz.js (window.VIZ). */
(function () {
  var V = window.VIZ, W = V.W, Plane = V.Plane, frame = V.frame, button = V.button, el = V.el, fmt = V.fmt, heads = V.heads;
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function path(p, pts, cls) { return el("path", { d: pts.map(function (q, i) { return (i ? "L" : "M") + p.X(q[0]).toFixed(1) + " " + p.Y(q[1]).toFixed(1); }).join(""), "class": cls }, p.svg); }
  function bar(p, x0, x1, y, cls) { return el("rect", { x: p.X(x0), y: p.Y(Math.max(y, 0)), width: p.X(x1) - p.X(x0), height: Math.abs(p.Y(y) - p.Y(0)), "class": cls }, p.svg); }
  function mk(svg, o) { var p = Plane(svg, o); p.svg = svg; return p; }

  /* 3.1 GD, momentum, Adam di lembah sempit f = x² + 25y² */
  W.optim = function (h) {
    var f = frame(h, "Lembah sempit f = x² + 25y². Atur learning rate dan momentum, lalu jalankan. Bandingkan banyaknya langkah", [{ id: "lr", label: "learning rate η", min: 0.005, max: 0.045, step: 0.001, v: 0.02, d: 3 }, { id: "b", label: "momentum β", min: 0, max: 0.95, step: 0.05, v: 0 }]);
    var p = mk(f.svg, { x0: -3.6, x1: 3.6, y0: -1.3, y1: 1.3, h: 300, w: 560, sx: 1, sy: 0.5 }), mode = "gd";
    function run() {
      var x = 3, y = 1, vx = 0, vy = 0, mx = 0, my = 0, sx = 0, sy = 0, tr = [[x, y]], n = 0, lr = f.vals.lr, b = f.vals.b;
      while (n < 300 && x * x + 25 * y * y >= 1e-3 && Math.abs(x) < 50 && Math.abs(y) < 50) {
        var gx = 2 * x, gy = 50 * y; n++;
        if (mode === "adam") { var lrA = 0.1; mx = 0.9 * mx + 0.1 * gx; my = 0.9 * my + 0.1 * gy; sx = 0.999 * sx + 0.001 * gx * gx; sy = 0.999 * sy + 0.001 * gy * gy;
          var c1 = 1 - Math.pow(0.9, n), c2 = 1 - Math.pow(0.999, n); x -= lrA * (mx / c1) / (Math.sqrt(sx / c2) + 1e-8); y -= lrA * (my / c1) / (Math.sqrt(sy / c2) + 1e-8); }
        else { vx = b * vx + gx; vy = b * vy + gy; x -= lr * vx; y -= lr * vy; }
        tr.push([x, y]);
      }
      return { tr: tr, n: n, ok: x * x + 25 * y * y < 1e-3 };
    }
    h._draw = function () {
      p.clear(); var r = run();
      [0.25, 1, 2.5, 5, 9].forEach(function (c) { var g = function (s) { return function (x) { var v = (c - x * x) / 25; return v >= 0 ? s * Math.sqrt(v) : NaN; }; }; p.curve(g(1), "faint line"); p.curve(g(-1), "faint line"); });
      var cg = el("g", { "clip-path": "url(#" + f.svg.querySelector("clipPath").id + ")" }, f.svg), save = p.svg; p.svg = cg;
      path(p, r.tr, "s1 line"); r.tr.slice(0, 60).forEach(function (q) { if (Math.abs(q[0]) < 3.6 && Math.abs(q[1]) < 1.3) p.dot(q[0], q[1], "s1 dot", 2.2); }); p.svg = save;
      p.dot(0, 0, "ink dot", 4); p.dot(3, 1, "s2 dot", 5);
      var nm = mode === "adam" ? "Adam (η = 0,1)" : f.vals.b > 0 ? "momentum β = " + fmt(f.vals.b) : "GD biasa";
      f.out.innerHTML = nm + ": " + (r.ok ? "sampai dekat dasar (f &lt; 0,001) dalam <b>" + r.n + " langkah</b>." : r.n >= 300 ? "belum sampai setelah 300 langkah." : "<b>meledak</b> setelah " + r.n + " langkah.") +
        (mode === "gd" && f.vals.lr > 0.04 ? " Arah y dikali (1 − 50η) tiap langkah; di atas η = 0,04 nilainya lebih dari 1 secara mutlak." : "") +
        (mode === "gd" && f.vals.b === 0 ? (f.vals.lr > 0.02 && f.vals.lr <= 0.04 ? " Arah y dikali (1 − 50η) yang negatif: titik berzig-zag antardinding." : f.vals.lr <= 0.02 ? " Arah y cepat padam; yang lambat adalah arah x yang landai, dikali (1 − 2η) = " + fmt(1 - 2 * f.vals.lr, 3) + " tiap langkah. Naikkan η sedikit, atau tambah momentum." : "") : "");
    };
    button(f, "GD / momentum", function () { mode = "gd"; h._draw(); });
    button(f, "Adam", function () { mode = "adam"; h._draw(); });
    h._draw();
  };

  /* 3.2 kurva likelihood */
  W.mle = function (h) {
    var f = frame(h, "Atur banyak lemparan n dan banyak gambar k. Kurva = likelihood setiap p, puncaknya MLE", [{ id: "n", label: "lemparan n", min: 1, max: 100, step: 1, v: 10, d: 0 }, { id: "k", label: "gambar k", min: 0, max: 100, step: 1, v: 7, d: 0 }]);
    var p = mk(f.svg, { x0: 0, x1: 1, y0: 0, y1: 1.1, h: 280, sx: 0.1, sy: 0.25 });
    h._draw = function () {
      var kin = f.ctl.querySelectorAll("input")[1]; kin.max = f.vals.n; if (f.vals.k > f.vals.n) { kin.value = f.vals.n; f.vals.k = f.vals.n; kin.parentNode.querySelector("output").textContent = f.vals.n; }
      var n = f.vals.n, k = Math.min(f.vals.k, n), ph = k / n, ll = function (q) { return (k ? k * Math.log(q) : 0) + (n - k ? (n - k) * Math.log(1 - q) : 0); }, top = ll(Math.min(Math.max(ph, 1e-9), 1 - 1e-9));
      p.clear(); p.curve(function (q) { return q <= 0 || q >= 1 ? NaN : Math.exp(ll(q) - top); }, "s1 line");
      p.seg(ph, 0, ph, 1, "guide"); p.dot(ph, 1, "s1 dot"); p.text(ph, 1.05, "p̂ = " + fmt(ph, 2), "lbl", "middle");
      var lo = 0, hi = 1; for (var q = 0.001; q < 1; q += 0.001) { if (Math.exp(ll(q) - top) >= 0.15) { if (!lo) lo = q; hi = q; } }
      f.out.innerHTML = "k = " + k + " dari n = " + n + ". MLE p̂ = k/n = <b>" + fmt(ph, 3) + "</b>. Tinggi kurva dibagi tinggi puncak, jadi puncak selalu 1. Nilai p dengan likelihood minimal 15% puncak: kira-kira " + fmt(lo, 2) + " sampai " + fmt(hi, 2) + "." + (n < 15 ? " Datanya sedikit, jadi kurvanya lebar: banyak p masih masuk akal." : " Data makin banyak, kurva makin sempit.") + (k === 0 || k === n ? " Semua lemparan sama: MLE berkata p = " + fmt(ph, 0) + ", kesimpulan ekstrem dari data sedikit." : "");
    }; h._draw();
  };

  /* 3.3 prior Beta → posterior */
  W.beta = function (h) {
    var f = frame(h, "Atur prior Beta(a, b) dan data. Garis putus-putus = prior, garis tebal = posterior", [{ id: "a", label: "prior a", min: 1, max: 30, step: 1, v: 1, d: 0 }, { id: "b", label: "prior b", min: 1, max: 30, step: 1, v: 1, d: 0 }, { id: "g", label: "gambar", min: 0, max: 100, step: 1, v: 7, d: 0 }, { id: "t", label: "angka", min: 0, max: 100, step: 1, v: 3, d: 0 }]);
    var p = mk(f.svg, { x0: 0, x1: 1, y0: 0, y1: 1.1, h: 280, sx: 0.1, sy: 0.25 });
    function dens(a, b) { var xs = [], ys = [], m = 0, s = 0; for (var i = 1; i < 400; i++) { var x = i / 400, y = Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x)); xs.push(x); ys.push(y); } var lg = ys.map(function (y) { return y; }); var mx = Math.max.apply(null, lg); return { xs: xs, ys: ys.map(function (y) { return y / mx; }) }; }
    function q(a, b, pr) { var d = dens(a, b), tot = d.ys.reduce(function (s, y) { return s + y; }, 0), c = 0; for (var i = 0; i < d.xs.length; i++) { c += d.ys[i]; if (c >= pr * tot) return d.xs[i]; } return 1; }
    h._draw = function () {
      var a = f.vals.a, b = f.vals.b, A = a + f.vals.g, B = b + f.vals.t, pr = dens(a, b), po = dens(A, B); p.clear();
      path(p, pr.xs.map(function (x, i) { return [x, pr.ys[i]]; }), "s2 line dash");
      path(p, po.xs.map(function (x, i) { return [x, po.ys[i]]; }), "s1 line");
      var lo = q(A, B, 0.025), hi = q(A, B, 0.975), mle = f.vals.g + f.vals.t ? f.vals.g / (f.vals.g + f.vals.t) : null;
      p.seg(lo, 0, lo, 0.15, "s1 line"); p.seg(hi, 0, hi, 0.15, "s1 line");
      if (mle !== null) { p.seg(mle, 0, mle, 1.05, "guide"); p.text(mle, 1.07, "MLE", "lbl", "middle"); }
      f.out.innerHTML = "Posterior = Beta(" + A + ", " + B + "). Rata-rata = <b>" + fmt(A / (A + B), 3) + "</b>" + (mle !== null ? ", MLE = " + fmt(mle, 3) : "") + ". Rentang 95%: " + fmt(lo, 2) + " sampai " + fmt(hi, 2) + " (garis pendek di bawah). Kedua kurva diskalakan supaya puncaknya setinggi 1. " + (a + b > f.vals.g + f.vals.t ? "Prior masih lebih \"berat\" daripada data." : "Data sudah lebih berat daripada prior.");
    }; h._draw();
  };

  /* 3.4 entropi, cross-entropy, KL untuk tiga kategori */
  W.kl = function (h) {
    var f = frame(h, "Atur bobot tiga kategori untuk p (sebenarnya, ungu) dan q (tebakan, biru muda). Bobot dibagi jumlahnya agar menjadi peluang", [{ id: "p1", label: "p₁", min: 1, max: 20, step: 1, v: 7, d: 0 }, { id: "p2", label: "p₂", min: 1, max: 20, step: 1, v: 2, d: 0 }, { id: "p3", label: "p₃", min: 1, max: 20, step: 1, v: 1, d: 0 }, { id: "q1", label: "q₁", min: 1, max: 20, step: 1, v: 5, d: 0 }, { id: "q2", label: "q₂", min: 1, max: 20, step: 1, v: 3, d: 0 }, { id: "q3", label: "q₃", min: 1, max: 20, step: 1, v: 2, d: 0 }]);
    var pl = mk(f.svg, { x0: 0, x1: 3, y0: 0, y1: 1, h: 260, sx: 1, sy: 0.25 });
    h._draw = function () {
      var v = f.vals, P = [v.p1, v.p2, v.p3], Q = [v.q1, v.q2, v.q3], sp = P[0] + P[1] + P[2], sq = Q[0] + Q[1] + Q[2];
      P = P.map(function (x) { return x / sp; }); Q = Q.map(function (x) { return x / sq; }); pl.clear();
      var H = 0, CE = 0, KLr = 0;
      for (var i = 0; i < 3; i++) { bar(pl, i + 0.12, i + 0.48, P[i], "s1 area"); bar(pl, i + 0.52, i + 0.88, Q[i], "s2 area"); pl.text(i + 0.5, -0.07, "kategori " + (i + 1), "lbl", "middle"); H -= P[i] * Math.log(P[i]); CE -= P[i] * Math.log(Q[i]); KLr += Q[i] * Math.log(Q[i] / P[i]); }
      f.out.innerHTML = "p = [" + P.map(function (x) { return fmt(x, 2); }).join("; ") + "], q = [" + Q.map(function (x) { return fmt(x, 2); }).join("; ") + "]. Entropi H(p) = <b>" + fmt(H, 3) + "</b> nat. Cross-entropy H(p, q) = <b>" + fmt(CE, 3) + "</b>. KL(p‖q) = H(p, q) − H(p) = <b>" + fmt(CE - H, 3) + "</b>; kebalikannya KL(q‖p) = " + fmt(KLr, 3) + "." + (CE - H < 0.0005 ? " q = p, jadi KL nol." : " Samakan q dengan p untuk membuat KL nol.");
    }; h._draw();
  };

  /* 3.5 derajat polinomial vs galat latih dan uji */
  W.overfit = function (h) {
    var f = frame(h, "Naikkan derajat polinomial. Titik ungu = 15 data latih, garis putus-putus = kurva sebenarnya sin(2πx)", [{ id: "d", label: "derajat", min: 0, max: 12, step: 1, v: 3, d: 0 }]);
    var p = mk(f.svg, { x0: 0, x1: 1, y0: -2, y1: 2, h: 300, sx: 0.1, sy: 0.5 }), r = rng(7), F = function (x) { return Math.sin(2 * Math.PI * x); };
    var X = [], Y = [], XT = [], YT = [], i;
    for (i = 0; i < 15; i++) X.push((i + 0.5 + (r() - 0.5) * 0.8) / 15); X.forEach(function (x) { Y.push(F(x) + 0.25 * gauss(r)); });
    for (i = 0; i < 200; i++) { var xt = (i + 0.5) / 200; XT.push(xt); YT.push(F(xt) + 0.25 * gauss(r)); }
    function fit(d) { /* kuadrat terkecil di z = 2x − 1, eliminasi Gauss dengan pivot */
      var n = d + 1, A = [], bb = [], j, k, z;
      for (j = 0; j < n; j++) { A.push(new Array(n).fill(0)); bb.push(0); }
      X.forEach(function (x, t) { z = 2 * x - 1; var pw = []; for (j = 0; j < n; j++) pw.push(Math.pow(z, j)); for (j = 0; j < n; j++) { bb[j] += pw[j] * Y[t]; for (k = 0; k < n; k++) A[j][k] += pw[j] * pw[k]; } });
      for (j = 0; j < n; j++) A[j][j] += 1e-10;
      for (j = 0; j < n; j++) { var m = j; for (k = j + 1; k < n; k++) if (Math.abs(A[k][j]) > Math.abs(A[m][j])) m = k; var tmp = A[j]; A[j] = A[m]; A[m] = tmp; tmp = bb[j]; bb[j] = bb[m]; bb[m] = tmp;
        for (k = j + 1; k < n; k++) { var c = A[k][j] / A[j][j]; for (var l = j; l < n; l++) A[k][l] -= c * A[j][l]; bb[k] -= c * bb[j]; } }
      var w = new Array(n).fill(0); for (j = n - 1; j >= 0; j--) { var s = bb[j]; for (k = j + 1; k < n; k++) s -= A[j][k] * w[k]; w[j] = s / A[j][j]; }
      return function (x) { var zz = 2 * x - 1, s = 0; for (var q = n - 1; q >= 0; q--) s = s * zz + w[q]; return s; };
    }
    function mse(g, xs, ys) { var s = 0; xs.forEach(function (x, t) { s += Math.pow(g(x) - ys[t], 2); }); return s / xs.length; }
    h._draw = function () {
      var d = f.vals.d, g = fit(d), tr = mse(g, X, Y), te = mse(g, XT, YT); p.clear();
      p.curve(F, "s2 line dash"); p.curve(g, "ink line");
      X.forEach(function (x, t) { p.dot(x, Y[t], "s1 dot", 4); });
      f.out.innerHTML = "Derajat " + d + ": galat latih <b>" + fmt(tr, 3) + "</b>, galat uji (200 titik baru) <b>" + fmt(te, 3) + "</b>. Batas bawah karena derau ≈ 0,063. " +
        (d <= 1 ? "Underfitting: terlalu kaku untuk kurva sinus." : te < 0.1 ? "Pas: galat uji dekat batas derau." : te > 2 * tr + 0.05 ? "Overfitting: galat latih kecil, tapi kurva berkelok mengejar derau dan galat uji membesar." : "Mulai terlalu lentur.") +
        " Data di sini dibuat ulang dengan pengacak berbeda dari Python di pelajaran, jadi angkanya tidak sama persis, polanya sama.";
    }; h._draw();
  };

  /* 3.6 konvolusi 1D */
  W.conv = function (h) {
    var f = frame(h, "Geser posisi kernel. Pilih kernel: rata-rata menghaluskan, [−1, 0, 1] mencari tepi", [{ id: "i", label: "posisi", min: 0, max: 13, step: 1, v: 3, d: 0 }]);
    var S = [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0], K = [1 / 3, 1 / 3, 1 / 3], nama = "rata-rata [⅓, ⅓, ⅓]";
    var p = mk(f.svg, { x0: -0.5, x1: 15.5, y0: -1.6, y1: 2.4, h: 300, sx: 1, sy: 1 });
    h._draw = function () {
      var out = [], i, j; for (i = 0; i + 2 < S.length; i++) { var s = 0; for (j = 0; j < 3; j++) s += S[i + j] * K[j]; out.push(s); }
      var at = Math.min(f.vals.i, out.length - 1); p.clear();
      el("rect", { x: p.X(at - 0.45), y: p.Y(2.3), width: p.X(at + 2.45) - p.X(at - 0.45), height: p.Y(-1.5) - p.Y(2.3), "class": "s2 area" }, p.svg);
      S.forEach(function (v, k) { p.seg(k, 0, k, v, "ink line"); p.dot(k, v, "ink dot", 3.5); });
      var pts = out.map(function (v, k) { return [k + 1, v]; }); path(p, pts, "s1 line"); pts.forEach(function (q, k) { p.dot(q[0], q[1], k === at ? "s1 dot handle" : "s1 dot", k === at ? 6 : 3); });
      f.out.innerHTML = "Kernel " + nama + ". Di posisi ini kernel menutup s = [" + S.slice(at, at + 3).join(", ") + "] (kotak biru muda). Hasil = " + S.slice(at, at + 3).map(function (v, j) { return v + "×" + fmt(K[j], 2); }).join(" + ") + " = <b>" + fmt(out[at], 2) + "</b>, digambar di tengah kotak (titik ungu). Batang hitam = sinyal, garis ungu = hasil di semua posisi.";
    };
    [["rata-rata", [1 / 3, 1 / 3, 1 / 3], "rata-rata [⅓, ⅓, ⅓]"], ["tepi", [-1, 0, 1], "tepi [−1, 0, 1]"], ["identitas", [0, 1, 0], "identitas [0, 1, 0]"], ["tajam", [-1, 3, -1], "penajam [−1, 3, −1]"]].forEach(function (it) {
      button(f, it[0], function () { K = it[1]; nama = it[2]; h._draw(); }); });
    h._draw();
  };

  /* 3.7 Euler vs jawaban tepat */
  W.euler = function (h) {
    var f = frame(h, "dy/dt = −0,5y, y(0) = 10. Atur langkah Δt: garis putus-putus = jawaban tepat, ungu = Euler", [{ id: "dt", label: "langkah Δt", min: 0.1, max: 5, step: 0.1, v: 1 }]);
    var p = mk(f.svg, { x0: 0, x1: 12, y0: -10, y1: 12, h: 300, sx: 1, sy: 2, lx: 2, ly: 4 });
    h._draw = function () {
      var dt = f.vals.dt, y = 10, t = 0, pts = [[0, 10]]; while (t + dt <= 12 + 1e-9) { y += dt * (-0.5 * y); t += dt; pts.push([t, y]); }
      var fac = 1 - 0.5 * dt; p.clear();
      p.curve(function (t) { return 10 * Math.exp(-0.5 * t); }, "s2 line dash");
      var cg = el("g", { "clip-path": "url(#" + f.svg.querySelector("clipPath").id + ")" }, f.svg), sv = p.svg; p.svg = cg; path(p, pts, "s1 line"); pts.forEach(function (q) { if (Math.abs(q[1]) < 10) p.dot(q[0], q[1], "s1 dot", 3); }); p.svg = sv;
      var lp = pts[pts.length - 1], tt = dt <= 4 ? 0 : lp[0], at4 = dt <= 4 ? 10 : lp[1]; if (dt <= 4) while (tt + dt <= 4 + 1e-9) { at4 *= fac; tt += dt; }
      f.out.innerHTML = "Setiap langkah mengalikan y dengan (1 − 0,5·Δt) = <b>" + fmt(fac, 2) + "</b>. Euler di t = " + fmt(tt, 1) + ": " + fmt(at4, 3) + ", tepat: " + fmt(10 * Math.exp(-0.5 * tt), 3) + ". " +
        (dt > 4 ? "Faktornya lebih dari 1 secara mutlak: Euler <b>meledak</b>, padahal jawaban sebenarnya meluruh. Ini sama dengan learning rate terlalu besar." : dt > 2 ? "Faktornya negatif: Euler berganti tanda bolak-balik sambil mengecil." : "Makin kecil Δt, makin dekat ke garis putus-putus.");
    }; h._draw();
  };

  /* 3.8 rantai Markov dua keadaan */
  W.markov = function (h) {
    var f = frame(h, "Atur peluang pindah. Ungu: mulai dari hari cerah. Biru muda: mulai dari hari hujan. Keduanya menuju garis yang sama", [{ id: "a", label: "P(cerah → hujan)", min: 0.05, max: 1, step: 0.05, v: 0.2 }, { id: "b", label: "P(hujan → cerah)", min: 0.05, max: 1, step: 0.05, v: 0.4 }]);
    var p = mk(f.svg, { x0: 0, x1: 15, y0: 0, y1: 1, h: 280, sx: 1, sy: 0.25, lx: 5 });
    h._draw = function () {
      var a = f.vals.a, b = f.vals.b, pi = b / (a + b), A = [[0, 1]], B = [[0, 0]], x = 1, y = 0;
      for (var n = 1; n <= 15; n++) { x = x * (1 - a) + (1 - x) * b; y = y * (1 - a) + (1 - y) * b; A.push([n, x]); B.push([n, y]); }
      p.clear(); p.seg(0, pi, 15, pi, "guide"); p.text(15, pi + 0.04, "stasioner " + fmt(pi, 3), "lbl", "end");
      path(p, A, "s1 line"); path(p, B, "s2 line"); A.forEach(function (q) { p.dot(q[0], q[1], "s1 dot", 3); }); B.forEach(function (q) { p.dot(q[0], q[1], "s2 dot", 3); });
      var l2 = 1 - a - b;
      f.out.innerHTML = "P = [[" + fmt(1 - a) + "; " + fmt(a) + "]; [" + fmt(b) + "; " + fmt(1 - b) + "]]. Peluang cerah jangka panjang π = b/(a + b) = <b>" + fmt(pi, 3) + "</b>. Nilai eigen kedua 1 − a − b = <b>" + fmt(l2, 2) + "</b>: selisih ke π dikali angka ini setiap hari. " +
        (l2 < -0.999 ? "Tepat −1: rantai berpindah keadaan setiap hari tanpa henti. Kedua garis bertukar tempat terus dan <b>tidak pernah</b> bertemu di π. Rantai seperti ini disebut periodik." : Math.abs(l2) > 0.9 ? (l2 < 0 ? "Hampir −1: rantai berayun bolak-balik dan lambat mengendap." : "Hampir 1: rantai lambat lupa keadaan awalnya.") : l2 < 0 ? "Negatif: kurva berzig-zag di sekitar π." : "Kurva merayap mulus ke π.");
    }; h._draw();
  };
})();
