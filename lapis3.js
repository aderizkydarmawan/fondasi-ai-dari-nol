window.LESSONS = window.LESSONS || {};
/* Lapis 3 · Alat inti AI. Rumus LaTeX langsung (<span class="tx">, <div class="tx d">). */

/* ───────────────────────── 3.1 ───────────────────────── */
window.LESSONS["3.1"] = {
  title: "Gradient descent, SGD, Adam",
  pre: "2.3 gradien, 2.10 ekspektasi dan varians", min: 0,
  why: "Inilah mesin yang melatih hampir semua model AI, dari regresi sampai GPT. Model dimulai dengan bobot acak, lalu berjuta-juta kali menggeser bobotnya sedikit ke arah yang mengurangi kesalahan. Memahami learning rate, mini-batch, momentum, dan Adam berarti memahami tombol-tombol yang diputar setiap insinyur ML setiap hari.",
  body: String.raw`
<h2>Tiga kata dulu: model, bobot, loss</h2>
<p>Sebuah <b>model</b> adalah rumus yang menebak sesuatu dari data, misalnya neuron dari 0.2: tebakan = w·x + b. Angka-angka yang bisa disetel di dalamnya (w dan b) disebut <b>bobot</b> atau parameter. Untuk mengukur seberapa buruk tebakannya, kita pakai satu angka yang disebut <b>loss</b>: makin kecil, makin bagus. Contohnya rata-rata kuadrat selisih tebakan dan jawaban sebenarnya. Melatih model artinya mencari bobot yang membuat loss sekecil mungkin.</p>
<h2>Simbol yang dipakai</h2>
<ul><li><b>θ</b> (theta): singkatan untuk "semua bobot model sekaligus". Kalau modelnya hanya punya satu bobot, kita sebut saja w, seperti di contoh di bawah. θ dan w di pelajaran ini adalah hal yang sama.</li>
<li><b>L(θ)</b>: loss sebagai fungsi bobot. Bayangkan lanskap berbukit: posisi = bobot, ketinggian = loss.</li>
<li><b>∇L</b> (dibaca "nabla L" atau "gradien L"): daftar turunan loss terhadap setiap bobot (2.3). Ia menunjuk arah naik paling curam, jadi kita melangkah ke arah sebaliknya.</li>
<li><b>η</b> (eta): <b>learning rate</b>, angka kecil yang menentukan sebesar apa setiap langkah.</li></ul>
<h2>Aturannya: turuni lembah selangkah demi selangkah</h2>
<p>Untuk model kecil kadang ada rumus jawaban langsung; untuk jaringan saraf tidak ada. Jadi kita menuruni lembah selangkah demi selangkah, seperti di 2.3. Dibaca: bobot baru = bobot lama dikurangi learning rate kali gradien.</p>
<div class="tx d">\theta_{\text{baru}} = \theta_{\text{lama}} - \eta\,\nabla L(\theta_{\text{lama}})</div>
<div class="ex"><div class="q">Model dengan satu bobot w dan loss L(w) = (w − 3)², yang paling kecil di w = 3. Mulai w = 0, η = 0,1. Lakukan tiga langkah.</div>
<div class="step">Turunan: L'(w) = 2(w − 3)
Langkah 1: w = 0 − 0,1 · 2(0 − 3) = 0,6
Langkah 2: w = 0,6 − 0,1 · 2(0,6 − 3) = 1,08
Langkah 3: w = 1,08 − 0,1 · 2(1,08 − 3) = 1,464</div>
<div class="ans">Jawaban: 0,6 → 1,08 → 1,464, merayap menuju 3</div></div>

<h2>Learning rate: tombol paling penting</h2>
<p>Untuk soal di atas, setiap langkah mengalikan jarak ke 3 dengan (1 − 2η). Akibatnya:</p>
<ul><li>η = 0,1: jarak dikali 0,8 tiap langkah. Lambat tapi pasti.</li>
<li>η = 0,5: jarak dikali 0. Tepat sampai dalam satu langkah (kebetulan untuk soal ini).</li>
<li>η = 0,9: jarak dikali −0,8. Melompat-lompat melewati 3, tapi tetap mendekat.</li>
<li>η = 1,1: jarak dikali −1,2. Makin jauh setiap langkah. Setelah 20 langkah w ≈ −112.</li></ul>
<div class="rule">Learning rate terlalu kecil: pelatihan lambat. Terlalu besar: <mark>loss meledak</mark>. Batas amannya ditentukan oleh kelengkungan lembah yang paling tajam.</div>

<h2>Lembah palsu dan titik pelana</h2>
<p>Gradient descent hanya tahu arah turun di tempatnya berdiri. Kalau lanskap loss berbentuk satu mangkuk (cembung, 5.1), semua jalan turun berakhir di dasar yang sama. Lanskap jaringan saraf tidak begitu. Ada <b>minimum lokal</b>: lembah kecil yang bukan lembah terdalam, tempat gradien nol tapi loss belum serendah mungkin. Ada juga <b>titik pelana</b>: gradien nol, tapi ke satu arah tanahnya naik dan ke arah lain turun, seperti pelana kuda. Turunan kedua (2.1) membedakannya: positif ke semua arah berarti lembah, negatif ke semua arah berarti puncak, campuran berarti pelana.</p>
<p>Contoh pelana: f(x, y) = x² − y². Di titik (0, 0) kedua turunan parsialnya (2.3) nol. Ke arah x, turunan keduanya +2 (naik seperti lembah); ke arah y, −2 (turun seperti bukit). Goodfellow dkk. (§8.2) mencatat bahwa di ruang berdimensi tinggi, minimum lokal justru jarang dan titik pelana jauh lebih sering.</p>

<h2>SGD: gradien dari segenggam data</h2>
<p>Loss sebenarnya adalah rata-rata atas seluruh training data, yang bisa berisi jutaan contoh. Menghitung gradien penuh untuk satu langkah terlalu mahal. <b>Stochastic gradient descent</b> (SGD) memakai gradien dari satu <b>mini-batch</b> acak, misalnya 64 contoh. Gradien itu bergoyang, tapi ekspektasinya sama dengan gradien penuh (2.10). Robbins &amp; Monro (1951) membuktikan cara seperti ini tetap sampai ke tujuan kalau langkahnya mengecil dengan tepat.</p>
<p>Goyangan itu bahkan sering membantu: ia mendorong model keluar dari lekukan kecil dan dataran yang buruk.</p>

<h2>Momentum: bola yang menggelinding</h2>
<p>Di lembah sempit (misalnya <span class="tx">x^2 + 25y^2</span>), GD terjepit dua arah. Arah y yang curam memaksa learning rate kecil (gradien arah y adalah 50y, jadi satu langkah mengalikan y dengan 1 − 50η; di atas η = 0,04 faktor itu lebih kecil dari −1 sehingga y meledak, dan sedikit di bawahnya faktornya negatif sehingga y berzig-zag antardinding). Dengan η yang aman, misalnya 0,02, arah x yang landai hanya menyusut 4% per langkah (dikali 1 − 2η = 0,96), sehingga GD maju pelan sepanjang dasar. Momentum (Polyak, 1964) mengumpulkan gradien lama seperti bola yang membawa kecepatan:</p>
<div class="tx d">v \leftarrow \beta v + \nabla L, \qquad \theta \leftarrow \theta - \eta v</div>
<p>Arah yang terus sama (sepanjang dasar) menumpuk kecepatan, sedangkan arah yang bolak-balik saling meniadakan. Untuk lembah itu, mulai dari (3, 1) dengan η = 0,02, GD biasa butuh 112 langkah untuk sampai dekat dasar (di sini: nilai f di bawah 0,001); dengan momentum β = 0,7 hanya 29 langkah. Tapi β = 0,9 di η yang sama butuh 71 langkah, karena bolanya melaju terlalu kencang dan berayun melewati dasar. Momentum harus disetel, bukan sihir.</p>

<h2>Adam: langkah yang disesuaikan per bobot</h2>
<p>Adam (Kingma &amp; Ba, 2015) menyimpan dua <b>rata-rata bergerak</b> untuk setiap bobot (rata-rata yang terus diperbarui: setiap langkah, nilai lama dikali misalnya 0,9 lalu ditambah 0,1 × nilai baru, sehingga gradien lama perlahan terlupakan): rata-rata gradien m (seperti momentum) dan rata-rata kuadrat gradien v. Langkahnya dibagi <span class="tx">\sqrt{v}</span>:</p>
<div class="tx d">\theta \leftarrow \theta - \eta\,\frac{\hat m}{\sqrt{\hat v} + \epsilon}</div>
<p>Bobot yang gradiennya selalu besar mendapat langkah lebih kecil, bobot yang gradiennya kecil mendapat langkah lebih besar. Hasilnya, satu learning rate cocok untuk jutaan bobot dengan skala berbeda. Topi pada m dan v adalah koreksi karena keduanya dimulai dari nol. Adam dan variannya, AdamW, adalah pengoptimal bawaan untuk melatih transformer.</p>

<h2>Periksa dengan Python</h2>
<pre><code>w = 0.0
for i in range(3):
    w = w - 0.1 * 2 * (w - 3)
    print(round(w, 3))
# 0.6
# 1.08
# 1.464
for lr in (0.1, 1.1):
    w = 0.0
    for i in range(20):
        w = w - lr * 2 * (w - 3)
    print(lr, round(w, 2))
# 0.1 2.97
# 1.1 -112.01</code></pre>
`,
  src: [
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §8.2.2 “Local Minima” dan §8.2.3 “Plateaus, Saddle Points and Other Flat Regions”. Lokal.",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §8.3 “Basic Algorithms” (SGD, momentum) dan §8.5 “Algorithms with Adaptive Learning Rates”. Lokal.",
    "Robbins & Monro (1951), “A stochastic approximation method”; Polyak (1964), metode heavy-ball (momentum). Lokal.",
    "Kingma & Ba (2015), “Adam: A Method for Stochastic Optimization”, <i>ICLR</i>; Loshchilov & Hutter (2019), “Decoupled Weight Decay Regularization” (AdamW), <i>ICLR</i>. Lokal.",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §7.1 “Optimization Using Gradient Descent”. Lokal."
  ]
};

/* ───────────────────────── 3.2 ───────────────────────── */
window.LESSONS["3.2"] = {
  title: "Likelihood dan MLE",
  pre: "2.9 distribusi, 1.5 logaritma, 2.1 turunan", min: 0,
  why: "Dari mana datangnya fungsi loss? Hampir semuanya dari satu gagasan: pilih parameter yang membuat data yang kita lihat paling mungkin terjadi. Mean squared error, cross-entropy untuk klasifikasi, dan loss pelatihan LLM semuanya adalah maximum likelihood yang ditulis dalam bentuk berbeda.",
  body: String.raw`
<h2>Membalik pertanyaan peluang</h2>
<p>Biasanya kita bertanya: kalau koin punya peluang gambar p = 0,5, berapa peluang mendapat 7 gambar dari 10 lemparan? Statistik membalik pertanyaannya: <b>kita sudah melihat</b> 7 gambar dari 10. Nilai p mana yang paling masuk akal?</p>
<p>Fungsi yang sama, dibaca dengan arah berbeda, disebut <b>likelihood</b>:</p>
<div class="tx d">L(p) = p^7\,(1-p)^3</div>
<p>(Koefisien "10 pilih 7" tidak bergantung pada p, jadi boleh dibuang.) Data tetap, p yang berubah.</p>

<h2>Cari puncaknya</h2>
<div class="tbl"><table><tr><th>p</th><td>0,3</td><td>0,5</td><td>0,7</td><td>0,9</td></tr>
<tr><th>L(p) × 1000</th><td>0,08</td><td>0,98</td><td>2,22</td><td>0,48</td></tr></table></div>
<p>Puncaknya di p = 0,7. Nilai p yang memaksimalkan likelihood disebut <b>maximum likelihood estimate</b> (MLE), ditulis <span class="tx">\hat p</span>. Hasilnya persis seperti tebakan akal sehat: 7/10.</p>

<h2>Kenapa memakai log</h2>
<p>Likelihood adalah hasil kali banyak peluang, satu untuk setiap data. Dengan seribu data, angkanya bisa sekecil <span class="tx">10^{-300}</span>, di bawah batas komputer. Logaritma (1.5) mengubah perkalian jadi penjumlahan dan tidak menggeser letak puncak, karena log fungsi naik:</p>
<div class="tx d">\log L(p) = 7\log p + 3\log(1-p)</div>
<p>Puncaknya bisa dicari dengan turunan sama dengan nol (2.1): <span class="tx">\frac{7}{p} - \frac{3}{1-p} = 0</span>, sehingga <span class="tx">7(1-p) = 3p</span> dan <span class="tx">\hat p = 0{,}7</span>.</p>
<div class="rule">Komputer suka meminimalkan, jadi loss ditulis sebagai <mark>negative log-likelihood</mark> (NLL): <span class="tx">-\log L(\theta)</span>. Memaksimalkan likelihood = meminimalkan NLL.</div>

<h2>MLE melahirkan loss yang kamu kenal</h2>
<ul><li><b>Data kontinu dengan noise normal.</b> Kalau <span class="tx">y = f_\theta(x) + \text{noise}</span> dan noise berdistribusi normal, NLL-nya sama dengan jumlah kuadrat selisih ditambah konstanta. Jadi <b>mean squared error</b> adalah MLE untuk noise normal. Untuk data [2, 4, 4, 4, 5, 5, 7, 9], MLE untuk μ adalah rata-ratanya (5) dan untuk σ² variansnya (4), angka yang sama dengan 1.7.</li>
<li><b>Klasifikasi.</b> Kalau model mengeluarkan peluang untuk setiap kelas, NLL-nya adalah <span class="tx">-\log(\text{peluang kelas yang benar})</span>. Itulah cross-entropy (3.4).</li>
<li><b>Model bahasa.</b> Loss pelatihan GPT adalah rata-rata −log peluang token berikutnya yang sebenarnya. Ini MLE (3.2): cari bobot yang membuat teks seluruh internet paling mungkin terjadi.</li></ul>
<p>Fisher (1921–1922) memperkenalkan nama "likelihood" dan sengaja membedakannya dari "probabilitas": likelihood bukan peluang bahwa parameter benar, dan tidak perlu berjumlah 1 atas semua p.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
p = np.linspace(0.01, 0.99, 99)
L = p**7 * (1 - p)**3
print(round(p[L.argmax()], 2))            # 0.7
print(round(7*np.log(0.7) + 3*np.log(0.3), 3), round(10*np.log(0.5), 3))   # -6.109 -6.931
x = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print(x.mean(), x.var())                  # 5.0 4.0</code></pre>
`,
  src: [
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §8.3 “Parameter Estimation” (MLE, hubungan dengan kuadrat terkecil). Lokal.",
    "Wasserman, <i>All of Statistics</i>, Bab 9, bagian “Maximum Likelihood” dan “Properties of Maximum Likelihood Estimators”. Lokal.",
    "Fisher (1922), “On the mathematical foundations of theoretical statistics”; Aldrich (1997), “R.A. Fisher and the making of maximum likelihood 1912–1922”. Lokal.",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §5.5 “Maximum Likelihood Estimation”. Lokal."
  ]
};

/* ───────────────────────── 3.3 ───────────────────────── */
window.LESSONS["3.3"] = {
  title: "Inferensi Bayes",
  pre: "2.11 teorema Bayes, 3.2 likelihood", min: 0,
  why: "MLE memberi satu angka terbaik, tapi tidak mengatakan seberapa yakin kita. Inferensi Bayes memberi seluruh distribusi keyakinan atas parameter. Inilah dasar ketidakpastian dalam AI: model yang tahu kapan ia tidak tahu, eksperimen A/B yang jujur, dan regularisasi yang ternyata adalah prior yang menyamar.",
  body: String.raw`
<h2>Dari satu angka ke distribusi keyakinan</h2>
<p>Teorema Bayes dari 2.11, kali ini untuk parameter θ dan data D:</p>
<div class="tx d">p(\theta \mid D) \propto p(D \mid \theta)\,p(\theta)</div>
<p>Posterior ∝ likelihood × prior. Bedanya dengan 2.11: θ bukan dua pilihan (sakit/sehat), tapi sebuah angka kontinu, misalnya peluang gambar sebuah koin, p, di antara 0 dan 1. Jadi prior dan posterior adalah kurva.</p>

<h2>Contoh: koin, lagi</h2>
<p>Kita melihat 7 gambar dari 10 lemparan. Likelihood-nya <span class="tx">p^7(1-p)^3</span> (3.2).</p>
<ul><li><b>Prior datar</b> (semua p sama mungkin): posterior sebanding dengan likelihood. Puncaknya tetap 0,7, rata-ratanya (1+7)/(2+10) ≈ 0,67.</li>
<li><b>Prior yakin koinnya jujur</b> (kurva tajam di 0,5, setara dengan pernah melihat 10 gambar dan 10 angka): rata-rata posterior menjadi (10+7)/(20+10) ≈ 0,57. Bukti 10 lemparan menggeser keyakinan, tapi belum mengalahkan keyakinan awal yang kuat.</li></ul>
<p>Keluarga kurva yang cocok untuk ini adalah distribusi <b>Beta</b>. Prior Beta(a, b) ditambah h gambar dan t angka menghasilkan posterior Beta(a + h, b + t). Prior bekerja seperti "data imajiner": a − 1 gambar dan b − 1 angka yang seolah sudah dilihat.</p>
<div class="ex"><div class="q">Prior datar Beta(1, 1). Data: 7 gambar, 3 angka. Apa posteriornya, dan berapa rentang 95% untuk p?</div>
<div class="step">Posterior: Beta(1 + 7, 1 + 3) = Beta(8, 4)
Rata-rata: 8 ÷ (8 + 4) ≈ 0,67
Rentang 95% (dari tabel atau komputer): 0,39 sampai 0,89</div>
<div class="ans">Jawaban: Beta(8, 4). p kemungkinan besar di antara 0,39 dan 0,89. Rentangnya lebar karena datanya hanya 10.</div></div>
<p>Rentang itu jujur: dari 10 lemparan kita belum bisa yakin koinnya tidak jujur, karena 0,5 masih di dalam rentang. MLE hanya mengatakan "0,7" dan diam soal keraguan.</p>

<h2>Lebih banyak data, prior makin tak berpengaruh</h2>
<p>Dengan 700 gambar dari 1000, posterior dari prior datar dan prior yang yakin 0,5 nyaris sama, keduanya sempit di sekitar 0,7. Data yang banyak menenggelamkan prior. Prior paling berpengaruh justru saat data sedikit, dan di situlah ia paling berguna.</p>

<h2>Di AI: regularisasi adalah prior</h2>
<p>Mencari puncak posterior (disebut MAP) dengan prior normal di sekitar nol pada bobot sama dengan meminimalkan loss ditambah <span class="tx">\lambda\sum w^2</span>. Itulah <b>weight decay</b> atau regularisasi L2 yang dipakai hampir di semua pelatihan. Prior Laplace memberi regularisasi L1 (lasso), yang mendorong banyak bobot jadi tepat nol. Teknik praktis seperti dropout bahkan bisa ditafsirkan sebagai inferensi Bayes perkiraan (Gal &amp; Ghahramani, 2016).</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
a, b, h, t = 1, 1, 7, 3
p = np.linspace(0, 1, 100001)                       # kisi nilai p yang rapat
post = p**(a + h - 1) * (1 - p)**(b + t - 1)        # prior × likelihood
post /= post.sum()                                  # normalkan: jumlah 1
print(round((p * post).sum(), 3))                   # 0.667
print(p[np.searchsorted(post.cumsum(), [0.025, 0.975])].round(2))   # [0.39 0.89]
print(round((10 + h) / (20 + h + t), 3))            # 0.567</code></pre>
`,
  src: [
    "McElreath, <i>Statistical Rethinking</i>, Bab 2 (§2.1 “The garden of forking data”, §2.2 “Building a model”) dan Bab 3. Lokal; video kuliahnya di repo lokal <code>rmcelreath__stat_rethinking_2024</code>.",
    "Gelman dkk., <i>Bayesian Data Analysis</i> (3e), Bab 2 “Single-parameter models” (model binomial dengan prior Beta). Lokal.",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §8.3 (MAP) dan §8.4 “Probabilistic Modeling and Inference”. Lokal.",
    "Gal & Ghahramani (2016), “Dropout as a Bayesian Approximation”, <i>ICML</i>. Lokal."
  ]
};

/* ───────────────────────── 3.4 ───────────────────────── */
window.LESSONS["3.4"] = {
  title: "Entropi, cross-entropy, divergensi KL",
  pre: "1.5 logaritma, 2.10 ekspektasi, 3.2", min: 0,
  why: "Cross-entropy adalah loss yang dipakai untuk melatih hampir semua classifier dan seluruh large language model (LLM). Divergensi KL muncul di VAE (5.10), RLHF (melatih chatbot dengan penilaian manusia, 5.13), distilasi model (model kecil belajar meniru model besar), dan model difusi (5.12). Ketiganya berasal dari satu pertanyaan Claude Shannon tahun 1948: seberapa banyak informasi dalam sebuah pesan?",
  body: String.raw`
<h2>Kejutan dan informasi</h2>
<p>Kabar "besok matahari terbit" tidak memberi informasi; semua orang sudah tahu. Kabar "besok turun salju di Jakarta" sangat mengejutkan. Shannon mengukur kejutan sebuah kejadian dengan peluang p sebagai <span class="tx">-\log_2 p</span> bit. Peluang 1/2 memberi 1 bit, peluang 1/8 memberi 3 bit, peluang 1 memberi 0 bit.</p>

<h2>Entropi: kejutan rata-rata</h2>
<div class="tx d">H(p) = -\sum_i p_i \log p_i</div>
<p>Entropi adalah ekspektasi (2.10) kejutan. Ia mengukur ketidakpastian sebuah distribusi.</p>
<div class="ex"><div class="q">Hitung entropi (dalam bit): koin jujur, koin berat sebelah 90/10, dan dadu delapan sisi.</div>
<div class="step">Koin jujur: −(½ log₂ ½ + ½ log₂ ½) = 1
Koin 90/10: −(0,9 log₂ 0,9 + 0,1 log₂ 0,1) ≈ 0,47
Dadu 8 sisi: 8 × (1/8 × 3) = 3</div>
<div class="ans">Jawaban: 1 bit, 0,47 bit, 3 bit</div></div>
<p>Koin berat sebelah lebih mudah ditebak, jadi entropinya lebih kecil. Entropi juga batas kompresi: rata-rata tidak mungkin memakai kurang dari H bit per simbol (teorema kode sumber Shannon). Di machine learning biasanya dipakai log natural, dan satuannya disebut nat.</p>

<h2>Cross-entropy: membayar dengan kode yang salah</h2>
<p>Misalkan kejadian sebenarnya mengikuti p, tapi kita memakai tebakan q. Kejutan rata-rata yang kita alami adalah:</p>
<div class="tx d">H(p, q) = -\sum_i p_i \log q_i</div>
<p>Untuk klasifikasi, p adalah label sebenarnya (1 untuk kelas yang benar, 0 untuk lainnya), jadi cross-entropy tinggal <span class="tx">-\log q_{\text{benar}}</span>: negative log-likelihood dari 3.2. Model yang memberi peluang 0,9 pada jawaban benar membayar 0,105 nat; 0,5 membayar 0,693; 0,01 membayar 4,6. Yakin dan salah dihukum berat.</p>

<h2>Divergensi KL: harga tambahan karena salah tebak</h2>
<div class="tx d">D_{\text{KL}}(p \,\|\, q) = \sum_i p_i \log \frac{p_i}{q_i} = H(p, q) - H(p)</div>
<div class="ex"><div class="q">p = [0,7; 0,2; 0,1], q = [0,5; 0,3; 0,2]. Hitung H(p), H(p, q), dan KL dalam nat.</div>
<div class="step">H(p) ≈ 0,802
H(p, q) = −(0,7 ln 0,5 + 0,2 ln 0,3 + 0,1 ln 0,2) ≈ 0,887
KL = 0,887 − 0,802</div>
<div class="ans">Jawaban: KL ≈ 0,085 nat</div></div>
<p>Dua sifat penting: KL selalu ≥ 0, dan bernilai 0 hanya kalau q = p (ketidaksamaan Gibbs). Tapi KL <b>tidak simetris</b>: untuk contoh di atas, <span class="tx">D_{\text{KL}}(q\|p) \approx 0{,}092</span>, berbeda. Jadi KL bukan "jarak" dalam arti biasa.</p>
<div class="rule">Karena H(p) tetap (tidak bergantung model), <mark>meminimalkan cross-entropy = meminimalkan KL = memaksimalkan likelihood</mark>. Tiga nama, satu tujuan.</div>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
H2 = lambda p: -(np.array(p) * np.log2(p)).sum()
print(H2([.5, .5]), round(H2([.9, .1]), 2), H2([1/8] * 8))   # 1.0 0.47 3.0
p = np.array([.7, .2, .1]); q = np.array([.5, .3, .2])
H, CE = -(p * np.log(p)).sum(), -(p * np.log(q)).sum()
print(round(H, 3), round(CE, 3), round(CE - H, 3))       # 0.802 0.887 0.085
print(round((q * np.log(q / p)).sum(), 3))               # 0.092</code></pre>
`,
  src: [
    "Shannon (1948), “A Mathematical Theory of Communication”, <i>Bell System Technical Journal</i>. Lokal.",
    "Cover & Thomas, <i>Elements of Information Theory</i> (2e), Bab 2 “Entropy, Relative Entropy, and Mutual Information”. Lokal.",
    "Kullback & Leibler (1951), “On information and sufficiency”, <i>Annals of Mathematical Statistics</i>. Mereka menyebut D<sub>KL</sub> sebagai “mean information for discrimination” I(1:2); kata “divergence” mereka pakai untuk versi simetrisnya, J(1, 2). Nama “divergensi KL” datang belakangan. Lokal (hasil OCR).",
    "MacKay, <i>Information Theory, Inference, and Learning Algorithms</i>, Bab 2 dan 4. Lokal (gratis dari situs penulis)."
  ]
};

/* ───────────────────────── 3.5 ───────────────────────── */
window.LESSONS["3.5"] = {
  title: "Bias, varians, overfitting",
  pre: "2.10, 3.2", min: 0,
  why: "Model yang sempurna di training data bisa gagal total di dunia nyata. Pelajaran ini adalah alasan setiap proyek ML memisahkan training data dan test data, memakai regularisasi, dan berhati-hati membaca angka akurasi. Kesalahan paling mahal dalam praktik ML bukan rumus yang salah, tapi model yang menghafal.",
  body: String.raw`
<h2>Menghafal bukan memahami</h2>
<p>Tujuan model bukan cocok dengan data yang sudah dilihat, tapi menebak dengan baik data <b>baru</b>. Selisih antara keduanya disebut celah generalisasi. Untuk mengukurnya, sisihkan sebagian data sebagai <b>test data</b> yang tidak pernah dipakai saat melatih.</p>

<h2>Percobaan: memasang polinomial</h2>
<p>Ambil 15 titik dari kurva sinus ditambah noise (simpangan baku 0,25), lalu pasang polinomial berbagai derajat. Ukur rata-rata kuadrat kesalahan di training data dan di 200 titik uji baru:</p>
<div class="tbl"><table><tr><th>derajat</th><td>1 (garis)</td><td>3</td><td>9</td></tr>
<tr><th>training error</th><td>0,271</td><td>0,057</td><td>0,028</td></tr>
<tr><th>test error</th><td>0,241</td><td>0,073</td><td>7,68</td></tr></table></div>
<ul><li><b>Derajat 1: underfitting.</b> Garis terlalu kaku untuk kurva sinus. Salah di latih, salah di uji.</li>
<li><b>Derajat 3: pas.</b> Test error 0,073, dekat dengan batas bawah yang tak bisa ditembus: varians noise 0,25² ≈ 0,063.</li>
<li><b>Derajat 9: overfitting.</b> Training error makin kecil, tapi test error meledak 100 kali. Kurvanya berkelok liar mengejar setiap noise.</li></ul>

<h2>Bias dan varians</h2>
<p>Bayangkan mengulang percobaan berkali-kali dengan 15 titik acak yang berbeda. Test error rata-rata bisa dipecah menjadi tiga bagian:</p>
<div class="tx d">\text{galat} = \text{bias}^2 + \text{varians} + \text{noise}</div>
<ul><li><b>Bias</b>: seberapa jauh tebakan rata-rata dari kebenaran. Model kaku punya bias besar.</li>
<li><b>Varians</b>: seberapa jauh tebakan berubah-ubah antar sampel data. Model lentur punya varians besar.</li>
<li><b>Noise</b>: ketidakpastian dalam data itu sendiri, tidak bisa dihilangkan model apa pun.</li></ul>
<div class="rule">Model sederhana: bias tinggi, varians rendah. Model rumit: bias rendah, varians tinggi. <mark>Galat terkecil ada di tengah</mark>, dan letaknya bergantung pada banyaknya data.</div>

<h2>Penangkal overfitting</h2>
<ul><li><b>Lebih banyak data</b>: varians turun, karena sulit menghafal noise yang lebih banyak.</li>
<li><b>Regularisasi</b>: penalty untuk bobot besar (weight decay, 3.3), dropout, atau berhenti lebih awal saat validation error mulai naik.</li>
<li><b>Validasi silang</b>: pilih derajat atau ukuran model dengan mengukur galat pada data yang disisihkan, bukan training error.</li></ul>

<h2>Kejutan modern: double descent</h2>
<p>Jaringan saraf modern punya parameter jauh lebih banyak daripada data, dan seharusnya menghafal. Zhang dkk. (2017) menunjukkan jaringan bisa menghafal label yang diacak sepenuhnya. Tapi pada data asli mereka tetap menggeneralisasi dengan baik. Belkin dkk. (2019) menemukan bahwa setelah melewati titik "tepat bisa menghafal", test error bisa <b>turun lagi</b> saat model dibuat lebih besar: kurva double descent. Gambaran U klasik masih benar untuk model kecil, tapi bukan cerita lengkap untuk deep learning, dan penjelasannya masih diteliti.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
rng = np.random.default_rng(1)
f = lambda x: np.sin(2 * np.pi * x)
x = np.sort(rng.uniform(0, 1, 15)); y = f(x) + rng.normal(0, 0.25, 15)
xt = np.linspace(0, 1, 200); yt = f(xt) + rng.normal(0, 0.25, 200)
for d in (1, 3, 9):
    c = np.polyfit(x, y, d)
    print(d, round(np.mean((np.polyval(c, x) - y)**2), 3), round(np.mean((np.polyval(c, xt) - yt)**2), 3))
# 1 0.271 0.241
# 3 0.057 0.073
# 9 0.028 7.677</code></pre>
`,
  src: [
    "Hastie, Tibshirani & Friedman, <i>The Elements of Statistical Learning</i> (2e), §2.9 “Model Selection and the Bias–Variance Tradeoff” dan §7.3 “The Bias–Variance Decomposition”. Lokal.",
    "James dkk., <i>An Introduction to Statistical Learning</i>, §2.2.2 “The Bias-Variance Trade-Off”. Lokal.",
    "Belkin dkk. (2019), “Reconciling modern machine-learning practice and the classical bias–variance trade-off”, <i>PNAS</i>; Zhang dkk. (2017), “Understanding deep learning requires rethinking generalization”, <i>ICLR</i>. Lokal."
  ]
};

/* ───────────────────────── 3.6 ───────────────────────── */
window.LESSONS["3.6"] = {
  title: "Konvolusi",
  pre: "1.8 perkalian titik, 2.4", min: 0,
  why: "Konvolusi adalah operasi inti CNN, jaringan yang membuat komputer bisa melihat: mengenali wajah, membaca rontgen, mengemudikan mobil. Ia juga dipakai untuk audio, sinyal sensor, dan di dalam model difusi (U-Net) serta model deret panjang seperti Mamba. Gagasannya sederhana: geser sebuah pola kecil di sepanjang data, dan ukur kecocokannya di setiap posisi.",
  body: String.raw`
<h2>Jendela yang bergeser</h2>
<p>Ambil sinyal s = [0, 0, 1, 1, 1, 0, 0] dan sebuah <b>kernel</b> kecil k = [⅓, ⅓, ⅓]. Letakkan kernel di awal sinyal, kalikan titik (1.8) dengan tiga angka di bawahnya, catat hasilnya, geser satu langkah, ulangi.</p>
<div class="ex"><div class="q">Hitung hasil kernel rata-rata [⅓, ⅓, ⅓] pada s = [0, 0, 1, 1, 1, 0, 0].</div>
<div class="step">Posisi 1: (0 + 0 + 1)/3 ≈ 0,33
Posisi 2: (0 + 1 + 1)/3 ≈ 0,67
Posisi 3: (1 + 1 + 1)/3 = 1
Posisi 4: (1 + 1 + 0)/3 ≈ 0,67
Posisi 5: (1 + 0 + 0)/3 ≈ 0,33</div>
<div class="ans">Jawaban: [0,33; 0,67; 1; 0,67; 0,33]. Tepi yang tajam menjadi landai: kernel ini menghaluskan (blur).</div></div>

<h2>Kernel menentukan apa yang dicari</h2>
<p>Ganti kernel menjadi [−1, 0, 1]. Di setiap posisi, hasilnya adalah (kanan − kiri): besar saat sinyal naik, negatif saat turun, nol di daerah datar. Untuk s di atas hasilnya [1, 1, 0, −1, −1]. Kernel ini adalah <b>pendeteksi tepi</b>, dan ia mirip turunan (2.1) versi diskret.</p>
<p>Di gambar dua dimensi, kernel 3 × 3 bergeser di atas piksel. Kernel tertentu menemukan tepi tegak, yang lain tepi mendatar, yang lain sudut. Satu kernel yang sama dipakai di seluruh gambar, jadi pola yang dikenali di pojok kiri juga dikenali di pojok kanan.</p>

<h2>Definisi</h2>
<div class="tx d">(s * k)[n] = \sum_m s[m]\,k[n - m]</div>
<p>Dalam definisi matematika, kernel dibalik dulu (perhatikan n − m). Yang dihitung CNN sebenarnya versi tanpa dibalik, disebut korelasi silang, tapi semua orang tetap menyebutnya konvolusi. Karena kernel CNN dipelajari, membalik atau tidak membalik tidak penting: jaringan akan mempelajari versi yang terbalik.</p>

<h2>Kenapa CNN memakai konvolusi</h2>
<ul><li><b>Lokal</b>: setiap keluaran hanya melihat lingkungan kecil, seperti mata yang melihat tepi sebelum melihat wajah.</li>
<li><b>Bobot berbagi</b>: satu kernel 3 × 3 hanya punya 9 bobot, berapa pun ukuran gambarnya. Lapis biasa untuk gambar 224 × 224 perlu puluhan ribu bobot per neuron keluaran.</li>
<li><b>Ekuivarian terhadap geseran</b>: geser gambar masukan, peta keluaran ikut bergeser dengan cara yang sama.</li></ul>
<p>LeCun dkk. (1998) memakai gagasan ini untuk membaca cek bank; Krizhevsky dkk. (2012) memakainya di AlexNet yang memicu ledakan deep learning. Lapis demi lapis, konvolusi menyusun tepi menjadi tekstur, tekstur menjadi bagian benda, bagian menjadi benda.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
s = np.array([0, 0, 1, 1, 1, 0, 0])
print(np.convolve(s, [1/3, 1/3, 1/3], 'valid').round(2))   # [0.33 0.67 1.   0.67 0.33]
print(np.correlate(s, [-1, 0, 1], 'valid'))               # [ 1  1  0 -1 -1]</code></pre>
`,
  src: [
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, Bab 9, §9.1 “The Convolution Operation” dan §9.2 “Motivation”. Lokal.",
    "Oppenheim & Willsky, <i>Signals and Systems</i> (2e), Bab 2 “Linear Time-Invariant Systems” (jumlah konvolusi). Lokal.",
    "LeCun dkk. (1998), “Gradient-based learning applied to document recognition”; Krizhevsky, Sutskever & Hinton (2012), “ImageNet classification with deep convolutional neural networks”. Lokal."
  ]
};

/* ───────────────────────── 3.7 ───────────────────────── */
window.LESSONS["3.7"] = {
  title: "Persamaan diferensial biasa",
  pre: "2.1 turunan, 1.5 eksponen", min: 0,
  why: "Persamaan diferensial adalah bahasa untuk sesuatu yang berubah terus-menerus: populasi, suhu, posisi, dan juga bobot yang dilatih gradient descent. Model difusi, flow matching, Neural ODE, dan model state space seperti Mamba semuanya adalah persamaan diferensial yang diselesaikan dengan komputer.",
  body: String.raw`
<h2>Aturan perubahan, bukan rumus nilai</h2>
<p>Kadang kita tidak tahu rumus sebuah besaran, tapi tahu <b>aturan perubahannya</b>. Contoh: kopi panas mendingin lebih cepat ketika ia jauh lebih panas dari ruangan. Obat dalam darah berkurang sebanding dengan jumlahnya. Ditulis:</p>
<div class="tx d">\frac{dy}{dt} = -k\,y</div>
<p>Dibaca: laju perubahan y sebanding dengan y itu sendiri, dengan tanda minus (berkurang). Ini <b>persamaan diferensial biasa</b> (ODE): persamaan yang memuat turunan. Jawabannya bukan angka, tapi sebuah fungsi y(t).</p>

<h2>Jawaban tepat: eksponen</h2>
<p>Fungsi apa yang turunannya sama dengan −k kali dirinya sendiri? Eksponen dari 1.5:</p>
<div class="tx d">y(t) = y_0\,e^{-kt}</div>
<p>Cek: turunan <span class="tx">e^{-kt}</span> adalah <span class="tx">-k\,e^{-kt}</span> (aturan rantai, 2.2). Dengan k = 0,5 dan y₀ = 10, setelah 4 satuan waktu y = 10·e⁻² ≈ 1,353. Waktu paruhnya (saat y tinggal separuh) <span class="tx">\ln 2 / k \approx 1{,}39</span>.</p>

<h2>Jawaban komputer: metode Euler</h2>
<p>Sebagian besar ODE tidak punya rumus tertutup. Cara paling sederhana: mulai dari y₀, lalu berjalan dengan langkah kecil Δt memakai kemiringan saat itu:</p>
<div class="tx d">y_{n+1} = y_n + \Delta t \cdot f(y_n)</div>
<div class="ex"><div class="q">dy/dt = −0,5 y, y(0) = 10. Pakai Euler dengan Δt = 1 sampai t = 4.</div>
<div class="step">Setiap langkah: y ← y + 1 · (−0,5 y) = 0,5 y
t=1: 5   t=2: 2,5   t=3: 1,25   t=4: 0,625</div>
<div class="ans">Jawaban: 0,625 (yang tepat 1,353)</div></div>
<p>Galatnya besar karena langkahnya kasar. Dengan Δt = 0,5 hasilnya 1,001; dengan Δt = 0,1 hasilnya 1,285. Makin kecil langkah, makin dekat, tapi makin banyak hitungan. Metode yang lebih cerdas (Runge–Kutta) mengambil beberapa kemiringan per langkah untuk akurasi lebih tinggi dengan biaya sama.</p>

<h2>Membaca ODE tanpa menyelesaikannya</h2>
<p>Strogatz mengajarkan cara melihat ODE secara geometris: gambar dy/dt sebagai fungsi y. Di mana dy/dt = 0, y berhenti: <b>titik tetap</b>. Kalau gangguan kecil di sekitar titik itu meluruh kembali, titiknya stabil (seperti y = 0 untuk −ky). Kalau membesar, tidak stabil.</p>

<h2>Di AI</h2>
<p>Gradient descent dengan langkah sangat kecil adalah metode Euler untuk ODE <span class="tx">d\theta/dt = -\nabla L(\theta)</span> (aliran gradien). Learning rate adalah Δt, dan learning rate terlalu besar membuat Euler meledak, persis seperti di 3.1. Model difusi menghasilkan gambar dengan menyelesaikan ODE (atau SDE, 4.5) dari noise menuju data, dan Neural ODE (Chen dkk., 2018) menjadikan lapis jaringan saraf sebagai langkah ODE.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import math
for dt in (1, 0.5, 0.1):
    y, t = 10.0, 0.0
    while t &lt; 4 - 1e-9:
        y = y + dt * (-0.5 * y); t += dt
    print(dt, round(y, 3))
# 1 0.625
# 0.5 1.001
# 0.1 1.285
print(round(10 * math.exp(-2), 3))   # 1.353</code></pre>
`,
  src: [
    "Strogatz, <i>Nonlinear Dynamics and Chaos</i> (2e), Bab 2: §2.1 “A Geometric Way of Thinking” dan §2.2 “Fixed Points and Stability”. Lokal.",
    "Boyce & DiPrima, <i>Elementary Differential Equations and Boundary Value Problems</i>, Bab 1–2, §2.7 “Numerical Approximations: Euler’s Method” dan §8.1 “The Euler or Tangent Line Method”. Lokal (hasil OCR).",
    "Chen dkk. (2018), “Neural Ordinary Differential Equations”, <i>NeurIPS</i>. Lokal."
  ]
};

/* ───────────────────────── 3.8 ───────────────────────── */
window.LESSONS["3.8"] = {
  title: "Rantai Markov",
  pre: "2.6 perkalian matriks, 2.7 eigen, 2.11", min: 0,
  why: "Rantai Markov memodelkan sesuatu yang berpindah keadaan secara acak, dengan langkah berikutnya hanya bergantung pada keadaan sekarang. Model bahasa sederhana, PageRank, metode MCMC untuk statistik Bayes, reinforcement learning, dan proses noise di model difusi semuanya rantai Markov.",
  body: String.raw`
<h2>Keadaan dan peluang pindah</h2>
<p>Cuaca sebuah kota: kalau hari ini cerah, besok cerah dengan peluang 0,8 dan hujan 0,2. Kalau hari ini hujan, besok cerah 0,4 dan hujan 0,6. Tulis dalam <b>matriks transisi</b>, baris = keadaan sekarang, kolom = keadaan besok:</p>
<div class="tx d">P = \begin{bmatrix} 0{,}8 & 0{,}2 \\ 0{,}4 & 0{,}6 \end{bmatrix}</div>
<p>Setiap baris berjumlah 1. Sifat Markov: peluang besok hanya bergantung pada hari ini, bukan pada minggu lalu. Kedengarannya membatasi, tapi kalau "keadaan" dibuat cukup kaya, banyak sistem nyata memenuhinya.</p>

<h2>Melangkah = mengalikan matriks</h2>
<p>Kalau hari ini pasti cerah, distribusinya x = [1, 0]. Distribusi besok adalah <span class="tx">xP</span>, lusa <span class="tx">xP^2</span>, dan seterusnya:</p>
<div class="tbl"><table><tr><th>hari</th><td>0</td><td>1</td><td>2</td><td>3</td><td>5</td><td>∞</td></tr>
<tr><th>P(cerah)</th><td>1</td><td>0,8</td><td>0,72</td><td>0,688</td><td>0,670</td><td>2/3</td></tr></table></div>
<p>Kalau dimulai dari hujan, distribusinya juga merayap ke 2/3 cerah. Ingatan tentang keadaan awal memudar.</p>

<h2>Distribusi stasioner</h2>
<p>Distribusi π yang tidak berubah oleh satu langkah, <span class="tx">\pi P = \pi</span>, disebut <b>distribusi stasioner</b>. Itu vektor eigen (2.7) dengan nilai eigen 1.</p>
<div class="ex"><div class="q">Cari π = [a, 1 − a] untuk matriks cuaca di atas.</div>
<div class="step">Syarat untuk komponen cerah: 0,8a + 0,4(1 − a) = a
0,4 + 0,4a = a  →  0,4 = 0,6a</div>
<div class="ans">Jawaban: a = 2/3. Dalam jangka panjang, 2 dari 3 hari cerah.</div></div>
<p>Kalau rantainya bisa mencapai semua keadaan dan tidak terjebak dalam siklus kaku (disebut ergodik), distribusi apa pun akan menuju π yang sama. Seberapa cepat ditentukan oleh nilai eigen kedua: untuk P ini nilainya 0,4, jadi jarak ke π mengecil 0,4 kali setiap hari.</p>

<h2>Di AI</h2>
<ul><li><b>Model bahasa n-gram</b> (Shannon, 1948): keadaan = kata terakhir, transisi = peluang kata berikutnya. LLM modern memakai konteks yang jauh lebih panjang, tapi proses generate token demi token tetap berbentuk rantai.</li>
<li><b>PageRank</b>: peselancar acak berpindah antarhalaman lewat tautan. Peringkat sebuah halaman = peluang stasioner peselancar ada di sana.</li>
<li><b>MCMC</b> (Metropolis dkk. 1953, Hastings 1970): untuk mengambil sampel dari posterior yang rumit (3.3), rancang rantai Markov yang distribusi stasionernya adalah posterior itu, lalu jalankan lama.</li>
<li><b>Reinforcement learning</b> (5.14) dan <b>model difusi</b> (5.12): proses keputusan Markov dan rantai penambahan noise.</li></ul>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
P = np.array([[0.8, 0.2], [0.4, 0.6]])
x = np.array([1.0, 0.0])
for hari in range(3):
    x = x @ P
    print(x.round(3))
# [0.8 0.2]
# [0.72 0.28]
# [0.688 0.312]
vals, vecs = np.linalg.eig(P.T)
pi = vecs[:, vals.argmax()]; print((pi / pi.sum()).round(4))   # [0.6667 0.3333]
print(sorted(vals.round(2)))                                   # [np.float64(0.4), np.float64(1.0)]</code></pre>

<h2>Penutup Lapis 3: logistic regression dengan tangan</h2>
<p>Empat data: x = −1, 0, 1, 2 dengan label 0, 0, 1, 1. Modelnya p = σ(wx + b), dengan σ di sini berarti sigmoid (2.2), bukan simpangan baku, yang menghasilkan peluang label 1. Ini bukan topik rantai Markov; penutup ini merangkum seluruh Lapis 3. Loss-nya cross-entropy rata-rata (3.4), yang sama dengan minus log-likelihood dibagi banyak data (3.2). Gradiennya ternyata sederhana (diturunkan di 5.1): turunan loss terhadap w adalah rata-rata (p − y)·x, dan terhadap b adalah rata-rata (p − y). Lalu gradient descent (3.1) melakukan sisanya.</p>
<div class="ex"><div class="q">Mulai dari w = b = 0 dengan learning rate 1. Hitung loss awal, lalu satu langkah gradient descent.</div>
<div class="step">w = b = 0: semua p = σ(0) = 0,5, loss = −ln 0,5 = ln 2 ≈ 0,693
p − y = 0,5; 0,5; −0,5; −0,5
turunan terhadap w = (0,5 × (−1) + 0,5 × 0 + (−0,5) × 1 + (−0,5) × 2) ÷ 4 = −2 ÷ 4 = −0,5
turunan terhadap b = (0,5 + 0,5 − 0,5 − 0,5) ÷ 4 = 0
w ← 0 − 1 × (−0,5) = 0,5      b tetap 0
loss baru ≈ 0,489</div>
<div class="ans">Jawaban: loss turun dari 0,693 ke 0,489 dalam satu langkah. Kurva peluang mulai miring ke arah yang benar: p untuk x = 2 naik dari 0,5 ke 0,731.</div></div>
<p>Kalau langkahnya diteruskan, w terus membesar: sekitar 1,97 setelah 10 langkah, 4,87 setelah 100, dan 6,10 setelah 200, sementara loss terus mendekati nol. Sebabnya, data ini <b>terpisah sempurna</b>: ambang x = 0,5 saja sudah memisahkan semua label 0 (x = −1 dan 0) dari semua label 1 (x = 1 dan 2), sehingga MLE terus mendorong kurva menjadi tangga yang makin curam. Ini salah satu alasan memakai regularisasi, yang di 3.3 ternyata sama dengan memasang prior.</p>
<pre><code>import numpy as np
x = np.array([-1., 0, 1, 2]); y = np.array([0., 0, 1, 1])
w = b = 0.0
for t in range(200):
    p = 1 / (1 + np.exp(-(w * x + b)))
    w, b = w - ((p - y) * x).mean(), b - (p - y).mean()
p = 1 / (1 + np.exp(-(w * x + b)))
print(round(w, 3), round(b, 3))   # 6.099 -2.834
print(round(-(y * np.log(p) + (1 - y) * np.log(1 - p)).mean(), 4))   # 0.0237</code></pre>
<p class="meta">Penutup ini merangkum pelajaran-pelajaran yang dirujuk; sumbernya ada di pelajaran itu masing-masing, sedangkan daftar sumber di bawah milik pelajaran ini.</p>
`,
  src: [
    "Grinstead & Snell, <i>Introduction to Probability</i>, Bab 11 “Markov Chains” (§11.1 “Introduction”, §11.3 “Ergodic Markov Chains”). Lokal (gratis).",
    "Levin & Peres, <i>Markov Chains and Mixing Times</i>, Bab 1. Lokal.",
    "Metropolis dkk. (1953), “Equation of state calculations by fast computing machines”; Hastings (1970), “Monte Carlo sampling methods using Markov chains”. Lokal."
  ]
};
