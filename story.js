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
      var vh = window.innerHeight, tumpuk = fig.offsetWidth > host.offsetWidth * 0.8, hd = document.querySelector("header"), atas = tumpuk && hd && getComputedStyle(hd).position === "fixed" && !hd.classList.contains("hide") ? hd.offsetHeight : 0; /* header HP sembunyi saat gulir ke bawah */
      fig.style.top = tumpuk ? atas + "px" : "";
      var bawahFig = atas + fig.offsetHeight, garis = tumpuk ? Math.max(vh * 0.55, bawahFig + (vh - bawahFig) * 0.42) : vh * 0.55, /* di HP gambar menempel di atas, jadi garis baca ada di tengah ruang di bawahnya */ c = [].map.call(lst.children, function (d) { var q = d.querySelector(".st-card").getBoundingClientRect(); return q.top + q.height / 2; }), t = 0;
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

  /* 2.7 Eigen. Kalimat inti: "lihat garis y = x tetap menjadi garisnya sendiri sementara hampir semua panah lain keluar dari garisnya".
     Salah paham yang diluruskan: (1) matriks bukan sekadar tabel angka, ia memindahkan setiap panah;
     (2) vektor eigen = tetap di GARIS-nya, boleh berbalik arah (λ negatif) atau mengerut ke nol (λ = 0).
     Angka dicek dengan Python (2 Nov 2026):
       A(1,0) = (2,1), A(1,1) = (3,3), A(1,-1) = (1,-1)
       belokan tiap 22,5°: 26,57 14,64 0 −14,64 −26,57 −28,68 0 28,68 … ; terbesar 30° di arah 165°; nol tepat di 45°, 135°, 225°, 315°
       (1,0) = ½(1,1) + ½(1,−1); setelah n kali: potongan 1 = ½·3ⁿ, potongan 2 = ½; n = 5 → 121,5 : 0,5 = 243 : 1; A⁵(1,0) = (122, 121)
       iterasi dari (1,0): sudut 26,57 → 38,66 → 42,88 → 44,29 → 44,76 → 44,92; panjang per langkah 2,236 → 2,864 → 2,984 → 2,998 → 3
       cermin [[0,1],[1,0]]: λ = 1, −1, (1,0) ↔ (0,1) bolak-balik; pemampat [[1,1],[1,1]]: λ = 2, 0, (1,0) → (1,1) → (2,2);
       putar 90° [[0,−1],[1,0]]: λ = ±i (tidak nyata) */
  W.eigenStory = function (host) {
    var tebak = -1, A = [[2, 1], [1, 2]], U = [[2, 1], [1, 2]], jejak = [[1, 0]], nLangkah = 0, alih = null, seret = -1, tKini = 0;
    var arahNama = []; for (var q = 0; q < 16; q++) arahNama.push((q * 22.5).toString().replace(".", ",") + "°");
    var pilih = "<select class=\"st-pilih\" aria-label=\"pilih arah tebakan\"><option value=\"-1\">atau pilih arahnya di sini</option>" + arahNama.map(function (n, i) { return "<option value=\"" + i + "\">panah arah " + n + "</option>"; }).join("") + "</select>";
    var kartu = [
      "<b>Satu panah dulu.</b> Ini panah (1, 0), menunjuk lurus ke kanan di sepanjang sumbu x. Matriks A = [[2, 1], [1, 2]] akan memindahkannya. Perhatikan panah oranye ini saja.",
      "<b>Hitung dengan tangan.</b> A·(1, 0) = (2·1 + 1·0, 1·1 + 2·0) = <b>(2, 1)</b>. Panah ini tidak hanya memanjang, ia juga <b>keluar dari garisnya</b>: busur kecil di pangkalnya menunjukkan ia berbelok sekitar 26,6° dari sumbu x.",
      "<b>Sekarang tebak.</b> Di gambar ada 16 panah ke segala arah. Kalau semuanya dikali A, panah mana yang <b>tetap di garisnya sendiri</b>? <b>Klik ujung panah</b> pilihanmu di gambar.<div class=\"st-tebak\">" + pilih + "</div><span class=\"st-hasil\" aria-live=\"polite\"></span>",
      "<b>Tarik karetnya.</b> Seluruh lembar dikali A sekaligus. Busur di tiap pangkal menunjukkan seberapa jauh panah itu keluar dari garisnya, dan grafik di bawah merangkum semua arah: makin jauh dari garis nol, makin jauh ia dibelokkan. Panah tebakanmu diberi cincin.",
      "<b>Kamera mundur.</b> Panahnya tidak berubah apa-apa, kita hanya menjauh supaya seluruh tarikan terlihat.",
      "<b>Dua garis yang setia.</b> Grafiknya menyentuh nol tepat di 45°, 135°, 225°, 315°, yaitu dua garis. Di garis y = x, panah (1, 1) menjadi (3, 3): <b>tiga salinan</b> dirinya yang disusun berjajar. Di garis y = −x, (1, −1) tetap (1, −1), <b>satu salinan</b>. Arah seperti ini disebut <mark>vektor eigen</mark>, dan 3 serta 1 adalah <mark>nilai eigen</mark>-nya.<span class=\"st-cek\"></span>",
      "<b>Baru sekarang rumusnya.</b> A v = λ v artinya menarik v dengan A hasilnya sama dengan sekadar mengalikan v dengan satu angka λ. Perhatikan kata <i>garis</i>: kalau λ negatif, panahnya <b>berbalik arah</b> tapi tetap di garis yang sama, jadi tetap vektor eigen. Kalau λ = 0, panahnya mengerut jadi titik.",
      "<b>Giliranmu.</b> Seret dua titik bulat (ke mana (1, 0) dan (0, 1) dikirim) atau ketik angkanya, lalu tekan <b>kalikan lagi</b> berkali-kali. Gambar memecah panah oranye menjadi dua potongan di dua garis eigen: (1, 0) = ½·(1, 1) + ½·(1, −1). Setiap kali dikali A, potongan pertama membesar <b>3 kali</b> sedangkan potongan kedua tetap, jadi setelah 5 langkah perbandingannya sudah <b>243 : 1</b>. Itulah sebabnya panahnya menempel ke garis y = x.<div class=\"st-mat\">[[<input data-i=\"00\" value=\"2\" inputmode=\"decimal\" aria-label=\"baris 1 kolom 1\">, <input data-i=\"01\" value=\"1\" inputmode=\"decimal\" aria-label=\"baris 1 kolom 2\">], [<input data-i=\"10\" value=\"1\" inputmode=\"decimal\" aria-label=\"baris 2 kolom 1\">, <input data-i=\"11\" value=\"2\" inputmode=\"decimal\" aria-label=\"baris 2 kolom 2\">]]</div><button type=\"button\" class=\"st-lagi\">kalikan lagi</button> <button type=\"button\" class=\"st-ulang\">mulai dari (1, 0)</button><div class=\"st-contoh\">Coba juga: <button type=\"button\" data-m=\"2,1,1,2\">A semula</button><button type=\"button\" data-m=\"0,1,1,0\">cermin</button><button type=\"button\" data-m=\"1,1,1,1\">pemampat</button><button type=\"button\" data-m=\"0,-1,1,0\">putar 90°</button></div><span class=\"st-pesan\" aria-live=\"polite\"></span><span class=\"st-info\" aria-live=\"polite\"></span>",
      "<b>Kenapa ini penting untuk AI.</b> Mengalikan dengan matriks yang sama berulang-ulang muncul di mana-mana, dan hasilnya selalu dikuasai arah eigen dengan |λ| terbesar. <b>PageRank</b> menemukan halaman penting dengan cara persis seperti tombol tadi. <b>PCA</b> mencari arah eigen matriks kovarians, yaitu arah sebaran data terbesar. Di <b>RNN</b>, |λ| sedikit di atas 1 membuat sinyal meledak, sedikit di bawah 1 membuatnya lenyap.<br><br><b>Coba jelaskan ulang</b> dengan kata-katamu sendiri, tanpa melihat layar: kenapa panah (1, 0) lama-lama menempel ke garis y = x, dan apa yang terjadi pada contoh cermin? Kalau kamu bisa, kamu sudah memegang intinya."
    ];
    var Wd = 520, Hd = 512, Hp = 400, cx = Wd / 2, cy = Hp / 2, k = 108;
    function X(x) { return cx + x * k; } function Y(y) { return cy - y * k; }
    function kali(Mx, v) { return [Mx[0][0] * v[0] + Mx[0][1] * v[1], Mx[1][0] * v[0] + Mx[1][1] * v[1]]; }
    function M(Mx, s, v) { var w = kali(Mx, v); return [v[0] + s * (w[0] - v[0]), v[1] + s * (w[1] - v[1])]; } /* (I + s(A − I))v */
    function sdt(v) { return Math.atan2(v[1], v[0]); }
    function bungkus(d) { while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI; return d; }
    function bungkusGaris(d) { d = bungkus(d); if (d > Math.PI / 2) d -= Math.PI; else if (d <= -Math.PI / 2) d += Math.PI; return d; }
    /* seberapa jauh arah th keluar dari GARIS-nya (berbalik arah dihitung 0) */
    function belok(Mx, s, th) { var v = [Math.cos(th), Math.sin(th)], w = M(Mx, s, v); return Math.hypot(w[0], w[1]) < 1e-9 ? 0 : bungkusGaris(sdt(w) - th); }
    function eigArah(Mx) {
      var a = Mx[0][0], b = Mx[0][1], c = Mx[1][0], d = Mx[1][1], tr = a + d, D = tr * tr - 4 * (a * d - b * c), out = [];
      if (D < -1e-9) return out;
      [(tr + Math.sqrt(Math.max(D, 0))) / 2, (tr - Math.sqrt(Math.max(D, 0))) / 2].forEach(function (L, i) {
        var v = Math.abs(b) > 1e-9 ? [b, L - a] : Math.abs(c) > 1e-9 ? [L - d, c] : (i ? [0, 1] : [1, 0]), n = Math.hypot(v[0], v[1]);
        if (!(i && D < 1e-9 && (Math.abs(b) > 1e-9 || Math.abs(c) > 1e-9))) out.push({ v: [v[0] / n, v[1] / n], L: L }); /* satu arah saja kalau λ kembar */
      });
      return out;
    }
    function fmt(x, n) { var p = Math.pow(10, n == null ? 2 : n), r = Math.round(x * p) / p; if (Math.abs(r) >= 1e6) return x.toExponential(1).replace("-", "−").replace(".", ","); return (r === 0 ? 0 : r).toString().replace("-", "−").replace(".", ","); }
    function titik(v, n) { var a = fmt(v[0], n), b = fmt(v[1], n); return "(" + a + (a.indexOf(",") >= 0 || b.indexOf(",") >= 0 ? "; " : ", ") + b + ")"; }
    function ez(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
    function panah(g, a, b, warna, lebar, op, garis) {
      if (op <= 0.005) return;
      var x1 = X(a[0]), y1 = Y(a[1]), x2 = X(b[0]), y2 = Y(b[1]), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      if (L < 2) { el("circle", { cx: x2, cy: y2, r: 3, style: "fill:" + warna + ";opacity:" + op }, g); return; }
      var ux = dx / L, uy = dy / L, h = Math.min(7 + lebar, L * 0.6);
      el("line", { x1: x1, y1: y1, x2: x2 - ux * h * 0.6, y2: y2 - uy * h * 0.6, style: "stroke:" + warna + ";stroke-width:" + lebar + ";stroke-linecap:round;opacity:" + op + (garis ? ";stroke-dasharray:" + garis : "") }, g);
      el("polygon", { points: [x2, y2, x2 - ux * h - uy * h * 0.5, y2 - uy * h + ux * h * 0.5, x2 - ux * h + uy * h * 0.5, y2 - uy * h - ux * h * 0.5].join(" "), style: "fill:" + warna + ";opacity:" + op }, g);
    }
    function sinar(g, a, b, warna, op) { /* cahaya lembut di bawah panah penting */
      if (op <= 0.01) return;
      el("line", { x1: X(a[0]), y1: Y(a[1]), x2: X(b[0]), y2: Y(b[1]), style: "stroke:" + warna + ";stroke-width:12;stroke-linecap:round;opacity:" + 0.18 * op }, g);
    }
    /* teks yang muncul dengan memudar sambil naik sedikit, bukan meloncat */
    function teks(g, x, y, s, warna, uk, op, anchor, px) {
      if (op <= 0.01) return null;
      var t = el("text", { x: px ? x : X(x), y: (px ? y : Y(y)) + (1 - op) * 7, "text-anchor": anchor || "middle", style: "fill:" + warna + ";font-size:" + uk + "px;opacity:" + op + ";font-weight:600;paint-order:stroke;stroke:var(--bg);stroke-width:4px" }, g);
      if (typeof s === "string") t.textContent = s; else s.forEach(function (p) { var ts = el("tspan", { style: "fill:" + p[1] + ";white-space:pre" }, t); ts.textContent = p[0]; });
      return t;
    }
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
    /* grafik belokan: sumbu x = arah semula 0°–360°, sumbu y = berapa derajat arah itu keluar dari garisnya */
    function grafik(g, Mx, s, op, sorotNol) {
      if (op <= 0.01) return;
      var x0 = 44, x1 = Wd - 16, yt = Hp + 50, yb = Hd - 22, ym = (yt + yb) / 2, maks = Math.PI / 6;
      var data = [];
      for (var i = 0; i <= 180; i++) { var th = i / 180 * 2 * Math.PI, b = belok(Mx, s, th); data.push([th, b]); maks = Math.max(maks, Math.abs(b)); }
      function GX(th) { return x0 + (x1 - x0) * th / (2 * Math.PI); } function GY(b) { return ym - (yb - yt) / 2 * b / maks; }
      var gg = el("g", { style: "opacity:" + op }, g);
      el("line", { x1: x0, y1: ym, x2: x1, y2: ym, style: "stroke:var(--muted,#888);opacity:.5" }, gg);
      [0, 90, 180, 270, 360].forEach(function (dg) { var t = el("text", { x: GX(dg * Math.PI / 180), y: yb + 12, "text-anchor": "middle", style: "fill:var(--muted,#888);font-size:10px" }, gg); t.textContent = dg + "°"; });
      var tl = el("text", { x: x0 - 6, y: ym + 4, "text-anchor": "end", style: "fill:var(--muted,#888);font-size:10px" }, gg); tl.textContent = "0°";
      var tt = el("text", { x: x0, y: yt - 20, style: "fill:var(--muted,#888);font-size:11px;font-weight:600" }, gg); tt.textContent = "seberapa jauh tiap arah keluar dari garisnya (maks " + fmt(maks * 180 / Math.PI, 0) + "°)";
      var pts = [], prev = null;
      data.forEach(function (p) { if (prev && Math.abs(p[1] - prev[1]) > Math.PI / 2) { el("polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--s1);stroke-width:2" }, gg); pts = []; } pts.push(GX(p[0]) + "," + GY(p[1])); prev = p; });
      el("polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--s1);stroke-width:2" }, gg);
      for (var j = 0; j < 16; j++) { var th = j * Math.PI / 8; el("circle", { cx: GX(th), cy: GY(belok(Mx, s, th)), r: j === 0 || j === tebak ? 4 : 2.5, style: "fill:" + (j === 0 ? "var(--warn)" : "var(--s1)") + (j === tebak ? ";stroke:var(--text,currentColor);stroke-width:1.5" : "") }, gg); }
      if (sorotNol > 0.01) eigArah(Mx).forEach(function (e) {
        var th = ((sdt(e.v) % Math.PI) + Math.PI) % Math.PI;
        [th, th + Math.PI].forEach(function (a) {
          el("circle", { cx: GX(a), cy: GY(belok(Mx, s, a)), r: 6, style: "fill:none;stroke:var(--s2);stroke-width:2;opacity:" + sorotNol }, gg);
          var t = el("text", { x: GX(a), y: GY(belok(Mx, s, a)) - 10, "text-anchor": "middle", style: "fill:var(--s2);font-size:11px;font-weight:700;opacity:" + sorotNol }, gg); t.textContent = fmt(a * 180 / Math.PI, 0) + "°";
        });
      });
    }
    /* salinan panah satuan yang disusun berjajar: memperlihatkan "×λ" sebagai benda, bukan tulisan */
    function salinan(g, v, n, op, t0, t) {
      for (var i = 0; i < n; i++) {
        var u = seg(t, t0 + i * 0.18, t0 + i * 0.18 + 0.3) * op; if (u <= 0.01) continue;
        var a = [v[0] * i, v[1] * i], b = [v[0] * (i + 1), v[1] * (i + 1)], nx = -v[1] * 0.13, ny = v[0] * 0.13;
        el("line", { x1: X(a[0] + nx), y1: Y(a[1] + ny), x2: X(b[0] + nx), y2: Y(b[1] + ny), style: "stroke:var(--s2);stroke-width:5;stroke-linecap:butt;opacity:" + u * (i % 2 ? 0.55 : 0.95) }, g);
        el("line", { x1: X(b[0] + nx * 1.6), y1: Y(b[1] + ny * 1.6), x2: X(b[0] + nx * 0.4), y2: Y(b[1] + ny * 0.4), style: "stroke:var(--s2);stroke-width:2;opacity:" + u }, g);
        teks(g, (a[0] + b[0]) / 2 + nx * 2.6, (a[1] + b[1]) / 2 + ny * 2.6 - 0.05, String(i + 1), "var(--s2)", 12, u);
      }
    }
    var ALT = ["Satu panah oranye (1, 0) di sumbu x.", "Panah (1, 0) dikali A menjadi (2, 1) dan keluar dari garisnya sekitar 26,6 derajat.", "Enam belas panah ke segala arah dari titik tengah; klik satu untuk menebak.", "Seluruh lembar ditarik matriks A; busur menunjukkan belokan tiap panah, grafik di bawah merangkumnya.", "Pandangan menjauh supaya seluruh tarikan terlihat.", "Grafik belokan nol di 45, 135, 225, 315 derajat: di garis y = x panah menjadi tiga salinan dirinya, di garis y = −x satu salinan.", "Rumus A v = lambda v."];
    var C = cerita(host, kartu, function (svg, t) {
      tKini = t;
      svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = "";
      var dfs = el("defs", {}, svg), cp = el("clipPath", { id: "stclip" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hp }, cp);
      var rg = el("radialGradient", { id: "stfade", cx: "50%", cy: "50%", r: "50%" }, dfs);
      el("stop", { offset: "70%", "stop-color": "#fff" }, rg); el("stop", { offset: "100%", "stop-color": "#000" }, rg);
      var mk = el("mask", { id: "stmask" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hp, fill: "url(#stfade)" }, mk);
      var gTop = el("g", { "clip-path": "url(#stclip)" }, svg), g = el("g", { mask: "url(#stmask)" }, gTop), gBawah = el("g", {}, svg);
      /* tahap: 0 satu panah · 1 hitung · 2 tebak · 3 tarik · 4 kamera · 5 setia · 6 rumus · 7 giliranmu · 8 penutup. Satu perubahan per tahap. */
      var hit = seg(t, 0.2, 1), muncul = seg(t, 1.3, 2), s = seg(t, 2.2, 3), kam = seg(t, 3.2, 4), terang = seg(t, 4.2, 5), rumus = seg(t, 5.2, 6), keluar = seg(t, 6.12, 6.45), main = seg(t, 6.5, 6.92); /* tahap lama pudar dulu, baru tahap baru muncul: tidak bertumpuk */
      k = 108 - 44 * kam;
      svg.style.touchAction = main > 0.5 ? "none" : "";
      svg.style.cursor = Math.abs(t - 2) < 0.5 ? "pointer" : "";
      var Mx = main > 0 ? U : A, gr = seg(t, 2.1, 2.6);
      lembar(g, Mx, s);
      var eg = eigArah(Mx), terangE = main > 0 ? 1 : terang;
      eg.forEach(function (e) { el("line", { x1: X(-6 * e.v[0]), y1: Y(-6 * e.v[1]), x2: X(6 * e.v[0]), y2: Y(6 * e.v[1]), style: "stroke:var(--s2);stroke-dasharray:5 6;opacity:" + 0.6 * terangE }, g); });
      var fokus = 1 - 0.75 * terang * (1 - keluar);
      for (var j = 1; j < 16; j++) {
        var ang = j * Math.PI / 8, v0 = [Math.cos(ang), Math.sin(ang)], w = M(Mx, s, v0), d = belok(Mx, s, ang), eig = Math.abs(belok(Mx, 1, ang)) < 1e-6;
        var op = muncul * (1 - 0.78 * main);
        if (s > 0.02 && !eig) panah(g, [0, 0], v0, "var(--muted,#888)", 1, 0.35 * fokus * op, "3 3");
        busur(gTop, ang, d, 0.55, "var(--warn)", 0.7 * fokus * op * seg(t, 2.3, 2.9));
        if (eig) sinar(gTop, [0, 0], w, "var(--s2)", terang * (1 - keluar));
        panah(gTop, [0, 0], w, eig && terang > 0 ? "var(--s2)" : "var(--s1)", eig ? 1.6 + 1.6 * terang : 1.6, op * (eig ? 1 : fokus));
        if (j === tebak && keluar < 1) { /* cincin di ujung panah tebakan, ikut terbawa tarikan */
          el("circle", { cx: X(w[0]), cy: Y(w[1]), r: 10, style: "fill:none;stroke:var(--text,currentColor);stroke-width:2;opacity:" + muncul * (1 - keluar) }, gTop);
          var Lw = Math.hypot(w[0], w[1]) || 1; teks(gTop, w[0] * (1 - 0.3 / Lw) + 0.12, w[1] * (1 - 0.3 / Lw) - 0.05, "tebakanmu", "var(--text,currentColor)", 12, muncul * (1 - keluar) * (1 - terang));
        }
      }
      if (keluar < 1) {
        var p10 = M(A, hit, [1, 0]), op10 = (1 - keluar) * (1 - 0.6 * terang);
        if (hit > 0.02) panah(g, [0, 0], [1, 0], "var(--warn)", 1.4, 0.5 * (1 - terang) * (1 - keluar), "4 4");
        busur(gTop, 0, belok(A, hit, 0), 0.7, "var(--warn)", op10);
        panah(gTop, [0, 0], p10, "var(--warn)", 3, op10);
        if (hit < 0.98) teks(gTop, p10[0] + 0.08, p10[1] + 0.16, titik(p10, 1), "var(--warn)", 16, 1 - keluar, p10[0] > 1.4 ? "end" : "start");
        else teks(gTop, p10[0] + 0.05, p10[1] + 0.22, "(1, 0) → (2, 1)", "var(--warn)", 16, (1 - seg(t, 3.95, 4.3)) * (1 - keluar), "end");
        if (hit > 0.05) teks(gTop, 0.8, 0.2 * hit + 0.05, "↺ " + fmt(belok(A, hit, 0) * 180 / Math.PI, 1) + "°", "var(--warn)", 13, hit * (1 - muncul), "start");
        teks(gTop, Wd / 2, 26, [["A", "var(--s1)"], [" · ", "var(--muted,#888)"], ["(1, 0)", "var(--warn)"], [" = (2·1 + 1·0, 1·1 + 2·0) = ", "var(--muted,#888)"], [titik(p10, 1), "var(--warn)"]], "", 15, hit * (1 - muncul), "middle", true);
        if (Math.abs(t - 2) < 0.6) teks(gTop, Wd / 2, 26, tebak < 0 ? "klik ujung panah yang menurutmu tetap di garisnya" : "tebakanmu: panah arah " + arahNama[tebak], "var(--text,currentColor)", 14, seg(t, 1.75, 2) * (1 - seg(t, 2.25, 2.6)), "middle", true);
      }
      if (terang > 0 && keluar < 1) {
        var op5 = terang * (1 - keluar), r2 = Math.SQRT1_2;
        salinan(gTop, [r2, r2], 3, 1 - keluar, 4.3, t);
        salinan(gTop, [r2, -r2], 1, 1 - keluar, 4.3, t);
        teks(gTop, 3 * r2 - 0.25, 3 * r2 + 0.1, "(1, 1) → (3, 3) = 3 salinan", "var(--s2)", 15, op5, "end");
        teks(gTop, 0.75, -1.3, "(1, −1) → (1, −1) = 1 salinan", "var(--s2)", 15, op5, "middle");
      }
      if (rumus > 0 && keluar < 1) {
        teks(gTop, Wd / 2, Hp - 30, [["A", "var(--s1)"], [" v", "var(--s2)"], ["  =  ", "var(--text,currentColor)"], ["λ", "var(--accent,var(--s1))"], [" v", "var(--s2)"]], "", 26, rumus * (1 - keluar), "middle", true);
        teks(gTop, Wd / 2, Hp - 10, "A = tarikan · v = arah yang tetap di garisnya · λ = kali berapa", "var(--muted,#888)", 13, rumus * (1 - keluar), "middle", true);
      }
      grafik(gBawah, Mx, s, gr, main > 0 ? 1 : terang);
      if (main > 0) { /* tahap 7–8: matriks milik pembaca, iterasi pangkat, dan penguraian dua potongan */
        eg.forEach(function (e) { var r = 2.7, q = e.v[1] < -0.2 ? [-e.v[0], -e.v[1]] : e.v; teks(gTop, r * q[0] + 0.1, r * q[1] + 0.25, "λ = " + fmt(e.L), "var(--s2)", 15, main, "start"); });
        if (!eg.length) teks(gTop, Wd / 2, 26, "tidak ada garis yang setia: semua arah berbelok", "var(--s2)", 15, main, "middle", true);
        var n = jejak.length;
        jejak.forEach(function (v, i) {
          if (i === n - 1) return;
          var L = Math.hypot(v[0], v[1]) || 1;
          panah(gTop, [0, 0], [2 * v[0] / L, 2 * v[1] / L], "var(--warn)", 1.2, main * (0.12 + 0.45 * (i + 1) / n), "4 4");
        });
        var vA = jejak[n - 1], LA = Math.hypot(vA[0], vA[1]), aKini = sdt(vA);
        if (alih) aKini = alih.dari + bungkus(alih.ke - alih.dari) * ez(alih.p);
        /* penguraian: (1, 0) = a·e1 + b·e2, lalu Uⁿ(1, 0) = a·λ1ⁿ·e1 + b·λ2ⁿ·e2 */
        var urai = null;
        if (eg.length === 2) {
          /* skala arah eigen supaya komponen terbesarnya 1, jadi (1, 1) dan (1, −1), cocok dengan tulisan ½·(1, 1) + ½·(1, −1) */
          var bulat = function (v) { var m = Math.max(Math.abs(v[0]), Math.abs(v[1])), sg = (Math.abs(v[0]) > 1e-9 ? v[0] : v[1]) < 0 ? -1 : 1; return [sg * v[0] / m, sg * v[1] / m]; };
          var e1 = bulat(eg[0].v), e2 = bulat(eg[1].v), det = e1[0] * e2[1] - e2[0] * e1[1];
          if (Math.abs(det) > 1e-6) {
            var ca = e2[1] / det, cb = -e1[1] / det, p1 = ca * Math.pow(eg[0].L, nLangkah), p2 = cb * Math.pow(eg[1].L, nLangkah);
            urai = { e1: e1, e2: e2, p1: p1, p2: p2, L1: eg[0].L, L2: eg[1].L };
          }
        }
        if (urai && !alih && LA > 1e-12) {
          var sk = 2 / Math.hypot(urai.p1 * urai.e1[0] + urai.p2 * urai.e2[0], urai.p1 * urai.e1[1] + urai.p2 * urai.e2[1]);
          var q1 = [urai.p1 * urai.e1[0] * sk, urai.p1 * urai.e1[1] * sk], q2 = [urai.p2 * urai.e2[0] * sk, urai.p2 * urai.e2[1] * sk], ujung = [q1[0] + q2[0], q1[1] + q2[1]];
          el("line", { x1: X(q1[0]), y1: Y(q1[1]), x2: X(ujung[0]), y2: Y(ujung[1]), style: "stroke:var(--s1);stroke-dasharray:3 4;opacity:" + 0.6 * main }, gTop);
          el("line", { x1: X(q2[0]), y1: Y(q2[1]), x2: X(ujung[0]), y2: Y(ujung[1]), style: "stroke:var(--s2);stroke-dasharray:3 4;opacity:" + 0.6 * main }, gTop);
          panah(gTop, [0, 0], q1, "var(--s2)", 2.4, main);
          panah(gTop, [0, 0], q2, "var(--s1)", 2.4, main);
          var bes = Math.abs(urai.p1) / Math.max(1e-300, Math.abs(urai.p2));
          teks(gTop, Wd / 2, Hp - 34, [["potongan λ = " + fmt(urai.L1) + ": " + fmt(urai.p1), "var(--s2)"], ["   ·   ", "var(--muted,#888)"], ["potongan λ = " + fmt(urai.L2) + ": " + fmt(urai.p2), "var(--s1)"], ["   ·   ", "var(--muted,#888)"], [Math.abs(urai.p2) < 1e-12 ? "potongan kedua habis" : "perbandingan " + fmt(bes, bes < 10 ? 1 : 0) + " : 1", "var(--text,currentColor)"]], "", 13, main, "middle", true);
        }
        if (LA > 1e-12) {
          sinar(gTop, [0, 0], [2 * Math.cos(aKini), 2 * Math.sin(aKini)], "var(--warn)", main);
          panah(gTop, [0, 0], [2 * Math.cos(aKini), 2 * Math.sin(aKini)], "var(--warn)", 3, main);
        }
        var info = "langkah " + nLangkah + (LA > 1e-12 ? " · sudut " + fmt(aKini * 180 / Math.PI) + "°" : " · panahnya habis jadi nol");
        if (n > 1 && LA > 1e-12) { var vB = jejak[n - 2]; info += " · panjang ×" + fmt(LA / Math.hypot(vB[0], vB[1])); }
        teks(gTop, Wd / 2, Hp - 12, info, "var(--warn)", 15, main, "middle", true);
        [[U[0][0], U[1][0], "(1, 0)"], [U[0][1], U[1][1], "(0, 1)"]].forEach(function (c, i) {
          el("line", { x1: X(0), y1: Y(0), x2: X(c[0]), y2: Y(c[1]), style: "stroke:var(--text,currentColor);stroke-width:1;opacity:" + 0.35 * main }, gTop);
          el("circle", { cx: X(c[0]), cy: Y(c[1]), r: seret === i ? 11 : 9, style: "fill:var(--bg);stroke:var(--text,currentColor);stroke-width:2;cursor:grab;opacity:" + main }, gTop);
          var sama = Math.abs(U[0][0] - U[0][1]) < 0.05 && Math.abs(U[1][0] - U[1][1]) < 0.05; if (!(sama && i === 1)) teks(gTop, c[0], c[1] + 0.22, (sama ? "(1, 0) dan (0, 1)" : c[2]) + " → " + titik([c[0], c[1]], 1), "var(--text,currentColor)", 12, main * 0.85);
        });
        svg.setAttribute("aria-label", "Panah (1, 0) setelah dikali matriks " + nLangkah + " kali, dipecah menjadi dua potongan di garis eigen. Dua titik bulat bisa diseret untuk mengubah matriks.");
        return;
      }
      svg.setAttribute("aria-label", ALT[Math.min(6, Math.round(t))]);
    });
    var svg = C.svg, kt = C.kartu, hasil = kt.querySelector(".st-hasil"), cek = kt.querySelector(".st-cek"), info = kt.querySelector(".st-info"), isian = kt.querySelectorAll(".st-mat input"), sel = kt.querySelector(".st-pilih");
    /* tebakan: klik ujung panah di gambar, atau pilih dari daftar (untuk keyboard) */
    function setTebak(j) {
      tebak = j; sel.value = String(j);
      var benar = j % 4 === 2;
      hasil.textContent = "Tebakanmu: panah arah " + arahNama[j] + ". Gulir terus untuk mengeceknya.";
      cek.textContent = benar ? " Tebakanmu (arah " + arahNama[j] + ") benar: panah itu ada di salah satu garis setia." : " Tebakanmu (arah " + arahNama[j] + ") belum tepat: lihat busurnya, panah itu keluar dari garisnya. Yang tepat ada di 45°, 135°, 225°, 315°.";
      C.ulang();
    }
    sel.addEventListener("change", function () { var j = +sel.value; if (j >= 0) setTebak(j); });
    function keDunia(e) { var r = svg.getBoundingClientRect(), sx = Wd / r.width; return [((e.clientX - r.left) * sx - cx) / k, (cy - (e.clientY - r.top) * sx) / k]; }
    svg.addEventListener("click", function (e) {
      if (Math.abs(tKini - 2) >= 0.5) return;
      var p = keDunia(e), best = -1, bd = 0.4;
      for (var j = 0; j < 16; j++) { var a = j * Math.PI / 8, d = Math.hypot(Math.cos(a) - p[0], Math.sin(a) - p[1]); if (d < bd) { bd = d; best = j; } }
      if (best >= 0) setTebak(best);
    });
    function lapor() { var v = jejak[jejak.length - 1]; info.textContent = Math.hypot(v[0], v[1]) < 1e-12 ? "Panahnya habis menjadi nol setelah " + nLangkah + " kali: matriks ini memampatkan arah itu." : "Sekarang " + titik(v) + " setelah dikali " + nLangkah + " kali."; }
    function isiKotak() { [].forEach.call(isian, function (x) { var i = x.getAttribute("data-i"); if (document.activeElement !== x) x.value = fmt(U[+i[0]][+i[1]], 1); }); }
    function ubah() { jejak = [[1, 0]]; nLangkah = 0; alih = null; lapor(); C.ulang(); }
    [].forEach.call(isian, function (x) {
      x.addEventListener("input", function () { var n = parseFloat(x.value.replace(",", ".").replace("−", "-")), i = x.getAttribute("data-i"); if (isFinite(n)) { U[+i[0]][+i[1]] = n; ubah(); } });
    });
    var pesan = { "2,1,1,2": "", "0,1,1,0": "Cermin: garis y = x tetap (λ = 1), garis y = −x berbalik arah (λ = −1) tapi tetap di garisnya. Karena |λ| keduanya sama, tidak ada yang menang: panahnya bolak-balik selamanya.", "1,1,1,1": "Pemampat: garis y = −x punya λ = 0, jadi potongan itu langsung lenyap dalam satu langkah dan panahnya jatuh ke garis y = x.", "0,-1,1,0": "Putar 90°: setiap arah berbelok, tidak ada garis yang setia. Nilai eigennya ada, tapi bukan bilangan real, jadi tidak bisa digambar sebagai garis." };
    [].forEach.call(kt.querySelectorAll(".st-contoh button"), function (b) {
      b.addEventListener("click", function () {
        var m = b.getAttribute("data-m").split(",").map(Number); U = [[m[0], m[1]], [m[2], m[3]]]; isiKotak(); ubah();
        kt.querySelector(".st-pesan").textContent = pesan[b.getAttribute("data-m")];
      });
    });
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
    var kurang = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    kt.querySelector(".st-lagi").addEventListener("click", function () {
      var lama = jejak[jejak.length - 1], Ll = Math.hypot(lama[0], lama[1]);
      if (Ll < 1e-12) { lapor(); return; }
      var v = kali(U, lama), L = Math.hypot(v[0], v[1]);
      if (L > 1e8) { v = [v[0] / Ll, v[1] / Ll]; jejak = jejak.map(function (u) { return [u[0] / Ll, u[1] / Ll]; }); }
      if (L < 1e-12) v = [0, 0];
      jejak.push(v); nLangkah++; if (jejak.length > 13) jejak.shift();
      lapor();
      if (kurang || L < 1e-12) { C.ulang(); return; }
      alih = { dari: sdt(lama), ke: sdt(v), p: 0 }; var t0 = performance.now();
      (function jalan() { if (!alih) return; alih.p = Math.min(1, (performance.now() - t0) / 650); C.ulang(); if (alih.p < 1) requestAnimationFrame(jalan); else { alih = null; C.ulang(); } })();
    });
    kt.querySelector(".st-ulang").addEventListener("click", function () { ubah(); });
    lapor();
  };
})();
