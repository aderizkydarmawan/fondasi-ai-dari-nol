/* Pendalaman Lapis 3. Format sama dengan dalam.js: viz, deep, salah, ringkas, uji. */
window.DALAM = window.DALAM || {};
Object.assign(window.DALAM, {

"3.1": { viz: "optim",
deep: String.raw`<p>Kenapa batas learning rate ditentukan lembah paling tajam? Untuk mangkuk <span class="tx">x^2 + 25y^2</span>, satu langkah GD mengalikan x dengan (1 − 2η) dan y dengan (1 − 50η). Arah y meledak kalau η &gt; 0,04, padahal arah x masih sangat lambat di η itu. Perbandingan kelengkungan paling tajam dan paling landai (di sini 25) disebut <b>bilangan kondisi</b>. Makin besar, makin lambat GD biasa, dan itulah masalah yang diatasi momentum dan Adam.</p>
<p>Dalam praktik, learning rate jarang dibuat tetap. Jadwal yang umum: naik pelan di awal (warmup), lalu turun mengikuti kurva kosinus. Langkah besar di awal untuk bergerak jauh, langkah kecil di akhir untuk mengendap di dasar. Ini juga syarat teori Robbins–Monro: jumlah langkah harus tak hingga, tapi jumlah kuadratnya terbatas.</p>
<p>Ukuran mini-batch juga tombol. Batch besar memberi gradien yang lebih halus dan memanfaatkan GPU dengan penuh, tapi tiap contoh data "dibayar" lebih mahal. Aturan praktis yang sering dipakai: kalau batch dikali k, learning rate juga dikali kira-kira k, dengan warmup.</p>`,
salah: ["Mengira learning rate lebih besar selalu lebih cepat. Lewat batas tertentu, loss justru naik dan meledak.", "Mengira SGD salah karena gradiennya acak. Ekspektasinya sama dengan gradien penuh; goyangannya bahkan sering membantu.", "Mengira Adam tidak perlu disetel. Learning rate Adam tetap tombol paling penting."],
ringkas: ["θ ← θ − η∇L. η terlalu kecil lambat, terlalu besar meledak.", "SGD: gradien dari mini-batch acak, murah dan cukup akurat.", "Momentum menumpuk arah yang konsisten; Adam membagi langkah dengan akar rata-rata kuadrat gradien per bobot."],
uji: ["Untuk L(w) = (w − 3)², di η berapa GD mulai meledak? Jelaskan dari faktor pengali (1 − 2η).", "Jelaskan dengan kata sendiri kenapa momentum membantu di lembah sempit."] },

"3.2": { viz: "mle",
deep: String.raw`<p>MLE punya sifat bagus kalau datanya banyak: ia <b>konsisten</b> (mendekati nilai sebenarnya), dan sebarannya mendekati normal dengan varians sekecil mungkin di antara penaksir sejenis (batas Cramér–Rao). Lebarnya ditentukan oleh kelengkungan log-likelihood di puncak: puncak yang tajam berarti data sangat menentukan parameter, puncak yang landai berarti banyak nilai sama masuk akalnya. Kelengkungan ini disebut <b>informasi Fisher</b>.</p>
<p>Tapi MLE bisa keliru kalau datanya sedikit. Lempar koin 3 kali, dapat 3 gambar: MLE berkata p = 1, alias koin tidak akan pernah memberi angka. Ini overfitting dalam bentuk paling murni, dan alasan prior (3.3) dan regularisasi diperlukan.</p>
<p>Penaksir varians MLE membagi dengan n, bukan n − 1. Hasilnya sedikit terlalu kecil rata-rata (bias), tapi selisihnya hilang ketika n besar. Ini contoh bahwa "paling mungkin" tidak sama dengan "tidak bias".</p>`,
salah: ["Mengira likelihood adalah peluang parameter benar. Likelihood adalah peluang data, dibaca sebagai fungsi parameter.", "Mengira log mengubah jawaban. Log hanya mengubah skala; letak puncaknya sama."],
ringkas: ["Likelihood L(θ) = peluang data yang sudah terlihat, sebagai fungsi θ.", "MLE = θ yang memaksimalkan L; dalam praktik minimalkan −log L.", "Derau normal → MSE; klasifikasi → cross-entropy."],
uji: ["Tuliskan log-likelihood untuk k gambar dari n lemparan dan turunkan bahwa MLE-nya k/n.", "Kenapa MLE dari 3 gambar dalam 3 lemparan adalah tebakan yang buruk?"] },

"3.3": { viz: "beta",
deep: String.raw`<p>Kenapa prior Beta dan likelihood binomial menghasilkan posterior Beta lagi? Prior Beta(a, b) sebanding dengan <span class="tx">p^{a-1}(1-p)^{b-1}</span>, likelihood dengan <span class="tx">p^h(1-p)^t</span>. Dikalikan, pangkatnya tinggal dijumlahkan. Pasangan seperti ini disebut <b>konjugat</b>. Untuk model yang lebih rumit tidak ada pasangan semudah itu, sehingga posterior dihitung dengan sampel (MCMC, 3.8) atau perkiraan (variational inference, dipakai di VAE 5.11).</p>
<p>Prediksi Bayes tidak memakai satu nilai p, tapi merata-ratakan atas seluruh posterior. Peluang lemparan berikutnya gambar = rata-rata posterior. Dengan prior datar dan h gambar dari n lemparan, hasilnya (h + 1)/(n + 2): aturan suksesi Laplace. Setelah 3 gambar dari 3 lemparan, Bayes berkata 0,8, bukan 1 seperti MLE.</p>
<p>Rentang dari posterior (credible interval) dibaca langsung: "dengan peluang 95%, p ada di sini, mengingat prior dan data." Interval kepercayaan klasik punya tafsiran yang lebih berbelit, tentang prosedur yang diulang-ulang.</p>`,
salah: ["Mengira prior membuat hasil subjektif sehingga tidak berguna. Prior ditulis terbuka dan pengaruhnya hilang ketika data banyak.", "Mengira posterior selalu berpuncak di MLE. Prior bisa menggeser puncaknya."],
ringkas: ["Posterior ∝ likelihood × prior.", "Beta(a, b) + h gambar, t angka → Beta(a + h, b + t).", "Data banyak menenggelamkan prior; regularisasi L2 = prior normal pada bobot."],
uji: ["Mulai dari Beta(2, 2), lalu lihat 1 gambar dan 4 angka. Tulis posteriornya dan rata-ratanya.", "Jelaskan dengan kata sendiri kenapa weight decay bisa disebut prior."] },

"3.4": { viz: "kl",
deep: String.raw`<p>Kenapa harus logaritma? Shannon meminta ukuran informasi yang memenuhi syarat wajar: dua kejadian bebas memberi informasi yang dijumlahkan. Peluangnya dikalikan, informasinya dijumlahkan, dan satu-satunya fungsi yang mengubah perkalian jadi penjumlahan adalah logaritma (1.5).</p>
<p>Asimetri KL penting dalam praktik. Meminimalkan <span class="tx">D_{\text{KL}}(p\|q)</span> terhadap q membuat q menutupi semua tempat p punya peluang (mode-covering), karena q yang nol di tempat p positif dihukum tak hingga. Meminimalkan <span class="tx">D_{\text{KL}}(q\|p)</span> membuat q memilih satu puncak saja (mode-seeking). VAE dan variational inference memakai arah kedua; distilasi dan MLE memakai arah pertama.</p>
<p>Di RLHF, model yang sedang dilatih diberi penalty KL terhadap model awalnya, supaya ia tidak menyimpang terlalu jauh demi mengejar skor reward. Informasi mutual, ukuran seberapa banyak satu variabel memberi tahu tentang variabel lain, juga sebuah KL: antara distribusi bersama dan hasil kali marginalnya.</p>`,
salah: ["Mengira KL adalah jarak. KL tidak simetris dan tidak memenuhi ketaksamaan segitiga.", "Lupa bahwa log 0 tak hingga. Model yang memberi peluang 0 pada jawaban benar mendapat loss tak hingga; itulah alasan softmax tidak pernah memberi tepat nol."],
ringkas: ["Entropi H(p) = −Σ p log p, ketidakpastian rata-rata.", "Cross-entropy H(p, q) = −Σ p log q; untuk label tunggal = −log q(benar).", "KL = H(p, q) − H(p) ≥ 0, tidak simetris."],
uji: ["Hitung entropi dadu enam sisi dalam bit.", "Jelaskan kenapa meminimalkan cross-entropy sama dengan meminimalkan KL."] },

"3.5": { viz: "overfit",
deep: String.raw`<p>Penguraian bias–varians bisa diturunkan dengan aljabar ekspektasi (2.10). Tulis tebakan model <span class="tx">\hat f</span>, rata-ratanya atas banyak sampel data <span class="tx">\bar f</span>, dan kebenaran f. Kuadrat <span class="tx">(\hat f - f)</span> dipecah lewat <span class="tx">\bar f</span>; suku silangnya bernilai nol rata-rata, sehingga yang tersisa bias² + varians. Ditambah derau data, keluarlah rumus tiga bagian.</p>
<p>Data dibagi tiga dalam praktik: <b>latih</b> untuk menyetel bobot, <b>validasi</b> untuk memilih ukuran model, learning rate, dan kapan berhenti, serta <b>uji</b> yang hanya dibuka sekali di akhir. Kalau data uji dipakai untuk memilih, ia diam-diam ikut "dilatih", dan angka akhirnya terlalu optimis. Kebocoran ini salah satu kesalahan paling umum dalam penelitian ML.</p>
<p>Untuk data deret waktu atau data spasial, pembagian acak sendiri sudah bocor: titik uji punya tetangga dekat di data latih. Pembagian harus mengikuti waktu atau wilayah.</p>`,
salah: ["Melaporkan akurasi data latih sebagai kemampuan model.", "Memilih model dengan melihat data uji berkali-kali, lalu melaporkan skor data uji itu."],
ringkas: ["Galat = bias² + varians + derau.", "Model kaku underfit, model lentur overfit; pilih dengan data validasi.", "Deep learning modern bisa menunjukkan double descent; gambaran U tidak lengkap."],
uji: ["Model punya galat latih 1% dan galat uji 30%. Underfit atau overfit? Apa tiga hal yang bisa kamu coba?", "Kenapa data uji tidak boleh dipakai untuk memilih derajat polinomial?"] },

"3.6": { viz: "conv",
deep: String.raw`<p>Dua pengaturan menentukan ukuran keluaran. <b>Padding</b> menambahkan nol di tepi sehingga keluaran sama panjang dengan masukan. <b>Stride</b> menggeser kernel lebih dari satu langkah, sehingga keluaran lebih pendek. Panjang keluaran = ⌊(n + 2·padding − k) / stride⌋ + 1. Untuk n = 7, k = 3, tanpa padding, stride 1: 5, seperti contoh di atas.</p>
<p>Gambar berwarna punya tiga kanal (merah, hijau, biru), jadi kernel CNN sebenarnya berukuran 3 × 3 × 3, menjumlahkan semua kanal sekaligus. Satu lapis memakai puluhan sampai ratusan kernel, masing-masing menghasilkan satu peta fitur. Setiap lapis yang lebih dalam melihat wilayah yang lebih luas dari gambar asli (receptive field).</p>
<p>Ada hubungan mendalam dengan Fourier: konvolusi dalam ruang sama dengan perkalian biasa dalam frekuensi. Itulah sebabnya konvolusi panjang dihitung cepat lewat FFT, dan beberapa model deret panjang (Hyena, S4) memanfaatkannya.</p>`,
salah: ["Mengira kernel CNN dirancang manusia. Kernel pendeteksi tepi di atas contoh rancangan; di CNN semua angka kernel dipelajari dengan gradient descent.", "Lupa bahwa tanpa padding keluaran mengecil di setiap lapis."],
ringkas: ["Konvolusi = geser kernel, kalikan titik, catat, ulangi.", "Kernel menentukan pola yang dicari: rata-rata menghaluskan, [−1, 0, 1] mencari tepi.", "CNN: lokal, bobot berbagi, ekuivarian geseran."],
uji: ["Hitung korelasi [1, 2, 3, 4, 5] dengan kernel [1, −1] tanpa padding.", "Berapa bobot satu kernel 5 × 5 untuk gambar RGB, tanpa bias?"] },

"3.7": { viz: "euler",
deep: String.raw`<p>Euler untuk <span class="tx">dy/dt = -ky</span> mengalikan y dengan (1 − kΔt) setiap langkah. Kalau kΔt &gt; 1, faktornya negatif dan y berganti tanda bolak-balik. Kalau kΔt &gt; 2, faktornya lebih dari 1 secara mutlak dan jawaban meledak, padahal yang sebenarnya meluruh ke nol. Ini <b>ketidakstabilan numerik</b>, dan ia sama persis dengan learning rate terlalu besar di 3.1: kalikan k dengan 2 dan Δt dengan η.</p>
<p>Galat Euler per satuan waktu sebanding dengan Δt (metode orde pertama): langkah dibagi dua, galat kira-kira terbagi dua. Runge–Kutta orde empat (RK4) membuat galat sebanding dengan Δt⁴: langkah dibagi dua, galat terbagi enam belas. Pustaka seperti SciPy memilih ukuran langkah sendiri berdasarkan perkiraan galat.</p>
<p>ODE dengan beberapa variabel (posisi dan kecepatan, populasi pemangsa dan mangsa) ditulis sebagai vektor: <span class="tx">d\mathbf{y}/dt = \mathbf{f}(\mathbf{y})</span>. Untuk sistem linear, <span class="tx">\mathbf{f}(\mathbf{y}) = A\mathbf{y}</span>, perilakunya ditentukan nilai eigen A (2.7): semua bagian real negatif berarti meluruh, ada yang positif berarti meledak, ada bagian imajiner berarti berputar. Model state space seperti Mamba dibangun dari sistem linear semacam ini.</p>`,
salah: ["Mengira Euler dengan langkah kecil selalu cukup. Untuk simulasi panjang galat menumpuk; untuk sistem kaku (stiff) langkahnya harus sangat kecil.", "Mengira ODE selalu punya rumus jawaban. Kebanyakan tidak; komputer yang menyelesaikannya."],
ringkas: ["ODE = aturan laju perubahan; jawabannya fungsi.", "dy/dt = −ky → y = y₀e^(−kt).", "Euler: y ← y + Δt·f(y); Δt terlalu besar → tidak stabil, sama dengan learning rate terlalu besar."],
uji: ["Pakai Euler dengan Δt = 0,5 untuk dy/dt = y, y(0) = 1, sampai t = 2. Bandingkan dengan e².", "Untuk dy/dt = −3y, berapa Δt maksimum supaya Euler tidak meledak?"] },

"3.8": { viz: "markov",
deep: String.raw`<p>Untuk rantai dua keadaan dengan peluang pindah a (cerah ke hujan) dan b (hujan ke cerah), distribusi stasionernya <span class="tx">\pi = \left[\tfrac{b}{a+b},\ \tfrac{a}{a+b}\right]</span>, dan nilai eigen keduanya 1 − a − b. Untuk matriks cuaca, a = 0,2 dan b = 0,4, sehingga π = [2/3, 1/3] dan nilai eigen kedua 0,4, persis seperti di atas. Kalau a + b mendekati 0, rantai lama sekali berada di satu keadaan dan lambat bercampur. Kalau a = b = 1, rantai berayun bolak-balik selamanya dan tidak pernah mengendap: contoh rantai periodik yang bukan ergodik.</p>
<p>Sebuah rantai dikatakan memenuhi <b>keseimbangan rinci</b> kalau arus dari i ke j sama dengan arus dari j ke i: <span class="tx">\pi_i P_{ij} = \pi_j P_{ji}</span>. Algoritma Metropolis–Hastings dibangun supaya syarat ini berlaku untuk distribusi target, sehingga target otomatis menjadi distribusi stasioner.</p>
<p>Rantai Markov dengan reward dan pilihan aksi adalah <b>proses keputusan Markov</b> (MDP), kerangka matematis reinforcement learning (5.14).</p>`,
salah: ["Mengira sifat Markov berarti masa lalu tidak penting. Masa lalu boleh penting, asalkan semua yang penting sudah termuat dalam keadaan sekarang.", "Mengira setiap rantai punya satu distribusi stasioner yang dicapai dari mana saja. Itu hanya untuk rantai ergodik."],
ringkas: ["Matriks transisi: baris = sekarang, kolom = berikutnya, setiap baris berjumlah 1.", "Distribusi setelah n langkah = x Pⁿ.", "Distribusi stasioner π P = π, vektor eigen dengan nilai eigen 1."],
uji: ["Untuk P = [[0,9; 0,1]; [0,5; 0,5]], cari distribusi stasionernya.", "Jelaskan bagaimana PageRank memakai distribusi stasioner."] }
});
