/* Cerita gulir tambahan: 2.3 gradien, 2.5 matriks sebagai transformasi, 3.1 gradient descent, 4.4 jalan acak.
   Memakai kerangka cerita() dari story.js. Semua posisi dihitung dari rumus yang sebenarnya.
   Angka dicek dengan Python (2 Nov 2026):
     2.3 f = ½x² + y², P = (2, 1): f = 3, ∇f = (2, 2), |∇f| = 2,83; turun η = 0,3: x × 0,7, y × 0,4 per langkah
     2.5 A = [[2, −1], [1, 1]]: A(1,0) = (2, 1), A(0,1) = (−1, 1), A(2,1) = (3, 3), det = 3
     3.1 f = x², x₀ = 3: η = 0,1 → 2,4 (×0,8); η = 0,45 → ×0,1; η = 1,05 → ×(−1,1) meledak
         lembah f = ½(x² + 10y²) dari (−3, 1), 20 langkah: GD η = 0,18 → loss 0,0023; momentum η = 0,04 β = 0,7 → 0,0007; Adam lr = 0,2 → 0,094
     4.4 jalan acak ±1: simpangan baku teori √t, t = 100 → 10, t = 400 → 20 */
(function () {
  var V = window.VIZ, W = V.W, el = V.el, fmt = V.fmt, seg = V.seg, cerita = V.cerita;
  var C1 = "var(--s1)", C2 = "var(--s2)", INK = "var(--ink)", MU = "var(--muted)", WA = "var(--warn)", GR = "var(--line2)";

  function alat(g) {
    var a = {};
    a.garis = function (x1, y1, x2, y2, c, w, o, d) { return el("line", { x1: x1, y1: y1, x2: x2, y2: y2, style: "stroke:" + c + ";stroke-width:" + (w || 2) + ";opacity:" + (o == null ? 1 : o) + ";stroke-linecap:round;" + (d ? "stroke-dasharray:" + d : "") }, g); };
    a.jalur = function (pts, c, w, o, d) { return el("polyline", { points: pts.map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "), style: "fill:none;stroke:" + c + ";stroke-width:" + (w || 2) + ";opacity:" + (o == null ? 1 : o) + ";stroke-linejoin:round;stroke-linecap:round;" + (d ? "stroke-dasharray:" + d : "") }, g); };
    a.titik = function (x, y, r, c, o) { return el("circle", { cx: x, cy: y, r: r, style: "fill:" + c + ";opacity:" + (o == null ? 1 : o) + ";stroke:var(--bg);stroke-width:2" }, g); };
    a.teks = function (x, y, s, c, uk, o, anchor, tebal) { var t = el("text", { x: x, y: y, "text-anchor": anchor || "middle", style: "fill:" + (c || INK) + ";font-size:" + (uk || 14) + "px;opacity:" + (o == null ? 1 : o) + ";" + (tebal === false ? "" : "font-weight:600;") + "paint-order:stroke;stroke:var(--bg);stroke-width:4px" }, g); t.textContent = s; return t; };
    a.panah = function (x1, y1, x2, y2, c, w, o) {
      var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return;
      var ux = dx / L, uy = dy / L, k = Math.min(12, L * 0.45);
      a.garis(x1, y1, x2 - ux * k * 0.6, y2 - uy * k * 0.6, c, w || 3, o);
      el("polygon", { points: x2 + "," + y2 + " " + (x2 - ux * k - uy * k * 0.5) + "," + (y2 - uy * k + ux * k * 0.5) + " " + (x2 - ux * k + uy * k * 0.5) + "," + (y2 - uy * k - ux * k * 0.5), style: "fill:" + c + ";opacity:" + (o == null ? 1 : o) }, g);
    };
    return a;
  }
  function lokasi(svg, e) { var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }

  /* ---------------- 2.3 Gradien ---------------- */
  W.gradStory = function (host) {
    var Wd = 520, Hd = 430, S = 72, OX = 260, OY = 205;
    function X(x) { return OX + S * x; } function Y(y) { return OY - S * y; }
    function f(x, y) { return 0.5 * x * x + y * y; }
    var P = [2, 1], tKini = 0;
    var kartu = [
      "Ini peta kontur sebuah lembah loss, f(x, y) = ½x² + y². Setiap elips menghubungkan titik-titik yang tingginya sama, persis seperti garis ketinggian di peta gunung, dan dasar lembahnya ada di (0, 0). Kamu berdiri di titik <b>P = (2, 1)</b>, tingginya f = 2 + 1 = 3.",
      "Coba melangkah setengah satuan ke delapan arah. Angka di ujung setiap panah adalah perubahan tinggi kalau kamu melangkah ke sana. Ada yang naik, ada yang turun, dan ada yang hampir tidak berubah.",
      "<b>Tebak dulu:</b> ke arah mana tanjakannya paling curam? Perhatikan juga arah yang angkanya paling dekat ke nol. Arah itu berjalan menyusuri elips, tidak memotongnya.",
      "Panah ungu adalah <b>gradien</b> ∇f = (∂f/∂x, ∂f/∂y) = (x, 2y) = (2, 2). Ia tegak lurus terhadap garis kontur (garis putus-putus menyinggung elips di P) dan menunjuk ke arah naik tercuram. Itulah sebabnya langkah ke kanan-atas tadi memberi kenaikan terbesar.",
      "Gradien bukan dua turunan yang kebetulan ditulis berdampingan. Kedua komponennya (garis tipis) menyusun satu panah, dan panjang panah itu, √(2² + 2²) ≈ 2,83, adalah kecuraman tanjakannya: naik sekitar 2,83 untuk setiap satu satuan langkah ke arah itu.",
      "Balik arahnya, maka kamu menuruni lembah secepat mungkin. Itulah <b>gradient descent</b>: setiap langkah bergerak sejauh η × gradien ke arah sebaliknya. Dengan η = 0,3, titiknya meluncur ke dasar (0, 0) dalam beberapa langkah.",
      "Giliranmu: <b>seret titik P</b> ke mana saja di peta. Panah gradien selalu tegak lurus elips yang dilewatinya, dan jalur turunnya selalu menuju dasar.<span class=\"st-hasil\"></span>"
    ];
    var Cc = cerita(host, kartu, function (svg, t) {
      tKini = t; svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = ""; var a = alat(svg);
      var arah8 = seg(t, 0.2, 1), sembunyi = seg(t, 2.15, 2.5), grad = seg(t, 2.6, 3), komp = seg(t, 3.6, 4), turun = seg(t, 4.6, 5), main = t > 5.5;
      [0.5, 1, 2, 3, 4.5, 6].forEach(function (c) { el("ellipse", { cx: X(0), cy: Y(0), rx: S * Math.sqrt(2 * c), ry: S * Math.sqrt(c), style: "fill:none;stroke:" + GR + ";stroke-width:" + (Math.abs(c - f(P[0], P[1])) < 1e-9 ? 2 : 1.2) }, svg); });
      a.teks(X(0), Y(0) + 5, "dasar", MU, 12, 1, "middle", false);
      var px = X(P[0]), py = Y(P[1]), gx = P[0], gy = 2 * P[1], gl = Math.hypot(gx, gy);
      if (arah8 > 0 && sembunyi < 1) for (var k = 0; k < 8; k++) {
        var u = [Math.cos(k * Math.PI / 4), Math.sin(k * Math.PI / 4)], q = [P[0] + 0.5 * u[0], P[1] + 0.5 * u[1]], d = f(q[0], q[1]) - f(P[0], P[1]), o = arah8 * (1 - 0.75 * sembunyi);
        a.panah(px, py, X(q[0]), Y(q[1]), d > 0 ? WA : C2, 2, o);
        a.teks(X(P[0] + 0.82 * u[0]), Y(P[1] + 0.82 * u[1]) + 5, (d >= 0 ? "+" : "") + fmt(d, 2), d > 0 ? WA : C2, 13, o);
      }
      if (grad > 0 && gl > 1e-9) {
        var tg = [-gy / gl, gx / gl];
        a.garis(X(P[0] - tg[0] * 1.1), Y(P[1] - tg[1] * 1.1), X(P[0] + tg[0] * 1.1), Y(P[1] + tg[1] * 1.1), MU, 1.5, grad, "5 4");
        var sc = 0.32, ex = P[0] + (turun > 0 ? -1 : 1) * gx * sc * (1 - 2 * turun * 0) , ey = P[1] + gy * sc;
        a.panah(px, py, X(P[0] + gx * sc), Y(P[1] + gy * sc), C1, 3.5, grad * (1 - 0.6 * turun));
        a.teks(X(P[0] + gx * sc) + 8, Y(P[1] + gy * sc) - 8, "∇f = (" + fmt(gx, 2) + "; " + fmt(gy, 2) + ")", C1, 14, grad * (1 - 0.6 * turun), "start");
        if (komp > 0) {
          a.garis(px, py, X(P[0] + gx * sc), py, C1, 1.5, komp, "3 3"); a.garis(X(P[0] + gx * sc), py, X(P[0] + gx * sc), Y(P[1] + gy * sc), C1, 1.5, komp, "3 3");
          a.teks((px + X(P[0] + gx * sc)) / 2, py + 18, "∂f/∂x = " + fmt(gx, 2), C1, 12, komp * (1 - turun));
          a.teks(X(P[0] + gx * sc) + 6, (py + Y(P[1] + gy * sc)) / 2, "∂f/∂y = " + fmt(gy, 2), C1, 12, komp * (1 - turun), "start");
        }
        if (turun > 0) {
          var jl = [[px, py]], q2 = P.slice(), n = Math.round(8 * turun);
          for (var i = 0; i < 8; i++) { q2 = [q2[0] - 0.3 * q2[0], q2[1] - 0.3 * 2 * q2[1]]; if (i < n) jl.push([X(q2[0]), Y(q2[1])]); }
          a.panah(px, py, X(P[0] - gx * sc), Y(P[1] - gy * sc), C2, 3.5, turun);
          a.jalur(jl, C2, 2, turun, "4 3"); jl.slice(1).forEach(function (q) { a.titik(q[0], q[1], 3.5, C2, turun); });
          a.teks(X(P[0] - gx * sc) - 8, Y(P[1] - gy * sc) + 20, "−∇f: turun", C2, 14, turun, "end");
        }
      }
      a.titik(px, py, main ? 9 : 7, INK);
      a.teks(px + 12, py - 12, "P", INK, 15, arah8 > 0 && sembunyi < 1 ? 0 : 1, "start");
      a.teks(Wd / 2, Hd - 12, "f(P) = " + fmt(f(P[0], P[1]), 2) + "   |∇f| = " + (grad > 0 ? fmt(gl, 2) : "?"), MU, 14, 1);
      svg.style.cursor = main ? "grab" : ""; svg.style.touchAction = main ? "none" : "";
    });
    var svg = Cc.svg, seret = false;
    svg.addEventListener("pointerdown", function (e) { if (tKini < 5.5) return; var q = lokasi(svg, e); if (Math.hypot(q.x - X(P[0]), q.y - Y(P[1])) < 30) { seret = true; svg.setPointerCapture(e.pointerId); e.preventDefault(); } });
    svg.addEventListener("pointermove", function (e) { if (!seret) return; var q = lokasi(svg, e); P = [Math.max(-3.3, Math.min(3.3, (q.x - OX) / S)), Math.max(-2.5, Math.min(2.5, (OY - q.y) / S))]; P = [Math.round(P[0] * 10) / 10, Math.round(P[1] * 10) / 10]; Cc.ulang(); var h = Cc.kartu.querySelector(".st-hasil"); if (h) h.textContent = "P = (" + fmt(P[0], 1) + "; " + fmt(P[1], 1) + "), ∇f = (" + fmt(P[0], 1) + "; " + fmt(2 * P[1], 1) + "), kecuraman " + fmt(Math.hypot(P[0], 2 * P[1]), 2) + "."; });
    svg.addEventListener("pointerup", function () { seret = false; });
  };

  /* ---------------- 2.5 Matriks sebagai transformasi ---------------- */
  W.matriksStory = function (host) {
    var Wd = 520, Hd = 430, S = 52, OX = 230, OY = 250, A = [[2, -1], [1, 1]];
    function X(x) { return OX + S * x; } function Y(y) { return OY - S * y; }
    var kartu = [
      "Ini lembar karet berkotak, dengan dua panah dasar: <b style=\"color:var(--s1)\">(1, 0)</b> ke kanan dan <b style=\"color:var(--s2)\">(0, 1)</b> ke atas. Matriks yang akan kita pakai: A = [[2, −1], [1, 1]]. Banyak orang mengira matriks hanya tabel angka. Mari lihat apa yang dikerjakannya.",
      "Kolom pertama A adalah (2, 1). Itulah <b>tujuan panah (1, 0)</b>. Panah ungu pindah ke sana, sementara karetnya belum bergerak.",
      "Kolom kedua A adalah (−1, 1). Itulah <b>tujuan panah (0, 1)</b>. Sekarang kedua panah dasar sudah di tempat barunya.",
      "<b>Tebak dulu:</b> titik (2, 1) akan pindah ke mana? Petunjuk: (2, 1) = 2 × (1, 0) + 1 × (0, 1).",
      "Ia pindah ke <b>2 × kolom 1 + 1 × kolom 2</b> = 2 × (2, 1) + (−1, 1) = (3, 3). Jalan dua kali panah ungu baru, lalu sekali panah biru baru. Cukup tahu ke mana dua panah dasar pergi, maka tujuan semua titik bisa dihitung.",
      "Karena itu seluruh lembar karet ikut: setiap garis kotak berpindah dengan aturan yang sama. Garis lurus tetap lurus, garis sejajar tetap sejajar, dan titik asal (0, 0) tidak bergerak.",
      "Persegi satuan (luas 1) sekarang menjadi jajaran genjang. Luasnya <b>det A = 2 × 1 − (−1) × 1 = 3</b>. Determinan adalah faktor pengali luas.",
      "Giliranmu: ubah angka matriks. Kolom pertama selalu tujuan (1, 0), kolom kedua tujuan (0, 1). Coba [[1, 0], [0, −1]] (cermin), atau [[1, 2], [0.5, 1]] (det 0: semuanya gepeng ke satu garis).<span class=\"st-mat\">a <input aria-label=\"baris 1 kolom 1\" value=\"2\"> b <input aria-label=\"baris 1 kolom 2\" value=\"-1\"> c <input aria-label=\"baris 2 kolom 1\" value=\"1\"> d <input aria-label=\"baris 2 kolom 2\" value=\"1\"></span><span class=\"st-hasil\"></span>"
    ];
    var Cc = cerita(host, kartu, function (svg, t) {
      svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = ""; var a = alat(svg);
      var e1 = seg(t, 0.2, 1), e2 = seg(t, 1.2, 2), tanya = seg(t, 2.3, 3) * (1 - seg(t, 3.2, 3.6)), jawab = seg(t, 3.3, 4), karet = seg(t, 4.2, 5), luas = seg(t, 5.2, 6);
      var c1 = [1 + (A[0][0] - 1) * e1, (A[1][0]) * e1], c2 = [A[0][1] * e2, 1 + (A[1][1] - 1) * e2];
      var M = [[1 + (A[0][0] - 1) * karet, A[0][1] * karet], [A[1][0] * karet, 1 + (A[1][1] - 1) * karet]];
      function T(x, y) { return [X(M[0][0] * x + M[0][1] * y), Y(M[1][0] * x + M[1][1] * y)]; }
      for (var i = -6; i <= 6; i++) {
        var p1 = T(i, -6), p2 = T(i, 6), q1 = T(-6, i), q2 = T(6, i);
        a.garis(X(i), Y(-6), X(i), Y(6), GR, 1, karet > 0 ? 0.35 : 1); a.garis(X(-6), Y(i), X(6), Y(i), GR, 1, karet > 0 ? 0.35 : 1);
        if (karet > 0) { a.garis(p1[0], p1[1], p2[0], p2[1], i === 0 ? MU : GR, i === 0 ? 1.6 : 1.2, karet); a.garis(q1[0], q1[1], q2[0], q2[1], i === 0 ? MU : GR, i === 0 ? 1.6 : 1.2, karet); }
      }
      a.garis(X(-6), Y(0), X(6), Y(0), MU, 1.4); a.garis(X(0), Y(-6), X(0), Y(6), MU, 1.4);
      var sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(function (q) { return karet > 0 || luas > 0 ? T(q[0], q[1]) : [X(q[0]), Y(q[1])]; });
      el("polygon", { points: sq.map(function (q) { return q.join(","); }).join(" "), style: "fill:var(--warn);opacity:" + (0.1 + 0.25 * luas) + ";stroke:var(--warn);stroke-width:" + (luas > 0 ? 2 : 0) }, svg);
      if (luas > 0) a.teks((sq[0][0] + sq[2][0]) / 2, (sq[0][1] + sq[2][1]) / 2 + 5, "luas " + fmt(A[0][0] * A[1][1] - A[0][1] * A[1][0], 2), WA, 15, luas);
      a.panah(X(0), Y(0), X(c1[0]), Y(c1[1]), C1, 3.5); a.panah(X(0), Y(0), X(c2[0]), Y(c2[1]), C2, 3.5);
      a.teks(X(c1[0]) + 10, Y(c1[1]) + 18, "(" + fmt(c1[0], 2) + "; " + fmt(c1[1], 2) + ")", C1, 13, 1, "start");
      a.teks(X(c2[0]) - 10, Y(c2[1]) - 8, "(" + fmt(c2[0], 2) + "; " + fmt(c2[1], 2) + ")", C2, 13, 1, "end");
      var tuj = [2 * A[0][0] + A[0][1], 2 * A[1][0] + A[1][1]];
      if (tanya > 0) { a.titik(X(2), Y(1), 6, INK, tanya); a.teks(X(2) + 10, Y(1) - 10, "(2, 1) → ?", INK, 15, tanya, "start"); }
      if (jawab > 0) {
        var o = jawab * (1 - 0.7 * luas);
        a.panah(X(0), Y(0), X(2 * A[0][0]), Y(2 * A[1][0]), C1, 2, o * 0.8);
        a.panah(X(2 * A[0][0]), Y(2 * A[1][0]), X(tuj[0]), Y(tuj[1]), C2, 2, o * 0.8);
        a.titik(X(tuj[0]), Y(tuj[1]), 7, WA, o);
        a.teks(X(tuj[0]) - 10, Y(tuj[1]) - 12, "A(2, 1) = (" + fmt(tuj[0], 2) + "; " + fmt(tuj[1], 2) + ")", WA, 14, o, "end");
      }
      a.teks(Wd - 12, 24, "A = [[" + fmt(A[0][0], 2) + "; " + fmt(A[0][1], 2) + "], [" + fmt(A[1][0], 2) + "; " + fmt(A[1][1], 2) + "]]", MU, 13, 1, "end");
    });
    var ins = Cc.kartu.querySelectorAll(".st-mat input"), hs = Cc.kartu.querySelector(".st-hasil");
    [].forEach.call(ins, function (inp) { inp.addEventListener("input", function () { var v = [].map.call(ins, function (q) { return parseFloat(q.value.replace(",", ".")); }); if (v.some(function (x) { return !isFinite(x) || Math.abs(x) > 4; })) { hs.textContent = "Isi angka antara −4 dan 4."; return; } A = [[v[0], v[1]], [v[2], v[3]]]; var d = v[0] * v[3] - v[1] * v[2]; hs.textContent = "det = " + fmt(d, 3) + (Math.abs(d) < 1e-9 ? ": semua titik jatuh ke satu garis, luas hilang." : d < 0 ? ": negatif berarti lembarnya terbalik seperti di cermin." : "."); Cc.ulang(); }); });
  };

  /* ---------------- 3.1 Gradient descent ---------------- */
  W.gdStory = function (host) {
    var Wd = 520, Hd = 430;
    var kartu = [
      "Sebuah bola di lembah loss f(x) = x², mulai di x = 3. Tujuannya dasar lembah, x = 0. Bola tidak bisa melihat dasarnya; ia hanya merasakan kemiringan di tempatnya berdiri, f'(x) = 2x.",
      "Satu langkah gradient descent: x baru = x − η·f'(x). Dengan η = 0,1: f'(3) = 6, jadi bola bergeser −0,1 × 6 = <b>−0,6</b> dan mendarat di 2,4. Langkahnya selalu berlawanan dengan kemiringan.",
      "<b>Tebak dulu:</b> kalau η dibuat jauh lebih besar, apakah bola selalu sampai lebih cepat?",
      "Tidak selalu. Tiga bola diluncurkan bersamaan. η = 0,1 (ungu): turun pelan tapi pasti, x dikali 0,8 setiap langkah. η = 0,45 (biru): x dikali 0,1, hampir langsung sampai. η = 1,05 (kuning): x dikali −1,1, melompati dasar ke seberang dan makin jauh setiap langkah. <b>Learning rate besar bisa meledak.</b>",
      "Sekarang lembahnya dua dimensi dan sempit: f = ½(x² + 10y²), sepuluh kali lebih curam ke arah y. Gradient descent biasa (η = 0,18) berzigzag melintasi lembah karena langkah yang pas untuk arah x terlalu besar untuk arah y.",
      "Momentum (biru) mengingat arah langkah sebelumnya, sehingga zigzagnya saling menghapus dan perjalanan di sepanjang lembah dipercepat. Adam (kuning) membagi langkah dengan besar gradien di setiap arah, sehingga jalurnya hampir lurus tanpa zigzag, meski di sini ia sempat kebablasan melewati dasar. Angka loss setelah 20 langkah ada di bawah gambar: di lembah sederhana ini Adam justru paling lambat. Kelebihannya baru terasa di lembah yang jauh lebih rumit, dengan jutaan bobot yang curamnya sangat berbeda-beda."
    ];
    function jalur(eta) { var x = 3, r = [3]; for (var i = 0; i < 6; i++) { x = x - eta * 2 * x; r.push(x); } return r; }
    var g2 = function (p) { return [p[0], 10 * p[1]]; }, F2 = function (p) { return 0.5 * (p[0] * p[0] + 10 * p[1] * p[1]); };
    function gd() { var p = [-3, 1], r = [p]; for (var i = 0; i < 20; i++) { var g = g2(p); p = [p[0] - 0.18 * g[0], p[1] - 0.18 * g[1]]; r.push(p); } return r; }
    function mom() { var p = [-3, 1], v = [0, 0], r = [p]; for (var i = 0; i < 20; i++) { var g = g2(p); v = [0.7 * v[0] + g[0], 0.7 * v[1] + g[1]]; p = [p[0] - 0.04 * v[0], p[1] - 0.04 * v[1]]; r.push(p); } return r; }
    function adam() { var p = [-3, 1], m = [0, 0], s = [0, 0], r = [p]; for (var i = 1; i <= 20; i++) { var g = g2(p); m = [0.9 * m[0] + 0.1 * g[0], 0.9 * m[1] + 0.1 * g[1]]; s = [0.999 * s[0] + 0.001 * g[0] * g[0], 0.999 * s[1] + 0.001 * g[1] * g[1]]; var c1 = 1 - Math.pow(0.9, i), c2 = 1 - Math.pow(0.999, i); p = [p[0] - 0.2 * (m[0] / c1) / (Math.sqrt(s[0] / c2) + 1e-8), p[1] - 0.2 * (m[1] / c1) / (Math.sqrt(s[1] / c2) + 1e-8)]; r.push(p); } return r; }
    var JG = gd(), JM = mom(), JA = adam();
    cerita(host, kartu, function (svg, t) {
      svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = ""; var a = alat(svg);
      var satu = seg(t, 0.2, 1), tiga = seg(t, 2.2, 3), duaD = seg(t, 3.5, 3.75), zig = seg(t, 3.75, 4), lain = seg(t, 4.2, 5);
      var o1 = 1 - seg(t, 3.2, 3.45);
      if (o1 > 0) {
        var S = 56, OX = 260, OY = 380; function X(x) { return OX + S * x; } function Y(y) { return OY - 21 * y; }
        var d = []; for (var x = -4; x <= 4.001; x += 0.05) d.push([X(x), Y(x * x)]); a.jalur(d, MU, 2, o1);
        a.garis(X(-4), OY, X(4), OY, GR, 1, o1);
        [-3, -2, -1, 0, 1, 2, 3].forEach(function (k) { a.teks(X(k), OY + 18, String(k).replace("-", "−"), MU, 12, o1, "middle", false); });
        if (tiga <= 0) {
          var xb = 3 - 0.6 * satu;
          if (satu > 0) { a.panah(X(3), Y(9) - 22, X(2.4), Y(9) - 22, C1, 2.5, o1 * satu); a.teks(X(2.4) - 8, Y(9) - 17, "−η·f'(3) = −0,6", C1, 14, o1 * satu, "end"); }
          a.titik(X(xb), Y(xb * xb), 9, C1, o1);
          a.teks(X(xb) + 14, Y(xb * xb) + 5, "x = " + fmt(xb, 2), C1, 14, o1, "start");
        } else {
          [[0.1, C1, "η = 0,1"], [0.45, C2, "η = 0,45"], [1.05, WA, "η = 1,05"]].forEach(function (b, j) {
            var r = jalur(b[0]), n = Math.min(6, Math.floor(tiga * 6.99)), pts = [];
            for (var i = 0; i <= n; i++) { if (Math.abs(r[i]) > 4.05) break; pts.push([X(r[i]), Y(r[i] * r[i]) - 6 * j]); }
            a.jalur(pts, b[1], 1.6, o1 * 0.8, "3 3"); pts.forEach(function (q, i) { a.titik(q[0], q[1], i === pts.length - 1 ? 7 : 3, b[1], o1); });
            a.teks(X(0), Y(8.6) + 22 * j, b[2] + ": " + r.slice(0, Math.min(n, 2) + 1).map(function (v) { return fmt(v, 2); }).join(" → ") + (n >= 2 ? (b[0] > 1 ? " → …meledak" : " → …") : ""), b[1], 13, o1, "middle");
          });
        }
      }
      if (duaD > 0) {
        var S2 = 70, OX2 = 270, OY2 = 200; function X2(x) { return OX2 + S2 * x; } function Y2(y) { return OY2 - S2 * y; }
        [0.25, 1, 2.5, 4.5, 7].forEach(function (c) { el("ellipse", { cx: OX2, cy: OY2, rx: S2 * Math.sqrt(2 * c), ry: S2 * Math.sqrt(0.2 * c), style: "fill:none;stroke:" + GR + ";stroke-width:1.2;opacity:" + duaD }, svg); });
        a.titik(OX2, OY2, 4, MU, duaD);
        function gambar(J, c, o, n) { var pts = J.slice(0, n + 1).map(function (p) { return [X2(p[0]), Y2(p[1])]; }); a.jalur(pts, c, 2, o); pts.forEach(function (q) { a.titik(q[0], q[1], 3, c, o); }); }
        if (zig > 0) gambar(JG, C1, zig * (1 - 0.5 * lain), Math.round(20 * zig));
        if (lain > 0) { var n2 = Math.round(20 * lain); gambar(JM, C2, lain, n2); gambar(JA, WA, lain, n2); }
        var baris = [["GD biasa", JG, C1, zig], ["momentum", JM, C2, lain], ["Adam", JA, WA, lain]];
        baris.forEach(function (b, j) { if (b[3] > 0) a.teks(20, Hd - 70 + 22 * j, b[0] + ": loss setelah 20 langkah = " + fmt(F2(b[1][20]), 4), b[2], 13, b[3], "start"); });
        a.teks(20, 30, "f = ½(x² + 10y²), mulai di (−3; 1)", MU, 13, duaD, "start", false);
      }
    });
  };

  /* ---------------- 4.4 Jalan acak ---------------- */
  W.jalanStory = function (host) {
    var Wd = 520, Hd = 430, N = 100, T = 400;
    var seed = 12345; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var J = []; for (var k = 0; k < N; k++) { var x = 0, r = [0]; for (var i = 0; i < T; i++) { x += rnd() < 0.5 ? -1 : 1; r.push(x); } J.push(r); }
    function sd(t) { var m = 0; J.forEach(function (r) { m += r[t] / N; }); var v = 0; J.forEach(function (r) { v += (r[t] - m) * (r[t] - m) / N; }); return Math.sqrt(v); }
    var s100 = sd(100), s400 = sd(400);
    var kartu = [
      "Seorang pemabuk melangkah satu langkah ke kiri atau ke kanan dengan peluang sama, 400 kali. Sumbu mendatar adalah waktu, sumbu tegak adalah posisinya. Jalannya berliku tanpa arah.",
      "Sekarang seratus pemabuk sekaligus, masing-masing dengan lemparan koinnya sendiri. Rata-rata posisi mereka tetap di sekitar nol, karena tidak ada yang condong ke kiri atau ke kanan. Tetapi kerumunannya melebar.",
      "<b>Tebak dulu:</b> pada waktu t = 100 kerumunan selebar kira-kira 10 langkah (simpangan baku). Pada waktu t = 400, empat kali lebih lama, selebar berapa? Dua kali, empat kali, atau kembali menyempit?",
      "Hanya <b>dua kali</b>. Simpangan baku seratus pemabuk ini " + fmt(s100, 1) + " di t = 100 dan " + fmt(s400, 1) + " di t = 400. Langkah acak saling menghapus sebagian, jadi kerumunan tidak melebar sebanding waktu, dan juga tidak kembali ke tengah.",
      "Garis kuning adalah ±√t. Garis itu menempel ke tepi kerumunan sepanjang waktu: sebaran jalan acak tumbuh seperti <b>akar waktu</b>. Ini juga alasan noise di model difusi menumpuk pelan-pelan.",
      "Hitung berapa pemabuk berada di setiap posisi pada t = 400 (histogram di kanan). Bentuknya mendekati kurva Gauss dengan simpangan baku √400 = 20. Kerumunan partikel menjadi kepadatan, dan luas di bawah kurva kepadatan itu selalu 1 (lihat 4.6)."
    ];
    cerita(host, kartu, function (svg, t) {
      svg.setAttribute("viewBox", "0 0 " + Wd + " " + Hd); svg.innerHTML = ""; var a = alat(svg);
      var banyak = seg(t, 0.2, 1), jawab = seg(t, 2.3, 3), akar = seg(t, 3.2, 4), hist = seg(t, 4.2, 5);
      var X0 = 40, X1 = 400, OY = 200, sy = 2.5;
      function X(i) { return X0 + (X1 - X0) * i / T; } function Y(x) { return OY - sy * x; }
      a.garis(X0, OY, X1, OY, MU, 1); a.garis(X0, 40, X0, 360, GR, 1);
      [0, 100, 200, 300, 400].forEach(function (k) { a.teks(X(k), 385, "t = " + k, MU, 11, 1, "middle", false); });
      [-40, -20, 20, 40].forEach(function (k) { a.teks(X0 - 6, Y(k) + 4, String(k).replace("-", "−"), MU, 11, 1, "end", false); });
      J.forEach(function (r, k) {
        if (k > 0 && banyak <= 0) return;
        var pts = []; for (var i = 0; i <= T; i += 4) pts.push([X(i), Y(r[i])]);
        a.jalur(pts, k === 0 ? C1 : C2, k === 0 ? 2 : 1, k === 0 ? 1 : 0.22 * banyak);
      });
      if (jawab > 0) [[100, s100], [400, s400]].forEach(function (q) { a.garis(X(q[0]), Y(q[1]), X(q[0]), Y(-q[1]), INK, 3, jawab); a.teks(X(q[0]) + (q[0] === 400 ? -8 : 8), Y(q[1]) - 8, "± " + fmt(q[1], 1), INK, 14, jawab, q[0] === 400 ? "end" : "start"); });
      if (akar > 0) { var up = [], dn = []; for (var i = 0; i <= T; i += 4) { up.push([X(i), Y(Math.sqrt(i))]); dn.push([X(i), Y(-Math.sqrt(i))]); } a.jalur(up, WA, 2.5, akar); a.jalur(dn, WA, 2.5, akar); a.teks(X(330), Y(Math.sqrt(330)) - 10, "+√t", WA, 14, akar); a.teks(X(330), Y(-Math.sqrt(330)) + 22, "−√t", WA, 14, akar); }
      if (hist > 0) {
        var bw = 8, cnt = {}; J.forEach(function (r) { var b = Math.floor(r[T] / bw); cnt[b] = (cnt[b] || 0) + 1; });
        Object.keys(cnt).forEach(function (b) { var c = cnt[b], y1 = Y((+b + 1) * bw), y2 = Y(+b * bw), w = c / N / bw * 2600; el("rect", { x: 410, y: y1, width: w * hist, height: y2 - y1 - 1, style: "fill:var(--s2);opacity:.55" }, svg); });
        var g = []; for (var x = -60; x <= 60; x += 1) g.push([410 + 2600 * Math.exp(-x * x / 800) / Math.sqrt(800 * Math.PI) * hist, Y(x)]); a.jalur(g, WA, 2, hist);
        a.teks(465, 52, "t = 400", MU, 12, hist, "middle", false);
      }
    });
  };
})();
