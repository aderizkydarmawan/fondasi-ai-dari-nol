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
  }

  /* 2.7 Eigen: lembar karet ditarik oleh M(s) = I + s(A − I), A = [[2, 1], [1, 2]].
     Untuk setiap s, (1, 1) dan (1, −1) tetap vektor eigen M(s) dengan nilai eigen 1 + 2s dan 1. */
  W.eigenStory = function (host) {
    var kartu = [
      "<b>Lembar karet.</b> Setiap panah berawal dari titik tengah dan panjangnya 1. Belum ada yang terjadi.",
      "<b>Tarik karetnya.</b> Karet diregangkan oleh matriks A = [[2, 1], [1, 2]]. Hampir semua panah ikut <b>berbelok</b>: panah (1, 0) misalnya mendarat di (2, 1), arahnya miring.",
      "<b>Dua arah yang setia.</b> Panah di garis y = x tidak berbelok, hanya memanjang <b>3 kali</b>. Panah di garis y = −x malah tidak berubah sama sekali (<b>1 kali</b>). Inilah <mark>vektor eigen</mark>, dan 3 serta 1 adalah <mark>nilai eigen</mark>-nya.",
      "<b>Ditulis sebagai rumus.</b> A v = λ v artinya: menarik panah v dengan A (kiri) hasilnya sama dengan sekadar memanjangkan v sebanyak λ kali (kanan). Untuk v = (1, 1): A v = (3, 3) = 3 · (1, 1).",
      "<b>Giliranmu.</b> Di bawah ada widget yang bisa kamu atur sendiri. Cari arah panah yang tidak berbelok untuk matriks lain."
    ];
    var Wd = 520, Hd = 400, cx = Wd / 2, cy = Hd / 2, k = 64;
    function X(x) { return cx + x * k; } function Y(y) { return cy - y * k; }
    function M(s, v) { return [v[0] + s * (v[0] + v[1]), v[1] + s * (v[0] + v[1])]; } /* (I + s(A−I))v, A−I = [[1,1],[1,1]] */
    function panah(g, a, b, warna, lebar, op) {
      var x1 = X(a[0]), y1 = Y(a[1]), x2 = X(b[0]), y2 = Y(b[1]), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, h = 7 + lebar;
      el("line", { x1: x1, y1: y1, x2: x2 - ux * h * 0.6, y2: y2 - uy * h * 0.6, style: "stroke:" + warna + ";stroke-width:" + lebar + ";stroke-linecap:round;opacity:" + op }, g);
      el("polygon", { points: [x2, y2, x2 - ux * h - uy * h * 0.5, y2 - uy * h + ux * h * 0.5, x2 - ux * h + uy * h * 0.5, y2 - uy * h - ux * h * 0.5].join(" "), style: "fill:" + warna + ";opacity:" + op }, g);
    }
    function teks(g, x, y, s, warna, uk, op, anchor) { var t = el("text", { x: X(x), y: Y(y), "text-anchor": anchor || "middle", style: "fill:" + warna + ";font-size:" + uk + "px;opacity:" + op + ";font-weight:600" }, g); t.textContent = s; return t; }
    cerita(host, kartu, function (svg, t) {
      svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = "";
      var s = seg(t, 0.25, 1); k = 108 - 44 * s; /* kamera mundur pelan saat karet meregang */ var s_ = s, terang = seg(t, 1.45, 2), rumus = seg(t, 2.3, 3), akhir = seg(t, 3.3, 4);
      var dfs = el("defs", {}, svg), cp = el("clipPath", { id: "stclip" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hd }, cp);
      var rg = el("radialGradient", { id: "stfade", cx: "50%", cy: "50%", r: "50%" }, dfs);
      el("stop", { offset: "72%", "stop-color": "#fff" }, rg); el("stop", { offset: "100%", "stop-color": "#000" }, rg);
      var mk = el("mask", { id: "stmask" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hd, fill: "url(#stfade)" }, mk);
      var g0 = el("g", { "clip-path": "url(#stclip)" }, svg), g = el("g", { mask: "url(#stmask)" }, g0), gTop = g0;
            /* lembar karet: persegi [-2,2]² dan garis gridnya ikut ditransformasi */
      var sudut = [[-5, -5], [5, -5], [5, 5], [-5, 5]].map(function (v) { return M(s, v); });
      el("polygon", { points: sudut.map(function (q) { return X(q[0]) + "," + Y(q[1]); }).join(" "), style: "fill:var(--s1);opacity:.07" }, g);
      for (var i = -5; i <= 5; i += 0.5) {
        var a = M(s, [i, -5]), b = M(s, [i, 5]), c = M(s, [-5, i]), d = M(s, [5, i]);
        el("line", { x1: X(a[0]), y1: Y(a[1]), x2: X(b[0]), y2: Y(b[1]), style: "stroke:var(--s1);opacity:.18" }, g);
        el("line", { x1: X(c[0]), y1: Y(c[1]), x2: X(d[0]), y2: Y(d[1]), style: "stroke:var(--s1);opacity:.18" }, g);
      }
      /* garis eigen y = x dan y = −x */
      if (terang > 0) [[1, 1], [1, -1]].forEach(function (v) { el("line", { x1: X(-5 * v[0]), y1: Y(-5 * v[1]), x2: X(5 * v[0]), y2: Y(5 * v[1]), style: "stroke:var(--s2);stroke-dasharray:5 6;opacity:" + 0.6 * terang }, g); });
      /* 16 panah satuan */
      for (var j = 0; j < 16; j++) {
        var ang = j * Math.PI / 8, v = [Math.cos(ang), Math.sin(ang)], w = M(s, v), eig = j % 4 === 2, satu = j === 0;
        if (s > 0.02 && !eig) panah(g, [0, 0], v, "var(--muted,#888)", 1, 0.25 * (1 - terang)); /* bayangan arah semula */
        var warna = eig ? (terang > 0 ? "var(--s2)" : "var(--s1)") : satu ? "var(--warn)" : "var(--s1)";
        var sorot = satu ? seg(t, 0.5, 0.9) * (1 - seg(t, 1.3, 1.6)) : 0;
        if (sorot > 0) panah(g, [0, 0], v, "var(--warn)", 1.6, 0.5 * sorot); /* (1, 0) sebelum ditarik */
        panah(gTop, [0, 0], w, satu && sorot > 0.05 ? "var(--warn)" : warna, eig ? 1.6 + 1.6 * terang : satu ? 1.6 + 1.4 * sorot : 1.6, eig ? 1 : Math.max(sorot, 1 - 0.75 * terang));
      }
      /* label tahap 2: (1,0) → (2,1) */
      var lb = seg(t, 0.8, 1.0) * (1 - seg(t, 1.3, 1.6));
      if (lb > 0 && s > 0.95) { var w1 = M(s, [1, 0]); teks(gTop, w1[0] + 0.15, w1[1] + 0.15, "(1, 0) → (2, 1)", "var(--warn)", 16, lb, "start"); }
      /* label tahap 3: ×3 dan ×1 */
      if (terang > 0) {
        var l3 = 1 + 2 * s;
        teks(gTop, l3 * 0.707 + 0.25, l3 * 0.707 + 0.1, "×" + (Math.abs(l3 - Math.round(l3)) < 0.05 ? Math.round(l3) : l3.toFixed(1).replace(".", ",")), "var(--s2)", 18, terang, "start");
        teks(gTop, 0.95, -0.95, "×1", "var(--s2)", 18, terang, "start");
      }
      /* tahap 4: rumus */
      if (rumus > 0) {
        var tx = el("text", { x: Wd / 2, y: Hd - 36, "text-anchor": "middle", style: "font-size:24px;font-weight:700;opacity:" + rumus }, gTop);
        [["A", "var(--s1)"], [" v", "var(--s2)"], ["  =  ", "var(--text,currentColor)"], ["λ", "var(--accent,var(--s1))"], [" v", "var(--s2)"]].forEach(function (p) { var ts = el("tspan", { style: "fill:" + p[1] + ";white-space:pre" }, tx); ts.textContent = p[0]; });
        teks(gTop, 0, (cy - 18) / k, "A = tarikan · v = panah yang setia · λ = kali panjangnya", "var(--muted,#888)", 15, rumus * (1 - akhir));
      }
      if (akhir > 0) teks(gTop, 0, (cy - 26) / k, "↓ coba sendiri di bawah", "var(--s2)", 16, akhir);
    });
  };
})();
