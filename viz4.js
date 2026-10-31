/* Widget Lapis 4. Memakai alat bantu dari viz.js (window.VIZ). */
(function () {
  var V = window.VIZ, W = V.W, Plane = V.Plane, frame = V.frame, button = V.button, el = V.el, fmt = V.fmt;
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function mk(svg, o) { var p = Plane(svg, o); p.svg = svg; return p; }
  function clip(p) { return el("g", { "clip-path": "url(#" + p.svg.querySelector("clipPath").id + ")" }, p.svg); }
  function thin(e) { e.setAttribute("style", "stroke-width:1.3;opacity:.45"); return e; }
  function path(p, pts, cls, g) { return el("path", { d: pts.map(function (q, i) { return (i ? "L" : "M") + p.X(q[0]).toFixed(1) + " " + p.Y(q[1]).toFixed(1); }).join(""), "class": cls }, g || p.svg); }
  function bar(p, x0, x1, y, cls) { return el("rect", { x: p.X(x0), y: p.Y(Math.max(y, 0)), width: p.X(x1) - p.X(x0), height: Math.abs(p.Y(y) - p.Y(0)), "class": cls }, p.svg); }
  function boltz(E, T) { var w = E.map(function (e) { return Math.exp(-e / T); }), z = w.reduce(function (s, x) { return s + x; }, 0); return { p: w.map(function (x) { return x / z; }), Z: z }; }

  /* 4.1 tangga energi dan suhu */
  W.boltz = function (h) {
    var f = frame(h, "Enam keadaan berenergi 0 sampai 5. Atur suhu kT dan lihat peluang setiap keadaan", [{ id: "T", label: "suhu kT", min: 0.1, max: 10, step: 0.1, v: 1, d: 1 }]);
    var E = [0, 1, 2, 3, 4, 5], p = mk(f.svg, { x0: -0.5, x1: 5.5, y0: 0, y1: 1, h: 280, sx: 1, sy: 0.25 });
    h._draw = function () {
      var T = f.vals.T, b = boltz(E, T), mE = 0; p.clear();
      b.p.forEach(function (q, i) { bar(p, i - 0.35, i + 0.35, q, i === 0 ? "s1 area" : "s2 area"); p.text(i, q + 0.03, fmt(q, 3), "lbl", "middle"); mE += q * E[i]; });
      f.out.innerHTML = "Rasio peluang dua keadaan bertetangga = e<sup>−1/kT</sup> = <b>" + fmt(Math.exp(-1 / T), 3) + "</b>. Peluang keadaan terendah " + fmt(b.p[0], 3) + ", energi rata-rata <b>" + fmt(mE, 2) + "</b>. " +
        (T < 0.4 ? "Dingin: hampir pasti di dasar." : T > 5 ? "Panas: semua keadaan hampir sama sering, energi rata-rata mendekati 2,5 (tengah-tengah)." : "Di antara: keadaan rendah lebih sering, tapi atas tetap dikunjungi.");
    }; h._draw();
  };

  /* 4.2 softmax dengan suhu */
  W.softmax = function (h) {
    var f = frame(h, "Atur tiga logit (skor mentah) dan suhu T. Batang = peluang softmax", [{ id: "a", label: "logit z₁", min: -3, max: 5, step: 0.1, v: 2, d: 1 }, { id: "b", label: "logit z₂", min: -3, max: 5, step: 0.1, v: 1, d: 1 }, { id: "c", label: "logit z₃", min: -3, max: 5, step: 0.1, v: 0.1, d: 1 }, { id: "T", label: "suhu T", min: 0.1, max: 5, step: 0.1, v: 1, d: 1 }]);
    var p = mk(f.svg, { x0: -0.5, x1: 2.5, y0: 0, y1: 1, h: 260, sx: 1, sy: 0.25 });
    h._draw = function () {
      var z = [f.vals.a, f.vals.b, f.vals.c], T = f.vals.T, b = boltz(z.map(function (v) { return -v; }), T), H = 0; p.clear();
      b.p.forEach(function (q, i) { bar(p, i - 0.3, i + 0.3, q, "s1 area"); p.text(i, q + 0.03, fmt(q, 3), "lbl", "middle"); p.text(i, -0.07, "pilihan " + (i + 1), "lbl", "middle"); H -= q * Math.log2(q); });
      f.out.innerHTML = "softmax(z/T) = [" + b.p.map(function (q) { return fmt(q, 3); }).join("; ") + "]. Entropi = <b>" + fmt(H, 2) + "</b> bit (maksimum log₂3 ≈ 1,58). " +
        (T < 0.4 ? "Suhu rendah: hampir argmax, model nyaris selalu memilih yang teratas." : T > 2.5 ? "Suhu tinggi: peluang mendekati rata, teks jadi beragam tapi bisa ngawur." : "Urutan pilihan tidak pernah berubah oleh suhu; hanya ketajamannya.");
    }; h._draw();
  };

  /* 4.3 energi bebas sebuah tebakan q */
  W.freeen = function (h) {
    var f = frame(h, "Energi 0, 1, 2. Atur bobot tebakan q (ungu). Biru muda = distribusi Boltzmann p. Buat F[q] sekecil mungkin", [{ id: "a", label: "bobot q₁", min: 0, max: 20, step: 1, v: 1, d: 0 }, { id: "b", label: "bobot q₂", min: 0, max: 20, step: 1, v: 1, d: 0 }, { id: "c", label: "bobot q₃", min: 0, max: 20, step: 1, v: 1, d: 0 }, { id: "T", label: "suhu kT", min: 0.2, max: 5, step: 0.1, v: 1, d: 1 }]);
    var E = [0, 1, 2], p = mk(f.svg, { x0: -0.5, x1: 2.5, y0: 0, y1: 1, h: 260, sx: 1, sy: 0.25 });
    h._draw = function () {
      var w = [f.vals.a, f.vals.b, f.vals.c], s = w[0] + w[1] + w[2] || 1, q = w.map(function (x) { return x / s; }), T = f.vals.T, B = boltz(E, T), mE = 0, Hq = 0, kl = 0; p.clear();
      if (!(w[0] + w[1] + w[2])) q = [1 / 3, 1 / 3, 1 / 3];
      q.forEach(function (v, i) { bar(p, i - 0.38, i - 0.02, v, "s1 area"); bar(p, i + 0.02, i + 0.38, B.p[i], "s2 area"); p.text(i, -0.07, "E = " + E[i], "lbl", "middle"); mE += v * E[i]; if (v > 0) { Hq -= v * Math.log(v); kl += v * Math.log(v / B.p[i]); } });
      var Fq = mE - T * Hq, F = -T * Math.log(B.Z);
      f.out.innerHTML = "⟨E⟩<sub>q</sub> = " + fmt(mE, 3) + ", H(q) = " + fmt(Hq, 3) + ", F[q] = ⟨E⟩ − kT·H = <b>" + fmt(Fq, 3) + "</b>. Minimum F = −kT ln Z = <b>" + fmt(F, 3) + "</b>. Selisih " + fmt(Fq - F, 3) + " = kT·KL(q‖p) = " + fmt(T * kl, 3) + "." + (Fq - F < 0.002 ? " q sudah sama dengan Boltzmann." : "");
    }; h._draw();
  };

  /* 4.4 jalan acak dan amplop √n */
  W.walk = function (h) {
    var f = frame(h, "40 pemabuk, masing-masing melangkah ±1. Garis putus-putus = ±√n dan ±2√n", [{ id: "n", label: "langkah n", min: 10, max: 400, step: 10, v: 100, d: 0 }]);
    var p = mk(f.svg, { x0: 0, x1: 400, y0: -50, y1: 50, h: 320, sx: 50, sy: 10, lx: 100, ly: 20 }), seed = 3, Wk = [];
    function gen() { var r = rng(seed); Wk = []; for (var k = 0; k < 40; k++) { var x = 0, a = [[0, 0]]; for (var i = 1; i <= 400; i++) { x += r() < 0.5 ? 1 : -1; a.push([i, x]); } Wk.push(a); } }
    h._draw = function () {
      var n = f.vals.n, g, Y = Math.max(10, Math.ceil(3 * Math.sqrt(n) / 5) * 5); p.o.x1 = n; p.o.sx = n / 4; p.o.lx = n / 4; p.o.y0 = -Y; p.o.y1 = Y; p.o.sy = p.o.ly = Y / 2; p.clear(); g = clip(p);
      Wk.forEach(function (a) { thin(path(p, a.slice(0, n + 1), "s1 line", g)); });
      [1, -1, 2, -2].forEach(function (c) { p.curve(function (t) { return c * Math.sqrt(t); }, "s2 line dash", 0, n); });
      var s = 0, inside = 0; Wk.forEach(function (a) { var v = a[n][1]; s += v * v; if (Math.abs(v) <= Math.sqrt(n)) inside++; p.dot(n, v, "s1 dot", 3); });
      f.out.innerHTML = "Setelah n = " + n + " langkah: simpangan baku 40 pemabuk ≈ <b>" + fmt(Math.sqrt(s / 40), 1) + "</b>, teori √n = <b>" + fmt(Math.sqrt(n), 1) + "</b>. " + inside + " dari 40 ada di dalam ±√n (teori sekitar 68%). Waktu 4 kali lipat → jarak 2 kali lipat.";
    };
    button(f, "Acak ulang", function () { seed++; gen(); h._draw(); });
    gen(); h._draw();
  };

  /* 4.5 proses Ornstein–Uhlenbeck */
  W.ou = function (h) {
    var f = frame(h, "dX = −κX dt + σ dW, mulai X = 3. Ungu tipis = 20 lintasan, putus-putus = rata-rata ± 2 simpangan baku dari rumus", [{ id: "th", label: "tarikan κ", min: 0, max: 3, step: 0.1, v: 1, d: 1 }, { id: "s", label: "derau σ", min: 0, max: 2, step: 0.1, v: 1, d: 1 }]);
    var p = mk(f.svg, { x0: 0, x1: 8, y0: -4, y1: 5, h: 320, sx: 1, sy: 1, lx: 2, ly: 2 }), seed = 5;
    h._draw = function () {
      var th = f.vals.th, s = f.vals.s, dt = 0.02, r = rng(seed), g, k, i; p.clear(); g = clip(p);
      var m = function (t) { return 3 * Math.exp(-th * t); }, v = function (t) { return th > 1e-9 ? s * s / (2 * th) * (1 - Math.exp(-2 * th * t)) : s * s * t; };
      for (k = 0; k < 20; k++) { var x = 3, a = [[0, 3]]; for (i = 1; i <= 400; i++) { x += -th * x * dt + s * Math.sqrt(dt) * gauss(r); a.push([i * dt, x]); } thin(path(p, a, "s1 line", g)); }
      p.curve(m, "ink line"); p.curve(function (t) { return m(t) + 2 * Math.sqrt(v(t)); }, "s2 line dash"); p.curve(function (t) { return m(t) - 2 * Math.sqrt(v(t)); }, "s2 line dash");
      f.out.innerHTML = (th > 1e-9 ? "Varians stasioner σ²/(2κ) = <b>" + fmt(s * s / (2 * th), 3) + "</b>. Rata-rata meluruh seperti 3e<sup>−κt</sup>; setelah t ≈ " + fmt(2.3 / th, 1) + " titik awal praktis terlupakan." : "κ = 0: tidak ada tarikan, X murni gerak Brown dan variansnya σ²t terus membesar, tanpa distribusi stasioner.") + (s === 0 ? " σ = 0: tanpa derau, persis ODE peluruhan dari 3.7." : "");
    };
    button(f, "Acak ulang", function () { seed++; h._draw(); });
    h._draw();
  };

  /* 4.6 persamaan panas / Fokker–Planck */
  W.heat = function (h) {
    var f = frame(h, "Kepadatan peluang yang dimulai sebagai paku. Tanpa drift = persamaan panas (D = 1); dengan drift = Fokker–Planck untuk OU (κ = 1, σ = 1)", [{ id: "t", label: "waktu t", min: 0.02, max: 4, step: 0.02, v: 0.5 }]);
    var p = mk(f.svg, { x0: -5, x1: 5, y0: 0, y1: 1.2, h: 300, sx: 1, sy: 0.2 }), drift = false, start = 0;
    function N(x, m, v) { return Math.exp(-(x - m) * (x - m) / (2 * v)) / Math.sqrt(2 * Math.PI * v); }
    h._draw = function () {
      var t = f.vals.t, m, v; p.clear();
      if (drift) { m = start * Math.exp(-t); v = 0.5 * (1 - Math.exp(-2 * t)); p.curve(function (x) { return N(x, 0, 0.5); }, "s2 line dash"); }
      else { m = start; v = 2 * t; }
      [0.25, 0.5].forEach(function (frac) { var tt = t * frac, mm = drift ? start * Math.exp(-tt) : start, vv = drift ? 0.5 * (1 - Math.exp(-2 * tt)) : 2 * tt; p.curve(function (x) { return N(x, mm, vv); }, "faint line"); });
      p.curve(function (x) { return N(x, m, v); }, "s1 line"); p.seg(m, 0, m, Math.min(1.15, N(m, m, v)), "guide");
      f.out.innerHTML = (drift ? "Fokker–Planck (drift −x, σ = 1): pusat = " + fmt(start, 0) + "·e<sup>−t</sup> = <b>" + fmt(m, 3) + "</b>, varians = ½(1 − e<sup>−2t</sup>) = <b>" + fmt(v, 3) + "</b>. Garis putus-putus = keseimbangan N(0; 0,5)." : "Persamaan panas dengan D = 1: varians = 2Dt = <b>" + fmt(v, 2) + "</b>, simpangan baku <b>" + fmt(Math.sqrt(v), 2) + "</b>. Puncak turun, kurva melebar, luas tetap 1.") + " Garis pudar = kurva pada t/4 dan t/2.";
    };
    button(f, "Tanpa drift", function () { drift = false; start = 0; h._draw(); });
    button(f, "Dengan drift, mulai di 3", function () { drift = true; start = 3; h._draw(); });
    h._draw();
  };

  /* 4.7 Euler vs leapfrog di ruang fase */
  W.hamil = function (h) {
    var f = frame(h, "Pegas H = (p² + q²)/2 di ruang (q, p). Putus-putus = lintasan sebenarnya. Ungu = Euler, biru muda = leapfrog", [{ id: "dt", label: "langkah Δt", min: 0.02, max: 0.6, step: 0.02, v: 0.1 }, { id: "n", label: "banyak langkah", min: 10, max: 300, step: 10, v: 100, d: 0 }]);
    var p = mk(f.svg, { x0: -3.2, x1: 3.2, y0: -2.4, y1: 2.4, h: 360, w: 480, sx: 1, sy: 1 });
    h._draw = function () {
      var dt = f.vals.dt, n = f.vals.n, q = 1, pp = 0, A = [[1, 0]], B = [[1, 0]], i, g; p.clear(); g = clip(p);
      p.curve(function (x) { return Math.sqrt(Math.max(0, 1 - x * x)); }, "ink line dash", -1, 1); p.curve(function (x) { return -Math.sqrt(Math.max(0, 1 - x * x)); }, "ink line dash", -1, 1);
      for (i = 0; i < n; i++) { var q2 = q + dt * pp; pp = pp - dt * q; q = q2; A.push([q, pp]); } var Ee = 0.5 * (q * q + pp * pp);
      q = 1; pp = 0; for (i = 0; i < n; i++) { pp -= dt / 2 * q; q += dt * pp; pp -= dt / 2 * q; B.push([q, pp]); } var El = 0.5 * (q * q + pp * pp);
      path(p, A, "s1 line", g); path(p, B, "s2 line", g); p.text(3, -2.2, "q (posisi)", "lbl", "end"); p.text(0.1, 2.2, "p (momentum)", "lbl");
      f.out.innerHTML = "Energi awal 0,5. Setelah " + n + " langkah: Euler <b>" + fmt(Ee, 4) + "</b> (dikali (1 + Δt²) = " + fmt(1 + dt * dt, 4) + " setiap langkah), leapfrog <b>" + fmt(El, 4) + "</b>. Biaya per langkah sama; hanya urutan hitungannya yang berbeda.";
    }; h._draw();
  };
})();
