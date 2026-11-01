window.LESSONS = window.LESSONS || {};
/* Lapis 5 bagian 1 (5.1–5.8) · Model AI. Rumus LaTeX langsung (<span class="tx">, <div class="tx d">). */

/* ───────────────────────── 5.1 ───────────────────────── */
window.LESSONS["5.1"] = {
  title: "Regresi linear dan logistik",
  pre: "1.4 garis, 1.7 varians, 2.1 turunan, 2.2 aturan rantai, 2.3 gradien, 2.6 matriks, 3.1, 3.2, 3.4, 4.2 softmax", min: 0,
  why: "Dua model ini adalah titik awal semua machine learning. Regresi linear menebak angka; regresi logistik menebak peluang ya atau tidak. Satu neuron di jaringan saraf adalah regresi logistik, dan lapis terakhir GPT adalah regresi logistik dengan puluhan ribu kelas. Semua alat dari Lapis 2 dan 3 bertemu di sini.",
  body: String.raw`
<h2>Regresi linear: menebak angka</h2>
<p>Model: <span class="tx">\hat y = w x + b</span>, atau dengan banyak fitur <span class="tx">\hat y = \mathbf{w}\cdot\mathbf{x} + b</span>. Loss: rata-rata kuadrat selisih (MSE), yang menurut 3.2 adalah MLE kalau noisenya normal. Untuk model ini ada rumus jawaban langsung, disebut <b>kuadrat terkecil</b> (contoh di bawah), tapi gradient descent (3.1) juga sampai ke jawaban yang sama.</p>
<div class="ex"><div class="q">Data (1; 2), (2; 4), (3; 5), (4; 8). Cari garis kuadrat terkecil.</div>
<div class="step">Rata-rata x = 2,5, rata-rata y = 4,75
w = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)² = 9,5 ÷ 5 = 1,9
b = ȳ − w x̄ = 4,75 − 1,9 × 2,5 = 0</div>
<div class="ans">Jawaban: ŷ = 1,9x</div></div>
<p>Dari mana rumus w dan b itu? Loss-nya <span class="tx">L(w, b) = \sum (y - wx - b)^2</span>. Di dasar lembah, kedua turunan parsial (2.3) bernilai nol. Turunan terhadap b: <span class="tx">-2\sum (y - wx - b) = 0</span>, jadi <span class="tx">b = \bar y - w\bar x</span>. Masukkan b ini ke turunan terhadap w, <span class="tx">-2\sum x\,(y - wx - b) = 0</span>, lalu rapikan: keluarlah rumus w di atas. Dengan banyak fitur, cara yang sama memberi <span class="tx">\mathbf{w} = (X^\top X)^{-1} X^\top \mathbf{y}</span>, memakai transpos dan invers dari 2.6.</p>

<h2>Regresi logistik: menebak peluang</h2>
<p>Untuk pertanyaan ya/tidak (email ini spam? tumor ini ganas?), keluaran harus di antara 0 dan 1. Ambil skor linear <span class="tx">z = \mathbf{w}\cdot\mathbf{x} + b</span>, lalu peras dengan fungsi <b>sigmoid</b>:</p>
<div class="tx d">\sigma(z) = \frac{1}{1 + e^{-z}}</div>
<p>σ(0) = 0,5; σ(2) ≈ 0,88; σ(−2) ≈ 0,12. Sigmoid adalah softmax (4.2) untuk dua kelas. Garis z = 0 disebut <b>decision boundary</b>: di satu sisi model berkata "ya", di sisi lain "tidak", dan makin jauh dari garis, makin yakin.</p>

<h2>Loss: cross-entropy biner</h2>
<p>Dari 3.2 dan 3.4, loss untuk satu contoh dengan label y ∈ {0, 1}:</p>
<div class="tx d">L = -\big[\,y \log \hat p + (1-y)\log(1-\hat p)\,\big]</div>
<div class="ex"><div class="q">Model memberi z = 3 untuk sebuah email. Berapa peluang spam, dan berapa loss-nya kalau email itu memang spam? Kalau ternyata bukan spam?</div>
<div class="step">p̂ = σ(3) ≈ 0,953
Spam (y = 1): L = −log 0,953 ≈ 0,049
Bukan spam (y = 0): L = −log(1 − 0,953) ≈ 3,05</div>
<div class="ans">Jawaban: 0,953; loss 0,049 kalau benar, 3,05 kalau salah. Yakin tapi salah dihukum sekitar 60 kali lebih berat.</div></div>
<p>Gradiennya sangat sederhana: <span class="tx">\partial L/\partial z = \hat p - y</span>, selisih tebakan dan kenyataan. Asalnya dari aturan rantai (2.2): turunan L terhadap p̂ adalah <span class="tx">-y/\hat p + (1-y)/(1-\hat p)</span> (turunan ln dari 2.1), turunan p̂ = σ(z) terhadap z adalah <span class="tx">\hat p(1-\hat p)</span> (2.2). Kalikan keduanya, banyak suku saling coret, dan sisanya p̂ − y. Di z = 3 dengan y = 1: 0,953 − 1 = −0,047.</p>
<p>Berbeda dengan regresi linear, tidak ada rumus jawaban langsung, jadi bobotnya dicari dengan gradient descent. Untungnya loss ini <b>cembung</b>. Artinya: tali yang direntangkan di antara dua titik mana pun pada grafiknya tidak pernah berada di bawah grafik, sehingga grafiknya hanya punya satu lembah (atau satu dasar datar) dan tidak ada lembah palsu tempat GD bisa terjebak. Untuk satu variabel, cembung berarti turunan keduanya tidak pernah negatif (x² cembung; x⁴ − x² tidak, karena punya dua lembah). Jadi GD sampai ke dasar, asal learning rate cukup kecil (3.1). Satu pengecualian: kalau kedua kelas bisa dipisahkan sempurna oleh garis, dasarnya ada di tak hingga dan bobot terus membesar; regularisasi (3.5) mencegah hal itu.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
x = np.array([1, 2, 3, 4.]); y = np.array([2, 4, 5, 8.])
w = ((x - x.mean()) * (y - y.mean())).sum() / ((x - x.mean())**2).sum()
print(round(w, 3), round(y.mean() - w * x.mean(), 3))   # 1.9 0.0
p = 1 / (1 + np.exp(-3))
print(round(p, 3), round(-np.log(p), 3), round(-np.log(1 - p), 3))   # 0.953 0.049 3.049</code></pre>

<h2>Mengukur hasilnya dengan jujur</h2>
<p>Model dinilai pada data yang tidak pernah dilihatnya saat belajar. Data dibagi tiga: <b>training set</b> untuk belajar, <b>validation set</b> untuk memilih pengaturan (misalnya learning rate atau seberapa kuat regularisasi, 3.5), dan <b>test set</b> yang hanya disentuh sekali di akhir. Kalau test set dipakai berulang untuk memilih model, angkanya jadi terlalu optimis.</p>
<p>Ukuran paling sederhana adalah <b>akurasi</b>: persen tebakan yang benar. Tapi akurasi menipu kalau kelasnya timpang. Untuk tebakan "ya" (positif), hitung empat kotak: TP (benar ya), FP (salah ya), FN (terlewat), TN (benar tidak). Lalu</p>
<div class="rule"><mark>precision = TP ÷ (TP + FP)</mark>: dari semua yang ditebak "ya", berapa yang benar. <mark>recall = TP ÷ (TP + FN)</mark>: dari semua yang memang "ya", berapa yang tertangkap.</div>
<div class="ex"><div class="q">1000 orang, 10 di antaranya sakit. Model A selalu menjawab "sehat". Model B menandai 48 orang sakit, 8 di antaranya benar. Bandingkan.</div>
<div class="step">Model A: akurasi 990 ÷ 1000 = 0,99, tapi recall 0 ÷ 10 = 0 (tidak satu pun yang sakit tertangkap)
Model B: TP = 8, FP = 40, FN = 2, TN = 950
         akurasi (8 + 950) ÷ 1000 = 0,958
         precision 8 ÷ 48 ≈ 0,167, recall 8 ÷ 10 = 0,8</div>
<div class="ans">Jawaban: akurasi A lebih tinggi, padahal A tidak berguna. B menangkap 80% yang sakit, dengan harga banyak alarm palsu.</div></div>
`,
  src: [
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §11.1 “Performance Metrics” (precision dan recall) dan §5.3 “Hyperparameters and Validation Sets”. Lokal.",
    "Hastie, Tibshirani & Friedman, <i>The Elements of Statistical Learning</i> (2e), Bab 3 (regresi linear) dan §4.4 “Logistic Regression”. Lokal.",
    "James dkk., <i>An Introduction to Statistical Learning</i>, §4.3 “Logistic Regression”. Lokal.",
    "Bishop, <i>Pattern Recognition and Machine Learning</i>, §3.1 dan §4.3.2 “Logistic regression”. Lokal."
  ]
};

/* ───────────────────────── 5.2 ───────────────────────── */
window.LESSONS["5.2"] = {
  title: "Pohon keputusan dan ensemble",
  pre: "3.4 entropi, 3.5 bias-varians", min: 0,
  why: "Untuk data tabel (spreadsheet: data pelanggan, rekam medis, transaksi), model terbaik sampai hari ini sering bukan jaringan saraf, melainkan kumpulan pohon keputusan: random forest dan gradient boosting (XGBoost, LightGBM). Model ini juga mudah dijelaskan, penting ketika keputusan model harus dipertanggungjawabkan.",
  body: String.raw`
<h2>Dua puluh pertanyaan</h2>
<p>Pohon keputusan menebak dengan serangkaian pertanyaan ya/tidak: "Umur &gt; 40?", lalu "Tekanan darah &gt; 140?", dan seterusnya, sampai tiba di daun yang memberi jawaban. Pertanyaannya tidak dirancang manusia; algoritma memilih, di setiap simpul, pertanyaan yang paling memisahkan kelas.</p>

<h2>Mengukur "paling memisahkan": ketidakmurnian Gini</h2>
<p>Simpul yang berisi satu kelas saja disebut murni. Ketidakmurnian Gini mengukur peluang dua contoh yang diambil acak dari simpul itu berbeda kelas:</p>
<div class="tx d">G = 1 - \sum_k p_k^2</div>
<div class="ex"><div class="q">Simpul berisi 6 "ya" dan 4 "tidak". Sebuah pertanyaan membaginya menjadi kiri (5 ya, 1 tidak) dan kanan (1 ya, 3 tidak). Apakah ini pemisahan yang bagus?</div>
<div class="step">Sebelum: G = 1 − 0,6² − 0,4² = 0,48
Kiri: G = 1 − (5/6)² − (1/6)² ≈ 0,278
Kanan: G = 1 − (1/4)² − (3/4)² = 0,375
Rata-rata berbobot: 0,6 × 0,278 + 0,4 × 0,375 ≈ 0,317</div>
<div class="ans">Jawaban: ketidakmurnian turun dari 0,48 ke 0,317. Algoritma mencoba semua pertanyaan yang mungkin dan memilih penurunan terbesar.</div></div>
<p>Entropi (3.4) bisa dipakai menggantikan Gini; hasilnya biasanya mirip. Pohon yang terus dibelah sampai setiap daun murni akan menghafal training data: varians tinggi (3.5). Satu pohon itu rapuh.</p>

<h2>Random forest: banyak pohon, rata-rata suara</h2>
<p>Breiman (2001): latih ratusan pohon, masing-masing pada sampel acak data (diambil dengan pengembalian, disebut <b>bootstrap</b>) dan hanya boleh memilih dari sebagian fitur acak di setiap simpul. Lalu ambil suara terbanyak. Merata-ratakan B tebakan yang masing-masing bervarians σ² dan berkorelasi ρ menghasilkan varians</p>
<div class="tx d">\rho\,\sigma^2 + \frac{1-\rho}{B}\,\sigma^2</div>
<p>Suku kedua menghilang dengan banyak pohon; fitur acak menekan ρ supaya pohon-pohonnya tidak terlalu mirip.</p>

<h2>Gradient boosting: pohon yang membetulkan kesalahan</h2>
<p>Boosting berjalan berurutan. Pohon pertama menebak. Pohon kedua dilatih untuk menebak <b>sisa kesalahan</b> pohon pertama. Pohon ketiga menebak sisa kesalahan gabungan keduanya, dan seterusnya, masing-masing dikalikan learning rate kecil. Friedman (2001) menunjukkan ini adalah gradient descent (3.1) di ruang fungsi: setiap pohon baru adalah satu langkah menuruni loss. XGBoost (Chen &amp; Guestrin, 2016) menambahkan regularisasi dan trik kecepatan, dan menjuarai banyak kompetisi data tabel.</p>

<h2>Periksa dengan Python</h2>
<pre><code>gini = lambda a, b: 1 - (a / (a + b))**2 - (b / (a + b))**2
print(round(gini(6, 4), 3), round(gini(5, 1), 3), round(gini(1, 3), 3))   # 0.48 0.278 0.375
print(round(0.6 * gini(5, 1) + 0.4 * gini(1, 3), 3))                       # 0.317</code></pre>
`,
  src: [
    "Hastie, Tibshirani & Friedman, <i>The Elements of Statistical Learning</i> (2e), §9.2 “Tree-Based Methods”, Bab 10 (boosting) dan Bab 15 (random forest, rumus varians ρσ² + (1 − ρ)σ²/B). Lokal.",
    "James dkk., <i>An Introduction to Statistical Learning</i>, §8.1 “The Basics of Decision Trees” dan §8.2. Lokal.",
    "Breiman (2001), “Random Forests”, <i>Machine Learning</i> 45; Friedman (2001), “Greedy Function Approximation: A Gradient Boosting Machine”; Chen & Guestrin (2016), “XGBoost”. Lokal."
  ]
};

/* ───────────────────────── 5.3 ───────────────────────── */
window.LESSONS["5.3"] = {
  title: "Klasterisasi dan PCA",
  pre: "1.8 vektor dan jarak, 2.8 PCA", min: 0,
  why: "Sering data tidak punya label: tidak ada yang memberi tahu mana pelanggan setia, mana jenis sel kanker. Pembelajaran tanpa pengawasan mencari struktur sendiri. K-means mengelompokkan; PCA merangkum banyak kolom menjadi sedikit arah. Keduanya dipakai untuk memahami data sebelum memodelkannya, dan untuk menampilkan embedding AI yang berdimensi ribuan.",
  body: String.raw`
<h2>K-means: dua langkah yang diulang</h2>
<p>Pilih k, banyaknya kelompok. Taruh k pusat secara acak. Lalu ulangi:</p>
<ol><li><b>Tugaskan</b>: setiap titik masuk ke kelompok pusat terdekat.</li>
<li><b>Pindahkan</b>: setiap pusat pindah ke rata-rata titik anggotanya.</li></ol>
<p>Berhenti ketika tidak ada titik yang pindah kelompok. Setiap putaran tidak pernah menaikkan jumlah kuadrat jarak titik ke pusatnya, jadi algoritma pasti berhenti.</p>
<div class="ex"><div class="q">Titik (1; 1), (1,5; 2), (3; 4), (5; 7), (3,5; 5), (4,5; 5), (3,5; 4,5). Mulai dengan pusat di dua titik pertama. Jalankan k-means.</div>
<div class="step">Putaran 1: hanya (1; 1) dekat pusat A. Pusat baru A = (1; 1), B = (3,5; 4,58)
Putaran 2: (1,5; 2) pindah ke A. Pusat baru A = (1,25; 1,5), B = (3,9; 5,1)
Putaran 3: tidak ada yang pindah</div>
<div class="ans">Jawaban: dua kelompok, {(1; 1), (1,5; 2)} dan lima titik lainnya, dengan pusat (1,25; 1,5) dan (3,9; 5,1)</div></div>
<p>Kelemahannya: hasil bergantung pada pusat awal (jalankan beberapa kali, atau pakai k-means++ yang memilih pusat awal saling berjauhan), k harus ditentukan sendiri, dan k-means menganggap kelompok berbentuk bola seukuran. Kelompok memanjang atau bersarang perlu metode lain (DBSCAN, model campuran Gauss).</p>

<h2>Memilih k</h2>
<p>Jumlah kuadrat jarak selalu turun ketika k naik (k = banyak titik memberi nol), jadi tidak bisa dipakai langsung. Cara umum: plot terhadap k dan cari "siku" di mana penurunannya melambat, atau pakai skor <b>silhouette</b> yang membandingkan jarak ke kelompok sendiri dan ke kelompok tetangga. Keduanya petunjuk, bukan bukti; struktur kelompok yang dipilih harus masuk akal dalam konteks data.</p>

<h2>PCA, diingat kembali</h2>
<p>Di 2.8 kita melihat PCA mencari arah sebaran terbesar, yaitu vektor eigen matriks kovarians. Dalam praktik ML, PCA dipakai untuk: memampatkan fitur sebelum model lain, membuang noise di arah bervarians kecil, dan menggambar data berdimensi tinggi di bidang dua dimensi. Untuk gambar, metode nonlinear seperti t-SNE dan UMAP lebih sering dipakai, karena mempertahankan siapa bertetangga dengan siapa, bukan jarak jauh.</p>
<div class="rule">Klasterisasi selalu menghasilkan kelompok, <mark>bahkan pada data acak tanpa struktur</mark>. Kelompok yang ditemukan perlu dicek kestabilannya, bukan langsung dipercaya.</div>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
P = np.array([[1, 1], [1.5, 2], [3, 4], [5, 7], [3.5, 5], [4.5, 5], [3.5, 4.5]])
C = P[:2].copy()
for putaran in range(3):
    label = ((P[:, None] - C)**2).sum(axis=2).argmin(axis=1)
    C = np.array([P[label == k].mean(axis=0) for k in range(2)])
print(label, C.round(2).tolist())   # [0 0 1 1 1 1 1] [[1.25, 1.5], [3.9, 5.1]]</code></pre>
`,
  src: [
    "Hastie, Tibshirani & Friedman, <i>The Elements of Statistical Learning</i> (2e), §14.3.6 “K-means Clustering” dan §14.5 (komponen utama). Lokal.",
    "James dkk., <i>An Introduction to Statistical Learning</i>, Bab 10 “Unsupervised Learning” (PCA, k-means, klasterisasi hierarkis). Lokal.",
    "Bishop, <i>Pattern Recognition and Machine Learning</i>, §9.1 “K-means Clustering” dan Bab 12. Lokal."
  ]
};

/* ───────────────────────── 5.4 ───────────────────────── */
window.LESSONS["5.4"] = {
  title: "Jaringan saraf dan backpropagation",
  pre: "0.2 neuron, 1.8 hasil kali titik, 2.2 aturan rantai, 2.6 matriks, 3.1", min: 0,
  why: "Inilah inti deep learning (jaringan saraf dengan banyak lapis): tumpukan lapis yang masing-masing mengalikan matriks lalu membengkokkan hasilnya, dilatih dengan backpropagation, yaitu aturan rantai yang dihitung dengan cerdas. Setiap model besar, dari pengenal wajah sampai GPT, dilatih dengan algoritma yang sama.",
  body: String.raw`
<h2>Lapis demi lapis</h2>
<p>Neuron dari 0.2 dan 1.8 menghitung <span class="tx">\mathbf{w}\cdot\mathbf{x} + b</span>. Satu lapis berisi banyak neuron sekaligus, jadi ditulis sebagai perkalian matriks (2.6), lalu setiap hasil dilewatkan <b>fungsi aktivasi</b> φ:</p>
<div class="tx d">\mathbf{h} = \varphi(W\mathbf{x} + \mathbf{b})</div>
<p>Fungsi aktivasi paling umum adalah <b>ReLU</b>: <span class="tx">\varphi(z) = \max(0, z)</span>. Nilai negatif dipotong jadi nol, nilai positif diteruskan apa adanya.</p>
<p>Kenapa harus ada pembengkok? Tanpa φ, dua lapis berturut-turut hanya <span class="tx">W_2(W_1\mathbf{x}) = (W_2W_1)\mathbf{x}</span>, tetap satu matriks: setinggi apa pun tumpukannya, model hanya bisa menggambar garis lurus. Dengan φ, Cybenko (1989) dan Hornik dkk. (1989) membuktikan bahwa satu hidden layer yang cukup lebar bisa mendekati fungsi kontinu apa pun (teorema pendekatan universal).</p>

<h2>Contoh kecil: maju</h2>
<div class="ex"><div class="q">x = [1; 2]. Lapis 1: W₁ = [[0,5; −1]; [1; 0,5]], tanpa bias, ReLU. Lapis 2: w₂ = [1; −1]. Target t = 1, loss ½(ŷ − t)². Hitung maju.</div>
<div class="step">z = W₁x = [0,5 − 2; 1 + 1] = [−1,5; 2]
h = ReLU(z) = [0; 2]
ŷ = w₂ · h = 0 − 2 = −2
L = ½(−2 − 1)² = 4,5</div>
<div class="ans">Jawaban: ŷ = −2, loss 4,5</div></div>

<h2>Contoh kecil: mundur</h2>
<p>Sekarang hitung gradien setiap bobot, mulai dari loss dan berjalan mundur dengan aturan rantai (2.2):</p>
<div class="ex"><div class="q">Lanjutkan: cari ∂L/∂w₂ dan ∂L/∂W₁.</div>
<div class="step">∂L/∂ŷ = ŷ − t = −3
∂L/∂w₂ = −3 · h = [0; −6]
∂L/∂h = −3 · w₂ = [−3; 3]
∂L/∂z = ∂L/∂h × ReLU'(z) = [−3 × 0; 3 × 1] = [0; 3]
∂L/∂W₁ = ∂L/∂z · xᵀ = [[0; 0]; [3; 6]]</div>
<div class="ans">Jawaban: ∂L/∂w₂ = [0; −6], ∂L/∂W₁ = [[0; 0]; [3; 6]]. Baris pertama W₁ mendapat gradien nol, karena neuronnya mati (z negatif, dipotong ReLU).</div></div>
<p>Dua langkah di atas perlu dijelaskan. <b>ReLU'(z)</b>, turunan ReLU, bernilai 0 kalau z negatif (grafiknya datar di sana) dan 1 kalau z positif (grafiknya garis miring 45°). Tepat di z = 0 turunannya tidak terdefinisi; dalam praktik biasanya dipakai 0. Lalu <span class="tx">\partial L/\partial z \cdot \mathbf{x}^\top</span> adalah vektor kolom kali vektor baris, kebalikan dari aᵀb di 2.6. Hasilnya bukan satu angka, melainkan tabel: baris ke-i, kolom ke-j berisi (∂L/∂z)ᵢ × xⱼ. Di sini [0; 3] kali [1, 2] memberi [[0 × 1; 0 × 2]; [3 × 1; 3 × 2]] = [[0; 0]; [3; 6]]. Artinya masuk akal: bobot W₁ baris i, kolom j menghubungkan masukan j ke neuron i, jadi gradiennya = sinyal kesalahan neuron i × besar masukan j. Secara umum, turunan vektor terhadap vektor adalah sebuah matriks yang disebut <b>Jacobian</b>, dan backpropagation adalah aturan rantai (2.2) yang berubah menjadi perkalian matriks-matriks ini.</p>
<p>Inilah <b>backpropagation</b> (Rumelhart, Hinton &amp; Williams, 1986): satu lintasan maju menyimpan semua nilai antara, satu lintasan mundur menghitung semua gradien sekaligus, dengan biaya kira-kira dua kali lintasan maju. Tanpa trik ini, model bermiliar bobot mustahil dilatih. Pustaka seperti PyTorch melakukannya otomatis (autodiff).</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
x = np.array([1., 2.]); W1 = np.array([[0.5, -1.], [1., 0.5]]); w2 = np.array([1., -1.]); t = 1.
z = W1 @ x; h = np.maximum(z, 0); y = w2 @ h
print(z, h, y, 0.5 * (y - t)**2)       # [-1.5  2. ] [0. 2.] -2.0 4.5
dy = y - t; dz = dy * w2 * (z > 0)
print(dy * h, np.outer(dz, x))
# [-0. -6.] [[-0. -0.]
#  [ 3.  6.]]</code></pre>
`,
  src: [
    "Rumelhart, Hinton & Williams (1986), “Learning representations by back-propagating errors”, <i>Nature</i> 323. Lokal.",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, Bab 6, §6.5 “Back-Propagation and Other Differentiation Algorithms”. Lokal.",
    "Cybenko (1989), “Approximation by superpositions of a sigmoidal function”; Hornik, Stinchcombe & White (1989), “Multilayer feedforward networks are universal approximators”. Lokal.",
    "Baydin dkk. (2018), “Automatic Differentiation in Machine Learning: a Survey”. Lokal."
  ]
};

/* ───────────────────────── 5.5 ───────────────────────── */
window.LESSONS["5.5"] = {
  title: "CNN",
  pre: "3.6 konvolusi, 5.4", min: 0,
  why: "Convolutional neural network adalah arsitektur yang membuat komputer melihat. AlexNet (2012) memenangkan kompetisi ImageNet dengan selisih jauh dan memulai ledakan deep learning. CNN masih dipakai di kamera ponsel, pencitraan medis, mobil otonom, dan sebagai bagian model difusi.",
  body: String.raw`
<h2>Susunan sebuah CNN</h2>
<p>CNN menumpuk tiga jenis lapis:</p>
<ul><li><b>Konvolusi</b> (3.6): puluhan sampai ratusan kernel kecil yang dipelajari, masing-masing menghasilkan satu <b>peta fitur</b>, diikuti ReLU.</li>
<li><b>Pooling</b>: perkecil peta fitur, misalnya ambil nilai terbesar di setiap kotak 2 × 2 (max pooling). Ukurannya terbagi dua, dan pergeseran kecil gambar tidak lagi mengubah hasil.</li>
<li><b>Lapis penuh</b> di ujung: ratakan peta fitur menjadi vektor, lalu klasifikasi dengan softmax (4.2).</li></ul>

<h2>Menghitung ukuran dan bobot</h2>
<div class="ex"><div class="q">Masukan gambar RGB 32 × 32. Lapis konvolusi: 64 kernel 3 × 3, padding 1, stride 1. Lalu max pooling 2 × 2. Berapa ukuran keluaran dan berapa bobotnya?</div>
<div class="step">Ukuran setelah konvolusi: (32 + 2·1 − 3)/1 + 1 = 32, jadi 32 × 32 × 64
Bobot satu kernel: 3 × 3 × 3 kanal = 27, ditambah 1 bias = 28
Seluruh lapis: 28 × 64 = 1.792
Setelah pooling: 16 × 16 × 64</div>
<div class="ans">Jawaban: 16 × 16 × 64, dengan 1.792 bobot. Lapis penuh dari 3.072 piksel ke 65.536 keluaran butuh lebih dari 200 juta bobot.</div></div>

<h2>Dari tepi ke benda</h2>
<p>Setiap lapis melihat wilayah yang makin luas dari gambar asli (receptive field). Tiga lapis 3 × 3 berturut-turut melihat kotak 7 × 7. Ketika jaringan dilatih, lapis awal belajar pendeteksi tepi dan warna, lapis tengah tekstur dan pola, lapis akhir bagian benda seperti mata atau roda. Tidak ada yang memrogram hierarki ini; ia muncul dari gradient descent.</p>

<h2>Lebih dalam dengan jalan pintas</h2>
<p>Menumpuk lapis lebih banyak semestinya membantu, tapi di atas belasan lapis pelatihan justru memburuk: gradien sulit mengalir mundur. ResNet (He dkk., 2016) menambahkan <b>residual connection</b>: keluaran lapis = <span class="tx">\mathbf{x} + F(\mathbf{x})</span>. Lapis hanya perlu mempelajari perubahan kecil, dan gradien bisa melewati jalan pintas tanpa melemah. Dengan trik ini jaringan 152 lapis bisa dilatih, dan residual connection kini ada di hampir setiap arsitektur, termasuk Transformer.</p>

<h2>Periksa dengan Python</h2>
<pre><code>n, k, pad, stride, kanal, banyak = 32, 3, 1, 1, 3, 64
keluar = (n + 2 * pad - k) // stride + 1
print(keluar, (k * k * kanal + 1) * banyak, keluar // 2)   # 32 1792 16</code></pre>
`,
  src: [
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, Bab 9 (§9.3 “Pooling”). Lokal.",
    "LeCun dkk. (1998), “Gradient-based learning applied to document recognition”; Krizhevsky, Sutskever & Hinton (2012), “ImageNet classification with deep convolutional neural networks”. Lokal.",
    "He dkk. (2016), “Deep Residual Learning for Image Recognition”, <i>CVPR</i>. Lokal."
  ]
};

/* ───────────────────────── 5.6 ───────────────────────── */
window.LESSONS["5.6"] = {
  title: "RNN dan LSTM",
  pre: "5.4, 2.2 sigmoid, 2.7 nilai eigen", min: 0,
  why: "Teks, suara, dan deret waktu datang berurutan. Recurrent neural network membaca satu langkah demi satu sambil membawa ingatan. Masalah vanishing gradient pada RNN, dan solusi gate di LSTM, adalah pelajaran penting yang menjelaskan kenapa Transformer dan Mamba dirancang seperti sekarang.",
  body: String.raw`
<h2>Satu sel, dipakai berulang</h2>
<p>RNN menyimpan <b>hidden state</b> <span class="tx">\mathbf{h}_t</span>, ringkasan semua yang sudah dibaca. Di setiap langkah, keadaan baru dihitung dari keadaan lama dan masukan baru, dengan bobot yang sama setiap langkah:</p>
<div class="tx d">\mathbf{h}_t = \tanh(W\mathbf{h}_{t-1} + U\mathbf{x}_t + \mathbf{b})</div>
<p><b>tanh</b> (tangen hiperbolik) adalah fungsi aktivasi berbentuk S seperti sigmoid (2.2), tapi keluarannya dari −1 sampai 1, bukan 0 sampai 1. Rumusnya tanh(z) = (eᶻ − e⁻ᶻ)/(eᶻ + e⁻ᶻ), dan ternyata tanh(z) = 2σ(2z) − 1. Contoh: tanh(0) = 0, tanh(1) ≈ 0,762.</p>
<p>Dilatih dengan backpropagation yang dibentangkan sepanjang waktu (backpropagation through time): jaringan dianggap sebagai tumpukan lapis sebanyak panjang urutan, semuanya berbagi bobot.</p>

<h2>Masalahnya: vanishing gradient atau meledak</h2>
<p>Untuk mengalirkan sinyal kesalahan dari langkah 50 ke langkah 1, aturan rantai mengalikan turunan sebanyak 50 kali. Kalau setiap faktor sekitar 0,9:</p>
<div class="tx d">0{,}9^{50} \approx 0{,}005, \qquad 1{,}1^{50} \approx 117</div>
<p>Faktor sedikit di bawah 1: vanishing gradient, dan model tidak bisa belajar hubungan jarak jauh ("kucing yang ... sedang tidur" butuh mengingat subjek). Faktor sedikit di atas 1: exploding gradient. Untuk matriks, yang menentukan adalah nilai eigen (2.7) W. Bengio dkk. (1994) dan Pascanu dkk. (2013) menganalisisnya; ledakan biasa diatasi dengan memotong panjang gradien (gradient clipping), tapi lenyapnya lebih sulit.</p>

<h2>LSTM: jalur ingatan dengan gate</h2>
<p>Hochreiter &amp; Schmidhuber (1997) menambahkan <b>memory cell</b> <span class="tx">\mathbf{c}_t</span> yang diperbarui dengan penjumlahan, bukan perkalian berulang. Versi aslinya hanya punya input gate dan output gate; forget gate (f di bawah) baru ditambahkan Gers, Schmidhuber &amp; Cummins (2000). Bentuk yang dipakai sekarang:</p>
<div class="tx d">\mathbf{c}_t = \mathbf{f}_t \odot \mathbf{c}_{t-1} + \mathbf{i}_t \odot \tilde{\mathbf{c}}_t</div>
<p>c̃ₜ adalah calon isi baru, dihitung seperti h pada RNN biasa (tanh dari input dan h sebelumnya). f (forget gate) dan i (input gate) adalah angka antara 0 dan 1 dari sigmoid, dipelajari dari data, dan ⊙ berarti kali per elemen. Kalau f ≈ 1, ingatan dibawa utuh dan gradien mengalir tanpa melemah, seperti jalan pintas ResNet (5.5). Gate ketiga (output gate) memilih bagian ingatan yang ditampilkan sebagai <span class="tx">\mathbf{h}_t</span>. GRU (Cho dkk., 2014) adalah versi yang lebih sederhana dengan dua gate (update gate dan reset gate).</p>

<h2>Batas RNN</h2>
<p>LSTM menguasai terjemahan mesin dan pengenalan suara sekitar 2014–2017. Tapi ia tetap membaca satu langkah demi satu, sehingga tidak bisa memanfaatkan GPU yang suka mengerjakan banyak hal sekaligus, dan ingatan jarak jauhnya tetap terbatas. Attention (5.7) menyelesaikan keduanya dengan membiarkan setiap posisi melihat langsung ke semua posisi lain.</p>

<h2>Periksa dengan Python</h2>
<pre><code>print(round(0.9**50, 5), round(1.1**50, 1))   # 0.00515 117.4</code></pre>
`,
  src: [
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, Bab 10, §10.7 “The Challenge of Long-Term Dependencies” dan §10.10 “The Long Short-Term Memory and Other Gated RNNs”. Lokal.",
    "Hochreiter & Schmidhuber (1997), “Long Short-Term Memory”, <i>Neural Computation</i>; Gers, Schmidhuber & Cummins (2000), “Learning to Forget: Continual Prediction with LSTM”, dirujuk lewat Goodfellow §10.10; Cho dkk. (2014), RNN encoder–decoder (GRU). Lokal.",
    "Bengio, Simard & Frasconi (1994), “Learning long-term dependencies with gradient descent is difficult”. Lokal. Pascanu, Mikolov & Bengio (2013), “On the difficulty of training recurrent neural networks”, dirujuk lewat Goodfellow §10.7 dan §10.11."
  ]
};

/* ───────────────────────── 5.7 ───────────────────────── */
window.LESSONS["5.7"] = {
  title: "Attention dan Transformer",
  pre: "1.8 perkalian titik, 2.6, 4.2 softmax, 5.4, 5.5 residual connection", min: 0,
  why: "Transformer adalah arsitektur di balik GPT, Claude, Gemini, BERT, dan model gambar modern. Inti barunya hanya satu rumus: attention, cara setiap kata memutuskan kata lain mana yang perlu diperhatikan. Rumus itu dibangun sepenuhnya dari alat yang sudah kamu pelajari: perkalian titik, matriks, dan softmax.",
  body: String.raw`
<h2>Gagasannya: mencari di kamus yang lentur</h2>
<p class="adegan">Ambil kalimat "Rina menaruh kunci di meja karena ia buru-buru". Saat membaca kata "ia", kamu otomatis menoleh ke belakang dan memutuskan kata mana yang dirujuk. Attention melakukan hal yang sama secara angka: kata "ia" memberi perhatian besar ke "Rina", perhatian kecil ke "kunci" dan "meja", lalu maknanya diperkaya dengan campuran kata-kata itu sesuai besar perhatiannya.</p>
<p>Bayangkan kamus: kamu punya pertanyaan (<b>query</b>), setiap entri punya <b>key</b> (kata kunci) dan <b>value</b> (isi). Kamus biasa mengembalikan isi dari kunci yang persis cocok. Attention mengembalikan <b>campuran</b> semua isi, dengan bobot sesuai seberapa cocok setiap kunci dengan pertanyaan.</p>
<p>Kecocokan diukur dengan perkalian titik (1.8): vektor yang searah memberi skor tinggi. Skor diubah menjadi bobot dengan softmax (4.2):</p>
<div class="tx d">\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d}}\right) V</div>
<p>Pembagian dengan <span class="tx">\sqrt{d}</span> (d = banyaknya komponen vektor) menjaga skor tidak terlalu besar ketika d besar. Ia bekerja seperti suhu (4.2): tanpa itu, softmax terlalu tajam, hampir semua bobot jatuh ke satu kunci. Peluang yang sudah hampir 1 atau hampir 0 hampir tidak berubah walau skornya digeser (turunannya p(1 − p), mirip sigmoid di 2.2), jadi gradiennya nyaris nol dan model berhenti belajar.</p>
<div class="ex"><div class="q">Query q = [1; 0]. Tiga kunci: k₁ = [1; 0], k₂ = [0; 1], k₃ = [1; 1]. Value: v₁ = [10; 0], v₂ = [0; 10], v₃ = [5; 5]. Hitung keluaran attention.</div>
<div class="step">Skor q·k ÷ √2: [1; 0; 1] ÷ 1,414 = [0,707; 0; 0,707]
Softmax: [0,401; 0,198; 0,401]
Keluaran: 0,401·[10; 0] + 0,198·[0; 10] + 0,401·[5; 5]</div>
<div class="ans">Jawaban: [6,02; 3,98]. Kunci yang searah dengan query (k₁ dan k₃) mendapat bobot terbesar.</div></div>

<h2>Self-attention</h2>
<p>Dalam Transformer, setiap kata (token) menghasilkan query, key, dan value miliknya sendiri lewat tiga matriks yang dipelajari: <span class="tx">Q = XW_Q,\ K = XW_K,\ V = XW_V</span>. Lalu setiap token memperhatikan semua token lain. Kata "dia" dalam "Ani memberi Budi buku karena dia baik" bisa memberi bobot besar pada "Ani". Semua posisi dihitung bersamaan sebagai satu perkalian matriks, sempurna untuk GPU.</p>
<p><b>Multi-head</b>: beberapa attention dijalankan berdampingan dengan matriks berbeda, sehingga satu kepala bisa melacak tata bahasa, kepala lain melacak siapa merujuk siapa. Karena attention tidak peduli urutan, posisi setiap token disuntikkan sebagai vektor tambahan (positional encoding): setiap posisi i mendapat vektor berisi sin dan cos (0.6) dengan frekuensi berbeda-beda (Vaswani dkk., 2017), yang ditambahkan ke vektor tokennya. Tanpa itu, "Ani memukul Budi" dan "Budi memukul Ani" terlihat sama bagi attention.</p>

<h2>Satu blok Transformer</h2>
<p>Vaswani dkk. (2017) menyusun satu blok: self-attention, lalu jaringan dua lapis per token (MLP), masing-masing dibungkus residual connection (5.5) dan layer normalization (menjaga angka tetap di kisaran wajar; dibahas di 5.9). Model besar menumpuk puluhan blok ini. Untuk model bahasa, attention diberi topeng supaya setiap token hanya melihat token sebelumnya (causal), karena tugasnya menebak token berikutnya (5.13).</p>
<div class="rule">Kelebihan: setiap token melihat langsung ke semua token, tanpa ingatan yang memudar seperti RNN. Harga: biaya attention tumbuh seperti <mark>n²</mark> untuk n token. Konteks dua kali lebih panjang, empat kali lebih mahal.</div>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
q = np.array([1, 0.]); K = np.array([[1, 0], [0, 1], [1, 1.]]); V = np.array([[10, 0], [0, 10], [5, 5.]])
skor = K @ q / np.sqrt(2); w = np.exp(skor) / np.exp(skor).sum()
print(w.round(3), (w @ V).round(2))   # [0.401 0.198 0.401] [6.02 3.98]</code></pre>
`,
  src: [
    "Vaswani dkk. (2017), “Attention Is All You Need”, <i>NIPS 2017</i> (sekarang bernama NeurIPS). Lokal.",
    "Bahdanau, Cho & Bengio (2015), “Neural Machine Translation by Jointly Learning to Align and Translate” (attention pertama). Lokal.",
    "Ba, Kiros & Hinton (2016), “Layer Normalization”; Dao dkk. (2022), “FlashAttention”. Lokal."
  ]
};

/* ───────────────────────── 5.8 ───────────────────────── */
window.LESSONS["5.8"] = {
  title: "SSM dan Mamba",
  pre: "3.6 konvolusi, 3.7 ODE, 4.5, 5.6, 5.7", min: 0,
  why: "Attention mahal untuk teks yang sangat panjang (biayanya n²). State space model (SSM) seperti S4 dan Mamba membaca urutan dengan biaya sebanding n, seperti RNN, tapi bisa dilatih secepat CNN. Mereka menghubungkan ODE dari Lapis 3 dengan model bahasa modern, dan kini dipakai dalam model hibrida bersama attention.",
  body: String.raw`
<h2>Kembali ke ODE linear</h2>
<p class="adegan">Bayangkan kamu membaca novel tebal tapi hanya boleh membawa satu kartu catatan kecil. Di setiap halaman, kamu memperbarui kartu itu dengan sebagian isi lama yang masih penting ditambah informasi baru, dan semua pertanyaan tentang cerita harus dijawab hanya dari kartu itu. Kartu itulah hidden state, SSM adalah aturan matematis untuk memperbaruinya, dan Mamba menambahkan kemampuan memilih, yaitu memutuskan bagian mana yang layak dicatat dan mana yang boleh dilewati.</p>
<p>SSM berangkat dari sistem kontrol klasik: hidden state h(t) berubah menurut ODE linear (3.7) yang digerakkan masukan x(t), lalu keluaran y dibaca dari keadaan:</p>
<div class="tx d">\frac{d\mathbf{h}}{dt} = A\mathbf{h} + B x, \qquad y = C\mathbf{h}</div>
<p>Untuk data berlangkah diskret (token), ODE ini diubah menjadi aturan langkah, misalnya dengan ukuran langkah Δ:</p>
<div class="tx d">\mathbf{h}_t = \bar A\,\mathbf{h}_{t-1} + \bar B\,x_t, \qquad y_t = C\,\mathbf{h}_t</div>
<p>Ini mirip RNN (5.6), dengan satu perbedaan penting: <b>tidak ada tanh</b>. Semuanya linear.</p>

<h2>Linear berarti bisa jadi konvolusi</h2>
<p>Ambil keadaan berdimensi satu dengan <span class="tx">\bar A = a</span>, <span class="tx">\bar B = C = 1</span>. Masukan di langkah s menyumbang <span class="tx">a^{t-s} x_s</span> ke keluaran di langkah t. Jadi keluarannya adalah konvolusi (3.6) masukan dengan kernel <span class="tx">[1, a, a^2, a^3, \dots]</span>:</p>
<div class="ex"><div class="q">a = 0,9, masukan [1; 0; 0; 0; 2; 0]. Hitung keluaran dengan rekursi dan dengan konvolusi.</div>
<div class="step">Rekursi h ← 0,9h + x: 1; 0,9; 0,81; 0,729; 0,729·0,9 + 2 = 2,656; 2,39
Konvolusi dengan [1; 0,9; 0,81; …]: hasil yang sama</div>
<div class="ans">Jawaban: [1; 0,9; 0,81; 0,729; 2,656; 2,39], dua cara, satu hasil</div></div>
<p>Inilah keunggulan SSM: saat <b>pelatihan</b>, hitung sebagai konvolusi panjang sekaligus (paralel, cepat di GPU, bisa lewat FFT); saat <b>menghasilkan teks</b>, hitung sebagai rekursi (biaya tetap per token, ingatan berukuran tetap). Nilai a menentukan berapa lama ingatan bertahan: a = 0,9 membuat masukan tinggal 35% setelah 10 langkah. Gu dkk. (2022, S4) menurunkan matriks A khusus (HiPPO) supaya keadaan mengingat sejarah panjang secara teratur.</p>

<h2>Mamba: SSM yang memilih</h2>
<p>SSM linear memperlakukan setiap token sama: kernelnya tetap. Itu kelemahan untuk bahasa, di mana sebagian kata penting dan sebagian tidak. Mamba (Gu &amp; Dao, 2023) membuat Δ, B, dan C bergantung pada token masukan. Langkah Δ besar berarti "simpan token ini kuat-kuat dan lupakan yang lama"; Δ kecil berarti "abaikan token ini". Ini mirip gate LSTM (5.6), tapi dengan trik perangkat keras (scan paralel) supaya tetap cepat. Konsekuensinya, bentuk konvolusi hilang karena kernelnya berubah-ubah.</p>
<p>Mamba-2 (Dao &amp; Gu, 2024) menunjukkan bahwa SSM terpilih dan attention berkerabat dekat: keduanya bisa ditulis sebagai perkalian matriks dengan struktur tertentu. Banyak model terbaru mencampur lapis attention dan lapis SSM.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
x = np.array([1, 0, 0, 0, 2, 0.]); a = 0.9; h = 0; keluar = []
for v in x:
    h = a * h + v; keluar.append(float(round(h, 3)))
print(keluar)                                         # [1.0, 0.9, 0.81, 0.729, 2.656, 2.39]
print(np.convolve(x, a ** np.arange(6))[:6].round(3)) # [1.    0.9   0.81  0.729 2.656 2.39 ]</code></pre>
`,
  src: [
    "Gu, Goel & Ré (2022), “Efficiently Modeling Long Sequences with Structured State Spaces” (S4), <i>ICLR</i>; Gu dkk. (2020), “HiPPO”. Lokal.",
    "Gu dkk. (2021), “Combining Recurrent, Convolutional, and Continuous-time Models with Linear State Space Layers”. Lokal.",
    "Gu & Dao (2023), “Mamba: Linear-Time Sequence Modeling with Selective State Spaces”; Dao & Gu (2024), “Transformers are SSMs” (Mamba-2). Lokal."
  ]
};
