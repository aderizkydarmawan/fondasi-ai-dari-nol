window.LESSONS = window.LESSONS || {};
/* Lapis 5 bagian 2 (5.9–5.15) · Model AI. Rumus LaTeX langsung (<span class="tx">, <div class="tx d">). */

/* ───────────────────────── 5.9 ───────────────────────── */
window.LESSONS["5.9"] = {
  title: "Trik pelatihan",
  pre: "3.1, 3.5, 5.4", min: 0,
  why: "Arsitektur yang benar belum cukup. Jaringan dalam sering gagal dilatih karena hal-hal \"kecil\": bobot awal yang salah skala, learning rate tanpa jadwal, aktivasi yang melebar tak terkendali, atau overfitting. Trik di pelajaran ini membedakan model yang belajar dari model yang macet, dan semuanya dipakai di setiap pelatihan LLM.",
  body: String.raw`
<h2>1. Inisialisasi: skala bobot awal</h2>
<p>Kalau bobot awal terlalu besar, sinyal membesar di setiap lapis dan meledak; terlalu kecil, sinyal lenyap (masalah yang sama dengan RNN di 5.6, kali ini menembus kedalaman). Solusinya: pilih varians bobot supaya varians sinyal tetap sama dari lapis ke lapis. Untuk lapis dengan n masukan, sinyal maju tetap stabil kalau varians bobot sekitar 1/n. Glorot &amp; Bengio (2010) ingin gradien mundur juga stabil, jadi mereka memakai jalan tengah 2/(n<sub>masuk</sub> + n<sub>keluar</sub>), yang sama dengan 1/n kalau keduanya sama besar. He dkk. (2015) memakai 2/n untuk ReLU, karena ReLU membuang separuh sinyal.</p>

<h2>2. Normalisasi: jaga aktivasi tetap di kisaran wajar</h2>
<p><b>Batch normalization</b> (Ioffe &amp; Szegedy, 2015) menormalkan setiap fitur dalam satu mini-batch: kurangi rata-rata, bagi simpangan baku (1.7), lalu biarkan jaringan menskala dan menggeser ulang dengan dua parameter γ, β yang dipelajari.</p>
<div class="ex"><div class="q">Satu fitur dalam mini-batch berisi [2; 4; 6]. Normalkan.</div>
<div class="step">Rata-rata 4, simpangan baku √(8/3) ≈ 1,633
(2 − 4)/1,633 ≈ −1,225, (4 − 4)/1,633 = 0, (6 − 4)/1,633 ≈ 1,225</div>
<div class="ans">Jawaban: [−1,225; 0; 1,225]</div></div>
<p>Transformer memakai <b>layer normalization</b> (Ba dkk., 2016): normalisasi yang sama tapi dihitung per token, atas semua fiturnya, sehingga tidak bergantung pada ukuran batch.</p>

<h2>3. Jadwal learning rate: warmup lalu turun</h2>
<p>Di awal pelatihan, bobot masih acak dan statistik Adam belum stabil, jadi langkah besar berbahaya. <b>Warmup</b> menaikkan learning rate secara linear selama sejumlah langkah pertama (Transformer asli: 4.000 langkah). Setelah itu learning rate diturunkan, sering mengikuti kurva kosinus sampai mendekati nol, supaya model mengendap di dasar lembah (3.1).</p>
<div class="ex"><div class="q">Puncak 0,001, warmup 100 langkah, total 1.000 langkah, lalu turun kosinus. Berapa learning rate di langkah 50, 100, 550, dan 1.000?</div>
<div class="step">Langkah 50: 0,001 × 50/100 = 0,0005
Langkah 100: puncak, 0,001
Langkah 550: tengah fase turun, 0,001 × ½(1 + cos(π/2)) = 0,0005
Langkah 1.000: 0,001 × ½(1 + cos π) = 0</div>
<div class="ans">Jawaban: 0,0005; 0,001; 0,0005; 0</div></div>

<h2>4. Regularisasi: lawan overfitting</h2>
<ul><li><b>Dropout</b> (Srivastava dkk., 2014): saat melatih, matikan setiap neuron secara acak dengan peluang p. Jaringan dipaksa tidak bergantung pada satu neuron mana pun, seperti melatih banyak sub-jaringan sekaligus. Supaya rata-rata sinyal tetap, keluaran yang tersisa dikali 1/(1 − p) saat melatih; makalah aslinya mengecilkan bobot saat menguji, hasilnya setara.</li>
<li><b>Weight decay</b>: penalty untuk bobot besar, setara prior normal (3.3). AdamW (Loshchilov &amp; Hutter, 2019) memisahkan penalty ini dari langkah Adam. Di lapangan, AdamW kini jadi pilihan umum untuk melatih Transformer (ini praktik, bukan klaim makalahnya).</li>
<li><b>Berhenti lebih awal</b> dan <b>augmentasi data</b> (membalik, memotong, memutar gambar) untuk memperbanyak variasi training data.</li></ul>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np, math
v = np.array([2, 4, 6.])
print(((v - v.mean()) / v.std()).round(3))           # [-1.225  0.     1.225]
def lr(t, T=1000, w=100, puncak=1e-3):
    return puncak * t / w if t &lt; w else puncak * 0.5 * (1 + math.cos(math.pi * (t - w) / (T - w)))
print([round(lr(t), 6) for t in (50, 100, 550, 1000)])   # [0.0005, 0.001, 0.0005, 0.0]</code></pre>
`,
  src: [
    "Glorot & Bengio (2010), “Understanding the difficulty of training deep feedforward neural networks”; He dkk. (2015), “Delving Deep into Rectifiers”. Lokal.",
    "Ioffe & Szegedy (2015), “Batch Normalization”; Ba, Kiros & Hinton (2016), “Layer Normalization”; Goodfellow dkk., <i>Deep Learning</i>, §8.7.1 “Batch Normalization” dan §7.12 “Dropout”. Lokal.",
    "Srivastava dkk. (2014), “Dropout: A Simple Way to Prevent Neural Networks from Overfitting”, <i>JMLR</i>; Loshchilov & Hutter (2019), “Decoupled Weight Decay Regularization” (AdamW). Lokal.",
    "Vaswani dkk. (2017), “Attention Is All You Need”, §5.3 (jadwal warmup). Lokal."
  ]
};

/* ───────────────────────── 5.10 ───────────────────────── */
window.LESSONS["5.10"] = {
  title: "Autoencoder dan VAE",
  pre: "2.8 PCA, 3.4 KL, 4.3 ELBO, 5.4", min: 0,
  why: "Autoencoder belajar meringkas data menjadi sedikit angka lalu membangunnya kembali. Variational autoencoder (VAE) mengubah ringkasan itu menjadi ruang yang bisa disampel, sehingga model bisa membuat data baru. Encoder VAE dipakai di Stable Diffusion untuk memampatkan gambar sebelum proses difusi (5.12).",
  body: String.raw`
<h2>Autoencoder: peras lalu bangun ulang</h2>
<p>Autoencoder punya dua bagian: <b>encoder</b> memampatkan masukan x (misalnya gambar 784 piksel) menjadi kode pendek z (misalnya 16 angka), dan <b>decoder</b> membangun ulang <span class="tx">\hat x</span> dari z. Loss-nya adalah reconstruction error, yaitu seberapa beda hasil bangun ulang dari aslinya, misalnya <span class="tx">\|x - \hat x\|^2</span>. Karena z lebih sempit dari x, jaringan dipaksa menyimpan hanya hal terpenting. Autoencoder linear dengan loss kuadrat mempelajari ruang yang sama dengan PCA (2.8); dengan lapis nonlinear, ia bisa menangkap struktur yang melengkung.</p>
<p>Masalahnya: ruang z dari autoencoder biasa berlubang-lubang. Ambil titik z acak dan decode, hasilnya sering sampah, karena tidak ada yang memaksa ruang itu teratur.</p>

<h2>VAE: kode yang berupa distribusi</h2>
<p>Kingma &amp; Welling (2014) membuat encoder mengeluarkan distribusi, bukan satu titik: rata-rata μ(x) dan simpangan baku σ(x) dari sebuah normal. Lalu mereka melatih dengan ELBO dari 4.3:</p>
<div class="tx d">\mathcal{L} = \underbrace{\mathbb{E}_{q(z\mid x)}\big[\log p(x\mid z)\big]}_{\text{rekonstruksi}} - \underbrace{D_{\text{KL}}\big(\mathcal{N}(\mu, \sigma^2)\,\|\,\mathcal{N}(0, 1)\big)}_{\text{tetap dekat prior}}</div>
<p>Subskrip di bawah 𝔼 menyebut dari mana nilai acaknya diambil: 𝔼<sub>q(z|x)</sub> berarti rata-rata (2.10) ketika z diambil dari q(z|x), distribusi kode yang dihasilkan encoder. <b>Prior</b> (3.3) di sini adalah N(0, 1), distribusi yang kita inginkan untuk kode sebelum melihat data.</p>
<p>Suku KL menarik setiap distribusi kode ke normal standar, sehingga ruang z menjadi padat dan mulus. Setelah dilatih, ambil z dari N(0, 1), <i>decode</i> (jalankan lewat decoder), dan keluarlah data baru yang masuk akal. Untuk satu dimensi, KL itu punya <b>closed form</b>, yaitu rumus jadi yang bisa langsung dihitung tanpa simulasi:</p>
<div class="tx d">D_{\text{KL}} = \tfrac12\left(\mu^2 + \sigma^2 - 1 - \ln\sigma^2\right)</div>
<div class="ex"><div class="q">Encoder memberi μ = 1, σ = 0,5. Berapa suku KL-nya? Berapa kalau μ = 0, σ = 1?</div>
<div class="step">½(1 + 0,25 − 1 − ln 0,25) = ½(0,25 + 1,386) ≈ 0,818
μ = 0, σ = 1: ½(0 + 1 − 1 − 0) = 0</div>
<div class="ans">Jawaban: 0,818 dan 0. KL nol hanya kalau kodenya persis prior.</div></div>

<h2>Trik reparameterisasi</h2>
<p>Ada hambatan: z diambil acak, dan gradien tidak bisa mengalir melewati "ambil acak". Solusinya, tulis ulang pengambilan sampelnya:</p>
<div class="tx d">z = \mu + \sigma \cdot \varepsilon, \qquad \varepsilon \sim \mathcal{N}(0, 1)</div>
<p>Keacakan dipindahkan ke ε yang tidak bergantung pada bobot. Sekarang z adalah fungsi biasa dari μ dan σ, dan backpropagation (5.4) berjalan seperti biasa. Trik yang sama dipakai di model difusi untuk menulis gambar benoise (5.12).</p>
<div class="rule">Tarik-menarik VAE: suku rekonstruksi ingin kode yang tajam dan berbeda-beda, suku KL ingin semua kode mirip prior. Akibatnya hasil VAE sering <mark>agak buram</mark>, kelemahan yang mendorong lahirnya GAN dan model difusi.</div>

<h2>Periksa dengan Python</h2>
<pre><code>import math
kl = lambda mu, s: 0.5 * (mu**2 + s**2 - 1 - math.log(s**2))
print(round(kl(1, 0.5), 3), kl(0, 1))   # 0.818 0.0</code></pre>
`,
  src: [
    "Kingma & Welling (2014), “Auto-Encoding Variational Bayes”, <i>ICLR</i> (bagian “The reparameterization trick”). Lokal.",
    "Kingma & Welling (2019), “An Introduction to Variational Autoencoders”. Lokal.",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §14.1 “Undercomplete Autoencoders” dan §20.10.3 “Variational Autoencoders”. Lokal."
  ]
};

/* ───────────────────────── 5.11 ───────────────────────── */
window.LESSONS["5.11"] = {
  title: "GAN",
  pre: "3.2, 3.4, 5.4", min: 0,
  why: "Generative adversarial network melatih dua jaringan yang saling melawan: pemalsu dan detektif. Selama beberapa tahun GAN menghasilkan wajah buatan paling realistis (StyleGAN), dan gagasan pelatihan adversarial masih dipakai di banyak tempat, termasuk untuk mempercepat model difusi.",
  body: String.raw`
<h2>Pemalsu dan detektif</h2>
<p>Goodfellow dkk. (2014) memasang dua jaringan. <b>Generator</b> G mengambil noise acak z dan mengubahnya menjadi data palsu G(z). <b>Discriminator</b> D menerima data dan mengeluarkan peluang data itu asli. D dilatih untuk membedakan asli dan palsu; G dilatih untuk menipu D. Keduanya bermain permainan dengan nilai:</p>
<div class="tx d">\min_G \max_D\; \mathbb{E}_{x\sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z}[\log(1 - D(G(z)))]</div>
<p>Ini cross-entropy biner (5.1) untuk tugas "asli atau palsu", dengan G mencoba memperbesarnya.</p>

<h2>Discriminator terbaik</h2>
<p>Kalau G tetap dan data asli berkerapatan <span class="tx">p</span> sedangkan data palsu <span class="tx">q</span>, discriminator terbaik di setiap titik x adalah</p>
<div class="tx d">D^*(x) = \frac{p(x)}{p(x) + q(x)}</div>
<p>Masuk akal: kalau di titik x data asli dua kali lebih sering daripada palsu, D* = 2/3. Di tempat generator sudah sempurna, p = q dan D* = ½: detektif hanya bisa menebak. Memasukkan D* ke nilai permainan menghasilkan</p>
<div class="tx d">-\log 4 + 2\,\text{JSD}(p \,\|\, q)</div>
<p>dengan JSD divergensi Jensen–Shannon, versi simetris dari KL (3.4). Jadi generator, dengan detektif terbaik, sedang meminimalkan jarak antara distribusi palsu dan asli. Minimumnya −log 4 ≈ −1,386, tercapai tepat saat q = p.</p>

<h2>Kenapa GAN sulit dilatih</h2>
<ul><li><b>Bukan lembah, tapi pelana</b>: dua pemain saling mengejar, dan gradient descent bisa berputar-putar tanpa mengendap.</li>
<li><b>Mode collapse</b>: generator menemukan beberapa contoh yang menipu D dan hanya menghasilkan itu, misalnya wajah yang itu-itu saja.</li>
<li><b>Vanishing gradient</b>: kalau D terlalu pintar, log(1 − D(G(z))) mendatar dan G tidak mendapat petunjuk. Makalah asli menyarankan G memaksimalkan log D(G(z)) sebagai gantinya.</li></ul>
<p>Model difusi (5.12) kemudian mengungguli GAN dalam kualitas dan keragaman, dengan pelatihan yang jauh lebih stabil karena loss-nya hanya regresi biasa.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import math
D = lambda p, q: p / (p + q)
print(round(D(2, 1), 3), D(1, 1))      # 0.667 0.5
print(round(math.log(0.5) + math.log(1 - 0.5), 3), round(-math.log(4), 3))   # -1.386 -1.386</code></pre>
`,
  src: [
    "Goodfellow dkk. (2014), “Generative Adversarial Nets”, <i>NeurIPS</i> (Proposisi 1 dan Teorema 1, nilai −log 4). Lokal.",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §20.10.4 “Generative Adversarial Networks”. Lokal.",
    "Cover & Thomas, <i>Elements of Information Theory</i>, Bab 2 (divergensi dan entropi). Lokal."
  ]
};

/* ───────────────────────── 5.12 ───────────────────────── */
window.LESSONS["5.12"] = {
  title: "Model difusi",
  pre: "3.1, 4.4, 4.5, 4.6, 5.4, 5.5 CNN, 5.10 reparameterisasi", min: 0,
  why: "Model difusi adalah mesin di balik Stable Diffusion, DALL·E, Midjourney, Sora, dan banyak model musik. Gagasannya dari fisika: rusak data perlahan dengan noise sampai menjadi noise murni, lalu latih jaringan untuk membalik proses itu langkah demi langkah. Semua alat Lapis 4 bertemu di sini.",
  body: String.raw`
<h2>Proses maju: rusak perlahan</h2>
<p>Mulai dari gambar asli <span class="tx">x_0</span>. Di setiap langkah t = 1, …, T, kecilkan sedikit gambarnya dan tambah sedikit noise normal dengan varians kecil <span class="tx">\beta_t</span>. Ho dkk. (2020) memakai T = 1000 dan β naik linear dari 0,0001 sampai 0,02. Ini rantai Markov (3.8) dan, kalau langkahnya diperhalus, SDE Ornstein–Uhlenbeck (gerak acak yang selalu ditarik kembali ke nol, 4.5).</p>
<p>Untungnya, kita tidak perlu menjalankan t langkah satu per satu: langkah ke-t bisa dilompati langsung dengan trik reparameterisasi (5.10):</p>
<div class="tx d">x_t = \sqrt{\bar\alpha_t}\;x_0 + \sqrt{1 - \bar\alpha_t}\;\varepsilon, \qquad \varepsilon \sim \mathcal{N}(0, I)</div>
<p>dengan <span class="tx">\bar\alpha_t = \prod_{s \le t}(1 - \beta_s)</span>. Simbol ∏ berarti "kalikan semuanya", seperti Σ berarti "jumlahkan semuanya" (1.6); jadi <span class="tx">\bar\alpha_t</span> adalah hasil kali semua faktor (1 − β) dari langkah 1 sampai t. Dua koefisien itu menyatakan berapa bagian sinyal yang tersisa dan berapa bagian noise:</p>
<div class="tbl"><table><tr><th>langkah t</th><td>1</td><td>100</td><td>250</td><td>500</td><td>1000</td></tr>
<tr><th>bagian sinyal √ᾱ</th><td>0,9999</td><td>0,947</td><td>0,724</td><td>0,280</td><td>0,006</td></tr>
<tr><th>bagian noise √(1 − ᾱ)</th><td>0,010</td><td>0,321</td><td>0,690</td><td>0,960</td><td>1,000</td></tr></table></div>
<p>Di t = 1000, gambar asli tinggal 0,6%: praktis noise normal murni, apa pun gambar awalnya. Ini jaminan Fokker–Planck dari 4.6.</p>

<h2>Proses balik: latih penebak noise</h2>
<p>Untuk membuat gambar, kita perlu berjalan mundur dari noise. Jaringan <span class="tx">\varepsilon_\theta(x_t, t)</span> (biasanya U-Net, jaringan konvolusi berbentuk U yang mengecilkan gambar lalu membesarkannya lagi, atau Transformer) dilatih dengan tugas sederhana: diberi gambar benoise <span class="tx">x_t</span> dan waktunya t, tebak noise ε yang ditambahkan. Loss-nya hanya MSE:</p>
<div class="tx d">L = \mathbb{E}_{x_0,\, t,\, \varepsilon}\;\big\|\,\varepsilon - \varepsilon_\theta(x_t, t)\,\big\|^2</div>
<p>Resep pelatihan: ambil gambar, ambil t acak, ambil noise acak, buat <span class="tx">x_t</span> dengan rumus di atas, minta jaringan menebak noisenya. Tidak ada permainan dua pemain seperti GAN; hanya regresi, jadi pelatihannya stabil.</p>

<h2>Membuat gambar</h2>
<p>Mulai dari noise murni <span class="tx">x_T</span>. Di setiap langkah, kurangi sebagian noise yang ditebak jaringan, tambahkan sedikit noise baru, dan mundur satu langkah. Setelah ratusan langkah, keluar gambar baru. Song dkk. (2021) menunjukkan bahwa penebak noise sebenarnya menaksir <b>skor</b> <span class="tx">\nabla_x \log p(x_t)</span>, arah naik peluang data, dan proses balik adalah SDE (4.5) yang drift-nya memuat skor itu. Cara deterministik (DDIM, ODE probability flow) memangkasnya menjadi puluhan langkah saja.</p>
<p><b>Mengendalikan dengan teks</b>: jaringan juga diberi <b>embedding</b> teks perintah, yaitu daftar angka yang mewakili makna kalimat itu. Classifier-free guidance (Ho &amp; Salimans) menghitung tebakan dengan dan tanpa teks, lalu memperbesar selisihnya, sehingga gambar lebih patuh pada perintah. Stable Diffusion menjalankan semua ini di ruang kode VAE (5.10) yang lebih kecil, bukan di piksel.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
beta = np.linspace(1e-4, 0.02, 1000); abar = np.cumprod(1 - beta)
for t in (1, 100, 250, 500, 1000):
    print(t, round(np.sqrt(abar[t - 1]), 4), round(np.sqrt(1 - abar[t - 1]), 4))
# 1 0.9999 0.01
# 100 0.9471 0.3209
# 250 0.7239 0.6899
# 500 0.2803 0.9599
# 1000 0.0064 1.0</code></pre>
`,
  src: [
    "Ho, Jain & Abbeel (2020), “Denoising Diffusion Probabilistic Models”, <i>NeurIPS</i> (jadwal β linear 10⁻⁴ sampai 0,02, T = 1000). Lokal.",
    "Sohl-Dickstein dkk. (2015), “Deep Unsupervised Learning using Nonequilibrium Thermodynamics”; Song dkk. (2021), “Score-Based Generative Modeling through SDEs”; Song, Meng & Ermon (2021), “DDIM”. Lokal.",
    "Ho & Salimans (2022), “Classifier-Free Diffusion Guidance”; Karras dkk. (2022), “Elucidating the Design Space of Diffusion-Based Generative Models”. Lokal.",
    "Vincent (2011), “A Connection Between Score Matching and Denoising Autoencoders”. Lokal."
  ]
};

/* ───────────────────────── 5.13 ───────────────────────── */
window.LESSONS["5.13"] = {
  title: "Large language model (LLM)",
  pre: "1.8 vektor, 2.6 matriks, 3.4 cross-entropy, 3.8, 4.2 suhu, 5.7", min: 0,
  why: "Inilah tujuan akhir yang kamu kejar: memahami ChatGPT, Claude, Gemini dari dalam. Ternyata intinya adalah tugas yang sangat sederhana, menebak potongan kata berikutnya, dijalankan dengan Transformer raksasa pada sebagian besar teks di internet, lalu diasah agar membantu dan aman.",
  body: String.raw`
<h2>Satu tugas: tebak token berikutnya</h2>
<p>Teks dipotong menjadi <b>token</b>: kata, bagian kata, atau tanda baca (biasanya puluhan ribu jenis, dibentuk dengan algoritma seperti byte-pair encoding atau BPE: mulai dari huruf, lalu berulang kali menggabungkan pasangan yang paling sering muncul berdampingan menjadi satu token baru). Model bahasa memberi peluang token berikutnya dari semua token sebelumnya. Peluang sebuah kalimat dipecah dengan aturan perkalian peluang (2.9):</p>
<div class="tx d">p(w_1, \dots, w_n) = \prod_{t=1}^{n} p(w_t \mid w_1, \dots, w_{t-1})</div>
<p>Simbol ∏ berarti "kalikan semuanya", seperti Σ berarti "jumlahkan semuanya" (1.6). Jadi peluang kalimat = peluang kata pertama × peluang kata kedua kalau kata pertama sudah diketahui × dan seterusnya.</p>
<p><b>Dari token ke vektor.</b> Setiap token punya nomor urut di vocabulary. Nomor itu dipakai untuk mengambil satu baris dari matriks <b>embedding</b> (ukurannya banyak-token × d), yang isinya ikut dipelajari seperti bobot lain. Hasilnya sebuah vektor (1.8), dan vektor inilah yang masuk ke Transformer (5.7). Di ujung, vektor terakhir dikalikan sebuah matriks lagi sehingga keluar satu logit per token di vocabulary, lalu softmax (4.2) mengubahnya jadi peluang token berikutnya. Vaswani dkk. (2017) bahkan memakai matriks yang sama untuk kedua ujung ini.</p>

<h2>Versi paling kecil: bigram</h2>
<p>Model bigram hanya melihat satu token terakhir, persis rantai Markov (3.8). Peluangnya dihitung dari frekuensi.</p>
<div class="ex"><div class="q">Korpus: "aku suka kopi . aku suka teh . kamu suka kopi .". Setelah kata "suka", berapa peluang "kopi" dan "teh"?</div>
<div class="step">"suka" muncul 3 kali; diikuti "kopi" 2 kali, "teh" 1 kali</div>
<div class="ans">Jawaban: p(kopi | suka) = 2/3, p(teh | suka) = 1/3</div></div>
<p>Shannon (1948) sudah membangkitkan teks Inggris dengan cara ini. Masalahnya: konteks satu kata terlalu pendek, dan kombinasi yang tidak pernah muncul di korpus diberi peluang nol. LLM menggantikan tabel frekuensi dengan Transformer (5.7) yang melihat ribuan token ke belakang dan memberi peluang yang masuk akal untuk kalimat yang belum pernah ada.</p>

<h2>Pretraining</h2>
<p>Loss-nya cross-entropy (3.4) untuk setiap token berikutnya, yang sama dengan MLE (3.2). Ukuran yang sering dilaporkan adalah <b>perplexity</b>, <span class="tx">e^{\text{loss}}</span>: model dengan loss 2 nat per token (nat adalah satuan informasi kalau logaritmanya ln; kalau log₂, satuannya bit, lihat 3.4) sama bingungnya dengan memilih acak dari sekitar 7,4 kemungkinan.</p>
<p><b>Scaling law</b>: Kaplan dkk. (2020) menemukan loss turun mulus mengikuti pangkat dari banyaknya parameter N, data D, dan komputasi. Biaya latih sekitar <span class="tx">6ND</span> operasi: kira-kira 2 operasi per parameter per token untuk forward pass dan 4 untuk backward pass (backpropagation). Hoffmann dkk. (2022, Chinchilla) menunjukkan bahwa untuk anggaran komputasi tertentu, parameter dan token harus diperbesar bersama-sama: model 70 miliar parameter mereka dilatih pada 1,4 triliun token, kira-kira 20 token per parameter, sekitar <span class="tx">6 \times 70 \times 10^9 \times 1{,}4 \times 10^{12} \approx 5{,}9 \times 10^{23}</span> operasi.</p>

<h2>Membangkitkan teks</h2>
<p>Model menghasilkan logit untuk semua token, softmax dengan suhu T (4.2) mengubahnya menjadi peluang, satu token diambil, ditempel ke konteks, dan diulang. Selain suhu, ada <b>top-k</b> (undi hanya dari k token paling mungkin) dan <b>top-p</b> (undi hanya dari token teratas yang peluangnya, kalau dijumlah, mencapai p, misalnya 0,9). Ketiganya mengatur keseimbangan antara aman dan beragam. GPT-3 (Brown dkk., 2020) menunjukkan bahwa model yang cukup besar bisa mengerjakan tugas baru hanya dari beberapa contoh di dalam perintah (few-shot), tanpa dilatih ulang.</p>

<h2>Dari peramal teks ke asisten</h2>
<p>Model hasil pretraining hanya melanjutkan teks; ia belum tentu menjawab pertanyaan dengan sopan dan jujur. Ouyang dkk. (2022, InstructGPT) menambahkan dua tahap: <b>fine-tuning</b> pada contoh percakapan yang ditulis manusia, lalu <b>RLHF</b> (reinforcement learning from human feedback; reinforcement learning sendiri dibahas di 5.14, cukup pahami di sini: model diberi skor, lalu diubah supaya skornya naik): manusia membandingkan pasangan jawaban, sebuah model reward dilatih dari pilihan itu, dan model bahasa dioptimalkan dengan reinforcement learning (5.14) untuk mengejar reward, dengan penalty KL (3.4) supaya tidak menyimpang jauh dari model awal.</p>

<h2>Periksa dengan Python</h2>
<pre><code>from collections import Counter
import math
k = "aku suka kopi . aku suka teh . kamu suka kopi .".split()
pasangan = Counter(zip(k, k[1:]))
print({b: n for (a, b), n in pasangan.items() if a == "suka"})   # {'kopi': 2, 'teh': 1}
print(round(math.exp(2.0), 2), 6 * 70e9 * 1.4e12)                # 7.39 5.88e+23</code></pre>
`,
  src: [
    "Vaswani dkk. (2017); Brown dkk. (2020), “Language Models are Few-Shot Learners” (GPT-3). Lokal.",
    "Kaplan dkk. (2020), “Scaling Laws for Neural Language Models” (C ≈ 6N per token); Hoffmann dkk. (2022), “Training Compute-Optimal Large Language Models” (Chinchilla, 70B pada 1,4 triliun token). Lokal.",
    "Ouyang dkk. (2022), “Training language models to follow instructions with human feedback”; Christiano dkk. (2017), RLHF. Lokal.",
    "Shannon (1948), bagian aproksimasi n-gram untuk bahasa Inggris. Lokal."
  ]
};

/* ───────────────────────── 5.14 ───────────────────────── */
window.LESSONS["5.14"] = {
  title: "Reinforcement learning",
  pre: "3.8 rantai Markov, 2.10 ekspektasi, 5.4", min: 0,
  why: "Reinforcement learning (RL) mengajari agen bertindak lewat coba-coba dan reward, tanpa contoh jawaban benar. RL membuat AlphaGo mengalahkan juara dunia Go, menyetel robot, dan menjadi tahap RLHF yang mengubah model bahasa menjadi asisten. Model penalaran terbaru juga dilatih dengan RL.",
  body: String.raw`
<h2>Agen, keadaan, aksi, reward</h2>
<p>Di setiap langkah, agen melihat <b>keadaan</b> s, memilih <b>aksi</b> a, menerima <b>reward</b> r, dan berpindah ke keadaan baru. Perpindahannya bisa acak, dan bergantung hanya pada keadaan dan aksi sekarang: rantai Markov (3.8) dengan pilihan, disebut <b>proses keputusan Markov</b> (MDP). Tujuan agen: memaksimalkan jumlah reward masa depan yang didiskon,</p>
<div class="tx d">G_t = r_{t+1} + \gamma\,r_{t+2} + \gamma^2 r_{t+3} + \cdots</div>
<p>dengan discount factor γ antara 0 dan 1. Reward yang jauh di masa depan dihitung lebih kecil; γ = 0,9 berarti reward 10 langkah lagi bernilai 0,9¹⁰ ≈ 0,35 dari reward sekarang.</p>

<h2>Fungsi nilai dan persamaan Bellman</h2>
<p>Nilai sebuah keadaan, V(s), adalah ekspektasi (2.10) reward total kalau mulai dari s dan bertindak sebaik mungkin. Bellman (1957) memperhatikan bahwa nilai bisa ditulis secara berulang: nilai sekarang = reward langkah ini + γ × nilai keadaan berikutnya, dengan aksi terbaik.</p>
<div class="tx d">V(s) = \max_a \Big[\, r(s, a) + \gamma \sum_{s'} P(s' \mid s, a)\,V(s') \Big]</div>
<p>Dibaca dengan kata-kata: nilai keadaan s = coba setiap aksi a, dan untuk tiap aksi jumlahkan reward langsung r ditambah γ kali nilai keadaan berikutnya. Karena keadaan berikutnya s′ bisa acak, nilainya dirata-rata dengan bobot peluangnya (itulah Σ atas s′). Lalu <b>max</b> atas a: ambil aksi yang hasilnya paling besar.</p>
<div class="ex"><div class="q">Lorong lima kotak; kotak paling kanan adalah tujuan. Melangkah ke tujuan memberi reward 1, langkah lain 0. γ = 0,9. Berapa nilai setiap kotak?</div>
<div class="step">Satu langkah dari tujuan: 1
Dua langkah: 0 + 0,9 × 1 = 0,9
Tiga langkah: 0,9 × 0,9 = 0,81, lalu 0,729, lalu 0,656</div>
<div class="ans">Jawaban: dari jauh ke dekat, 0,656; 0,729; 0,81; 0,9; 1. Agen yang mengikuti nilai yang naik akan berjalan ke tujuan lewat jalur terpendek.</div></div>
<p>Algoritma <b>value iteration</b> menerapkan persamaan Bellman berulang-ulang sampai nilainya berhenti berubah. Untuk game dengan keadaan sebanyak bintang di langit, tabel nilai diganti jaringan saraf: DQN (Mnih dkk., 2015) belajar memainkan puluhan game Atari langsung dari piksel.</p>

<h2>Belajar tanpa tahu aturan dunia</h2>
<p>Biasanya agen tidak tahu P dan r; ia hanya mencoba. <b>Temporal difference</b> (Sutton, 1988) memperbarui tebakan nilai dengan selisih antara tebakan lama dan "reward nyata + γ × tebakan berikutnya". Ini gradient descent (3.1) ke arah persamaan Bellman.</p>
<p>Alternatifnya, latih <b>policy</b> langsung: jaringan yang mengeluarkan peluang setiap aksi (softmax, 4.2). Policy gradient menaikkan peluang aksi yang ternyata menghasilkan reward di atas rata-rata. PPO (Schulman dkk., 2017) membatasi seberapa jauh policy boleh berubah per pembaruan supaya pelatihan stabil, dan dipakai di RLHF (5.13).</p>
<div class="rule">Dilema abadi RL: <mark>eksplorasi vs eksploitasi</mark>. Agen yang selalu memilih aksi terbaik menurut pengetahuannya tidak pernah menemukan yang lebih baik; agen yang terus mencoba hal baru tidak pernah memanen.</div>

<h2>Periksa dengan Python</h2>
<pre><code>gamma, V = 0.9, [0.0] * 5        # kotak 0..4, kotak 4 di samping tujuan
for putaran in range(10):
    V = [gamma * V[i + 1] if i &lt; 4 else 1.0 for i in range(5)]
print([round(v, 3) for v in V])  # [0.656, 0.729, 0.81, 0.9, 1.0]</code></pre>

<h2>Penutup Lapis 5: satu langkah belajar model bahasa mini</h2>
<p>Hampir semua alat kursus ini muncul dalam satu langkah pelatihan model bahasa. Versi mininya: vektor konteks h = (1, 0) (1.8) dan tiga token dengan embedding (2, 0), (1, 1), dan (0, 2) (5.13). Logit tiap token adalah hasil kali titik embedding-nya dengan h, softmax (4.2) mengubahnya jadi peluang, cross-entropy (3.4) mengukur kesalahan, gradien logit adalah p − y (5.1), aturan rantai (5.4) membawanya ke h, dan gradient descent (3.1) menggeser h.</p>
<div class="ex"><div class="q">Token yang benar adalah token kedua. Hitung loss, lakukan satu langkah gradient descent pada h dengan learning rate 0,5, lalu hitung loss baru.</div>
<div class="step">logit = (2·1 + 0·0, 1·1 + 1·0, 0·1 + 2·0) = (2, 1, 0)
p = softmax = (0,665; 0,245; 0,090)
loss = −ln 0,245 ≈ 1,408
p − y = (0,665; −0,755; 0,090)
gradien ke h = 0,665·(2, 0) − 0,755·(1, 1) + 0,090·(0, 2) = (0,575; −0,575)
h ← (1, 0) − 0,5 × (0,575; −0,575) ≈ (0,712; 0,288)
logit baru ≈ (1,425; 1; 0,575), p ≈ (0,480; 0,314; 0,205), loss ≈ 1,158</div>
<div class="ans">Jawaban: peluang token yang benar naik dari 0,245 ke 0,314 dan loss turun dari 1,408 ke 1,158. Model sungguhan melakukan langkah yang sama dengan ribuan dimensi, puluhan ribu token, dan juga memperbarui embedding serta semua bobot di antaranya.</div></div>
<pre><code>import numpy as np
E = np.array([[2., 0], [1, 1], [0, 2]]); h = np.array([1., 0]); y = np.array([0., 1, 0])
softmax = lambda z: np.exp(z) / np.exp(z).sum()
p = softmax(E @ h)
print(p.round(3), round(-np.log(p[1]), 3))   # [0.665 0.245 0.09 ] 1.408
h = h - 0.5 * E.T @ (p - y)
p = softmax(E @ h)
print(p.round(3), round(-np.log(p[1]), 3))   # [0.48  0.314 0.205] 1.158</code></pre>
`,
  src: [
    "Sutton & Barto, <i>Reinforcement Learning: An Introduction</i>, Bab 3 “Finite Markov Decision Processes” dan Bab 4 (value iteration). Lokal.",
    "Sutton (1988), “Learning to Predict by the Methods of Temporal Differences”; Sutton dkk. (1999), “Policy Gradient Methods for RL with Function Approximation”. Lokal.",
    "Mnih dkk. (2015), “Human-level control through deep reinforcement learning” (DQN); Schulman dkk. (2017), “Proximal Policy Optimization Algorithms”; Silver dkk. (2016), AlphaGo. Lokal."
  ]
};

/* ───────────────────────── 5.15 ───────────────────────── */
window.LESSONS["5.15"] = {
  title: "Bonus: Black-Scholes",
  pre: "4.4, 4.5, 4.6, 2.9 distribusi normal", min: 0,
  why: "Pelajaran bonus yang menunjukkan bahwa matematika yang sama menggerakkan dunia keuangan. Rumus Black–Scholes (1973) untuk harga opsi saham dibangun dari gerak Brown, kalkulus Itô, dan persamaan panas, persis alat Lapis 4. Ini juga contoh bagus kapan closed form (rumus jadi) bisa dicek dengan simulasi Monte Carlo.",
  body: String.raw`
<p>Catatan: pelajaran ini menjelaskan matematika sebuah model, bukan nasihat investasi.</p>
<h2>Opsi: hak, bukan kewajiban</h2>
<p><b>Opsi beli</b> (call) memberi hak untuk membeli saham pada harga tertentu K (harga pelaksanaan) di waktu T mendatang. Kalau saat itu harga saham S<sub>T</sub> di atas K, kamu membeli murah dan menerima selisih S<sub>T</sub> − K; kalau di bawah, kamu tidak memakai haknya dan menerima 0. Ini <b>pembayaran</b>, belum keuntungan: harga opsi yang dibayar di awal belum dikurangi. Pembayarannya: <span class="tx">\max(S_T - K,\ 0)</span>. Pertanyaannya: berapa harga wajar hak ini hari ini?</p>

<h2>Model harga saham: gerak Brown geometris</h2>
<p>Black, Scholes, dan Merton memodelkan harga saham dengan SDE (4.5) yang perubahannya sebanding dengan harga itu sendiri:</p>
<div class="tx d">dS = \mu S\,dt + \sigma S\,dW</div>
<p>σ adalah <b>volatilitas</b>, seberapa liar harga bergoyang. Dengan <b>lemma Itô</b> (aturan rantai 2.2 versi kalkulus Itô; karena dW bergoyang sebesar √dt, muncul suku tambahan −σ²/2 di drift), log S menjadi gerak Brown dengan drift, seperti rumus kedua di atas. Akibatnya log S<sub>T</sub> berdistribusi normal, dan S<sub>T</sub> sendiri disebut berdistribusi <b>log-normal</b>. Lemma itu tidak diturunkan di sini.</p>
<div class="box intuisi"><p>Lemma Itô tidak dibuktikan di kursus ini (lihat 4.5), tapi intinya bisa dilihat. Di kalkulus biasa, perubahan ln S kira-kira dS/S, dan suku kuadrat (dS)² dibuang karena sangat kecil. Di gerak Brown, dW berukuran sekitar √dt (4.4), jadi (dW)² berukuran dt, sama besar dengan suku lain, dan tidak boleh dibuang. Ekspansi orde dua <span class="tx">d\ln S \approx \frac{dS}{S} - \frac{1}{2}\frac{(dS)^2}{S^2}</span> dengan <span class="tx">(dS)^2 \approx \sigma^2 S^2\,dt</span> memberi</p>
<div class="tx d">d\ln S = \left(\mu - \tfrac{1}{2}\sigma^2\right)dt + \sigma\,dW</div>
<p>Suku −σ²/2 itulah "ongkos" goyangan. Cek dengan simulasi: μ = 0,1 dan σ = 0,2, jadi rata-rata kenaikan ln S dalam setahun seharusnya 0,1 − 0,02 = 0,08, bukan 0,1.</p>
<pre><code>import numpy as np
rng = np.random.default_rng(0)
n, langkah, mu, sig, T = 20000, 250, 0.1, 0.2, 1.0
dt = T / langkah
S = np.full(n, 100.0)
for _ in range(langkah):
    S = S + mu * S * dt + sig * S * np.sqrt(dt) * rng.standard_normal(n)
print(round(np.log(S).mean() - np.log(100), 2))   # ≈ 0.08 (acak)
print(round(mu - sig**2 / 2, 3))                  # 0.08</code></pre></div>

<h2>Gagasan besar: lindung nilai menghapus risiko</h2>
<p>Dengan memegang opsi dan menjual saham dalam jumlah yang tepat (dan menyesuaikannya terus), goyangan dW dari keduanya saling meniadakan. Portofolio tanpa risiko harus tumbuh dengan bunga bebas risiko r, kalau tidak ada keuntungan gratis. Syarat ini menghasilkan persamaan diferensial parsial yang, setelah ganti variabel, berubah menjadi persamaan panas (4.6). Akibat mengejutkan: μ, perkiraan arah saham, <b>hilang</b> dari rumus. Harga opsi hanya bergantung pada σ, r, S, K, dan T.</p>

<h2>Rumusnya</h2>
<div class="tx d">C = S\,N(d_1) - K e^{-rT} N(d_2), \qquad d_{1,2} = \frac{\ln(S/K) + (r \pm \sigma^2/2)\,T}{\sigma\sqrt{T}}</div>
<p>N(d) adalah <b>fungsi distribusi kumulatif</b> normal standar: peluang bahwa Z ~ N(0, 1) (2.9) bernilai ≤ d, yaitu luas di bawah lonceng di sebelah kiri d. Contoh: N(0) = 0,5 (separuh lonceng), N(1) ≈ 0,841, N(−1) ≈ 0,159, N(1,96) ≈ 0,975. Di Python: <code>scipy.stats.norm.cdf(d)</code>.</p>
<div class="ex"><div class="q">S = 100, K = 100, r = 5% per tahun, σ = 20%, T = 1 tahun. Hitung harga opsi beli.</div>
<div class="step">d₁ = (0 + (0,05 + 0,02) × 1) ÷ 0,2 = 0,35
d₂ = 0,35 − 0,2 = 0,15
N(0,35) ≈ 0,6368, N(0,15) ≈ 0,5596
C = 100 × 0,6368 − 100 × e⁻⁰·⁰⁵ × 0,5596</div>
<div class="ans">Jawaban: C ≈ 10,45</div></div>

<h2>Cek dengan Monte Carlo</h2>
<p>Harga yang sama bisa didapat tanpa rumus: simulasikan sejuta harga akhir dengan drift r (bukan μ, karena lindung nilai tadi), hitung pembayaran setiap simulasi, ambil rata-rata, lalu diskon dengan <span class="tx">e^{-rT}</span>. Hasilnya 10,47 ± 0,015, cocok dengan rumus. Untuk opsi yang rumit, yang tidak punya closed form (rumus jadi), Monte Carlo seperti inilah yang dipakai.</p>
<div class="rule">Model ini bersandar pada asumsi yang tidak sepenuhnya benar: volatilitas tetap, harga bergerak tanpa lompatan, perdagangan tanpa biaya. Krisis keuangan menunjukkan <mark>ekor distribusi nyata lebih tebal</mark> daripada normal. Model berguna, tapi tetap model.</div>

<h2>Periksa dengan Python</h2>
<pre><code>import math, numpy as np
S, K, r, s, T = 100, 100, 0.05, 0.2, 1
N = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))
d1 = (math.log(S / K) + (r + s**2 / 2) * T) / (s * math.sqrt(T)); d2 = d1 - s * math.sqrt(T)
print(round(S * N(d1) - K * math.exp(-r * T) * N(d2), 4))        # 10.4506
z = np.random.default_rng(0).normal(size=1_000_000)
ST = S * np.exp((r - s**2 / 2) * T + s * math.sqrt(T) * z)
print(round(math.exp(-r * T) * np.maximum(ST - K, 0).mean(), 2))  # 10.47</code></pre>
`,
  src: [
    "Black & Scholes (1973), “The Pricing of Options and Corporate Liabilities”, <i>Journal of Political Economy</i> 81; Merton (1973), “Theory of Rational Option Pricing”. Lokal.",
    "Hull, <i>Options, Futures, and Other Derivatives</i>, bab “The Black–Scholes–Merton Model” dan bab Monte Carlo. Lokal.",
    "Øksendal, <i>Stochastic Differential Equations</i> (5e), Bab 12 (aplikasi ke keuangan matematis). Lokal."
  ]
};
