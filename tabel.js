/* Tabel angka hidup: angka bisa diubah, semua hitungan ikut berubah, dan satu baris bisa disembunyikan
   sampai pembaca menebak dulu. Dipakai untuk konsep yang intinya hitungan berantai (rantai, backprop, Bayes,
   entropi, attention, difusi), karena di sana animasi gerak justru bisa menyesatkan. */
(function () {
  var V = window.VIZ, W = V.W;
  function fmtA(x, d) {
    if (typeof x !== "number") return x;
    if (!isFinite(x)) return "—";
    var p = Math.pow(10, d == null ? 4 : d), r = Math.round(x * p) / p;
    if (r === 0) r = 0;
    return r.toString().replace("-", "−").replace(".", ",");
  }
  function angka(s) { return parseFloat(String(s).replace(/\s/g, "").replace("−", "-").replace(",", ".")); }

  /* spec: { judul, isian: [{id,label,v,step,pilihan}], hitung(v) → {kolom, baris, tebak, catatan} }
     baris: [{sel: [..], kelas, rahasia}] ; sel boleh angka, teks, atau {v, kelas, d} */
  W.tabelHidup = function (host, spec) {
    host.classList.add("tbh");
    var v = {}, dibuka = false, tebakan = null;
    spec.isian.forEach(function (s) { v[s.id] = s.v; });
    var h = document.createElement("div"); h.className = "tbh-h"; h.innerHTML = spec.judul; host.appendChild(h);
    var kendali = document.createElement("div"); kendali.className = "tbh-k"; host.appendChild(kendali);
    spec.isian.forEach(function (s) {
      var lab = document.createElement("label"); lab.innerHTML = "<span>" + s.label + "</span>";
      var inp;
      if (s.pilihan) {
        inp = document.createElement("select");
        s.pilihan.forEach(function (p) { var o = document.createElement("option"); o.value = p; o.textContent = fmtA(p); if (p === s.v) o.selected = true; inp.appendChild(o); });
        inp.addEventListener("change", function () { v[s.id] = angka(inp.value); gambar(); });
      } else {
        inp = document.createElement("input"); inp.type = "text"; inp.inputMode = "decimal"; inp.value = fmtA(s.v);
        inp.addEventListener("input", function () { var n = angka(inp.value); if (isFinite(n)) { v[s.id] = n; gambar(); } });
      }
      lab.appendChild(inp); kendali.appendChild(lab);
    });
    var gb = null;
    if (spec.gambar) { gb = document.createElement("div"); gb.className = "viz tbh-g"; gb.innerHTML = "<svg role=\"img\"></svg>"; host.appendChild(gb); gb = gb.firstChild; if (spec.alt) gb.setAttribute("aria-label", spec.alt); }
    var bungkus = document.createElement("div"); bungkus.className = "tbh-w"; host.appendChild(bungkus);
    var tbl = document.createElement("table"); bungkus.appendChild(tbl);
    var tb = document.createElement("div"); tb.className = "tbh-t"; host.appendChild(tb);
    var cat = document.createElement("p"); cat.className = "tbh-c"; cat.setAttribute("aria-live", "polite"); host.appendChild(cat);
    var lama = {};
    function sel(x) { return x && typeof x === "object" ? x : { v: x }; }
    function gambar() {
      var r = spec.hitung(v), html = "";
      if (r.kolom) html += "<thead><tr>" + r.kolom.map(function (k) { return "<th scope=\"col\"" + ((spec.hpSembunyi || []).indexOf(arguments[1]) >= 0 ? " class=\"hp-x\"" : "") + ">" + k + "</th>"; }).join("") + "</tr></thead>";
      html += "<tbody>" + r.baris.map(function (b, i) {
        return "<tr class=\"" + (b.kelas || "") + "\">" + b.sel.map(function (c, j) {
          c = sel(c);
          var isi = b.rahasia && !dibuka && j > 0 && c.v !== "" ? "?" : fmtA(c.v, c.d), kunci = i + ":" + j, baru = lama[kunci] !== undefined && lama[kunci] !== isi;
          lama[kunci] = isi;
          return (j === 0 ? "<th scope=\"row\"" : "<td") + " class=\"" + (c.kelas || "") + (typeof c.v === "number" ? " n" : "") + (baru ? " baru" : "") + ((spec.hpSembunyi || []).indexOf(j) >= 0 ? " hp-x" : "") + "\">" + isi + (j === 0 ? "</th>" : "</td>");
        }).join("") + "</tr>";
      }).join("") + "</tbody>";
      tbl.innerHTML = html;
      if (gb) { gb.innerHTML = ""; spec.gambar(gb, v, r, dibuka); }
      cat.innerHTML = r.catatan ? (typeof r.catatan === "function" ? r.catatan(dibuka) : r.catatan) : "";
      if (r.tebak) {
        if (!tb.firstChild) {
          tb.innerHTML = "<label><span class=\"tbh-q\"></span> <input type=\"text\" inputmode=\"decimal\" aria-label=\"tebakanmu\"></label> <button type=\"button\" class=\"tbh-cek\">cek</button> <button type=\"button\" class=\"tbh-buka\">tunjukkan saja</button><span class=\"tbh-hasil\" aria-live=\"polite\"></span>";
          var ti = tb.querySelector("input");
          tb.querySelector(".tbh-cek").addEventListener("click", function () { var n = angka(ti.value); if (!isFinite(n)) { ti.focus(); return; } tebakan = n; dibuka = true; gambar(); });
          ti.addEventListener("keydown", function (e) { if (e.key === "Enter") tb.querySelector(".tbh-cek").click(); });
          tb.querySelector(".tbh-buka").addEventListener("click", function () { dibuka = true; tebakan = null; gambar(); });
        }
        tb.querySelector(".tbh-q").innerHTML = r.tebak.tanya;
        var hs = tb.querySelector(".tbh-hasil"), jw = r.tebak.jawab;
        if (dibuka && tebakan !== null) {
          var dekat = Math.abs(tebakan - jw) <= (r.tebak.toleransi || 0.05) * Math.max(1, Math.abs(jw));
          hs.innerHTML = dekat ? " Tebakanmu " + fmtA(tebakan) + " <b>tepat</b>." : " Tebakanmu " + fmtA(tebakan) + ", jawabannya <b>" + fmtA(jw) + "</b>. " + (r.tebak.petunjuk || "");
        } else hs.textContent = dibuka ? "" : "";
      }
    }
    gambar();
    return { ulang: gambar, v: v };
  };

  /* 2.2 Aturan rantai sebagai tabel geser-sedikit. Pengganti metafora roda gigi: laju bersifat setempat.
     Dicek dengan Python: x = 1, Δx = 0,01 → Δu/Δx = 2, Δy/Δu = 6,02, hasil kali = Δy/Δx = 12,04 (tepat 12);
     x = 2 → Δy/Δu = 10,02, Δy/Δx = 20,04 (tepat 20); x = −0,5 → 0,04 (tepat 0). */
  W.rantaiTabel = function (host) {
    W.tabelHidup(host, {
      judul: "<b>Geser x sedikit, lalu lihat seberapa jauh setiap mata rantai ikut bergeser.</b> u = 2x + 1, lalu y = u².",
      hpSembunyi: [1, 2],
      isian: [{ id: "x", label: "x =", v: 1 }, { id: "dx", label: "geser x sebesar", v: 0.01, pilihan: [0.1, 0.01, 0.001] }],
      hitung: function (v) {
        var x0 = v.x, x1 = x0 + v.dx, u0 = 2 * x0 + 1, u1 = 2 * x1 + 1, y0 = u0 * u0, y1 = u1 * u1, du = u1 - u0, dy = y1 - y0;
        var lu = du / v.dx, ly = dy / du, d = v.dx < 0.005 ? 6 : 4;
        return {
          kolom: ["", "semula", "setelah digeser", "bergeser", "laju (÷ pergeseran sebelumnya)"],
          baris: [
            { sel: ["x", x0, { v: x1, d: d }, { v: v.dx, d: d }, ""] },
            { sel: ["u = 2x + 1", u0, { v: u1, d: d }, { v: du, d: d }, { v: lu, kelas: "s1", d: 3 }] },
            { sel: ["y = u²", { v: y0, d: d }, { v: y1, d: d }, { v: dy, d: d }, { v: ly, kelas: "s2", d: 3 }] },
            { sel: ["laju u × laju y", "", "", "", { v: lu * ly, kelas: "warn", d: 3 }], rahasia: true, kelas: "tbh-jml" },
            { sel: ["Δy / Δx langsung", "", "", "", { v: dy / v.dx, kelas: "warn", d: 3 }], rahasia: true, kelas: "tbh-jml" }
          ],
          tebak: { tanya: "Sebelum dibuka: y bergeser berapa kali pergeseran x?", jawab: dy / v.dx, toleransi: 0.03, petunjuk: "Kalikan dua laju di kolom kanan." },
          catatan: function (buka) {
            if (!buka) return "Lihat kolom kanan: u bergeser " + fmtA(lu, 3) + " kali pergeseran x, dan y bergeser " + fmtA(ly, 3) + " kali pergeseran u.";
            return "Dua baris terakhir sama: laju-laju di sepanjang rantai <b>dikalikan</b>. Sekarang ubah x menjadi 2: laju u tetap 2, tapi laju y menjadi sekitar " + fmtA(2 * (2 * 2 + 1), 0) + ". Laju bersifat <b>setempat</b>, jadi aturan rantai selalu dihitung di satu titik. Makin kecil pergeseran, makin dekat hasilnya ke turunan tepat, yaitu 4u = " + fmtA(4 * u0, 3) + ".";
          }
        };
      }
    });
  };

  var el = V.el;
  function tulis(svg, x, y, t, cls, a) { var e = el("text", { x: x, y: y, "class": cls || "lbl", "text-anchor": a || "middle" }, svg); e.textContent = t; return e; }
  function sig(z) { return 1 / (1 + Math.exp(-z)); }

  /* 5.4 Backprop di jaringan 2–2–1. Maju: z = w·x, h = σ(z), y = v·h. Loss L = ½(y − t)².
     Mundur: setiap gradien bobot = sinyal balik di ujung kanan sambungan × sinyal maju di ujung kirinya.
     Baris terakhir memeriksa hasil backprop dengan menggeser w₁₁ sebesar 0,0001 (cara 2.2). */
  W.backpropTabel = function (host) {
    W.tabelHidup(host, {
      judul: "<b>Jaringan 2–2–1, semua angka tertulis.</b> Ubah input, target, atau bobot w₁₁, lalu ikuti angkanya maju (ungu) dan mundur (biru).",
      alt: "Diagram jaringan dua input, dua neuron tersembunyi, satu output, dengan nilai di setiap simpul",
      isian: [{ id: "x1", label: "x₁ =", v: 1 }, { id: "x2", label: "x₂ =", v: 0.5 }, { id: "w11", label: "w₁₁ =", v: 0.4 }, { id: "t", label: "target t =", v: 1 }],
      hitung: function (v) {
        var w = [[v.w11, -0.3], [0.2, 0.6]], u = [0.7, -0.5];
        function maju(w11) { var z1 = w11 * v.x1 + w[0][1] * v.x2, z2 = w[1][0] * v.x1 + w[1][1] * v.x2, h1 = sig(z1), h2 = sig(z2), y = u[0] * h1 + u[1] * h2; return { z1: z1, z2: z2, h1: h1, h2: h2, y: y, L: 0.5 * (y - v.t) * (y - v.t) }; }
        var m = maju(v.w11), dy = m.y - v.t, du1 = dy * m.h1, dh1 = dy * u[0], dz1 = dh1 * m.h1 * (1 - m.h1), dw11 = dz1 * v.x1;
        var e = 1e-4, num = (maju(v.w11 + e).L - maju(v.w11 - e).L) / (2 * e);
        return {
          kolom: ["langkah", "rumus", "nilai"],
          baris: [
            { sel: ["maju: z₁", "w₁₁·x₁ + w₁₂·x₂ = " + fmtA(v.w11, 3) + "·" + fmtA(v.x1, 3) + " + (−0,3)·" + fmtA(v.x2, 3), { v: m.z1, kelas: "s1" }] },
            { sel: ["maju: h₁", "σ(z₁)", { v: m.h1, kelas: "s1" }] },
            { sel: ["maju: h₂", "σ(0,2·x₁ + 0,6·x₂)", { v: m.h2, kelas: "s1" }] },
            { sel: ["maju: y", "0,7·h₁ + (−0,5)·h₂", { v: m.y, kelas: "s1" }] },
            { sel: ["loss L", "½(y − t)²", { v: m.L, kelas: "s1" }] },
            { sel: ["mundur: ∂L/∂y", "y − t", { v: dy, kelas: "s2" }], kelas: "tbh-jml" },
            { sel: ["mundur: ∂L/∂v₁", "(∂L/∂y) × h₁ (balik × maju)", { v: du1, kelas: "s2" }] },
            { sel: ["mundur: ∂L/∂h₁", "(∂L/∂y) × v₁ = (∂L/∂y) × 0,7", { v: dh1, kelas: "s2" }] },
            { sel: ["mundur: ∂L/∂z₁", "(∂L/∂h₁) × h₁(1 − h₁)", { v: dz1, kelas: "s2" }] },
            { sel: ["mundur: ∂L/∂w₁₁", "(∂L/∂z₁) × x₁ (balik × maju)", { v: dw11, kelas: "warn" }], rahasia: true, kelas: "tbh-jml" },
            { sel: ["cek: geser w₁₁ ± 0,0001", "(L(w₁₁ + 0,0001) − L(w₁₁ − 0,0001)) / 0,0002", { v: num, kelas: "warn" }], rahasia: true }
          ],
          tebak: { tanya: "Kalikan sendiri: ∂L/∂w₁₁ = ∂L/∂z₁ × x₁ = ?", jawab: dw11, toleransi: 0.03, petunjuk: "Ambil angka di baris ∂L/∂z₁, kalikan x₁." },
          catatan: function (buka) {
            return buka ? "Hasil backprop sama dengan hasil menggeser w₁₁ sedikit, sampai digit keempat: backprop memang aturan rantai yang dijalankan mundur. Tanda " + (dw11 > 0 ? "positif berarti menaikkan w₁₁ menaikkan loss, jadi gradient descent akan menurunkan w₁₁." : "negatif berarti menaikkan w₁₁ menurunkan loss, jadi gradient descent akan menaikkan w₁₁.") + " Coba buat target t sama dengan y: semua sinyal balik jadi 0." : "Baris maju dihitung dari atas ke bawah, baris mundur memakai baris di atasnya, persis seperti mata rantai di 2.2.";
          }
        };
      },
      gambar: function (svg, v) {
        svg.setAttribute("viewBox", "0 0 560 210");
        var w11 = v.w11, z1 = w11 * v.x1 - 0.3 * v.x2, h1 = sig(z1), h2 = sig(0.2 * v.x1 + 0.6 * v.x2), y = 0.7 * h1 - 0.5 * h2, dy = y - v.t;
        var N = { x1: [70, 50], x2: [70, 150], h1: [280, 50], h2: [280, 150], y: [470, 100] };
        [["x1", "h1", "w₁₁ = " + fmtA(w11, 2), 1], ["x2", "h1", "−0,3"], ["x1", "h2", "0,2"], ["x2", "h2", "0,6"], ["h1", "y", "0,7", 1], ["h2", "y", "−0,5"]].forEach(function (e) {
          var a = N[e[0]], b = N[e[1]]; el("line", { x1: a[0] + 26, y1: a[1], x2: b[0] - 26, y2: b[1], "class": e[3] ? "s2 line" : "faint line" }, svg);
          var tt = e[3] ? 0.5 : 0.28; tulis(svg, a[0] + 26 + (b[0] - a[0] - 52) * tt, a[1] + (b[1] - a[1]) * tt - 8, e[2], "tick lbl" + (e[3] ? " s2t" : ""));
        });
        [["x1", "x₁", v.x1], ["x2", "x₂", v.x2], ["h1", "h₁", h1], ["h2", "h₂", h2], ["y", "y", y]].forEach(function (n) { var q = N[n[0]]; el("circle", { cx: q[0], cy: q[1], r: 26, "class": "cell" }, svg); tulis(svg, q[0], q[1] - 4, n[1]); tulis(svg, q[0], q[1] + 14, fmtA(n[2], 3), "tick lbl s1t"); });
        tulis(svg, 470, 152, "∂L/∂y = " + fmtA(dy, 3), "tick lbl s2t");
        tulis(svg, 280, 204, "garis biru = jalur sinyal balik menuju w₁₁", "tick lbl faintt");
      }
    });
  };

  /* 2.11 Bayes sebagai luas. Contoh bawaan: prevalensi 1%, sensitivitas 99%, spesifisitas 99% →
     99 sakit & positif, 99 sehat & positif, P(sakit | positif) = 0,5 (dicek dengan Python). */
  W.bayesTabel = function (host) {
    W.tabelHidup(host, {
      judul: "<b>10.000 orang dites.</b> Ubah prevalensi dan akurasi tes; kotak menunjukkan luas setiap kelompok.",
      alt: "Kotak 10.000 orang dibagi menjadi sakit dan sehat, lalu positif dan negatif",
      isian: [{ id: "prev", label: "prevalensi (%)", v: 1 }, { id: "sens", label: "sensitivitas (%)", v: 99 }, { id: "spes", label: "spesifisitas (%)", v: 99 }],
      hitung: function (v) {
        var N = 10000, S = N * v.prev / 100, H = N - S, SP = S * v.sens / 100, SN = S - SP, HN = H * v.spes / 100, HP = H - HN, P = SP + HP, post = P ? SP / P : 0;
        return {
          kolom: ["kelompok", "rumus", "orang"],
          baris: [
            { sel: ["sakit", "10.000 × prevalensi", { v: S, d: 1 }] },
            { sel: ["sakit & positif", "sakit × sensitivitas", { v: SP, d: 1, kelas: "s1" }] },
            { sel: ["sakit & negatif", "sakit − (sakit & positif)", { v: SN, d: 1 }] },
            { sel: ["sehat & positif (alarm palsu)", "sehat × (1 − spesifisitas)", { v: HP, d: 1, kelas: "s2" }] },
            { sel: ["sehat & negatif", "sehat × spesifisitas", { v: HN, d: 1 }] },
            { sel: ["semua yang positif", "ungu + biru", { v: P, d: 1 }], kelas: "tbh-jml" },
            { sel: ["P(sakit | positif)", "ungu ÷ (ungu + biru)", { v: post, d: 3, kelas: "warn" }], rahasia: true, kelas: "tbh-jml" }
          ],
          tebak: { tanya: "Seseorang positif. Berapa peluang ia benar-benar sakit (0 sampai 1)?", jawab: post, toleransi: 0.05, petunjuk: "Lihat hanya baris yang positif: dari semua yang positif, berapa bagian yang ungu?" },
          catatan: function (buka) { return buka ? "Tes \"99% akurat\" tidak berarti positif = 99% sakit. Karena orang sehat jauh lebih banyak, 1% alarm palsu dari mereka sama banyaknya dengan semua orang sakit yang terdeteksi. Naikkan prevalensi ke 10%: peluangnya melonjak." : "Tebak dulu sebelum membaca baris terakhir."; }
        };
      },
      gambar: function (svg, v) {
        svg.setAttribute("viewBox", "0 0 560 200");
        var X0 = 20, Wd = 520, Hh = 132, s = Math.max(0, Math.min(100, v.prev)) / 100, ws = Wd * s;
        var sens = Math.max(0, Math.min(100, v.sens)) / 100, fp = 1 - Math.max(0, Math.min(100, v.spes)) / 100;
        var Y0 = 42; Hh = 128;
        el("rect", { x: X0, y: Y0, width: ws, height: Hh, "class": "cell" }, svg);
        el("rect", { x: X0 + ws, y: Y0, width: Wd - ws, height: Hh, "class": "cell" }, svg);
        el("rect", { x: X0, y: Y0, width: ws, height: Hh * sens, "class": "s1 fill" }, svg);
        el("rect", { x: X0 + ws, y: Y0, width: Wd - ws, height: Math.max(Hh * fp, fp > 0 ? 1.5 : 0), "class": "s2 fill" }, svg);
        tulis(svg, X0 + ws + (Wd - ws) / 2, Y0 + Hh / 2 + 10, "sehat", "lbl", "middle");
        var N = 10000, SP = N * s * sens, HP = N * (1 - s) * fp;
        tulis(svg, X0, 13, "ungu (sakit & positif): " + fmtA(SP, 0) + " orang", "tick lbl s1t", "start");
        tulis(svg, X0 + Wd, 34, "biru, pita tipis di tepi atas (sehat & positif): " + fmtA(HP, 0) + " orang", "tick lbl s2t", "end");
        tulis(svg, X0, 190, "Pita kiri: sakit (" + fmtA(s * 100, 2) + "% lebar). Ungu = sakit & positif, biru = sehat & positif.", "tick lbl faintt", "start");
      }
    });
  };

  /* 3.4 Entropi sebagai jumlah pertanyaan ya/tidak. Panjang kode = kedalaman di pohon Huffman.
     Contoh bawaan p = (1/2, 1/4, 1/8, 1/8): rata-rata 1,75 pertanyaan = entropi 1,75 bit. */
  function huffman(p) {
    var nodes = p.map(function (q, i) { return { p: q, ids: [i] }; }), len = p.map(function () { return 0; });
    while (nodes.length > 1) { nodes.sort(function (a, b) { return a.p - b.p || a.ids[0] - b.ids[0]; }); var a = nodes.shift(), b = nodes.shift(); a.ids.concat(b.ids).forEach(function (i) { len[i]++; }); nodes.push({ p: a.p + b.p, ids: a.ids.concat(b.ids) }); }
    return len;
  }
  W.entropiTabel = function (host) {
    var hewan = ["kucing", "anjing", "burung", "ikan"];
    W.tabelHidup(host, {
      judul: "<b>Tebak hewan dengan pertanyaan ya/tidak.</b> Hewan yang sering muncul diberi pertanyaan lebih sedikit. Ubah peluangnya (akan dinormalkan supaya jumlahnya 1).",
      isian: [{ id: "a", label: "kucing", v: 0.5 }, { id: "b", label: "anjing", v: 0.25 }, { id: "c", label: "burung", v: 0.125 }, { id: "d", label: "ikan", v: 0.125 }, { id: "q", label: "pohon untuk peluang rata? (1 = ya)", v: 0, pilihan: [0, 1] }],
      hitung: function (v) {
        var raw = [v.a, v.b, v.c, v.d].map(function (x) { return Math.max(0, x); }), S = raw.reduce(function (a, b) { return a + b; }, 0) || 1, p = raw.map(function (x) { return x / S; });
        var q = v.q ? [0.25, 0.25, 0.25, 0.25] : p, L = huffman(q.map(function (x) { return x + 1e-12; }));
        var H = p.reduce(function (a, x) { return a + (x > 0 ? -x * Math.log2(x) : 0); }, 0), avg = p.reduce(function (a, x, i) { return a + x * L[i]; }, 0);
        var baris = hewan.map(function (n, i) { return { sel: [n, { v: p[i], d: 3 }, L[i], { v: p[i] * L[i], d: 3 }, { v: p[i] > 0 ? -Math.log2(p[i]) : 0, d: 3 }] }; });
        baris.push({ sel: ["rata-rata pertanyaan", "", "", { v: avg, d: 3, kelas: "warn" }, ""], rahasia: true, kelas: "tbh-jml" });
        baris.push({ sel: ["entropi H = Σ p·log₂(1/p)", "", "", "", { v: H, d: 3, kelas: "s1" }], rahasia: true });
        baris.push({ sel: ["selisih (KL kalau pohonnya salah)", "", "", { v: avg - H, d: 3, kelas: "s2" }, ""], rahasia: true });
        return {
          kolom: ["hewan", "peluang p", "banyak pertanyaan", "p × pertanyaan", "log₂(1/p)"],
          baris: baris,
          tebak: { tanya: "Rata-rata berapa pertanyaan yang dibutuhkan per tebakan?", jawab: avg, toleransi: 0.04, petunjuk: "Jumlahkan kolom p × pertanyaan." },
          catatan: function (buka) { return (v.q ? "Pohon sekarang dibuat untuk peluang rata (¼ semuanya), padahal hewan sebenarnya mengikuti p. Rata-rata pertanyaannya adalah cross-entropy, dan kelebihannya dibanding entropi adalah KL." : "Pilih 1 di \"pohon untuk peluang rata\" untuk memakai pohon yang salah.") + (buka ? " Untuk peluang (½, ¼, ⅛, ⅛) dengan pohon yang benar, rata-ratanya 1,75 pertanyaan, tepat sama dengan entropi." : ""); }
        };
      }
    });
  };

  /* 5.7 Attention: skor q·k, softmax (jumlah 1), lalu campuran vektor v */
  W.attnTabel = function (host) {
    var kata = ["kucing", "itu", "tidur", "karena", "ia"];
    var K = [[2, 1], [0, -1], [-1, 0.5], [-0.5, -0.5], [1, 0.5]], Vv = [[1, 0], [0, 0.2], [0, 1], [-0.3, 0], [0.5, 0.5]], Q = [2, 0.8];
    W.tabelHidup(host, {
      judul: "<b>\"kucing itu tidur karena ia …\"</b> Kata \"ia\" membagi perhatiannya ke semua kata. Vektor kunci k dan nilai v dibuat 2D supaya bisa dihitung tangan; q untuk \"ia\" = (2; 0,8). Ubah kunci \"kucing\".",
      hpSembunyi: [1],
      isian: [{ id: "kx", label: "k kucing, x =", v: 2 }, { id: "ky", label: "k kucing, y =", v: 1 }],
      hitung: function (v) {
        var k = K.map(function (q, i) { return i === 0 ? [v.kx, v.ky] : q; }), d = Math.sqrt(2);
        var sk = k.map(function (q) { return (Q[0] * q[0] + Q[1] * q[1]) / d; }), m = Math.max.apply(null, sk), e = sk.map(function (x) { return Math.exp(x - m); }), Z = e.reduce(function (a, b) { return a + b; }, 0), a = e.map(function (x) { return x / Z; });
        var out = [0, 0]; a.forEach(function (w, i) { out[0] += w * Vv[i][0]; out[1] += w * Vv[i][1]; });
        var baris = kata.map(function (n, i) { return { sel: [n, "(" + fmtA(k[i][0], 2) + "; " + fmtA(k[i][1], 2) + ")", { v: sk[i], d: 3 }, { v: a[i], d: 3, kelas: "s1" }, "(" + fmtA(a[i] * Vv[i][0], 3) + "; " + fmtA(a[i] * Vv[i][1], 3) + ")"], rahasia: true }; });
        baris.push({ sel: ["jumlah", "", "", { v: 1, d: 3, kelas: "warn" }, "(" + fmtA(out[0], 3) + "; " + fmtA(out[1], 3) + ")"], kelas: "tbh-jml", rahasia: true });
        return {
          kolom: ["kata", "kunci k", "skor q·k / √2", "bobot (softmax)", "bobot × v"],
          baris: baris,
          tebak: { tanya: "Kunci \"kucing\" (2; 1) paling searah dengan q (2; 0,8). Kira-kira berapa bobot perhatian \"ia\" ke \"kucing\" (0 sampai 1)?", jawab: a[0], toleransi: 0.12, petunjuk: "Skor kucing jauh di atas yang lain, dan softmax memperbesar selisih itu." },
          catatan: function () { return "Kolom bobot selalu berjumlah 1: \"ia\" tidak melihat seperti manusia, ia hanya membagi satu kue perhatian menurut kemiripan arah q dan k (hasil kali titik dari 1.8). Makna baru \"ia\" = jumlah kolom terakhir, campuran vektor v. Ubah k kucing menjadi (−2; −1): perhatian pindah ke kata lain."; }
        };
      }
    });
  };

  /* 5.12 Difusi dengan angka kecil. Jadwal DDPM: β naik linear dari 0,0001 ke 0,02 dalam 1000 langkah.
     x_t = √ᾱ_t·x₀ + √(1 − ᾱ_t)·ε. Data latih hanya dua titik, −2 dan 2, sehingga penebak terbaik
     bisa dihitung tepat: E[x₀ | x_t] dari dua kemungkinan. */
  var ab = [1]; (function () { for (var t = 1; t <= 1000; t++) { var b = 0.0001 + (0.02 - 0.0001) * (t - 1) / 999; ab.push(ab[t - 1] * (1 - b)); } })();
  W.difusiTabel = function (host) {
    W.tabelHidup(host, {
      judul: "<b>Satu angka x₀ dikaburkan dengan noise ε.</b> Data latihnya hanya dua titik, −2 dan 2. Kolom kanan: tebakan x₀ terbaik kalau yang terlihat hanya x_t.",
      hpSembunyi: [1],
      isian: [{ id: "x0", label: "x₀ =", v: 2, pilihan: [-2, 2] }, { id: "e", label: "noise ε =", v: 0.7 }],
      hitung: function (v) {
        var T = [0, 10, 100, 250, 500, 750, 1000];
        var baris = T.map(function (t) {
          var a = ab[t], sa = Math.sqrt(a), sb = Math.sqrt(1 - a), xt = sa * v.x0 + sb * v.e, xh;
          if (t === 0) xh = v.x0; else { var lp = -(xt - sa * 2) * (xt - sa * 2) / (2 * (1 - a)), lm = -(xt + sa * 2) * (xt + sa * 2) / (2 * (1 - a)), mx = Math.max(lp, lm), wp = Math.exp(lp - mx), wm = Math.exp(lm - mx); xh = (2 * wp - 2 * wm) / (wp + wm); }
          return { sel: ["t = " + t, { v: a, d: 4 }, { v: sa * v.x0, d: 3, kelas: "s1" }, { v: sb * v.e, d: 3, kelas: "s2" }, { v: xt, d: 3 }, { v: xh, d: 3, kelas: "warn" }], rahasia: t === 1000, kelas: t === 1000 ? "tbh-jml" : "" };
        });
        var xt1000 = Math.sqrt(ab[1000]) * v.x0 + Math.sqrt(1 - ab[1000]) * v.e;
        return {
          kolom: ["langkah", "ᾱ_t", "bagian x₀: √ᾱ·x₀", "bagian noise: √(1−ᾱ)·ε", "x_t", "tebakan x₀"],
          baris: baris,
          tebak: { tanya: "Di langkah 1000, x_t kira-kira berapa?", jawab: xt1000, toleransi: 0.06, petunjuk: "Bagian x₀ hampir habis: yang tersisa hampir hanya ε." },
          catatan: function (buka) { return "Bagian x₀ menyusut, bagian noise membesar, sampai x_t hampir sama dengan ε saja: dari x₀ = −2 atau 2 hasil akhirnya sama-sama noise. " + (buka ? "Kolom kanan dihitung sungguhan, bukan dikarang: selama noise belum menutupi semuanya, penebak masih bisa mengenali asal x₀; di langkah akhir ia tinggal menebak di antara −2 dan 2. Model difusi sungguhan belajar penebak seperti ini untuk data yang jauh lebih rumit, lalu berjalan mundur selangkah demi selangkah." : ""); }
        };
      }
    });
  };
})();
