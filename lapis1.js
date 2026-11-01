window.LESSONS = window.LESSONS || {};

/* ───────────────────────── 1.1 ───────────────────────── */
window.LESSONS["1.1"] = {
  title: "Variabel dan aljabar",
  pre: "0.2 urutan operasi", min: 0,
  why: "Satu neuron di jaringan saraf ditulis <code>y = w·x + b</code>. Huruf w, x, dan b adalah variabel: kotak yang isinya berganti-ganti. Melatih AI artinya mencari isi kotak w dan b yang paling pas. Tanpa bahasa variabel, rumus AI mana pun tidak bisa dibaca.",
  body: `
<h2>Variabel adalah kotak berlabel</h2>
<p>Bayangkan kotak bertuliskan <b>x</b>. Isinya bisa 2, bisa 7, bisa −3. Kita belum tahu, atau isinya memang berubah-ubah. Huruf itu cuma <b>nama tempat</b> untuk sebuah angka.</p>
<p>Ekspresi <code>2x + 5</code> artinya: "ambil isi kotak x, kalikan 2, lalu tambah 5". Kalau x = 3, hasilnya 2 × 3 + 5 = 11. Menaruh angka ke dalam kotak disebut <b>substitusi</b>.</p>
<div class="rule">Huruf yang ditempel di depan angka berarti dikali: <mark>2x = 2 × x</mark>, dan <mark>wx = w × x</mark>.</div>
<div class="ex"><div class="q">Hitung 2x + 5 kalau x = 3.</div>
<div class="step">Ganti x dengan 3:  2 × 3 + 5
Kali dulu (aturan 0.2):  6 + 5</div>
<div class="ans">Jawaban: 11</div></div>

<h2>Menggabungkan suku sejenis</h2>
<p>Ekspresi <code>4x + 2x − x</code> artinya 4 kotak x, ditambah 2 kotak x, dikurangi 1 kotak x. Isinya tetap sejenis, jadi bisa dihitung seperti menghitung apel: 4 + 2 − 1 = 5. Hasilnya <code>5x</code>.</p>
<p>Tapi <code>3x + 2y</code> tidak bisa digabung, karena x dan y kotak yang berbeda, seperti apel dan jeruk.</p>
<div class="ex"><div class="q">Sederhanakan 4x + 2x − x, lalu cek dengan x = 2.</div>
<div class="step">4x + 2x − x = (4 + 2 − 1)x = 5x
Cek bentuk awal: 4·2 + 2·2 − 2 = 8 + 4 − 2 = 10
Cek bentuk akhir: 5·2 = 10  ✓</div>
<div class="ans">Jawaban: 5x</div></div>

<h2>Sifat distributif: membuka kurung</h2>
<p><code>3(x + 4)</code> artinya tiga kelompok yang masing-masing berisi "x dan 4". Totalnya tiga x dan tiga 4.</p>
<div class="rule"><mark>a(b + c) = ab + ac</mark>. Pengali di luar kurung dibagikan ke setiap isi kurung.</div>
<div class="ex"><div class="q">Buka kurung 3(x + 4), lalu cek dengan x = 2.</div>
<div class="step">3(x + 4) = 3·x + 3·4 = 3x + 12
Cek: 3(2 + 4) = 3 · 6 = 18
     3·2 + 12 = 6 + 12 = 18  ✓</div>
<div class="ans">Jawaban: 3x + 12</div></div>
<p>Kebiasaan "cek dengan satu angka" ini penting. Kalau dua bentuk benar-benar sama, mereka harus memberi hasil yang sama untuk angka apa pun. Ini cara murah menangkap kesalahan aljabar.</p>

<h2>Neuron pertama, sekarang dengan huruf</h2>
<p>Di 0.2 kamu menghitung neuron dengan angka. Sekarang tulis dengan variabel: <code>y = w·x + b</code>.</p>
<ul><li><b>x</b> = input, misalnya luas rumah.</li><li><b>w</b> = bobot (weight), seberapa penting input itu.</li><li><b>b</b> = bias, angka tambahan tetap.</li></ul>
<div class="ex"><div class="q">Neuron dengan w = 0,5 dan b = 1. Berapa y kalau x = 6?</div>
<div class="step">y = 0,5 · 6 + 1 = 3 + 1</div>
<div class="ans">Jawaban: y = 4</div></div>
<p>Rumusnya tetap sama untuk semua input. Yang berubah hanya isi kotaknya. Itulah kekuatan variabel: <b>satu rumus untuk tak terhingga kasus</b>.</p>

<h2>Periksa dengan Python</h2>
<pre><code>x = 2
print(4*x + 2*x - x, 5*x)     # 10 10
print(3*(x + 4), 3*x + 12)    # 18 18

w, b = 0.5, 1
print(w*6 + b)                # 4.0</code></pre>
`,
  src: [
    "OpenStax, <i>Prealgebra 2e</i>, Bab 2 “Introduction to the Language of Algebra” (gratis, baca online di openstax.org).",
    "Hammack, <i>Book of Proof</i> 3e, Bab 1 “Sets”, bagian awal: cara matematikawan memakai huruf sebagai nama objek. Lokal: <code>pustaka/pdf/Hammack_Book_of_Proof_GRATIS.pdf</code>.",
    "Gelman, Hill & Vehtari, <i>Regression and Other Stories</i>, §3.3 “Graphing a line” (hlm. 37): rumus y = a + bx yang sama dengan neuron. Lokal."
  ]
};

/* ───────────────────────── 1.2 ───────────────────────── */
window.LESSONS["1.2"] = {
  title: "Persamaan linear",
  pre: "1.1", min: 0,
  why: "Regresi linear, model AI paling dasar, pada intinya adalah menyelesaikan persamaan linear: mencari w dan b yang membuat tebakan cocok dengan data. Banyak persamaan linear sekaligus disebut sistem persamaan, dan itu pintu masuk ke aljabar linear, bahasa utama semua jaringan saraf.",
  body: `
<h2>Persamaan adalah timbangan seimbang</h2>
<p>Tanda <b>=</b> artinya kiri dan kanan sama berat. <code>3x + 5 = 20</code> adalah timbangan: di kiri ada tiga kotak x dan 5 kelereng, di kanan ada 20 kelereng. Kita ingin tahu isi satu kotak.</p>
<div class="rule">Apa pun yang kamu lakukan pada satu sisi, lakukan juga pada sisi lain. Timbangan tetap seimbang.</div>
<div class="ex"><div class="q">Selesaikan 3x + 5 = 20.</div>
<div class="step">Buang 5 dari kedua sisi:   3x = 15
Bagi kedua sisi dengan 3:  x = 5
Cek: 3·5 + 5 = 15 + 5 = 20  ✓</div>
<div class="ans">Jawaban: x = 5</div></div>
<div class="ex"><div class="q">Selesaikan 2x − 7 = x + 4.</div>
<div class="step">Kurangi x dari kedua sisi:  x − 7 = 4
Tambah 7 ke kedua sisi:     x = 11
Cek: kiri 2·11 − 7 = 15, kanan 11 + 4 = 15  ✓</div>
<div class="ans">Jawaban: x = 11</div></div>
<p>Disebut <b>linear</b> karena x hanya muncul berpangkat satu: tidak ada x², tidak ada x di penyebut. Kalau digambar, hasilnya garis lurus (pelajaran 1.4).</p>

<h2>Contoh nyata: membalik rumus</h2>
<p>Rumus suhu: F = 1,8C + 32. Kalau termometer menunjukkan 77 °F, berapa °C?</p>
<div class="ex"><div class="q">Selesaikan 77 = 1,8C + 32.</div>
<div class="step">Kurangi 32:  45 = 1,8C
Bagi 1,8:    C = 25</div>
<div class="ans">Jawaban: 25 °C</div></div>

<h2>Dua persamaan, dua kotak</h2>
<p>Kadang ada dua yang tidak diketahui. Dua bilangan jumlahnya 10 dan selisihnya 4. Tulis:</p>
<div class="big">x + y = 10<br>x − y = 4</div>
<p>Satu persamaan saja tidak cukup, karena banyak pasangan yang jumlahnya 10. Tapi dua persamaan bersama hanya cocok untuk satu pasangan.</p>
<div class="ex"><div class="q">Selesaikan sistem di atas.</div>
<div class="step">Jumlahkan kedua persamaan:  (x + y) + (x − y) = 10 + 4
y saling menghapus:         2x = 14  →  x = 7
Masukkan ke x + y = 10:     7 + y = 10  →  y = 3
Cek: 7 − 3 = 4  ✓</div>
<div class="ans">Jawaban: x = 7, y = 3</div></div>
<div class="rule">Umumnya, untuk menemukan <b>n</b> nilai yang tidak diketahui, kamu butuh <b>n</b> persamaan yang benar-benar berbeda.</div>
<p>Di AI, sebuah model bisa punya miliaran "kotak" (bobot). Komputer tidak menyelesaikannya satu per satu seperti di atas, tapi idenya sama. Bab 2 buku MML membuka aljabar linear tepat dari sistem persamaan seperti ini.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
A = np.array([[1, 1],
              [1, -1]])
b = np.array([10, 4])
print(np.linalg.solve(A, b))   # [7. 3.]</code></pre>
<p>Bentuk <code>A</code> dan <code>b</code> itu akan kamu pahami penuh di Lapis 2. Untuk sekarang, cukup lihat bahwa komputer menemukan jawaban yang sama.</p>
`,
  src: [
    "OpenStax, <i>Elementary Algebra 2e</i>, Bab 2 “Solving Linear Equations and Inequalities” dan Bab 5 “Systems of Linear Equations” (gratis online).",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §2.1 “Systems of Linear Equations” (hlm. 19). Lokal: <code>pustaka/pdf/</code>, cari “Deisenroth”.",
    "Strang, <i>Linear Algebra and Its Applications</i> 4e, Bab 1 (§1.1–1.2): geometri persamaan linear. Lokal."
  ]
};

/* ───────────────────────── 1.3 ───────────────────────── */
window.LESSONS["1.3"] = {
  title: "Fungsi dan grafik",
  pre: "1.1", min: 0,
  why: "Model AI apa pun, dari regresi sampai GPT, adalah sebuah fungsi: masukkan sesuatu (gambar, kalimat), keluar sesuatu (label, kata berikutnya). Melatih model berarti mencari fungsi yang tepat. Memahami fungsi dan grafiknya adalah cara melihat apa yang sebenarnya dikerjakan model.",
  body: `
<h2>Fungsi adalah mesin</h2>
<p>Fungsi seperti mesin jus: masukkan jeruk, keluar jus jeruk. Fungsi <code>f(x) = 2x + 1</code> menerima angka x, mengalikannya dengan 2, lalu menambah 1. Tulisan f(3) dibaca "f dari 3", artinya keluaran mesin kalau dimasuki 3.</p>
<div class="ex"><div class="q">f(x) = 2x + 1. Hitung f(3) dan f(−1).</div>
<div class="step">f(3)  = 2·3 + 1    = 7
f(−1) = 2·(−1) + 1 = −2 + 1 = −1</div>
<div class="ans">Jawaban: f(3) = 7, f(−1) = −1</div></div>
<div class="rule">Syarat sebuah fungsi: <mark>setiap input menghasilkan tepat satu output</mark>. Dua input boleh memberi output yang sama, tapi satu input tidak boleh memberi dua output.</div>
<p>Contoh: g(x) = x² memberi g(2) = 4 dan g(−2) = 4. Itu boleh, karena tiap input tetap punya satu output. Sebaliknya, "orang → nomor HP-nya" bukan fungsi kalau ada orang yang punya dua nomor.</p>

<h2>Tabel dan grafik</h2>
<p>Cara paling jujur memahami fungsi: masukkan beberapa angka dan catat hasilnya.</p>
<div class="tbl"><table><tr><th>x</th><td>−2</td><td>−1</td><td>0</td><td>1</td><td>2</td><td>3</td></tr>
<tr><th>f(x) = 2x + 1</th><td>−3</td><td>−1</td><td>1</td><td>3</td><td>5</td><td>7</td></tr>
<tr><th>g(x) = x²</th><td>4</td><td>1</td><td>0</td><td>1</td><td>4</td><td>9</td></tr></table></div>
<p>Setiap pasangan (x, f(x)) adalah satu titik di bidang. Titik-titik dari f berjajar di satu <b>garis lurus</b>. Titik-titik dari g membentuk lengkungan berbentuk U yang disebut <b>parabola</b>.</p>
<pre>  g(x)=x²                       f(x)=2x+1
 9 |              •           7 |            •
 4 | •         •              5 |         •
 1 |   •    •                 3 |      •
 0 +------•------             1 |   •
   -2 -1  0  1  2  3         -1 +•-----------
                                -1  0  1  2  3</pre>
<p>Uji garis tegak: tarik garis vertikal di mana saja. Kalau grafik itu fungsi, garis vertikal memotongnya paling banyak sekali. Buku <i>Book of Proof</i> menyebut ini sebagai inti definisi fungsi (Definisi 12.1).</p>

<h2>Fungsi di dalam fungsi</h2>
<p>Mesin bisa disambung. Kalau h(x) = g(f(x)), artinya masukkan x ke f, lalu hasilnya ke g.</p>
<div class="ex"><div class="q">f(x) = 2x + 1, g(x) = x². Hitung g(f(3)).</div>
<div class="step">Dalam dulu: f(3) = 7
Lalu luar:  g(7) = 49</div>
<div class="ans">Jawaban: 49</div></div>
<p>Jaringan saraf adalah <b>tumpukan fungsi</b> seperti ini: lapis 1, lalu lapis 2, lalu lapis 3. Cara menurunkan fungsi bertumpuk (aturan rantai, Lapis 2) adalah mesin di balik backpropagation.</p>

<h2>Periksa dengan Python</h2>
<pre><code>def f(x):
    return 2*x + 1

def g(x):
    return x**2

print([f(x) for x in [-2, -1, 0, 1, 2, 3]])  # [-3, -1, 1, 3, 5, 7]
print([g(x) for x in [-2, -1, 0, 1, 2, 3]])  # [4, 1, 0, 1, 4, 9]
print(g(f(3)))                               # 49</code></pre>
`,
  src: [
    "Hammack, <i>Book of Proof</i> 3e, §12.1 “Functions”, Definisi 12.1 (hlm. 224). Lokal.",
    "OpenStax, <i>Intermediate Algebra 2e</i>, Bab 3 “Graphs and Functions” (gratis online).",
    "Thompson, <i>Calculus Made Easy</i>: fungsi sebagai “variabel yang bergantung”, dipakai lagi di Lapis 2. Lokal."
  ]
};

/* ───────────────────────── 1.4 ───────────────────────── */
window.LESSONS["1.4"] = {
  title: "Garis y = mx + b",
  pre: "1.3, 0.7 laju perubahan", min: 0,
  why: "Regresi linear menebak data dengan sebuah garis. Satu neuron tanpa fungsi aktivasi juga hanya garis. Kemiringan garis (m) adalah turunan versi paling sederhana, dan turunan adalah alat yang dipakai AI untuk belajar.",
  body: `
<h2>Dua angka menentukan satu garis</h2>
<p>Setiap garis lurus (kecuali yang tegak) bisa ditulis <code>y = mx + b</code>.</p>
<ul><li><b>b</b> = <b>titik potong</b> (intercept): nilai y ketika x = 0, tempat garis memotong sumbu tegak.</li>
<li><b>m</b> = <b>kemiringan</b> (slope): berapa y naik setiap x maju satu langkah.</li></ul>
<div class="rule"><mark>m = (perubahan y) ÷ (perubahan x) = (y₂ − y₁) ÷ (x₂ − x₁)</mark>. Ini persis "laju perubahan" dari pelajaran 0.7.</div>
<p>Kalau m positif, garis naik ke kanan. Kalau m negatif, garis turun. Kalau m = 0, garis datar. Makin besar m (tanpa melihat tanda), makin curam.</p>

<h2>Mencari garis dari dua titik</h2>
<div class="ex"><div class="q">Garis melewati (1, 3) dan (3, 7). Cari persamaannya.</div>
<div class="step">Kemiringan: m = (7 − 3) ÷ (3 − 1) = 4 ÷ 2 = 2
Cari b: masukkan titik (1, 3) ke y = 2x + b
        3 = 2·1 + b  →  b = 1
Cek titik kedua: 2·3 + 1 = 7  ✓</div>
<div class="ans">Jawaban: y = 2x + 1</div></div>
<div class="ex"><div class="q">Garis melewati (0, 9) dan (4, 1). Cari persamaannya.</div>
<div class="step">m = (1 − 9) ÷ (4 − 0) = −8 ÷ 4 = −2
Titik (0, 9) langsung memberi b = 9</div>
<div class="ans">Jawaban: y = −2x + 9 (garis turun)</div></div>

<h2>Membaca garis di data nyata</h2>
<p>Buku <i>Regression and Other Stories</i> (§3.3) memakai contoh rekor dunia lari satu mil. Garis yang cocok dengan datanya punya kemiringan −0,39: setiap tahun, rekor rata-rata turun sekitar 0,39 detik. Kemiringan adalah <b>cerita</b> yang dibawa garis.</p>
<p>Hati-hati: garis yang cocok di dalam rentang data belum tentu benar di luarnya. Kalau garis rekor itu ditarik terus ke masa depan, suatu saat rekornya jadi nol detik, yang jelas mustahil. Ini pelajaran awal tentang batas model.</p>

<h2>Dari garis ke neuron</h2>
<p>Bandingkan <code>y = mx + b</code> dengan neuron <code>y = w·x + b</code>. Bentuknya sama! Bobot w adalah kemiringan. Melatih satu neuron pada data artinya <b>memilih garis</b> yang paling dekat ke titik-titik data. Bagaimana mengukur "paling dekat" dan bagaimana mencarinya adalah isi proyek bangun pertama kita (regresi linear, Lapis 3).</p>

<h2>Periksa dengan Python</h2>
<pre><code>x1, y1, x2, y2 = 1, 3, 3, 7
m = (y2 - y1) / (x2 - x1)
b = y1 - m * x1
print(m, b)          # 2.0 1.0
print(m * 5 + b)     # 11.0  (tebakan y saat x = 5)</code></pre>
`,
  src: [
    "Gelman, Hill & Vehtari, <i>Regression and Other Stories</i>, §3.3 “Graphing a line” (hlm. 37), termasuk contoh rekor lari satu mil. Lokal.",
    "Boyd & Vandenberghe, <i>Introduction to Applied Linear Algebra</i> (VMLS), Bab 2 “Linear functions”. Lokal: <code>Boyd_Vandenberghe_..._VMLS_GRATIS.pdf</code>.",
    "OpenStax, <i>Elementary Algebra 2e</i>, Bab 4 “Graphs” (kemiringan dan titik potong; gratis online)."
  ]
};

/* ───────────────────────── 1.5 ───────────────────────── */
window.LESSONS["1.5"] = {
  title: "Kuadrat, eksponen, dan logaritma",
  pre: "0.4 pangkat dan akar, 1.3", min: 0,
  why: "Kuadrat muncul di fungsi kesalahan (selisih dikuadratkan). Eksponen e^x ada di softmax, yang mengubah skor jadi peluang di setiap chatbot. Logaritma ada di cross-entropy, fungsi kesalahan hampir semua classifier dan LLM. Tiga fungsi ini muncul di hampir setiap halaman paper AI.",
  body: `
<h2>Kuadrat: hukuman yang makin berat</h2>
<p>Fungsi x² kamu lihat di 1.3 berbentuk U. Sifat pentingnya: hasilnya <b>tidak pernah negatif</b>, dan tumbuh makin cepat. Salah 1 → hukuman 1. Salah 2 → hukuman 4. Salah 10 → hukuman 100.</p>
<p>Karena itu AI sering mengukur kesalahan dengan kuadrat selisih: tebakan meleset ke atas atau ke bawah sama-sama dihukum, dan meleset jauh dihukum jauh lebih berat.</p>

<h2>Aturan pangkat</h2>
<p>Ingat dari 0.4: 2³ = 2 × 2 × 2. Dari arti "perkalian berulang", aturan berikut bisa kamu turunkan sendiri:</p>
<div class="rule"><mark>aᵐ · aⁿ = aᵐ⁺ⁿ</mark> &nbsp; <mark>(aᵐ)ⁿ = aᵐⁿ</mark> &nbsp; <mark>a⁰ = 1</mark> &nbsp; <mark>a⁻ⁿ = 1 ÷ aⁿ</mark></div>
<div class="ex"><div class="q">Hitung 2³ · 2⁴ dan (2³)².</div>
<div class="step">2³ · 2⁴ = (2·2·2)·(2·2·2·2) = 2⁷ = 128
(2³)² = 2³ · 2³ = 2⁶ = 64</div>
<div class="ans">Jawaban: 128 dan 64</div></div>
<p>Kenapa 2⁰ = 1? Lihat pola: 2³ = 8, 2² = 4, 2¹ = 2. Tiap turun satu pangkat, hasilnya dibagi 2. Turun sekali lagi: 2 ÷ 2 = 1. Turun lagi: 1 ÷ 2 = 0,5 = 2⁻¹. Jadi aturan itu bukan hafalan, melainkan kelanjutan pola.</p>

<h2>Eksponen: tumbuh dengan melipat</h2>
<p>Fungsi 2ˣ berlipat dua setiap x naik satu: 1, 2, 4, 8, 16, ... Sesudah 10 langkah sudah 1024. Inilah pertumbuhan eksponensial: awalnya lambat, lalu meledak.</p>
<p>Ada satu bilangan dasar istimewa: <b>e ≈ 2,71828</b>. Asalnya dari bunga bank. Tabung 1 rupiah dengan bunga 100% setahun. Kalau bunga dihitung n kali setahun, uang akhirnya (1 + 1/n)ⁿ:</p>
<div class="tbl"><table><tr><th>dihitung berapa kali</th><td>1</td><td>2</td><td>12 (bulanan)</td><td>365 (harian)</td><td>1.000.000</td></tr>
<tr><th>uang akhir</th><td>2</td><td>2,25</td><td>2,6130</td><td>2,7146</td><td>2,71828</td></tr></table></div>
<p>Makin sering dihitung, hasilnya mendekati satu batas, yaitu e. Fungsi eˣ (ditulis juga exp(x)) adalah eksponen "alami", dan itulah yang dipakai AI.</p>

<h2>Logaritma: eksponen yang dibalik</h2>
<p>Logaritma menjawab pertanyaan: <b>"pangkat berapa?"</b></p>
<div class="rule"><mark>log₂ 8 = 3</mark> karena 2³ = 8. &nbsp; <mark>log₁₀ 1000 = 3</mark> karena 10³ = 1000. &nbsp; ln x adalah log dengan dasar e, jadi ln e = 1.</div>
<div class="ex"><div class="q">Hitung log₂ 1024.</div>
<div class="step">Cari pangkat 2 yang menghasilkan 1024.
2¹⁰ = 1024</div>
<div class="ans">Jawaban: 10</div></div>
<p>Sifat paling penting: logaritma <b>mengubah perkalian jadi penjumlahan</b>.</p>
<div class="rule"><mark>log(a · b) = log a + log b</mark></div>
<div class="ex"><div class="q">Cek dengan log₁₀(100 · 1000).</div>
<div class="step">Kiri:  log₁₀(100.000) = 5
Kanan: log₁₀ 100 + log₁₀ 1000 = 2 + 3 = 5  ✓</div>
<div class="ans">Sama</div></div>
<p>Kenapa ini penting? Peluang sebuah kalimat panjang adalah hasil kali banyak peluang kecil, misalnya 0,1 × 0,2 × 0,05 × ... Angkanya cepat jadi terlalu kecil untuk komputer. Dengan logaritma, perkalian itu jadi penjumlahan yang aman. Karena itu LLM bekerja dengan "log-probability".</p>
<p>Satu fakta lagi: ln dari bilangan antara 0 dan 1 selalu negatif. ln 0,9 ≈ −0,105, sedangkan ln 0,1 ≈ −2,303. Makin kecil peluangnya, makin besar negatifnya. Cross-entropy memakai −ln(peluang jawaban benar) sebagai hukuman: yakin dan benar → hukuman kecil, yakin tapi salah → hukuman besar.</p>

<h2>Sekilas softmax</h2>
<p>Model memberi skor mentah, misalnya [2, 1, 0] untuk tiga kata. Softmax mengubahnya jadi peluang: hitung e pangkat tiap skor, lalu bagi dengan jumlahnya. Hasilnya kira-kira [0,665; 0,245; 0,090], dan totalnya 1. (Catatan penulisan: karena koma dipakai untuk desimal, angka berdesimal di dalam kurung siku dipisah titik koma. Jadi [0,665; 0,245; 0,090] berisi tiga angka. Matriks ditulis sebagai daftar baris: [[1; 2]; [3; 4]] berarti baris pertama 1 dan 2, baris kedua 3 dan 4.) Detailnya nanti; sekarang cukup lihat bahwa eˣ selalu positif, jadi cocok untuk membuat peluang.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import math
for n in [1, 2, 12, 365, 1_000_000]:
    print(n, (1 + 1/n) ** n)
# 1 2.0
# 2 2.25
# 12 2.613035290224676
# 365 2.7145674820219727
# 1000000 2.7182804690957534
print(math.e)                    # 2.718281828459045
print(math.log2(1024))           # 10.0
print(math.log(0.9), math.log(0.1)) # -0.10536051565782628 -2.3025850929940455

skor = [2, 1, 0]
ex = [math.exp(s) for s in skor]
print([v / sum(ex) for v in ex]) # sekitar [0.665, 0.245, 0.090]</code></pre>
`,
  src: [
    "Gelman, Hill & Vehtari, <i>Regression and Other Stories</i>, §3.4 “Exponential and power-law growth and decline; logarithmic and log-log relationships” dan §12.4 “Logarithmic transformations”. Lokal.",
    "OpenStax, <i>Intermediate Algebra 2e</i>, Bab 10 “Exponential and Logarithmic Functions” (gratis online).",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §6.2.2.3 “Softmax Units” dan §4.1 (underflow, alasan memakai log). Lokal. Baca nanti, setelah Lapis 2."
  ]
};

/* ───────────────────────── 1.6 ───────────────────────── */
window.LESSONS["1.6"] = {
  title: "Notasi Σ dan rata-rata",
  pre: "1.1", min: 0,
  why: "Hampir setiap rumus di paper AI punya simbol Σ. Fungsi kesalahan yang dikecilkan saat melatih model adalah rata-rata kesalahan di semua data. Kalau Σ terasa asing, rumus AI akan terlihat seperti sandi. Kalau sudah akrab, ternyata isinya cuma \"jumlahkan semuanya\".",
  body: `
<h2>Σ hanyalah perintah menjumlah</h2>
<p>Σ (huruf Yunani sigma, setara huruf S untuk "sum") adalah singkatan untuk penjumlahan panjang.</p>
<div class="big">Σᵢ₌₁⁴ xᵢ = x₁ + x₂ + x₃ + x₄</div>
<p>Cara membacanya: "untuk i dari 1 sampai 4, jumlahkan xᵢ". Huruf i adalah penghitung yang naik satu per satu. xᵢ artinya data ke-i.</p>
<div class="ex"><div class="q">Data x = [3, 5, 7, 9]. Hitung Σᵢ₌₁⁴ xᵢ.</div>
<div class="step">x₁ + x₂ + x₃ + x₄ = 3 + 5 + 7 + 9</div>
<div class="ans">Jawaban: 24</div></div>
<div class="ex"><div class="q">Hitung Σᵢ₌₁⁵ i².</div>
<div class="step">Di sini yang dijumlah adalah i² sendiri:
1² + 2² + 3² + 4² + 5² = 1 + 4 + 9 + 16 + 25</div>
<div class="ans">Jawaban: 55</div></div>
<div class="rule">Konstanta bisa keluar dari Σ: <mark>Σ c·xᵢ = c · Σ xᵢ</mark>. Itu sifat distributif dari 1.1, hanya ditulis lebih ringkas.</div>

<h2>Rata-rata</h2>
<p>Rata-rata (mean) adalah jumlah dibagi banyaknya data. Simbolnya sering x̄ (dibaca "x bar").</p>
<div class="big">x̄ = (1/n) · Σᵢ₌₁ⁿ xᵢ</div>
<div class="ex"><div class="q">Rata-rata [3, 5, 7, 9]?</div>
<div class="step">Jumlah 24, banyak data n = 4
24 ÷ 4 = 6</div>
<div class="ans">Jawaban: x̄ = 6</div></div>

<h2>Rata-rata sebagai titik seimbang</h2>
<p>Hitung jarak tiap data dari rata-ratanya (xᵢ − x̄): 3 − 6 = −3, 5 − 6 = −1, 7 − 6 = 1, 9 − 6 = 3. Jumlahkan: −3 − 1 + 1 + 3 = <b>0</b>.</p>
<p>Ini selalu terjadi, untuk data apa pun. Bayangkan data sebagai beban di sebuah papan: rata-rata adalah titik tumpu tempat papan seimbang. Fakta ini akan dipakai lagi di varians (1.7).</p>

<h2>Rata-rata berbobot</h2>
<p>Kadang tiap data punya bobot. Nilai rapor: tugas 80 (bobot 2), UTS 70 (bobot 3), UAS 90 (bobot 5).</p>
<div class="ex"><div class="q">Hitung nilai akhir berbobot.</div>
<div class="step">Σ bobot × nilai = 2·80 + 3·70 + 5·90 = 160 + 210 + 450 = 820
Σ bobot = 2 + 3 + 5 = 10
820 ÷ 10 = 82</div>
<div class="ans">Jawaban: 82 (rata-rata biasa hanya 80)</div></div>
<p>Rata-rata berbobot adalah bentuk dasar <b>attention</b> di Transformer: keluaran adalah rata-rata berbobot dari banyak informasi, dan bobotnya dihitung softmax (1.5).</p>

<h2>Periksa dengan Python</h2>
<pre><code>x = [3, 5, 7, 9]
print(sum(x), sum(x) / len(x))           # 24 6.0
print(sum(i**2 for i in range(1, 6)))    # 55
xbar = sum(x) / len(x)
print(sum(xi - xbar for xi in x))        # 0.0

nilai, bobot = [80, 70, 90], [2, 3, 5]
print(sum(w*v for w, v in zip(bobot, nilai)) / sum(bobot))  # 82.0</code></pre>
`,
  src: [
    "Boyd & Vandenberghe, VMLS, §2.1 contoh “Average” (hlm. 32) dan §1.4 (hlm. 20): rata-rata sebagai hasil kali titik dengan vektor (1/n). Lokal.",
    "Gelman, Hill & Vehtari, <i>Regression and Other Stories</i>, §3.1 “Weighted averages”. Lokal.",
    "Wasserman, <i>All of Statistics</i>, §3.3, rumus (3.9) rata-rata sampel (hlm. 51). Lokal. Baca nanti di S2."
  ]
};

/* ───────────────────────── 1.7 ───────────────────────── */
window.LESSONS["1.7"] = {
  title: "Varians dan simpangan baku",
  pre: "1.6", min: 0,
  why: "Rata-rata saja menyembunyikan banyak hal. Varians mengukur seberapa menyebar data. Di AI, data hampir selalu dinormalkan pakai rata-rata dan simpangan baku sebelum masuk model, dan BatchNorm serta LayerNorm melakukan hal yang sama di dalam jaringan. Ketidakpastian prediksi juga diukur dengan varians.",
  body: `
<h2>Rata-rata sama, cerita berbeda</h2>
<p>Dua kelas, masing-masing tiga siswa:</p>
<ul><li>Kelas A: 48, 50, 52</li><li>Kelas B: 10, 50, 90</li></ul>
<p>Rata-rata keduanya 50. Tapi kelas A rapat, sedangkan kelas B tersebar jauh. Kita butuh angka yang mengukur sebaran.</p>

<h2>Membangun varians langkah demi langkah</h2>
<p>Ide pertama: rata-ratakan jarak tiap data ke rata-rata. Tapi di 1.6 kita tahu jumlah (xᵢ − x̄) selalu 0, karena yang positif dan negatif saling menghapus. Solusinya: <b>kuadratkan</b> dulu, supaya semua positif (ingat 1.5).</p>
<div class="rule"><mark>Varians = rata-rata dari (xᵢ − x̄)²</mark>. &nbsp; <mark>Simpangan baku = √varians</mark>, supaya satuannya kembali sama dengan data.</div>
<div class="ex"><div class="q">Data [2, 4, 4, 4, 5, 5, 7, 9]. Hitung varians dan simpangan baku.</div>
<div class="step">1. Rata-rata: (2+4+4+4+5+5+7+9) ÷ 8 = 40 ÷ 8 = 5
2. Selisih:   −3, −1, −1, −1, 0, 0, 2, 4
3. Kuadrat:    9,  1,  1,  1, 0, 0, 4, 16
4. Jumlah:    32
5. Varians:   32 ÷ 8 = 4
6. Simpangan baku: √4 = 2</div>
<div class="ans">Jawaban: varians 4, simpangan baku 2</div></div>
<p>Untuk kelas tadi, simpangan baku kelas A ≈ 1,63 dan kelas B ≈ 32,66. Angka ini menangkap apa yang mata kita lihat.</p>

<h2>Bagi n atau n − 1?</h2>
<p>Kamu akan menemukan dua versi rumus, dan keduanya benar untuk tujuan berbeda:</p>
<ul><li><b>Bagi n</b>: kalau data itu adalah <b>seluruh</b> yang ingin kamu gambarkan. Buku VMLS mendefinisikan std(x) dengan cara ini (§3.3, hlm. 52).</li>
<li><b>Bagi n − 1</b> (varians sampel): kalau data hanya <b>sampel</b> dan kamu ingin menebak sebaran populasi di baliknya. Wasserman memakai ini (rumus 3.10, hlm. 51) dan membuktikan di Teorema 3.17 bahwa versi n − 1 rata-rata tepat sasaran.</li></ul>
<p>Untuk data di atas, versi n − 1 memberi 32 ÷ 7 ≈ 4,571 dan simpangan baku ≈ 2,138. Alasan lengkapnya ada di modul statistika S2. Untuk sekarang, cukup tahu bahwa keduanya ada, dan selalu cek mana yang dipakai.</p>

<h2>Standarisasi: skor z</h2>
<p>Kalau setiap data dikurangi rata-rata lalu dibagi simpangan baku, hasilnya disebut <b>skor z</b>. Skor z berkata "data ini berapa simpangan baku dari rata-rata".</p>
<div class="ex"><div class="q">Skor z dari 9 di data tadi (rata-rata 5, simpangan baku 2)?</div>
<div class="step">(9 − 5) ÷ 2 = 4 ÷ 2</div>
<div class="ans">Jawaban: z = 2 (dua simpangan baku di atas rata-rata)</div></div>
<p>Data yang sudah distandarisasi punya rata-rata 0 dan simpangan baku 1. Model AI belajar jauh lebih lancar dengan input seperti ini, karena fitur yang skalanya sangat berbeda (luas rumah ratusan m² dan jumlah kamar 1–5) jadi setara.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
d = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print(d.mean())              # 5.0
print(np.var(d), np.std(d))  # 4.0 2.0      (bagi n, bawaan NumPy)
print(np.var(d, ddof=1))     # 4.571...     (bagi n - 1)
print((d - d.mean()) / d.std())
# [-1.5 -0.5 -0.5 -0.5  0.   0.   1.   2. ]</code></pre>
<p>Perhatikan: <code>np.var</code> secara bawaan membagi n, sedangkan banyak paket statistik lain membagi n − 1. Ini sumber selisih angka yang sering membingungkan.</p>
`,
  src: [
    "Boyd & Vandenberghe, VMLS, §3.3 “Standard deviation” (hlm. 52–56): definisi bagi n (hlm. 52) dan standarisasi (sekitar hlm. 55–56). Lokal.",
    "Wasserman, <i>All of Statistics</i>, §3.3 “Variance and Covariance”: Definisi 3.14, rumus (3.10), Teorema 3.17 (hlm. 51–52). Lokal.",
    "Grinstead & Snell, <i>Introduction to Probability</i>, §6.2 “Variance of Discrete Random Variables”, Definisi 6.3 (hlm. 257). Lokal.",
    "OpenStax, <i>Introductory Statistics 2e</i>, Bab 2 “Descriptive Statistics” (gratis online)."
  ]
};

/* ───────────────────────── 1.8 ───────────────────────── */
window.LESSONS["1.8"] = {
  title: "Vektor dan hasil kali titik",
  pre: "1.6, 0.6 jarak", min: 0,
  why: "Bagi AI, semuanya adalah vektor: gambar adalah vektor piksel, kata adalah vektor embedding, dan bobot neuron adalah vektor. Hasil kali titik adalah operasi yang paling sering dijalankan di seluruh AI. Neuron menghitungnya, dan attention di GPT memakainya untuk mengukur kemiripan kata.",
  body: `
<h2>Vektor adalah daftar angka yang berurutan</h2>
<p>Rumah bisa diringkas jadi daftar: [luas 70 m², 2 kamar, 15 tahun]. Daftar angka berurutan seperti ini disebut <b>vektor</b>. Banyaknya angka disebut <b>dimensi</b>; contoh ini vektor berdimensi 3.</p>
<p>Urutan penting: [70, 2, 15] berbeda dari [2, 70, 15]. Vektor berdimensi 2 bisa digambar sebagai panah dari titik (0, 0). Vektor [3, 4] adalah panah ke titik (3, 4).</p>

<h2>Menjumlah dan mengali vektor</h2>
<div class="rule">Jumlah dua vektor: jumlahkan <b>per posisi</b>. Kali bilangan: kalikan <b>setiap</b> isinya.</div>
<div class="ex"><div class="q">u = [1, 2, 3], v = [4, 5, 6]. Hitung u + v dan 2u.</div>
<div class="step">u + v = [1+4, 2+5, 3+6] = [5, 7, 9]
2u    = [2·1, 2·2, 2·3] = [2, 4, 6]</div>
<div class="ans">Jawaban: [5, 7, 9] dan [2, 4, 6]</div></div>

<h2>Panjang vektor</h2>
<p>Panjang panah [3, 4] dihitung dengan Pythagoras dari 0.6: √(3² + 4²) = √25 = 5. Panjang ini disebut <b>norma</b>, ditulis ‖v‖.</p>

<h2>Hasil kali titik (dot product)</h2>
<div class="rule"><mark>u · v = u₁v₁ + u₂v₂ + ... + uₙvₙ = Σᵢ uᵢvᵢ</mark>. Kalikan per posisi, lalu jumlahkan. Hasilnya <b>satu angka</b>.</div>
<div class="ex"><div class="q">[1, 2, 3] · [4, 5, 6] = ?</div>
<div class="step">1·4 + 2·5 + 3·6 = 4 + 10 + 18</div>
<div class="ans">Jawaban: 32</div></div>
<p>Ini sudah kamu kenal! Rata-rata berbobot di 1.6 adalah hasil kali titik antara vektor bobot dan vektor nilai. Dan neuron:</p>
<div class="ex"><div class="q">Neuron dengan bobot w = [0,2; −0,5; 1,0], bias b = 0,1, input x = [3, 1, 2]. Hitung w · x + b.</div>
<div class="step">w · x = 0,2·3 + (−0,5)·1 + 1,0·2 = 0,6 − 0,5 + 2,0 = 2,1
tambah bias: 2,1 + 0,1</div>
<div class="ans">Jawaban: 2,2</div></div>
<p>Rumus <code>y = w·x + b</code> dari 1.1 ternyata berlaku juga ketika x dan w adalah vektor. Neuron dengan seribu input tetap hanya satu hasil kali titik.</p>

<h2>Hasil kali titik mengukur kesearahan</h2>
<p>Lihat tiga pasangan:</p>
<ul><li>[1, 0] · [1, 1] = 1 → searah sebagian (sudut 45°)</li>
<li>[1, 0] · [0, 1] = 0 → tegak lurus, tidak berhubungan</li>
<li>[1, 2] · [−1, −2] = −5 → berlawanan arah</li></ul>
<div class="rule"><mark>u · v = ‖u‖ · ‖v‖ · cos θ</mark>, dengan θ sudut antara keduanya. Positif berarti searah, nol berarti tegak lurus, negatif berarti berlawanan.</div>
<p>Inilah ide di balik attention: setiap kata diubah jadi vektor, lalu hasil kali titik antar vektor mengukur "seberapa nyambung" dua kata. Kata yang vektornya searah mendapat perhatian lebih.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
u, v = np.array([1, 2, 3]), np.array([4, 5, 6])
print(u + v, 2 * u)           # [5 7 9] [2 4 6]
print(u @ v)                  # 32   (@ = hasil kali titik)
print(np.linalg.norm([3, 4])) # 5.0

w, x = np.array([0.2, -0.5, 1.0]), np.array([3, 1, 2])
print(w @ x + 0.1)            # 2.2</code></pre>
`,
  src: [
    "Boyd & Vandenberghe, VMLS, Bab 1 “Vectors” (§1.1 hlm. 3; §1.4 “Inner product” hlm. 19) dan Bab 3 “Norm and distance” (hlm. 45). Lokal. Buku pemula terbaik untuk lapis ini.",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §3.2 “Inner Products” (hlm. 72). Lokal.",
    "Vaswani dkk. (2017), “Attention Is All You Need”, §3.2.1: attention memakai hasil kali titik. Lokal. Baca nanti, di proyek B5."
  ]
};

/* ───────────────────────── 1.9 ───────────────────────── */
window.LESSONS["1.9"] = {
  title: "Python dan NumPy untuk matematika",
  pre: "1.6–1.8", min: 0,
  why: "Semua AI modern ditulis di atas pustaka array: NumPy, PyTorch, JAX. Cara berpikirnya sama, yaitu menghitung satu vektor sekaligus, bukan satu angka per langkah. Kalau NumPy sudah nyaman, membaca kode nanoGPT atau micrograd tinggal soal waktu.",
  body: `
<h2>Kenapa tidak pakai list biasa?</h2>
<p>List Python bisa menyimpan angka, tapi tidak mengerti matematika vektor. <code>[1, 2] + [3, 4]</code> menghasilkan <code>[1, 2, 3, 4]</code> (disambung), bukan [4, 6]. NumPy memberi tipe <b>array</b> yang berperilaku seperti vektor di 1.8.</p>
<pre><code>import numpy as np
print([1, 2] + [3, 4])                      # [1, 2, 3, 4]
print(np.array([1, 2]) + np.array([3, 4]))  # [4 6]</code></pre>

<h2>Vektorisasi: satu baris untuk semua data</h2>
<p>Paper resmi NumPy (Harris dkk., <i>Nature</i> 2020) menyebut ini <b>vektorisasi</b>: operasi ditulis untuk seluruh array, dan perulangannya dijalankan di dalam kode C yang cepat.</p>
<pre><code>import numpy as np
x = np.array([3, 5, 7, 9])
print(x * 2)        # [ 6 10 14 18]
print(x ** 2)       # [ 9 25 49 81]
print(x.sum())      # 24      (Σ dari 1.6)
print(x.mean())     # 6.0
print(x - x.mean()) # [-3. -1.  1.  3.]</code></pre>
<p>Bandingkan dengan pelajaran 1.6: setiap rumus di sana kini satu baris.</p>

<h2>Rumus jadi kode, hampir huruf per huruf</h2>
<div class="ex"><div class="q">Tulis varians (bagi n) tanpa memakai np.var, lalu bandingkan.</div>
<div class="step">Rumus:  rata-rata dari (xᵢ − x̄)²
Kode:   ((d - d.mean()) ** 2).mean()</div>
<div class="ans">Hasilnya 4.0, sama dengan np.var(d)</div></div>
<pre><code>import numpy as np
d = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print(((d - d.mean()) ** 2).mean(), np.var(d))   # 4.0 4.0</code></pre>

<h2>Neuron untuk banyak rumah sekaligus</h2>
<p>Setiap baris adalah satu rumah: [luas dalam puluhan m², jumlah kamar]. Bobot w = [3, 5], bias b = 10.</p>
<pre><code>import numpy as np
X = np.array([[7, 2],
              [10, 3],
              [5, 1]])
w = np.array([3, 5])
b = 10
print(X @ w + b)    # [41 55 30]</code></pre>
<div class="ex"><div class="q">Cek baris pertama dengan tangan.</div>
<div class="step">3·7 + 5·2 + 10 = 21 + 10 + 10</div>
<div class="ans">41 ✓</div></div>
<p><code>X @ w</code> menghitung hasil kali titik w dengan <b>setiap baris</b>. Inilah "perkalian matriks dengan vektor", tema utama Lapis 2. Satu lapis jaringan saraf persis seperti ini, hanya dengan lebih banyak kolom dan baris.</p>

<h2>Fungsi matematika bawaan</h2>
<pre><code>import numpy as np
print(np.exp([2, 1, 0]))          # [7.3890561  2.71828183 1.        ]
print(np.log([1, np.e, 10]))      # [0.         1.         2.30258509]
s = np.exp([2, 1, 0])
print(s / s.sum())                # softmax dari 1.5: [0.66524096 0.24472847 0.09003057]</code></pre>

<h2>Cara memasang dan menjalankan</h2>
<p>Kalau sudah ada Python, jalankan <code>pip install numpy</code> di terminal. Cara lain tanpa memasang apa pun: buka <b>Google Colab</b> di browser, karena NumPy sudah tersedia di sana. Ketik ulang kode di halaman ini, jangan disalin-tempel, supaya jari dan kepala ikut belajar.</p>
`,
  src: [
    "Harris dkk. (2020), “Array programming with NumPy”, <i>Nature</i> 585: 357–362. Lokal: <code>Harris_dkk_Array_programming_with_NumPy.pdf</code>.",
    "VanderPlas, <i>Python Data Science Handbook</i>, Bab 2 “Introduction to NumPy” (gratis online di jakevdp.github.io/PythonDataScienceHandbook).",
    "Dokumentasi resmi: numpy.org/doc, bagian “NumPy: the absolute basics for beginners”."
  ]
};
