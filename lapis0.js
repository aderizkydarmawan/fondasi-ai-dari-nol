window.LESSONS = window.LESSONS || {};

/* ───────────────────────── 0.1 ───────────────────────── */
window.LESSONS["0.1"] = {
  title: "Bilangan dan garis bilangan",
  pre: "tidak ada", min: 25,
  why: "Semua AI, dari ChatGPT sampai pembuat gambar, hanya melakukan tambah, kurang, kali, dan bagi pada angka, diulang miliaran kali. Banyak angka di dalamnya negatif. Kalau empat operasi ini kamu kuasai dengan yakin, kamu memegang atom dari semua model AI.",
  body: `
<h2>Garis bilangan: peta semua angka</h2>
<p>Bayangkan jalan lurus yang panjangnya tak terbatas. Di tengahnya ada <b>0</b>. Ke kanan, angkanya makin besar: 1, 2, 3, dan seterusnya. Ke kiri ada <b>bilangan negatif</b>: −1, −2, −3, dan seterusnya.</p>
<pre>  ... −4   −3   −2   −1    0    1    2    3    4 ...
  ──┼────┼────┼────┼────┼────┼────┼────┼────┼──
       ← makin kecil                makin besar →</pre>
<p>Bilangan negatif ada di sekitar kita. Suhu −5 °C artinya lima derajat di bawah nol. Saldo −20.000 artinya kamu berutang. Harga saham berubah −3 artinya turun tiga.</p>
<p>Satu hal yang sering terbalik: <b>−5 lebih kecil dari −2</b>, karena −5 letaknya lebih ke kiri. Suhu −5 °C lebih dingin daripada −2 °C.</p>

<h2>Tambah dan kurang adalah berjalan</h2>
<div class="rule"><b>Menambah</b> berarti berjalan ke <b>kanan</b>. <b>Mengurangi</b> berarti berjalan ke <b>kiri</b>.</div>
<div class="ex"><div class="q">Hitung 2 − 5.</div>
<div class="step">Mulai di 2.
Jalan 5 langkah ke kiri: 1, 0, −1, −2, −3.</div>
<div class="ans">Jawaban: −3</div></div>
<div class="ex"><div class="q">Hitung −4 + 6.</div>
<div class="step">Mulai di −4.
Jalan 6 langkah ke kanan: −3, −2, −1, 0, 1, 2.</div>
<div class="ans">Jawaban: 2</div></div>

<h2>Mengurangi bilangan negatif</h2>
<p>Apa arti 3 − (−2)? Pakai cerita utang. Kamu punya uang 3 ribu dan utang 2 ribu (yaitu −2). Lalu temanmu <b>menghapus</b> utang itu. Menghapus utang sama dengan menambah kekayaanmu 2 ribu.</p>
<div class="rule">Mengurangi bilangan negatif sama dengan menambah bilangan positif: <mark>a − (−b) = a + b</mark>.</div>
<div class="ex"><div class="q">Hitung −2 − (−8).</div>
<div class="step">−2 − (−8) = −2 + 8
Mulai di −2, jalan 8 ke kanan.</div>
<div class="ans">Jawaban: 6</div></div>

<h2>Kali adalah penjumlahan berulang</h2>
<p>3 × 4 artinya "4, dijumlahkan sebanyak 3 kali": 4 + 4 + 4 = 12. Dengan bilangan negatif, 3 × (−4) = (−4) + (−4) + (−4) = −12. Bayangkan kamu berutang 4 ribu kepada 3 orang.</p>
<p>Lalu kenapa <b>(−3) × (−4) = 12</b>, positif? Lihat pola berikut. Angka di kiri turun satu-satu, dan hasilnya naik 4 setiap baris.</p>
<div class="tbl"><table><tr><th>perkalian</th><th>hasil</th></tr>
<tr><td>3 × (−4)</td><td>−12</td></tr><tr><td>2 × (−4)</td><td>−8</td></tr><tr><td>1 × (−4)</td><td>−4</td></tr><tr><td>0 × (−4)</td><td>0</td></tr>
<tr><td>(−1) × (−4)</td><td><mark>4</mark></td></tr><tr><td>(−2) × (−4)</td><td><mark>8</mark></td></tr><tr><td>(−3) × (−4)</td><td><mark>12</mark></td></tr></table></div>
<p>Supaya pola "naik 4" tidak putus, hasil setelah 0 harus 4, lalu 8, lalu 12. Jadi aturan tanda ini bukan hafalan. Ini satu-satunya pilihan yang membuat hitungan tetap konsisten.</p>
<div class="rule">positif × positif = positif · negatif × negatif = <b>positif</b><br>positif × negatif = negatif · negatif × positif = negatif<br>Pembagian mengikuti aturan tanda yang sama.</div>

<h2>Bagi adalah kebalikan kali</h2>
<p>12 ÷ 4 = 3 karena 3 × 4 = 12. Begitu juga (−12) ÷ (−4) = 3 karena 3 × (−4) = −12.</p>
<p><b>Membagi dengan nol tidak boleh.</b> Kalau 5 ÷ 0 = x, maka x × 0 harus 5. Padahal semua bilangan dikali 0 hasilnya 0. Tidak ada x yang memenuhi, jadi pembagian itu tidak punya arti. Di AI, pembagian dengan nol membuat program menghasilkan <code>nan</code> atau <code>inf</code>. Itu sebabnya banyak rumus AI menambahkan angka sangat kecil seperti 0,00000001 di penyebut.</p>

<div class="ex"><div class="q">Hitung (−20) ÷ 4 dan (−18) ÷ (−3).</div>
<div class="step">(−20) ÷ 4: negatif ÷ positif = negatif, 20 ÷ 4 = 5 → −5
(−18) ÷ (−3): negatif ÷ negatif = positif, 18 ÷ 3 = 6 → 6</div>
<div class="ans">Jawaban: −5 dan 6</div></div>

<h2>Periksa dengan Python</h2>
<p>Buka terminal, ketik <code>python</code>, lalu ketik baris di bawah tanda <code>&gt;&gt;&gt;</code>. Di Python, kali ditulis <code>*</code> dan bagi ditulis <code>/</code>.</p>
<pre><code>&gt;&gt;&gt; 2 - 5
-3
&gt;&gt;&gt; 3 - (-2)
5
&gt;&gt;&gt; (-3) * (-4)
12
&gt;&gt;&gt; (-18) / (-3)
6.0</code></pre>
<p>Hasil <code>6.0</code> sama dengan 6. Python selalu memberi hasil desimal untuk pembagian dengan <code>/</code>.</p>
`,
  src: [
    "OpenStax, <i>Prealgebra 2e</i>, Bab 3 “Integers”: garis bilangan, bilangan negatif, dan aturan tanda (gratis online di openstax.org).",
    "Kenapa (−)×(−) = (+) memakai pola, bukan hafalan: cara berpikir yang sama dipakai Pólya, <i>How to Solve It</i> (1945), bagian “Generalization” dan “Analogy”. Lokal (PDF scan)."
  ]
};

/* ───────────────────────── 0.2 ───────────────────────── */
window.LESSONS["0.2"] = {
  title: "Urutan operasi dan neuron pertamamu",
  pre: "0.1", min: 20,
  why: "Satu neuron di jaringan saraf menghitung \"kalikan setiap input dengan bobotnya, jumlahkan, lalu tambah satu angka\". Kalau urutan operasinya salah, hasilnya salah. Di akhir pelajaran ini kamu akan menghitung satu neuron dengan tangan.",
  body: `
<h2>Masalahnya</h2>
<p>Berapa 2 + 3 × 4? Kalau dihitung dari kiri, (2 + 3) × 4 = 20. Kalau kali dikerjakan duluan, 2 + 12 = 14. Supaya semua orang dan semua komputer di dunia mendapat jawaban yang sama, disepakati satu urutan.</p>
<div class="rule">1. <b>Kurung</b> ( ) dikerjakan paling dulu, dari yang paling dalam.<br>2. <b>Pangkat</b> (dibahas di 0.4).<br>3. <b>Kali dan bagi</b>, dari kiri ke kanan.<br>4. <b>Tambah dan kurang</b>, dari kiri ke kanan.</div>
<p>Jadi 2 + 3 × 4 = 2 + 12 = <b>14</b>.</p>
<p>Kali dan bagi itu <b>setara</b>, jadi dikerjakan dari kiri ke kanan sesuai urutan munculnya. Tambah dan kurang juga setara.</p>

<div class="ex"><div class="q">Hitung 18 − 6 ÷ 3 × 2.</div>
<div class="step">Kali dan bagi dulu, dari kiri: 6 ÷ 3 = 2, lalu 2 × 2 = 4
18 − 4</div>
<div class="ans">Jawaban: 14</div></div>

<div class="ex"><div class="q">Hitung −1 × (2 + (−5)) × 3.</div>
<div class="step">Kurung dulu: 2 + (−5) = −3
−1 × (−3) × 3
Dari kiri: −1 × (−3) = 3, lalu 3 × 3 = 9</div>
<div class="ans">Jawaban: 9</div></div>

<div class="ex"><div class="q">Hitung 10 − (4 − (1 − 3)).</div>
<div class="step">Kurung paling dalam: 1 − 3 = −2
Kurung luar: 4 − (−2) = 4 + 2 = 6
10 − 6</div>
<div class="ans">Jawaban: 4</div></div>

<h2>Neuron pertamamu</h2>
<p>Sebuah neuron buatan menerima beberapa angka (input), mengalikan setiap input dengan <b>bobot</b>-nya, menjumlahkan semuanya, lalu menambah satu angka yang disebut <b>bias</b>.</p>
<div class="big">hasil = (bobot₁ × input₁) + (bobot₂ × input₂) + bias</div>
<p>Bobot menentukan seberapa penting sebuah input. Bobot negatif berarti input itu "menarik" hasil ke bawah. Saat AI "belajar", yang sebenarnya berubah hanyalah angka-angka bobot dan bias ini.</p>
<div class="ex"><div class="q">Bobot 0,5 dan −2, input 3 dan 1, bias 0,1. Hitung hasil neuron.</div>
<div class="step">(0,5 × 3) + (−2 × 1) + 0,1
= 1,5 + (−2) + 0,1     ← kali dulu
= −0,5 + 0,1           ← tambah dari kiri
= −0,4</div>
<div class="ans">Jawaban: −0,4</div></div>
<div class="ex"><div class="q">Bobot 2 dan −3, input −1 dan −2, bias −1.</div>
<div class="step">(2 × −1) + (−3 × −2) + (−1)
= −2 + 6 + (−1)
= 3</div>
<div class="ans">Jawaban: 3</div></div>

<h2>Periksa dengan Python</h2>
<pre><code>&gt;&gt;&gt; 2 + 3 * 4
14
&gt;&gt;&gt; 18 - 6 / 3 * 2
14.0
&gt;&gt;&gt; (0.5 * 3) + (-2 * 1) + 0.1
-0.4</code></pre>
<p>Di Python, koma desimal ditulis dengan <b>titik</b>: <code>0.5</code>, bukan 0,5.</p>
<p>Satu keanehan yang akan sering kamu temui:</p>
<pre><code>&gt;&gt;&gt; 0.1 + 0.2
0.30000000000000004</code></pre>
<p>Komputer menyimpan angka dalam sistem biner (0 dan 1). Angka 0,1 tidak bisa disimpan persis dalam biner, mirip 1/3 yang tidak bisa ditulis persis sebagai desimal (0,3333...). Selisihnya amat kecil. Di AI, hal ini menjadi alasan orang memilih presisi angka dengan hati-hati, misalnya istilah "float32" dan "float16" yang akan kamu dengar nanti.</p>
`,
  src: [
    "OpenStax, <i>Prealgebra 2e</i>, Bab 2 “Introduction to the Language of Algebra”, bagian urutan operasi (gratis online).",
    "McCulloch & Pitts (1943), “A logical calculus of the ideas immanent in nervous activity”: neuron buatan pertama. Lokal. Bacaan sejarah, boleh dibuka kapan saja.",
    "Higham, <i>Accuracy and Stability of Numerical Algorithms</i> 2e, Bab 2 “Floating Point Arithmetic”: kenapa 0.1 + 0.2 tidak persis 0.3. Lokal. Baca nanti di modul K2."
  ]
};

/* ───────────────────────── 0.3 ───────────────────────── */
window.LESSONS["0.3"] = {
  title: "Pecahan, desimal, dan persen",
  pre: "0.1, 0.2", min: 30,
  why: "Peluang adalah pecahan: ChatGPT memilih kata berikutnya dari daftar peluang seperti 0,62 atau 3/5. Laju belajar model ditulis 0,001. Akurasi model ditulis dalam persen. Tiga cara menulis ini akan muncul di setiap pelajaran AI.",
  body: `
<h2>Pecahan adalah bagian dari keseluruhan</h2>
<p>Satu pizza dipotong 8 sama besar, kamu makan 3 potong. Kamu makan <b>3/8</b> pizza. Angka atas (3) disebut <b>pembilang</b>, artinya berapa bagian yang diambil. Angka bawah (8) disebut <b>penyebut</b>, artinya keseluruhan dibagi menjadi berapa bagian.</p>
<p>Pecahan juga berarti pembagian: 3/8 = 3 ÷ 8.</p>

<h2>Pecahan senilai</h2>
<p>1/2 pizza sama banyaknya dengan 2/4 dan 4/8. Kalikan atau bagi pembilang dan penyebut dengan angka yang <b>sama</b>, nilainya tidak berubah.</p>
<div class="ex"><div class="q">Sederhanakan 6/12.</div>
<div class="step">6 dan 12 sama-sama habis dibagi 6.
6 ÷ 6 = 1, 12 ÷ 6 = 2</div>
<div class="ans">Jawaban: 1/2</div></div>

<h2>Menjumlah pecahan</h2>
<p>Pecahan hanya bisa dijumlah kalau potongannya berukuran sama, yaitu <b>penyebutnya sama</b>. Kalau berbeda, samakan dulu.</p>
<div class="ex"><div class="q">Hitung 1/2 + 1/3.</div>
<div class="step">Penyebut yang bisa dipakai keduanya: 6
1/2 = 3/6  (atas dan bawah dikali 3)
1/3 = 2/6  (atas dan bawah dikali 2)
3/6 + 2/6 = 5/6</div>
<div class="ans">Jawaban: 5/6</div></div>
<p>Kesalahan yang paling sering: 1/2 + 1/3 ditulis 2/5. Itu salah. Setengah pizza ditambah sepertiga pizza jelas lebih dari setengah, padahal 2/5 kurang dari setengah.</p>

<h2>Mengali dan membagi pecahan</h2>
<div class="rule">Kali: <b>atas × atas, bawah × bawah</b>. Contoh 2/3 × 3/4 = 6/12 = 1/2.<br>Bagi: <b>balik pecahan kedua, lalu kalikan</b>. Contoh 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2.</div>
<p>Kenapa 1/2 ÷ 1/4 = 2? Pertanyaannya: ada berapa potongan seperempat di dalam setengah? Jawabannya dua.</p>
<p>Perkalian pecahan juga bisa dibaca sebagai "bagian dari bagian": 2/3 × 3/4 artinya dua pertiga dari tiga perempat.</p>
<div class="ex"><div class="q">Hitung 3/5 × 10.</div>
<div class="step">10 = 10/1
3/5 × 10/1 = 30/5 = 6</div>
<div class="ans">Jawaban: 6 (tiga perlima dari 10)</div></div>

<h2>Desimal</h2>
<p>Desimal adalah pecahan dengan penyebut 10, 100, 1000, dan seterusnya. 0,7 = 7/10. 0,25 = 25/100 = 1/4. 0,001 = 1/1000.</p>
<p>Untuk mengubah pecahan ke desimal, bagi pembilang dengan penyebut: 3/4 = 3 ÷ 4 = 0,75.</p>
<div class="ex"><div class="q">Ubah 3/8 ke desimal, dan 0,6 ke pecahan.</div>
<div class="step">3 ÷ 8 = 0,375
0,6 = 6/10 = 3/5</div>
<div class="ans">Jawaban: 0,375 dan 3/5</div></div>

<h2>Persen</h2>
<p>Persen artinya "per seratus". 25 % = 25/100 = 0,25.</p>
<div class="ex"><div class="q">Model menebak benar 45 dari 60 gambar. Berapa persen akurasinya?</div>
<div class="step">45/60 = 0,75
0,75 × 100 = 75</div>
<div class="ans">Jawaban: 75 %</div></div>
<div class="ex"><div class="q">Harga saham naik dari 200 menjadi 250. Naik berapa persen?</div>
<div class="step">Kenaikan: 250 − 200 = 50
Dibanding harga awal: 50/200 = 0,25</div>
<div class="ans">Jawaban: naik 25 %</div></div>
<p>Perubahan persen selalu dihitung terhadap nilai <b>awal</b>. Kalau harga turun lagi dari 250 ke 200, penurunannya 50/250 = 20 %, bukan 25 %. Asimetri ini penting sekali di dunia keuangan.</p>

<h2>Periksa dengan Python</h2>
<pre><code>&gt;&gt;&gt; 1/2 + 1/3
0.8333333333333333
&gt;&gt;&gt; 5/6
0.8333333333333334
&gt;&gt;&gt; from fractions import Fraction
&gt;&gt;&gt; Fraction(1, 2) + Fraction(1, 3)
Fraction(5, 6)</code></pre>
<p>Lihat digit terakhirnya: <code>1/2 + 1/3</code> berakhir di 3, sedangkan <code>5/6</code> berakhir di 4. Padahal secara matematika keduanya sama persis. Komputer menyimpan desimal dengan jumlah digit terbatas, jadi pembulatannya bisa berbeda di ujung. <code>Fraction</code> membuat Python menghitung pecahan secara persis, tanpa pembulatan desimal.</p>
`,
  src: [
    "OpenStax, <i>Prealgebra 2e</i>, Bab 4 “Fractions”, Bab 5 “Decimals”, dan Bab 6 “Percents” (gratis online)."
  ]
};

/* ───────────────────────── 0.4 ───────────────────────── */
window.LESSONS["0.4"] = {
  title: "Pangkat dan akar",
  pre: "0.1 – 0.3", min: 30,
  why: "Rumus kesalahan model memakai kuadrat (pangkat dua). Model besar punya ratusan miliar parameter, ditulis dengan pangkat sepuluh. Laju belajar kecil seperti 10⁻³ memakai pangkat negatif. Dan akar kuadrat muncul di jarak, simpangan baku, dan rumus attention di Transformer.",
  body: `
<h2>Pangkat adalah perkalian berulang</h2>
<p>2³ artinya 2 dikali dirinya sendiri sebanyak 3 kali: 2 × 2 × 2 = 8. Angka 2 disebut <b>basis</b>, angka 3 disebut <b>pangkat</b> atau eksponen.</p>
<div class="tbl"><table><tr><th>bentuk</th><th>artinya</th><th>hasil</th></tr>
<tr><td>3²</td><td>3 × 3</td><td>9</td></tr><tr><td>5³</td><td>5 × 5 × 5</td><td>125</td></tr><tr><td>10⁴</td><td>10 × 10 × 10 × 10</td><td>10.000</td></tr><tr><td>2¹⁰</td><td>sepuluh angka 2 dikalikan</td><td>1.024</td></tr></table></div>
<p>Pangkat dua disebut juga <b>kuadrat</b> karena luas persegi bersisi 3 adalah 3² = 9.</p>

<h2>Hati-hati dengan tanda negatif</h2>
<div class="ex"><div class="q">Bandingkan (−3)² dan −3².</div>
<div class="step">(−3)² = (−3) × (−3) = 9      ← yang dipangkatkan −3
−3²   = −(3 × 3)    = −9     ← pangkat dulu, baru diberi minus</div>
<div class="ans">Jawaban: 9 dan −9. Urutan operasi: pangkat dikerjakan sebelum tanda minus di depannya.</div></div>
<div class="rule">Bilangan apa pun yang dikuadratkan hasilnya <b>tidak pernah negatif</b>.</div>
<p>Inilah alasan AI mengukur kesalahan dengan kuadrat. Kalau tebakan model meleset +3 atau −3, keduanya dihitung sebagai kesalahan 9. Kesalahan ke atas dan ke bawah tidak saling menghapus. Kuadrat juga menghukum kesalahan besar jauh lebih berat: meleset 10 dihitung 100, bukan 10.</p>

<h2>Aturan pangkat</h2>
<p>Aturan-aturan ini tidak perlu dihafal. Tulis saja perkaliannya, aturannya akan terlihat sendiri.</p>
<div class="ex"><div class="q">Hitung 2³ × 2² tanpa menghitung masing-masing.</div>
<div class="step">2³ × 2² = (2×2×2) × (2×2) = lima angka 2 dikalikan = 2⁵ = 32</div>
<div class="ans">Aturan: aᵐ × aⁿ = aᵐ⁺ⁿ (pangkatnya dijumlah)</div></div>
<div class="ex"><div class="q">Hitung 2⁵ ÷ 2².</div>
<div class="step">(2×2×2×2×2) ÷ (2×2): dua angka 2 saling coret
sisa 2×2×2 = 2³ = 8</div>
<div class="ans">Aturan: aᵐ ÷ aⁿ = aᵐ⁻ⁿ (pangkatnya dikurang)</div></div>
<div class="ex"><div class="q">Hitung (2³)².</div>
<div class="step">(2³)² = 2³ × 2³ = 2⁶ = 64</div>
<div class="ans">Aturan: (aᵐ)ⁿ = aᵐˣⁿ (pangkatnya dikali)</div></div>

<h2>Kenapa pangkat nol hasilnya 1?</h2>
<p>Lihat pola ini. Setiap kali pangkat turun satu, hasilnya <b>dibagi 2</b>:</p>
<div class="tbl"><table><tr><th>2³</th><th>2²</th><th>2¹</th><th>2⁰</th><th>2⁻¹</th><th>2⁻²</th></tr>
<tr><td>8</td><td>4</td><td>2</td><td><mark>1</mark></td><td><mark>1/2</mark></td><td><mark>1/4</mark></td></tr></table></div>
<p>Agar pola tetap jalan, 2⁰ harus 2 ÷ 2 = 1. Lanjut ke bawah nol, 2⁻¹ = 1/2 dan 2⁻² = 1/4.</p>
<div class="rule">a⁰ = 1 (untuk a bukan nol) · a⁻ⁿ = 1/aⁿ</div>
<p>Pangkat negatif artinya "satu dibagi". 10⁻³ = 1/10³ = 1/1000 = 0,001. Laju belajar AI sering ditulis 1e-3 di kode, artinya 1 × 10⁻³.</p>

<h2>Notasi ilmiah</h2>
<p>Angka sangat besar atau sangat kecil ditulis sebagai angka biasa dikali pangkat sepuluh. Model bahasa GPT-3 punya sekitar 175.000.000.000 parameter, ditulis 1,75 × 10¹¹. Di Python ditulis <code>1.75e11</code>.</p>

<h2>Akar adalah kebalikan pangkat</h2>
<p>√9 (akar kuadrat dari 9) bertanya: <b>bilangan positif apa yang kalau dikuadratkan menghasilkan 9?</b> Jawabannya 3. Sebuah persegi dengan luas 9 punya sisi 3.</p>
<div class="ex"><div class="q">Hitung √49, √0,25, dan √2.</div>
<div class="step">√49 = 7 karena 7² = 49
√0,25 = 0,5 karena 0,5 × 0,5 = 0,25
√2 tidak bulat: kira-kira 1,414 (karena 1,414² ≈ 2,0)</div>
<div class="ans">Jawaban: 7, 0,5, dan sekitar 1,414</div></div>
<p>Akar bisa ditulis sebagai pangkat pecahan: √a = a^(1/2). Cek dengan aturan pangkat: (a^(1/2))² = a^(1/2 × 2) = a¹ = a. Cocok.</p>

<h2>Periksa dengan Python</h2>
<p>Pangkat di Python ditulis <code>**</code>, bukan <code>^</code>.</p>
<pre><code>&gt;&gt;&gt; 2 ** 10
1024
&gt;&gt;&gt; (-3) ** 2
9
&gt;&gt;&gt; -3 ** 2
-9
&gt;&gt;&gt; 2 ** -2
0.25
&gt;&gt;&gt; 49 ** 0.5
7.0
&gt;&gt;&gt; import math
&gt;&gt;&gt; math.sqrt(2)
1.4142135623730951</code></pre>
`,
  src: [
    "OpenStax, <i>Prealgebra 2e</i>, Bab 10 “Polynomials”, bagian aturan pangkat dan notasi ilmiah (gratis online).",
    "Brown dkk. (2020), “Language Models are Few-Shot Learners”: sumber angka 175 miliar parameter GPT-3. Lokal."
  ]
};

/* ───────────────────────── 0.5 ───────────────────────── */
window.LESSONS["0.5"] = {
  title: "Peluang sehari-hari",
  pre: "0.3", min: 35,
  why: "Peluang adalah inti AI modern. ChatGPT tidak \"tahu\" kata berikutnya; ia menghitung peluang setiap kata yang mungkin, lalu memilih. Model pengenal gambar berkata \"92 % ini kucing\". Seluruh statistika dan machine learning dibangun dari ide sederhana di pelajaran ini.",
  body: `
<h2>Ide dasar</h2>
<p>Peluang adalah angka antara 0 dan 1 yang menyatakan seberapa mungkin sesuatu terjadi. 0 artinya mustahil, 1 artinya pasti, 0,5 artinya sama kuatnya antara terjadi dan tidak.</p>
<p>Kalau semua kemungkinan hasil <b>sama-sama mungkin</b>, peluang bisa dihitung dengan membilang:</p>
<div class="big">peluang = banyaknya hasil yang kita mau ÷ banyaknya semua hasil</div>
<div class="ex"><div class="q">Peluang mendapat angka 6 saat melempar satu dadu?</div>
<div class="step">Semua hasil: 1, 2, 3, 4, 5, 6 → ada 6
Yang kita mau: 6 → ada 1</div>
<div class="ans">Jawaban: 1/6 ≈ 0,167</div></div>
<div class="ex"><div class="q">Peluang mendapat angka genap pada satu dadu?</div>
<div class="step">Yang kita mau: 2, 4, 6 → ada 3 dari 6</div>
<div class="ans">Jawaban: 3/6 = 1/2</div></div>

<h2>Daftar semua kemungkinan</h2>
<p>Untuk kejadian yang lebih rumit, tulis semua kemungkinan hasilnya. Daftar ini disebut <b>ruang sampel</b>.</p>
<div class="ex"><div class="q">Dua koin dilempar. Berapa peluang keduanya muncul gambar (G)?</div>
<div class="step">Koin 1 bisa A (angka) atau G. Koin 2 juga.
Semua hasil: AA, AG, GA, GG → ada 4
Yang kita mau: GG → ada 1</div>
<div class="ans">Jawaban: 1/4</div></div>
<div class="ex"><div class="q">Dua koin dilempar. Berapa peluang muncul tepat satu G?</div>
<div class="step">Hasil dengan tepat satu G: AG dan GA → ada 2 dari 4</div>
<div class="ans">Jawaban: 2/4 = 1/2</div></div>
<p>Perhatikan bahwa AG dan GA dihitung <b>berbeda</b>. Banyak orang mengira hasilnya hanya tiga (dua A, dua G, campur), lalu menyimpulkan peluangnya 1/3. Itu salah, karena "campur" bisa terjadi dengan dua cara.</p>

<h2>Aturan kali untuk kejadian bebas</h2>
<p>Dua kejadian disebut <b>bebas</b> (independen) kalau yang satu tidak memengaruhi yang lain. Lemparan koin pertama tidak mengubah koin kedua.</p>
<div class="rule">Peluang A <b>dan</b> B terjadi, kalau keduanya bebas = peluang A × peluang B</div>
<p>Cek dengan contoh dua koin: peluang GG = 1/2 × 1/2 = 1/4. Sama dengan hasil membilang tadi.</p>
<div class="ex"><div class="q">Peluang dua dadu sama-sama menunjukkan 6?</div>
<div class="step">1/6 × 1/6 = 1/36</div>
<div class="ans">Jawaban: 1/36 ≈ 0,028</div></div>

<h2>Aturan komplemen: "tidak terjadi"</h2>
<p>Sesuatu pasti terjadi atau tidak terjadi, dan totalnya 1. Jadi:</p>
<div class="rule">peluang tidak terjadi = 1 − peluang terjadi</div>
<div class="ex"><div class="q">Dua dadu dilempar. Berapa peluang <b>paling sedikit satu</b> dadu menunjukkan 6?</div>
<div class="step">Lebih mudah lewat kebalikannya: "tidak ada 6 sama sekali".
Satu dadu bukan 6: 5/6
Dua dadu bukan 6: 5/6 × 5/6 = 25/36
Paling sedikit satu 6: 1 − 25/36 = 11/36</div>
<div class="ans">Jawaban: 11/36 ≈ 0,306</div></div>
<p>Trik "hitung kebalikannya" ini sangat sering dipakai, termasuk di soal wawancara quant.</p>

<h2>Peluang sebagai frekuensi jangka panjang</h2>
<p>Peluang 1/6 tidak berarti angka 6 pasti muncul sekali tiap enam lemparan. Artinya: kalau dadu dilempar <b>sangat banyak</b> kali, sekitar 1/6 hasilnya akan 6. Komputer bisa membuktikannya dengan simulasi.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import random

n = 100_000
enam = 0
for _ in range(n):
    if random.randint(1, 6) == 6:
        enam += 1
print(enam / n)          # mendekati 0.1667

minimal_satu = 0
for _ in range(n):
    d1, d2 = random.randint(1, 6), random.randint(1, 6)
    if d1 == 6 or d2 == 6:
        minimal_satu += 1
print(minimal_satu / n)  # mendekati 11/36 = 0.3056</code></pre>
<p>Simpan kode ini sebagai <code>dadu.py</code>, lalu jalankan dengan <code>python dadu.py</code>. Setiap kali dijalankan hasilnya sedikit berbeda, tetapi selalu dekat dengan jawaban hitungan. Cara memeriksa dengan simulasi seperti ini disebut <b>Monte Carlo</b>, dan akan kita pakai berkali-kali, termasuk untuk harga opsi saham.</p>
`,
  src: [
    "Grinstead & Snell, <i>Introduction to Probability</i>, §1.1 “Simulation of Discrete Probabilities” (hlm. 1) dan §1.2 “Discrete Probability Distributions” (hlm. 18). Lokal. Buku gratis terbaik untuk peluang pemula.",
    "Blitzstein & Hwang, <i>Introduction to Probability</i>, Bab 1 (preview lokal; buku lengkap dibaca online di probabilitybook.net)."
  ]
};

/* ───────────────────────── 0.6 ───────────────────────── */
window.LESSONS["0.6"] = {
  title: "Arah dan jarak di peta",
  pre: "0.1, 0.4", min: 30,
  why: "AI menyimpan makna kata, gambar, dan apa pun sebagai titik di sebuah \"peta\" dengan ratusan sampai ribuan arah. Kata yang maknanya mirip letaknya berdekatan. Cara menghitung jarak di peta dua arah ini adalah cara yang sama persis dengan yang dipakai AI di peta ribuan arah.",
  body: `
<h2>Koordinat: alamat sebuah titik</h2>
<p>Bayangkan kota yang jalannya berpetak. Dari alun-alun, kamu jalan 3 blok ke timur dan 4 blok ke utara. Posisimu bisa ditulis sebagai pasangan angka <b>(3, 4)</b>. Angka pertama (x) adalah arah timur–barat, angka kedua (y) adalah arah utara–selatan.</p>
<pre>  y (utara)
  4 ┤        ● (3, 4)
  3 ┤
  2 ┤
  1 ┤
  0 ┼──┬──┬──┬──┬── x (timur)
    0  1  2  3  4</pre>
<p>Alun-alun sendiri ada di (0, 0), disebut <b>titik asal</b>. Arah barat dan selatan memakai bilangan negatif: (−2, −1) artinya 2 blok ke barat dan 1 blok ke selatan.</p>

<h2>Perpindahan sebagai panah</h2>
<p>"Jalan 3 ke timur dan 4 ke utara" bisa digambar sebagai panah dari (0, 0) ke (3, 4). Panah yang punya arah dan panjang seperti ini nanti disebut <b>vektor</b>. Dua perpindahan bisa digabung dengan menjumlahkan masing-masing arah:</p>
<div class="ex"><div class="q">Jalan (3, 4), lalu jalan lagi (1, −2). Di mana posisi akhirnya?</div>
<div class="step">arah x: 3 + 1 = 4
arah y: 4 + (−2) = 2</div>
<div class="ans">Jawaban: (4, 2)</div></div>

<h2>Jarak lurus: teorema Pythagoras</h2>
<p>Kamu berjalan 3 blok ke timur lalu 4 blok ke utara, total 7 blok. Tapi seekor burung yang terbang lurus dari alun-alun hanya menempuh jarak yang lebih pendek. Berapa?</p>
<p>Jalur timur, jalur utara, dan garis lurus burung membentuk segitiga siku-siku. Untuk segitiga siku-siku berlaku:</p>
<div class="rule"><b>sisi miring² = sisi₁² + sisi₂²</b>, jadi sisi miring = √(sisi₁² + sisi₂²)</div>
<div class="ex"><div class="q">Jarak lurus dari (0, 0) ke (3, 4)?</div>
<div class="step">√(3² + 4²) = √(9 + 16) = √25</div>
<div class="ans">Jawaban: 5 blok</div></div>
<div class="ex"><div class="q">Jarak lurus dari titik (1, 2) ke titik (4, 6)?</div>
<div class="step">Selisih arah x: 4 − 1 = 3
Selisih arah y: 6 − 2 = 4
√(3² + 4²) = √25</div>
<div class="ans">Jawaban: 5</div></div>
<div class="ex"><div class="q">Jarak dari (−1, 3) ke (2, −1)?</div>
<div class="step">Selisih x: 2 − (−1) = 3
Selisih y: −1 − 3 = −4  → dikuadratkan jadi 16, tanda minus hilang
√(9 + 16) = √25</div>
<div class="ans">Jawaban: 5</div></div>
<p>Rumus ini disebut <b>jarak Euclid</b>. Kuadrat membuat arah selisih (maju atau mundur) tidak penting, yang penting seberapa jauh.</p>

<h2>Lebih dari dua arah</h2>
<p>Ruangan punya tiga arah: timur, utara, dan atas. Jarak antara dua titik di ruangan dihitung sama, hanya ada satu suku tambahan:</p>
<div class="big">jarak = √(selisih₁² + selisih₂² + selisih₃²)</div>
<p>AI menyimpan makna sebuah kata sebagai titik dengan, misalnya, 768 arah. Rumus jaraknya tetap sama, hanya ada 768 suku di dalam akar. Kamu tidak bisa membayangkan 768 arah, tetapi kamu bisa menghitungnya.</p>

<h2>Periksa dengan Python</h2>
<pre><code>&gt;&gt;&gt; import math
&gt;&gt;&gt; math.sqrt((4-1)**2 + (6-2)**2)
5.0
&gt;&gt;&gt; math.dist((1, 2), (4, 6))
5.0
&gt;&gt;&gt; math.dist((1, 2, 3), (4, 6, 15))
13.0</code></pre>
<p>Contoh terakhir tiga arah: selisihnya 3, 4, dan 12, jadi √(9 + 16 + 144) = √169 = 13.</p>
`,
  src: [
    "OpenStax, <i>Prealgebra 2e</i>, Bab 9 “Math Models and Geometry”, bagian teorema Pythagoras (gratis online).",
    "Boyd & Vandenberghe, VMLS, §3.2 “Distance” (hlm. 48): jarak Euclid untuk vektor berapa pun dimensinya. Lokal."
  ]
};

/* ───────────────────────── 0.7 ───────────────────────── */
window.LESSONS["0.7"] = {
  title: "Laju perubahan",
  pre: "0.1 – 0.4", min: 35,
  why: "Mesin belajar dengan bertanya: \"kalau angka bobot ini kugeser sedikit, kesalahanku berubah seberapa cepat?\" Itu pertanyaan tentang laju perubahan. Pelajaran ini adalah pintu masuk ke turunan, gradien, dan backpropagation, yaitu cara semua jaringan saraf belajar.",
  body: `
<h2>Kecepatan rata-rata</h2>
<p>Kamu menempuh 120 km dalam 2 jam. Kecepatan rata-ratamu 120 ÷ 2 = 60 km per jam. Kecepatan adalah <b>laju perubahan posisi</b>: berapa banyak posisi berubah untuk setiap satuan waktu.</p>
<div class="rule">laju perubahan rata-rata = perubahan hasil ÷ perubahan input</div>
<p>Rumus ini berlaku untuk apa pun, tidak hanya jarak dan waktu: kenaikan harga per hari, kenaikan suhu per jam, atau penurunan kesalahan model per langkah latihan.</p>

<h2>Kalau lajunya tidak tetap</h2>
<p>Sebuah bola menggelinding di bukit dan makin lama makin cepat. Posisinya, dalam meter, pada detik ke-t adalah t²:</p>
<div class="tbl"><table><tr><th>detik (t)</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><th>posisi (t²)</th><td>0</td><td>1</td><td>4</td><td>9</td><td>16</td></tr>
<tr><th>pindah dalam detik itu</th><td>–</td><td>1</td><td>3</td><td>5</td><td>7</td></tr></table></div>
<p>Setiap detik bola menempuh jarak yang makin panjang. Jadi pertanyaan "berapa kecepatan bola?" tidak punya satu jawaban. Kita harus bertanya: <b>berapa kecepatannya tepat pada detik ke-2?</b></p>

<h2>Memperkecil selang waktu</h2>
<p>Kita tidak bisa membagi dengan selang waktu nol (ingat pelajaran 0.1). Tapi kita bisa memakai selang waktu yang makin lama makin kecil, lalu melihat ke mana hasilnya menuju.</p>
<div class="ex"><div class="q">Kecepatan rata-rata bola antara detik 2 dan detik 3?</div>
<div class="step">perubahan posisi: 3² − 2² = 9 − 4 = 5
perubahan waktu: 3 − 2 = 1
5 ÷ 1 = 5</div>
<div class="ans">5 m/detik</div></div>
<div class="ex"><div class="q">Antara detik 2 dan detik 2,1?</div>
<div class="step">2,1² = 4,41
perubahan posisi: 4,41 − 4 = 0,41
perubahan waktu: 0,1
0,41 ÷ 0,1 = 4,1</div>
<div class="ans">4,1 m/detik</div></div>
<div class="ex"><div class="q">Antara detik 2 dan detik 2,01?</div>
<div class="step">2,01² = 4,0401
perubahan posisi: 0,0401
perubahan waktu: 0,01
0,0401 ÷ 0,01 = 4,01</div>
<div class="ans">4,01 m/detik</div></div>
<div class="tbl"><table><tr><th>selang waktu</th><td>1</td><td>0,1</td><td>0,01</td><td>0,001</td></tr>
<tr><th>kecepatan rata-rata</th><td>5</td><td>4,1</td><td>4,01</td><td>4,001</td></tr></table></div>
<p>Hasilnya makin mendekati <mark>4</mark>. Jadi kecepatan bola <b>tepat pada</b> detik ke-2 adalah 4 m/detik. Angka yang dituju ketika selang dibuat makin kecil inilah yang nanti disebut <b>turunan</b>.</p>

<h2>Pola yang muncul</h2>
<p>Kalau perhitungan yang sama diulang di titik lain, hasilnya:</p>
<div class="tbl"><table><tr><th>pada detik</th><td>1</td><td>2</td><td>3</td><td>5</td></tr>
<tr><th>kecepatan sesaat</th><td>2</td><td>4</td><td>6</td><td>10</td></tr></table></div>
<p>Kecepatannya selalu <b>dua kali</b> waktunya. Untuk posisi t², kecepatan sesaatnya 2t. Kamu baru saja menemukan sendiri rumus "turunan x² adalah 2x", tanpa hafalan, hanya dengan membagi dan memperkecil selang.</p>

<h2>Kemiringan bukit</h2>
<p>Laju perubahan juga bisa dibaca sebagai kemiringan. Kalau grafik posisi bola digambar, di sekitar detik ke-2 kurvanya naik dengan kemiringan 4: maju sedikit ke kanan, naik empat kali lebih banyak.</p>
<p>Inilah gambaran yang akan terus kita pakai di AI. Kesalahan model digambar sebagai bukit. Mesin ingin turun ke lembah. Kemiringan di posisinya sekarang memberi tahu ke arah mana harus melangkah: kalau kemiringan positif, geser ke kiri; kalau negatif, geser ke kanan. Cara turun bukit langkah demi langkah ini disebut <b>gradient descent</b>, dan kita akan membangunnya sendiri di Lapis 3.</p>

<h2>Periksa dengan Python</h2>
<pre><code>def posisi(t):
    return t ** 2

for h in [1, 0.1, 0.01, 0.001, 0.0001]:
    laju = (posisi(2 + h) - posisi(2)) / h
    print(h, laju)</code></pre>
<p>Hasilnya bergerak dari 5 ke 4,1, lalu 4,01, dan seterusnya mendekati 4. Kalau <code>h</code> dibuat terlalu kecil, misalnya 1e-15, hasilnya justru kacau. Itu efek angka komputer yang tidak persis, seperti 0,1 + 0,2 di pelajaran 0.2.</p>
`,
  src: [
    "Thompson, <i>Calculus Made Easy</i>, Bab II “On different degrees of smallness”, Bab III “On relative growings”, dan Bab IV “Simplest cases” (turunan x² dari prinsip pertama). Lokal.",
    "Kode Python di halaman ini adalah “beda hingga” (finite difference); efek angka yang terlalu kecil (pembatalan, <i>cancellation</i>) dibahas di Higham, Bab 1 “Principles of Finite Precision Computation”. Lokal, baca nanti."
  ]
};
