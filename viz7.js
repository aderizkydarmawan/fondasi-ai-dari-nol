/* Widget diperdalam (W+) lapis 2–3. Angka contoh dicek dengan Python:
   2.4 jumlah kiri v(t) = t² di [0, 3]: n = 4 → 5,90625; 16 → 8,1738; 256 → 8,9473; tepat 9.
   3.8 matriks pindah kota: distribusi stasioner (9, 12, 7)/28 = 0,3214; 0,4286; 0,25; nilai eigen 1; 0,3; 0,2. */
(function () {
  var V = window.VIZ, W = V.W, el = V.el, fmt = V.fmt, Plane = V.Plane, frame = V.frame, button = V.button, heads = V.heads, tebak = V.tebak, tx = V.tx;

  /* 2.1 Perbesar terus: kurva di sekitar satu titik menjadi lurus, dan kemiringan garis potong menuju satu angka */
  W.zoomTurunan = function (h) {
    var f = frame(h, "f(x) = x² di sekitar x = 1. Perkecil h, lalu perbesar gambarnya", []);
    var hs = [1, 0.1, 0.01, 0.001], ki = 0, zoom = 1, sudah = false;
    button(f, "perkecil h", function () { ki = Math.min(hs.length - 1, ki + 1); h._draw(); });
    button(f, "perbesar gambar ×4", function () { zoom = Math.min(4096, zoom * 4); h._draw(); });
    button(f, "ulang", function () { ki = 0; zoom = 1; h._draw(); });
    tebak(f, "Kemiringan (f(1 + h) − f(1)) / h untuk h = 1; 0,1; 0,01; … menuju angka berapa?", ["2", "2,1", "tidak menuju apa-apa"], 0, "Kemiringannya 2 + h: 3; 2,1; 2,01; 2,001. Makin kecil h, makin dekat ke 2. Itulah turunan x² di x = 1.", function () { sudah = true; h._draw(); });
    h._draw = function () {
      var w = 1.6 / zoom, hh = hs[ki], s = f.svg;
      var p = Plane(s, { x0: 1 - w, x1: 1 + w, y0: 1 - 2 * w, y1: 1 + 2 * w, h: 300, sx: w / 2, sy: w, lx: w, ly: 2 * w });
      p.clear();
      [].forEach.call(s.querySelectorAll(".tick text[text-anchor=end]"), function (t) { if (+t.getAttribute("y") > p.Y(p.o.y0) - 16) t.remove(); });
      p.curve(function (x) { return x * x; }, "s1 line");
      var m = ((1 + hh) * (1 + hh) - 1) / hh;
      p.curve(function (x) { return 1 + m * (x - 1); }, "s2 line dash");
      p.dot(1, 1, "ink dot", 5); if (1 + hh <= 1 + w) p.dot(1 + hh, (1 + hh) * (1 + hh), "s2 dot", 5);
      var baris = hs.slice(0, ki + 1).map(function (q) { return "h = " + fmt(q, 3) + " → " + (sudah || q === 1 ? fmt(((1 + q) * (1 + q) - 1) / q, 4) : "?"); }).join("; ");
      f.out.innerHTML = "Garis putus-putus = garis potong dari x = 1 ke x = 1 + h. " + baris + ". Perbesaran ×" + zoom + (zoom >= 64 ? ": kurvanya sudah tampak lurus, sejajar dengan garis singgung berkemiringan 2." : ".");
    }; h._draw();
  };

  /* 2.4 Persegi panjang makin tipis menuju satu luas */
  W.riemannTebak = function (h) {
    var f = frame(h, "Kecepatan v(t) = t² m/s selama 3 detik. Jarak tempuh = luas di bawah kurva", []);
    var n = 4, sudah = false;
    [4, 16, 256].forEach(function (k) { button(f, k + " persegi panjang", function () { n = k; h._draw(); }); });
    tebak(f, "Berapa meter jarak yang ditempuh?", ["6", "9", "12"], 1, "Jumlah persegi panjang: 5,906 (4 buah), 8,174 (16), 8,947 (256), terus mendekati 9. Integral t² dari 0 sampai 3 = 3³/3 = 9 meter.", function () { sudah = true; h._draw(); });
    var p = Plane(f.svg, { x0: 0, x1: 3.2, y0: 0, y1: 9.6, h: 300, sx: 0.5, sy: 1, lx: 1, ly: 2 });
    h._draw = function () {
      var s = f.svg, dt = 3 / n, sum = 0; p.clear();
      for (var i = 0; i < n; i++) { var t = i * dt, v = t * t; sum += v * dt; if (v > 0) el("rect", { x: p.X(t), y: p.Y(v), width: Math.max(0.5, p.X(dt) - p.X(0) - (n > 64 ? 0 : 1)), height: p.Y(0) - p.Y(v), "class": "s2 area" }, s); }
      p.curve(function (t) { return t * t; }, "s1 line", 0, 3);
      f.out.innerHTML = n + " persegi panjang, lebar masing-masing " + fmt(dt, 4) + " detik. Jumlah luasnya <b>" + fmt(sum, 4) + "</b> meter" + (sudah ? ". Luas tepatnya 9." : ". Tebak dulu luas tepatnya.");
    }; h._draw();
  };

  /* 2.6 Urutan transformasi penting */
  W.urutanTrans = function (h) {
    var f = frame(h, "Kiri: putar 90° lalu lebarkan ×2. Kanan: lebarkan ×2 lalu putar 90°", []);
    var sudah = false, balik = false;
    tebak(f, "Apakah kedua hasil akhirnya sama?", ["sama", "berbeda"], 1, "Urutan yang berbeda memberi bentuk berbeda: yang kiri jadi panjang mendatar, yang kanan jadi tinggi. Dalam matriks, S·R ≠ R·S.", function () { sudah = true; h._draw(); });
    var bb = button(f, "putar balik film (invers)", function () { balik = !balik; bb.textContent = balik ? "jalankan maju lagi" : "putar balik film (invers)"; h._draw(); });
    h._draw = function () {
      var s = f.svg; s.setAttribute("viewBox", "0 0 560 280"); s.innerHTML = "";
      var F = [[0, 0], [0, 2], [1.2, 2], [1.2, 1.7], [0.35, 1.7], [0.35, 1.15], [1, 1.15], [1, 0.85], [0.35, 0.85], [0.35, 0], [0, 0]];
      function R(q) { return [-q[1], q[0]]; } function S(q) { return [2 * q[0], q[1]]; }
      function panel(cx, judul, f1, f2, n1, n2) {
        var u = 26, cy = 150;
        el("line", { x1: cx - 125, x2: cx + 125, y1: cy, y2: cy, "class": "guide" }, s); el("line", { x1: cx, x2: cx, y1: cy - 110, y2: cy + 110, "class": "guide" }, s);
        function poly(pts, cls) { el("polyline", { points: pts.map(function (q) { return (cx + q[0] * u) + "," + (cy - q[1] * u); }).join(" "), "class": cls }, s); }
        poly(F, "faint line");
        if (sudah) { var akhir = F.map(function (q) { return f2(f1(q)); }); poly(balik ? F : akhir, "s1 line"); }
        tx(s, cx, 26, judul, "lbl", "middle"); tx(s, cx, 272, sudah ? (balik ? "dibalik: kembali ke F semula" : n1 + ", lalu " + n2) : "?", "lbl faintt", "middle");
      }
      panel(140, "putar dulu", R, S, "putar", "lebarkan");
      panel(420, "lebarkan dulu", S, R, "lebarkan", "putar");
      f.out.innerHTML = !sudah ? "Tebak dulu. Huruf F tipis adalah bentuk awal." : balik ? "Invers membatalkan setiap langkah dengan urutan terbalik: untuk membatalkan \"putar lalu lebarkan\", sempitkan dulu baru putar mundur. (S·R)⁻¹ = R⁻¹·S⁻¹." : "Kiri: F direbahkan dulu, lalu yang dilebarkan adalah arah mendatar, sehingga F jadi panjang mendatar. Kanan: F dilebarkan dulu, lalu direbahkan, sehingga F jadi tinggi. Matriks S·R = [[0, −2], [1, 0]] berbeda dengan R·S = [[0, −1], [2, 0]].";
    }; h._draw();
  };

  /* 2.9 Histogram sampel mendekati distribusi */
  W.sampelHist = function (h) {
    var f = frame(h, "X = banyak gambar dalam 10 lemparan koin. Ambil sampel dan bandingkan dengan peluang tepatnya (garis)", []);
    var hit = new Array(11).fill(0), N = 0, sudah = false;
    function ambil(k) { for (var j = 0; j < k; j++) { var c = 0; for (var i = 0; i < 10; i++) if (Math.random() < 0.5) c++; hit[c]++; } N += k; h._draw(); }
    [1, 100, 10000].forEach(function (k) { button(f, "ambil " + k.toLocaleString("id"), function () { ambil(k); }); });
    button(f, "kosongkan", function () { hit.fill(0); N = 0; h._draw(); });
    tebak(f, "Kalau sampelnya sangat banyak, histogramnya berbentuk…", ["datar (semua sama)", "gunung dengan puncak di 5", "menumpuk di 0 dan 10"], 1, "Ada lebih banyak cara mendapat 5 gambar (252 cara) daripada 0 gambar (1 cara), jadi histogram besar membentuk gunung yang puncaknya di 5.", function () { sudah = true; h._draw(); });
    var C = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1];
    var p = Plane(f.svg, { x0: -0.7, x1: 10.7, y0: 0, y1: 0.3, h: 280, sx: 1, sy: 0.05 });
    h._draw = function () {
      var s = f.svg; p.clear();
      for (var k = 0; k <= 10; k++) {
        var fr = N ? hit[k] / N : 0;
        if (fr > 0) el("rect", { x: p.X(k - 0.4), y: p.Y(Math.min(fr, 0.3)), width: p.X(0.8) - p.X(0), height: p.Y(0) - p.Y(Math.min(fr, 0.3)), "class": "s1 area" }, s);
        if (sudah) { var pk = C[k] / 1024; p.seg(k - 0.45, pk, k + 0.45, pk, "s2 line"); }
      }
      f.out.innerHTML = N ? N.toLocaleString("id") + " sampel. Frekuensi X = 5: " + fmt(hit[5] / N, 3) + (sudah ? " (peluang tepatnya 252/1024 = 0,246)." : ".") + " Sampel sedikit bergoyang liar, sampel banyak menempel ke garis biru." : "Ambil sampel dengan tombol di bawah.";
    }; h._draw();
  };

  /* 2.12 Kovarians = rata-rata luas persegi bertanda */
  W.kovPersegi = function (h) {
    var f = frame(h, "Seret titik. Setiap titik membentuk persegi panjang dengan titik rata-rata (perpotongan garis putus-putus). Ungu = positif, biru = negatif", []);
    var pts = [[1, 1], [2, 3], [3, 2], [4, 5], [5, 4]];
    button(f, "data naik bersama", function () { pts = [[1, 1], [2, 3], [3, 2], [4, 5], [5, 4]]; h._draw(); });
    button(f, "data berlawanan", function () { pts = [[1, 5], [2, 3], [3, 4], [4, 1], [5, 2]]; h._draw(); });
    var p = Plane(f.svg, { x0: 0, x1: 6, y0: 0, y1: 6, h: 330, sx: 1, sy: 1 });
    V.draggable(f.svg, p, function () { return pts; }, function (i, q) { pts[i] = [Math.max(0, Math.min(6, Math.round(q[0] * 2) / 2)), Math.max(0, Math.min(6, Math.round(q[1] * 2) / 2))]; h._draw(); });
    h._draw = function () {
      var s = f.svg, n = pts.length, mx = 0, my = 0; pts.forEach(function (q) { mx += q[0] / n; my += q[1] / n; });
      p.clear(); var sum = 0, rinci = [];
      pts.forEach(function (q) {
        var a = (q[0] - mx) * (q[1] - my); sum += a; rinci.push(fmt(a, 2));
        el("rect", { x: Math.min(p.X(q[0]), p.X(mx)), y: Math.min(p.Y(q[1]), p.Y(my)), width: Math.abs(p.X(q[0]) - p.X(mx)), height: Math.abs(p.Y(q[1]) - p.Y(my)), "class": (a >= 0 ? "s1" : "s2") + " area" }, s);
      });
      p.seg(mx, 0, mx, 6, "guide"); p.seg(0, my, 6, my, "guide");
      pts.forEach(function (q) { el("circle", { cx: p.X(q[0]), cy: p.Y(q[1]), r: 8, "class": "ink dot handle" }, s); });
      f.out.innerHTML = "Rata-rata (" + fmt(mx, 2) + "; " + fmt(my, 2) + "). Luas bertanda: " + rinci.join(" ; ") + ". Rata-ratanya (dibagi " + n + ") = kovarians <b>" + fmt(sum / n, 3) + "</b>. Banyak persegi ungu → kedua variabel naik bersama; banyak biru → yang satu naik, yang lain turun.";
    }; h._draw();
  };

  /* 3.2 Likelihood: tinggi kurva di setiap titik data, dikalikan */
  W.mleBatang = function (h) {
    var data = [1.2, 2.0, 2.5, 3.1, 3.7];
    var f = frame(h, "Data tetap (titik hitam). Geser rata-rata μ kurva normal (σ = 1); batang = tinggi kurva di setiap data", [{ id: "mu", label: "μ", min: 0, max: 5, step: 0.1, v: 1 }]);
    var sudah = false;
    tebak(f, "Hasil kali tinggi batang paling besar ketika μ ada di…", ["0", "2,5 (rata-rata data)", "3,7 (data terbesar)"], 1, "Untuk distribusi normal, MLE μ adalah rata-rata data: (1,2 + 2 + 2,5 + 3,1 + 3,7)/5 = 2,5.", function () { sudah = true; h._draw(); });
    var p = Plane(f.svg, { x0: -1, x1: 5.5, y0: -0.08, y1: 0.45, h: 300, sx: 1, sy: 0.1 });
    function pdf(x, m) { return Math.exp(-(x - m) * (x - m) / 2) / Math.sqrt(2 * Math.PI); }
    h._draw = function () {
      var m = f.vals.mu, s = f.svg, L = 1, ll = 0; p.clear();
      p.curve(function (x) { return pdf(x, m); }, "s1 line");
      data.forEach(function (x) { var y = pdf(x, m); L *= y; ll += Math.log(y); p.seg(x, 0, x, y, "s2 line thick"); p.dot(x, 0, "ink dot", 5); });
      f.out.innerHTML = "Tinggi batang: " + data.map(function (x) { return fmt(pdf(x, m), 3); }).join(" × ") + " = likelihood <b>" + L.toExponential(3).replace(".", ",") + "</b> (log-likelihood " + fmt(ll, 3) + ")." + (sudah ? " Puncaknya di μ = 2,5, yaitu likelihood 1,56 × 10⁻³ dan log-likelihood −6,46." : "");
    }; h._draw();
  };

  /* 3.3 Dua prior berbeda berkumpul setelah cukup data */
  function lgamma(z) { var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z); z -= 1; var x = c[0]; for (var i = 1; i < g + 2; i++) x += c[i] / (z + i); var t = z + g + 0.5; return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x); }
  function beta(x, a, b) { if (x <= 0 || x >= 1) return 0; return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) + lgamma(a + b) - lgamma(a) - lgamma(b)); }
  W.betaDuaPrior = function (h) {
    var f = frame(h, "Koin dengan peluang gambar 0,3 (rahasia). Dua orang mulai dengan keyakinan berbeda", []);
    var g = 0, a = 0;
    function lempar(k) { for (var i = 0; i < k; i++) if (Math.random() < 0.3) g++; else a++; h._draw(); }
    button(f, "lempar 1", function () { lempar(1); }); button(f, "lempar 10", function () { lempar(10); }); button(f, "lempar 100", function () { lempar(100); });
    button(f, "ulang", function () { g = 0; a = 0; h._draw(); });
    var p = Plane(f.svg, { x0: 0, x1: 1, y0: 0, y1: 10, h: 300, sx: 0.1, sy: 1, lx: 0.2, ly: 2, fit: "y" });
    h._draw = function () {
      p.clear();
      p.curve(function (x) { return beta(x, 1 + g, 1 + a); }, "s1 line", 0.001, 0.999);
      p.curve(function (x) { return beta(x, 8 + g, 2 + a); }, "s2 line dash", 0.001, 0.999);
      p.seg(0.3, 0, 0.3, 10, "guide");
      var m1 = (1 + g) / (2 + g + a), m2 = (8 + g) / (10 + g + a);
      f.out.innerHTML = g + " gambar, " + a + " angka. Ungu (awalnya tidak tahu apa-apa, Beta(1, 1)) menebak <b>" + fmt(m1, 3) + "</b>. Biru putus-putus (awalnya yakin koinnya condong ke gambar, Beta(8, 2)) menebak <b>" + fmt(m2, 3) + "</b>. Makin banyak data, kedua kurva menyempit dan berkumpul di dekat 0,3.";
    }; h._draw();
  };

  /* 3.6 Konvolusi: kernel yang sama di setiap posisi */
  W.konvSel = function (h) {
    var img = [[0, 0, 0, 9, 9, 9], [0, 0, 0, 9, 9, 9], [0, 0, 0, 9, 9, 9], [0, 0, 0, 9, 9, 9], [0, 0, 0, 9, 9, 9], [0, 0, 0, 9, 9, 9]];
    var K = { "tepi tegak": [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], "blur": [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]], "tepi datar": [[-1, -1, -1], [0, 0, 0], [1, 1, 1]] };
    var f = frame(h, "Gambar 6×6 (kiri gelap 0, kanan terang 9). Klik sel keluaran untuk melihat hitungannya", []);
    var kn = "tepi tegak", sel = [0, 1], sudah = false;
    Object.keys(K).forEach(function (k) { button(f, "kernel " + k, function () { kn = k; h._draw(); }); });
    /* catatan: jawaban dihitung ulang di bawah dan teks tebakan diganti supaya konsisten */
    h._draw = function () {
      var s = f.svg, k = K[kn], u = 40, ox = 14, oy = 40, gx = 290; s.setAttribute("viewBox", "0 0 560 300"); s.innerHTML = "";
      var out = [], i, j, a, b;
      for (i = 0; i < 4; i++) { out.push([]); for (j = 0; j < 4; j++) { var t = 0; for (a = 0; a < 3; a++) for (b = 0; b < 3; b++) t += img[i + a][j + b] * k[a][b]; out[i].push(t); } }
      tx(s, ox, 26, "gambar", "lbl"); tx(s, gx, 26, "keluaran (kernel " + kn + ")", "lbl");
      for (i = 0; i < 6; i++) for (j = 0; j < 6; j++) {
        var on = i >= sel[0] && i < sel[0] + 3 && j >= sel[1] && j < sel[1] + 3;
        el("rect", { x: ox + j * u, y: oy + i * u, width: u - 2, height: u - 2, "class": on ? "s2 area" : "cell" }, s);
        tx(s, ox + j * u + (on ? 11 : u / 2 - 1), oy + i * u + (on ? 31 : u / 2 + 5), String(img[i][j]), "lbl", on ? "start" : "middle");
        if (on) { var kw = tx(s, ox + j * u + u - 5, oy + i * u + 13, "×" + fmt(k[i - sel[0]][j - sel[1]], 2), "lbl s2t", "end"); kw.style.fontSize = "10px"; }
      }
      for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) {
        var r = el("rect", { x: gx + j * u * 1.3, y: oy + i * u * 1.3, width: u * 1.3 - 3, height: u * 1.3 - 3, "class": i === sel[0] && j === sel[1] ? "s1 area" : "cell", tabindex: 0, role: "button", "aria-label": "sel keluaran baris " + (i + 1) + " kolom " + (j + 1) }, s);
        r.style.cursor = "pointer";
        (function (i, j) { function pilih() { sel = [i, j]; h._draw(); } r.addEventListener("click", pilih); r.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pilih(); } }); })(i, j);
        tx(s, gx + j * u * 1.3 + u * 0.65 - 1, oy + i * u * 1.3 + u * 0.65 + 5, !sudah && kn === "tepi tegak" && i === 0 && j === 1 ? "?" : fmt(out[i][j], 1), "lbl", "middle");
      }
      var rinci = []; for (a = 0; a < 3; a++) for (b = 0; b < 3; b++) if (k[a][b]) rinci.push(img[sel[0] + a][sel[1] + b] + "×" + fmt(k[a][b], 2));
      f.out.innerHTML = "Sel baris " + (sel[0] + 1) + " kolom " + (sel[1] + 1) + ": " + rinci.join(" + ") + " = <b>" + fmt(out[sel[0]][sel[1]], 2) + "</b>. Kernelnya sama di setiap posisi; yang bergeser hanya jendelanya. Kernel tepi tegak menyala hanya di tempat gelap bertemu terang.";
    };
    /* tebakan yang benar dihitung dari data: jendela kolom 2–4 (indeks 1–3) berisi 0, 0, 9 → −0 + 0 + 9 = 9 per baris → 27 */
    tebak(f, "Kernel tepi tegak (−1, 0, 1 di setiap baris). Sel keluaran baris 1 kolom 2 memakai kolom 2, 3, 4 gambar, yang isinya 0, 0, 9. Nilainya…", ["0", "27", "−27"], 1, "Setiap baris: −1×0 + 0×0 + 1×9 = 9. Tiga baris: 27. Angka besar berarti ada tepi gelap→terang di situ.", function () { sudah = true; sel = [0, 1]; h._draw(); });
    h._draw();
  };

  /* 3.7 Medan arah dan langkah Euler */
  W.medanArah = function (h) {
    var f = frame(h, "dy/dx = x − y. Klik gambar untuk menaruh titik awal. Ungu = solusi tepat, biru = Euler", [{ id: "h", label: "langkah Euler h", min: 0.1, max: 1, step: 0.1, v: 0.5, d: 1 }]);
    var y0 = 3, x0 = -2;
    var p = Plane(f.svg, { x0: -3, x1: 4, y0: -3, y1: 4, h: 340, sx: 1, sy: 1 });
    f.svg.addEventListener("click", function (e) { var pt = f.svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var q = pt.matrixTransform(f.svg.getScreenCTM().inverse()); x0 = Math.round(p.ix(q.x) * 2) / 2; y0 = Math.round(p.iy(q.y) * 2) / 2; h._draw(); });
    h._draw = function () {
      var s = f.svg, st = f.vals.h; p.clear();
      for (var x = -2.75; x < 4; x += 0.5) for (var y = -2.75; y < 4; y += 0.5) { var m = x - y, L = 0.18 / Math.sqrt(1 + m * m); p.seg(x - L, y - m * L, x + L, y + m * L, "faint line"); }
      var C = (y0 - x0 + 1) * Math.exp(x0);
      p.curve(function (x) { return x - 1 + C * Math.exp(-x); }, "s1 line", x0, 4);
      var xe = x0, ye = y0, d = "M" + p.X(xe) + " " + p.Y(ye);
      while (xe < 4 - 1e-9) { ye += st * (xe - ye); xe += st; d += "L" + p.X(xe).toFixed(1) + " " + p.Y(ye).toFixed(1); p.dot(xe, ye, "s2 dot", 3); }
      el("path", { d: d, "class": "s2 line" }, s);
      p.dot(x0, y0, "ink dot", 6);
      var tepat = 4 - 1 + C * Math.exp(-4);
      f.out.innerHTML = "Mulai di (" + fmt(x0, 1) + "; " + fmt(y0, 1) + "). Di x = 4, solusi tepat y = " + fmt(tepat, 3) + ", Euler dengan h = " + fmt(st, 1) + " memberi " + fmt(ye, 3) + " (selisih <b>" + fmt(Math.abs(ye - tepat), 3) + "</b>). Perkecil h: Euler makin menempel. Semua solusi akhirnya mengikuti garis y = x − 1.";
    }; h._draw();
  };

  /* 3.8 Rantai Markov: dari kota mana pun, sebaran akhirnya sama */
  W.markovKota = function (h) {
    var P = [[0.5, 0.3, 0.2], [0.2, 0.6, 0.2], [0.3, 0.3, 0.4]], N = ["A", "B", "C"];
    var f = frame(h, "1000 orang berpindah antar kota setiap hari menurut peluang di panah", []);
    var v, hari, sudah = false;
    function mulai(k) { v = [0, 0, 0]; v[k] = 1000; hari = 0; h._draw(); }
    N.forEach(function (n, k) { button(f, "semua mulai di " + n, function () { mulai(k); }); });
    button(f, "1 hari", function () { langkah(1); }); button(f, "10 hari", function () { langkah(10); });
    function langkah(k) { for (var t = 0; t < k; t++) { var w = [0, 0, 0]; for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) w[j] += v[i] * P[i][j]; v = w; hari++; } h._draw(); }
    tebak(f, "Kalau semua mulai di A, setelah sangat lama kota mana yang paling ramai?", ["A, karena semua mulai di sana", "B", "sama rata, masing-masing 333"], 1, "Sebaran akhirnya kira-kira A 321, B 429, C 250, dan sebaran itu sama dari kota awal mana pun. Coba mulai di C.", function () { sudah = true; h._draw(); });
    h._draw = function () {
      var s = f.svg; s.setAttribute("viewBox", "0 0 560 300"); s.innerHTML = ""; heads(s);
      var pos = [[90, 70], [250, 70], [170, 200]];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) if (i !== j) {
        var a = pos[i], b = pos[j], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 8, ny = dx / L * 8;
        var ln = el("line", { x1: a[0] + dx / L * 30 + nx, y1: a[1] + dy / L * 30 + ny, x2: b[0] - dx / L * 32 + nx, y2: b[1] - dy / L * 32 + ny, "class": "faint line" }, s); ln.setAttribute("marker-end", "url(#ink-head)");
        tx(s, (a[0] + b[0]) / 2 + nx * 3.4, (a[1] + b[1]) / 2 + ny * 3.4 + 4, fmt(P[i][j], 1), "tick lbl", "middle");
      }
      pos.forEach(function (q, k) { el("circle", { cx: q[0], cy: q[1], r: 26, "class": "cell" }, s); tx(s, q[0], q[1] + 5, N[k] + " (" + fmt(P[k][k], 1) + ")", "lbl", "middle"); });
      var bx = 360;
      for (var k = 0; k < 3; k++) { var hgt = v[k] / 1000 * 200; el("rect", { x: bx + k * 62, y: 250 - hgt, width: 44, height: hgt, "class": "s1 fill" }, s); tx(s, bx + k * 62 + 22, 270, N[k], "lbl", "middle"); tx(s, bx + k * 62 + 22, 244 - hgt, fmt(v[k], 0), "lbl s1t", "middle"); if (sudah) { var st = [9, 12, 7][k] / 28 * 200; el("line", { x1: bx + k * 62 - 4, x2: bx + k * 62 + 48, y1: 250 - st, y2: 250 - st, "class": "s2 line" }, s); } }
      f.out.innerHTML = "Hari ke-" + hari + ": A " + fmt(v[0], 1) + ", B " + fmt(v[1], 1) + ", C " + fmt(v[2], 1) + "." + (sudah ? " Garis biru = sebaran stasioner (9, 12, 7)/28 × 1000 = 321,4; 428,6; 250. Ini vektor eigen dengan λ = 1 dari 2.7: mengalikan lagi dengan matriks pindah tidak mengubahnya. Nilai eigen lainnya 0,3 dan 0,2, jadi selisihnya menyusut cepat." : " Angka di lingkaran = peluang tetap tinggal.");
    };
    mulai(0);
  };
})();
