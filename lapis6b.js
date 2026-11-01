/* Lapis 6 lanjutan: membaca paper Adam, GAN, Shannon (6.7–6.9) dan Peta paper (6.10).
   Nomor bagian dan persamaan dicek di salinan lokal (pustaka/md); semua angka dijalankan dengan Python. */

/* ───────────────────────── 6.7 ───────────────────────── */
window.LESSONS["6.7"] = {
  title: "Membaca paper: Adam",
  pre: "1.7, 3.1, 5.9", min: 0,
  why: "Adam (Kingma & Ba, ICLR 2015) adalah pengoptimal yang dipakai untuk melatih hampir semua jaringan modern, termasuk Transformer di 6.4. Paper-nya pendek, dan Algoritme 1-nya cukup dibaca dengan bekal 3.1.",
  body: String.raw`
<h2>Cara membaca halaman ini</h2>
<p>Paper ini 15 halaman. Baca bagian 1 (pendahuluan), bagian 2 (algoritme), dan bagian 3 (koreksi bias) dengan pelan. Bagian 4 berisi bukti konvergensi yang memakai matematika di luar situs ini; lewati dulu. Bagian 6 (eksperimen) cukup dilihat grafiknya.</p>

<h2>Algoritme 1: inti Adam</h2>
<p>Setiap langkah t, untuk setiap bobot, dengan gradien g:</p>
<div class="tx d">m_t = \beta_1 m_{t-1} + (1-\beta_1)\,g_t, \qquad v_t = \beta_2 v_{t-1} + (1-\beta_2)\,g_t^2</div>
<div class="tx d">\hat m_t = \frac{m_t}{1-\beta_1^t}, \qquad \hat v_t = \frac{v_t}{1-\beta_2^t}, \qquad \theta_t = \theta_{t-1} - \alpha\,\frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon}</div>
<ul>
<li>m: rata-rata bergerak gradien, seperti momentum di <a href="#p3-1">3.1</a>.</li>
<li>v: rata-rata bergerak kuadrat gradien, mirip varians tanpa dikurangi rata-rata (<a href="#p1-7">1.7</a>).</li>
<li>Setelan bawaan yang disarankan paper: α = 0,001, β₁ = 0,9, β₂ = 0,999, ε = 10⁻⁸. Semua operasi dilakukan per elemen.</li>
</ul>

<h2>§3 Kenapa perlu koreksi bias</h2>
<p>m dan v dimulai dari nol, jadi di langkah awal keduanya terlalu kecil. Misalnya gradien selalu 1. Di langkah pertama m = 0,1 dan v = 0,001, padahal rata-rata sebenarnya 1. Tanpa koreksi, langkahnya menjadi 0,1 ÷ √0,001 ≈ 3,16 kali α, jauh lebih besar dari yang dimaksud. Setelah dibagi <span class="tx">1-\beta^t</span>, keduanya kembali menjadi 1 dan langkahnya tepat α.</p>
<p>Paper ini menguji efeknya pada VAE (Gambar 4): tanpa koreksi bias, β₂ yang dekat dengan 1 membuat pelatihan tidak stabil.</p>

<h2>§2.1 Ukuran langkah yang terkendali</h2>
<p>Penulisnya menunjukkan bahwa besar langkah efektif kira-kira dibatasi oleh α, apa pun besarnya gradien. Kalau semua gradien dikali 100, m ikut dikali 100 dan √v juga dikali 100, sehingga rasionya tidak berubah. Jadi α bisa dibaca langsung sebagai "seberapa jauh bobot boleh bergeser per langkah".</p>
<p>Paper ini menyebut rasio <span class="tx">\hat m_t / \sqrt{\hat v_t}</span> sebagai semacam signal-to-noise ratio. Ketika gradien sering berganti arah, m mendekati nol sementara v tetap besar, jadi langkahnya mengecil sendiri. Ini mirip menurunkan suhu pelan-pelan (simulated annealing, <a href="#p6-1">6.1</a>).</p>

<div class="ex"><div class="q">Gradien selalu 1, β₁ = 0,9, β₂ = 0,999, α = 0,001. Berapa langkah Adam di t = 1, dengan dan tanpa koreksi bias?</div>
<div class="step">m₁ = 0,1 dan v₁ = 0,001. Tanpa koreksi: 0,001 × 0,1 ÷ √0,001 ≈ 0,001 × 3,162.
Dengan koreksi: m̂ = 0,1 ÷ 0,1 = 1, v̂ = 0,001 ÷ 0,001 = 1, langkah = 0,001 × 1 ÷ 1.</div>
<div class="ans">Jawaban: tanpa koreksi ≈ 0,00316, dengan koreksi 0,001.</div></div>

<h2>§6 Eksperimen</h2>
<p>Adam dibandingkan dengan SGD bermomentum, AdaGrad, dan RMSProp pada regresi logistik (§6.1), jaringan saraf berlapis (§6.2), dan CNN (§6.3). Pada grafik-grafiknya, Adam turun secepat atau lebih cepat dari pesaingnya. Bagian 5 menjelaskan bahwa RMSProp kurang lebih adalah Adam tanpa koreksi bias.</p>

<h2>Yang perlu diwaspadai saat membaca</h2>
<p>Bukti konvergensi di bagian 4 belakangan diketahui punya celah, dan ada contoh sederhana tempat Adam tidak konvergen. Dalam praktik, varian AdamW (weight decay dipisah dari gradien) lebih sering dipakai untuk Transformer (<a href="#p5-9">5.9</a>). Jadi baca paper ini untuk memahami mekanismenya, bukan sebagai jaminan bahwa Adam selalu berhasil.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
b1, b2, a = 0.9, 0.999, 0.001
m = (1 - b1) * 1; v = (1 - b2) * 1
print(round(m / np.sqrt(v), 3))  # 3.162 (tanpa koreksi, kali alfa)
th = 1.0; m = v = 0.0  # minimalkan f = theta kuadrat
for t in range(1, 4):
    g = 2 * th; m = b1 * m + (1 - b1) * g; v = b2 * v + (1 - b2) * g * g
    th -= a * (m / (1 - b1 ** t)) / (np.sqrt(v / (1 - b2 ** t)) + 1e-8)
    print(t, round(th, 6))
# 1 0.999
# 2 0.998
# 3 0.997</code></pre>
<p>Perhatikan: setiap langkah menggeser θ kira-kira tepat α = 0,001, walaupun gradiennya sekitar 2.</p>
`,
  src: [
    "Kingma &amp; Ba (2015), “Adam: A Method for Stochastic Optimization”, <i>ICLR</i>: Algoritme 1 (setelan bawaan), §2.1 “Adam’s update rule”, §3 (koreksi bias), §5, §6.1–6.3, Gambar 4. Lokal.",
    "Reddi, Kale &amp; Kumar (2018), “On the Convergence of Adam and Beyond”, <i>ICLR</i> (celah bukti konvergensi).",
    "Loshchilov &amp; Hutter (2019), “Decoupled Weight Decay Regularization” (AdamW), <i>ICLR</i>."
  ]
};

/* ───────────────────────── 6.8 ───────────────────────── */
window.LESSONS["6.8"] = {
  title: "Membaca paper: Generative Adversarial Nets",
  pre: "1.5, 3.2, 3.4, 5.4, 5.11", min: 0,
  why: "Paper GAN (Goodfellow dkk., 2014) hanya 9 halaman, dan bagian teorinya adalah contoh terbaik bagaimana turunan sederhana dan divergensi KL membuktikan sesuatu yang besar: bahwa permainan dua jaringan berujung pada generator yang meniru data.",
  body: String.raw`
<h2>Cara membaca halaman ini</h2>
<p>Baca dulu <a href="#p5-11">5.11</a>. Di paper, bagian 3 (Adversarial nets) dan 4 (Theoretical Results) adalah inti. Bagian 5 (eksperimen) bisa dibaca cepat, dan bagian 6 (kelebihan dan kekurangan) sangat jujur dan layak dibaca utuh.</p>

<h2>§3 Persamaan (1): permainan dua pemain</h2>
<div class="tx d">\min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}\big[\log D(x)\big] + \mathbb{E}_{z \sim p_z}\big[\log(1 - D(G(z)))\big]</div>
<p>D (diskriminator) memberi peluang bahwa sebuah gambar asli. D ingin nilai ini besar: log D(x) tinggi untuk data asli dan log(1 − D) tinggi untuk palsu. G (generator) ingin sebaliknya. Kedua suku adalah log-likelihood klasifikasi biner (<a href="#p3-2">3.2</a>), jadi D sebenarnya dilatih dengan cross-entropy biasa (<a href="#p3-4">3.4</a>).</p>

<h2>§3 Trik praktis: gradien yang jenuh</h2>
<p>Paper ini mengakui bahwa persamaan (1) memberi gradien lemah di awal pelatihan. Ketika G masih buruk, D mudah menolak gambar palsu, misalnya D(G(z)) = 0,01. Kalau D = σ(a) dengan σ sigmoid (<a href="#p5-4">5.4</a>), turunan terhadap skor a:</p>
<div class="tbl"><table><tr><th>tujuan G</th><th>turunan terhadap a di D = 0,01</th></tr>
<tr><td>minimalkan log(1 − D)</td><td>−D = −0,01 (hampir nol)</td></tr>
<tr><td>maksimalkan log D</td><td>1 − D = 0,99</td></tr></table></div>
<p>Karena itu penulis menyarankan G memaksimalkan log D(G(z)). Titik akhirnya sama, tapi gradien di awal jauh lebih kuat.</p>

<h2>§4.1 Proposisi 1: diskriminator terbaik</h2>
<div class="tx d">D^*_G(x) = \frac{p_{\text{data}}(x)}{p_{\text{data}}(x) + p_g(x)}</div>
<p>Untuk G yang tetap, D terbaik di setiap titik x adalah porsi peluang data asli di titik itu. Buktinya hanya mencari puncak fungsi <span class="tx">a\log y + b\log(1-y)</span> dengan turunan sama dengan nol (<a href="#p2-1">2.1</a>). Contoh: kalau di sebuah titik <span class="tx">p_{\text{data}} = 0{,}6</span> dan <span class="tx">p_g = 0{,}2</span>, maka D* = 0,6 ÷ 0,8 = 0,75.</p>

<h2>§4.1 Teorema 1: kapan permainan selesai</h2>
<p>Dengan D* dimasukkan, nilai permainan menjadi</p>
<div class="tx d">C(G) = -\log 4 + 2\cdot \text{JSD}\big(p_{\text{data}} \,\|\, p_g\big)</div>
<p>JSD (Jensen–Shannon divergence) adalah rata-rata dua KL (<a href="#p3-4">3.4</a>) terhadap campuran kedua distribusi. Ia tidak pernah negatif dan nol hanya jika keduanya sama. Jadi nilai terkecil C(G) adalah −log 4 ≈ −1,386, dicapai tepat ketika <span class="tx">p_g = p_{\text{data}}</span>: generator meniru data dengan sempurna, dan D* = 1/2 di mana-mana.</p>

<h2>Algoritme 1 dan §5</h2>
<p>Pelatihan bergantian: k langkah memperbarui D, lalu satu langkah memperbarui G. Penulis memakai k = 1. Eksperimennya memakai MNIST, Toronto Face Database, dan CIFAR-10, dan kualitas sampel diukur dengan perkiraan Parzen window, yang penulis sendiri sebut punya varians tinggi.</p>

<h2>§6 Kekurangan yang diakui sendiri</h2>
<p>Penulis menulis bahwa D dan G harus disinkronkan dengan baik. Kalau G dilatih terlalu banyak tanpa memperbarui D, G bisa memetakan terlalu banyak z ke titik yang sama; mereka menyebutnya “Helvetica scenario”, yang sekarang dikenal sebagai mode collapse (<a href="#p5-11">5.11</a>).</p>

<h2>Yang perlu diwaspadai saat membaca</h2>
<p>Teorema 1 mengandaikan D dan G punya kapasitas tak terbatas dan dioptimalkan langsung di ruang distribusi. Jaringan sungguhan dilatih dengan gradient descent dan tidak menjamin sampai ke titik itu. Itu salah satu alasan banyak varian GAN dan, belakangan, model difusi (<a href="#p6-5">6.5</a>) muncul.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
print(round(0.6 / (0.6 + 0.2), 2), round(-np.log(4), 4))  # 0.75 -1.3863
sig = lambda a: 1 / (1 + np.exp(-a))
a = np.log(0.01 / 0.99)  # skor yang membuat D = 0.01
print(round(sig(a), 3), round(-sig(a), 3), round(1 - sig(a), 3))  # 0.01 -0.01 0.99</code></pre>
`,
  src: [
    "Goodfellow dkk. (2014), “Generative Adversarial Nets”, <i>NeurIPS</i>: §3 persamaan (1) dan paragraf gradien jenuh, Algoritme 1 (k = 1), §4.1 Proposisi 1 persamaan (2) dan Teorema 1, §5, §6 (“Helvetica scenario”). Lokal.",
    "Goodfellow, Bengio &amp; Courville, <i>Deep Learning</i>, §20.10.4 “Generative Adversarial Networks”. Lokal."
  ]
};

/* ───────────────────────── 6.9 ───────────────────────── */
window.LESSONS["6.9"] = {
  title: "Membaca paper: Shannon, teori informasi",
  pre: "0.5, 1.5, 3.4, 3.8", min: 0,
  why: "“A Mathematical Theory of Communication” (Shannon, 1948) melahirkan kata bit, rumus entropi, dan gagasan model bahasa sebagai rantai Markov. Loss cross-entropy dan perplexity di setiap LLM adalah keturunan langsung paper ini.",
  body: String.raw`
<h2>Cara membaca halaman ini</h2>
<p>Paper ini panjang (sekitar 55 halaman) dan terbagi dua: bagian diskret (tanpa noise lalu dengan noise) dan bagian kontinu. Untuk tujuan kita, cukup baca bagian 1 sampai 7. Bagian 3 dan 6 adalah yang terpenting. Bagian kontinu (18 ke atas) bisa ditunda.</p>

<h2>Pendahuluan: lahirnya kata "bit"</h2>
<p>Shannon mengukur informasi dengan logaritma. Kalau dasar logaritmanya 2, satuannya disebut binary digit, disingkat bit, kata yang ia sebut diusulkan oleh J. W. Tukey. Satu saklar dengan dua keadaan menyimpan satu bit (<a href="#p1-5">1.5</a>).</p>

<h2>§3 Bahasa Inggris sebagai proses acak</h2>
<p>Shannon membuat teks tiruan dengan aturan yang makin pintar:</p>
<ul>
<li>orde nol: huruf diambil acak dengan peluang sama;</li>
<li>orde satu: huruf diambil sesuai frekuensinya dalam bahasa Inggris (E paling sering, sekitar 0,12);</li>
<li>orde dua dan tiga: huruf berikutnya bergantung pada satu atau dua huruf sebelumnya;</li>
<li>lalu versi kata: kata diambil sesuai frekuensi, lalu sesuai kata sebelumnya.</li>
</ul>
<p>Makin tinggi ordenya, makin mirip bahasa Inggris hasilnya. Ini rantai Markov (<a href="#p3-8">3.8</a>), dan ini juga ide model bahasa n-gram, nenek moyang LLM (<a href="#p5-13">5.13</a>): tebak simbol berikutnya dari simbol-simbol sebelumnya.</p>

<h2>§6 Teorema 2: kenapa entropi berbentuk −Σ p log p</h2>
<div class="tx d">H = -K \sum_{i=1}^{n} p_i \log p_i</div>
<p>Shannon tidak memulai dari rumus. Ia menulis tiga syarat yang masuk akal untuk "ukuran ketidakpastian", lalu membuktikan bahwa hanya rumus ini yang memenuhinya (K hanya memilih satuan). Syarat ketiga paling menarik: kalau sebuah pilihan dipecah menjadi dua pilihan berturut-turut, H total harus sama dengan jumlah berbobot H tiap tahap. Contoh di paper-nya sendiri:</p>
<div class="tx d">H\big(\tfrac12, \tfrac13, \tfrac16\big) = H\big(\tfrac12, \tfrac12\big) + \tfrac12\,H\big(\tfrac23, \tfrac13\big)</div>
<div class="ex"><div class="q">Hitung kedua sisi dalam bit.</div>
<div class="step">Kiri: −(½ log₂ ½ + ⅓ log₂ ⅓ + ⅙ log₂ ⅙) ≈ 0,5 + 0,5283 + 0,4308 = 1,4591.
Kanan: H(½, ½) = 1 dan H(⅔, ⅓) ≈ 0,9183, jadi 1 + ½ × 0,9183 = 1,4591.</div>
<div class="ans">Jawaban: kedua sisi ≈ 1,4591 bit. Bobot ½ muncul karena pilihan kedua hanya terjadi separuh waktu.</div></div>

<h2>§7 Entropi sebuah sumber dan redundansi</h2>
<p>Entropi per simbol dari sebuah sumber teks bisa didekati dengan entropi orde makin tinggi dari §3. Shannon memperkirakan redundansi bahasa Inggris, untuk struktur sampai sekitar delapan huruf, kira-kira 50%: separuh dari yang kita tulis ditentukan oleh struktur bahasa, separuhnya dipilih bebas. Redundansi inilah yang membuat teks bisa dimampatkan, dan yang membuat LLM bisa menebak kata berikutnya jauh lebih baik dari acak (perplexity, <a href="#p6-3">6.3</a>).</p>

<h2>Yang perlu diwaspadai saat membaca</h2>
<p>Shannon menegaskan di awal bahwa makna pesan tidak relevan bagi masalah teknik yang ia bahas. Entropi mengukur ketidakpastian simbol, bukan arti atau kebenarannya. Ini penting saat membaca klaim tentang LLM: perplexity rendah berarti tebakan simbol yang baik, bukan pemahaman. Konversi teks paper ini juga merusak banyak rumus; cek di PDF.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
H = lambda p: -sum(x * np.log2(x) for x in p)
print(round(H([1/2, 1/3, 1/6]), 4))  # 1.4591
print(round(H([1/2, 1/2]) + 0.5 * H([2/3, 1/3]), 4))  # 1.4591</code></pre>
`,
  src: [
    "Shannon (1948), “A Mathematical Theory of Communication”, <i>Bell System Technical Journal</i> 27: pendahuluan (bit, J. W. Tukey), §3 “The series of approximations to English”, §6 “Choice, uncertainty and entropy” (Teorema 2), §7 (redundansi sekitar 50%). Lokal.",
    "Cover &amp; Thomas, <i>Elements of Information Theory</i> (2e), Bab 2. Lokal."
  ]
};

/* ───────────────────────── 6.10 ───────────────────────── */
window.LESSONS["6.10"] = {
  title: "Peta paper: apa lagi yang bisa dibaca",
  pre: "pelajaran yang ditautkan di setiap baris", min: 0,
  why: "Pelajaran di situs ini mengutip lebih dari seratus paper. Tidak semuanya perlu dibaca. Halaman ini memilih paper yang paling berguna dibaca sendiri, mengurutkannya dari yang paling ringan, dan menunjukkan pelajaran yang perlu dikuasai dulu.",
  body: String.raw`
<h2>Cara memakai peta ini</h2>
<p>Semua paper di bawah ada salinannya di folder pustaka. <b>Tingkat</b> adalah perkiraan saya, berdasarkan panjang paper dan apakah matematikanya sudah tercakup di Lapis 0–5:</p>
<ul>
<li><b>ringan</b>: pendek, matematikanya sudah ada di situs;</li>
<li><b>sedang</b>: perlu membaca pelan, ada bagian yang boleh dilewati;</li>
<li><b>berat</b>: panjang atau memakai matematika di luar situs. Baca abstrak, gambar, dan satu bagian inti saja.</li>
</ul>
<p>Strategi membaca yang sama berlaku untuk semuanya: abstrak, lalu gambar dan tabel, lalu kesimpulan, baru bagian metode. Paper yang sudah punya halaman bacaan sendiri ditandai dengan tautan ke 6.4–6.9.</p>

<h2>Mulai dari sini: ringan</h2>
<ul class="ppr">
<li><b>Rumelhart, Hinton &amp; Williams (1986), backpropagation</b><span class="pm">4 halaman · bekal <a href="#p5-4">5.4</a></span><span>aturan rantai dijalankan mundur lewat jaringan</span></li>
<li><b>Hopfield (1982), jaringan sebagai sistem fisika</b><span class="pm">5 halaman · bekal <a href="#p4-1">4.1</a></span><span>ingatan sebagai lembah energi</span></li>
<li><b>Metropolis dkk. (1953)</b><span class="pm">7 halaman · bekal <a href="#p3-8">3.8</a>, <a href="#p4-2">4.2</a></span><span>algoritme terima-tolak untuk sampling Boltzmann</span></li>
<li><b>Goodfellow dkk. (2014), GAN</b><span class="pm">9 halaman · bekal <a href="#p6-8">6.8</a></span><span>sudah ada halaman bacaan</span></li>
<li><b>He dkk. (2016), ResNet</b><span class="pm">9 halaman · bekal <a href="#p5-5">5.5</a>, <a href="#p5-9">5.9</a></span><span>sambungan pintas yang membuat jaringan sangat dalam bisa dilatih</span></li>
<li><b>Krizhevsky dkk. (2012), AlexNet</b><span class="pm">9 halaman · bekal <a href="#p5-5">5.5</a></span><span>CNN di GPU yang memulai era deep learning</span></li>
<li><b>Mikolov dkk. (2013), word2vec</b><span class="pm">9 halaman · bekal <a href="#p1-8">1.8</a>, <a href="#p5-6">5.6</a></span><span>makna kata sebagai vektor</span></li>
<li><b>Robbins &amp; Monro (1951)</b><span class="pm">9 halaman · bekal <a href="#p3-1">3.1</a></span><span>akar teori SGD: langkah yang mengecil</span></li>
</ul>

<h2>Sedang</h2>
<ul class="ppr">
<li><b>Kingma &amp; Ba (2015), Adam</b><span class="pm">15 halaman · bekal <a href="#p6-7">6.7</a></span><span>sudah ada halaman bacaan</span></li>
<li><b>Vaswani dkk. (2017), Transformer</b><span class="pm">15 halaman · bekal <a href="#p6-4">6.4</a></span><span>sudah ada halaman bacaan</span></li>
<li><b>Kingma &amp; Welling (2014), VAE</b><span class="pm">14 halaman · bekal <a href="#p6-6">6.6</a></span><span>sudah ada halaman bacaan</span></li>
<li><b>Ioffe &amp; Szegedy (2015), batch normalization</b><span class="pm">11 halaman · bekal <a href="#p5-9">5.9</a></span><span>menormalkan aktivasi per mini-batch</span></li>
<li><b>Einstein (1905), gerak Brown</b><span class="pm">12 halaman · bekal <a href="#p4-4">4.4</a>, <a href="#p4-6">4.6</a></span><span>difusi dan ukuran molekul</span></li>
<li><b>Jaynes (1957)</b><span class="pm">11 halaman · bekal <a href="#p3-4">3.4</a>, <a href="#p4-2">4.2</a></span><span>distribusi Boltzmann diturunkan dari entropi maksimum</span></li>
<li><b>Kirkpatrick dkk. (1983), simulated annealing</b><span class="pm">11 halaman · bekal <a href="#p4-1">4.1</a></span><span>optimasi dengan menurunkan suhu pelan-pelan</span></li>
<li><b>Mnih dkk. (2015), DQN</b><span class="pm">13 halaman · bekal <a href="#p5-14">5.14</a></span><span>Q-learning dengan jaringan saraf untuk game Atari</span></li>
<li><b>Schulman dkk. (2017), PPO</b><span class="pm">12 halaman · bekal <a href="#p5-14">5.14</a></span><span>policy gradient yang langkahnya dibatasi</span></li>
<li><b>Christiano dkk. (2017), preferensi manusia</b><span class="pm">17 halaman · bekal <a href="#p5-13">5.13</a>, <a href="#p5-14">5.14</a></span><span>akar RLHF: reward dipelajari dari perbandingan</span></li>
<li><b>Bahdanau dkk. (2015)</b><span class="pm">15 halaman · bekal <a href="#p5-7">5.7</a></span><span>attention pertama, sebelum Transformer</span></li>
<li><b>Ho dkk. (2020), DDPM</b><span class="pm">25 halaman · bekal <a href="#p6-5">6.5</a></span><span>sudah ada halaman bacaan</span></li>
</ul>

<h2>Berat: baca bagian intinya saja</h2>
<ul class="ppr">
<li><b>Shannon (1948)</b><span class="pm">55 halaman · bekal <a href="#p6-9">6.9</a></span><span>bagian 1–7, ada halaman bacaan</span></li>
<li><b>Hochreiter &amp; Schmidhuber (1997), LSTM</b><span class="pm">46 halaman · bekal <a href="#p5-6">5.6</a></span><span>pendahuluan dan gambar sel memori</span></li>
<li><b>Sohl-Dickstein dkk. (2015)</b><span class="pm">18 halaman · bekal <a href="#p4-6">4.6</a>, <a href="#p5-12">5.12</a></span><span>pendahuluan: asal ide difusi dari fisika</span></li>
<li><b>Song dkk. (2021), score SDE</b><span class="pm">36 halaman · bekal <a href="#p4-5">4.5</a>, <a href="#p6-2">6.2</a></span><span>Gambar 1 dan bagian tentang SDE mundur</span></li>
<li><b>Gu &amp; Dao (2023), Mamba</b><span class="pm">36 halaman · bekal <a href="#p5-8">5.8</a></span><span>pendahuluan dan gambar arsitektur</span></li>
<li><b>Kaplan dkk. (2020), scaling laws</b><span class="pm">30 halaman · bekal <a href="#p5-13">5.13</a></span><span>grafik utama: loss turun mengikuti pangkat ukuran</span></li>
<li><b>Hoffmann dkk. (2022), Chinchilla</b><span class="pm">36 halaman · bekal <a href="#p5-13">5.13</a></span><span>berapa token per parameter yang optimal</span></li>
<li><b>Brown dkk. (2020), GPT-3</b><span class="pm">75 halaman · bekal <a href="#p5-13">5.13</a></span><span>bagian 1, 2 dan 5 (keterbatasan)</span></li>
<li><b>Ouyang dkk. (2022), InstructGPT</b><span class="pm">68 halaman · bekal <a href="#p5-13">5.13</a></span><span>Gambar 2: tiga tahap RLHF</span></li>
<li><b>Black &amp; Scholes (1973)</b><span class="pm">19 halaman · bekal <a href="#p5-15">5.15</a></span><span>daftar asumsi “ideal conditions”</span></li>
</ul>

<h2>Yang sengaja tidak dimasukkan</h2>
<p>Buku teks (Goodfellow, Bishop, Cover &amp; Thomas, dan lainnya) sudah dikutip di setiap pelajaran dan lebih cocok dibaca per bab. Paper yang terlalu khusus atau yang isinya sudah tercakup penuh di pelajaran juga tidak dimasukkan. Daftar lengkap tetap ada di bagian Sumber setiap pelajaran.</p>
`,
  src: [
    "Jumlah halaman diambil dari salinan lokal tiap paper di folder pustaka. Tingkat kesulitan adalah perkiraan berdasarkan panjang dan cakupan matematikanya, bukan ukuran resmi.",
    "Strategi membaca bertahap (abstrak, gambar, kesimpulan, metode): Keshav (2007), “How to Read a Paper”, <i>ACM SIGCOMM Computer Communication Review</i>."
  ]
};
