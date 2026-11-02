/* Urutan gambar diam bertanya (bentuk S di rencana-visualisasi.md): beberapa gambar diam berurutan,
   dan pertanyaan tebak harus dijawab sebelum gambar berikutnya dibuka. Tidak ada gerakan yang bisa menyesatkan.
   Angka dicek dengan Python (2 Nov 2026):
     0.7 s(t) = t² di t = 2: kemiringan garis potong = 4 + h → h = 2: 6; 1: 5; 0,1: 4,1; 0,01: 4,01; garis singgung 4
     2.8 A = [[2; 1,5], [0; 1]]: σ = 2,5784; 0,7757; V kolom 1 = (0,7497; 0,6618); U kolom 1 = (0,9665; 0,2567); varians sumbu 1 = 91,7%
     3.5 data latih x = 0,05 … 0,95 (10 titik), uji x = 0,1 … 0,9 (9 titik), y = sin(2πx) + noise:
         MSE latih/uji derajat 1: 0,136/0,185; 3: 0,017/0,045; 9: 0,000/0,133 */
(function () {
  var V = window.VIZ, W = V.W, el = V.el, fmt = V.fmt;
  var C1 = "var(--s1)", C2 = "var(--s2)", INK = "var(--ink)", MU = "var(--muted)", WA = "var(--warn)", GR = "var(--line2)";
  function A(g) {
    return {
      garis: function (x1, y1, x2, y2, c, w, d) { return el("line", { x1: x1, y1: y1, x2: x2, y2: y2, style: "stroke:" + c + ";stroke-width:" + (w || 2) + ";stroke-linecap:round;" + (d ? "stroke-dasharray:" + d : "") }, g); },
      jalur: function (pts, c, w, d, o) { return el("polyline", { points: pts.map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "), style: "fill:none;stroke:" + c + ";stroke-width:" + (w || 2) + ";opacity:" + (o == null ? 1 : o) + ";stroke-linejoin:round;" + (d ? "stroke-dasharray:" + d : "") }, g); },
      titik: function (x, y, r, c, o) { return el("circle", { cx: x, cy: y, r: r, style: "fill:" + c + ";opacity:" + (o == null ? 1 : o) + ";stroke:var(--bg);stroke-width:1.5" }, g); },
      teks: function (x, y, s, c, uk, anchor) { var t = el("text", { x: x, y: y, "text-anchor": anchor || "middle", style: "fill:" + (c || INK) + ";font-size:" + (uk || 14) + "px;font-weight:600;paint-order:stroke;stroke:var(--bg);stroke-width:4px" }, g); t.textContent = s; return t; },
      panah: function (x1, y1, x2, y2, c, w) { var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return; var ux = dx / L, uy = dy / L, k = Math.min(11, L * 0.45); this.garis(x1, y1, x2 - ux * k * 0.6, y2 - uy * k * 0.6, c, w || 3); el("polygon", { points: x2 + "," + y2 + " " + (x2 - ux * k - uy * k * 0.5) + "," + (y2 - uy * k + ux * k * 0.5) + " " + (x2 - ux * k + uy * k * 0.5) + "," + (y2 - uy * k - ux * k * 0.5), style: "fill:" + c }, g); }
    };
  }

  /* spec: { judul, langkah: [{ teks, gambar(svg, a), tanya?: {q, opsi, benar, jelas} }] } */
  W.urutan = function (host, spec) {
    host.classList.add("urt");
    host.innerHTML = '<div class="urt-h"><b>Gambar demi gambar</b> <span>' + spec.judul + '</span></div><div class="urt-dot" aria-hidden="true"></div><svg role="img"></svg><p class="urt-t" aria-live="polite"></p><div class="urt-q"></div><div class="urt-n"><button type="button" class="urt-prev">← sebelumnya</button><button type="button" class="urt-next">berikutnya →</button></div>';
    var svg = host.querySelector("svg"), tk = host.querySelector(".urt-t"), qk = host.querySelector(".urt-q"), dots = host.querySelector(".urt-dot"), bp = host.querySelector(".urt-prev"), bn = host.querySelector(".urt-next");
    var i = 0, dijawab = {}, n = spec.langkah.length;
    function tampil() {
      var L = spec.langkah[i]; svg.innerHTML = ""; svg.setAttribute("viewBox", "0 0 520 " + (L.tinggi || 340)); svg.setAttribute("aria-label", "Gambar " + (i + 1) + " dari " + n);
      L.gambar(svg, A(svg));
      tk.innerHTML = "<b>" + (i + 1) + "/" + n + ".</b> " + L.teks;
      dots.innerHTML = spec.langkah.map(function (_, k) { return '<span class="' + (k === i ? "on" : k < i ? "lalu" : "") + '"></span>'; }).join("");
      qk.innerHTML = "";
      if (L.tanya) {
        var q = L.tanya; qk.innerHTML = "<b>Tebak dulu:</b> " + q.q + " ";
        var r = document.createElement("span"); r.className = "tb6-r";
        q.opsi.forEach(function (o, k) {
          var b = document.createElement("button"); b.type = "button"; b.textContent = o;
          if (dijawab[i] !== undefined) { b.disabled = true; if (k === dijawab[i]) b.classList.add(k === q.benar ? "ok" : "no"); }
          b.addEventListener("click", function () { dijawab[i] = k; tampil(); });
          qk.appendChild(b);
        });
        if (dijawab[i] !== undefined) r.innerHTML = (dijawab[i] === q.benar ? "Tepat. " : "Belum tepat, jawabannya <b>" + q.opsi[q.benar] + "</b>. ") + q.jelas;
        qk.appendChild(r);
      }
      bp.disabled = i === 0; bn.disabled = i === n - 1 || (L.tanya && dijawab[i] === undefined);
      bn.textContent = L.tanya && dijawab[i] === undefined ? "jawab dulu, baru lanjut" : "berikutnya →";
    }
    bp.addEventListener("click", function () { if (i > 0) { i--; tampil(); } });
    bn.addEventListener("click", function () { if (i < n - 1) { i++; tampil(); } });
    tampil();
  };

  /* ---------- 0.7 Laju sesaat: garis potong menyusut menjadi garis singgung ---------- */
  W.lajuUrutan = function (host) {
    var X0 = 50, Y0 = 300, sx = 100, sy = 15;
    function X(t) { return X0 + sx * t; } function Y(s) { return Y0 - sy * s; }
    function sumbu(a) { a.garis(X0, Y0, 490, Y0, MU, 1.2); a.garis(X0, Y0, X0, 20, MU, 1.2); [0, 1, 2, 3, 4].forEach(function (t) { a.teks(X(t), Y0 + 18, t + " s", MU, 12); }); a.teks(X0 + 8, 30, "posisi (m)", MU, 12, "start"); }
    function kurva(a, w) { var p = []; for (var t = 0; t <= 4.3; t += 0.05) p.push([X(t), Y(t * t)]); a.jalur(p, C1, w || 2.5); }
    function potong(a, h, c, label) { var m = 4 + h, x1 = 2 - 0.6, x2 = Math.min(4.3, 2 + h + 0.6); a.garis(X(x1), Y(4 + m * (x1 - 2)), X(x2), Y(4 + m * (x2 - 2)), c, 2); a.titik(X(2 + h), Y((2 + h) * (2 + h)), 5, c); if (label) a.teks(X(x2) + 6, Y(4 + m * (x2 - 2)) + 4, label, c, 13, "start"); }
    W.urutan(host, {
      judul: "Mobil dengan posisi s(t) = t² meter. Berapa kecepatannya tepat di t = 2 detik?",
      langkah: [
        { teks: "Kurva ini posisi mobil setiap saat. Kecepatan tepat di t = 2 kelihatannya mustahil dihitung, karena kecepatan butuh dua waktu: jarak dibagi selang waktu.", gambar: function (s, a) { sumbu(a); kurva(a); a.titik(X(2), Y(4), 6, INK); a.teks(X(2) - 10, Y(4) - 10, "t = 2, s = 4", INK, 13, "end"); } },
        { teks: "Ambil selang 2 detik, dari t = 2 sampai t = 4. Posisi naik dari 4 ke 16 meter, jadi kecepatan rata-ratanya (16 − 4) / 2 = <b>6 m/s</b>. Itulah kemiringan garis potong biru.", gambar: function (s, a) { sumbu(a); kurva(a); potong(a, 2, C2, "6"); a.titik(X(2), Y(4), 6, INK); a.teks(X(0.15), 70, "kemiringan garis potong = 6", C2, 13, "start"); },
          tanya: { q: "kalau selangnya diperkecil terus, kemiringannya…", opsi: ["terus naik", "terus turun tanpa batas", "mendekati satu angka"], benar: 2, jelas: "Kemiringannya 4 + h, jadi makin kecil h makin dekat ke 4." } },
        { teks: "Selang menyusut: h = 2 memberi 6, h = 1 memberi 5, h = 0,1 memberi 4,1, h = 0,01 memberi 4,01. Garis potongnya berputar dan angkanya makin mendekati <b>4</b>.", gambar: function (s, a) { sumbu(a); kurva(a); potong(a, 2, MU, "6"); potong(a, 1, INK, "5"); potong(a, 0.1, C2, "4,1"); a.titik(X(2), Y(4), 6, INK); a.teks(300, 40, "h = 0,01 → 4,01 (garisnya sudah tak bisa dibedakan)", MU, 12, "middle"); } },
        { teks: "Angka tujuan itu adalah kemiringan <b>garis singgung</b> di t = 2: kecepatan sesaat = 4 m/s. Kita tidak pernah membagi dengan nol; kita melihat ke mana angkanya menuju.", gambar: function (s, a) { sumbu(a); kurva(a); a.garis(X(0.9), Y(4 + 4 * (0.9 - 2)), X(3.6), Y(4 + 4 * (3.6 - 2)), WA, 2.5); a.titik(X(2), Y(4), 6, INK); a.teks(X(3.6) - 10, Y(10.4) - 10, "garis singgung, kemiringan 4", WA, 13, "end"); } },
        { teks: "Perbesar di sekitar t = 2 (jendela ±0,05 detik): kurvanya hampir tak bisa dibedakan dari garis lurus berkemiringan 4. Inilah makna turunan: dari dekat sekali, setiap kurva mulus tampak lurus. Widget di bawah memperlihatkan hal yang sama sambil digeser.", gambar: function (s, a) {
          var w = 0.05, x0 = 60, x1 = 460, y0 = 300, y1 = 40; function XX(t) { return x0 + (t - (2 - w)) / (2 * w) * (x1 - x0); } function YY(v) { return y0 - (v - (4 - 4 * w * 1.2)) / (8 * w * 1.2) * (y0 - y1); }
          var p = [], q = []; for (var t = 2 - w; t <= 2 + w + 1e-9; t += w / 50) { p.push([XX(t), YY(t * t)]); q.push([XX(t), YY(4 + 4 * (t - 2))]); }
          a.jalur(q, WA, 5, null, 0.5); a.jalur(p, C1, 2.5); a.titik(XX(2), YY(4), 6, INK);
          a.teks(XX(1.96), y0 + 22, "t = 1,96", MU, 12); a.teks(XX(2.04), y0 + 22, "t = 2,04", MU, 12); a.teks(260, 26, "ungu = kurva, kuning tebal = garis singgung", MU, 12);
        } }
      ]
    });
  };

  /* ---------- 2.8 SVD: putar, regangkan, putar ---------- */
  W.svdUrutan = function (host) {
    var M = [[2, 1.5], [0, 1]], sg = [2.5784, 0.7757], v1 = [0.7497, 0.6618], v2 = [-0.6618, 0.7497], u1 = [0.9665, 0.2567], u2 = [-0.2567, 0.9665];
    var S = 62, OX = 260, OY = 170;
    function P(q) { return [OX + S * q[0], OY - S * q[1]]; }
    function bidang(a) { a.garis(OX - 240, OY, OX + 240, OY, GR, 1); a.garis(OX, OY - 160, OX, OY + 160, GR, 1); }
    function lingkar(a, f, c, w, d) { var p = []; for (var k = 0; k <= 96; k++) { var t = k / 96 * 2 * Math.PI; p.push(P(f([Math.cos(t), Math.sin(t)]))); } a.jalur(p, c, w || 2.5, d); }
    function dua(a, f, l1, l2) { var p1 = P(f(v1)), p2 = P(f(v2)), o = P([0, 0]); a.panah(o[0], o[1], p1[0], p1[1], C1, 3); a.panah(o[0], o[1], p2[0], p2[1], C2, 3); if (l1) a.teks(p1[0] + 8, p1[1] - 6, l1, C1, 13, "start"); if (l2) a.teks(p2[0] - 8, p2[1] - 6, l2, C2, 13, "end"); }
    function I(q) { return q; }
    function Vt(q) { return [v1[0] * q[0] + v1[1] * q[1], v2[0] * q[0] + v2[1] * q[1]]; }
    function Sg(q) { return [sg[0] * q[0], sg[1] * q[1]]; }
    function U(q) { return [u1[0] * q[0] + u2[0] * q[1], u1[1] * q[0] + u2[1] * q[1]]; }
    function Am(q) { return [M[0][0] * q[0] + M[0][1] * q[1], M[1][0] * q[0] + M[1][1] * q[1]]; }
    var seed = 5; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; } function rn() { return Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd()); }
    var awan = []; for (var k = 0; k < 120; k++) awan.push(Am([rn() * 0.55, rn() * 0.55]));
    W.urutan(host, {
      judul: "Matriks A = [[2; 1,5], [0; 1]] dikenakan pada lingkaran satuan",
      langkah: [
        { teks: "Lingkaran satuan, dengan dua panah tegak lurus yang dipilih khusus (nanti terlihat kenapa). Matriks A akan menggerakkan setiap titik lingkaran.", gambar: function (s, a) { bidang(a); lingkar(a, I, MU); dua(a, I, "v₁", "v₂"); },
          tanya: { q: "lingkaran dikali A menjadi bentuk apa?", opsi: ["lingkaran lebih besar", "elips", "jajaran genjang"], benar: 1, jelas: "Matriks apa pun mengubah lingkaran menjadi elips (atau garis, kalau gepeng). Gambar berikutnya menunjukkan kenapa: A bisa dipecah menjadi putar, regangkan, putar." } },
        { teks: "Langkah 1, <b>putar</b> (Vᵀ): kedua panah khusus diputar sampai tepat menempel ke sumbu x dan y. Lingkarannya tidak berubah, karena memutar lingkaran tetap memberi lingkaran.", gambar: function (s, a) { bidang(a); lingkar(a, Vt, MU); dua(a, Vt, "v₁ → sumbu x", "v₂ → sumbu y"); } },
        { teks: "Langkah 2, <b>regangkan</b> sepanjang sumbu (Σ): sumbu x dikali σ₁ = 2,58, sumbu y dikali σ₂ = 0,78. Lingkaran menjadi elips yang tegak lurus sumbu. σ₁ dan σ₂ adalah nilai singular, panjang kedua jari-jari elips.", gambar: function (s, a) { bidang(a); lingkar(a, function (q) { return Sg(Vt(q)); }, C1); dua(a, function (q) { return Sg(Vt(q)); }, "σ₁ = 2,58", "σ₂ = 0,78"); } },
        { teks: "Langkah 3, <b>putar</b> lagi (U): elips diputar ke posisi akhirnya. Garis putus-putus kuning adalah A dikenakan langsung pada lingkaran. Keduanya berimpit persis: A = U·Σ·Vᵀ.", gambar: function (s, a) { bidang(a); lingkar(a, function (q) { return U(Sg(Vt(q))); }, C1, 4); lingkar(a, Am, WA, 2, "6 5"); dua(a, function (q) { return U(Sg(Vt(q))); }, "", ""); } },
        { teks: "Ganti lingkaran dengan awan data yang dibentuk oleh A. Sumbu terpanjang elips (ungu) adalah <b>komponen utama pertama PCA</b>: arah sebaran terbesar, memuat σ₁² / (σ₁² + σ₂²) = 91,7% varians. PCA adalah SVD yang dikenakan pada data.", gambar: function (s, a) { bidang(a); awan.forEach(function (q) { var p = P(q); a.titik(p[0], p[1], 3, MU, 0.6); }); var o = P([0, 0]), e1 = P([u1[0] * sg[0] * 0.55 * 2, u1[1] * sg[0] * 0.55 * 2]), e2 = P([u2[0] * sg[1] * 0.55 * 2, u2[1] * sg[1] * 0.55 * 2]); a.panah(o[0], o[1], e1[0], e1[1], C1, 3.5); a.panah(o[0], o[1], e2[0], e2[1], C2, 3.5); a.teks(e1[0] - 4, e1[1] - 10, "PC1: 91,7%", C1, 13, "end"); a.teks(e2[0] - 6, e2[1] - 8, "PC2: 8,3%", C2, 13, "end"); } }
      ]
    });
  };

  /* ---------- 3.5 Overfitting ---------- */
  function polyfit(xs, ys, d) {
    var n = d + 1, Mx = [], b = [], i, j, k;
    for (i = 0; i < n; i++) { Mx.push(new Array(n).fill(0)); b.push(0); }
    xs.forEach(function (x, r) { var z = 2 * x - 1, p = []; for (i = 0; i < n; i++) p.push(Math.pow(z, i)); for (i = 0; i < n; i++) { b[i] += p[i] * ys[r]; for (j = 0; j < n; j++) Mx[i][j] += p[i] * p[j]; } });
    for (i = 0; i < n; i++) { var mx = i; for (k = i + 1; k < n; k++) if (Math.abs(Mx[k][i]) > Math.abs(Mx[mx][i])) mx = k; var tm = Mx[i]; Mx[i] = Mx[mx]; Mx[mx] = tm; var tb = b[i]; b[i] = b[mx]; b[mx] = tb; for (k = i + 1; k < n; k++) { var f = Mx[k][i] / Mx[i][i]; for (j = i; j < n; j++) Mx[k][j] -= f * Mx[i][j]; b[k] -= f * b[i]; } }
    var c = new Array(n).fill(0); for (i = n - 1; i >= 0; i--) { var s = b[i]; for (j = i + 1; j < n; j++) s -= Mx[i][j] * c[j]; c[i] = s / Mx[i][i]; }
    return function (x) { var z = 2 * x - 1, s = 0; for (var i = n - 1; i >= 0; i--) s = s * z + c[i]; return s; };
  }
  function mse(f, xs, ys) { return xs.reduce(function (a, x, i) { return a + (f(x) - ys[i]) * (f(x) - ys[i]); }, 0) / xs.length; }
  W.overfitUrutan = function (host) {
    var xt = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95], yt = [0.309, 0.884, 0.931, 0.586, 0.195, -0.557, -0.794, -0.665, -0.932, -0.464];
    var xs = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], ys = [0.71, 1.04, 0.977, 0.355, -0.007, -0.414, -1.287, -1.065, -1.063];
    var F = {}; [1, 3, 9].forEach(function (d) { F[d] = polyfit(xt, yt, d); });
    var X0 = 40, X1 = 480, Y0 = 170, SY = 85; function X(x) { return X0 + (X1 - X0) * x; } function Y(y) { return Y0 - SY * y; }
    function dasar(a) { a.garis(X0, Y0, X1, Y0, GR, 1); a.garis(X0, 20, X0, 320, GR, 1); }
    function kurva(a, f, c, w, o) { var p = []; for (var x = 0; x <= 1.0001; x += 0.005) { var y = f(x); if (y > 1.75) y = 1.75; if (y < -1.75) y = -1.75; p.push([X(x), Y(y)]); } a.jalur(p, c, w || 2.5, null, o); }
    function latih(a) { xt.forEach(function (x, i) { a.titik(X(x), Y(yt[i]), 5, INK); }); }
    function uji(a) { xs.forEach(function (x, i) { el("rect", { x: X(x) - 5, y: Y(ys[i]) - 5, width: 10, height: 10, style: "fill:var(--warn)" }, a._g); }); }
    var seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; } function rn() { return Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd()); }
    var set20 = []; for (var k = 0; k < 20; k++) { var y = xt.map(function (x) { return Math.sin(2 * Math.PI * x) + 0.25 * rn(); }); set20.push({ f1: polyfit(xt, y, 1), f9: polyfit(xt, y, 9) }); }
    function g(a, s) { a._g = s; return a; }
    W.urutan(host, {
      judul: "Sepuluh titik data latih (hitam) dari pola tersembunyi y = sin(2πx) ditambah noise",
      langkah: [
        { teks: "Kita mau mencari kurva yang menjelaskan titik-titik ini, memakai polinomial berderajat d. Derajat tinggi berarti kurvanya boleh lebih berliku.", gambar: function (s, a) { dasar(a); latih(a); },
          tanya: { q: "derajat mana yang paling baik menebak data baru?", opsi: ["1 (garis lurus)", "3", "9 (melewati semua titik)"], benar: 1, jelas: "Derajat 3 cukup lentur mengikuti pola gelombang tanpa ikut menghafal noise. Gambar berikutnya menunjukkan ketiganya." } },
        { teks: "Tiga kurva. Error latih (rata-rata kuadrat selisih ke titik hitam): derajat 1 = " + fmt(mse(F[1], xt, yt), 3) + ", derajat 3 = " + fmt(mse(F[3], xt, yt), 3) + ", derajat 9 = " + fmt(mse(F[9], xt, yt), 3) + ". Derajat 9 melewati setiap titik dengan sempurna. Sekilas ia juaranya.", gambar: function (s, a) { dasar(a); kurva(a, F[1], MU, 2); kurva(a, F[3], C2, 3); kurva(a, F[9], C1, 2); latih(a); a.teks(470, 300, "abu = derajat 1, biru = 3, ungu = 9", MU, 12, "end"); } },
        { teks: "Sekarang data baru dari pola yang sama (kotak kuning). Error uji: derajat 1 = " + fmt(mse(F[1], xs, ys), 3) + ", derajat 3 = <b>" + fmt(mse(F[3], xs, ys), 3) + "</b>, derajat 9 = " + fmt(mse(F[9], xs, ys), 3) + ". Kurva derajat 9 menghafal noise, sehingga meleset di antara titik latih. Error latih nol bukan berarti model terbaik.", gambar: function (s, a) { dasar(a); kurva(a, F[3], C2, 3); kurva(a, F[9], C1, 2); g(a, s); uji(a); latih(a); } },
        { teks: "Error untuk setiap derajat 0 sampai 9. Error latih (ungu) terus turun. Error uji (kuning) turun lalu naik lagi. Model terbaik ada di lembah kurva kuning, bukan di ujung kurva ungu.", gambar: function (s, a) {
          var tr = [], te = []; for (var d = 0; d <= 9; d++) { var f = polyfit(xt, yt, d); tr.push(mse(f, xt, yt)); te.push(mse(f, xs, ys)); }
          function XX(d) { return 70 + d * 42; } function YY(v) { return 290 - 260 * Math.sqrt(Math.min(v, 0.8) / 0.8); }
          a.garis(70, 290, 460, 290, GR, 1); a.garis(70, 290, 70, 25, GR, 1);
          for (d = 0; d <= 9; d++) a.teks(XX(d), 310, String(d), MU, 12);
          a.teks(265, 332, "derajat polinomial (sumbu tegak: akar error, supaya nilai kecil terlihat)", MU, 11);
          a.jalur(tr.map(function (v, d) { return [XX(d), YY(v)]; }), C1, 2.5); a.jalur(te.map(function (v, d) { return [XX(d), YY(v)]; }), WA, 2.5);
          tr.forEach(function (v, d) { a.titik(XX(d), YY(v), 4, C1); }); te.forEach(function (v, d) { a.titik(XX(d), YY(v), 4, WA); });
          a.teks(XX(3), YY(te[3]) - 12, "terbaik: " + fmt(te[3], 3), WA, 13); a.teks(XX(9) - 4, YY(tr[9]) - 10, "latih", C1, 12, "end"); a.teks(XX(9) - 4, YY(te[9]) - 10, "uji", WA, 12, "end");
        }, tinggi: 340 },
        { teks: "Ulangi dengan 20 kumpulan data latih berbeda dari pola yang sama. Garis lurus (kiri) selalu meleset dengan cara yang sama: itu <b>bias</b>. Derajat 9 (kanan) rata-ratanya dekat pola asli, tapi setiap kumpulan data memberi kurva yang sangat berbeda: itu <b>varians</b>. Model yang baik menyeimbangkan keduanya.", gambar: function (s, a) {
          [[0, "f1", "derajat 1: bias"], [1, "f9", "derajat 9: varians"]].forEach(function (pp) {
            var ox = 20 + pp[0] * 255, w = 235; function XX(x) { return ox + w * x; } function YY(y) { return 170 - 70 * Math.max(-2, Math.min(2, y)); }
            set20.forEach(function (st) { var p = []; for (var x = 0.03; x <= 0.97; x += 0.01) p.push([XX(x), YY(st[pp[1]](x))]); a.jalur(p, pp[0] ? C1 : MU, 1.2, null, 0.45); });
            var q = []; for (var x = 0; x <= 1; x += 0.01) q.push([XX(x), YY(Math.sin(2 * Math.PI * x))]); a.jalur(q, WA, 2.5, "6 4");
            a.teks(ox + w / 2, 325, pp[2], INK, 13);
          });
          a.teks(260, 22, "kuning putus-putus = pola asli sin(2πx)", MU, 12);
        } }
      ]
    });
  };
})();
