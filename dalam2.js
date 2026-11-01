/* Pendalaman Lapis 2. Format sama dengan dalam.js: viz, deep, salah, ringkas, uji. */
window.DALAM = window.DALAM || {};
Object.assign(window.DALAM, {

"2.1": { viz: "deriv",
deep: String.raw`<p>Definisi limit yang ketat (dari Cauchy dan Weierstrass, abad ke-19) berbunyi: "untuk setiap toleransi ε &gt; 0 ada jarak δ &gt; 0 sehingga kalau h lebih dekat dari δ ke 0, hasilnya lebih dekat dari ε ke limit." Kalimat ini menggantikan "sangat kecil" yang samar dengan permainan tantang-jawab: kamu sebut seberapa dekat, aku tunjukkan seberapa kecil h harus dibuat.</p>
<p>Tidak semua fungsi punya turunan di setiap titik. |x| punya sudut lancip di 0: dari kiri kemiringannya −1, dari kanan +1, jadi limitnya tidak ada. ReLU, max(0, x), punya sudut yang sama. Dalam praktik, pustaka AI memilih saja salah satu nilai (biasanya 0) di titik itu, dan pelatihan tetap berjalan karena peluang tepat mendarat di 0 hampir nol.</p>
<p>Turunan kedua f'' adalah turunan dari turunan: laju perubahan kemiringan, atau <b>kelengkungan</b>. Untuk x² nilainya 2 di mana-mana: mangkuk yang melengkung sama rata. Metode optimasi orde kedua (Newton) memakai kelengkungan untuk menentukan seberapa besar langkah yang aman.</p>`,
salah: ["Mengira turunan adalah f(x+h) − f(x). Itu perubahan nilai; turunan adalah perubahan dibagi h, lalu h dikecilkan.", "Mengira f'(x) = 0 pasti titik terendah. Bisa juga titik tertinggi, atau titik datar seperti x³ di 0."],
ringkas: ["Turunan = limit kemiringan garis potong saat h → 0 = kemiringan garis singgung.", "d/dx xⁿ = n xⁿ⁻¹; turunan jumlahan = jumlahan turunan.", "Tanda turunan memberi arah: positif naik, negatif turun, nol datar."],
uji: ["Tanpa melihat catatan, tulis definisi turunan dan jelaskan arti setiap bagiannya.", "Hitung turunan f(x) = 5x⁴ − x² + 3 dan tentukan di x berapa saja kemiringannya nol."] },

"2.2": { viz: "chain",
deep: String.raw`<p>Kenapa laju dikalikan, bukan dijumlah? Tulis perubahan kecil: Δu ≈ (du/dx)·Δx dan Δy ≈ (dy/du)·Δu. Substitusikan yang pertama ke yang kedua: Δy ≈ (dy/du)·(du/dx)·Δx. Bagi dengan Δx, lalu kecilkan. Notasi Leibniz membuatnya tampak seperti "du dicoret", dan meskipun itu bukan pecahan sungguhan, intuisinya benar.</p>
<p>Untuk fungsi dengan banyak input dan output, aturan rantai menjadi perkalian matriks turunan (matriks Jacobian: tabel berisi turunan setiap output terhadap setiap input; baris ke-i, kolom ke-j berisi ∂output<sub>i</sub>/∂input<sub>j</sub>). Mode mundur (backpropagation) mengalikan dari kiri, mulai dari satu angka kesalahan; mode maju mengalikan dari kanan, mulai dari input. Karena kesalahan hanya satu angka sedangkan bobotnya jutaan, mode mundur jauh lebih murah. Rumelhart, Hinton & Williams (1986) mempopulerkan cara ini untuk jaringan saraf.</p>
<p>Gradien yang lenyap bukan satu-satunya masalah: kalau tiap turunan lokal lebih besar dari 1, hasil kalinya meledak. Inisialisasi bobot yang hati-hati (Glorot 2010, He 2015), normalisasi, dan skip connection (ResNet) semuanya dirancang supaya hasil kali panjang ini tetap dekat dengan 1.</p>`,
salah: ["Lupa menghitung turunan fungsi luar di nilai dalam: d/dx (2x+1)² bukan 2x·2, melainkan 2(2x+1)·2.", "Menjumlahkan turunan lokal, padahal aturan rantai mengalikannya."],
ringkas: ["dy/dx = dy/du · du/dx: laju di sepanjang rantai dikalikan.", "Backpropagation = aturan rantai yang dihitung dari belakang, biayanya sekitar satu lintasan maju.", "Hasil kali banyak turunan kecil → gradien lenyap; banyak turunan besar → meledak."],
uji: ["Hitung turunan y = (3x − 2)⁴ di x = 1 dengan aturan rantai, lalu cek dengan menghitung (f(1,001) − f(1)) ÷ 0,001.", "Jelaskan dengan kalimatmu sendiri kenapa sigmoid bertumpuk menyebabkan gradien lenyap."] },

"2.3": { viz: "grad",
deep: String.raw`<p>Kenapa gradien menunjuk arah naik paling curam? Turunan ke arah satuan u (turunan berarah) adalah ∇f · u. Dari 1.8, hasil kali titik dua vektor = panjang × panjang × cos sudut. Karena |u| = 1, nilainya |∇f| cos θ, paling besar saat θ = 0, yaitu saat u searah ∇f. Paling kecil (paling negatif) saat u berlawanan arah. Tegak lurus (θ = 90°) memberi nol: di sepanjang garis kontur, ketinggian tidak berubah.</p>
<p>Lembah f = x² + 3y² lebih curam ke arah y. Akibatnya −∇f tidak menunjuk lurus ke dasar, dan gradient descent berzig-zag kalau learning rate besar. Dengan η &gt; 1/3, langkah di arah y melompati dasar dan membesar (karena 1 − 6η &lt; −1). Masalah lembah sempit seperti ini adalah alasan munculnya momentum dan Adam (Lapis 3).</p>`,
salah: ["Melangkah searah gradien untuk mencari minimum. Gradien menunjuk ke atas; turun berarti melangkah ke −∇f.", "Mengira gradien menunjuk langsung ke titik terendah. Ia hanya menunjuk arah tercuram di titik itu."],
ringkas: ["Turunan parsial: geser satu variabel, bekukan yang lain.", "∇f mengumpulkan semua turunan parsial; menunjuk arah naik paling curam, tegak lurus kontur.", "Satu langkah gradient descent: baru = lama − η∇f."],
uji: ["Hitung ∇f untuk f(x, y) = x²y + y³ di titik (1, 2).", "Dari (2, 1) di f = x² + 3y², lakukan dua langkah dengan η = 0,1 dan catat ketinggian setelah tiap langkah."] },

"2.4": { viz: "riemann",
deep: String.raw`<p>Teorema dasar kalkulus menyatukan dua soal yang tampak tak berhubungan: kemiringan (turunan) dan luas (integral). Gagasannya: kalau A(x) adalah luas di bawah f dari a sampai x, menambah x sedikit sebesar h menambah luas sekitar f(x)·h (satu persegi panjang tipis). Jadi laju perubahan luas adalah f(x): A' = f. Luas adalah fungsi yang turunannya f.</p>
<p>Banyak integral tidak punya closed form (rumus jadi). Contoh terkenal: ∫ e^(−x²) dx, inti distribusi normal. Untuk itu komputer memakai aturan numerik (trapesium, Simpson) atau simulasi Monte Carlo: ambil titik acak, rata-ratakan nilainya. Monte Carlo dipakai di mana-mana di AI, karena galatnya mengecil seperti 1/√n tanpa peduli berapa dimensinya.</p>`,
salah: ["Mengira tinggi kurva kepadatan p(x) adalah peluang. Peluang adalah luas; tinggi kurva bisa lebih dari 1.", "Lupa bahwa luas di bawah sumbu x dihitung negatif dalam integral."],
ringkas: ["Integral = limit jumlah Riemann Σ f(xᵢ)Δx.", "Teorema dasar: ∫ₐᵇ f dx = F(b) − F(a), dengan F' = f.", "Untuk data kontinu, peluang = luas di bawah kepadatan; luas total = 1."],
uji: ["Hampiri ∫₀² x dx dengan 4 persegi panjang ujung kanan, lalu bandingkan dengan luas segitiga.", "Hitung ∫₁³ 3x² dx memakai teorema dasar kalkulus."] },

"2.5": { viz: "matrix",
deep: String.raw`<p>Kenapa kolom matriks sudah cukup untuk menentukan seluruh gerakan? Karena linearitas: setiap vektor (x, y) adalah x·e₁ + y·e₂, jadi A(x, y) = x·Ae₁ + y·Ae₂. Begitu kamu tahu ke mana dua sumbu pergi, semua titik lain ikut. Untuk ruang n dimensi, n kolom menentukan segalanya.</p>
<p>Determinan negatif berarti orientasi terbalik: urutan "e₁ lalu e₂ berlawanan jarum jam" menjadi searah jarum jam, seperti melihat bayangan di cermin. Di tiga dimensi, determinan adalah faktor volume. Dalam model generatif normalizing flow, determinan dipakai untuk menghitung bagaimana kepadatan peluang berubah saat ruang diregangkan: kalau luas berlipat dua, kepadatan harus setengahnya.</p>`,
salah: ["Mengira matriks diterapkan per baris pada gambar. Lebih mudah dibaca per kolom: kolom = tujuan sumbu.", "Mengira det = 0 berarti matriksnya nol. Matriks [[1; 2]; [0; 0]] tidak nol, tapi memipihkan bidang ke satu garis."],
ringkas: ["Matriks = transformasi linear: garis tetap garis, titik asal tetap.", "Kolom ke-j adalah ke mana sumbu ke-j dikirim.", "det = faktor luas; det = 0 memipihkan, det < 0 mencerminkan."],
uji: ["Tulis matriks yang mencerminkan bidang terhadap sumbu y, lalu hitung determinannya.", "Ke mana persegi satuan dikirim oleh [[1; 0]; [2; 1]]? Gambar, lalu cek luasnya dengan determinan."] },

"2.6": { viz: "matmul",
deep: String.raw`<p>Rumus "baris kali kolom" bukan aturan sembarangan. Kolom ke-j dari BA adalah ke mana BA mengirim eⱼ: A mengirimnya ke kolom ke-j dari A, lalu B mengirim vektor itu ke B × (kolom ke-j dari A). Setiap entri hasilnya otomatis menjadi perkalian titik baris B dengan kolom A.</p>
<p>Untuk menyelesaikan Ax = b, komputer memakai eliminasi Gauss (faktorisasi LU), dengan biaya sekitar n³ operasi untuk matriks n × n. Menghitung A⁻¹ lalu mengalikan dengan b membutuhkan kerja lebih banyak dan memperbesar galat pembulatan. Golub &amp; Van Loan dan Higham membahas ini panjang lebar: aturan praktisnya, hampir tidak pernah ada alasan untuk menghitung invers secara eksplisit.</p>
<p>Matriks yang hampir singular (det mendekati 0) membuat jawaban sangat peka terhadap gangguan kecil pada b. Ukurannya disebut bilangan kondisi. Di regresi, kolom data yang hampir sama (multikolinearitas) menghasilkan matriks seperti ini, dan koefisien yang ditemukan menjadi tidak stabil.</p>`,
salah: ["Mengira AB = BA seperti perkalian bilangan biasa.", "Menulis (AB)⁻¹ = A⁻¹B⁻¹. Yang benar B⁻¹A⁻¹: untuk membatalkan 'pakai baju lalu jaket', lepas jaket dulu."],
ringkas: ["BA = lakukan A dulu, lalu B; dibaca dari kanan ke kiri.", "Perkalian matriks umumnya tidak komutatif.", "A⁻¹ ada hanya jika det A ≠ 0; dalam praktik pakai solve, bukan inv."],
uji: ["Hitung [[1; 2]; [3; 4]] × [[0; 1]; [1; 0]] dan sebaliknya. Apa yang dilakukan matriks kedua pada kolom atau baris?", "Selesaikan 3x + y = 7, x + 2y = 4 dengan rumus invers 2 × 2."] },

"2.7": { viz: "eigen",
deep: String.raw`<p>Cara mencari nilai eigen dengan tangan: Av = λv berarti (A − λI)v = 0. Supaya ada v yang bukan nol, matriks A − λI harus memipihkan ruang, jadi det(A − λI) = 0. Untuk A = [[2; 1]; [1; 2]]: (2 − λ)² − 1 = 0, sehingga λ = 1 atau λ = 3. Persamaan ini disebut persamaan karakteristik.</p>
<p>Kalau A punya n vektor eigen yang bebas, A bisa ditulis A = SΛS⁻¹ (diagonalisasi), dengan Λ diagonal berisi nilai eigen. Akibatnya Aᵏ = SΛᵏS⁻¹: memangkatkan matriks jadi memangkatkan angka-angka di diagonal. Itulah alasan nilai eigen menentukan apakah sebuah sistem berulang (populasi, RNN, rantai Markov di Lapis 3) tumbuh, meluruh, atau stabil.</p>
<p>Putaran 90° tidak punya arah eigen real, tapi punya nilai eigen kompleks ±i. (Bilangan i adalah bilangan yang kuadratnya −1: i² = −1. Tidak ada bilangan biasa yang begitu, jadi matematikawan menambahkannya; bilangan kompleks berbentuk a + bi.) Bilangan kompleks muncul justru di sistem yang berputar atau berosilasi. Model SSM seperti S4 (Lapis 5) memakai nilai eigen kompleks untuk mengingat pola berulang dalam deret panjang.</p>`,
salah: ["Mengira setiap vektor yang diregangkan adalah vektor eigen. Syaratnya arahnya tidak berubah sama sekali (atau tepat berbalik, kalau λ negatif).", "Mengira nilai eigen selalu positif atau selalu real."],
ringkas: ["Av = λv: v tidak dibelokkan, hanya diregangkan λ kali.", "Hasil kali nilai eigen = det, jumlahnya = trace.", "Matriks simetris: nilai eigen real, vektor eigen saling tegak lurus."],
uji: ["Cari nilai eigen [[4; 1]; [2; 3]] dari persamaan karakteristik, lalu cek dengan trace dan determinan.", "Jelaskan kenapa matriks dengan nilai eigen 1,2 membuat sistem berulang meledak."] },

"2.8": { viz: "pca",
deep: String.raw`<p>Hubungan SVD dan eigen: AᵀA adalah matriks simetris, dan vektor eigennya adalah kolom V, dengan nilai eigen σ². Jadi SVD selalu ada dan selalu memberi arah yang saling tegak lurus, bahkan untuk matriks persegi panjang. Untuk data yang sudah dipusatkan X (n baris), matriks kovariansnya XᵀX/n, sehingga komponen utama = V, dan varians tiap komponen = σ²/n.</p>
<p>PCA bersifat linear dan peka skala. Kalau satu kolom dalam rupiah dan yang lain dalam juta rupiah, kolom pertama mendominasi hanya karena angkanya besar. Karena itu data biasanya distandarkan dulu (dikurangi rata-rata, dibagi simpangan baku). Untuk struktur yang melengkung, ada perluasan nonlinear seperti kernel PCA, t-SNE, UMAP, dan autoencoder (Lapis 5).</p>
<p>Berapa komponen yang disimpan? Aturan praktis: lihat persentase varians kumulatif dan berhenti ketika tambahan komponen hanya menambah sedikit (grafik "siku"). Tidak ada angka ajaib; pilihan ini bergantung pada tujuan.</p>`,
salah: ["Lupa memusatkan data sebelum PCA, sehingga komponen pertama hanya menunjuk ke rata-rata.", "Menafsirkan komponen utama sebagai penyebab. PCA hanya meringkas sebaran, bukan menjelaskan sebab-akibat."],
ringkas: ["A = UΣVᵀ: setiap matriks = putar, regangkan, putar.", "Memotong SVD memberi aproksimasi peringkat rendah terbaik (Eckart–Young).", "PCA = SVD dari data yang dipusatkan; komponen = arah varians terbesar."],
uji: ["Tanpa rumus, jelaskan kenapa memaksimalkan varians proyeksi sama dengan meminimalkan jarak titik ke garis (petunjuk: Pythagoras).", "Sebuah dataset 100 kolom punya nilai singular yang kuadratnya 50, 30, 10, 5, lalu sangat kecil. Berapa komponen yang kamu simpan, dan berapa persen varians yang tertangkap?"] },

"2.9": { viz: "binom",
deep: String.raw`<p>Satu konsep yang menyatukan diskret dan kontinu adalah fungsi distribusi kumulatif F(x) = P(X ≤ x). Untuk dadu, F naik bertangga; untuk normal, F naik mulus berbentuk S. Kepadatan adalah turunan F, dan peluang rentang adalah F(b) − F(a): itulah teorema dasar kalkulus dari 2.4 dalam bahasa peluang.</p>
<p>Distribusi lain yang akan sering kamu temui: Bernoulli (satu percobaan ya/tidak, dasar klasifikasi biner), kategorikal (satu dari K pilihan, dasar keluaran softmax dan pemilihan token LLM), Poisson (banyaknya kejadian langka per satuan waktu), dan eksponensial (waktu tunggu). Masing-masing punya cerita asal-usulnya sendiri; menghafal rumus kurang berguna daripada mengenali ceritanya.</p>
<p>Teorema limit pusat punya syarat: pengaruhnya harus banyak, saling bebas, dan tidak ada satu pun yang mendominasi. Data dengan ekor tebal (pendapatan, ukuran kota, harga saham saat krisis) melanggar syarat ini, dan memaksakan model normal pada data seperti itu meremehkan peristiwa ekstrem.</p>`,
salah: ["Mengira semua data berdistribusi normal.", "Mengira kepadatan p(x) tidak boleh lebih dari 1. Yang harus 1 adalah luas totalnya."],
ringkas: ["Variabel acak = angka hasil percobaan acak; distribusi = daftar nilai dan peluangnya.", "Binomial: banyaknya berhasil dari n percobaan; P(X=k) = C(n,k) pᵏ(1−p)ⁿ⁻ᵏ.", "Normal: lonceng dengan μ dan σ; aturan 68–95–99,7; muncul karena teorema limit pusat."],
uji: ["Tulis distribusi banyaknya angka 6 dalam dua lemparan dadu (nilai 0, 1, 2 dan peluangnya), lalu cek totalnya 1.", "Kalau tinggi badan normal dengan μ = 165 cm dan σ = 7 cm, kira-kira berapa persen orang yang tingginya di atas 179 cm?"] },

"2.10": { viz: "dice",
deep: String.raw`<p>Rumus kerja yang sering lebih cepat: Var(X) = 𝔼[X²] − (𝔼[X])². Untuk dadu: 𝔼[X²] = (1+4+9+16+25+36)/6 = 91/6, dikurangi 3,5² = 12,25, hasilnya 35/12. Hati-hati memakai rumus ini di komputer: kalau 𝔼[X²] dan (𝔼X)² sama-sama sangat besar dan hampir sama, pengurangannya kehilangan digit (galat pembatalan).</p>
<p>Fungsi loss dalam machine learning adalah ekspektasi: L(θ) = 𝔼[ℓ(θ; data)]. Kita tidak tahu distribusi data yang sebenarnya, jadi kita memakai rata-rata atas data latih (risiko empiris). Selisih antara keduanya adalah inti persoalan generalisasi di Lapis 3: model bisa sangat bagus di rata-rata data latih tapi buruk di ekspektasi yang sebenarnya.</p>
<p>Ketidaksamaan Chebyshev memberi jaminan tanpa mengetahui bentuk distribusi: peluang X berada lebih dari k simpangan baku dari rata-rata paling besar 1/k². Untuk k = 2 paling banyak 25%, jauh lebih longgar daripada 5% untuk normal, tapi berlaku untuk distribusi apa pun.</p>`,
salah: ["Menjumlahkan simpangan baku dua variabel bebas. Yang dijumlahkan variansnya; simpangan baku = akar jumlah varians.", "Mengira Var(2X) = 2 Var(X). Yang benar 4 Var(X)."],
ringkas: ["𝔼[X] = Σ x P(x): pusat massa distribusi.", "Ekspektasi selalu linear; varians bisa dijumlah hanya untuk variabel saling bebas.", "Rata-rata n sampel: ekspektasi sama, varians dibagi n."],
uji: ["Hitung ekspektasi dan varians dari X yang bernilai 0 dengan peluang 0,7 dan 10 dengan peluang 0,3.", "Kenapa mini-batch 256 tidak 256 kali lebih akurat daripada mini-batch 1? Jawab dengan simpangan baku."] },

"2.11": { viz: "bayes",
deep: String.raw`<p>Penyebut P(D) dihitung dengan hukum peluang total: P(D) = P(D|H)P(H) + P(D|bukan H)P(bukan H). Itulah 58,5 orang positif dalam contoh: 9 dari yang sakit ditambah 49,5 dari yang sehat. Penyebut ini hanya memastikan semua posterior berjumlah 1, sehingga Bayes sering ditulis ringkas sebagai posterior ∝ likelihood × prior.</p>
<p>Bentuk "odds" lebih enak untuk bukti berturut-turut: odds posterior = odds prior × rasio likelihood. Untuk tes ini rasio likelihoodnya 0,90 / 0,05 = 18. Odds awal 1 : 99 menjadi 18 : 99 (≈ 15%), lalu setelah tes kedua menjadi 324 : 99 (≈ 77%). Dalam log-odds, setiap bukti cukup <b>ditambahkan</b>: cara kerja klasifier Naive Bayes untuk filter spam.</p>
<p>Prior bukan sekadar pendapat pribadi. Dalam contoh ini prior adalah prevalensi yang diukur dari populasi. Ketika prior memang tidak jelas, aturan praktisnya: pakai prior yang lebar, lalu cek apakah kesimpulan berubah banyak kalau prior diganti (analisis sensitivitas).</p>`,
salah: ["Menyamakan P(positif | sakit) dengan P(sakit | positif). Kesalahan ini cukup umum sampai punya nama: 'prosecutor's fallacy'.", "Mengabaikan prior (base rate neglect): menilai bukti tanpa memperhitungkan seberapa langka kejadiannya."],
ringkas: ["P(H|D) = P(D|H) P(H) / P(D): posterior ∝ likelihood × prior.", "Hitung dengan frekuensi alami (1000 orang) agar tidak tersesat.", "Posterior hari ini menjadi prior besok."],
uji: ["Ulangi contoh tes penyakit dengan prevalensi 10%. Berapa posterior setelah satu tes positif?", "Jelaskan kepada teman kenapa tes yang '90% akurat' bisa menghasilkan positif yang sebagian besar salah."] },

"2.12": { viz: "cov",
deep: String.raw`<p>Distribusi normal multivariat menuliskan lonceng di d dimensi dengan vektor rata-rata μ dan matriks kovarians Σ. Garis-garis kepadatan yang sama berbentuk elips; sumbu-sumbu elips mengikuti vektor eigen Σ, dan panjangnya sebanding dengan akar nilai eigen. Jadi seluruh bentuk awan data normal tertulis dalam satu matriks.</p>
<p>Korelasi tidak sama dengan sebab-akibat. Penjualan es krim dan kasus tenggelam berkorelasi positif karena keduanya dipengaruhi musim panas (variabel pengganggu atau confounder). Untuk menyimpulkan sebab, dibutuhkan eksperimen acak atau alat inferensi kausal (Pearl; Hernán &amp; Robins), bukan sekadar koefisien korelasi.</p>
<p>Kovarians sampel dengan pembagi n − 1 (bukan n) memberi taksiran tak bias untuk kovarians populasi. NumPy memakai n − 1 secara bawaan di <code>np.cov</code>; itulah alasan kode di atas menulis <code>bias=True</code> supaya cocok dengan hitungan tangan yang membagi n.</p>`,
salah: ["Mengira korelasi 0 berarti tidak ada hubungan apa pun. Hubungan melengkung bisa punya korelasi 0.", "Menyimpulkan sebab-akibat dari korelasi yang tinggi."],
ringkas: ["Distribusi bersama memberi peluang setiap pasangan; marginal = jumlah baris/kolom.", "Cov > 0 naik bersama, < 0 berlawanan; korelasi ρ = Cov/(σₓσᵧ) di antara −1 dan 1.", "Matriks kovarians simetris; vektor eigennya = komponen utama PCA."],
uji: ["Hitung kovarians dan korelasi x = [1, 2, 3], y = [3, 2, 1].", "Beri satu contoh dari kehidupan sehari-hari dua hal yang berkorelasi tanpa saling menyebabkan, dan sebutkan penyebab bersamanya."] }
});
