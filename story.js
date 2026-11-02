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
    return { ulang: function () { last = kini; draw(svg, kini); }, kartu: lst };
  }

  /* 2.7 Eigen. Kalimat inti: "lihat arah y = x tetap sementara hampir semua panah lain berbelok".
     Salah paham yang diluruskan: matriks bukan sekadar tabel angka, ia memindahkan setiap panah.
     Angka dicek dengan Python: A(1,0) = (2,1), A(1,1) = (3,3), A(1,-1) = (1,-1); iterasi dari (1,0):
     26,57° -> 38,66° -> 42,88° -> 44,29° -> 44,76° -> 44,92° (menuju 45°). */
  W.eigenStory = function (host) {
    var tebak = null, U = [[2, 1], [1, 2]], jejak = [[1, 0]], A = [[2, 1], [1, 2]];
    var kartu = [
      "<b>Satu panah dulu.</b> Ini panah (1, 0), menunjuk lurus ke kanan. Matriks A = [[2, 1], [1, 2]] akan memindahkannya. Perhatikan panah oranye ini saja.",
      "<b>Hitung dengan tangan.</b> A·(1, 0) = (2·1 + 1·0, 1·1 + 2·0) = <b>(2, 1)</b>. Panahnya tidak hanya memanjang, arahnya juga <b>berbelok</b> ke atas.",
      "<b>Sekarang tebak.</b> Di gambar ada 16 panah ke segala arah. Kalau semuanya dikali A, menurutmu panah mana yang <b>tidak berbelok</b>?<div class=\"st-tebak\" role=\"group\" aria-label=\"pilihan tebakan\"><button type=\"button\" data-v=\"(0, 1)\">↑ (0, 1)</button><button type=\"button\" data-v=\"(1, 1)\">↗ (1, 1)</button><button type=\"button\" data-v=\"(−1, 1)\">↖ (−1, 1)</button><button type=\"button\" data-v=\"tidak ada\">tidak ada</button></div><span class=\"st-hasil\"></span>",
      "<b>Tarik karetnya.</b> Seluruh lembar dikali A sekaligus. Garis putus-putus abu-abu adalah arah semula setiap panah, jadi kelihatan mana yang bergeser.",
      "<b>Kamera mundur.</b> Panahnya tidak berubah apa-apa, kita hanya menjauh supaya seluruh tarikan terlihat.",
      "<b>Dua arah yang setia.</b> (1, 1) menjadi (3, 3): arahnya tetap, panjangnya <b>3 kali</b>. (1, −1) menjadi (1, −1): tidak berubah sama sekali, <b>1 kali</b>. Arah seperti ini disebut <mark>vektor eigen</mark>, dan 3 serta 1 adalah <mark>nilai eigen</mark>-nya.<span class=\"st-cek\"></span>",
      "<b>Baru sekarang rumusnya.</b> A v = λ v artinya menarik v dengan A hasilnya sama dengan sekadar memanjangkan v sebanyak λ kali. Untuk v = (1, 1): A v = (3, 3) = 3 · (1, 1).",
      "<b>Giliranmu.</b> Ubah angka matriksnya, lalu tekan <b>kalikan lagi</b> berkali-kali. Panah (1, 0) dikali matriks berulang-ulang dan pelan-pelan menempel ke arah eigen yang nilai eigennya paling besar.<div class=\"st-mat\">[[<input data-i=\"00\" value=\"2\" inputmode=\"decimal\" aria-label=\"baris 1 kolom 1\">, <input data-i=\"01\" value=\"1\" inputmode=\"decimal\" aria-label=\"baris 1 kolom 2\">], [<input data-i=\"10\" value=\"1\" inputmode=\"decimal\" aria-label=\"baris 2 kolom 1\">, <input data-i=\"11\" value=\"2\" inputmode=\"decimal\" aria-label=\"baris 2 kolom 2\">]]</div><button type=\"button\" class=\"st-lagi\">kalikan lagi</button> <button type=\"button\" class=\"st-ulang\">mulai dari (1, 0)</button><span class=\"st-info\" aria-live=\"polite\"></span>"
    ];
    var Wd = 520, Hd = 400, cx = Wd / 2, cy = Hd / 2, k = 108;
    function X(x) { return cx + x * k; } function Y(y) { return cy - y * k; }
    function kali(Mx, v) { return [Mx[0][0] * v[0] + Mx[0][1] * v[1], Mx[1][0] * v[0] + Mx[1][1] * v[1]]; }
    function M(Mx, s, v) { var w = kali(Mx, v); return [v[0] + s * (w[0] - v[0]), v[1] + s * (w[1] - v[1])]; } /* (I + s(A − I))v */
    function eigArah(Mx) {
      var a = Mx[0][0], b = Mx[0][1], c = Mx[1][0], d = Mx[1][1], tr = a + d, D = tr * tr - 4 * (a * d - b * c), out = [];
      if (D < -1e-9) return out;
      [(tr + Math.sqrt(Math.max(D, 0))) / 2, (tr - Math.sqrt(Math.max(D, 0))) / 2].forEach(function (L, i) {
        var v = Math.abs(b) > 1e-9 ? [b, L - a] : Math.abs(c) > 1e-9 ? [L - d, c] : (i ? [0, 1] : [1, 0]), n = Math.hypot(v[0], v[1]);
        if (!(i && D < 1e-9 && (Math.abs(b) > 1e-9 || Math.abs(c) > 1e-9))) out.push({ v: [v[0] / n, v[1] / n], L: L }); /* satu arah saja kalau λ kembar */
      });
      return out;
    }
    function fmt(x) { return (Math.round(x * 100) / 100).toString().replace("-", "−").replace(".", ","); }
    function titik(v) { return "(" + fmt(v[0]) + "; " + fmt(v[1]) + ")"; }
    function panah(g, a, b, warna, lebar, op, garis) {
      var x1 = X(a[0]), y1 = Y(a[1]), x2 = X(b[0]), y2 = Y(b[1]), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, h = 7 + lebar;
      el("line", { x1: x1, y1: y1, x2: x2 - ux * h * 0.6, y2: y2 - uy * h * 0.6, style: "stroke:" + warna + ";stroke-width:" + lebar + ";stroke-linecap:round;opacity:" + op + (garis ? ";stroke-dasharray:" + garis : "") }, g);
      el("polygon", { points: [x2, y2, x2 - ux * h - uy * h * 0.5, y2 - uy * h + ux * h * 0.5, x2 - ux * h + uy * h * 0.5, y2 - uy * h - ux * h * 0.5].join(" "), style: "fill:" + warna + ";opacity:" + op }, g);
    }
    function teks(g, x, y, s, warna, uk, op, anchor) { var t = el("text", { x: X(x), y: Y(y), "text-anchor": anchor || "middle", style: "fill:" + warna + ";font-size:" + uk + "px;opacity:" + op + ";font-weight:600;paint-order:stroke;stroke:var(--bg);stroke-width:4px" }, g); t.textContent = s; return t; }
    function lembar(g, Mx, s) {
      var sd = [[-5, -5], [5, -5], [5, 5], [-5, 5]].map(function (v) { return M(Mx, s, v); });
      el("polygon", { points: sd.map(function (q) { return X(q[0]) + "," + Y(q[1]); }).join(" "), style: "fill:var(--s1);opacity:.07" }, g);
      for (var i = -5; i <= 5; i += 0.5) {
        var a = M(Mx, s, [i, -5]), b = M(Mx, s, [i, 5]), c = M(Mx, s, [-5, i]), d = M(Mx, s, [5, i]);
        el("line", { x1: X(a[0]), y1: Y(a[1]), x2: X(b[0]), y2: Y(b[1]), style: "stroke:var(--s1);opacity:.16" }, g);
        el("line", { x1: X(c[0]), y1: Y(c[1]), x2: X(d[0]), y2: Y(d[1]), style: "stroke:var(--s1);opacity:.16" }, g);
      }
    }
    var ALT = ["Satu panah oranye (1, 0) menunjuk ke kanan.", "Panah (1, 0) dikali A menjadi (2, 1) dan berbelok ke atas.", "Enam belas panah ke segala arah dari titik tengah.", "Seluruh lembar ditarik matriks A; hampir semua panah berbelok.", "Pandangan menjauh supaya seluruh tarikan terlihat.", "Garis y = x memanjang 3 kali, garis y = −x tidak berubah.", "Rumus A v = lambda v."];
    var C = cerita(host, kartu, function (svg, t) {
      svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = "";
      var dfs = el("defs", {}, svg), cp = el("clipPath", { id: "stclip" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hd }, cp);
      var rg = el("radialGradient", { id: "stfade", cx: "50%", cy: "50%", r: "50%" }, dfs);
      el("stop", { offset: "72%", "stop-color": "#fff" }, rg); el("stop", { offset: "100%", "stop-color": "#000" }, rg);
      var mk = el("mask", { id: "stmask" }, dfs); el("rect", { x: 0, y: 0, width: Wd, height: Hd, fill: "url(#stfade)" }, mk);
      var gTop = el("g", { "clip-path": "url(#stclip)" }, svg), g = el("g", { mask: "url(#stmask)" }, gTop);
      /* tahap: 0 satu panah · 1 hitung · 2 tebak · 3 tarik · 4 kamera · 5 setia · 6 rumus · 7 giliranmu. Satu perubahan per tahap. */
      var hit = seg(t, 0.2, 1), muncul = seg(t, 1.3, 2), s = seg(t, 2.2, 3), kam = seg(t, 3.2, 4), terang = seg(t, 4.2, 5), rumus = seg(t, 5.2, 6);
      k = 108 - 44 * kam;
      if (t > 6.6) { /* tahap 7: matriks milik pembaca dan iterasi pangkat */
        k = 64; lembar(g, U, 1);
        eigArah(U).forEach(function (e) {
          el("line", { x1: X(-6 * e.v[0]), y1: Y(-6 * e.v[1]), x2: X(6 * e.v[0]), y2: Y(6 * e.v[1]), style: "stroke:var(--s2);stroke-dasharray:5 6;opacity:.7" }, g);
          teks(gTop, 2.7 * e.v[0] + 0.1, 2.7 * e.v[1] + 0.25, "λ = " + fmt(e.L), "var(--s2)", 15, 1, "start");
        });
        jejak.forEach(function (v, i) {
          var n = Math.hypot(v[0], v[1]) || 1, u = [2 * v[0] / n, 2 * v[1] / n], akhir = i === jejak.length - 1;
          panah(gTop, [0, 0], u, "var(--warn)", akhir ? 3 : 1.4, akhir ? 1 : 0.15 + 0.5 * (i + 1) / jejak.length, akhir ? null : "4 4");
        });
        var v = jejak[jejak.length - 1];
        teks(gTop, 0, -(cy - 30) / k, "langkah " + (jejak.length - 1) + " · sudut " + fmt(Math.atan2(v[1], v[0]) * 180 / Math.PI) + "°", "var(--warn)", 16, 1);
        svg.setAttribute("aria-label", "Panah (1, 0) setelah dikali matriks " + (jejak.length - 1) + " kali; garis putus-putus adalah arah eigen.");
        return;
      }
      lembar(g, A, s);
      if (terang > 0) [[1, 1], [1, -1]].forEach(function (v) { el("line", { x1: X(-5 * v[0]), y1: Y(-5 * v[1]), x2: X(5 * v[0]), y2: Y(5 * v[1]), style: "stroke:var(--s2);stroke-dasharray:5 6;opacity:" + 0.6 * terang }, g); });
      if (muncul > 0) for (var j = 1; j < 16; j++) { /* 15 panah lain muncul di tahap tebak */
        var ang = j * Math.PI / 8, v0 = [Math.cos(ang), Math.sin(ang)], w = M(A, s, v0), eig = j % 4 === 2;
        if (s > 0.02 && !eig) panah(g, [0, 0], v0, "var(--muted,#888)", 1, 0.35 * (1 - terang) * muncul, "3 3");
        panah(gTop, [0, 0], w, eig && terang > 0 ? "var(--s2)" : "var(--s1)", eig ? 1.6 + 1.6 * terang : 1.6, muncul * (eig ? 1 : 1 - 0.7 * terang));
      }
      /* panah (1, 0): bergerak sendirian di tahap 1, lalu diam di (2, 1) */
      var p10 = M(A, hit, [1, 0]);
      if (hit > 0.02) panah(g, [0, 0], [1, 0], "var(--warn)", 1.4, 0.5 * (1 - terang), "4 4");
      panah(gTop, [0, 0], p10, "var(--warn)", 3, 1 - 0.6 * terang);
      if (hit < 0.02) teks(gTop, 1.05, 0.12, "(1, 0)", "var(--warn)", 17, 1, "start");
      else if (terang < 1) teks(gTop, p10[0] + 0.05, p10[1] + 0.22, hit < 0.98 ? titik(p10).replace(";", ",") : "(1, 0) → (2, 1)", "var(--warn)", 16, 1 - terang, "end");
      if (hit > 0 && muncul < 1) teks(gTop, 0, (cy - 22) / k, "A·(1, 0) = (2·1 + 1·0, 1·1 + 2·0) = (2, 1)", "var(--muted,#888)", 15, hit * (1 - muncul));
      if (terang > 0) {
        teks(gTop, 3 * 0.707 - 0.2, 3 * 0.707 + 0.05, "(1, 1) → (3, 3)  ×3", "var(--s2)", 16, terang, "end");
        teks(gTop, 0.95, -0.95, "(1, −1) → (1, −1)  ×1", "var(--s2)", 16, terang, "start");
      }
      if (rumus > 0) {
        var tx = el("text", { x: Wd / 2, y: Hd - 34, "text-anchor": "middle", style: "font-size:24px;font-weight:700;opacity:" + rumus }, gTop);
        [["A", "var(--s1)"], [" v", "var(--s2)"], ["  =  ", "var(--text,currentColor)"], ["λ", "var(--accent,var(--s1))"], [" v", "var(--s2)"]].forEach(function (p) { var ts = el("tspan", { style: "fill:" + p[1] + ";white-space:pre" }, tx); ts.textContent = p[0]; });
      }
      svg.setAttribute("aria-label", ALT[Math.min(6, Math.round(t))]);
    });
    /* tebakan, matriks, kalikan lagi */
    var kt = C.kartu, hasil = kt.querySelector(".st-hasil"), cek = kt.querySelector(".st-cek"), info = kt.querySelector(".st-info"), tombol = kt.querySelectorAll(".st-tebak button");
    [].forEach.call(tombol, function (b) {
      b.addEventListener("click", function () {
        tebak = b.getAttribute("data-v");
        [].forEach.call(tombol, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        hasil.textContent = "Tebakanmu: " + tebak + ". Gulir terus untuk mengeceknya.";
        cek.textContent = tebak === "(1, 1)" || tebak === "(−1, 1)" ? "Tebakanmu " + tebak + " benar: panah itu ada di salah satu garis setia." : "Tebakanmu " + tebak + " belum tepat: lihat lagi panah itu, ia ikut berbelok.";
      });
    });
    function lapor() { info.textContent = "Sekarang " + titik(jejak[jejak.length - 1]).replace(";", ",") + " setelah dikali " + (jejak.length - 1) + " kali."; }
    [].forEach.call(kt.querySelectorAll(".st-mat input"), function (x) {
      x.addEventListener("input", function () {
        var n = parseFloat(x.value.replace(",", ".")), i = x.getAttribute("data-i");
        if (isFinite(n)) U[+i[0]][+i[1]] = n;
        jejak = [[1, 0]]; lapor(); C.ulang();
      });
    });
    kt.querySelector(".st-lagi").addEventListener("click", function () {
      var v = kali(U, jejak[jejak.length - 1]);
      jejak.push(v); if (jejak.length > 13) jejak.shift();
      lapor(); C.ulang();
    });
    kt.querySelector(".st-ulang").addEventListener("click", function () { jejak = [[1, 0]]; lapor(); C.ulang(); });
    lapor();
  };
})();
