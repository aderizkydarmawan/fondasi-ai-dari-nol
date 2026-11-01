window.LESSONS = window.LESSONS || {};
/* Lapis 4 · Fisika di balik AI. Rumus LaTeX langsung (<span class="tx">, <div class="tx d">). */

/* ───────────────────────── 4.1 ───────────────────────── */
window.LESSONS["4.1"] = {
  title: "Energi dan suhu",
  pre: "1.5 eksponen, 2.9 distribusi", min: 0,
  why: "Banyak gagasan AI dipinjam langsung dari fisika panas: \"energi\" sebuah konfigurasi, \"suhu\" saat mengambil sampel teks, simulated annealing, Boltzmann machine, energy-based model. Supaya istilah itu tidak sekadar kiasan, kita perlu tahu apa arti energi dan suhu bagi fisikawan.",
  body: String.raw`
<h2>Banyak partikel, sedikit yang kita tahu</h2>
<p>Segelas air berisi sekitar <span class="tx">10^{25}</span> molekul. Tidak ada yang bisa melacak semuanya. Fisika statistik menyerah pada detail dan bertanya hal yang lebih masuk akal: dari semua susunan yang mungkin, berapa peluang setiap susunan? Ini cara pandang yang sama dengan machine learning: kita tidak tahu proses persis yang menghasilkan data, jadi kita memodelkan peluangnya.</p>

<h2>Energi: harga sebuah susunan</h2>
<p>Setiap susunan (fisikawan menyebutnya <b>keadaan</b> atau mikrostate) punya energi E. Bola di dasar mangkuk berenergi rendah, bola di bibir mangkuk berenergi tinggi. Alam cenderung ke energi rendah, tapi tidak sepenuhnya: tumbukan acak antarmolekul terus menendang sistem ke keadaan berenergi lebih tinggi.</p>

<h2>Suhu: seberapa keras tendangannya</h2>
<p>Suhu mengukur besarnya tendangan acak itu. Satuan energi yang cocok adalah <span class="tx">kT</span>, dengan k konstanta Boltzmann (<span class="tx">8{,}617 \times 10^{-5}</span> eV per kelvin). Pada suhu kamar (300 K), kT ≈ 0,026 eV. Keadaan yang energinya lebih tinggi beberapa kT dari dasar jarang dikunjungi; yang lebih tinggi ratusan kT praktis tidak pernah.</p>
<div class="rule">Peluang relatif dua keadaan yang berselisih energi ΔE: <mark>rasio = e<sup>−ΔE/kT</sup></mark>. Selisih 1 kT membuat keadaan atas 2,7 kali lebih jarang; selisih 5 kT, 148 kali lebih jarang.</div>
<div class="ex"><div class="q">Dua keadaan berselisih energi 1 satuan. Berapa rasio peluang keadaan atas terhadap bawah pada kT = 1, kT = 0,5, dan kT = 5?</div>
<div class="step">kT = 1: e⁻¹ ≈ 0,368
kT = 0,5: e⁻² ≈ 0,135
kT = 5: e⁻⁰·² ≈ 0,819</div>
<div class="ans">Jawaban: 0,37; 0,14; 0,82. Dingin = hampir selalu di bawah; panas = kedua keadaan nyaris sama sering.</div></div>

<h2>Entropi dan definisi suhu yang sebenarnya</h2>
<p>Boltzmann menulis entropi sebagai <span class="tx">S = k \ln \Omega</span>, dengan Ω banyaknya susunan mikro yang tampak sama dari luar. Ini entropi Shannon (3.4) dalam satuan fisika. Suhu lalu didefinisikan dari seberapa cepat entropi bertambah ketika energi ditambah:</p>
<div class="tx d">\frac{1}{T} = \frac{\partial S}{\partial E}</div>
<p>Dua benda bersentuhan saling bertukar energi sampai suhunya sama, karena saat itulah entropi total paling besar. "Panas mengalir dari yang panas ke yang dingin" ternyata akibat menghitung peluang.</p>

<h2>Di AI</h2>
<ul><li><b>Energy-based model</b>: model memberi angka energi pada setiap masukan, dan masukan berenergi rendah dianggap lebih masuk akal (Hopfield 1982, Boltzmann machine 1985).</li>
<li><b>Simulated annealing</b> (Kirkpatrick dkk., 1983): cari solusi terbaik dengan mulai panas (bebas melompat) lalu pelan-pelan didinginkan (mengendap di lembah dalam).</li>
<li><b>Suhu sampling</b> di model bahasa (4.2 dan 5.13).</li></ul>

<h2>Periksa dengan Python</h2>
<pre><code>import math
print(round(8.617333e-5 * 300, 4))                  # 0.0259
for kT in (1, 0.5, 5):
    print(kT, round(math.exp(-1 / kT), 3))
# 1 0.368
# 0.5 0.135
# 5 0.819</code></pre>
`,
  src: [
    "Schroeder, <i>An Introduction to Thermal Physics</i>, Bab 1 “Energy in Thermal Physics” (pratinjau 44 halaman). Lokal.",
    "Tong, <i>Statistical Physics</i> (catatan kuliah Cambridge, gratis), §1.2 “The Microcanonical Ensemble” dan §1.3 “The Canonical Ensemble”. Lokal.",
    "Sethna, <i>Statistical Mechanics: Entropy, Order Parameters, and Complexity</i> (2e), §3.3 “What is temperature?”. Lokal.",
    "Kirkpatrick, Gelatt & Vecchi (1983), “Optimization by Simulated Annealing”, <i>Science</i>; Hopfield (1982). Lokal."
  ]
};

/* ───────────────────────── 4.2 ───────────────────────── */
window.LESSONS["4.2"] = {
  title: "Distribusi Boltzmann dan softmax",
  pre: "4.1, 3.4", min: 0,
  why: "Softmax, fungsi yang mengubah skor menjadi peluang di ujung setiap classifier dan setiap langkah model bahasa, adalah distribusi Boltzmann dari fisika abad ke-19 dengan tanda dibalik. Tombol \"temperature\" di ChatGPT benar-benar suhu dalam rumus itu.",
  body: String.raw`
<h2>Distribusi Boltzmann</h2>
<p>Sistem pada suhu T berada di keadaan i dengan energi <span class="tx">E_i</span> dengan peluang</p>
<div class="tx d">p_i = \frac{e^{-E_i/kT}}{Z}, \qquad Z = \sum_j e^{-E_j/kT}</div>
<p>Pembilangnya faktor Boltzmann dari 4.1. Penyebut Z, disebut <b>fungsi partisi</b>, hanya penjumlah supaya semua peluang berjumlah 1. Tapi Z menyimpan banyak informasi: energi rata-rata, entropi, dan energi bebas (4.3) semuanya bisa diturunkan darinya.</p>
<div class="ex"><div class="q">Tiga keadaan berenergi 0, 1, 2 (dalam satuan kT = 1). Hitung peluangnya.</div>
<div class="step">Faktor: e⁰ = 1, e⁻¹ ≈ 0,368, e⁻² ≈ 0,135
Z = 1 + 0,368 + 0,135 = 1,503
Bagi setiap faktor dengan Z</div>
<div class="ans">Jawaban: 0,665; 0,245; 0,090</div></div>
<div class="tbl"><table><tr><th>suhu kT</th><td>0,5 (dingin)</td><td>1</td><td>5 (panas)</td></tr>
<tr><th>peluang tiga keadaan</th><td>0,867; 0,117; 0,016</td><td>0,665; 0,245; 0,090</td><td>0,402; 0,329; 0,269</td></tr></table></div>
<p>Dingin: hampir semua peluang di keadaan terendah. Panas: makin rata. Jaynes (1957) menunjukkan kenapa bentuknya harus eksponen: dari semua distribusi dengan energi rata-rata tertentu, distribusi Boltzmann adalah yang entropinya paling besar, yaitu yang paling sedikit mengandaikan hal lain.</p>

<h2>Softmax = Boltzmann dengan tanda dibalik</h2>
<p>Classifier menghasilkan skor mentah z (disebut <b>logit</b>), dan skor tinggi berarti lebih mungkin. Ganti energi dengan minus skor, maka keluarlah softmax:</p>
<div class="tx d">\text{softmax}(z)_i = \frac{e^{z_i/T}}{\sum_j e^{z_j/T}}</div>
<p>Persisnya: ambil <span class="tx">E_i = -z_i</span>, lalu anggap konstanta Boltzmann k = 1 sehingga kT cukup ditulis T. Pada T = 1, softmax sama persis dengan distribusi Boltzmann.</p>
<div class="ex"><div class="q">Logit z = [2; 1; 0,1]. Hitung softmax pada T = 1.</div>
<div class="step">e² ≈ 7,389, e¹ ≈ 2,718, e⁰·¹ ≈ 1,105
Jumlah ≈ 11,212</div>
<div class="ans">Jawaban: [0,659; 0,242; 0,099]</div></div>
<p>Dengan T = 0,5 hasilnya [0,864; 0,117; 0,019], lebih yakin. Dengan T = 2 hasilnya [0,502; 0,304; 0,194], lebih ragu.</p>
<div class="rule">Suhu rendah: model memilih jawaban teratas hampir selalu (teks kaku, mengulang). Suhu tinggi: pilihan lebih beragam (teks kreatif, tapi bisa ngawur). <mark>T → 0 menjadi argmax.</mark></div>

<h2>Di AI</h2>
<ul><li>Output layer classifier dan model bahasa: softmax atas logit, dilatih dengan cross-entropy (3.4).</li>
<li>Attention (5.7): bobot perhatian adalah softmax dari skor kecocokan, dibagi <span class="tx">\sqrt{d}</span> yang berperan seperti suhu.</li>
<li>Distilasi model (Hinton dkk., 2015): model kecil belajar dari softmax model besar pada suhu tinggi, supaya peluang kelas yang kecil-kecil ikut terlihat.</li></ul>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
def softmax(z, T=1):
    w = np.exp(np.array(z) / T); return w / w.sum()
print(softmax([0, -1, -2]).round(3))          # [0.665 0.245 0.09 ]
for T in (1, 0.5, 2):
    print(T, softmax([2, 1, 0.1], T).round(3))
# 1 [0.659 0.242 0.099]
# 0.5 [0.864 0.117 0.019]
# 2 [0.502 0.304 0.194]</code></pre>
`,
  src: [
    "Kittel & Kroemer, <i>Thermal Physics</i> (2e), Bab 3 “Boltzmann Distribution and Helmholtz Free Energy”. Lokal.",
    "Tong, <i>Statistical Physics</i>, §1.3 “The Canonical Ensemble”. Lokal.",
    "Jaynes (1957), “Information Theory and Statistical Mechanics”, <i>Physical Review</i>. Lokal.",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §6.2.2.3 “Softmax Units for Multinoulli Output Distributions”. Lokal."
  ]
};

/* ───────────────────────── 4.3 ───────────────────────── */
window.LESSONS["4.3"] = {
  title: "Energi bebas dan inferensi variasional",
  pre: "4.2, 3.3, 3.4", min: 0,
  why: "Posterior Bayes (3.3) untuk model besar tidak bisa dihitung tepat. Jalan keluar paling populer, inferensi variasional, adalah resep fisika: minimalkan energi bebas. Inilah matematika di balik VAE, loss ELBO, dan banyak metode ketidakpastian dalam deep learning.",
  body: String.raw`
<h2>Tarik-menarik energi dan entropi</h2>
<p>Pada suhu T, alam tidak sekadar meminimalkan energi, juga tidak sekadar memaksimalkan entropi. Yang diminimalkan adalah kompromi keduanya, <b>energi bebas</b>:</p>
<div class="tx d">F = \langle E \rangle - T\,S</div>
<p>Tanda kurung sudut <span class="tx">\langle E \rangle</span> adalah cara fisikawan menulis ekspektasi, sama dengan <span class="tx">\mathbb{E}[E]</span> dari 2.10: energi rata-rata, ditimbang peluang tiap keadaan. S adalah entropi Boltzmann dari 4.1.</p>
<p>Suhu menentukan siapa yang menang. Dingin: suku energi menang, sistem mengendap di keadaan terendah (es). Panas: suku entropi menang, sistem menyebar ke banyak keadaan (uap). Untuk distribusi Boltzmann, nilai minimumnya bisa dihitung dari fungsi partisi: <span class="tx">F = -kT \ln Z</span>.</p>

<h2>Energi bebas untuk tebakan apa pun</h2>
<p>Tulis rumus yang sama untuk distribusi q sembarang, tidak harus Boltzmann: <span class="tx">F[q] = \langle E \rangle_q - T\,H(q)</span>. Ternyata selisihnya dengan minimum adalah divergensi KL dari 3.4:</p>
<div class="tx d">F[q] - F = kT\; D_{\text{KL}}(q \,\|\, p)</div>
<p>KL selalu ≥ 0, jadi F[q] tidak pernah di bawah F, dan sama hanya kalau q = p. Meminimalkan F[q] sama dengan mendekatkan q ke distribusi Boltzmann.</p>
<div class="ex"><div class="q">Tiga keadaan berenergi 0, 1, 2 (kT = 1). Bandingkan F[q] untuk q Boltzmann, q seragam, dan q yang selalu di keadaan terendah.</div>
<div class="step">Boltzmann [0,665; 0,245; 0,090]: ⟨E⟩ = 0,425, H = 0,832, F = −0,408
Seragam: ⟨E⟩ = 1, H = ln 3 ≈ 1,099, F[q] = −0,099
Selalu terendah: ⟨E⟩ = 0, H = 0, F[q] = 0</div>
<div class="ans">Jawaban: Boltzmann paling rendah (−0,408 = −ln Z). Seragam terlalu banyak membayar energi; "selalu terendah" kehilangan semua entropi. Selisih seragam: −0,099 − (−0,408) = 0,309 = KL(seragam ‖ Boltzmann).</div></div>

<h2>Inferensi variasional: posterior sebagai sistem fisika</h2>
<p>Posterior Bayes bisa ditulis seperti distribusi Boltzmann: <span class="tx">p(\theta\mid D) = e^{-E(\theta)}/Z</span> dengan "energi" <span class="tx">E(\theta) = -\log p(D\mid\theta) - \log p(\theta)</span> dan Z = p(D), peluang data. Z inilah yang mustahil dihitung untuk model besar.</p>
<p>Jalan keluarnya: pilih keluarga distribusi yang mudah (misalnya normal dengan rata-rata dan varians yang bisa diatur), lalu cari anggota yang F[q]-nya terkecil. Kita tidak butuh Z, karena Z hanya konstanta. Di machine learning, minus F[q] disebut <b>ELBO</b> (evidence lower bound), karena ia batas bawah dari log p(D). Kenapa batas bawah? Rumus di atas berkata F[q] − F = KL ≥ 0. Di sini kT = 1, jadi F = −ln Z = −log p(D). Akibatnya −F[q] = log p(D) − KL, yang tidak pernah melebihi log p(D). Dan ELBO = −F[q]: memaksimalkan ELBO sama dengan meminimalkan F[q]. Ditulis lengkap:</p>
<div class="tx d">\log p(D) \;\ge\; \underbrace{\mathbb{E}_q[\log p(D\mid\theta)]}_{\text{cocok dengan data}} - \underbrace{D_{\text{KL}}(q(\theta)\,\|\,p(\theta))}_{\text{jangan jauh dari prior}}</div>
<p>Dua suku ini akan muncul lagi persis sebagai loss VAE (5.10): reconstruction error ditambah KL.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
E = np.array([0, 1, 2.]); p = np.exp(-E) / np.exp(-E).sum()
F = lambda q: (q * E).sum() + (q[q > 0] * np.log(q[q > 0])).sum()
u = np.ones(3) / 3
print(round(F(p), 3), round(-np.log(np.exp(-E).sum()), 3))   # -0.408 -0.408
print(round(F(u), 3), round(F(u) - F(p), 3))                 # -0.099 0.309
print(round((u * np.log(u / p)).sum(), 3))                   # 0.309</code></pre>
`,
  src: [
    "MacKay, <i>Information Theory, Inference, and Learning Algorithms</i>, Bab 33 “Variational Methods”, §33.1 “Variational free energy minimization”. Lokal.",
    "Kingma & Welling (2019), “An Introduction to Variational Autoencoders”, bagian “Evidence Lower Bound (ELBO)”. Lokal.",
    "Kittel & Kroemer, <i>Thermal Physics</i> (2e), Bab 3 (Helmholtz free energy). Lokal.",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §8.4 “Probabilistic Modeling and Inference”. Lokal."
  ]
};

/* ───────────────────────── 4.4 ───────────────────────── */
window.LESSONS["4.4"] = {
  title: "Jalan acak dan gerak Brown",
  pre: "2.9, 2.10 varians", min: 0,
  why: "Jalan acak adalah model paling sederhana untuk noise yang menumpuk. Model difusi (5.12) membuat gambar dari noise dengan membalik jalan acak; SGD (3.1) adalah jalan acak di sekitar lembah; harga saham di 5.15 dimodelkan sebagai gerak Brown. Satu hukum dari pelajaran ini, jarak tumbuh seperti akar waktu, muncul di semua tempat itu.",
  body: String.raw`
<h2>Pemabuk di trotoar</h2>
<p>Seseorang berdiri di titik 0. Setiap detik ia melempar koin: gambar, satu langkah ke kanan; angka, satu langkah ke kiri. Di mana ia setelah n langkah?</p>
<p>Rata-ratanya tetap 0, karena kanan dan kiri sama mungkin. Tapi ia jarang tepat di 0. Setiap langkah ±1 punya varians 1, dan langkah-langkahnya saling bebas, jadi variansnya dijumlahkan (2.10):</p>
<div class="tx d">\text{Var}(X_n) = n, \qquad \text{simpangan baku} = \sqrt{n}</div>
<div class="rule">Jarak khas dari titik awal tumbuh seperti <mark>akar waktu</mark>, bukan sebanding waktu. 100 langkah → sekitar 10 langkah dari awal; 10.000 langkah → sekitar 100.</div>
<div class="ex"><div class="q">Simulasi 10.000 pemabuk, masing-masing 100 langkah. Berapa simpangan baku posisi akhir? Bagaimana setelah 25 langkah?</div>
<div class="step">Teori: √100 = 10, √25 = 5
Simulasi (Python di bawah): 9,96 dan 5,02</div>
<div class="ans">Jawaban: sekitar 10 dan 5. Waktu empat kali lipat, jarak hanya dua kali lipat.</div></div>
<p>Menurut teorema limit pusat (2.9), posisi setelah banyak langkah berdistribusi hampir normal dengan varians n.</p>

<h2>Gerak Brown: jalan acak yang diperhalus</h2>
<p>Tahun 1827 (diterbitkan 1828) ahli botani Robert Brown melihat serbuk sari di air bergoyang tanpa henti. Einstein (1905) menjelaskannya: serbuk ditabrak molekul air dari segala arah, ribuan kali per detik, dan setiap tabrakan adalah satu langkah acak kecil. Buat langkahnya makin kecil dan makin sering, maka jalan acak menjadi <b>gerak Brown</b> W(t), dengan</p>
<div class="tx d">W(t) - W(s) \sim \mathcal{N}(0,\; t - s)</div>
<p>Perubahan dalam waktu Δt berdistribusi normal dengan varians Δt, jadi besarnya kira-kira <span class="tx">\sqrt{\Delta t}</span>. Akibat anehnya: untuk Δt kecil, <span class="tx">\sqrt{\Delta t}</span> jauh lebih besar dari Δt, sehingga lintasannya bergerigi di setiap skala dan tidak punya turunan di mana pun. Itulah sebabnya persamaan dengan noise Brown butuh kalkulus khusus (4.5).</p>
<p>Einstein juga menghubungkan laju penyebaran dengan suhu: koefisien difusi <span class="tx">D = kT/\gamma</span>, dengan γ gesekan.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
rng = np.random.default_rng(0)
posisi = rng.choice([-1, 1], size=(10000, 100)).cumsum(axis=1)
print(round(posisi[:, -1].std(), 2), round(posisi[:, 24].std(), 2))   # 9.96 5.02</code></pre>
`,
  src: [
    "Sethna, <i>Statistical Mechanics</i> (2e), Bab 2 “Random walks and emergent properties” (§2.1 “Random walk examples: universality and scale invariance”, §2.2 “The diffusion equation”). Lokal.",
    "Øksendal, <i>Stochastic Differential Equations</i> (5e), §2.2 “An Important Example: Brownian Motion”. Lokal.",
    "Grinstead & Snell, <i>Introduction to Probability</i>, §12.1 “Random Walks in Euclidean Space”. Lokal (gratis).",
    "Einstein (1905), “Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen”, <i>Annalen der Physik</i> 17. Lokal."
  ]
};

/* ───────────────────────── 4.5 ───────────────────────── */
window.LESSONS["4.5"] = {
  title: "Persamaan diferensial stokastik",
  pre: "3.7 ODE, 4.4", min: 0,
  why: "Model difusi modern ditulis sebagai persamaan diferensial stokastik (SDE): satu SDE merusak gambar menjadi noise, dan kebalikannya membangun gambar dari noise. Langevin dynamics, cara mengambil sampel dari distribusi dengan menuruni lembah sambil digoyang, juga sebuah SDE.",
  body: String.raw`
<div class="box intuisi"><p>Pelajaran ini sengaja berhenti di tingkat intuisi. Kalkulus Itô, yang membuat dW benar-benar bermakna, tidak diturunkan di sini; cukup pegang gambarnya: drift menarik, noise menggoyang, dan rumus rata-rata serta varians OU yang bisa kamu cek sendiri dengan simulasi.</p></div>
<h2>ODE ditambah noise</h2>
<p>ODE (3.7) berkata: perubahan = arah × waktu. SDE menambahkan tendangan acak dari gerak Brown (4.4):</p>
<div class="tx d">dX = \underbrace{f(X)\,dt}_{\text{drift}} + \underbrace{\sigma\,dW}_{\text{noise}}</div>
<p>Drift menarik X ke suatu arah; suku noise menggoyangnya. Karena W acak, setiap kali dijalankan lintasannya berbeda. Yang bisa diramalkan adalah <b>distribusi</b> X, bukan nilai persisnya.</p>

<h2>Euler–Maruyama: Euler dengan dadu</h2>
<p>Cara menyelesaikannya dengan komputer sama seperti Euler, ditambah satu bilangan acak normal per langkah. Ingat dari 4.4: tendangan Brown dalam waktu Δt berukuran <span class="tx">\sqrt{\Delta t}</span>, bukan Δt.</p>
<div class="tx d">X_{n+1} = X_n + f(X_n)\,\Delta t + \sigma\sqrt{\Delta t}\;\xi_n, \qquad \xi_n \sim \mathcal{N}(0, 1)</div>

<h2>Contoh: proses Ornstein–Uhlenbeck</h2>
<p>Ambil drift yang menarik ke nol: <span class="tx">dX = -\kappa X\,dt + \sigma\,dW</span>. Tanpa noise, X meluruh ke 0 seperti di 3.7. Dengan noise, X tidak pernah diam, tapi bergoyang di sekitar 0 dengan sebaran tetap. Tarikan dan tendangan mencapai keseimbangan:</p>
<div class="tx d">\text{varians stasioner} = \frac{\sigma^2}{2\kappa}</div>
<div class="ex"><div class="q">κ = 1, σ = 1, mulai dari X = 3. Berapa rata-rata dan varians X setelah waktu lama?</div>
<div class="step">Rata-rata: 3·e^(−κt) → 0
Varians: σ²/(2κ) = 1/2
Simulasi 5.000 lintasan sampai t = 10: rata-rata 0,015, varians 0,505 (hasil acak: tiap simulasi sedikit berbeda, tapi selalu dekat 0 dan 0,5)</div>
<div class="ans">Jawaban: rata-rata 0, varians 0,5. Titik awal sudah dilupakan; yang tersisa distribusi normal N(0; 0,5).</div></div>
<p>Inilah pola penting: SDE dengan drift yang tepat <b>melupakan</b> titik awal dan menuju satu distribusi tujuan, mirip rantai Markov (3.8) yang menuju distribusi stasioner.</p>

<h2>Langevin dynamics: mengambil sampel dengan menuruni lembah</h2>
<p>Pilih drift = minus gradien sebuah energi, dan noise yang sesuai dengan suhu:</p>
<div class="tx d">dX = -\nabla E(X)\,dt + \sqrt{2T}\,dW</div>
<p>Distribusi tujuannya adalah distribusi Boltzmann <span class="tx">p \propto e^{-E/T}</span> dari 4.2. Ini gradient descent (3.1) yang digoyang: tanpa noise ia jatuh ke dasar lembah, dengan noise ia menjelajahi lembah sesuai peluangnya. Welling &amp; Teh (2011) memakai SGD plus noise seperti ini untuk mengambil sampel posterior Bayes jaringan saraf.</p>

<h2>Di model difusi</h2>
<p>Song dkk. (2021) menulis model difusi sebagai SDE. Proses maju: SDE seperti Ornstein–Uhlenbeck mengubah gambar apa pun menjadi noise normal. Proses balik: SDE lain, yang drift-nya memuat gradien log peluang data (disebut <b>skor</b>), mengubah noise menjadi gambar. Jaringan saraf dilatih untuk menaksir skor itu (5.12).</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
rng = np.random.default_rng(0)
x = np.full(5000, 3.0); dt = 0.01
for langkah in range(1000):                      # sampai t = 10
    x = x - x * dt + np.sqrt(dt) * rng.normal(size=5000)
print(round(x.mean(), 3), round(x.var(), 3))     # 0.015 0.505</code></pre>
`,
  src: [
    "Øksendal, <i>Stochastic Differential Equations</i> (5e), Bab 1 “Introduction”, Bab 3 (integral Itô) dan Bab 5 (soal 5.7, proses Ornstein–Uhlenbeck). Lokal.",
    "Song dkk. (2021), “Score-Based Generative Modeling through Stochastic Differential Equations”, <i>ICLR</i>. Lokal.",
    "Welling & Teh (2011), “Bayesian Learning via Stochastic Gradient Langevin Dynamics”, <i>ICML</i>; Roberts & Tweedie (1996), konvergensi Langevin. Lokal."
  ]
};

/* ───────────────────────── 4.6 ───────────────────────── */
window.LESSONS["4.6"] = {
  title: "Persamaan panas dan Fokker-Planck",
  pre: "2.1 turunan kedua, 2.4 integral, 2.9 distribusi normal, 3.7, 4.4, 4.5", min: 0,
  why: "Satu partikel bergoyang acak; jutaan partikel menyebar dengan mulus seperti tinta di air. Persamaan panas dan Fokker–Planck menggambarkan penyebaran itu sebagai satu kurva peluang yang bergerak. Ini cara pandang kedua atas model difusi: bukan satu lintasan, tapi seluruh distribusi data yang pelan-pelan melebur menjadi noise.",
  body: String.raw`
<div class="box intuisi"><p>Pelajaran ini juga di tingkat intuisi. Persamaan diferensial parsial tidak diselesaikan secara formal; kita hanya membaca artinya (kelengkungan meratakan, drift menggeser) dan memeriksanya dengan simulasi kisi.</p></div>
<h2>Dari partikel ke kepadatan</h2>
<p>Lepaskan sejuta partikel di titik 0 dan biarkan masing-masing berjalan acak (4.4). Lihat histogramnya, bukan satu partikel. Histogram itu awalnya paku tajam, lalu melebar menjadi lonceng normal yang makin pendek dan makin lebar. Kurva kepadatan u(x, t) ini mengikuti <b>persamaan panas</b> (atau persamaan difusi):</p>
<div class="tx d">\frac{\partial u}{\partial t} = D\,\frac{\partial^2 u}{\partial x^2}</div>
<p>Turunan kedua (2.1) mengukur kelengkungan. Di puncak, kurva melengkung ke bawah (turunan kedua negatif), jadi u turun. Di lembah, u naik. Persamaan ini meratakan apa saja: tonjolan dikikis, cekungan diisi. Itu juga cara panas menyebar di batang logam, yang membuat Fourier menemukan persamaan ini (dipresentasikan 1807, dibukukan 1822).</p>

<h2>Jawaban untuk sebuah paku</h2>
<p>Kalau semua kepadatan awalnya di x = 0, jawabannya distribusi normal yang melebar:</p>
<div class="tx d">u(x, t) = \frac{1}{\sqrt{4\pi D t}}\, e^{-x^2/(4Dt)}, \qquad \text{varians} = 2Dt</div>
<p>Varians bertambah sebanding waktu, persis hukum akar waktu dari 4.4. Dengan D = 1, setelah t = 0,5 simpangan bakunya <span class="tx">\sqrt{2 \cdot 1 \cdot 0{,}5} = 1</span>.</p>

<h2>Fokker–Planck: persamaan panas dengan arus</h2>
<p>Kalau partikel juga ditarik drift f(x), seperti di SDE 4.5, kepadatan tidak hanya menyebar tapi juga mengalir:</p>
<div class="tx d">\frac{\partial p}{\partial t} = -\frac{\partial}{\partial x}\big[f(x)\,p\big] + \frac{\sigma^2}{2}\,\frac{\partial^2 p}{\partial x^2}</div>
<p>Suku pertama memindahkan kepadatan sepanjang arah drift; suku kedua meratakannya. Ketika keduanya seimbang, ∂p/∂t = 0 dan kita dapat distribusi stasioner. Untuk Ornstein–Uhlenbeck dengan κ = 1, σ = 1, keseimbangan itu adalah N(0; 0,5), yaitu normal dengan rata-rata 0 dan <b>varians</b> 0,5 (bukan simpangan baku), angka yang sama dengan simulasi 4.5.</p>
<div class="rule">Satu SDE, dua cara pandang: <mark>SDE</mark> untuk satu lintasan acak, <mark>Fokker–Planck</mark> untuk seluruh kurva peluang yang bergerak secara pasti.</div>

<h2>Menghitung dengan komputer, dan jebakannya</h2>
<p>Bagi x menjadi kisi dengan jarak Δx, dan waktu menjadi langkah Δt. Turunan kedua didekati dengan <span class="tx">(u_{i+1} - 2u_i + u_{i-1})/\Delta x^2</span>, lalu maju dengan Euler. Skema ini <b>stabil</b> (galatnya tidak membesar dari langkah ke langkah sampai meledak) hanya kalau <span class="tx">D\,\Delta t/\Delta x^2 \le \tfrac12</span>. Kisi dihaluskan dua kali, langkah waktu harus diperkecil empat kali. Lagi-lagi pelajaran yang sama dengan learning rate (3.1) dan Euler (3.7).</p>

<h2>Di AI</h2>
<p>Sohl-Dickstein dkk. (2015), makalah yang memulai model difusi, terinspirasi langsung oleh termodinamika tak seimbang: perlahan hancurkan struktur data dengan proses difusi, lalu pelajari kebalikannya. Persamaan Fokker–Planck menjamin bahwa proses maju membawa distribusi data apa pun ke noise normal.</p>

<h2>Periksa dengan Python</h2>
<p>Kode di bawah memakai <b>slicing</b> NumPy (1.9) untuk menggeser array: <code>u[1:-1]</code> adalah semua titik kecuali dua ujung (titik i), <code>u[2:]</code> adalah tetangga kanannya (i + 1), dan <code>u[:-2]</code> tetangga kirinya (i − 1). Jadi satu baris menghitung u<sub>i+1</sub> − 2u<sub>i</sub> + u<sub>i−1</sub> untuk semua titik sekaligus, tanpa perulangan.</p>
<pre><code>import numpy as np
D, dx, dt = 1.0, 0.05, 0.001                  # D*dt/dx^2 = 0.4, stabil
x = np.arange(-6, 6 + dx / 2, dx); u = np.zeros_like(x); u[len(x) // 2] = 1 / dx
for langkah in range(500):                    # sampai t = 0.5
    u[1:-1] += D * dt / dx**2 * (u[2:] - 2 * u[1:-1] + u[:-2])
print(round((u * dx).sum(), 3), round(np.sqrt((u * x**2 * dx).sum()), 3))   # 1.0 1.0</code></pre>
`,
  src: [
    "Sethna, <i>Statistical Mechanics</i> (2e), §2.2 “The diffusion equation” dan §2.4 “Solving the diffusion equation”. Lokal.",
    "Song dkk. (2021), “Score-Based Generative Modeling through SDEs” (persamaan Fokker–Planck untuk proses maju). Lokal.",
    "Sohl-Dickstein dkk. (2015), “Deep Unsupervised Learning using Nonequilibrium Thermodynamics”, <i>ICML</i>. Lokal.",
    "Øksendal, <i>Stochastic Differential Equations</i> (5e), §7.3 “The Generator of an Ito Diffusion” dan Bab 8 (hubungan dengan persamaan diferensial parsial). Lokal."
  ]
};

/* ───────────────────────── 4.7 ───────────────────────── */
window.LESSONS["4.7"] = {
  title: "Mekanika Hamilton",
  pre: "2.3 gradien, 3.7 ODE", min: 0,
  why: "Hamiltonian Monte Carlo (HMC), cara mengambil sampel dari posterior yang dipakai Stan dan PyMC, meminjam hukum gerak Newton versi Hamilton: biarkan sebuah bola meluncur tanpa gesekan di lanskap peluang. Pelajaran ini juga menunjukkan kenapa cara menghitung simulasi bisa lebih penting daripada ukuran langkahnya.",
  body: String.raw`
<h2>Posisi, momentum, energi total</h2>
<p>Sekitar tahun 1830-an, Hamilton menulis ulang mekanika Newton dengan dua variabel: posisi q dan momentum p (massa × kecepatan). Seluruh fisika sistem termuat dalam satu fungsi, <b>Hamiltonian</b> H, yaitu energi total:</p>
<div class="tx d">H(q, p) = \underbrace{\tfrac{p^2}{2m}}_{\text{kinetik}} + \underbrace{U(q)}_{\text{potensial}}</div>
<p>Hukum geraknya dua persamaan pendek:</p>
<div class="tx d">\frac{dq}{dt} = \frac{\partial H}{\partial p}, \qquad \frac{dp}{dt} = -\frac{\partial H}{\partial q}</div>
<p>Yang pertama berkata: posisi berubah sesuai kecepatan. Yang kedua: momentum berubah karena gaya, dan gaya adalah minus gradien potensial (bola didorong menuruni lereng). Akibat langsungnya: H tidak berubah sepanjang gerak. <b>Energi kekal.</b></p>

<h2>Contoh: pegas</h2>
<p>Untuk pegas dengan m = 1 dan U = q²/2, H = (p² + q²)/2. Mulai dari q = 1, p = 0, energinya 0,5. Bola berayun dan di ruang (q, p) ia mengelilingi lingkaran berjari-jari 1 selamanya.</p>

<h2>Euler merusak hukum kekekalan</h2>
<p>Coba simulasikan dengan Euler (3.7), Δt = 0,1, 100 langkah. Setiap langkah mengalikan energi dengan tepat (1 + Δt²) = 1,01. Setelah 100 langkah energinya 0,5 × 1,01¹⁰⁰ ≈ 1,352, hampir tiga kali lipat. Lintasan di ruang (q, p) berputar keluar seperti obat nyamuk. Pegas yang seharusnya berayun abadi malah makin kencang tanpa sumber tenaga.</p>

<h2>Leapfrog: langkah lompat katak</h2>
<p>Metode <b>leapfrog</b> memecah langkah: setengah langkah momentum, satu langkah posisi, setengah langkah momentum lagi.</p>
<div class="tx d">p \leftarrow p - \tfrac{\Delta t}{2}\,\partial_q U, \quad q \leftarrow q + \Delta t\,p, \quad p \leftarrow p - \tfrac{\Delta t}{2}\,\partial_q U</div>
<div class="ex"><div class="q">Pegas H = (p² + q²)/2, mulai q = 1, p = 0, Δt = 0,1, 100 langkah. Berapa energinya dengan Euler dan dengan leapfrog?</div>
<div class="step">Euler: 0,5 × 1,01¹⁰⁰ ≈ 1,352
Leapfrog: 0,4996</div>
<div class="ans">Jawaban: Euler 1,352 (naik 170%), leapfrog 0,4996 (bergoyang sedikit di sekitar 0,5 tanpa pernah menjauh)</div></div>
<p>Biaya per langkahnya sama, tapi leapfrog menjaga struktur geometris persamaan Hamilton: ia mempertahankan luas di ruang (q, p), sifat yang disebut <b>simplektik</b> (teorema Liouville). Akibatnya energinya tidak hanyut, bahkan setelah jutaan langkah.</p>

<h2>Hamiltonian Monte Carlo</h2>
<p>Ambil posterior <span class="tx">p(\theta) \propto e^{-U(\theta)}</span>, seperti di 4.3, dan anggap U sebagai lanskap potensial. Beri bola momentum acak, biarkan ia meluncur dengan leapfrog beberapa puluh langkah, lalu catat tempat ia berhenti sebagai sampel berikutnya. Karena energi hampir kekal, usulan yang jauh pun hampir selalu diterima. HMC menjelajahi posterior berdimensi ribuan jauh lebih cepat daripada jalan acak Metropolis (3.8). Pelopornya Duane dkk. (1987) di fisika kuantum, lalu Neal membawanya ke statistik.</p>

<h2>Periksa dengan Python</h2>
<pre><code>dt = 0.1
q, p = 1.0, 0.0
for i in range(100):
    q, p = q + dt * p, p - dt * q              # Euler
print(round(0.5 * (q*q + p*p), 4))            # 1.3524
q, p = 1.0, 0.0
for i in range(100):
    p -= dt / 2 * q; q += dt * p; p -= dt / 2 * q   # leapfrog
print(round(0.5 * (q*q + p*p), 4))            # 0.4996</code></pre>
`,
  src: [
    "Tong, <i>Classical Dynamics</i> (catatan kuliah Cambridge, gratis), §4.1 “Hamilton’s Equations” dan §4.2 “Liouville’s Theorem”. Lokal.",
    "Goldstein, Poole & Safko, <i>Classical Mechanics</i> (3e), Bab 8 “The Hamilton Equations of Motion”. Lokal.",
    "Neal (2011), “MCMC using Hamiltonian dynamics”, dalam <i>Handbook of Markov Chain Monte Carlo</i> (metode leapfrog dan HMC). Lokal.",
    "Sethna, <i>Statistical Mechanics</i> (2e), §4.1 “Liouville’s theorem”. Lokal."
  ]
};
