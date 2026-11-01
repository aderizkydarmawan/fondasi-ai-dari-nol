/* Lapis 6: benang merah lintas lapis (6.1–6.3) dan membaca paper asli (6.4–6.6).
   Semua angka dihitung ulang dengan Python; nomor bagian dan persamaan paper dicek di salinan lokal (pustaka/md). */

/* ───────────────────────── 6.1 ───────────────────────── */
window.LESSONS["6.1"] = {
  title: "Benang merah: energi, softmax, dan temperature",
  pre: "4.1, 4.2, 5.13", min: 0,
  why: "Tiga hal yang kamu pelajari terpisah, yaitu distribusi Boltzmann di fisika, softmax di jaringan saraf, dan tombol temperature di ChatGPT, sebenarnya satu rumus yang sama. Kalau benang ini terlihat, kamu tidak perlu menghafal tiga hal.",
  body: String.raw`
<h2>Satu rumus, tiga nama</h2>
<p>Di 4.2 kamu bertemu distribusi Boltzmann: keadaan dengan energi rendah lebih mungkin, dan suhu T mengatur seberapa ketat aturan itu.</p>
<div class="tx d">p_i = \frac{e^{-E_i/T}}{\sum_j e^{-E_j/T}}</div>
<p>Di jaringan saraf, lapisan terakhir mengeluarkan skor mentah z (disebut <b>logit</b>), lalu softmax mengubahnya jadi peluang (4.2):</p>
<div class="tx d">\text{softmax}(z)_i = \frac{e^{z_i}}{\sum_j e^{z_j}}</div>
<p>Keduanya rumus yang sama kalau kamu menulis <span class="tx">z_i = -E_i/T</span>. Skor tinggi sama dengan energi rendah. Jadi jaringan yang mengeluarkan logit sedang memberi "energi" ke setiap pilihan, dan softmax adalah fisika Boltzmann dengan T = 1.</p>
<div class="rule">Logit = minus energi. Softmax = distribusi Boltzmann pada suhu 1. Membagi logit dengan T = mengubah suhu.</div>

<h2>Temperature di LLM</h2>
<p>LLM memilih token berikutnya dari softmax atas logit semua token (5.13). Tombol <b>temperature</b> membagi logit dengan T sebelum softmax. Ambil logit [2; 1; 0] untuk tiga token:</p>
<div class="tbl"><table><tr><th>T</th><th>token A</th><th>token B</th><th>token C</th><th>sifat</th></tr>
<tr><td>0,5</td><td>0,867</td><td>0,117</td><td>0,016</td><td>dingin: hampir selalu A</td></tr>
<tr><td>1</td><td>0,665</td><td>0,245</td><td>0,090</td><td>softmax biasa</td></tr>
<tr><td>2</td><td>0,506</td><td>0,307</td><td>0,186</td><td>panas: lebih acak</td></tr></table></div>
<p>Persis seperti gas di 4.1: suhu rendah membuat partikel berkumpul di energi terendah, suhu tinggi membuatnya menyebar ke semua keadaan. Ketika T mendekati 0, model selalu memilih token dengan logit terbesar (disebut <i>greedy</i>). Ketika T sangat besar, semua token mendekati sama mungkin.</p>

<div class="ex"><div class="q">Dengan logit [2; 1; 0] dan T = 0,5, berapa peluang token A?</div>
<div class="step">Bagi logit dengan T: [4; 2; 0]. Pangkatkan: e⁴ ≈ 54,60, e² ≈ 7,389, e⁰ = 1. Jumlah ≈ 62,99.</div>
<div class="ans">Jawaban: 54,60 ÷ 62,99 ≈ 0,867</div></div>

<h2>Jejak sejarahnya</h2>
<p>Ini bukan kebetulan. Mesin Boltzmann (Ackley, Hinton &amp; Sejnowski, 1985) memakai parameter T yang mereka sebut berperan seperti suhu, dan melatih jaringan dengan mulai dari suhu tinggi lalu menurunkannya pelan-pelan (<i>simulated annealing</i>). Nama "temperature" di LLM adalah warisan langsung dari sana. Laporan GPT-3 (Brown dkk., 2020) misalnya menulis bahwa sebagian contoh teksnya diambil pada temperature 1.</p>
<p>Benang ini berlanjut ke energi bebas (4.3): log dari penyebut softmax, <span class="tx">\log \sum_j e^{z_j}</span>, adalah versi jaringan saraf dari energi bebas, dan batas bawah ELBO di VAE (6.6) adalah energi bebas dengan tanda dibalik.</p>

<h2>Di mana analogi ini berhenti</h2>
<p>Temperature di LLM hanya tombol pembagi angka. Tidak ada partikel, tidak ada panas, tidak ada konstanta Boltzmann. Yang terbawa dari fisika hanya bentuk matematikanya. Jangan juga menyimpulkan bahwa T = 0 membuat model "benar": T kecil membuat model konsisten memilih tebakan terkuatnya, dan tebakan terkuat itu bisa saja salah.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
z = np.array([2.0, 1.0, 0.0])
for T in (0.5, 1, 2):
    p = np.exp(z / T) / np.exp(z / T).sum()
    print(T, np.round(p, 3).tolist())
# 0.5 [0.867, 0.117, 0.016]
# 1 [0.665, 0.245, 0.09]
# 2 [0.506, 0.307, 0.186]</code></pre>
`,
  src: [
    "Kittel &amp; Kroemer, <i>Thermal Physics</i> (2e), Bab 3 “Boltzmann Distribution and Helmholtz Free Energy”. Lokal.",
    "Goodfellow, Bengio &amp; Courville, <i>Deep Learning</i>, §6.2.2.3 “Softmax Units for Multinoulli Output Distributions”. Lokal.",
    "Ackley, Hinton &amp; Sejnowski (1985), “A Learning Algorithm for Boltzmann Machines”, <i>Cognitive Science</i> (persamaan 5: T berperan seperti suhu; annealing dari suhu tinggi). Lokal.",
    "Brown dkk. (2020), “Language Models are Few-Shot Learners” (GPT-3), bagian contoh keluaran: diambil pada temperature 1 dengan nucleus sampling P = 0,9. Lokal."
  ]
};

/* ───────────────────────── 6.2 ───────────────────────── */
window.LESSONS["6.2"] = {
  title: "Benang merah: noise, dari varians sampai difusi",
  pre: "1.7, 2.10, 4.4, 4.5, 5.10, 5.12", min: 0,
  why: "Noise muncul di hampir setiap lapis: sebagai varians di statistik, gerak Brown di fisika, trik reparameterisasi di VAE, dan bahan baku model difusi. Ini satu ide yang tumbuh, bukan lima ide terpisah.",
  body: String.raw`
<h2>Langkah 1: varians mengukur sebaran</h2>
<p>Varians adalah rata-rata kuadrat jarak ke rata-rata (1.7). Untuk variabel acak saling bebas, variansnya <b>dijumlahkan</b> (2.10):</p>
<div class="tx d">\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)</div>
<p>Satu aturan kecil ini menjelaskan hampir semua yang menyusul.</p>

<h2>Langkah 2: banyak dorongan kecil menjadi gerak Brown</h2>
<p>Jalan acak (4.4) menjumlahkan langkah ±1 yang saling bebas, masing-masing bervarians 1. Setelah n langkah, variansnya n, jadi jarak khasnya √n. Di batas langkah yang sangat kecil dan sangat banyak, jalan acak menjadi gerak Brown W, yang variansnya tumbuh lurus terhadap waktu. Einstein (1905) memakai fakta ini untuk menghitung ukuran molekul dari partikel yang bergoyang di air.</p>
<div class="rule">Noise bebas tidak saling membatalkan sempurna: variansnya bertambah, jadi sebarannya tumbuh seperti √n atau √t.</div>

<h2>Langkah 3: noise yang ditambahkan ke persamaan</h2>
<p>Persamaan diferensial stokastik (4.5) menambahkan sedikit gerak Brown di setiap langkah waktu: <span class="tx">dx = f(x)\,dt + g\,dW</span>. Dinamika Langevin (4.7) adalah kasus khusus: turuni lembah energi sambil diguncang noise, dan hasil akhirnya adalah distribusi Boltzmann. Persamaan Fokker–Planck (4.6) menjelaskan bagaimana seluruh awan kemungkinan menyebar.</p>

<h2>Langkah 4: noise yang bisa diturunkan</h2>
<p>VAE (5.10) perlu mengambil sampel acak di tengah jaringan, padahal backpropagation butuh turunan. Triknya: ambil noise standar ε dulu, lalu geser dan regangkan, <span class="tx">z = \mu + \sigma\varepsilon</span>. Keacakan dipindah ke ε yang tidak punya parameter, sehingga μ dan σ bisa diturunkan. Rumus geser-regang ini adalah sifat varians yang sama: <span class="tx">\operatorname{Var}(\sigma\varepsilon) = \sigma^2</span>.</p>

<h2>Langkah 5: difusi menjalankan semuanya mundur</h2>
<p>Model difusi (5.12) mencampur gambar dengan noise pakai rumus reparameterisasi yang sama:</p>
<div class="tx d">x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\varepsilon</div>
<p>Kalau <span class="tx">x_0</span> bervarians 1, varians <span class="tx">x_t</span> adalah <span class="tx">\bar\alpha_t + (1 - \bar\alpha_t) = 1</span> berkat aturan penjumlahan varians di langkah 1. Karena itu Song dkk. (2021) menamai proses DDPM <i>Variance Preserving SDE</i>: ia adalah SDE dari langkah 3 yang menjaga varians tetap. Ho dkk. (2020) juga mencatat bahwa langkah pembuatan gambarnya mirip dinamika Langevin, dengan jaringan sebagai penebak arah turun energi.</p>
<div class="tbl"><table><tr><th>lapis</th><th>bentuk noise</th><th>pelajaran</th></tr>
<tr><td>1–2</td><td>varians, varians dijumlahkan</td><td>1.7, 2.10</td></tr>
<tr><td>4</td><td>jalan acak, gerak Brown, SDE, Langevin</td><td>4.4, 4.5, 4.7</td></tr>
<tr><td>5</td><td>reparameterisasi, difusi</td><td>5.10, 5.12</td></tr></table></div>

<h2>Di mana gambaran ini terlalu sederhana</h2>
<p>Aturan "varians dijumlahkan" hanya berlaku kalau noise-nya saling bebas, atau minimal tidak berkorelasi (2.12). Di pasar keuangan atau data deret waktu, guncangan sering saling terkait, dan sebarannya bisa tumbuh lebih cepat atau lebih lambat dari √t. Model difusi sendiri juga sengaja memilih noise normal yang bebas karena perhitungannya jadi rapi, bukan karena data aslinya begitu.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
rng = np.random.default_rng(0)
akhir = rng.choice([-1, 1], size=(20000, 100)).sum(axis=1)
print(round(akhir.var(), 1), round(akhir.std(), 2))  # 99.4 9.97 (teori: 100 dan 10)
x0 = rng.standard_normal(200000); eps = rng.standard_normal(200000)
abar = 0.2803 ** 2  # nilai di langkah 500 dari tabel 5.12
xt = np.sqrt(abar) * x0 + np.sqrt(1 - abar) * eps
print(round(xt.var(), 3))  # 0.996 (teori: 1)</code></pre>
`,
  src: [
    "Grinstead &amp; Snell, <i>Introduction to Probability</i>, §6.2 “Variance of Discrete Random Variables” dan §12.1 “Random Walks in Euclidean Space”. Lokal (gratis).",
    "Einstein (1905), “Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen”, <i>Annalen der Physik</i>. Lokal.",
    "Kingma &amp; Welling (2014), “Auto-Encoding Variational Bayes”, §2.4 “The reparameterization trick”. Lokal.",
    "Ho, Jain &amp; Abbeel (2020), “Denoising Diffusion Probabilistic Models”, §3.2 (Algoritme 2 mirip dinamika Langevin). Song dkk. (2021), “Score-Based Generative Modeling through SDEs”, §3.4 (VE dan VP SDE). Lokal."
  ]
};

/* ───────────────────────── 6.3 ───────────────────────── */
window.LESSONS["6.3"] = {
  title: "Benang merah: informasi, dari entropi sampai perplexity",
  pre: "1.5, 3.2, 3.4, 5.13", min: 0,
  why: "Loss hampir semua classifier dan LLM, angka perplexity di laporan model bahasa, dan bagian KL di VAE dan difusi berasal dari satu keluarga rumus yang dimulai Shannon pada 1948.",
  body: String.raw`
<h2>Empat rumus, satu keluarga</h2>
<p>Ambil distribusi asli p = [0,5; 0,25; 0,25] dan tebakan model q = [1/3; 1/3; 1/3]. Semua angka di bawah memakai log₂, jadi satuannya bit (3.4).</p>
<div class="tbl"><table><tr><th>ukuran</th><th>rumus</th><th>nilai</th><th>arti</th></tr>
<tr><td>entropi</td><td><span class="tx">H(p) = -\sum p_i \log p_i</span></td><td>1,5</td><td>kejutan rata-rata kalau kamu tahu p</td></tr>
<tr><td>cross-entropy</td><td><span class="tx">H(p, q) = -\sum p_i \log q_i</span></td><td>1,585</td><td>kejutan rata-rata kalau kamu memakai q</td></tr>
<tr><td>KL</td><td><span class="tx">D_{\text{KL}}(p \,\|\, q) = H(p, q) - H(p)</span></td><td>0,085</td><td>kejutan tambahan karena q salah</td></tr>
<tr><td>perplexity</td><td><span class="tx">2^{H(p, q)}</span></td><td>3</td><td>setara memilih acak dari sekian kemungkinan</td></tr></table></div>
<div class="rule">Cross-entropy = entropi + KL. Entropi data tidak bisa diubah model, jadi menurunkan cross-entropy sama dengan menurunkan KL.</div>

<h2>Dari likelihood ke loss</h2>
<p>Di 3.2 kamu memaksimalkan likelihood. Rata-rata negative log-likelihood atas data adalah cross-entropy antara data dan model (3.4). Jadi melatih classifier dengan cross-entropy, melatih LLM memprediksi token berikutnya, dan MLE adalah satu kegiatan yang sama.</p>

<h2>Dari loss ke perplexity</h2>
<p>Perplexity adalah eksponen dari loss. Bengio dkk. (2003) mendefinisikannya sebagai rata-rata geometrik dari 1/peluang yang diberikan model ke kata yang benar, yang sama dengan eksponen rata-rata negative log-likelihood. Contoh di atas: model yang menebak rata 1/3 punya perplexity 3, sedangkan model yang tahu p persis punya <span class="tx">2^{1{,}5} \approx 2{,}83</span>. Batas terbaik perplexity adalah eksponen dari entropi data itu sendiri.</p>

<h2>KL di mana-mana</h2>
<p>KL yang sama muncul di VAE sebagai penalti agar kode laten mirip N(0, 1) (6.6), dan di difusi sebagai suku-suku batas variasional (6.5). Di RLHF, KL dipakai untuk menahan model agar tidak terlalu jauh dari model awalnya (5.14).</p>

<h2>Di mana angka ini menyesatkan</h2>
<p>Perplexity hanya bisa dibandingkan antar model yang memakai tokenizer dan data uji yang sama: memecah teks jadi potongan lebih kecil mengubah jumlah token, jadi mengubah angka per token. Perplexity rendah juga tidak menjamin jawaban benar atau berguna; ia hanya mengukur seberapa baik model menebak teks uji. KL juga tidak simetris (3.4): <span class="tx">D_{\text{KL}}(p\,\|\,q)</span> dan <span class="tx">D_{\text{KL}}(q\,\|\,p)</span> biasanya berbeda.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
p = np.array([0.5, 0.25, 0.25]); q = np.ones(3) / 3
H = -(p * np.log2(p)).sum(); CE = -(p * np.log2(q)).sum()
print(H, round(CE, 3), round(CE - H, 3))  # 1.5 1.585 0.085
print(round(2 ** H, 3), round(2 ** CE, 3))  # 2.828 3.0</code></pre>
`,
  src: [
    "Shannon (1948), “A Mathematical Theory of Communication”, <i>Bell System Technical Journal</i>. Lokal.",
    "Cover &amp; Thomas, <i>Elements of Information Theory</i> (2e), Bab 2 “Entropy, Relative Entropy, and Mutual Information”. Lokal.",
    "Bengio, Ducharme, Vincent &amp; Jauvin (2003), “A Neural Probabilistic Language Model”, <i>JMLR</i> (definisi perplexity di bagian eksperimen). Lokal.",
    "Kingma &amp; Welling (2014), “Auto-Encoding Variational Bayes”, persamaan (3); Ho dkk. (2020), “Denoising Diffusion Probabilistic Models”, persamaan (5). Lokal."
  ]
};

/* ───────────────────────── 6.4 ───────────────────────── */
window.LESSONS["6.4"] = {
  title: "Membaca paper: Attention Is All You Need",
  pre: "1.8, 2.6, 2.10, 4.2, 5.7, 5.9", min: 0,
  why: "Paper Transformer (Vaswani dkk., 2017) adalah dasar ChatGPT, Claude, dan hampir semua LLM. Panjangnya hanya 15 halaman, dan dengan Lapis 0–5 kamu sudah punya semua alat untuk membacanya sendiri. Halaman ini peta bacanya: setiap persamaan ditautkan ke pelajaran yang mengajarkannya.",
  body: String.raw`
<h2>Cara membaca halaman ini</h2>
<p>Buka PDF paper-nya di sebelah halaman ini (judul lengkap ada di Sumber di bawah). Ikuti urutan bagian di sini. Kalau satu persamaan terasa asing, buka pelajaran yang ditautkan, lalu kembali. Bagian 1, 2, dan 7 (pendahuluan, latar belakang, kesimpulan) boleh dibaca cepat.</p>

<h2>§3.2.1 Persamaan (1): scaled dot-product attention</h2>
<div class="tx d">\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V</div>
<ul>
<li><span class="tx">QK^\top</span>: setiap query dikali titik dengan setiap key. Hasil kali titik mengukur seberapa searah dua vektor (<a href="#p1-8">1.8</a>), dan menghitung semuanya sekaligus adalah perkalian matriks (<a href="#p2-6">2.6</a>).</li>
<li>softmax: skor jadi bobot yang jumlahnya 1 (<a href="#p4-2">4.2</a>, benang merahnya di <a href="#p6-1">6.1</a>).</li>
<li>dikali V: rata-rata berbobot dari value. Gambaran utuhnya di <a href="#p5-7">5.7</a>.</li>
</ul>

<h2>Catatan kaki 4: kenapa dibagi √d<sub>k</sub></h2>
<p>Paper ini menjelaskan alasannya di catatan kaki: kalau setiap komponen q dan k acak dengan rata-rata 0 dan varians 1, hasil kali titiknya punya varians <span class="tx">d_k</span>. Itu aturan penjumlahan varians dari <a href="#p2-10">2.10</a>: jumlah <span class="tx">d_k</span> suku bebas yang masing-masing bervarians 1. Dengan <span class="tx">d_k = 64</span>, skor bisa mencapai ±8 atau lebih, dan softmax jadi hampir seperti memilih satu saja:</p>
<div class="tbl"><table><tr><th>skor</th><th>bobot softmax</th></tr>
<tr><td>[8; 0; −8], tanpa dibagi</td><td>[0,99966; 0,00034; 0,00000]</td></tr>
<tr><td>[1; 0; −1], dibagi √64 = 8</td><td>[0,665; 0,245; 0,090]</td></tr></table></div>
<p>Di daerah jenuh seperti baris pertama, gradien softmax hampir nol, mirip vanishing gradient di <a href="#p5-6">5.6</a>. Membagi dengan <span class="tx">\sqrt{d_k}</span> mengembalikan varians ke 1.</p>

<h2>§3.2.2 Multi-head attention</h2>
<p>Daripada satu attention besar, Q, K, V diproyeksikan h kali dengan matriks berbeda (<a href="#p2-5">2.5</a>), attention dihitung di tiap proyeksi, lalu hasilnya disambung. Paper memakai h = 8 dan <span class="tx">d_k = d_{\text{model}}/h = 512/8 = 64</span>, sehingga biaya totalnya kira-kira sama dengan satu kepala besar.</p>

<h2>§3.2.3 Masking: −∞ di decoder</h2>
<p>Decoder tidak boleh mengintip token yang belum ditulis. Caranya: skor ke posisi masa depan diganti −∞ sebelum softmax. Karena <span class="tx">e^{-\infty} = 0</span> (<a href="#p1-5">1.5</a>), bobotnya tepat nol.</p>

<h2>§3.3 Feed-forward per posisi</h2>
<div class="tx d">\text{FFN}(x) = \max(0,\, xW_1 + b_1)\,W_2 + b_2</div>
<p>Dua lapisan linear dengan ReLU di antaranya, persis jaringan saraf dari <a href="#p5-4">5.4</a>, dijalankan terpisah di setiap token.</p>

<h2>§3.5 Positional encoding</h2>
<div class="tx d">\text{PE}_{(\text{pos},\,2i)} = \sin\!\big(\text{pos} / 10000^{2i/d_{\text{model}}}\big), \quad \text{PE}_{(\text{pos},\,2i+1)} = \cos\!\big(\text{pos} / 10000^{2i/d_{\text{model}}}\big)</div>
<p>Attention sendiri tidak tahu urutan kata. Jadi setiap posisi diberi sidik jari berupa gelombang sinus dan kosinus dengan panjang gelombang dari 2π sampai 10000·2π. Contoh: posisi 1, dimensi 0 bernilai sin 1 ≈ 0,8415 (sudut 1 di sini dalam radian, sekitar 57°) dan dimensi 1 bernilai cos 1 ≈ 0,5403. Sinus dan kosinus diperkenalkan di <a href="#p0-6">0.6</a>; paper juga mencoba posisi yang dipelajari dan hasilnya hampir sama.</p>

<h2>§5.3–5.4 Pelatihan</h2>
<ul>
<li>Adam dengan β₁ = 0,9, β₂ = 0,98, ε = 10⁻⁹ (<a href="#p3-1">3.1</a>).</li>
<li>Persamaan (3): learning rate naik lurus selama 4000 langkah pertama (warmup), lalu turun sebanding <span class="tx">1/\sqrt{\text{langkah}}</span> (<a href="#p5-9">5.9</a>). Puncaknya di langkah 4000 untuk <span class="tx">d_{\text{model}} = 512</span> sekitar 0,0007.</li>
<li>Dropout 0,1 dan label smoothing 0,1: target one-hot dilunakkan sedikit sehingga cross-entropy (<a href="#p3-4">3.4</a>) tidak mendorong model terlalu yakin (<a href="#p5-9">5.9</a>). Penulisnya mencatat efek yang menarik: perplexity jadi lebih buruk, tapi akurasi dan BLEU membaik. Perplexity dan kualitas tidak selalu searah (<a href="#p6-3">6.3</a>).</li>
</ul>

<h2>§6 Hasil</h2>
<p>Model besar mencapai BLEU 28,4 pada terjemahan Inggris–Jerman WMT 2014, lebih tinggi dari hasil terbaik sebelumnya, dengan biaya latih jauh lebih kecil. BLEU adalah skor kemiripan dengan terjemahan manusia, dari 0 sampai 100. Tabel 3 (variasi arsitektur) layak dibaca pelan: di situ terlihat, misalnya, bahwa mengecilkan <span class="tx">d_k</span> menurunkan kualitas.</p>

<h2>Yang tidak ada di paper ini</h2>
<p>Paper ini tentang terjemahan, belum tentang chatbot. Model GPT memakai decoder saja dan dilatih memprediksi token berikutnya pada teks yang jauh lebih banyak (<a href="#p5-13">5.13</a>). Banyak detail modern, seperti posisi rotasi (RoPE) atau normalisasi sebelum sublapisan, datang belakangan.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
rng = np.random.default_rng(0)
for d in (4, 64):
    q = rng.standard_normal((100000, d)); k = rng.standard_normal((100000, d))
    s = (q * k).sum(axis=1)
    print(d, round(s.var(), 2), round((s / np.sqrt(d)).var(), 3))
# 4 4.03 1.007
# 64 64.09 1.001
sm = lambda x: np.exp(x) / np.exp(x).sum()
skor = np.array([8.0, 0.0, -8.0])
print(np.round(sm(skor), 5).tolist())  # [0.99966, 0.00034, 0.0]
print(np.round(sm(skor / 8), 3).tolist())  # [0.665, 0.245, 0.09]
print(round(512 ** -0.5 * min(4000 ** -0.5, 4000 * 4000 ** -1.5), 6))  # 0.000699</code></pre>
`,
  src: [
    "Vaswani dkk. (2017), “Attention Is All You Need”, <i>NIPS 2017</i> (sekarang NeurIPS): §3.2.1 persamaan (1) dan catatan kaki 4, §3.2.2, §3.2.3, §3.3, §3.5, §5.3 persamaan (3), §5.4, §6.1. Lokal.",
    "Papineni dkk. (2002), “BLEU: a Method for Automatic Evaluation of Machine Translation”, <i>ACL</i> (definisi BLEU).",
    "Bahdanau, Cho &amp; Bengio (2015), “Neural Machine Translation by Jointly Learning to Align and Translate” (attention sebelum Transformer). Lokal."
  ]
};

/* ───────────────────────── 6.5 ───────────────────────── */
window.LESSONS["6.5"] = {
  title: "Membaca paper: Denoising Diffusion Probabilistic Models",
  pre: "2.9, 3.1, 3.4, 4.3, 4.7, 5.10, 5.12", min: 0,
  why: "Paper DDPM (Ho, Jain & Abbeel, 2020) membuat model difusi bisa menghasilkan gambar sebagus GAN, dan resepnya dipakai Stable Diffusion dan kawan-kawan. Rumusnya terlihat padat, tapi hampir semuanya sudah kamu temui di Lapis 2–5.",
  body: String.raw`
<h2>Cara membaca halaman ini</h2>
<p>Baca dulu <a href="#p5-12">5.12</a> untuk gambaran utuh. Di paper, bagian 2 (latar belakang) dan 3 (inti metode) yang paling penting. Lampiran A berisi penurunan panjang; lewati dulu pada bacaan pertama.</p>

<h2>§2 Persamaan (2): proses maju</h2>
<div class="tx d">q(x_t \mid x_{t-1}) = \mathcal{N}\!\big(x_t;\ \sqrt{1-\beta_t}\,x_{t-1},\ \beta_t I\big)</div>
<p>Baca: langkah berikutnya adalah langkah sebelumnya yang dikecilkan sedikit, ditambah noise normal bervarians <span class="tx">\beta_t</span>. Distribusi normal ada di <a href="#p2-9">2.9</a>; menambah noise kecil berulang-ulang adalah jalan acak dari <a href="#p4-4">4.4</a> (benang merahnya di <a href="#p6-2">6.2</a>).</p>

<h2>Persamaan (3): batas variasional</h2>
<p>Model belajar membalik proses itu dengan meminimalkan batas atas dari negative log-likelihood. Ini batas yang sama jenisnya dengan ELBO di VAE (<a href="#p5-10">5.10</a>, <a href="#p6-6">6.6</a>) dan energi bebas di <a href="#p4-3">4.3</a>. Persamaan (5) memecahnya menjadi suku-suku KL (<a href="#p3-4">3.4</a>) antara dua distribusi normal, yang bisa dihitung langsung tanpa sampel.</p>

<h2>Persamaan (4): lompat langsung ke langkah t</h2>
<div class="tx d">q(x_t \mid x_0) = \mathcal{N}\!\big(x_t;\ \sqrt{\bar\alpha_t}\,x_0,\ (1-\bar\alpha_t) I\big), \qquad \bar\alpha_t = \prod_{s=1}^{t}(1-\beta_s)</div>
<p>Inilah rumus reparameterisasi di <a href="#p5-12">5.12</a>. Tabel nilai √ᾱ untuk t = 1 sampai 1000 ada di sana; di t = 1000 sinyal aslinya tinggal 0,6%.</p>

<h2>Algoritme 1 dan persamaan (14): pelatihan</h2>
<div class="tx d">L_{\text{simple}} = \mathbb{E}_{t,\,x_0,\,\varepsilon}\Big[\big\|\varepsilon - \varepsilon_\theta\big(\sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\varepsilon,\ t\big)\big\|^2\Big]</div>
<p>Ambil gambar, ambil t acak, ambil noise, campur, lalu suruh jaringan menebak noisenya. Lossnya kuadrat selisih biasa, dan diturunkan dengan gradient descent (<a href="#p3-1">3.1</a>). Penulisnya menemukan bahwa membuang bobot dari batas variasional yang asli justru membuat gambar lebih bagus, karena jaringan lebih fokus pada langkah dengan noise besar yang lebih sulit.</p>

<h2>Algoritme 2: membuat gambar</h2>
<div class="tx d">x_{t-1} = \frac{1}{\sqrt{\alpha_t}}\Big(x_t - \frac{1-\alpha_t}{\sqrt{1-\bar\alpha_t}}\,\varepsilon_\theta(x_t, t)\Big) + \sigma_t z</div>
<p>Kurangi tebakan noise, perbesar sedikit, lalu tambahkan noise segar z. Penulisnya sendiri mencatat bahwa langkah ini mirip dinamika Langevin (<a href="#p4-7">4.7</a>): turun ke arah data yang lebih mungkin sambil diguncang noise.</p>

<h2>§4 Eksperimen</h2>
<ul>
<li>T = 1000 langkah, β naik lurus dari 10⁻⁴ ke 0,02.</li>
<li>Di langkah terakhir, KL antara <span class="tx">q(x_T \mid x_0)</span> dan N(0, I) sekitar 10⁻⁵ bit per dimensi: hampir noise murni.</li>
<li>Jaringannya U-Net (<a href="#p5-5">5.5</a>) dengan self-attention, dan langkah t dimasukkan dengan embedding sinus dari Transformer (<a href="#p6-4">6.4</a>).</li>
<li>Pada CIFAR-10, skor FID 3,17 (makin kecil makin mirip gambar asli).</li>
</ul>

<h2>Yang perlu diwaspadai saat membaca</h2>
<p>Seribu langkah pembuatan gambar itu lambat. Paper-paper sesudahnya, seperti DDIM (Song, Meng &amp; Ermon), memangkas jumlah langkahnya. Konversi teks paper ini juga sering merusak tanda akar dan garis atas ᾱ, jadi cek persamaan langsung di PDF.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
beta = np.linspace(1e-4, 0.02, 1000); alpha = 1 - beta; abar = np.cumprod(alpha)
print(f'{abar[-1]:.2e}')  # 4.04e-05
rng = np.random.default_rng(0)
x0 = rng.standard_normal(100000); eps = rng.standard_normal(100000)
t = 500; xt = np.sqrt(abar[t - 1]) * x0 + np.sqrt(1 - abar[t - 1]) * eps
print(round(xt.var(), 3))  # 1.005 (teori: 1)</code></pre>
`,
  src: [
    "Ho, Jain &amp; Abbeel (2020), “Denoising Diffusion Probabilistic Models”, <i>NeurIPS</i>: persamaan (2)–(5), Algoritme 1 dan 2, persamaan (14), §4 (T = 1000, β linear 10⁻⁴–0,02, FID 3,17). Lokal.",
    "Sohl-Dickstein dkk. (2015), “Deep Unsupervised Learning using Nonequilibrium Thermodynamics”, <i>ICML</i> (gagasan awal difusi). Lokal.",
    "Song, Meng &amp; Ermon (2021), “Denoising Diffusion Implicit Models” (DDIM). Lokal."
  ]
};

/* ───────────────────────── 6.6 ───────────────────────── */
window.LESSONS["6.6"] = {
  title: "Membaca paper: Auto-Encoding Variational Bayes (VAE)",
  pre: "2.10, 2.11, 3.4, 4.3, 5.10", min: 0,
  why: "Paper VAE (Kingma & Welling, 2014) memperkenalkan trik reparameterisasi, yang kemudian dipakai di model difusi dan banyak model generatif lain. Paper ini pendek tapi padat notasi, jadi peta baca sangat membantu.",
  body: String.raw`
<h2>Cara membaca halaman ini</h2>
<p>Paper ini ditulis untuk pembaca yang sudah fasih inferensi variasional. Kalau terasa berat, baca dulu tutorial Doersch (ada di pustaka lokal), lalu kembali. Inti paper ada di §2.2, §2.4, dan §3. Bagian eksperimen dan lampiran boleh dilewati pada bacaan pertama, kecuali Lampiran B.</p>

<h2>Notasi dulu</h2>
<ul>
<li>x: data (misalnya gambar), z: kode laten tersembunyi.</li>
<li><span class="tx">p_\theta(x \mid z)</span>: <b>decoder</b>, dari kode ke data, dengan parameter θ.</li>
<li><span class="tx">q_\phi(z \mid x)</span>: <b>encoder</b>, tebakan kode dari data, dengan parameter φ. Ia mendekati posterior asli <span class="tx">p_\theta(z \mid x)</span> yang tidak bisa dihitung (Bayes, <a href="#p2-11">2.11</a>).</li>
</ul>

<h2>§2.2 Persamaan (1)–(3): batas bawah variasional</h2>
<div class="tx d">\log p_\theta(x) = D_{\text{KL}}\big(q_\phi(z\mid x)\,\|\,p_\theta(z\mid x)\big) + \mathcal{L}(\theta, \phi; x)</div>
<p>KL tidak pernah negatif (<a href="#p3-4">3.4</a>), jadi <span class="tx">\mathcal{L}</span> selalu di bawah log-likelihood. Itulah sebabnya ia disebut batas bawah (ELBO). Persamaan (3) menulisnya ulang menjadi dua bagian yang mudah dibaca:</p>
<div class="tx d">\mathcal{L} = -D_{\text{KL}}\big(q_\phi(z\mid x)\,\|\,p_\theta(z)\big) + \mathbb{E}_{q_\phi(z\mid x)}\big[\log p_\theta(x\mid z)\big]</div>
<p>Bagian kedua: seberapa baik decoder merekonstruksi data. Bagian pertama: penalti kalau kode menjauh dari prior N(0, I). Ini energi bebas dari <a href="#p4-3">4.3</a> dengan tanda dibalik.</p>

<h2>§2.4 Trik reparameterisasi</h2>
<div class="tx d">z = \mu + \sigma \odot \varepsilon, \qquad \varepsilon \sim \mathcal{N}(0, I)</div>
<p>Sampel acak tidak bisa diturunkan, tapi rumus geser-regang bisa. Simbol ⊙ berarti kali per posisi. Paper ini juga memberi daftar keluarga distribusi lain yang bisa direparameterisasi dengan cara serupa. Pembahasan intuitifnya ada di <a href="#p5-10">5.10</a>, dan benang merah noise-nya di <a href="#p6-2">6.2</a>.</p>

<h2>§3 dan Lampiran B: KL yang bisa dihitung langsung</h2>
<p>Kalau prior N(0, I) dan encoder mengeluarkan normal dengan rata-rata μ dan simpangan baku σ, suku KL punya rumus tertutup, dijumlah atas setiap dimensi j:</p>
<div class="tx d">-D_{\text{KL}} = \tfrac{1}{2}\sum_{j}\big(1 + \log \sigma_j^2 - \mu_j^2 - \sigma_j^2\big)</div>
<div class="ex"><div class="q">Satu dimensi laten dengan μ = 0,5 dan σ = 0,8. Berapa KL-nya?</div>
<div class="step">1 + log 0,64 − 0,25 − 0,64 = 1 − 0,4463 − 0,89 = −0,3363. Kali ½: −0,1681.</div>
<div class="ans">Jawaban: KL ≈ 0,1681. Kalau μ = 0 dan σ = 1, KL = 0: kode persis seperti prior.</div></div>

<h2>§5 Eksperimen</h2>
<p>Model dilatih pada MNIST (angka tulisan tangan) dan Frey Face (wajah), dengan mini-batch M = 100 dan hanya L = 1 sampel ε per data. Satu sampel ternyata cukup asalkan batch-nya besar.</p>

<h2>Yang perlu diwaspadai saat membaca</h2>
<p>Gambar dari VAE sederhana cenderung buram, karena decoder normal merata-ratakan semua kemungkinan detail. Ini salah satu alasan GAN (<a href="#p5-11">5.11</a>) dan difusi (<a href="#p6-5">6.5</a>) kemudian lebih unggul untuk gambar tajam. Di sisi lain, encoder VAE tetap dipakai luas, misalnya untuk memadatkan gambar sebelum difusi dijalankan di ruang laten.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
kl = lambda mu, s: 0.5 * (mu ** 2 + s ** 2 - 1 - np.log(s ** 2))
print(round(kl(0.5, 0.8), 4), round(kl(0.0, 1.0), 4))  # 0.1681 0.0
rng = np.random.default_rng(0)
z = 0.5 + 0.8 * rng.standard_normal(100000)
print(round(z.mean(), 2), round(z.std(), 2))  # sekitar 0.5 0.8</code></pre>
`,
  src: [
    "Kingma &amp; Welling (2014), “Auto-Encoding Variational Bayes”, <i>ICLR</i>: §2.2 persamaan (1)–(3), §2.4 “The reparameterization trick”, §3 dan Lampiran B (KL Gaussian), §5 (M = 100, L = 1). Lokal.",
    "Doersch (2016), “Tutorial on Variational Autoencoders”. Lokal (baca sebelum paper).",
    "Kingma &amp; Welling (2019), “An Introduction to Variational Autoencoders”, <i>Foundations and Trends in ML</i>. Lokal."
  ]
};
