/* Cerita bergerak (scrollytelling): gambar menempel di layar dan berubah mengikuti scroll.
   Semua posisi dihitung dari matematika yang sebenarnya, bukan sekadar hiasan. */
(function () {
  var V = window.VIZ, W = V.W, el = V.el;
  var kurangGerak = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ease(u) { u = clamp(u, 0, 1); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  function seg(t, a, b) { return ease((t - a) / (b - a)); }

  /* Kerangka umum: kartu teks di satu kolom, gambar menempel di kolom lain. draw(t) dipanggil dengan t = 0 … n−1. */
  function cerita(host, kartu, draw) {
    host.classList.add("story");
    var fig = document.createElement("div"); fig.className = "st-fig";
    var svg = el("svg", { role: "img" }, fig);
    var lst = document.createElement("div"); lst.className = "st-steps";
    kartu.forEach(function (k, i) { var d = document.createElement("div"); d.className = "st-step"; d.innerHTML = '<div class="st-card"><span class="st-no">' + (i + 1) + "/" + kartu.length + "</span>" + k + "</div>"; lst.appendChild(d); });
    host.appendChild(fig); host.appendChild(lst);
    var n = kartu.length, last = -1, antri = false, kini = 0, tuju = 0, jalan = false;
    /* t yang tampil mengejar t dari scroll dengan pegas lembut, jadi gerakannya mengalir, tidak patah-patah */
    /* frame berikutnya; setTimeout sebagai cadangan kalau tab sedang diperlambat browser */
    function jadwal() { var sdh = false; function go() { if (!sdh) { sdh = true; langkah(); } } requestAnimationFrame(go); setTimeout(go, 40); }
    function langkah() {
      var d = tuju - kini;
      kini = Math.abs(d) < 0.002 ? tuju : kini + d * 0.09;
      if (Math.abs(kini - last) > 1e-4) { last = kini; draw(svg, kini); }
      if (kini !== tuju) jadwal(); else jalan = false;
    }
    function hitung() {
      antri = false;
      if (!host.isConnected) { window.removeEventListener("scroll", tunda, true); return; }
      /* t dihitung dari posisi tengah kartu yang sebenarnya: t = i tepat saat kartu ke-i ada di garis baca (55% tinggi layar) */
      var vh = window.innerHeight, garis = vh * 0.55, c = [].map.call(lst.children, function (d) { var q = d.querySelector(".st-card").getBoundingClientRect(); return q.top + q.height / 2; }), t = 0;
      if (garis <= c[0]) t = 0; else if (garis >= c[n - 1]) t = n - 1;
      else for (var i = 0; i < n - 1; i++) if (garis < c[i + 1]) { t = i + (garis - c[i]) / (c[i + 1] - c[i]); break; }
      [].forEach.call(lst.children, function (c, i) { c.classList.toggle("on", Math.abs(t - i) < 0.5); });
      if (kurangGerak) { t = Math.round(t); if (t !== last) { last = kini = tuju = t; draw(svg, t); } return; }
      tuju = t; if (!jalan) { jalan = true; jadwal(); }
    }
    function tunda() { if (!antri) { antri = true; requestAnimationFrame(hitung); } }
    window.addEventListener("scroll", tunda, { passive: true, capture: true });
    window.addEventListener("resize", tunda);
    draw(svg, 0); setTimeout(hitung, 50);
    return { ulang: function () { last = kini; draw(svg, kini); }, kartu: lst, svg: svg };
  }

  /* 2.7 Eigen. Kalimat inti: "lihat arah y = x tetap sementara hampir semua panah lain berbelok".
     Salah paham yang diluruskan: matriks bukan sekadar tabel angka, ia memindahkan (dan membelokkan) setiap panah.
     Angka dicek dengan Python (2 Nov 2026):
       A(1,0) = (2,1), A(1,1) = (3,3), A(1,-1) = (1,-1)
       belokan tiap 22,5°: 26,57 14,64 0 −14,64 −26,57 −28,68 0 28,68 … ; terbesar 30° di arah 165°; nol tepat di 45°, 135°, 225°, 315°
       iterasi dari (1,0): sudut 26,57 → 38,66 → 42,88 → 44,29 → 44,76 → 44,92; panjang per langkah 2,236 → 2,864 → 2,984 → 2,998 → 3 */
  W.eigenStory = function (host) {
    var tebak = null, A = [[2, 1], [1, 2]], U = [[2, 1], [1, 2]], jejak = [[1, 0]], alih = null, seret = -1;
    var kartu = [
      "<b>Satu panah dulu.</b> Ini panah (1, 0), menunjuk lurus ke kanan. Matriks A = [[2, 1], [1, 2]] akan memindahkannya. Perhatikan panah oranye ini saja.",
      "<b>Hitung dengan tangan.</b> A·(1, 0) = (2·1 + 1·0, 1·1 + 2·0) = <b>(2, 1)</b>. Perhatikan busur kecil di pangkalnya: panah ini tidak hanya memanjang, arahnya juga <b>berbelok</b> sekitar 26,6°.",
      "<b>Sekarang tebak.</b> Di gambar ada 16 panah ke segala arah. Kalau semuanya dikali A, menurutmu panah mana yang <b>tidak berbelok</b>?<div class=\"st-tebak\" role=\"group\" aria-label=\"pilihan tebakan\"><button type=\"button\" data-v=\"(0, 1)\">↑ (0, 1)</button><button type=\"button\" data-v=\"(1, 1)\">↗ (1, 1)</button><button type=\"button\" data-v=\"(−1, 1)\">↖ (−1, 1)</button><button type=\"button\" data-v=\"tidak ada\">tidak ada</button></div><span class=\"st-hasil\"></span>",
      "<b>Tarik karetnya.</b> Seluruh lembar dikali A sekaligus. Busur di tiap pangkal menunjukkan seberapa jauh panah itu berbelok, dan grafik di bawah merangkum belokan semua arah: makin jauh dari garis nol, makin jauh belokannya.",
      "<b>Kamera mundur.</b> Panahnya tidak berubah apa-apa, kita hanya menjauh supaya seluruh tarikan terlihat.",
      "<b>Dua arah yang setia.</b> Grafik belokan menyentuh nol tepat di empat titik: 45°, 135°, 225°, 315°, yaitu dua garis. (1, 1) menjadi (3, 3): arahnya tetap, panjangnya <b>3 kali</b>. (1, −1) menjadi (1, −1): tidak berubah sama sekali, <b>1 kali</b>. Arah seperti ini disebut <mark>vektor eigen</mark>, dan 3 serta 1 adalah <mark>nilai eigen</mark>-nya.<span class=\"st-cek\"></span>",
      "<b>Baru sekarang rumusnya.</b> A v = λ v artinya menarik v dengan A hasilnya sama dengan sekadar memanjangkan v sebanyak λ kali. Untuk v = (1, 1): A v = (3, 3) = 3 · (1, 1).",
      "<b>Giliranmu.</b> Seret dua titik bulat di gambar (ke mana (1, 0) dan (0, 1) dikirim), atau ketik angkanya. Lalu tekan <b>kalikan lagi</b> berkali-kali: panah (1, 0) dikali matriks berulang-ulang dan pelan-pelan menempel ke arah eigen yang nilai eigennya paling besar.<div class=\"st-mat\">[[<input data-i=\"00\" value=\"2\" inputmode=\"decimal\" aria-label=\"baris 1 kolom 1\">, <input data-i=\"01\" value=\"1\" inputmode=\"decimal\" aria-label=\"baris 1 kolom 2\">], [<input data-i=\"10\" value=\"1\" inputmode=\"decimal\" aria-label=\"baris 2 kolom 1\">, <input data-i=\"11\" value=\"2\" inputmode=\"decimal\" aria-label=\"baris 2 kolom 2\">]]</div><button type=\"button\" class=\"st-lagi\">kalikan lagi</button> <button type=\"button\" class=\"st-ulang\">mulai dari (1, 0)</button><span class=\"st-info\" aria-live=\"polite\"></span>"
    ];
    var Wd = 520, Hd = 480, Hp = 400, cx = Wd / 2, cy = Hp / 2, k = 108;
    function X(x) { return cx + x * k; } function Y(y) { return cy - y * k; }
    function kali(Mx, v) { return [Mx[0][0] * v[0] + Mx[0][1] * v[1], Mx[1][0] * v[0] + Mx[1][1] * v[1]]; }
    function M(Mx, s, v) { var w = kali(Mx, v); return [v[0] + s * (w[0] - v[0]), v[1] + s * (w[1] - v[1])]; } /* (I + s(A − I))v */
    function sdt(v) { return Math.atan2(v[1], v[0]); }
    function bungkus(d) { while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI; return d; }
    function belok(Mx, s, th) { var v = [Math.cos(th), Math.sin(th)], w = M(Mx, s, v); return Math.hypot(w[0], w[1]) < 1e-9 ? 0 : bungkus(sdt(w) - th); }
    function eigArah(Mx) {
      var a = Mx[0][0], b = Mx[0][1], c = Mx[1][0], d = Mx[1][1], tr = a + d, D = tr * tr - 4 * (a * d - b * c), out = [];
      if (D < -1e-9) return out;
      [(tr + Math.sqrt(Math.max(D, 0))) / 2, (tr - Math.sqrt(Math.max(D, 0))) / 2].forEach(function (L, i) {
        var v = Math.abs(b) > 1e-9 ? [b, L - a] : Math.abs(c) > 1e-9 ? [L - d, c] : (i ? [0, 1] : [1, 0]), n = Math.hypot(v[0], v[1]);
        if (!(i && D < 1e-9 && (Math.abs(b) > 1e-9 || Math.abs(c) > 1e-9))) out.push({ v: [v[0] / n, v[1] / n], L: L }); /* satu arah saja kalau λ kembar */
      });
      return out;
    }
    function fmt(x, n) { var p = Math.pow(10, n == null ? 2 : n); return (Math.round(x * p) / p).toString().replace("-", "−").replace(".", ","); }
    function titik(v, n) { return "(" + fmt(v[0], n) + ", " + fmt(v[1], n) + ")"; }
    function ez(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
    function panah(g, a, b, warna, lebar, op, garis) {
      if (op <= 0.005) return;
      var x1 = X(a[0]), y1 = Y(a[1]), x2 = X(b[0]), y2 = Y(b[1]), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, h = 7 + lebar;
      el("line", { x1: x1, y1: y1, x2: x2 - ux * h * 0.6, y2: y2 - uy * h * 0.6, style: "stroke:" + warna + ";stroke-width:" + lebar + ";stroke-linecap:round;opacity:" + op + (garis ? ";stroke-dasharray:" + garis : "") }, g);
      el("polygon", { points: [x2, y2, x2 - ux * h - uy * h * 0.5, y2 - uy * h + ux * h * 0.5, x2 - ux * h + uy * h * 0.5, y2 - uy * h - ux * h * 0.5].join(" "), style: "fill:" + warna + ";opacity:" + op }, g);
    }
    function sinar(g, b, warna, op) { /* cahaya lembut di bawah panah eigen */
      if (op <= 0.01) return;
      el("line", { x1: X(0), y1: Y(0), x2: X(b[0]), y2: Y(b[1]), style: "stroke:" + warna + ";stroke-width:12;stroke-linecap:round;opacity:" + 0.18 * op }, g);
    }
    /* teks yang muncul dengan memudar sambil naik sedikit, bukan meloncat */
    function teks(g, x, y, s, warna, uk, op, anchor, px) {
      if (op <= 0.01) return null;
      var t = el("text", { x: px ? x : X(x), y: (px ? y : Y(y)) + (1 - op) * 7, "text-anchor": anchor || "middle", style: "fill:" + warna + ";font-size:" + uk + "px;opacity:" + op + ";font-weight:600;paint-order:stroke;stroke:var(--bg);stroke-width:4px" }, g);
      if (typeof s === "string") t.textContent = s; else s.forEach(function (p) { var ts = el("tspan", { style: "fill:" + p[1] + ";white-space:pre" }, t); ts.textContent = p[0]; });
      return t;
    }
    /* busur belokan di pangkal panah: dari arah semula ke arah baru */
    function busur(g, th0, d, r, warna, op) {
      if (op <= 0.01 || Math.abs(d) < 0.004) return;
      var n = Math.max(2, Math.ceil(Math.abs(d) / 0.05)), pts = [];
      for (var i = 0; i <= n; i++) { var a = th0 + d * i / n; pts.push(X(r * Math.cos(a)) + "," + Y(r * Math.sin(a))); }
      el("polyline", { points: pts.join(" "), style: "fill:none;stroke:" + warna + ";stroke-width:2;stroke-linecap:round;opacity:" + op }, g);
    }
    function lembar(g, Mx, s) {
      var sd = [[-5, -5], [5, -5], [5, 5], [-5, 5]].map(function (v) { return M(Mx, s, v); });
      el("polygon", { points: sd.map(function (q) { return X(q[0]) + "," + Y(q[1]); }).join(" "), style: "fill:var(--s1);opacity:.07" }, g);
      for (var i = -5; i <= 5; i += 0.5) {
        var a = M(Mx, s, [i, -5]), b = M(Mx, s, [i, 5]), c = M(Mx, s, [-5, i]), d = M(Mx, s, [5, i]), tb = i % 1 === 0 ? 0.2 : 0.1;
        el("line", { x1: X(a[0]), y1: Y(a[1]), x2: X(b[0]), y2: Y(b[1]), style: "stroke:var(--s1);opacity:" + tb }, g);
        el("line", { x1: X(c[0]), y1: Y(c[1]), x2: X(d[0]), y2: Y(d[1]), style: "stroke:var(--s1);opacity:" + tb }, g);
      }
    }
    /* grafik belokan: sumbu x = arah semula 0°–360°, sumbu y = berapa derajat arah itu dibelokkan */
    function grafik(g, Mx, s, op, sorotNol) {
      if (op <= 0.01) return;
      var x0 = 44, x1 = Wd - 16, yt = Hp + 18, yb = Hd - 22, ym = (yt + yb) / 2, maks = Math.PI / 6;
      var data = [];
      for (var i = 0; i <= 180; i++) { var th = i / 180 * 2 * Math.PI, b = belok(Mx, s, th); data.push([th, b]); maks = Math.max(maks, Math.abs(b)); }
      function GX(th) { return x0 + (x1 - x0) * th / (2 * Math.PI); } function GY(b) { return ym - (yb - yt) / 2 * b / maks; }
      var gg = el("g", { style: "opacity:" + op }, g);
      el("line", { x1: x0, y1: ym, x2: x1, y2: ym, style: "stroke:var(--muted,#888);opacity:.5" }, gg);
      [0, 90, 180, 270, 360].forEach(function (dg) { var t = el("text", { x: GX(dg * Math.PI / 180), y: yb + 12, "text-anchor": "middle", style: "fill:var(--muted,#888);font-size:10px" }, gg); t.textContent = dg + "°"; });
      var tl = el("text", { x: x0 - 6, y: ym + 4, "text-anchor": "end", style: "fill:var(--muted,#888);font-size:10px" }, gg); tl.textContent = "0°";
      var tt = el("text", { x: x0, y: yt - 4, style: "fill:var(--muted,#888);font-size:11px;font-weight:600" }, gg); tt.textContent = "belokan tiap arah (maks " + fmt(maks * 180 / Math.PI, 0) + "°)";
      var pts = [], prev = null;
      data.forEach(function (p) { if (prev && Math.abs(p[1] - prev[1]) > Math.PI) { el("polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--s1);stroke-width:2" }, gg); pts = []; } pts.push(GX(p[0]) + "," + GY(p[1])); prev = p; });
      el("polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--s1);stroke-width:2" }, gg);
      for (var j = 0; j < 16; j++) { var th = j * Math.PI / 8; el("circle", { cx: GX(th), cy: GY(belok(Mx, s, th)), r: j === 0 ? 4 : 2.5, style: "fill:" + (j === 0 ? "var(--warn)" : "var(--s1)") }, gg); }
      if (sorotNol > 0.01) eigArah(Mx).forEach(function (e) {
        var th = ((sdt(e.v) % Math.PI) + Math.PI) % Math.PI;
        [th, th + Math.PI].forEach(function (a) {
          el("circle", { cx: GX(a), cy: GY(belok(Mx, s, a)), r: 6, style: "fill:none;stroke:var(--s2);stroke-width:2;opacity:" + sorotNol }, gg);
          var t = el("text", { x: GX(a), y: GY(belok(Mx, s, a)) - 10, "text-anchor": "middle", style: "fill:var(--s2);font-size:11px;font-weight:700;opacity:" + sorotNol }, gg); t.textContent = fmt(a * 180 / Math.PI, 0) + "°";
        });
      });
    }
    var ALT = ["Satu panah oranye (1, 0) menunjuk ke kanan.", "Panah (1, 0) dikali A menjadi (2, 1) dan berbelok sekitar 26,6 derajat.", "Enam belas panah ke segala arah dari titik tengah.", "Seluruh lembar ditarik matriks A; busur menunjukkan belokan tiap panah, grafik di bawah merangkumnya.", "Pandangan menjauh supaya seluruh tarikan terlihat.", "Grafik belokan nol di 45, 135, 225, 315 derajat: garis y = x memanjang 3 kali, garis y = −x tetap.", "Rumus A v = lambda v."];
    var C = cerita(host, kartu, function (svg, t) {
      svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = "";
      var dfs = el("defs", {}, svg), cp = el("clipPath", { id: "stclip" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hp }, cp);
      var rg = el("radialGradient", { id: "stfade", cx: "50%", cy: "50%", r: "50%" }, dfs);
      el("stop", { offset: "70%", "stop-color": "#fff" }, rg); el("stop", { offset: "100%", "stop-color": "#000" }, rg);
      var mk = el("mask", { id: "stmask" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hp, fill: "url(#stfade)" }, mk);
      var gTop = el("g", { "clip-path": "url(#stclip)" }, svg), g = el("g", { mask: "url(#stmask)" }, gTop), gBawah = el("g", {}, svg);
      /* tahap: 0 satu panah · 1 hitung · 2 tebak · 3 tarik · 4 kamera · 5 setia · 6 rumus · 7 giliranmu. Satu perubahan per tahap. */
      var hit = seg(t, 0.2, 1), muncul = seg(t, 1.3, 2), s = seg(t, 2.2, 3), kam = seg(t, 3.2, 4), terang = seg(t, 4.2, 5), rumus = seg(t, 5.2, 6), main = seg(t, 6.2, 6.9);
      k = 108 - 44 * kam;
      svg.style.touchAction = main > 0.5 ? "none" : "";
      var Mx = main > 0 ? U : A, gr = seg(t, 2.1, 2.6);
      lembar(g, Mx, s);
      /* garis eigen */
      var eg = eigArah(Mx), terangE = main > 0 ? 1 : terang;
      eg.forEach(function (e) { el("line", { x1: X(-6 * e.v[0]), y1: Y(-6 * e.v[1]), x2: X(6 * e.v[0]), y2: Y(6 * e.v[1]), style: "stroke:var(--s2);stroke-dasharray:5 6;opacity:" + 0.6 * terangE }, g); });
      var fokus = 1 - 0.75 * terang * (1 - main); /* panah biasa meredup saat dua arah setia disorot */
      /* 16 panah: 15 muncul di tahap tebak, panah (1, 0) sudah ada sejak awal */
      for (var j = 1; j < 16; j++) {
        var ang = j * Math.PI / 8, v0 = [Math.cos(ang), Math.sin(ang)], w = M(Mx, s, v0), d = belok(Mx, s, ang), eig = Math.abs(belok(Mx, 1, ang)) < 1e-6;
        var op = muncul * (1 - 0.78 * main);
        if (s > 0.02 && !eig) panah(g, [0, 0], v0, "var(--muted,#888)", 1, 0.35 * fokus * op, "3 3");
        busur(gTop, ang, d, 0.55, "var(--warn)", 0.7 * fokus * op * seg(t, 2.3, 2.9));
        if (eig) sinar(gTop, w, "var(--s2)", terang * (1 - main));
        panah(gTop, [0, 0], w, eig && terang > 0 ? "var(--s2)" : "var(--s1)", eig ? 1.6 + 1.6 * terang : 1.6, op * (eig ? 1 : fokus));
      }
      if (main < 1) {
        /* panah (1, 0): bergerak sendirian di tahap 1 */
        var p10 = M(A, hit, [1, 0]), op10 = (1 - main) * (1 - 0.6 * terang);
        if (hit > 0.02) panah(g, [0, 0], [1, 0], "var(--warn)", 1.4, 0.5 * (1 - terang) * (1 - main), "4 4");
        busur(gTop, 0, belok(A, hit, 0), 0.7, "var(--warn)", op10);
        panah(gTop, [0, 0], p10, "var(--warn)", 3, op10);
        if (hit < 0.98) teks(gTop, p10[0] + 0.08, p10[1] + 0.16, titik(p10, 1), "var(--warn)", 16, 1 - main, p10[0] > 1.4 ? "end" : "start");
        else teks(gTop, p10[0] + 0.05, p10[1] + 0.22, "(1, 0) → (2, 1)", "var(--warn)", 16, (1 - terang) * (1 - main), "end");
        var bk = belok(A, hit, 0) * 180 / Math.PI;
        if (hit > 0.05) teks(gTop, 0.8, 0.2 * hit + 0.05, "↺ " + fmt(bk, 1) + "°", "var(--warn)", 13, hit * (1 - muncul), "start");
        /* hitungan di tempat kejadian, angka berwarna sama dengan panahnya */
        teks(gTop, Wd / 2, 26, [["A", "var(--s1)"], [" · ", "var(--muted,#888)"], ["(1, 0)", "var(--warn)"], [" = (2·1 + 1·0, 1·1 + 2·0) = ", "var(--muted,#888)"], [titik(p10, 1), "var(--warn)"]], "", 15, hit * (1 - muncul), "middle", true);
      }
      if (terang > 0 && main < 1) {
        var op5 = terang * (1 - main);
        teks(gTop, 3 * 0.707 - 0.2, 3 * 0.707 + 0.05, [["(1, 1) → (3, 3)  ", "var(--s2)"], ["×3 · belok 0°", "var(--s2)"]], "", 16, op5, "end");
        teks(gTop, 0.75, -1.25, "(1, −1) → (1, −1)  ×1 · belok 0°", "var(--s2)", 16, op5, "middle");
      }
      if (rumus > 0 && main < 1) {
        teks(gTop, Wd / 2, Hp - 30, [["A", "var(--s1)"], [" v", "var(--s2)"], ["  =  ", "var(--text,currentColor)"], ["λ", "var(--accent,var(--s1))"], [" v", "var(--s2)"]], "", 26, rumus * (1 - main), "middle", true);
        teks(gTop, Wd / 2, Hp - 10, "A = tarikan · v = arah yang setia · λ = berapa kali panjangnya", "var(--muted,#888)", 13, rumus * (1 - main), "middle", true);
      }
      grafik(gBawah, Mx, s, gr, main > 0 ? 1 : terang);
      if (main > 0) { /* tahap 7: titik seret, iterasi pangkat */
        eg.forEach(function (e) { var r = 2.7, q = e.v[1] < -0.2 ? [-e.v[0], -e.v[1]] : e.v; teks(gTop, r * q[0] + 0.1, r * q[1] + 0.25, "λ = " + fmt(e.L), "var(--s2)", 15, main, "start"); });
        if (!eg.length) teks(gTop, Wd / 2, 26, "tidak ada arah setia: semua arah berbelok", "var(--s2)", 15, main, "middle", true);
        var n = jejak.length;
        jejak.forEach(function (v, i) {
          if (i === n - 1) return;
          var L = Math.hypot(v[0], v[1]) || 1;
          panah(gTop, [0, 0], [2 * v[0] / L, 2 * v[1] / L], "var(--warn)", 1.2, main * (0.12 + 0.45 * (i + 1) / n), "4 4");
        });
        var vA = jejak[n - 1], aKini = sdt(vA);
        if (alih) aKini = alih.dari + bungkus(alih.ke - alih.dari) * ez(alih.p);
        sinar(gTop, [2 * Math.cos(aKini), 2 * Math.sin(aKini)], "var(--warn)", main);
        panah(gTop, [0, 0], [2 * Math.cos(aKini), 2 * Math.sin(aKini)], "var(--warn)", 3, main);
        var info = "langkah " + (n - 1) + " · sudut " + fmt(aKini * 180 / Math.PI) + "°";
        if (n > 1) { var vB = jejak[n - 2]; info += " · panjang ×" + fmt(Math.hypot(vA[0], vA[1]) / Math.hypot(vB[0], vB[1])); }
        teks(gTop, Wd / 2, Hp - 14, info, "var(--warn)", 15, main, "middle", true);
        /* titik seret: ujung kolom matriks */
        [[U[0][0], U[1][0], "(1, 0)"], [U[0][1], U[1][1], "(0, 1)"]].forEach(function (c, i) {
          el("line", { x1: X(0), y1: Y(0), x2: X(c[0]), y2: Y(c[1]), style: "stroke:var(--text,currentColor);stroke-width:1;opacity:" + 0.35 * main }, gTop);
          el("circle", { cx: X(c[0]), cy: Y(c[1]), r: seret === i ? 11 : 9, style: "fill:var(--bg);stroke:var(--text,currentColor);stroke-width:2;cursor:grab;opacity:" + main }, gTop);
          teks(gTop, c[0], c[1] + 0.22, c[2] + " → " + titik([c[0], c[1]], 1), "var(--text,currentColor)", 12, main * 0.85);
        });
        svg.setAttribute("aria-label", "Panah (1, 0) setelah dikali matriks " + (n - 1) + " kali; garis putus-putus adalah arah eigen. Dua titik bulat bisa diseret untuk mengubah matriks.");
        return;
      }
      svg.setAttribute("aria-label", ALT[Math.min(6, Math.round(t))]);
    });
    var svg = C.svg, kt = C.kartu, hasil = kt.querySelector(".st-hasil"), cek = kt.querySelector(".st-cek"), info = kt.querySelector(".st-info"), tombol = kt.querySelectorAll(".st-tebak button"), isian = kt.querySelectorAll(".st-mat input");
    [].forEach.call(tombol, function (b) {
      b.addEventListener("click", function () {
        tebak = b.getAttribute("data-v");
        [].forEach.call(tombol, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        hasil.textContent = "Tebakanmu: " + tebak + ". Gulir terus untuk mengeceknya.";
        cek.textContent = tebak === "(1, 1)" || tebak === "(−1, 1)" ? "Tebakanmu " + tebak + " benar: panah itu ada di salah satu garis setia." : "Tebakanmu " + tebak + " belum tepat: lihat busurnya, panah itu ikut berbelok.";
      });
    });
    function lapor() { info.textContent = "Sekarang " + titik(jejak[jejak.length - 1]) + " setelah dikali " + (jejak.length - 1) + " kali."; }
    function isiKotak() { [].forEach.call(isian, function (x) { var i = x.getAttribute("data-i"); if (document.activeElement !== x) x.value = fmt(U[+i[0]][+i[1]], 1); }); }
    function ubah() { jejak = [[1, 0]]; alih = null; lapor(); C.ulang(); }
    [].forEach.call(isian, function (x) {
      x.addEventListener("input", function () { var n = parseFloat(x.value.replace(",", ".").replace("−", "-")), i = x.getAttribute("data-i"); if (isFinite(n)) { U[+i[0]][+i[1]] = n; ubah(); } });
    });
    /* seret ujung kolom matriks langsung di gambar */
    function keDunia(e) { var r = svg.getBoundingClientRect(), sx = Wd / r.width; return [((e.clientX - r.left) * sx - cx) / k, (cy - (e.clientY - r.top) * sx) / k]; }
    svg.addEventListener("pointerdown", function (e) {
      if (svg.style.touchAction !== "none") return;
      var p = keDunia(e), best = -1, bd = 0.35;
      [[U[0][0], U[1][0]], [U[0][1], U[1][1]]].forEach(function (c, i) { var d = Math.hypot(c[0] - p[0], c[1] - p[1]); if (d < bd) { bd = d; best = i; } });
      if (best < 0) return;
      seret = best; svg.setPointerCapture(e.pointerId); e.preventDefault(); C.ulang();
    });
    svg.addEventListener("pointermove", function (e) {
      if (seret < 0) return;
      var p = keDunia(e), q = [Math.round(Math.max(-3, Math.min(3, p[0])) * 10) / 10, Math.round(Math.max(-3, Math.min(3, p[1])) * 10) / 10];
      U[0][seret] = q[0]; U[1][seret] = q[1]; isiKotak(); ubah();
    });
    function lepas() { if (seret >= 0) { seret = -1; C.ulang(); } }
    svg.addEventListener("pointerup", lepas); svg.addEventListener("pointercancel", lepas);
    /* kalikan lagi: panah berputar mulus ke arah barunya */
    var kurang = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    kt.querySelector(".st-lagi").addEventListener("click", function () {
      var lama = jejak[jejak.length - 1], v = kali(U, lama), L = Math.hypot(v[0], v[1]);
      if (L < 1e-12) { info.textContent = "Panahnya habis menjadi nol: matriks ini memampatkan arah itu."; return; }
      if (L > 1e8) { var Lm = Math.hypot(lama[0], lama[1]); v = [v[0] / Lm, v[1] / Lm]; jejak = jejak.map(function (u) { return [u[0] / Lm, u[1] / Lm]; }); }
      jejak.push(v); if (jejak.length > 13) jejak.shift();
      lapor();
      if (kurang) { C.ulang(); return; }
      alih = { dari: sdt(lama), ke: sdt(v), p: 0 }; var t0 = performance.now();
      (function jalan() { if (!alih) return; alih.p = Math.min(1, (performance.now() - t0) / 650); C.ulang(); if (alih.p < 1) requestAnimationFrame(jalan); else { alih = null; C.ulang(); } })();
    });
    kt.querySelector(".st-ulang").addEventListener("click", function () { ubah(); });
    lapor();
  };
})();
