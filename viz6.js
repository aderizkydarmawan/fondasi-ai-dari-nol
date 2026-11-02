/* Widget "diperdalam" (W+) lapis 0–1, sesuai rencana-visualisasi.md.
   Pola bersama: tebak dulu (jawaban tertutup sampai pembaca memilih), angka ditulis di tempat kejadian. */
(function () {
  var V = window.VIZ, W = V.W, el = V.el, fmt = V.fmt, Plane = V.Plane, frame = V.frame, button = V.button, heads = V.heads;

  /* Baris tebak: pertanyaan + pilihan. Setelah memilih, pilihan dikunci, jawaban dan penjelasan muncul, cb dipanggil. */
  function tebak(f, q, opsi, benar, jelas, cb) {
    var d = document.createElement("div"); d.className = "tb6";
    d.innerHTML = "<b>Tebak dulu:</b> <span>" + q + "</span> ";
    var r = document.createElement("span"); r.className = "tb6-r"; r.setAttribute("aria-live", "polite");
    opsi.forEach(function (o, i) {
      var b = document.createElement("button"); b.type = "button"; b.innerHTML = o;
      b.addEventListener("click", function () {
        [].forEach.call(d.querySelectorAll("button"), function (x) { x.disabled = true; });
        b.classList.add(i === benar ? "ok" : "no");
        r.innerHTML = (i === benar ? "Tepat. " : "Belum tepat, jawabannya <b>" + opsi[benar] + "</b>. ") + jelas;
        if (cb) cb(i);
      });
      d.appendChild(b);
    });
    d.appendChild(r);
    f.ctl.parentNode.insertBefore(d, f.ctl);
    return d;
  }
  function tx(svg, x, y, s, cls, anchor) { var e = el("text", { x: x, y: y, "class": cls || "lbl", "text-anchor": anchor || "start" }, svg); e.textContent = s; return e; }
  function sama(a, b) { for (var k in b) if (a[k] !== b[k]) return false; return true; }
  function salin(o) { var r = {}; for (var k in o) r[k] = o[k]; return r; }
  V.tebak = tebak; V.tx = tx; V.sama = sama; V.salin = salin;

  /* 0.1 Mengurangi bilangan negatif = balik arah dua kali, lalu jalan */
  W.balikArah = function (h) {
    var f = frame(h, "Tanda − berarti balik badan. Tanda negatif pada b juga berarti balik badan.", [{ id: "a", label: "mulai di a", min: -6, max: 6, step: 1, v: 5, d: 0 }, { id: "b", label: "b", min: -6, max: 6, step: 1, v: -3, d: 0 }]);
    var op = "−", init = salin(f.vals), sudah = false;
    var bt = button(f, "operasi: a − b (ketuk untuk ganti ke +)", function () { op = op === "−" ? "+" : "−"; bt.textContent = "operasi: a " + op + " b (ketuk untuk ganti)"; h._draw(); });
    tebak(f, "5 − (−3) mendarat di mana?", ["2", "8", "−8"], 1, "Balik badan karena tanda −, lalu balik badan lagi karena −3. Dua kali balik berarti menghadap kanan lagi, jadi jalan 3 langkah ke kanan: 5 + 3 = 8.", function () { sudah = true; h._draw(); });
    var p = Plane(f.svg, { x0: -13, x1: 13, y0: -1.5, y1: 3.4, h: 260, sx: 1, sy: 10, lx: 2 });
    h._draw = function () {
      var a = f.vals.a, b = f.vals.b, s = f.svg; p.clear(); heads(s);
      var arah = 1, langkah = [];
      if (op === "−") { arah = -arah; langkah.push("tanda − → balik badan"); }
      if (b < 0) { arah = -arah; langkah.push("b negatif → balik badan lagi"); }
      var n = Math.abs(b), hasil = a + arah * n, tutup = !sudah && op === "−" && sama(f.vals, init);
      var kanan = a + (op === "−" ? -b : b) >= a; p.dot(a, 0, "ink dot", 5); p.text(a + (kanan ? 0.4 : -0.4), -1.25, "mulai " + fmt(a, 0), "lbl", kanan ? "end" : "start");
      p.arrow(a, 2.7, a + 1.6, 2.7, "ink"); p.text(-12.6, 2.6, "awal: menghadap kanan", "lbl");
      var yy = 2.7, arahNow = 1;
      langkah.forEach(function (t) { yy -= 0.7; arahNow = -arahNow; p.arrow(a, yy, a + 1.6 * arahNow, yy, "s2"); p.text(-12.6, yy - 0.1, t, "lbl s2t"); });
      if (!tutup) {
        if (n) p.arrow(a, 0.5, hasil, 0.5, "s1");
        p.dot(hasil, 0, "s1 dot"); if (hasil !== a) p.text(hasil + (kanan ? -0.4 : 0.4), -1.25, "hasil " + fmt(hasil, 0), "lbl s1t", kanan ? "start" : "end");
      }
      f.out.innerHTML = tutup ? "Tebak dulu di atas, lalu angka hasilnya muncul." :
        fmt(a, 0) + " " + op + " (" + fmt(b, 0) + "): " + (langkah.length ? langkah.join(", ") + ". " : "tidak ada balik badan. ") + "Akhirnya menghadap " + (arah > 0 ? "kanan" : "kiri") + " dan berjalan " + n + " langkah, sampai di <b>" + fmt(hasil, 0) + "</b>.";
    }; h._draw();
  };

  /* 0.3 Menjumlah pecahan: potong ulang kedua kue ke penyebut yang sama */
  function fpb(a, b) { return b ? fpb(b, a % b) : a; }
  W.kueSamakan = function (h) {
    var f = frame(h, "Dua pecahan baru boleh dijumlah setelah potongannya sama besar", [{ id: "p", label: "pecahan pertama: pembilang", min: 1, max: 5, step: 1, v: 1, d: 0 }, { id: "q", label: "penyebut", min: 2, max: 6, step: 1, v: 2, d: 0 }, { id: "r", label: "pecahan kedua: pembilang", min: 1, max: 5, step: 1, v: 1, d: 0 }, { id: "s", label: "penyebut", min: 2, max: 6, step: 1, v: 3, d: 0 }]);
    var potong = false, sudah = false, init = salin(f.vals);
    var bt = button(f, "potong ulang ke penyebut yang sama", function () { potong = !potong; bt.textContent = potong ? "kembali ke potongan asli" : "potong ulang ke penyebut yang sama"; h._draw(); });
    tebak(f, "1/2 + 1/3 = ?", ["2/5", "5/6", "2/6"], 1, "Potong kue pertama jadi 6 bagian (1/2 = 3/6) dan kue kedua jadi 6 bagian (1/3 = 2/6). Sekarang potongannya sama besar, jadi 3 + 2 = 5 potong, yaitu 5/6. Jawaban 2/5 lebih kecil dari 1/2 saja, padahal kita menambah.", function () { sudah = true; potong = true; bt.textContent = "kembali ke potongan asli"; h._draw(); });
    h._draw = function () {
      var v = f.vals, s = f.svg, p = Math.min(v.p, v.q), r = Math.min(v.r, v.s), n = v.q * v.s / fpb(v.q, v.s);
      s.setAttribute("viewBox", "0 0 560 250"); s.innerHTML = "";
      function batang(y, pem, pen, kelas, judul) {
        var k = potong ? n / pen : 1, bag = potong ? n : pen, w = 440 / bag;
        for (var i = 0; i < bag; i++) el("rect", { x: 100 + i * w + 1, y: y, width: w - 2, height: 44, rx: 3, "class": i < pem * k ? kelas + " fill" : "cell" }, s);
        tx(s, 90, y + 28, judul, "lbl", "end");
        tx(s, 100, y + 62, potong ? fmt(pem, 0) + "/" + pen + " = " + (pem * k) + "/" + n : fmt(pem, 0) + "/" + pen + " (" + pen + " potong)", "lbl faintt");
      }
      batang(20, p, v.q, "s1", "kue 1");
      batang(110, r, v.s, "s2", "kue 2");
      var tutup = !sudah && sama(v, init), a = p * (n / v.q) + r * (n / v.s), g = fpb(a, n);
      tx(s, 100, 222, tutup ? "jumlahnya: tebak dulu di atas" : potong ? "jumlah: " + (p * n / v.q) + "/" + n + " + " + (r * n / v.s) + "/" + n + " = " + a + "/" + n + (g > 1 ? " = " + a / g + "/" + n / g : "") : "potongannya beda ukuran, belum bisa dijumlah langsung", "lbl");
      f.out.innerHTML = tutup ? "Tebak dulu di atas." : "Penyebut yang sama terkecil untuk " + v.q + " dan " + v.s + " adalah <b>" + n + "</b>. Hasilnya " + fmt(a / n, 4) + ". Menjumlah pembilang dan penyebut begitu saja (" + (p + r) + "/" + (v.q + v.s) + " = " + fmt((p + r) / (v.q + v.s), 4) + ") memberi angka yang salah.";
    }; h._draw();
  };

  /* 0.4 Tangga pangkat: setiap turun satu anak tangga = bagi bilangan pokok */
  W.tanggaPangkat = function (h) {
    var f = frame(h, "Turun satu pangkat berarti membagi sekali dengan bilangan pokok", [{ id: "a", label: "bilangan pokok", min: 2, max: 5, step: 1, v: 2, d: 0 }]);
    var sudah = false;
    tebak(f, "2⁰ = ?", ["0", "1", "2"], 1, "Dari 2¹ = 2, turun satu anak tangga berarti dibagi 2 sekali lagi: 2 ÷ 2 = 1. Pangkat 0 bukan berarti \"tidak ada\", tapi \"belum dikali apa-apa\", dan perkalian yang belum dimulai bernilai 1.", function () { sudah = true; h._draw(); });
    h._draw = function () {
      var a = f.vals.a, s = f.svg; s.setAttribute("viewBox", "0 0 560 326"); s.innerHTML = ""; heads(s);
      var sup = { "3": "³", "2": "²", "1": "¹", "0": "⁰", "-1": "⁻¹", "-2": "⁻²" };
      for (var k = 3; k >= -2; k--) {
        var i = 3 - k, x = 20 + i * 90, y = 14 + i * 52, nil = Math.pow(a, k);
        var tutup = !sudah && a === 2 && k <= 0;
        el("rect", { x: x, y: y, width: 72, height: 44, rx: 6, "class": k === 0 ? "s1 area" : "cell" }, s);
        tx(s, x + 36, y + 19, a + sup[k], "lbl", "middle");
        tx(s, x + 36, y + 38, tutup ? "?" : (k >= 0 ? String(nil) : "1/" + Math.pow(a, -k)), "lbl s1t", "middle");
        if (k > -2) {
          var x1 = x + 72, y1 = y + 22, x2 = x + 112, y2 = y + 50;
          el("line", { x1: x1 + 2, y1: y1, x2: x2 - 4, y2: y2 - 6, "class": "s2 line" }, s);
          el("polygon", { points: x2 + "," + y2 + " " + (x2 - 11) + "," + (y2 - 4) + " " + (x2 - 4) + "," + (y2 - 12), "class": "s2 fill" }, s);
          tx(s, x2 + 4, y1 + 6, "÷" + a, "lbl s2t");
        }
      }
      f.out.innerHTML = !sudah && a === 2 ? "Tebak dulu 2⁰ di atas." : "Setiap anak tangga ke kanan dibagi " + a + ". Karena itu " + a + "⁰ = " + a + " ÷ " + a + " = <b>1</b>, dan " + a + "⁻¹ = 1/" + a + " = " + fmt(1 / a, 4) + ". Pangkat negatif berarti terus membagi.";
    }; h._draw();
  };

  /* 0.5 Kesalahan penjudi: setelah 5 angka berturut-turut, lemparan berikutnya tetap 50% */
  W.lemparLagi = function (h) {
    var f = frame(h, "Cari semua kejadian 5 angka berturut-turut dalam banyak lemparan, lalu lihat lemparan sesudahnya", []);
    var hasil = null;
    tebak(f, "Setelah 5 kali angka berturut-turut, peluang lemparan ke-6 menjadi gambar…", ["lebih dari 50%", "tetap 50%", "kurang dari 50%"], 1, "Koin tidak punya ingatan. Simulasinya di bawah mengumpulkan ribuan kejadian 5 angka beruntun dan menghitung lemparan sesudahnya.", function () { jalan(); });
    function jalan() {
      var N = 200000, beruntun = 0, n = 0, g = 0, prev = [];
      for (var i = 0; i < N; i++) {
        var c = Math.random() < 0.5 ? 1 : 0; /* 1 = angka */
        if (beruntun >= 5) { n++; if (c === 0) g++; }
        beruntun = c ? beruntun + 1 : 0;
      }
      hasil = { n: n, g: g, N: N }; h._draw();
    }
    button(f, "lempar 200.000 kali lagi", function () { jalan(); });
    h._draw = function () {
      var s = f.svg; s.setAttribute("viewBox", "0 0 560 170"); s.innerHTML = "";
      tx(s, 20, 30, "Setelah ≥ 5 angka beruntun, lemparan berikutnya:", "lbl");
      if (!hasil) { tx(s, 20, 80, "Tebak dulu, lalu simulasinya berjalan.", "lbl faintt"); f.out.innerHTML = ""; return; }
      var pg = hasil.g / hasil.n;
      el("rect", { x: 120, y: 50, width: 400 * pg, height: 34, "class": "s1 fill" }, s);
      el("rect", { x: 120 + 400 * pg, y: 50, width: 400 * (1 - pg), height: 34, "class": "s2 fill" }, s);
      tx(s, 110, 72, "gambar", "lbl", "end"); tx(s, 116 + 400 * pg + 400 * (1 - pg), 110, "angka", "lbl s2t", "end");
      el("line", { x1: 320, x2: 320, y1: 44, y2: 92, "class": "guide" }, s); tx(s, 320, 110, "50%", "lbl", "middle");
      tx(s, 120 + 200 * pg, 140, fmt(pg * 100, 1) + "% gambar", "lbl s1t", "middle");
      f.out.innerHTML = "Dari " + hasil.N.toLocaleString("id") + " lemparan ada <b>" + hasil.n.toLocaleString("id") + "</b> kejadian sesudah 5 angka beruntun. Yang menjadi gambar: <b>" + fmt(pg * 100, 1) + "%</b>. Tekan lagi: angkanya bergoyang sedikit di sekitar 50%, tidak pernah condong ke gambar.";
    }; h._draw();
  };

  /* 0.6 Pythagoras sebagai luas */
  W.pythLuas = function (h) {
    var f = frame(h, "Persegi di sisi miring sama luasnya dengan dua persegi lain digabung", [{ id: "a", label: "a", min: 1, max: 5, step: 1, v: 3, d: 0 }, { id: "b", label: "b", min: 1, max: 5, step: 1, v: 4, d: 0 }]);
    h._draw = function () {
      var a = f.vals.a, b = f.vals.b, c = Math.hypot(a, b), s = f.svg, u = 22;
      s.setAttribute("viewBox", "0 0 560 360"); s.innerHTML = "";
      var ox = 230, oy = 210; /* sudut siku di (ox, oy); a ke kanan, b ke atas */
      var A = [ox, oy], B = [ox + a * u, oy], C = [ox, oy - b * u];
      function poly(pts, cls) { el("polygon", { points: pts.map(function (q) { return q.join(","); }).join(" "), "class": cls }, s); }
      poly([A, B, [B[0], B[1] + a * u], [A[0], A[1] + a * u]], "s1 area");
      poly([A, C, [C[0] - b * u, C[1]], [A[0] - b * u, A[1]]], "s2 area");
      var dx = B[0] - C[0], dy = B[1] - C[1];
      poly([C, B, [B[0] + dy, B[1] - dx], [C[0] + dy, C[1] - dx]], "ink area");
      poly([A, B, C], "cell");
      tx(s, A[0] + a * u / 2, A[1] + a * u / 2 + 5, "a² = " + a * a, "lbl s1t", "middle");
      tx(s, A[0] - b * u / 2, A[1] - b * u / 2 + 5, "b² = " + b * b, "lbl s2t", "middle");
      tx(s, (C[0] + B[0]) / 2 + dy / 2, (C[1] + B[1]) / 2 - dx / 2 + 5, "c² = " + (a * a + b * b), "lbl", "middle");
      f.out.innerHTML = a + "² + " + b + "² = " + a * a + " + " + b * b + " = <b>" + (a * a + b * b) + "</b> = c², jadi c = √" + (a * a + b * b) + " = " + fmt(c, 3) + ". Rumus jarak di peta adalah luas yang sama ini.";
    }; h._draw();
  };

  /* 1.2 Timbangan: langkah sah hanya kalau dilakukan di kedua sisi */
  W.timbangan = function (h) {
    var f = frame(h, "3x + 4 = 19. Pilih langkah; timbangan miring kalau langkahnya hanya di satu sisi", []);
    var X = 5, st, log;
    function reset() { st = { a: 3, b: 4, c: 3 * X + 4 - 0, ka: 3, kb: 4, kc: 19 }; st = { L: { a: 3, b: 4 }, R: { a: 0, b: 19 } }; log = []; }
    reset();
    function lakukan(nama, fn) { button(f, nama, function () { fn(); log.push(nama); h._draw(); }); }
    lakukan("−4 di kedua sisi", function () { st.L.b -= 4; st.R.b -= 4; });
    lakukan("−4 di kiri saja", function () { st.L.b -= 4; });
    lakukan("÷3 di kedua sisi", function () { st.L.a /= 3; st.L.b /= 3; st.R.a /= 3; st.R.b /= 3; });
    button(f, "ulang", function () { reset(); h._draw(); });
    function tulis(e) { var s = ""; if (e.a) s += (Math.abs(e.a - 1) < 1e-9 ? "" : fmt(e.a, 2)) + "x"; if (Math.abs(e.b) > 1e-9 || !e.a) s += (s ? (e.b < 0 ? " − " : " + ") + fmt(Math.abs(e.b), 2) : fmt(e.b, 2)); return s; }
    h._draw = function () {
      var s = f.svg; s.setAttribute("viewBox", "0 0 560 190"); s.innerHTML = "";
      var kiri = st.L.a * X + st.L.b, kanan = st.R.a * X + st.R.b, beda = kiri - kanan, ang = Math.max(-14, Math.min(14, -beda * 2.5));
      el("polygon", { points: "280,140 262,172 298,172", "class": "ink fill" }, s);
      var g = el("g", { transform: "rotate(" + ang + " 280 140)" }, s);
      el("line", { x1: 90, x2: 470, y1: 140, y2: 140, "class": "ink line" }, g);
      el("rect", { x: 100, y: 90, width: 150, height: 46, rx: 8, "class": "s1 area" }, g);
      el("rect", { x: 310, y: 90, width: 150, height: 46, rx: 8, "class": "s2 area" }, g);
      tx(g, 175, 119, tulis(st.L), "lbl", "middle"); tx(g, 385, 119, tulis(st.R), "lbl", "middle");
      tx(s, 280, 34, Math.abs(beda) < 1e-9 ? "seimbang: kedua sisi tetap sama (dengan x = 5, " + fmt(kiri, 2) + " = " + fmt(kanan, 2) + ")" : "MIRING: sisi kiri " + fmt(kiri, 2) + ", sisi kanan " + fmt(kanan, 2), Math.abs(beda) < 1e-9 ? "lbl s2t" : "lbl", "middle");
      var selesai = Math.abs(beda) < 1e-9 && Math.abs(st.L.a - 1) < 1e-9 && Math.abs(st.L.b) < 1e-9 && !st.R.a;
      f.out.innerHTML = (log.length ? "Langkah: " + log.join(" → ") + ". " : "Pilih langkah di bawah gambar. ") + (selesai ? "<b>x = " + fmt(st.R.b, 2) + "</b>. \"Memindahkan suku dan ganti tanda\" sebenarnya adalah langkah \"kurangi di kedua sisi\" ini." : Math.abs(beda) > 1e-9 ? "Langkah yang hanya dilakukan di satu sisi merusak persamaan. Tekan ulang." : "");
    }; h._draw();
  };

  /* 1.3 Mesin fungsi: grafik terbentuk titik demi titik */
  W.mesinFungsi = function (h) {
    var f = frame(h, "Setiap x masuk mesin dan keluar tepat satu nilai. Grafik = kumpulan pasangan (x, f(x))", []);
    var F = [{ n: "f(x) = x²", f: function (x) { return x * x; } }, { n: "f(x) = 2x + 1", f: function (x) { return 2 * x + 1; } }, { n: "g(f(x)) = (2x + 1)²", f: function (x) { return (2 * x + 1) * (2 * x + 1); }, k: 1 }];
    var fi = 0, pts = [], xs = [-3, -2, -1, -0.5, 0, 0.5, 1, 1.5, 2, 3, -2.5, 2.5, -1.5];
    var bt = button(f, "masukkan x berikutnya", function () { if (pts.length < xs.length) pts.push(xs[pts.length]); h._draw(); });
    button(f, "isi semua", function () { pts = xs.slice(); h._draw(); });
    var gb = button(f, "ganti mesin", function () { fi = (fi + 1) % F.length; pts = []; gb.textContent = "ganti mesin (sekarang " + F[fi].n + ")"; h._draw(); });
    gb.textContent = "ganti mesin (sekarang " + F[0].n + ")";
    var p = Plane(f.svg, { x0: -3.5, x1: 3.5, y0: -6, y1: 12, h: 330, sx: 1, sy: 2, ly: 4 });
    h._draw = function () {
      var fn = F[fi]; p.clear(); heads(f.svg);
      if (pts.length === xs.length) p.curve(fn.f, "s1 line faint");
      pts.forEach(function (x, i) { var y = fn.f(x); if (y <= 12) { if (i === pts.length - 1) { p.seg(x, 0, x, y, "guide"); } p.dot(x, y, i === pts.length - 1 ? "s2 dot" : "s1 dot", i === pts.length - 1 ? 7 : 5); } });
      var x = pts[pts.length - 1];
      f.out.innerHTML = pts.length ? "Masuk x = <b>" + fmt(x, 2) + "</b> → mesin " + fn.n + (fn.k ? " (mesin f(x) = 2x + 1 dulu: " + fmt(2 * x + 1, 2) + ", lalu mesin g(u) = u²)" : "") + " → keluar <b>" + fmt(fn.f(x), 2) + "</b>. Titik (" + fmt(x, 2) + "; " + fmt(fn.f(x), 2) + ") ditaruh di grafik. " + (pts.length === xs.length ? "Semua titik terisi, dan garis tipisnya adalah grafik penuh." : "") : "Tekan \"masukkan x berikutnya\".";
    }; h._draw();
  };

  /* 1.4 Garis: bayangan garis lama + segitiga "maju 1, naik m" */
  W.garisBayang = function (h) {
    var f = frame(h, "Ubah satu kenop, lalu bandingkan dengan bayangan garis sebelumnya", [{ id: "m", label: "kemiringan m", min: -3, max: 3, step: 0.5, v: 2 }, { id: "b", label: "titik potong b", min: -4, max: 4, step: 1, v: 1, d: 0 }]);
    var lama = salin(f.vals), skr = salin(f.vals);
    var p = Plane(f.svg, { x0: -5, x1: 5, y0: -8, y1: 8, h: 330, sx: 1, sy: 1, ly: 2 });
    h._draw = function () {
      var m = f.vals.m, b = f.vals.b;
      if (m !== skr.m || b !== skr.b) { lama = salin(skr); skr = salin(f.vals); }
      p.clear(); heads(f.svg);
      p.curve(function (x) { return lama.m * x + lama.b; }, "faint line");
      p.curve(function (x) { return m * x + b; }, "s1 line");
      p.seg(1, m + b, 2, m + b, "s2 line"); p.seg(2, m + b, 2, 2 * m + b, "s2 line");
      p.text(1.5, m + b - (m >= 0 ? 1.2 : -0.5), "maju 1", "lbl s2t", "middle"); p.text(2.2, 1.5 * m + b, "naik " + fmt(m, 1), "lbl s2t");
      p.dot(0, b, "s1 dot"); p.text(-0.6, b - (m >= 0 ? -0.5 : 1.1), "b = " + b, "lbl s1t", "end");
      var ubah = lama.m !== m ? "m berubah dari " + fmt(lama.m, 1) + " ke " + fmt(m, 1) + ": garis berputar di titik potongnya (0, " + b + "), yang tidak bergeser." : lama.b !== b ? "b berubah dari " + lama.b + " ke " + b + ": garis bergeser naik-turun, kemiringannya sama persis (sejajar bayangannya)." : "Geser satu kenop. Garis putus-putus tipis adalah posisi sebelumnya.";
      f.out.innerHTML = "y = " + (m === 1 ? "" : m === -1 ? "−" : fmt(m, 1)) + "x " + (b < 0 ? "− " + (-b) : "+ " + b) + ". " + ubah;
    }; h._draw();
  };

  /* 1.5 Penggaris log: setiap ×2 menambah panjang yang sama */
  W.penggarisLog = function (h) {
    var f = frame(h, "Atas: penggaris biasa. Bawah: penggaris log. Kalikan a dengan b dan lihat panjangnya", [{ id: "a", label: "a", min: 1, max: 32, step: 1, v: 4, d: 0 }, { id: "b", label: "b", min: 1, max: 32, step: 1, v: 8, d: 0 }]);
    var sudah = false;
    tebak(f, "Di penggaris log, jarak 1 → 2 sama dengan jarak…", ["2 → 3", "512 → 1024", "2 → 4 dibagi dua"], 1, "Setiap kali dikali 2, panjangnya bertambah sama. Penggaris log mengubah \"dikali\" menjadi \"ditambah panjang\", dan itulah log(a·b) = log a + log b.", function () { sudah = true; h._draw(); });
    h._draw = function () {
      var a = f.vals.a, b = f.vals.b, s = f.svg, X0 = 30, Lw = 500; s.setAttribute("viewBox", "0 0 560 230"); s.innerHTML = ""; heads(s);
      var M = 1024, Lx = function (v) { return X0 + Math.log2(v) / 10 * Lw; }, Nx = function (v) { return X0 + v / M * Lw; };
      el("line", { x1: X0, x2: X0 + Lw, y1: 50, y2: 50, "class": "ink line" }, s); el("line", { x1: X0, x2: X0 + Lw, y1: 150, y2: 150, "class": "ink line" }, s);
      tx(s, X0, 26, "biasa: 1, 2, 4, … 1024 menumpuk di kiri", "lbl faintt");
      tx(s, X0, 126, "log: setiap ×2 berjarak sama", "lbl faintt");
      for (var k = 0; k <= 10; k++) { var v = Math.pow(2, k); el("line", { x1: Nx(v), x2: Nx(v), y1: 44, y2: 56, "class": "guide" }, s); el("line", { x1: Lx(v), x2: Lx(v), y1: 144, y2: 156, "class": "ink line" }, s); if (k % 2 === 0 || k === 10) tx(s, Lx(v), 174, String(v), "lbl", "middle"); }
      if (sudah || a !== 4 || b !== 8) {
        var ab = a * b, y = 196;
        if (ab <= M) {
          var l1 = el("line", { x1: Lx(1), x2: Lx(a), y1: y, y2: y, "class": "s1 line thick" }, s);
          el("line", { x1: Lx(a), x2: Lx(ab), y1: y, y2: y, "class": "s2 line thick" }, s);
          tx(s, (Lx(1) + Lx(a)) / 2, y + 22, "log " + a, "lbl s1t", "middle"); tx(s, (Lx(a) + Lx(ab)) / 2, y + 22, "log " + b, "lbl s2t", "middle");
          el("circle", { cx: Lx(ab), cy: 150, r: 6, "class": "s2 dot" }, s);
        }
        f.out.innerHTML = "Panjang log " + a + " (" + fmt(Math.log2(a), 3) + ") ditambah panjang log " + b + " (" + fmt(Math.log2(b), 3) + ") = " + fmt(Math.log2(a) + Math.log2(b), 3) + ", tepat di tanda <b>" + ab + "</b> = " + a + " × " + b + ". Inilah alasan loss memakai log: peluang yang dikalikan berubah menjadi angka yang dijumlah. (Panjang diukur dalam log basis 2.)";
      } else f.out.innerHTML = "Tebak dulu, lalu garis berwarnanya muncul.";
    }; h._draw();
  };

  /* 1.6 Jungkat-jungkit: rata-rata = titik seimbang */
  W.jungkat = function (h) {
    var f = frame(h, "Seret beban di papan. Penumpu yang seimbang selalu ada di rata-rata", []);
    var xs = [1, 2, 3, 8], sudah = false;
    tebak(f, "Untuk beban di 1, 2, 3, 8, papan seimbang kalau penumpunya di…", ["2,5 (nilai tengah)", "3,5", "4,5 (tengah-tengah 1 dan 8)"], 1, "Rata-ratanya (1 + 2 + 3 + 8)/4 = 3,5. Di titik itu jumlah simpangan kiri (−2,5 − 1,5 − 0,5 = −4,5) dan kanan (+4,5) saling menghapus.", function () { sudah = true; h._draw(); });
    var p = Plane(f.svg, { x0: 0, x1: 10, y0: -1.6, y1: 2.4, h: 220, sx: 1, sy: 10 });
    V.draggable(f.svg, p, function () { return xs.map(function (x) { return [x, 0.55]; }); }, function (i, q) { xs[i] = Math.round(Math.max(0, Math.min(10, q[0])) * 2) / 2; sudah = true; h._draw(); });
    h._draw = function () {
      var m = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length, s = f.svg; p.clear();
      p.seg(0, 0.2, 10, 0.2, "ink line thick");
      if (sudah) { el("polygon", { points: p.X(m) + "," + (p.Y(0.2) + 3) + " " + (p.X(m) - 14) + "," + (p.Y(0.2) + 28) + " " + (p.X(m) + 14) + "," + (p.Y(0.2) + 28), "class": "s2 fill" }, s); p.text(m, -1.25, "rata-rata " + fmt(m, 2), "lbl s2t", "middle"); }
      xs.forEach(function (x) { el("rect", { x: p.X(x) - 11, y: p.Y(0.55) - 11, width: 22, height: 22, rx: 4, "class": "s1 fill handle" }, s); if (sudah) { p.seg(m, 1.2 + 0, x, 1.2, "guide"); p.text(x, 1.45, (x - m >= 0 ? "+" : "") + fmt(x - m, 2), "lbl", "middle"); } });
      var sd = xs.reduce(function (a, x) { return a + (x - m); }, 0);
      f.out.innerHTML = sudah ? "Simpangan dari rata-rata: " + xs.map(function (x) { return fmt(x - m, 2); }).join(" ; ") + ". Jumlahnya <b>" + fmt(Math.abs(sd) < 1e-9 ? 0 : sd, 2) + "</b>, selalu nol. Seret satu beban jauh ke kanan: penumpu ikut bergeser, karena rata-rata peka terhadap pencilan." : "Tebak dulu letak penumpunya.";
    }; h._draw();
  };

  /* 1.7 Varians sebagai rata-rata luas persegi */
  W.persegiVar = function (h) {
    var f = frame(h, "Dua data dengan rata-rata 5. Kuadrat simpangan setiap titik digambar sebagai persegi sungguhan", []);
    var D = { A: [4, 5, 5, 6], B: [1, 3, 7, 9] }, pilih = "A";
    var bt = button(f, "tampilkan data B", function () { pilih = pilih === "A" ? "B" : "A"; bt.textContent = "tampilkan data " + (pilih === "A" ? "B" : "A"); h._draw(); });
    h._draw = function () {
      var xs = D[pilih], m = 5, s = f.svg, X = function (v) { return 40 + v * 48; }, u = 13;
      s.setAttribute("viewBox", "0 0 560 290"); s.innerHTML = "";
      /* atas: garis bilangan, setiap titik di barisnya sendiri dengan simpangannya */
      el("line", { x1: X(0), x2: X(10), y1: 150, y2: 150, "class": "ink line" }, s);
      for (var k = 0; k <= 10; k++) tx(s, X(k), 170, String(k), "tick lbl", "middle");
      el("line", { x1: X(m), x2: X(m), y1: 14, y2: 150, "class": "guide" }, s); tx(s, X(m) + 6, 22, "rata-rata 5", "lbl");
      xs.forEach(function (x, i) {
        var y = 42 + i * 28, d = x - m;
        if (d) el("line", { x1: X(m), x2: X(x), y1: y, y2: y, "class": (d > 0 ? "s1" : "s2") + " line" }, s);
        el("circle", { cx: X(x), cy: y, r: 5, "class": "ink dot" }, s);
        tx(s, X(x) + (d >= 0 ? 10 : -10), y + 5, (d > 0 ? "+" : "") + fmt(d, 0), "tick lbl", d >= 0 ? "start" : "end");
      });
      /* bawah: persegi dengan sisi = |simpangan|, lalu persegi rata-rata (= varians) */
      var x0 = 40, tot = 0;
      xs.forEach(function (x) {
        var d = Math.abs(x - m), w = d * u; tot += d * d;
        if (w) el("rect", { x: x0, y: 260 - w, width: w, height: w, "class": (x - m > 0 ? "s1" : "s2") + " area" }, s);
        else el("line", { x1: x0, x2: x0 + 8, y1: 260, y2: 260, "class": "ink line" }, s);
        tx(s, x0 + Math.max(w, 8) / 2, 280, String(d * d), "lbl", "middle");
        x0 += Math.max(w, 8) + 18;
      });
      var v = tot / xs.length, wv = Math.sqrt(v) * u;
      tx(s, x0 + 4, 260 - wv / 2 + 5, "→", "lbl", "start"); x0 += 30;
      el("rect", { x: x0, y: 260 - wv, width: wv, height: wv, "class": "cell", style: "stroke-dasharray:4 3;stroke:var(--warn);stroke-width:2" }, s);
      tx(s, x0 + wv + 8, 260 - wv / 2 + 5, "luas rata-rata = varians " + fmt(v, 2), "lbl", "start");
      f.out.innerHTML = "Data " + pilih + " = " + xs.join(", ") + ". Luas persegi: " + xs.map(function (x) { return (x - m) * (x - m); }).join(" + ") + " = " + tot + ", dibagi " + xs.length + " = varians <b>" + fmt(v, 2) + "</b>, simpangan baku √" + fmt(v, 2) + " = " + fmt(Math.sqrt(v), 3) + " (sisi persegi putus-putus). Rata-rata kedua data sama, sebarannya sangat berbeda.";
    }; h._draw();
  };

  /* 1.8 Hasil kali titik = panjang a × bayangan b di garis a */
  W.dotBayang = function (h) {
    var f = frame(h, "Seret ujung panah b (atau a). Bayangan b jatuh tegak lurus ke garis a", []);
    var a = [4, 1], b = [2, 3], sudah = false;
    tebak(f, "Kalau b diputar sampai tegak lurus a, a·b menjadi…", ["positif kecil", "nol", "negatif"], 1, "Bayangan b di garis a menyusut ke satu titik, panjangnya nol, jadi a·b = 0. Putar lebih jauh: bayangannya jatuh ke arah berlawanan, dan hasilnya negatif.", function () { sudah = true; h._draw(); });
    var p = Plane(f.svg, { x0: -5, x1: 5, y0: -4, y1: 4.5, h: 330, sx: 1, sy: 1 });
    V.draggable(f.svg, p, function () { return [a, b]; }, function (i, q) { var t = [Math.round(q[0] * 2) / 2, Math.round(q[1] * 2) / 2]; if (Math.hypot(t[0], t[1]) < 0.5) return; if (i === 0) a = t; else b = t; h._draw(); });
    h._draw = function () {
      var s = f.svg; p.clear(); heads(s);
      var la = Math.hypot(a[0], a[1]), d = a[0] * b[0] + a[1] * b[1], pr = d / la, u = [a[0] / la, a[1] / la], bay = [u[0] * pr, u[1] * pr];
      var Lm = Math.min(Math.abs(u[0]) > 1e-9 ? 4.9 / Math.abs(u[0]) : 99, Math.abs(u[1]) > 1e-9 ? 3.9 / Math.abs(u[1]) : 99); p.seg(-u[0] * Lm, -u[1] * Lm, u[0] * Lm, u[1] * Lm, "faint line");
      var nr = [u[1] * 0.28, -u[0] * 0.28];
      p.seg(b[0], b[1], bay[0] + nr[0], bay[1] + nr[1], "guide");
      p.seg(nr[0], nr[1], bay[0] + nr[0], bay[1] + nr[1], (pr >= 0 ? "s2" : "s2 dash") + " line thick");
      p.arrow(0, 0, a[0], a[1], "s1"); p.arrow(0, 0, b[0], b[1], "ink");
      el("circle", { cx: p.X(a[0]), cy: p.Y(a[1]), r: 9, "class": "s1 dot handle" }, s); el("circle", { cx: p.X(b[0]), cy: p.Y(b[1]), r: 9, "class": "ink dot handle" }, s);
      p.text(a[0] + 0.2, a[1] + 0.3, "a", "lbl s1t"); p.text(b[0] + 0.2, b[1] + 0.3, "b", "lbl");
      f.out.innerHTML = "a·b = " + fmt(a[0], 1) + "×" + fmt(b[0], 1) + " + " + fmt(a[1], 1) + "×" + fmt(b[1], 1) + " = <b>" + fmt(d, 2) + "</b>. Panjang a = " + fmt(la, 3) + ", bayangan b di garis a = " + fmt(pr, 3) + " (garis biru sejajar a, putus-putus kalau arahnya berlawanan). " + fmt(la, 3) + " × " + fmt(pr, 3) + " = " + fmt(la * pr, 2) + ", sama. " + (Math.abs(d) < 1e-9 ? "Tegak lurus: nol." : d > 0 ? "Positif: searah." : "Negatif: berlawanan arah.");
    }; h._draw();
  };
})();
