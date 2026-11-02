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
})();
