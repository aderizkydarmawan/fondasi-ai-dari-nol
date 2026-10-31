/* Explorable kecil per pelajaran. Setiap widget: kontrol di atas, gambar SVG, angka hasil di bawah.
   Warna seri memakai --s1 / --s2 (sudah divalidasi untuk buta warna, terang dan gelap). */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function fmt(v, d) { if (d === undefined) d = 2; var r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d); return String(r).replace("-", "−").replace(".", ","); }
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }

  /* Bidang koordinat dengan grid, sumbu, dan konversi piksel <-> nilai */
  function Plane(svg, o) {
    var W = o.w || 560, H = o.h || 340, P = 34;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var p = {
      X: function (x) { return P + (x - o.x0) / (o.x1 - o.x0) * (W - 2 * P); },
      Y: function (y) { return H - P - (y - o.y0) / (o.y1 - o.y0) * (H - 2 * P); },
      ix: function (px) { return o.x0 + (px - P) / (W - 2 * P) * (o.x1 - o.x0); },
      iy: function (py) { return o.y0 + (H - P - py) / (H - 2 * P) * (o.y1 - o.y0); },
      W: W, H: H, o: o
    };
    var cid = "clip" + Math.random().toString(36).slice(2, 8);
    p.clear = function () {
      svg.innerHTML = "";
      el("rect", { x: P, y: P, width: W - 2 * P, height: H - 2 * P }, el("clipPath", { id: cid }, el("defs", {}, svg)));
      var g = el("g", { "class": "grid" }, svg), sx = o.sx || 1, sy = o.sy || 1, x, y;
      for (x = Math.ceil(o.x0 / sx) * sx; x <= o.x1 + 1e-9; x += sx) el("line", { x1: p.X(x), x2: p.X(x), y1: p.Y(o.y0), y2: p.Y(o.y1) }, g);
      for (y = Math.ceil(o.y0 / sy) * sy; y <= o.y1 + 1e-9; y += sy) el("line", { y1: p.Y(y), y2: p.Y(y), x1: p.X(o.x0), x2: p.X(o.x1) }, g);
      var a = el("g", { "class": "axis" }, svg);
      if (o.y0 <= 0 && o.y1 >= 0) el("line", { x1: p.X(o.x0), x2: p.X(o.x1), y1: p.Y(0), y2: p.Y(0) }, a);
      if (o.x0 <= 0 && o.x1 >= 0) el("line", { y1: p.Y(o.y0), y2: p.Y(o.y1), x1: p.X(0), x2: p.X(0) }, a);
      var lx = o.lx || sx, ly = o.ly || sy, t = el("g", { "class": "tick" }, svg);
      var ay = (o.y0 <= 0 && o.y1 >= 0) ? 0 : o.y0, ax = (o.x0 <= 0 && o.x1 >= 0) ? 0 : o.x0;
      for (x = Math.ceil(o.x0 / lx) * lx; x <= o.x1 + 1e-9; x += lx) if (Math.abs(x) > 1e-9 || ax !== 0) txt(p.X(x), p.Y(ay) + 15, fmt(x, 2), t, "middle");
      for (y = Math.ceil(o.y0 / ly) * ly; y <= o.y1 + 1e-9; y += ly) if (Math.abs(y) > 1e-9 || ay !== 0) txt(p.X(ax) - 6, p.Y(y) + 4, fmt(y, 2), t, "end");
      return svg;
    };
    p.curve = function (f, cls, a, b) {
      a = a === undefined ? o.x0 : a; b = b === undefined ? o.x1 : b;
      var d = "", n = 240, i, x, y, pen = false;
      for (i = 0; i <= n; i++) {
        x = a + (b - a) * i / n; y = f(x);
        if (!isFinite(y) || y < o.y0 - (o.y1 - o.y0) || y > o.y1 + (o.y1 - o.y0)) { pen = false; continue; }
        d += (pen ? "L" : "M") + p.X(x).toFixed(1) + " " + p.Y(y).toFixed(1); pen = true;
      }
      return el("path", { d: d, "class": cls || "s1 line", "clip-path": "url(#" + cid + ")" }, svg);
    };
    p.seg = function (x1, y1, x2, y2, cls) { return el("line", { x1: p.X(x1), y1: p.Y(y1), x2: p.X(x2), y2: p.Y(y2), "class": cls || "s1 line" }, svg); };
    p.dot = function (x, y, cls, r) { return el("circle", { cx: p.X(x), cy: p.Y(y), r: r || 6, "class": cls || "s1 dot" }, svg); };
    p.text = function (x, y, s, cls, anchor) { return txt(p.X(x), p.Y(y), s, svg, anchor || "start", cls); };
    p.arrow = function (x1, y1, x2, y2, cls) {
      var l = p.seg(x1, y1, x2, y2, (cls || "s1") + " line"); l.setAttribute("marker-end", "url(#" + (cls || "s1") + "-head)"); return l;
    };
    function txt(x, y, s, parent, anchor, cls) { var e = el("text", { x: x, y: y, "text-anchor": anchor, "class": cls || "" }, parent); e.textContent = s; return e; }
    return p;
  }

  function heads(svg) {
    var d = el("defs", {}, svg);
    ["s1", "s2", "ink"].forEach(function (c) {
      var m = el("marker", { id: c + "-head", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, d);
      el("path", { d: "M0 0 L10 5 L0 10 z", "class": c + " fill" }, m);
    });
  }

  /* Rangka umum: judul, kontrol slider, svg, hasil */
  function frame(host, title, controls) {
    host.innerHTML = '<div class="viz-h"><b>Coba sendiri</b><span>' + title + '</span></div><div class="viz-c"></div><svg role="img" aria-label="' + title + '"></svg><div class="viz-out" aria-live="polite"></div>';
    var c = host.querySelector(".viz-c"), vals = {};
    (controls || []).forEach(function (k) {
      var id = "v" + Math.random().toString(36).slice(2, 8);
      var lab = document.createElement("label"); lab.setAttribute("for", id);
      lab.innerHTML = '<span>' + k.label + ' = <output>' + fmt(k.v, k.d === undefined ? 2 : k.d) + '</output></span><input id="' + id + '" type="range" min="' + k.min + '" max="' + k.max + '" step="' + k.step + '" value="' + k.v + '">';
      c.appendChild(lab); vals[k.id] = +k.v;
      var inp = lab.querySelector("input"), out = lab.querySelector("output");
      inp.addEventListener("input", function () { vals[k.id] = +inp.value; out.textContent = fmt(+inp.value, k.d === undefined ? 2 : k.d); host._draw(); });
    });
    return { svg: host.querySelector("svg"), out: host.querySelector(".viz-out"), vals: vals, ctl: c };
  }
  function button(f, label, fn) { var b = document.createElement("button"); b.type = "button"; b.textContent = label; b.addEventListener("click", fn); f.ctl.appendChild(b); return b; }

  /* Seret titik: kembalikan koordinat nilai dari posisi pointer */
  function draggable(svg, p, getPts, onMove) {
    var active = -1;
    function loc(e) { var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var q = pt.matrixTransform(svg.getScreenCTM().inverse()); return [p.ix(q.x), p.iy(q.y)]; }
    svg.addEventListener("pointerdown", function (e) {
      var v = loc(e), pts = getPts(), best = -1, bd = 1e9;
      pts.forEach(function (q, i) { var dx = p.X(q[0]) - p.X(v[0]), dy = p.Y(q[1]) - p.Y(v[1]), d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } });
      if (bd < 900) { active = best; svg.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    svg.addEventListener("pointermove", function (e) { if (active < 0) return; onMove(active, loc(e)); });
    svg.addEventListener("pointerup", function () { active = -1; });
    svg.style.touchAction = "none";
    /* keyboard: Tab ke titik, panah menggeser satu langkah */
    var kf = -1;
    function tag() {
      [].forEach.call(svg.querySelectorAll(".handle"), function (c, i) {
        c.setAttribute("tabindex", "0"); c.setAttribute("role", "slider");
        var q = getPts()[i]; if (q) { c.setAttribute("aria-label", "Titik " + (i + 1) + ", geser dengan panah"); c.setAttribute("aria-valuenow", q[0]); c.setAttribute("aria-valuetext", "(" + q[0] + ", " + q[1] + ")"); }
        if (i === kf && document.activeElement !== c) c.focus();
      });
    }
    new MutationObserver(tag).observe(svg, { childList: true }); tag();
    svg.addEventListener("keydown", function (e) {
      var hs = [].slice.call(svg.querySelectorAll(".handle")), i = hs.indexOf(e.target);
      var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (i < 0 || !d) return; e.preventDefault();
      var q = getPts()[i], st = e.shiftKey ? 0.5 : 1;
      kf = i; onMove(i, [q[0] + d[0] * st, q[1] + d[1] * st]);
    });
    svg.addEventListener("focusout", function () { setTimeout(function () { if (!svg.contains(document.activeElement)) kf = -1; }); });
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function snap(v, s) { return Math.round(v / s) * s; }

  var W = {};

  /* 0.1 berjalan di garis bilangan */
  W.numline = function (h) {
    var f = frame(h, "Mulai di a, lalu tambah b (b negatif = jalan ke kiri)", [{ id: "a", label: "a", min: -6, max: 6, step: 1, v: 2, d: 0 }, { id: "b", label: "b", min: -6, max: 6, step: 1, v: -5, d: 0 }]);
    var p = Plane(f.svg, { x0: -10, x1: 10, y0: -1, y1: 1.4, h: 150, sx: 1, sy: 10, lx: 2 });
    h._draw = function () {
      var a = f.vals.a, b = f.vals.b; p.clear(); heads(f.svg);
      p.dot(a, 0, "ink dot", 5); p.text(a, 0.35, "mulai " + fmt(a, 0), "lbl", "middle");
      if (b !== 0) p.arrow(a, 0.75, a + b, 0.75, "s1");
      p.dot(a + b, 0, "s1 dot"); p.text(a + b, 1.08, "hasil " + fmt(a + b, 0), "lbl s1t", "middle");
      f.out.innerHTML = fmt(a, 0) + " + (" + fmt(b, 0) + ") = <b>" + fmt(a + b, 0) + "</b>. " + (b < 0 ? "Menambah bilangan negatif sama dengan berjalan ke kiri." : b > 0 ? "Menambah bilangan positif berarti berjalan ke kanan." : "Menambah nol: tidak bergerak.");
    }; h._draw();
  };

  /* 0.2 neuron: w·x + b, urutan operasi */
  W.neuron = function (h) {
    var f = frame(h, "Satu neuron: y = w × x + b. Kali dulu, baru tambah", [{ id: "w", label: "w (bobot)", min: -3, max: 3, step: 0.5, v: 2 }, { id: "x", label: "x (input)", min: -4, max: 4, step: 1, v: 3, d: 0 }, { id: "b", label: "b (bias)", min: -5, max: 5, step: 1, v: 1, d: 0 }]);
    var p = Plane(f.svg, { x0: -4, x1: 4, y0: -14, y1: 14, h: 300, sx: 1, sy: 2, ly: 4 });
    h._draw = function () {
      var w = f.vals.w, x = f.vals.x, b = f.vals.b, y = w * x + b; p.clear();
      p.curve(function (t) { return w * t + b; }, "s1 line");
      p.seg(x, 0, x, y, "guide"); p.dot(x, y, "s1 dot"); p.text(x, y, "  (" + fmt(x, 0) + ", " + fmt(y) + ")", "lbl");
      f.out.innerHTML = "Langkah 1, kali: " + fmt(w) + " × " + fmt(x, 0) + " = " + fmt(w * x) + ". Langkah 2, tambah: " + fmt(w * x) + " + " + fmt(b, 0) + " = <b>" + fmt(y) + "</b>. Kalau urutannya dibalik, (w × (x + b)) = " + fmt(w * (x + b)) + ", hasilnya berbeda. Garis ungu menunjukkan output neuron untuk semua x.";
    }; h._draw();
  };

  /* 0.3 pecahan sebagai bagian dari batang */
  W.fraction = function (h) {
    var f = frame(h, "Pecahan p/q: batang dibagi q bagian, p bagian diwarnai", [{ id: "p", label: "pembilang p", min: 0, max: 12, step: 1, v: 3, d: 0 }, { id: "q", label: "penyebut q", min: 1, max: 12, step: 1, v: 4, d: 0 }]);
    h._draw = function () {
      var p = f.vals.p, q = f.vals.q, s = f.svg; s.setAttribute("viewBox", "0 0 560 120"); s.innerHTML = "";
      var whole = Math.max(1, Math.ceil(p / q)), w = 520 / whole, i, k;
      for (k = 0; k < whole; k++) for (i = 0; i < q; i++) {
        var idx = k * q + i;
        el("rect", { x: 20 + k * w + i * w / q + 1, y: 20, width: w / q - 2, height: 56, rx: 4, "class": idx < p ? "s1 fill" : "cell" }, s);
      }
      var t = el("text", { x: 20, y: 104, "class": "lbl" }, s); t.textContent = whole > 1 ? "Lebih dari satu batang utuh: pecahan > 1" : "Satu batang utuh = 1";
      f.out.innerHTML = p + "/" + q + " = " + fmt(p / q, 4) + " = <b>" + fmt(p / q * 100, 2) + "%</b>. Coba 2/4 dan 1/2: luas berwarnanya sama, jadi nilainya sama (pecahan senilai).";
    }; h._draw();
  };

  /* 0.4 pangkat: aˣ tumbuh berlipat */
  W.power = function (h) {
    var f = frame(h, "Bandingkan pertumbuhan pangkat: x² (kuadrat) dan 2ˣ (eksponen)", [{ id: "x", label: "x", min: 0, max: 8, step: 1, v: 4, d: 0 }]);
    var p = Plane(f.svg, { x0: 0, x1: 8.4, y0: 0, y1: 260, sx: 1, sy: 20, ly: 40 });
    h._draw = function () {
      var x = f.vals.x; p.clear();
      p.curve(function (t) { return t * t; }, "s1 line"); p.curve(function (t) { return Math.pow(2, t); }, "s2 line dash");
      p.dot(x, x * x, "s1 dot"); p.dot(x, Math.pow(2, x), "s2 dot sq");
      p.text(7.2, 49 + 14, "x²", "lbl s1t"); p.text(7.6, 200, "2ˣ", "lbl s2t");
      f.out.innerHTML = "x = " + x + ": x² = " + x * x + ", 2ˣ = " + Math.pow(2, x) + ". " + (x < 2 ? "Di awal, keduanya mirip." : x <= 4 ? "Di x = 2 dan x = 4 keduanya sama persis. Perhatikan apa yang terjadi sesudahnya." : "Eksponen sudah menyalip jauh: <b>berlipat</b> setiap langkah, bukan sekadar naik.");
    }; h._draw();
  };

  /* 0.5 lempar koin: frekuensi relatif mendekati 1/2 */
  W.coin = function (h) {
    var f = frame(h, "Lempar koin berkali-kali. Proporsi gambar mendekati 0,5 (hukum bilangan besar)", []);
    var p = Plane(f.svg, { x0: 0, x1: 1000, y0: 0, y1: 1, sx: 100, sy: 0.1, lx: 200, ly: 0.25 });
    var hist = [], heads = 0;
    function flip(n) { for (var i = 0; i < n; i++) { if (hist.length >= 1000) break; heads += Math.random() < 0.5 ? 1 : 0; hist.push(heads / (hist.length + 1)); } h._draw(); }
    button(f, "Lempar 1×", function () { flip(1); }); button(f, "Lempar 10×", function () { flip(10); }); button(f, "Lempar 100×", function () { flip(100); }); button(f, "Ulang", function () { hist = []; heads = 0; h._draw(); });
    h._draw = function () {
      p.clear(); p.seg(0, 0.5, 1000, 0.5, "guide"); p.text(1000, 0.53, "peluang teoretis 0,5", "lbl", "end");
      if (hist.length) {
        var d = "";
        hist.forEach(function (v, i) { d += (i ? "L" : "M") + p.X(i + 1).toFixed(1) + " " + p.Y(v).toFixed(1); });
        el("path", { d: d, "class": "s1 line" }, f.svg);
        p.dot(hist.length, hist[hist.length - 1], "s1 dot", 4);
      }
      var n = hist.length;
      f.out.innerHTML = n ? n + " lemparan, " + heads + " gambar, proporsi <b>" + fmt(heads / n, 3) + "</b>. Di awal garisnya liar; makin banyak lemparan, makin rapat ke 0,5. Inilah alasan AI butuh banyak data." : "Tekan tombol untuk mulai melempar.";
    }; h._draw();
  };

  /* 0.6 jarak Pythagoras: seret titik */
  W.distance = function (h) {
    var f = frame(h, "Seret titik B. Jarak AB = √(Δx² + Δy²)", []);
    var p = Plane(f.svg, { x0: -1, x1: 8, y0: -1, y1: 6, sx: 1, sy: 1 }), A = [1, 1], B = [4, 5];
    h._draw = function () {
      p.clear(); var dx = B[0] - A[0], dy = B[1] - A[1], d = Math.sqrt(dx * dx + dy * dy);
      p.seg(A[0], A[1], B[0], A[1], "s2 line dash"); p.seg(B[0], A[1], B[0], B[1], "s2 line dash"); p.seg(A[0], A[1], B[0], B[1], "s1 line");
      p.text((A[0] + B[0]) / 2, A[1] - 0.45, "Δx = " + fmt(dx, 0), "lbl", "middle"); p.text(B[0] + 0.15, (A[1] + B[1]) / 2, "Δy = " + fmt(dy, 0), "lbl");
      p.dot(A[0], A[1], "ink dot"); p.text(A[0] - 0.3, A[1] + 0.3, "A", "lbl");
      p.dot(B[0], B[1], "s1 dot handle", 9); p.text(B[0] + 0.25, B[1] + 0.3, "B (seret)", "lbl");
      f.out.innerHTML = "√(" + fmt(dx, 0) + "² + " + fmt(dy, 0) + "²) = √" + (dx * dx + dy * dy) + " = <b>" + fmt(d, 3) + "</b>. Rumus yang sama dipakai AI untuk mengukur jarak antar data, berapa pun dimensinya.";
    };
    draggable(f.svg, p, function () { return [B]; }, function (i, v) { B = [clamp(snap(v[0], 1), -1, 8), clamp(snap(v[1], 1), -1, 6)]; h._draw(); });
    h._draw();
  };

  /* 0.7 dan 2.1: garis potong menjadi garis singgung */
  W.secant = function (h) {
    var f = frame(h, "Posisi bola s(t) = t². Kecilkan selang h dan lihat kemiringan garis biru muda", [{ id: "h", label: "selang h", min: 0.01, max: 2, step: 0.01, v: 1 }]);
    var p = Plane(f.svg, { x0: 0, x1: 4.5, y0: 0, y1: 18, sx: 0.5, sy: 2, lx: 1, ly: 4 });
    h._draw = function () {
      var hh = f.vals.h, t = 2, m = ((t + hh) * (t + hh) - t * t) / hh; p.clear();
      p.curve(function (x) { return x * x; }, "s1 line");
      p.curve(function (x) { return 4 + m * (x - t); }, "s2 line dash");
      p.dot(t, 4, "ink dot"); p.dot(t + hh, (t + hh) * (t + hh), "s2 dot sq");
      p.text(t - 0.1, 5.2, "t = 2", "lbl", "end");
      f.out.innerHTML = "Kemiringan garis potong = (s(2+h) − s(2)) / h = <b>" + fmt(m, 4) + "</b>. Makin kecil h, makin dekat ke 4. Batas inilah yang disebut turunan s′(2) = 2·2 = 4.";
    }; h._draw();
  };

  /* 1.1 substitusi: dua bentuk yang setara */
  W.subst = function (h) {
    var f = frame(h, "Geser x. Dua bentuk yang setara selalu memberi hasil sama", [{ id: "x", label: "x", min: -5, max: 5, step: 0.5, v: 2 }]);
    var p = Plane(f.svg, { x0: -5, x1: 5, y0: -10, y1: 30, sx: 1, sy: 5, ly: 10 });
    h._draw = function () {
      var x = f.vals.x; p.clear();
      p.curve(function (t) { return 3 * (t + 4); }, "s1 line");
      p.curve(function (t) { return 3 * t + 12; }, "s2 line dash");
      p.curve(function (t) { return 3 * t + 4; }, "faint line");
      p.dot(x, 3 * (x + 4), "s1 dot"); p.text(-4.8, 3 * -0.2 + 6, "salah: 3x + 4", "lbl faintt");
      f.out.innerHTML = "3(x + 4) = " + fmt(3 * (x + 4)) + " dan 3x + 12 = " + fmt(3 * x + 12) + ": <b>selalu sama</b> (garis ungu dan biru muda putus-putus berimpit). Kesalahan umum 3x + 4 = " + fmt(3 * x + 4) + " memberi garis lain (abu-abu).";
    }; h._draw();
  };

  /* 1.2 sistem dua persamaan: titik potong dua garis */
  W.system = function (h) {
    var f = frame(h, "x + y = c₁ dan x − y = c₂. Jawaban sistem = titik potong dua garis", [{ id: "c1", label: "c₁", min: -4, max: 12, step: 1, v: 10, d: 0 }, { id: "c2", label: "c₂", min: -6, max: 8, step: 1, v: 4, d: 0 }]);
    var p = Plane(f.svg, { x0: -4, x1: 12, y0: -6, y1: 12, sx: 1, sy: 1, lx: 2, ly: 2 });
    h._draw = function () {
      var c1 = f.vals.c1, c2 = f.vals.c2, x = (c1 + c2) / 2, y = (c1 - c2) / 2; p.clear();
      p.curve(function (t) { return c1 - t; }, "s1 line"); p.curve(function (t) { return t - c2; }, "s2 line dash");
      p.dot(x, y, "ink dot", 7); p.text(x + 0.3, y + 0.6, "(" + fmt(x) + ", " + fmt(y) + ")", "lbl");
      f.out.innerHTML = "Jumlahkan kedua persamaan: 2x = " + (c1 + c2) + ", jadi x = " + fmt(x) + ". Lalu y = " + c1 + " − " + fmt(x) + " = " + fmt(y) + ". Titik potongnya <b>(" + fmt(x) + ", " + fmt(y) + ")</b>. Setiap titik di garis ungu memenuhi persamaan pertama; hanya titik potong yang memenuhi keduanya.";
    }; h._draw();
  };

  /* 1.3 fungsi dan uji garis tegak */
  W.func = function (h) {
    var f = frame(h, "Geser x. Garis tegak selalu memotong grafik fungsi tepat sekali", [{ id: "x", label: "x", min: -3, max: 3, step: 0.1, v: 1.5 }]);
    var p = Plane(f.svg, { x0: -3.2, x1: 3.2, y0: -4, y1: 9.5, sx: 1, sy: 1, ly: 2 }), mode = "f";
    var F = { f: [function (t) { return 2 * t + 1; }, "f(x) = 2x + 1"], g: [function (t) { return t * t; }, "g(x) = x²"], gf: [function (t) { return (2 * t + 1) * (2 * t + 1); }, "g(f(x)) = (2x + 1)²"] };
    Object.keys(F).forEach(function (k) { button(f, F[k][1], function () { mode = k; h._draw(); }); });
    h._draw = function () {
      var x = f.vals.x, fn = F[mode][0], y = fn(x); p.clear();
      p.seg(x, -4, x, 9.5, "guide"); p.curve(fn, "s1 line"); if (y <= 9.5) p.dot(x, y, "s1 dot");
      [].forEach.call(f.ctl.querySelectorAll("button"), function (b, i) { b.setAttribute("aria-pressed", Object.keys(F)[i] === mode); });
      f.out.innerHTML = F[mode][1].split(" = ")[0].replace("(x)", "(" + fmt(x, 1) + ")") + " = <b>" + fmt(y, 2) + "</b>. Satu input, satu output. " + (mode === "gf" ? "Ini fungsi bertumpuk: masuk ke f dulu, hasilnya ke g. Jaringan saraf adalah tumpukan seperti ini." : "");
    }; h._draw();
  };

  /* 1.4 garis dari dua titik */
  W.line = function (h) {
    var f = frame(h, "Seret dua titik. Kemiringan m = Δy/Δx, titik potong b = nilai y saat x = 0", []);
    var p = Plane(f.svg, { x0: -1, x1: 8, y0: -2, y1: 10, sx: 1, sy: 1, ly: 2 }), P = [[1, 3], [3, 7]];
    h._draw = function () {
      p.clear(); var a = P[0], c = P[1];
      if (a[0] === c[0]) { f.out.innerHTML = "Dua titik dengan x yang sama membuat garis tegak: kemiringannya tidak terdefinisi (bagi nol)."; p.seg(a[0], -2, a[0], 10, "s1 line"); }
      else {
        var m = (c[1] - a[1]) / (c[0] - a[0]), b = a[1] - m * a[0];
        p.curve(function (t) { return m * t + b; }, "s1 line");
        p.seg(a[0], a[1], c[0], a[1], "s2 line dash"); p.seg(c[0], a[1], c[0], c[1], "s2 line dash");
        if (b >= -2 && b <= 10) { p.dot(0, b, "ink dot", 5); p.text(0.2, b - 0.6, "b = " + fmt(b), "lbl"); }
        f.out.innerHTML = "m = (" + c[1] + " − " + a[1] + ") / (" + c[0] + " − " + a[0] + ") = <b>" + fmt(m) + "</b>, b = " + fmt(b) + ". Garisnya: <b>y = " + fmt(m) + "x " + (b < 0 ? "− " + fmt(-b) : "+ " + fmt(b)) + "</b>. " + (m > 0 ? "Naik ke kanan." : m < 0 ? "Turun ke kanan." : "Datar.");
      }
      P.forEach(function (q, i) { p.dot(q[0], q[1], "s1 dot handle", 9); p.text(q[0] + 0.25, q[1] + 0.35, "(" + q[0] + ", " + q[1] + ")", "lbl"); });
    };
    draggable(f.svg, p, function () { return P; }, function (i, v) { P[i] = [clamp(snap(v[0], 1), -1, 8), clamp(snap(v[1], 1), -2, 10)]; h._draw(); });
    h._draw();
  };

  /* 1.5 eksponen dan logaritma saling membalik */
  W.explog = function (h) {
    var f = frame(h, "eˣ dan ln x adalah cermin satu sama lain terhadap garis y = x", [{ id: "x", label: "x", min: -2, max: 2, step: 0.05, v: 1 }]);
    var p = Plane(f.svg, { x0: -2.5, x1: 7.6, y0: -2.5, y1: 7.6, sx: 1, sy: 1, lx: 2, ly: 2, h: 400 });
    h._draw = function () {
      var x = f.vals.x, y = Math.exp(x); p.clear();
      p.curve(function (t) { return t; }, "faint line");
      p.curve(Math.exp, "s1 line"); p.curve(function (t) { return t > 0 ? Math.log(t) : NaN; }, "s2 line dash", 0.01, 7.6);
      if (y <= 7.6) { p.dot(x, y, "s1 dot"); p.dot(y, x, "s2 dot sq"); p.seg(x, y, y, x, "guide"); }
      p.text(1.75, 7, "eˣ", "lbl s1t"); p.text(6.4, 2.3, "ln x", "lbl s2t");
      f.out.innerHTML = "e<sup>" + fmt(x) + "</sup> = " + fmt(y, 4) + ", dan ln(" + fmt(y, 4) + ") = <b>" + fmt(x) + "</b>. Logaritma menjawab: \"e dipangkatkan berapa supaya jadi " + fmt(y, 3) + "?\" Perhatikan: ln x negatif untuk 0 &lt; x &lt; 1, itulah kenapa −ln(peluang) dipakai sebagai hukuman.";
    }; h._draw();
  };

  /* 1.6 rata-rata sebagai titik seimbang */
  W.mean = function (h) {
    var f = frame(h, "Seret titik data. Segitiga = rata-rata, tempat papan seimbang", []);
    var p = Plane(f.svg, { x0: 0, x1: 12, y0: -1.6, y1: 2, h: 220, sx: 1, sy: 10 }), D = [3, 5, 7, 9];
    h._draw = function () {
      p.clear(); var n = D.length, m = D.reduce(function (a, b) { return a + b; }, 0) / n, s = 0;
      D.forEach(function (x, i) { var y = 0.5 + 0.28 * i; p.seg(m, y, x, y, x >= m ? "s1 line" : "s2 line dash"); s += x - m; });
      D.forEach(function (x, i) { p.dot(x, 0.5 + 0.28 * i, "s1 dot handle", 9); });
      el("path", { d: "M" + p.X(m) + " " + (p.Y(0) + 2) + " l-11 20 l22 0 z", "class": "ink fill" }, f.svg);
      p.text(m, -1.25, "x̄ = " + fmt(m), "lbl", "middle");
      f.out.innerHTML = "Data: [" + D.map(function (v) { return fmt(v, 1); }).join("; ") + "]. Rata-rata = " + fmt(m) + ". Jumlah selisih (xᵢ − x̄) = <b>" + fmt(s, 6) + "</b>: ungu (di kanan) dan biru muda (di kiri) selalu saling menghapus.";
    };
    draggable(f.svg, p, function () { return D.map(function (x, i) { return [x, 0.5 + 0.28 * i]; }); }, function (i, v) { D[i] = clamp(snap(v[0], 0.5), 0, 12); h._draw(); });
    h._draw();
  };

  /* 1.7 varians sebagai rata-rata luas kotak */
  W.variance = function (h) {
    var f = frame(h, "Seret titik. Sisi tiap persegi sebanding dengan selisih (xᵢ − x̄), jadi luasnya sebanding dengan (xᵢ − x̄)². Varians = rata-rata luas itu", []);
    var p = Plane(f.svg, { x0: 0, x1: 12, y0: -0.5, y1: 7.2, h: 340, sx: 1, sy: 10 }), D = [2, 4, 4, 4, 5, 5, 7, 9];
    h._draw = function () {
      p.clear(); var n = D.length, m = D.reduce(function (a, b) { return a + b; }, 0) / n, ss = 0;
      p.seg(m, -0.5, m, 6, "guide"); p.text(m + 0.1, 5.6, "x̄ = " + fmt(m), "lbl");
      D.forEach(function (x, i) {
        var d = x - m, y = 0.3 + 0.62 * i, k = (p.X(1) - p.X(0)) * 0.45, sp = Math.abs(d) * k;
        ss += d * d;
        p.seg(m, y, x, y, d > 0 ? "s1 line" : "s2 line dash");
        if (sp > 0) el("rect", { x: d > 0 ? p.X(x) - sp : p.X(x), y: p.Y(y) - sp, width: sp, height: sp, "class": (d > 0 ? "s1" : "s2") + " area" }, f.svg);
        p.dot(x, y, "s1 dot handle", 7);
      });
      var v = ss / n;
      f.out.innerHTML = "Jumlah kuadrat = " + fmt(ss) + ". Varians (bagi n = " + n + ") = <b>" + fmt(v, 3) + "</b>, simpangan baku = <b>" + fmt(Math.sqrt(v), 3) + "</b>. Versi sampel (bagi n − 1) = " + fmt(ss / (n - 1), 3) + ". Satu titik yang jauh membuat kotak besar sekali: varians peka terhadap pencilan.";
    };
    draggable(f.svg, p, function () { return D.map(function (x, i) { return [x, 0.3 + 0.62 * i]; }); }, function (i, v) { D[i] = clamp(snap(v[0], 0.5), 0, 12); h._draw(); });
    h._draw();
  };

  /* 1.8 vektor dan hasil kali titik */
  W.dot = function (h) {
    var f = frame(h, "Seret ujung panah u dan v. Hasil kali titik mengukur kesearahan", []);
    var p = Plane(f.svg, { x0: -5, x1: 5, y0: -5, y1: 5, sx: 1, sy: 1, h: 400, w: 440 }), U = [3, 1], V = [1, 3];
    h._draw = function () {
      p.clear(); heads(f.svg);
      var d = U[0] * V[0] + U[1] * V[1], nu = Math.hypot(U[0], U[1]), nv = Math.hypot(V[0], V[1]);
      var c = nu && nv ? d / (nu * nv) : 0, ang = Math.acos(clamp(c, -1, 1)) * 180 / Math.PI;
      if (nu) { var k = d / (nu * nu); p.seg(V[0], V[1], k * U[0], k * U[1], "guide"); p.seg(0, 0, k * U[0], k * U[1], "s2 line thick"); }
      p.arrow(0, 0, U[0], U[1], "s1"); p.arrow(0, 0, V[0], V[1], "ink");
      p.dot(U[0], U[1], "s1 dot handle", 9); p.dot(V[0], V[1], "ink dot handle", 9);
      p.text(U[0] + 0.25, U[1] - 0.2, "u", "lbl s1t"); p.text(V[0] + 0.25, V[1] + 0.2, "v", "lbl");
      f.out.innerHTML = "u = [" + U.join(", ") + "], v = [" + V.join(", ") + "]. u · v = " + U[0] + "·" + V[0] + " + " + U[1] + "·" + V[1] + " = <b>" + d + "</b>. Sudut ≈ " + fmt(ang, 1) + "°, cos θ = " + fmt(c, 3) + ". " + (d > 0 ? "Positif: searah." : d < 0 ? "Negatif: berlawanan arah." : "Nol: tegak lurus.") + " Garis biru muda tebal adalah bayangan v di arah u.";
    };
    draggable(f.svg, p, function () { return [U, V]; }, function (i, v) { var q = [clamp(snap(v[0], 1), -5, 5), clamp(snap(v[1], 1), -5, 5)]; if (i === 0) U = q; else V = q; h._draw(); });
    h._draw();
  };

  /* 1.9 vektorisasi: X @ w baris demi baris */
  W.matvec = function (h) {
    var f = frame(h, "X @ w + b: setiap baris rumah dikali bobot w, lalu ditambah b", [{ id: "w1", label: "w₁ (per 10 m²)", min: 0, max: 6, step: 1, v: 3, d: 0 }, { id: "w2", label: "w₂ (per kamar)", min: 0, max: 10, step: 1, v: 5, d: 0 }]);
    var X = [[7, 2], [10, 3], [5, 1]];
    h._draw = function () {
      var w1 = f.vals.w1, w2 = f.vals.w2, s = f.svg; s.setAttribute("viewBox", "0 0 560 210"); s.innerHTML = "";
      var ys = X.map(function (r) { return r[0] * w1 + r[1] * w2 + 10; }), mx = Math.max.apply(null, ys.concat([1]));
      X.forEach(function (r, i) {
        var y = 30 + i * 60, t = el("text", { x: 10, y: y + 22, "class": "lbl mono" }, s);
        t.textContent = "[" + r[0] + ", " + r[1] + "] → " + r[0] + "·" + w1 + " + " + r[1] + "·" + w2 + " + 10 =";
        el("rect", { x: 300, y: y + 4, width: Math.max(2, ys[i] / mx * 200), height: 28, rx: 4, "class": "s1 fill" }, s);
        var v = el("text", { x: 306 + ys[i] / mx * 200, y: y + 23, "class": "lbl" }, s); v.textContent = ys[i];
      });
      f.out.innerHTML = "Hasil: <b>[" + ys.join(", ") + "]</b>. Di NumPy cukup <code>X @ w + b</code>: satu baris kode untuk semua rumah, dan perulangannya berjalan di dalam C yang cepat.";
    }; h._draw();
  };

  /* Alat bantu dibagikan ke viz2.js (widget Lapis 2 ke atas) */
  window.VIZ = { W: W, Plane: Plane, frame: frame, button: button, el: el, fmt: fmt, heads: heads, draggable: draggable, clamp: clamp, snap: snap };

  /* Dipasang oleh index.html sesudah pelajaran ditampilkan */
  window.mountViz = function (root) {
    [].forEach.call(root.querySelectorAll("[data-viz]"), function (host) {
      var k = host.getAttribute("data-viz");
      if (W[k]) { try { W[k](host); var tip = window.COBA && COBA[k], hd = host.querySelector(".viz-h"); if (tip && hd) { var p = document.createElement("p"); p.className = "coba"; p.innerHTML = "<b>Coba ini:</b> " + tip; hd.insertAdjacentElement("afterend", p); } } catch (e) { host.textContent = "Gagal memuat visualisasi: " + e.message; } }
    });
  };
})();
