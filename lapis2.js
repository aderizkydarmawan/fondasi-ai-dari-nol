window.LESSONS = window.LESSONS || {};
/* Lapis 2 · Tiga pilar. Rumus ditulis langsung dalam LaTeX: <span class="tx"> (sebaris) dan <div class="tx d"> (blok), dirender KaTeX. */

/* ───────────────────────── 2.1 ───────────────────────── */
window.LESSONS["2.1"] = {
  title: "Limit dan turunan",
  pre: "0.7 laju perubahan, 1.4 garis, 1.5", min: 0,
  why: "Setiap kali AI belajar, ia bertanya: kalau bobot ini digeser sedikit, kesalahan naik atau turun, dan secepat apa? Jawaban pertanyaan itu adalah turunan. Tanpa turunan tidak ada gradient descent, dan tanpa gradient descent tidak ada jaringan saraf modern.",
  body: String.raw`
<h2>Dari laju rata-rata ke laju sesaat</h2>
<p>Di pelajaran 0.7 kamu menghitung kecepatan rata-rata bola yang posisinya <span class="tx">s(t) = t^2</span>. Antara detik 2 dan 2,1 hasilnya 4,1. Antara detik 2 dan 2,01 hasilnya 4,01. Makin kecil selangnya, makin dekat ke 4.</p>
<p>Angka 4 itu tidak pernah benar-benar dicapai oleh selang mana pun, tapi semua selang yang makin kecil <b>menuju</b> ke sana. Angka tujuan seperti ini disebut <b>limit</b>.</p>
<div class="rule">Limit: nilai yang didekati sebuah ekspresi ketika sesuatu dibuat makin kecil. Ditulis <mark><span class="tx">\lim_{h \to 0}</span></mark>, dibaca "limit saat h menuju nol".</div>

<h2>Definisi turunan</h2>
<p>Ambil fungsi f dan titik x. Geser x sedikit sebesar h. Kemiringan garis yang menghubungkan dua titik itu adalah <span class="tx">\frac{f(x+h) - f(x)}{h}</span>, persis rumus kemiringan dari 1.4. Sekarang kecilkan h sampai nol:</p>
<div class="tx d">f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}</div>
<p>Hasilnya adalah <b>turunan</b> f di titik x: kemiringan garis singgung, atau laju perubahan sesaat. Notasi lain yang sering kamu temui: <span class="tx">\frac{df}{dx}</span>. Huruf d dibaca "perubahan sangat kecil dari".</p>
<div class="ex"><div class="q">Hitung turunan f(x) = x² di x = 3 dengan mengecilkan h.</div>
<div class="step">h = 1:      (16 − 9) ÷ 1 = 7
h = 0,1:    (9,61 − 9) ÷ 0,1 = 6,1
h = 0,01:   (9,0601 − 9) ÷ 0,01 = 6,01
Polanya menuju 6</div>
<div class="ans">Jawaban: f'(3) = 6</div></div>

<h2>Aturan pangkat, tanpa limit setiap kali</h2>
<p>Untuk x² kita bisa membuka limitnya sekali untuk semua x: <span class="tx">\frac{(x+h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h</span>. Saat h menuju 0, sisanya <b>2x</b>. Di x = 3, itu 6, cocok dengan hitungan di atas.</p>
<p>Silvanus Thompson, dalam <i>Calculus Made Easy</i>, menjelaskan kenapa h² boleh dibuang: kalau h sudah kecil, h² jauh lebih kecil lagi ("derajat kekecilan kedua"). Dengan cara yang sama untuk pangkat lain, muncul satu aturan yang dipakai di mana-mana:</p>
<div class="rule"><mark><span class="tx">\frac{d}{dx} x^n = n\,x^{n-1}</span></mark>. Contoh: turunan x³ adalah 3x², turunan x adalah 1, turunan konstanta adalah 0.</div>
<div class="ex"><div class="q">Turunan f(x) = 4x³ − 2x + 7?</div>
<div class="step">Kerjakan per suku (turunan jumlahan = jumlahan turunan)
4x³  →  4 · 3x² = 12x²
−2x  →  −2
7    →  0</div>
<div class="ans">Jawaban: f'(x) = 12x² − 2</div></div>

<h2>Dua turunan lagi: eˣ dan ln x</h2>
<p>AI memakai dua fungsi dari 1.5 terus-menerus, jadi turunannya perlu dihafal. Bilangan e ≈ 2,718 istimewa karena kemiringan grafik eˣ di setiap titik sama dengan tingginya sendiri. Logaritma natural ln x, kebalikan eˣ, punya kemiringan 1/x.</p>
<div class="rule"><mark><span class="tx">\frac{d}{dx} e^x = e^x \qquad \frac{d}{dx} \ln x = \frac{1}{x}</span></mark></div>
<div class="ex"><div class="q">Cek dengan selisih kecil h = 0,001: kemiringan eˣ di x = 1 dan ln x di x = 2.</div>
<div class="step">eˣ:   (e^1,001 − e¹) ÷ 0,001 ≈ 2,7196, dekat e ≈ 2,7183
ln x: (ln 2,001 − ln 2) ÷ 0,001 ≈ 0,49988, dekat 1/2</div>
<div class="ans">Jawaban: cocok dengan aturan: turunan eˣ di 1 adalah e, turunan ln x di 2 adalah 1/2.</div></div>
<p>Turunan ln x inilah yang dipakai saat melatih model dengan log-likelihood (3.2) dan cross-entropy (3.4).</p>

<h2>Turunan kedua: kemiringan dari kemiringan</h2>
<p>Turunan f' sendiri adalah fungsi, jadi ia juga punya turunan. Itu disebut <b>turunan kedua</b>, ditulis f''. Kalau f' mengukur kemiringan, f'' mengukur seberapa cepat kemiringan berubah, yaitu kelengkungan. f'' &gt; 0: grafik melengkung ke atas seperti mangkuk (lembah). f'' &lt; 0: melengkung ke bawah seperti bukit (puncak).</p>
<div class="ex"><div class="q">f(x) = x³. Hitung f'' di x = 1.</div>
<div class="step">f'(x) = 3x²  (aturan pangkat)
f''(x) = 6x  (turunkan sekali lagi)
f''(1) = 6
Cek selisih kecil: (f'(1,001) − f'(1)) ÷ 0,001 = (3,006003 − 3) ÷ 0,001 ≈ 6,003</div>
<div class="ans">Jawaban: f''(1) = 6, positif, jadi di x = 1 grafik x³ melengkung ke atas.</div></div>
<p>Turunan kedua dipakai untuk membedakan lembah dari puncak, untuk mendefinisikan fungsi cembung (5.1), dan di persamaan panas (4.6).</p>

<h2>Membaca turunan</h2>
<ul><li><b>f' &gt; 0</b>: fungsi sedang naik. Geser x ke kanan, f bertambah.</li>
<li><b>f' &lt; 0</b>: fungsi sedang turun.</li>
<li><b>f' = 0</b>: datar sesaat. Ini kandidat titik terendah atau tertinggi, dan di sinilah AI berharap berhenti.</li></ul>
<p>Contoh: f(x) = x² punya f'(x) = 2x. Di x = −3 turunannya −6 (turun), di x = 0 turunannya 0 (dasar mangkuk), di x = 3 turunannya 6 (naik). Kalau kamu ingin turun ke dasar, langkahlah ke arah <b>berlawanan</b> dengan tanda turunan. Itu sudah inti gradient descent (Lapis 3).</p>

<h2>Periksa dengan Python</h2>
<pre><code>f = lambda x: x**2
for h in [1, 0.1, 0.01, 0.001]:
    print(h, (f(3 + h) - f(3)) / h)
# 1 7.0
# 0.1 6.100000000000012
# 0.01 6.009999999999849
# 0.001 6.000999999999479</code></pre>
<p>Digit aneh di ujung (…012, …849) adalah pembulatan desimal komputer yang sudah kamu kenal di 0.3. Komputer tidak bisa membuat h benar-benar nol, jadi ia menghitung turunan dengan rumus (seperti 2x) atau dengan trik autodiff di pelajaran 2.2.</p>
`,
  src: [
    "Thompson, <i>Calculus Made Easy</i>, Bab II “On different degrees of smallness”, Bab III “On relative growings”, Bab IV “Simplest cases”. Lokal.",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §5.1 “Differentiation of Univariate Functions”. Lokal.",
    "OpenStax, <i>Calculus Volume 1</i>, Bab 2 “Limits” dan Bab 3 “Derivatives” (gratis online)."
  ]
};

/* ───────────────────────── 2.2 ───────────────────────── */
window.LESSONS["2.2"] = {
  title: "Aturan rantai",
  pre: "2.1, 1.3 fungsi dan komposisi", min: 0,
  why: "Jaringan saraf adalah fungsi di dalam fungsi di dalam fungsi, bisa ratusan lapis. Untuk tahu pengaruh satu bobot di lapis pertama terhadap kesalahan di ujung, kita butuh aturan rantai. Backpropagation, algoritme yang melatih semua jaringan saraf, adalah aturan rantai yang dihitung dengan rapi dari belakang.",
  body: String.raw`
<h2>Fungsi bersusun</h2>
<p>Di 1.3 kamu menghitung <span class="tx">g(f(x))</span>: masukkan x ke f, hasilnya masukkan ke g. Contoh: u = 2x + 1, lalu y = u². Jadi <span class="tx">y = (2x+1)^2</span>.</p>
<p>Pertanyaannya: kalau x digeser sedikit, berapa cepat y berubah? Kita bisa membuka kuadratnya dulu, tapi untuk fungsi yang lebih rumit itu tidak praktis. Ada cara yang jauh lebih bersih.</p>

<h2>Laju dikali laju</h2>
<p>Bayangkan roda gigi. Kalau u berubah 2 kali secepat x, dan y berubah 6 kali secepat u, maka y berubah 2 × 6 = 12 kali secepat x. Laju-laju di sepanjang rantai <b>dikalikan</b>.</p>
<div class="tx d">\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}</div>
<div class="rule"><mark>Aturan rantai</mark>: turunan fungsi bersusun = turunan fungsi luar (dihitung di nilai dalam) dikali turunan fungsi dalam.</div>
<div class="ex"><div class="q">y = (2x + 1)². Hitung dy/dx di x = 1.</div>
<div class="step">Dalam: u = 2x + 1, jadi du/dx = 2. Di x = 1, u = 3
Luar:  y = u², jadi dy/du = 2u = 2 · 3 = 6
Rantai: dy/dx = 6 · 2</div>
<div class="ans">Jawaban: 12</div></div>
<p>Cek dengan cara lama: (2x+1)² = 4x² + 4x + 1, turunannya 8x + 4. Di x = 1: 8 + 4 = 12. Sama.</p>

<h2>Contoh yang dipakai AI: sigmoid</h2>
<p>Fungsi sigmoid <span class="tx">\sigma(z) = \frac{1}{1 + e^{-z}}</span> memeras angka berapa pun menjadi antara 0 dan 1. Turunannya punya bentuk cantik:</p>
<div class="tx d">\sigma'(z) = \sigma(z)\,\bigl(1 - \sigma(z)\bigr)</div>
<p>Dari mana? Tulis σ = u⁻¹ dengan u = 1 + e⁻ᶻ. Luar: turunan u⁻¹ adalah −u⁻² (aturan pangkat dengan n = −1). Dalam: turunan 1 + e⁻ᶻ adalah −e⁻ᶻ (turunan eˣ dari 2.1, ditambah rantai: turunan −z adalah −1). Kalikan:</p>
<div class="tx d">\sigma'(z) = -\frac{1}{(1+e^{-z})^2}\cdot\bigl(-e^{-z}\bigr) = \underbrace{\frac{1}{1+e^{-z}}}_{\sigma(z)}\cdot\underbrace{\frac{e^{-z}}{1+e^{-z}}}_{1-\sigma(z)}</div>
<p>(Faktor kedua memang 1 − σ: tulis 1 − σ = 1 − 1/(1 + e⁻ᶻ), samakan penyebutnya, hasilnya e⁻ᶻ/(1 + e⁻ᶻ).) Di z = 0, σ = 0,5 dan turunannya 0,5 × 0,5 = 0,25. Ini nilai terbesarnya: hasil kali dua angka yang jumlahnya 1, yaitu σ dan 1 − σ, paling besar saat keduanya 0,5. Di z = 2, σ ≈ 0,881 dan turunannya hanya ≈ 0,105. Makin jauh dari nol, makin datar sigmoid, makin kecil turunannya.</p>

<h2>Rantai panjang dan masalahnya</h2>
<p>Sekarang bayangkan 10 lapis sigmoid bersusun. Aturan rantai mengalikan 10 turunan. Kalau masing-masing paling besar 0,25, hasilnya paling besar <span class="tx">0{,}25^{10} \approx 0{,}00000095</span>. Sinyal belajar untuk lapis pertama hampir hilang. Inilah <b>vanishing gradient</b>, masalah yang dipelajari Bengio dkk. (1994) dan salah satu alasan dunia beralih ke fungsi ReLU dan arsitektur seperti LSTM dan ResNet.</p>

<h2>Dihitung dari belakang</h2>
<p>Komputer menghitung aturan rantai dengan dua lintasan. Lintasan maju: hitung semua nilai antara (u = 3, y = 9). Lintasan mundur: mulai dari dy/dy = 1, kalikan turunan lokal satu per satu ke belakang (× 6, lalu × 2). Cara ini disebut <b>autodiff mode mundur</b>. Biayanya sekitar sekali lintasan maju, berapa pun banyaknya bobot. Itu sebabnya model dengan miliaran bobot bisa dilatih.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import math
x = 1.0
u = 2 * x + 1          # maju
y = u ** 2
dy_du = 2 * u          # mundur
du_dx = 2
print(dy_du * du_dx)   # 12.0

s = lambda z: 1 / (1 + math.exp(-z))
print(s(0) * (1 - s(0)))          # 0.25
print(round(s(2) * (1 - s(2)), 3))  # 0.105</code></pre>
`,
  src: [
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §5.2.2 “Chain Rule” dan Contoh 5.5. Lokal.",
    "Baydin dkk. (2018), “Automatic differentiation in machine learning: a survey”, <i>JMLR</i> 18. Lokal.",
    "Bengio, Simard & Frasconi (1994), “Learning long-term dependencies with gradient descent is difficult”, <i>IEEE Trans. Neural Networks</i>. Lokal."
  ]
};

/* ───────────────────────── 2.3 ───────────────────────── */
window.LESSONS["2.3"] = {
  title: "Turunan parsial dan gradien",
  pre: "2.1, 2.2, 1.8 vektor", min: 0,
  why: "Model AI tidak punya satu bobot, tapi jutaan sampai miliaran. Kesalahannya adalah fungsi dari semua bobot sekaligus. Gradien mengumpulkan turunan terhadap setiap bobot menjadi satu vektor yang menunjuk arah naik paling curam. Melatih AI = melangkah berlawanan dengan gradien, berulang-ulang.",
  body: String.raw`
<h2>Fungsi dengan banyak input</h2>
<p>Ambil <span class="tx">f(x, y) = x^2 + 3y^2</span>. Bayangkan ini peta ketinggian sebuah lembah: x dan y posisi di tanah, f ketinggiannya. Di titik (1, 1), tingginya 1 + 3 = 4.</p>

<h2>Turunan parsial: geser satu, bekukan yang lain</h2>
<p>Pertanyaan "seberapa curam" sekarang bergantung arah. Cara paling sederhana: geser x saja, anggap y konstanta. Hasilnya <b>turunan parsial terhadap x</b>, ditulis dengan d melengkung:</p>
<div class="tx d">\frac{\partial f}{\partial x} = 2x, \qquad \frac{\partial f}{\partial y} = 6y</div>
<p>Untuk ∂f/∂x, suku 3y² dianggap konstanta, jadi turunannya 0. Untuk ∂f/∂y, suku x² yang jadi konstanta. Aturan pangkat dari 2.1 tetap berlaku.</p>
<div class="ex"><div class="q">Hitung kedua turunan parsial f(x, y) = x² + 3y² di titik (1, 1).</div>
<div class="step">∂f/∂x = 2x = 2 · 1 = 2
∂f/∂y = 6y = 6 · 1 = 6</div>
<div class="ans">Jawaban: 2 dan 6. Lembah ini tiga kali lebih curam ke arah y.</div></div>

<h2>Gradien: semua turunan parsial dalam satu vektor</h2>
<div class="tx d">\nabla f = \begin{bmatrix} \partial f / \partial x \\ \partial f / \partial y \end{bmatrix}</div>
<p>Simbol ∇ dibaca "nabla" atau "grad". Di (1, 1), <span class="tx">\nabla f = [2,\ 6]</span>. Gradien punya dua sifat yang membuatnya jadi alat utama AI:</p>
<div class="rule"><mark>Gradien menunjuk arah naik paling curam.</mark> Panjangnya adalah kecuraman di arah itu. Jadi <span class="tx">-\nabla f</span> menunjuk arah <b>turun</b> paling curam.</div>
<p>Gradien juga selalu tegak lurus terhadap garis kontur (garis yang tingginya sama), seperti air yang mengalir tegak lurus garis kontur di peta topografi.</p>

<h2>Satu langkah menuruni lembah</h2>
<p>Dari (1, 1), melangkah sedikit ke arah −∇f dengan ukuran langkah η = 0,1 (η dibaca "eta", disebut <b>learning rate</b>):</p>
<div class="tx d">\text{baru} = \text{lama} - \eta\,\nabla f = [1,1] - 0{,}1\,[2,6] = [0{,}8,\ 0{,}4]</div>
<p>Tinggi baru: <span class="tx">0{,}8^2 + 3 \cdot 0{,}4^2 = 0{,}64 + 0{,}48 = 1{,}12</span>. Dari 4 turun ke 1,12 dalam satu langkah. Ulangi terus, dan kamu sampai di dasar (0, 0). Untuk AI, x dan y diganti jutaan bobot, dan f diganti fungsi kesalahan. Rumusnya tetap sama.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
f = lambda p: p[0]**2 + 3 * p[1]**2
grad = lambda p: np.array([2 * p[0], 6 * p[1]])
p = np.array([1.0, 1.0])
print(grad(p))            # [2. 6.]
p = p - 0.1 * grad(p)
print(p, round(f(p), 2))  # [0.8 0.4] 1.12</code></pre>
`,
  src: [
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §5.2 “Partial Differentiation and Gradients”. Lokal.",
    "Goodfellow, Bengio & Courville, <i>Deep Learning</i>, §4.3 “Gradient-Based Optimization”. Lokal.",
    "OpenStax, <i>Calculus Volume 3</i>, §4.3 “Partial Derivatives” dan §4.6 “Directional Derivatives and the Gradient” (gratis online)."
  ]
};

/* ───────────────────────── 2.4 ───────────────────────── */
window.LESSONS["2.4"] = {
  title: "Integral sebagai akumulasi",
  pre: "2.1, 1.6 notasi Σ", min: 0,
  why: "Peluang untuk data kontinu (tinggi badan, suhu, nilai piksel) dihitung sebagai luas di bawah kurva, yaitu integral. Ekspektasi, entropi, likelihood model kontinu, dan semua persamaan model difusi ditulis sebagai integral. Kamu jarang menghitungnya dengan tangan, tapi kamu harus bisa membacanya.",
  body: String.raw`
<h2>Menjumlahkan potongan kecil</h2>
<p>Mobil melaju 60 km/jam selama 2 jam. Jaraknya 120 km: luas persegi panjang di bawah grafik kecepatan. Kalau kecepatannya berubah-ubah, potong waktunya jadi selang-selang kecil, anggap kecepatan tetap di tiap selang, lalu jumlahkan luas persegi-persegi panjang kecil itu.</p>
<p>Itulah <b>jumlah Riemann</b>, dan ia memakai Σ dari 1.6:</p>
<div class="tx d">\text{luas} \approx \sum_{i=1}^{n} f(x_i)\,\Delta x</div>

<h2>Contoh: luas di bawah x² dari 0 sampai 1</h2>
<div class="ex"><div class="q">Hampiri luas di bawah y = x² dari 0 sampai 1 dengan 4 persegi panjang (tinggi diambil di ujung kanan).</div>
<div class="step">Δx = 1/4. Ujung kanan: 1/4, 2/4, 3/4, 1
Tinggi: 1/16, 4/16, 9/16, 16/16
Luas ≈ (1 + 4 + 9 + 16)/16 × 1/4 = 30/64</div>
<div class="ans">Jawaban: 0,46875 (terlalu besar, karena kurvanya naik)</div></div>
<p>Kalau tinggi diambil di ujung kiri, hasilnya 0,21875 (terlalu kecil). Makin banyak potongan, makin rapat keduanya:</p>
<div class="tbl"><table><tr><th>n potongan</th><td>4</td><td>10</td><td>100</td><td>1000</td></tr>
<tr><th>ujung kiri</th><td>0,2188</td><td>0,2850</td><td>0,3284</td><td>0,3328</td></tr>
<tr><th>ujung kanan</th><td>0,4688</td><td>0,3850</td><td>0,3384</td><td>0,3338</td></tr></table></div>
<p>Keduanya terjepit menuju satu angka: 1/3. Limit itulah yang disebut <b>integral</b>:</p>
<div class="tx d">\int_0^1 x^2\,dx = \frac{1}{3}</div>
<p>Tanda ∫ adalah huruf S yang dipanjangkan (dari "summa"), dan dx adalah Δx yang dibuat sangat kecil.</p>

<h2>Jalan pintas: integral membalik turunan</h2>
<p>Kenapa jawabannya tepat 1/3? Fungsi <span class="tx">F(x) = x^3/3</span> punya turunan x² (cek dengan aturan pangkat 2.1). <b>Teorema dasar kalkulus</b> mengatakan luas di bawah f dari a sampai b sama dengan <span class="tx">F(b) - F(a)</span>, untuk F yang turunannya f:</p>
<div class="tx d">\int_a^b f(x)\,dx = F(b) - F(a)</div>
<p>Jadi luasnya 1³/3 − 0³/3 = 1/3. Thompson menyebut integrasi sebagai "kebalikan dari diferensiasi". Turunan memotong menjadi laju; integral mengumpulkan laju menjadi total.</p>

<h2>Di AI: peluang adalah luas</h2>
<p>Untuk data kontinu, peluang satu nilai persis (tinggi tepat 170,000… cm) adalah nol. Yang bermakna adalah peluang sebuah <b>rentang</b>, dan itu luas di bawah kurva kepadatan p(x):</p>
<div class="tx d">P(a \le X \le b) = \int_a^b p(x)\,dx, \qquad \int_{-\infty}^{\infty} p(x)\,dx = 1</div>
<p>Simbol ∞ berarti tak hingga: batas −∞ sampai ∞ artinya "jumlahkan luas di seluruh garis bilangan, sejauh apa pun ke kiri dan ke kanan". Secara resmi itu limit (2.1): hitung luas dari −M sampai M, lalu biarkan M terus membesar. Luas totalnya harus 1: pasti terjadi sesuatu. Ini akan kamu pakai di 2.9 dan seterusnya.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
for n in [4, 10, 100, 1000]:
    xs = np.arange(n) / n                       # ujung kiri tiap potongan
    print(n, (xs**2).sum() / n, ((xs + 1/n)**2).sum() / n)
# 4 0.21875 0.46875
# 10 0.28500000000000003 0.385
# 100 0.32835000000000003 0.33835
# 1000 0.33283349999999995 0.33383349999999995</code></pre>
`,
  src: [
    "Thompson, <i>Calculus Made Easy</i>, Bab XVIII “Integrating as the reverse of differentiating” dan Bab XIX “On finding areas by integrating”. Lokal.",
    "OpenStax, <i>Calculus Volume 1</i>, Bab 5 “Integration”, termasuk §5.3 “The Fundamental Theorem of Calculus” (gratis online).",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §6.2 “Discrete and Continuous Probabilities”. Lokal."
  ]
};

/* ───────────────────────── 2.5 ───────────────────────── */
window.LESSONS["2.5"] = {
  title: "Matriks sebagai transformasi",
  pre: "1.8 vektor, 1.9 NumPy dan X @ w", min: 0,
  why: "Setiap lapis jaringan saraf diawali perkalian matriks: ia memutar, meregangkan, dan memproyeksikan data ke ruang baru. Kalau kamu melihat matriks sebagai gerakan ruang, bukan tabel angka, arsitektur AI berubah dari rumus gelap menjadi gambar yang bisa dibayangkan.",
  body: String.raw`
<h2>Matriks memindahkan vektor</h2>
<p>Di 1.9 kamu mengalikan matriks dengan vektor: tiap baris dikali-titik dengan vektor. Sekarang lihat hasilnya sebagai <b>gerakan</b>. Matriks <span class="tx">A = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}</span> mengirim (1, 1) ke (2, 1). Semua titik ditarik dua kali lebih jauh ke arah x, sementara y tetap.</p>

<h2>Kolom matriks = tujuan sumbu</h2>
<p>Trik paling berguna: lihat ke mana A mengirim dua vektor dasar, <span class="tx">e_1 = (1, 0)</span> dan <span class="tx">e_2 = (0, 1)</span>.</p>
<div class="rule"><mark>Kolom pertama A adalah tujuan e₁, kolom kedua adalah tujuan e₂.</mark> Vektor lain ikut, karena (x, y) = x·e₁ + y·e₂.</div>
<div class="ex"><div class="q">Matriks R = [[0; −1]; [1; 0]]. Ke mana (1, 0) dan (2, 1) pergi?</div>
<div class="step">Kolom 1 = (0, 1): sumbu x diputar ke atas
Kolom 2 = (−1, 0): sumbu y diputar ke kiri
(2, 1) = 2·(0, 1) + 1·(−1, 0) = (−1, 2)</div>
<div class="ans">Jawaban: (0, 1) dan (−1, 2). R adalah putaran 90° berlawanan jarum jam.</div></div>
<p>Beberapa gerakan yang sering muncul:</p>
<ul><li><b>Regangan</b> <span class="tx">\begin{bmatrix} a & 0 \\ 0 & d \end{bmatrix}</span>: sumbu x dikali a, sumbu y dikali d.</li>
<li><b>Putaran</b> sebesar θ: <span class="tx">\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}</span>.</li>
<li><b>Geser</b> (shear) <span class="tx">\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}</span>: persegi menjadi jajar genjang, alasnya tetap.</li></ul>

<h2>Linear artinya garis tetap garis</h2>
<p>Perkalian matriks disebut transformasi <b>linear</b> karena dua sifat: <span class="tx">A(u + v) = Au + Av</span> dan <span class="tx">A(cu) = c\,Au</span>. Akibatnya garis lurus tetap lurus, grid tetap grid (mungkin miring), dan titik asal tidak bergerak.</p>

<h2>Determinan: faktor luas</h2>
<p>Persegi satuan (luas 1) dikirim A menjadi jajar genjang. Luasnya adalah <b>determinan</b>:</p>
<div class="tx d">\det \begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc</div>
<p>Regangan [[2; 0]; [0; 1]] punya det 2 (luas berlipat dua). Putaran punya det 1 (luas tetap). Geser juga det 1. Kalau det = 0, bidang dipipihkan menjadi garis: informasi hilang dan gerakannya tidak bisa dibalik (2.6). Kalau det negatif, bidang dicerminkan.</p>

<h2>Di AI</h2>
<p>Satu lapis jaringan saraf menghitung <span class="tx">\sigma(Wx + b)</span>. Bagian <span class="tx">Wx</span> adalah transformasi linear seperti di atas, b menggeser, lalu σ membengkokkan. Lapis demi lapis, data yang kusut (misalnya dua kelas yang saling melilit) diregangkan dan dibengkokkan sampai bisa dipisah dengan garis lurus.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
A = np.array([[2, 0], [0, 1]])
R = np.array([[0, -1], [1, 0]])
print(A @ [1, 1])          # [2 1]
print(R @ [2, 1])          # [-1  2]
print(round(np.linalg.det(A), 6), round(np.linalg.det(R), 6))   # 2.0 1.0</code></pre>
`,
  src: [
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §2.7 “Linear Mappings” dan §4.1 “Determinant and Trace”. Lokal.",
    "Strang, <i>Linear Algebra and Its Applications</i> (4e), §2.6 “Linear Transformations”. Lokal.",
    "Sanderson (3Blue1Brown), seri video <i>Essence of Linear Algebra</i>, bab 3 “Linear transformations and matrices” (gratis online)."
  ]
};

/* ───────────────────────── 2.6 ───────────────────────── */
window.LESSONS["2.6"] = {
  title: "Perkalian matriks dan invers",
  pre: "2.5", min: 0,
  why: "Jaringan saraf dalam adalah gerakan yang disusun berurutan: lapis 1, lalu lapis 2, lalu lapis 3. Menyusun gerakan = mengalikan matriks. Invers menjawab pertanyaan sebaliknya: bisakah gerakan itu dibatalkan? Itu dipakai untuk menyelesaikan sistem persamaan, termasuk rumus tertutup regresi linear.",
  body: String.raw`
<h2>Menyusun dua gerakan</h2>
<p>Lakukan A dulu, lalu B. Vektor x menjadi <span class="tx">B(Ax)</span>. Ternyata ada satu matriks yang melakukan keduanya sekaligus, yaitu hasil kali <span class="tx">BA</span>:</p>
<div class="tx d">B(Ax) = (BA)\,x</div>
<div class="rule"><mark>Hasil kali BA dibaca dari kanan ke kiri</mark>: A dikerjakan lebih dulu, seperti g(f(x)) di 1.3.</div>
<p>Cara menghitungnya: entri baris i, kolom j dari BA adalah perkalian titik baris i dari B dengan kolom j dari A. Ukuran harus cocok: (m × n) dikali (n × p) menghasilkan (m × p).</p>

<h2>Urutan itu penting</h2>
<div class="ex"><div class="q">A = regangan [[2; 0]; [0; 1]], R = putaran 90° [[0; −1]; [1; 0]]. Bandingkan RA dan AR.</div>
<div class="step">RA (regang dulu, lalu putar) = [[0; −1]; [2; 0]]
AR (putar dulu, lalu regang) = [[0; −2]; [1; 0]]</div>
<div class="ans">Berbeda. Perkalian matriks umumnya tidak bisa ditukar: AB ≠ BA.</div></div>
<p>Coba dengan tangan: memakai baju lalu jaket tidak sama dengan memakai jaket lalu baju.</p>

<h2>Invers: membatalkan gerakan</h2>
<p>Invers <span class="tx">A^{-1}</span> adalah gerakan yang mengembalikan semua titik ke tempat asal: <span class="tx">A^{-1}A = I</span>, dengan <span class="tx">I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}</span> (matriks identitas, gerakan "diam"). Untuk 2 × 2 ada rumus:</p>
<div class="tx d">\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}</div>
<p>Perhatikan pembaginya: determinan dari 2.5. Kalau det = 0, rumusnya membagi dengan nol. Itu cocok dengan gambarannya: bidang yang sudah dipipihkan jadi garis tidak bisa dikembalikan, karena banyak titik berbeda sudah menumpuk di tempat yang sama.</p>

<h2>Menyelesaikan sistem persamaan</h2>
<p>Sistem di 1.2 bisa ditulis sebagai <span class="tx">Ax = b</span>. Kalau A punya invers, jawabannya <span class="tx">x = A^{-1}b</span>.</p>
<div class="ex"><div class="q">Selesaikan 2x + y = 5 dan x + y = 3 dengan invers.</div>
<div class="step">A = [[2; 1]; [1; 1]], det = 2·1 − 1·1 = 1
A⁻¹ = [[1; −1]; [−1; 2]]
x = A⁻¹ · (5, 3) = (5 − 3, −5 + 6)</div>
<div class="ans">Jawaban: x = 2, y = 1</div></div>
<p>Dalam praktik, komputer tidak menghitung invers secara eksplisit karena lebih lambat dan kurang akurat. Ia memakai eliminasi (fungsi <code>solve</code>). Tapi gagasannya sama: membatalkan A.</p>

<h2>Transpos: menukar baris dan kolom</h2>
<p><b>Transpos</b> sebuah matriks A, ditulis <span class="tx">A^\top</span> (dibaca "A transpos"), adalah A yang dibalik di sepanjang diagonal: baris pertama menjadi kolom pertama, baris kedua menjadi kolom kedua, dan seterusnya. Matriks 2 × 3 menjadi 3 × 2.</p>
<div class="tx d">A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} \quad\Rightarrow\quad A^\top = \begin{pmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{pmatrix}</div>
<p>Kegunaan pertamanya: perkalian titik dari 1.8 bisa ditulis sebagai perkalian matriks. Kalau a dan b vektor kolom, <span class="tx">a^\top b</span> berarti baris kali kolom, hasilnya satu angka: untuk a = (1, 2) dan b = (3, 4), hasilnya 1·3 + 2·4 = 11. Notasi ini muncul lagi di SVD (2.8), regresi (5.1), dan attention <span class="tx">QK^\top</span> (5.7). Di NumPy, transpos ditulis <code>A.T</code>.</p>

<h2>Di AI</h2>
<p>Tanpa fungsi aktivasi, dua lapis <span class="tx">W_2(W_1 x)</span> sama saja dengan satu lapis <span class="tx">(W_2W_1)x</span>. Sedalam apa pun, jaringan linear hanya satu transformasi linear. Fungsi aktivasi di antara lapis itulah yang membuat kedalaman bermanfaat.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
A = np.array([[2, 0], [0, 1]]); R = np.array([[0, -1], [1, 0]])
print((R @ A).tolist(), (A @ R).tolist())   # [[0, -1], [2, 0]] [[0, -2], [1, 0]]
B = np.array([[2, 1], [1, 1]])
print(np.linalg.inv(B).round(6).tolist())  # [[1.0, -1.0], [-1.0, 2.0]]
print(np.linalg.solve(B, [5, 3]))          # [2. 1.]</code></pre>
`,
  src: [
    "Boyd & Vandenberghe, <i>Introduction to Applied Linear Algebra</i> (VMLS), Bab 10 “Matrix multiplication” (§10.2 “Composition of linear functions”) dan Bab 11 “Matrix inverses”. Lokal.",
    "Strang, <i>Linear Algebra and Its Applications</i> (4e), §1.4 “Matrix Notation and Matrix Multiplication” dan §1.6 “Inverses and Transposes”. Lokal."
  ]
};

/* ───────────────────────── 2.7 ───────────────────────── */
window.LESSONS["2.7"] = {
  title: "Nilai dan vektor eigen",
  pre: "2.5, 2.6", min: 0,
  why: "Eigen adalah arah yang tidak dibelokkan oleh sebuah matriks, hanya diregangkan. PCA mencari arah eigen data, PageRank Google adalah vektor eigen, dan stabilitas pelatihan recurrent neural network (RNN) ditentukan oleh nilai eigen bobotnya: lebih dari 1 meledak, kurang dari 1 menghilang.",
  body: String.raw`
<h2>Arah yang tidak dibelokkan</h2>
<p>Sebagian besar vektor dibelokkan oleh matriks. Ambil <span class="tx">A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}</span>. Vektor (1, 0) dikirim ke (2, 1): arahnya berubah. Tapi (1, 1) dikirim ke (3, 3): arahnya <b>sama</b>, hanya tiga kali lebih panjang.</p>
<div class="rule">Vektor v (bukan nol) adalah <mark>vektor eigen</mark> A kalau <span class="tx">Av = \lambda v</span>. Angka λ (lambda) adalah <mark>nilai eigen</mark>: faktor regangannya.</div>
<p>Kata "eigen" dari bahasa Jerman, artinya "milik sendiri": arah yang menjadi milik matriks itu sendiri.</p>
<div class="ex"><div class="q">Cek apakah (1, 1) dan (1, −1) vektor eigen A = [[2; 1]; [1; 2]].</div>
<div class="step">A·(1, 1)  = (2+1, 1+2) = (3, 3)  = 3 · (1, 1)
A·(1, −1) = (2−1, 1−2) = (1, −1) = 1 · (1, −1)</div>
<div class="ans">Ya. Nilai eigennya 3 dan 1.</div></div>
<p>Jadi A meregangkan tiga kali di sepanjang diagonal y = x, dan membiarkan arah y = −x apa adanya. Gerakan yang tadinya tampak miring ternyata sangat sederhana kalau dilihat dari sumbu yang tepat.</p>

<h2>Dua fakta cepat</h2>
<ul><li>Hasil kali nilai eigen = determinan: 3 × 1 = 3 = 2·2 − 1·1.</li>
<li>Jumlah nilai eigen = jumlah diagonal (trace): 3 + 1 = 4 = 2 + 2.</li></ul>
<p>Untuk matriks simetris (seperti A, dan seperti matriks kovarians di 2.12), vektor-vektor eigennya selalu saling tegak lurus dan nilai eigennya selalu real. Inilah alasan PCA (2.8) bekerja dengan rapi.</p>

<h2>Dikalikan berulang: eigen terbesar menang</h2>
<p>Kalikan sebuah vektor dengan A berulang-ulang. Komponen di arah eigen λ = 3 dikali 3 setiap kali, komponen di arah λ = 1 tetap. Setelah beberapa langkah, arah λ = 3 mendominasi:</p>
<div class="tbl"><table><tr><th>langkah</th><td>1</td><td>2</td><td>3</td><td>5</td></tr>
<tr><th>arah (dinormalkan)</th><td>(0,89; 0,45)</td><td>(0,78; 0,62)</td><td>(0,73; 0,68)</td><td>(0,71; 0,70)</td></tr></table></div>
<p>Mulai dari (1, 0), arahnya merayap ke (0,71; 0,71), yaitu (1, 1) yang dinormalkan. Trik ini disebut <b>iterasi pangkat</b>, dan gagasan yang sama dipakai untuk menghitung PageRank.</p>

<h2>Di AI: meledak atau menghilang</h2>
<p>RNN mengalikan hidden statenya dengan matriks bobot yang sama di setiap langkah waktu. Setelah 100 langkah, arah dengan |λ| = 1,1 diperbesar <span class="tx">1{,}1^{100} \approx 13.781</span> kali, sedangkan |λ| = 0,9 diperkecil menjadi <span class="tx">0{,}9^{100} \approx 0{,}00003</span>. Itulah exploding dan vanishing gradient dari sudut pandang eigen.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
A = np.array([[2, 1], [1, 2]])
vals, vecs = np.linalg.eigh(A)
print(vals)                     # [1. 3.]
print(A @ [1, 1], A @ [1, -1])  # [3 3] [ 1 -1]
v = np.array([1.0, 0.0])
for _ in range(5):
    v = A @ v; v = v / np.linalg.norm(v)
print(v.round(2))               # [0.71 0.7 ]
print(round(1.1**100), 0.9**100)  # 13781 2.6561398887587544e-05</code></pre>
`,
  src: [
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §4.2 “Eigenvalues and Eigenvectors” dan §4.4 “Eigendecomposition and Diagonalization”. Lokal.",
    "Strang, <i>Linear Algebra and Its Applications</i> (4e), §5.1 “Introduction” dan §5.3 “Difference Equations and Powers Aᵏ”. Lokal.",
    "Pascanu, Mikolov & Bengio (2013), “On the difficulty of training recurrent neural networks”, <i>ICML</i> (analisis eigen untuk exploding/vanishing gradient)."
  ]
};

/* ───────────────────────── 2.8 ───────────────────────── */
window.LESSONS["2.8"] = {
  title: "SVD dan PCA",
  pre: "2.7, 1.7 varians", min: 0,
  why: "Data nyata punya ratusan kolom, tapi informasinya sering hanya tinggal di beberapa arah. SVD menemukan arah-arah itu untuk matriks apa pun, dan PCA memakainya untuk meringkas data. Kompresi gambar, sistem rekomendasi, dan fine-tuning LoRA pada LLM semuanya berdiri di atas gagasan ini.",
  body: String.raw`
<h2>Setiap matriks = putar, regangkan, putar</h2>
<p>Eigen (2.7) hanya bekerja untuk matriks persegi, dan tidak selalu rapi. SVD (<i>singular value decomposition</i>) bekerja untuk <b>semua</b> matriks:</p>
<div class="tx d">A = U\,\Sigma\,V^{\top}</div>
<p>Dibaca dari kanan: <span class="tx">V^{\top}</span> memutar, Σ meregangkan sepanjang sumbu (angka-angka di diagonalnya disebut <b>nilai singular</b> σ₁ ≥ σ₂ ≥ … ≥ 0), lalu U memutar lagi. Gerakan linear yang paling rumit pun hanya tiga gerakan sederhana.</p>

<h2>Nilai singular = seberapa penting tiap arah</h2>
<div class="ex"><div class="q">A = [[3; 0]; [4; 5]] punya nilai singular √45 ≈ 6,71 dan √5 ≈ 2,24. Berapa persen "energi" A ada di arah pertama?</div>
<div class="step">Energi diukur dengan kuadrat nilai singular
σ₁² = 45, σ₂² = 5, total 50
45 ÷ 50</div>
<div class="ans">Jawaban: 90%</div></div>
<p>Kalau kita hanya menyimpan arah pertama (aproksimasi peringkat 1, <span class="tx">\sigma_1 u_1 v_1^{\top}</span>), kita kehilangan hanya 10% energi. Teorema Eckart–Young (1936) membuktikan: memotong SVD adalah cara <b>terbaik</b> menghampiri matriks dengan peringkat lebih kecil. Inilah dasar kompresi gambar: simpan beberapa σ terbesar, buang sisanya. LoRA memakai gagasan serupa: perubahan bobot LLM yang besar ditulis sebagai hasil kali dua matriks kurus berperingkat kecil.</p>

<h2>PCA: arah dengan sebaran terbesar</h2>
<p>Ambil data titik-titik (tinggi, berat) ratusan orang. Keduanya naik bersama, jadi titik-titik membentuk awan lonjong yang miring. PCA (<i>principal component analysis</i>) bertanya: ke arah mana awan ini paling melebar?</p>
<ol><li>Kurangi rata-rata tiap kolom, supaya awan berpusat di (0, 0).</li>
<li>Cari arah u yang membuat proyeksi titik-titik ke garis u punya varians (1.7) terbesar. Itu <b>komponen utama pertama</b>.</li>
<li>Komponen kedua: arah dengan varians terbesar berikutnya, tegak lurus yang pertama. Dan seterusnya.</li></ol>
<div class="rule">Komponen utama = <mark>vektor eigen matriks kovarians</mark> = vektor singular kanan V dari data yang sudah dipusatkan. Varians di tiap arah sebanding dengan σ².</div>
<p>Pearson (1901) merumuskan ini sebagai "garis yang paling dekat ke titik-titik", dan Hotelling (1933) sebagai arah varians terbesar. Keduanya ternyata soal yang sama: memaksimalkan sebaran di sepanjang garis sama dengan meminimalkan jarak titik ke garis.</p>

<h2>Contoh kecil</h2>
<p>Lima titik: (2; 1,9), (1; 1,1), (3; 3,2), (4; 3,8), (5; 5,1). Hampir di satu garis. PCA menemukan arah pertama ≈ (0,71; 0,71), dan arah itu memuat <b>99,7%</b> varians. Lima titik dua dimensi bisa diringkas menjadi lima angka saja (posisi sepanjang garis) dengan kehilangan 0,3%.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
A = np.array([[3, 0], [4, 5]])
print(np.linalg.svd(A)[1].round(2))     # [6.71 2.24]

D = np.array([[2, 1.9], [1, 1.1], [3, 3.2], [4, 3.8], [5, 5.1]])
Dc = D - D.mean(axis=0)                 # pusatkan
U, S, Vt = np.linalg.svd(Dc, full_matrices=False)
print(np.abs(Vt[0]).round(2))           # [0.71 0.71]
print((S**2 / (S**2).sum()).round(3))   # [0.997 0.003]</code></pre>
<p>Kenapa <code>np.abs</code>? Arah (−0,71; −0,71) adalah garis yang sama. SVD boleh mengembalikan tanda mana pun.</p>
`,
  src: [
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §4.5 “Singular Value Decomposition”, §4.6 “Matrix Approximation”, dan Bab 10 (§10.2 “Maximum Variance Perspective”, §10.3 “Projection Perspective”). Lokal.",
    "Eckart & Young (1936), “The approximation of one matrix by another of lower rank”, <i>Psychometrika</i>. Lokal.",
    "Pearson (1901), “On lines and planes of closest fit to systems of points in space”; Hotelling (1933), analisis komponen utama. Lokal.",
    "Hu dkk. (2021), “LoRA: Low-Rank Adaptation of Large Language Models”. Lokal."
  ]
};

/* ───────────────────────── 2.9 ───────────────────────── */
window.LESSONS["2.9"] = {
  title: "Variabel acak dan distribusi",
  pre: "0.5 peluang, 2.4 integral", min: 0,
  why: "Model AI tidak pernah yakin 100%. Chatbot memilih kata berikutnya dari sebuah distribusi peluang, classifier mengeluarkan distribusi atas kelas, dan model difusi mengubah distribusi noise menjadi distribusi gambar. Distribusi adalah bahasa ketidakpastian, dan AI modern berbicara dalam bahasa itu.",
  body: String.raw`
<h2>Variabel acak: angka yang belum ketahuan</h2>
<p>Lempar dadu. Sebelum dadu berhenti, hasilnya belum diketahui, tapi kita tahu kemungkinannya. <b>Variabel acak</b> X adalah angka hasil percobaan acak, ditulis dengan huruf besar. <span class="tx">P(X = 3) = 1/6</span> dibaca "peluang X bernilai 3".</p>
<p><b>Distribusi</b> X adalah daftar lengkap: nilai apa saja yang mungkin, dan seberapa mungkin masing-masing. Syaratnya cuma dua: tiap peluang ≥ 0, dan totalnya 1.</p>

<h2>Diskret: binomial</h2>
<p>Lempar koin 3 kali dan hitung banyaknya gambar (G). Dari 0.5 kamu tahu ada 8 hasil yang sama mungkin. Hitung berapa hasil untuk tiap jumlah G:</p>
<div class="tbl"><table><tr><th>banyak G</th><td>0</td><td>1</td><td>2</td><td>3</td></tr>
<tr><th>hasil</th><td>AAA</td><td>GAA, AGA, AAG</td><td>GGA, GAG, AGG</td><td>GGG</td></tr>
<tr><th>peluang</th><td>1/8</td><td>3/8</td><td>3/8</td><td>1/8</td></tr></table></div>
<p>Ini distribusi <b>binomial</b>: n percobaan, masing-masing berhasil dengan peluang p. Rumus umumnya:</p>
<div class="tx d">P(X = k) = \binom{n}{k}\,p^k\,(1-p)^{n-k}</div>
<p><span class="tx">\binom{n}{k}</span> dibaca "n pilih k": banyaknya cara memilih k percobaan yang berhasil dari n. Rumusnya memakai <b>faktorial</b>: n! (dibaca "n faktorial") = 1 × 2 × 3 × … × n, misalnya 5! = 120. Lalu</p>
<div class="tx d">\binom{n}{k} = \frac{n!}{k!\,(n-k)!}</div>
<p>Contoh: (10 pilih 5) = 10! ÷ (5! × 5!) = 3.628.800 ÷ (120 × 120) = 252. Di Python: <code>math.comb(10, 5)</code>.</p>
<div class="ex"><div class="q">Lempar koin 10 kali. Peluang tepat 5 gambar?</div>
<div class="step">(10 pilih 5) = 252
252 × 0,5⁵ × 0,5⁵ = 252 ÷ 1024</div>
<div class="ans">Jawaban: ≈ 0,246. Hasil "paling mungkin" pun hanya terjadi sekitar seperempat waktu.</div></div>

<h2>Kontinu: kepadatan dan luas</h2>
<p>Tinggi badan bisa bernilai berapa saja dalam satu rentang. Untuk variabel seperti ini, kita memakai <b>fungsi kepadatan</b> p(x), dan peluang adalah luas di bawahnya (integral dari 2.4). Tingginya kurva bukan peluang, melainkan "kepadatan" peluang di sekitar titik itu.</p>

<h2>Distribusi normal</h2>
<p>Bentuk lonceng yang paling terkenal:</p>
<div class="tx d">p(x) = \frac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}</div>
<p>μ (mu) menentukan letak puncak, σ menentukan lebar. Aturan praktisnya:</p>
<div class="rule"><mark>68% data jatuh dalam ±1σ dari μ, 95% dalam ±2σ, 99,7% dalam ±3σ.</mark></div>
<p>Kenapa normal muncul di mana-mana? <b>Teorema limit pusat</b>: jumlah banyak pengaruh acak kecil yang saling bebas cenderung berdistribusi normal, apa pun distribusi aslinya. Tinggi badan dipengaruhi banyak gen dan faktor gizi, jadi bentuknya mendekati lonceng. Di AI, bobot jaringan saraf sering diinisialisasi dari distribusi normal, dan model difusi menambahkan noise normal ke gambar.</p>

<h2>Periksa dengan Python</h2>
<pre><code>from math import comb, erf, sqrt
print([comb(3, k) / 8 for k in range(4)])   # [0.125, 0.375, 0.375, 0.125]
print(comb(10, 5) * 0.5**10)                # 0.24609375
for k in (1, 2, 3):                         # aturan 68-95-99,7
    print(k, round(erf(k / sqrt(2)), 4))
# 1 0.6827
# 2 0.9545
# 3 0.9973</code></pre>
`,
  src: [
    "Grinstead & Snell, <i>Introduction to Probability</i>, Bab 1 “Discrete Probability Distributions”, Bab 2 “Continuous Probability Densities”, dan Bab 5 “Distributions and Densities” (§5.1 “Important Distributions”, §5.2 “Important Densities”). Lokal (gratis).",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §6.2 “Discrete and Continuous Probabilities” dan §6.5 “Gaussian Distribution”. Lokal.",
    "Downey, <i>Think Stats</i> (repo lokal <code>AllenDowney__ThinkStats</code>), bab distribusi."
  ]
};

/* ───────────────────────── 2.10 ───────────────────────── */
window.LESSONS["2.10"] = {
  title: "Ekspektasi dan varians",
  pre: "2.9, 1.6, 1.7", min: 0,
  why: "Fungsi kesalahan AI adalah ekspektasi: rata-rata kesalahan atas semua data yang mungkin. SGD (gradient descent yang tiap langkahnya cuma memakai segenggam data acak, 3.1) menghampiri ekspektasi itu dengan rata-rata beberapa sampel, dan varians menjelaskan kenapa langkahnya bergoyang. Tanpa dua konsep ini kamu tidak bisa membaca satu pun rumus fungsi loss (fungsi kesalahan model).",
  body: String.raw`
<h2>Ekspektasi: rata-rata berbobot peluang</h2>
<p>Di 1.6 kamu menghitung rata-rata berbobot. Ekspektasi adalah rata-rata berbobot dengan <b>peluang</b> sebagai bobotnya:</p>
<div class="tx d">\mathbb{E}[X] = \sum_x x \, P(X = x)</div>
<div class="ex"><div class="q">Berapa ekspektasi satu lemparan dadu?</div>
<div class="step">(1 + 2 + 3 + 4 + 5 + 6) × 1/6 = 21/6</div>
<div class="ans">Jawaban: 3,5</div></div>
<p>Dadu tidak pernah menunjukkan 3,5. Ekspektasi bukan hasil yang "diharapkan muncul", tapi pusat massa distribusi: rata-rata jangka panjang kalau percobaan diulang sangat banyak (hukum bilangan besar, yang kamu lihat di widget koin 0.5). Untuk variabel kontinu, Σ diganti ∫: <span class="tx">\mathbb{E}[X] = \int x\,p(x)\,dx</span>.</p>

<h2>Sifat paling berguna: linear</h2>
<div class="rule"><mark><span class="tx">\mathbb{E}[aX + bY] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y]</span></mark>, selalu, bahkan kalau X dan Y saling bergantung.</div>
<p>Ekspektasi jumlah dua dadu langsung 3,5 + 3,5 = 7, tanpa mendaftar 36 kemungkinan.</p>

<h2>Varians: sebaran di sekitar ekspektasi</h2>
<p>Varians di 1.7 adalah rata-rata kuadrat selisih dari rata-rata. Versi peluangnya:</p>
<div class="tx d">\operatorname{Var}(X) = \mathbb{E}\bigl[(X - \mathbb{E}[X])^2\bigr]</div>
<div class="ex"><div class="q">Varians satu lemparan dadu?</div>
<div class="step">Selisih dari 3,5: −2,5  −1,5  −0,5  0,5  1,5  2,5
Kuadrat: 6,25  2,25  0,25  0,25  2,25  6,25 (jumlah 17,5)
17,5 × 1/6</div>
<div class="ans">Jawaban: 35/12 ≈ 2,92, simpangan baku ≈ 1,71</div></div>
<p>Untuk variabel yang <b>saling bebas</b>, varians juga bisa dijumlahkan: dua dadu punya varians 35/12 + 35/12 ≈ 5,83. Tapi hati-hati: <span class="tx">\operatorname{Var}(aX) = a^2 \operatorname{Var}(X)</span>, karena varians memakai kuadrat.</p>

<h2>Rata-rata sampel makin tenang</h2>
<p>Rata-rata dari n sampel bebas punya ekspektasi yang sama dengan satu sampel, tapi variansnya dibagi n:</p>
<div class="tx d">\operatorname{Var}\Bigl(\frac{1}{n}\sum_{i=1}^n X_i\Bigr) = \frac{\operatorname{Var}(X)}{n}</div>
<p>Inilah alasan SGD (Lapis 3) memakai mini-batch. Gradien dari satu data sangat bergoyang. Rata-rata dari 64 data punya varians 64 kali lebih kecil, simpangan bakunya 8 kali lebih kecil, tapi masih jauh lebih murah daripada menghitung seluruh data.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
d = np.arange(1, 7)
print(d.mean(), ((d - d.mean())**2).mean())   # 3.5 2.9166666666666665
rng = np.random.default_rng(0)
r = rng.integers(1, 7, size=100_000)          # 100 ribu lemparan
print(r.mean().round(2), r.var().round(2))   # 3.5 2.91</code></pre>
`,
  src: [
    "Grinstead & Snell, <i>Introduction to Probability</i>, Bab 6 “Expected Value and Variance”. Lokal (gratis).",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §6.4 “Summary Statistics and Independence”. Lokal.",
    "Bottou, Curtis & Nocedal (2018), “Optimization Methods for Large-Scale Machine Learning”, <i>SIAM Review</i> (varians gradien mini-batch). Lokal."
  ]
};

/* ───────────────────────── 2.11 ───────────────────────── */
window.LESSONS["2.11"] = {
  title: "Teorema Bayes",
  pre: "0.5 peluang, 2.9", min: 0,
  why: "Bayes adalah aturan untuk memperbarui keyakinan ketika bukti baru datang. Filter spam, diagnosis medis berbantuan AI, dan seluruh cabang machine learning Bayesian dibangun di atasnya. Ia juga melatih intuisi yang sering salah: hasil tes positif tidak berarti kamu pasti sakit.",
  body: String.raw`
<h2>Peluang bersyarat</h2>
<p><span class="tx">P(A \mid B)</span> dibaca "peluang A, <b>jika diketahui</b> B". Garis tegak itu berarti kita hanya melihat dunia tempat B terjadi.</p>
<div class="tx d">P(A \mid B) = \frac{P(A \text{ dan } B)}{P(B)}</div>
<p>Contoh: dari satu dadu, P(angka 6 | genap) = (1/6) ÷ (3/6) = 1/3. Begitu kita tahu hasilnya genap, tinggal tiga kemungkinan, dan 6 salah satunya.</p>

<h2>Membalik arah syarat</h2>
<p>Seringnya kita tahu <span class="tx">P(\text{bukti} \mid \text{sebab})</span> tapi ingin <span class="tx">P(\text{sebab} \mid \text{bukti})</span>. Teorema Bayes membaliknya:</p>
<div class="tx d">P(H \mid D) = \frac{P(D \mid H)\,P(H)}{P(D)}</div>
<ul><li><b>P(H)</b>: <i>prior</i>, keyakinan sebelum melihat bukti.</li>
<li><b>P(D | H)</b>: <i>likelihood</i>, seberapa cocok bukti kalau hipotesis benar.</li>
<li><b>P(H | D)</b>: <i>posterior</i>, keyakinan setelah melihat bukti.</li></ul>

<h2>Contoh klasik: tes penyakit</h2>
<div class="ex"><div class="q">Penyakit diderita 1% orang. Tes mendeteksi 90% penderita, tapi juga positif palsu pada 5% orang sehat. Kamu positif. Berapa peluang kamu benar-benar sakit?</div>
<div class="step">Bayangkan 1000 orang:
Sakit 10 orang → positif 90% = 9 orang
Sehat 990 orang → positif palsu 5% = 49,5 orang
Dari semua yang positif (58,5), yang sakit hanya 9
9 ÷ 58,5</div>
<div class="ans">Jawaban: ≈ 15%. Bukan 90%.</div></div>
<p>Banyak orang, termasuk dokter dalam berbagai penelitian, menebak jauh lebih tinggi. Kesalahannya: lupa bahwa penyakitnya langka. Karena orang sehat jauh lebih banyak, 5% dari mereka tetap menghasilkan lebih banyak positif palsu daripada positif asli. Prior itu penting.</p>
<div class="rule">Cara aman memakai Bayes: <mark>ubah peluang jadi jumlah orang</mark> (frekuensi alami), lalu hitung.</div>

<h2>Bukti kedua</h2>
<p>Posterior hari ini menjadi prior besok. Kalau kamu tes ulang dan positif lagi (dan hasil kedua tes saling bebas), prior baru 15% naik menjadi sekitar 77%. Keyakinan bergerak bertahap mengikuti bukti. Itulah cara berpikir Bayesian, dan itulah yang dilakukan filter spam setiap kali melihat satu kata lagi.</p>

<h2>Periksa dengan Python</h2>
<pre><code>prior, sens, fp = 0.01, 0.90, 0.05
post = sens * prior / (sens * prior + fp * (1 - prior))
print(round(post, 4))      # 0.1538
post2 = sens * post / (sens * post + fp * (1 - post))
print(round(post2, 4))     # 0.766</code></pre>
`,
  src: [
    "Grinstead & Snell, <i>Introduction to Probability</i>, Bab 4 “Conditional Probability”, bagian “Bayes Probabilities”. Lokal (gratis).",
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §6.3 “Sum Rule, Product Rule, and Bayes’ Theorem”. Lokal.",
    "Bayes (1763), “An Essay towards solving a Problem in the Doctrine of Chances”. Lokal.",
    "Gigerenzer & Hoffrage (1995), “How to improve Bayesian reasoning without instruction: frequency formats”, <i>Psychological Review</i> 102(4)."
  ]
};

/* ───────────────────────── 2.12 ───────────────────────── */
window.LESSONS["2.12"] = {
  title: "Distribusi bersama dan kovarians",
  pre: "2.10, 2.11, 1.7", min: 0,
  why: "Data AI hampir selalu punya banyak kolom yang saling terkait: piksel bertetangga mirip, kata-kata muncul berpasangan. Distribusi bersama dan kovarians mengukur keterkaitan itu. Matriks kovarians adalah bahan baku PCA, distribusi normal multivariat, dan banyak model generatif.",
  body: String.raw`
<h2>Dua variabel sekaligus</h2>
<p><b>Distribusi bersama</b> <span class="tx">P(X = x, Y = y)</span> memberi peluang untuk setiap pasangan nilai. Contoh: X = cuaca (cerah/hujan), Y = bawa payung (ya/tidak). Dari tabel bersama, kamu bisa mendapatkan distribusi masing-masing (disebut <b>marginal</b>) dengan menjumlahkan baris atau kolom:</p>
<div class="tx d">P(X = x) = \sum_y P(X = x, Y = y)</div>
<p>X dan Y <b>saling bebas</b> kalau <span class="tx">P(x, y) = P(x)\,P(y)</span> untuk semua pasangan: mengetahui yang satu tidak memberi informasi tentang yang lain.</p>

<h2>Kovarians: naik bersama atau berlawanan?</h2>
<div class="tx d">\operatorname{Cov}(X, Y) = \mathbb{E}\bigl[(X - \mathbb{E}X)(Y - \mathbb{E}Y)\bigr]</div>
<p>Kalau X di atas rata-rata cenderung bersamaan dengan Y di atas rata-rata, hasil kali selisihnya positif, dan kovariansnya positif. Kalau berlawanan, negatif. Kalau tidak ada pola, mendekati nol.</p>
<div class="ex"><div class="q">x = [1, 2, 3, 4, 5], y = [2, 4, 5, 4, 5]. Hitung kovariansnya.</div>
<div class="step">Rata-rata: x̄ = 3, ȳ = 4
Selisih x: −2  −1  0  1  2
Selisih y: −2   0  1  0  1
Hasil kali: 4  0  0  0  2 (jumlah 6)
6 ÷ 5</div>
<div class="ans">Jawaban: 1,2 (positif: naik bersama)</div></div>

<h2>Korelasi: kovarians tanpa satuan</h2>
<p>Kovarians bergantung satuan: tinggi dalam cm memberi angka 100 kali lebih besar daripada dalam meter. Bagi dengan kedua simpangan baku, dan hasilnya selalu antara −1 dan 1:</p>
<div class="tx d">\rho = \frac{\operatorname{Cov}(X,Y)}{\sigma_X\,\sigma_Y}</div>
<p>Untuk data di atas, <span class="tx">\rho = 1{,}2 \div (1{,}414 \times 1{,}095) \approx 0{,}77</span>: hubungan positif yang cukup kuat. ρ = 1 berarti semua titik tepat di satu garis naik.</p>
<div class="rule">Peringatan: <mark>korelasi nol tidak berarti saling bebas</mark>. Titik-titik di parabola y = x² (x simetris di sekitar 0) punya korelasi 0, padahal y sepenuhnya ditentukan x. Korelasi hanya menangkap hubungan <b>garis lurus</b>.</div>

<h2>Matriks kovarians</h2>
<p>Untuk data dengan d kolom, kumpulkan semua kovarians berpasangan dalam matriks d × d. Diagonalnya adalah varians tiap kolom, sisanya kovarians antarkolom. Matriks ini simetris, jadi vektor eigennya saling tegak lurus (2.7). Vektor eigen itulah komponen utama PCA (2.8), dan matriks ini pula yang menentukan bentuk "lonceng miring" distribusi normal multivariat.</p>

<h2>Periksa dengan Python</h2>
<pre><code>import numpy as np
x = np.array([1, 2, 3, 4, 5]); y = np.array([2, 4, 5, 4, 5])
print(round(np.cov(x, y, bias=True)[0, 1], 4))   # 1.2
print(round(np.corrcoef(x, y)[0, 1], 2))         # 0.77
t = np.array([-2, -1, 0, 1, 2])
print(np.corrcoef(t, t**2)[0, 1])                # 0.0</code></pre>
`,
  src: [
    "Deisenroth, Faisal & Ong, <i>Mathematics for Machine Learning</i>, §6.4 “Summary Statistics and Independence” (kovarians, korelasi, matriks kovarians). Lokal.",
    "Grinstead & Snell, <i>Introduction to Probability</i>, Bab 6 “Expected Value and Variance”. Lokal (gratis).",
    "Wasserman, <i>All of Statistics</i>, Bab 3 “Expectation” (kovarians dan korelasi). Lokal."
  ]
};
